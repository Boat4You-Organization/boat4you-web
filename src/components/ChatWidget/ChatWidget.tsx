'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

import { getBoatImageUrl } from '@/utils/static/imageUtils';

import styles from './ChatWidget.module.scss';

const API = process.env.NEXT_PUBLIC_BOAT_WS_API_URL;
const TOKEN_KEY = 'b4y_chat_token';

interface ChatMessage {
  id: number;
  role: 'USER' | 'ASSISTANT' | 'ADMIN' | 'SYSTEM';
  content: string;
  payload: string | null;
}

interface YachtCard {
  name: string;
  slug: string;
  imageId: number;
  totalPriceEur: number;
  days: number;
  cabins: number;
  maxPersons: number;
  year: number;
  location: string;
  startDate: string;
  endDate: string;
}

/**
 * Site-wide AI concierge (Mario 19.7.2026): floating button -> chat panel.
 * The brain lives server-side (backend proxies Claude with live-fleet
 * tools); this widget only renders the transcript + yacht cards the
 * assistant attaches. If the backend reports the feature disabled (503 —
 * no API key configured) the button never renders, so the widget ships
 * dark. Polls for replies while a human agent owns the session.
 */
const ChatWidget = () => {
  const t = useTranslations('common.chatWidget');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState('AI');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const lastIdRef = useRef(0);
  // One transcript hydration per pageload — the mount effect may pre-set the
  // token for the presence heartbeat, so "token exists" no longer implies
  // "history already loaded".
  const hydratedRef = useRef(false);

  const scrollDown = () => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    });
  };

  const appendMessages = useCallback((incoming: ChatMessage[]) => {
    if (!incoming.length) return;

    setMessages(prev => {
      const known = new Set(prev.map(m => m.id));
      const fresh = incoming.filter(m => !known.has(m.id));

      if (!fresh.length) return prev;

      lastIdRef.current = Math.max(lastIdRef.current, ...fresh.map(m => m.id));

      return [...prev, ...fresh];
    });
    scrollDown();
  }, []);

  // Returning visitors with a stored session start heartbeating immediately —
  // the broker sees them browsing without waiting for the panel to open.
  useEffect(() => {
    const stored = window.localStorage.getItem(TOKEN_KEY);

    if (stored) setToken(stored);
  }, []);

  // Open -> ensure a session exists; restore transcript once per pageload.
  useEffect(() => {
    if (!open || disabled || hydratedRef.current) return;

    hydratedRef.current = true;

    const stored = token ?? window.localStorage.getItem(TOKEN_KEY);

    const create = async () => {
      // Landing page + referrer travel once at creation — the broker inbox
      // shows where the visitor came from (JivoChat parity, 20.7.2026).
      const res = await fetch(`${API}/public/chat/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          page: window.location.pathname + window.location.search,
          referrer: document.referrer || null,
        }),
      });

      if (res.status === 503) {
        setDisabled(true);

        return;
      }

      if (!res.ok) return;

      const data = await res.json();

      window.localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setStatus(data.status);
    };

    const restore = async (existing: string) => {
      const res = await fetch(`${API}/public/chat/sessions/${existing}/messages?afterId=0`);

      if (res.status === 503) {
        setDisabled(true);

        return;
      }

      if (!res.ok) {
        window.localStorage.removeItem(TOKEN_KEY);
        await create();

        return;
      }

      const data = await res.json();

      setToken(existing);
      setStatus(data.status);
      appendMessages(data.messages);
    };

    (stored ? restore(stored) : create()).catch(() => setDisabled(true));
  }, [open, token, disabled, locale, appendMessages]);

  // Presence heartbeat: while a session exists, report the current page every
  // 30s so the broker inbox shows who is live on the site and what they're
  // browsing (JivoChat parity, Mario 20.7.2026). Best-effort — errors ignored.
  useEffect(() => {
    if (!token || disabled) return undefined;

    const ping = () => {
      fetch(`${API}/public/chat/sessions/${token}/presence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: window.location.pathname + window.location.search }),
      }).catch(() => {
        /* best-effort */
      });
    };

    ping();

    const interval = window.setInterval(ping, 30000);

    return () => window.clearInterval(interval);
  }, [token, disabled]);

  // Poll for broker replies while a human owns the session (and lightly in
  // AI mode too, so a takeover surfaces without a visitor message).
  useEffect(() => {
    if (!open || !token) return undefined;

    const interval = window.setInterval(
      async () => {
        try {
          const res = await fetch(`${API}/public/chat/sessions/${token}/messages?afterId=${lastIdRef.current}`);

          if (!res.ok) return;

          const data = await res.json();

          setStatus(data.status);
          appendMessages(data.messages);
        } catch {
          /* transient network error — next tick retries */
        }
      },
      status === 'AI' ? 20000 : 5000
    );

    return () => window.clearInterval(interval);
  }, [open, token, status, appendMessages]);

  const send = async () => {
    const content = input.trim();

    if (!content || !token || sending) return;

    setInput('');
    setSending(true);
    // Optimistic user bubble; the server copy replaces it by id on arrival.
    setMessages(prev => [...prev, { id: -Date.now(), role: 'USER', content, payload: null }]);
    scrollDown();
    try {
      // Current URL rides along so the assistant knows which yacht page the
      // visitor is on ("does THIS boat have AC?"). Read at send time — no
      // router hooks, so no Suspense/SSR concerns in the root layout.
      const page = window.location.pathname + window.location.search;
      const res = await fetch(`${API}/public/chat/sessions/${token}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, page }),
      });

      if (res.ok) {
        const data = await res.json();

        setStatus(data.status);
        setMessages(prev => prev.filter(m => m.id > 0));
        appendMessages(data.messages);
      }
    } catch {
      /* the polling loop will reconcile */
    } finally {
      setSending(false);
    }
  };

  if (disabled) return null;

  const cardsOf = (m: ChatMessage): YachtCard[] => {
    if (!m.payload) return [];

    try {
      return JSON.parse(m.payload).yachts ?? [];
    } catch {
      return [];
    }
  };

  return (
    <>
      {!open && (
        <button type="button" className={styles.fab} aria-label={t('open')} onClick={() => setOpen(true)}>
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden>
            <path
              d="M4 6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H9l-4.2 3.36A1 1 0 0 1 3 18.58V6Z"
              fill="currentColor"
            />
          </svg>
        </button>
      )}
      {open && (
        <div className={styles.panel} role="dialog" aria-label={t('title')}>
          <div className={styles.header}>
            <div>
              <p className={styles.title}>{t('title')}</p>
              <p className={styles.subtitle}>{status === 'AI' ? t('subtitleAi') : t('subtitleHuman')}</p>
            </div>
            <button type="button" className={styles.close} aria-label={t('close')} onClick={() => setOpen(false)}>
              ×
            </button>
          </div>
          <div ref={listRef} className={styles.list}>
            <div className={styles.bubbleAssistant}>{t('greeting')}</div>
            {messages.map(m => (
              <div key={m.id}>
                <div className={m.role === 'USER' ? styles.bubbleUser : styles.bubbleAssistant}>
                  {m.role === 'ADMIN' && <span className={styles.agentTag}>{t('agentTag')}</span>}
                  {m.content}
                </div>
                {cardsOf(m).length > 0 && (
                  <div className={styles.cards}>
                    {cardsOf(m).map(c => (
                      <Link
                        key={c.slug}
                        href={`/boat/${c.slug}?startDate=${c.startDate}&endDate=${c.endDate}&currency=EUR`}
                        className={styles.card}
                        target="_blank"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element -- tiny chat thumb, skip next/image pipeline */}
                        <img src={getBoatImageUrl(c.imageId, 200)} alt={c.name} loading="lazy" />
                        <div className={styles.cardBody}>
                          <p className={styles.cardName}>{c.name}</p>
                          <p className={styles.cardMeta}>
                            {c.cabins > 0 ? `${c.cabins} cab · ` : ''}
                            {c.maxPersons > 0 ? `${c.maxPersons} pax · ` : ''}
                            {c.year > 0 ? c.year : ''}
                          </p>
                          <p className={styles.cardPrice}>€{c.totalPriceEur.toLocaleString('de-DE')}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {sending && <div className={styles.typing}>{t('typing')}</div>}
          </div>
          <div className={styles.inputRow}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={t('placeholder')}
              maxLength={1000}
            />
            <button type="button" onClick={send} disabled={sending || !input.trim()}>
              {t('send')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
