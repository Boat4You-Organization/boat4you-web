'use client';

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import QRCode from 'qrcode';

import type { TripDto } from './TripHub';

/**
 * Crew, chat and album for the Boat4You Trip hub (phases 3+4). The trip link
 * is the closed group's door; joining stores a secret participant key on the
 * device which then gates the crew list, the chat and the album. The booking
 * owner arrives pre-claimed through his web session (SSR), guests join with
 * just a name — no registration by design.
 */

export interface TripOwnerCredentials {
  participantId: number;
  participantKey: string;
  name: string;
  role: string;
}

interface Participant {
  id: number;
  name: string;
  role: string;
}

interface ChatMessage {
  id: number;
  participantId: number | null;
  senderName: string;
  senderRole: string;
  body: string;
  createdAt: string;
}

interface Photo {
  id: number;
  participantId: number | null;
  uploaderName: string | null;
  marketingConsent: boolean;
  createdAt: string;
}

interface TripSocialProps {
  trip: TripDto;
  token: string;
  apiUrl: string;
  ownerCredentials: TripOwnerCredentials | null;
}

const ROLE_BADGES: Record<string, string> = {
  OWNER: '👑',
  SKIPPER: '🧭',
  CONCIERGE: '⚓',
  GUEST: '⛵',
};

const CARD = { background: '#fff', border: '1px solid #e3e9f2', borderRadius: 14, padding: '13px 15px' } as const;
const SUB = { color: '#5b6b82', fontSize: 13 } as const;
const H2 = { fontSize: 15, fontWeight: 800, margin: '18px 2px 8px' } as const;
const BTN_BLUE = {
  display: 'block',
  textAlign: 'center' as const,
  background: '#2856ff',
  color: '#fff',
  fontWeight: 800,
  fontSize: 15,
  borderRadius: 12,
  padding: '13px 10px',
  textDecoration: 'none',
  border: 'none',
  width: '100%',
  cursor: 'pointer',
};

const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

const TripSocial = ({ trip, token, apiUrl, ownerCredentials }: TripSocialProps) => {
  const storageKey = `b4y-trip-${token}`;

  const [creds, setCreds] = useState<TripOwnerCredentials | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [joinName, setJoinName] = useState('');
  const [joinBusy, setJoinBusy] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [consent, setConsent] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [inviteQr, setInviteQr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const lastIdRef = useRef(0);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const cancelled = trip.status === 'CANCELLED';
  const dateTo = useMemo(() => new Date(trip.dateTo), [trip.dateTo]);
  const chatReadOnly = Date.now() > dateTo.getTime() + 14 * 86_400_000;
  const uploadsClosed = Date.now() > dateTo.getTime() + 30 * 86_400_000;
  const finished = Date.now() > dateTo.getTime();

  /* ------------------------- credentials bootstrap ------------------------ */
  useEffect(() => {
    if (ownerCredentials) {
      window.localStorage.setItem(storageKey, JSON.stringify(ownerCredentials));
      setCreds(ownerCredentials);
      setInitialized(true);

      return;
    }

    try {
      const stored = window.localStorage.getItem(storageKey);

      if (stored) setCreds(JSON.parse(stored) as TripOwnerCredentials);
    } catch {
      /* corrupt storage — fall through to the join flow */
    }
    setInitialized(true);
  }, [ownerCredentials, storageKey]);

  /* ------------------------------ data sync ------------------------------ */
  // Full authoritative sync (sinceId=0, replace): scheduler-posted concierge
  // messages get ids the SSE stream never delivered, so an incremental
  // cursor would skip them forever; replacing also keeps ordering correct.
  const refreshMessages = useCallback(() => {
    if (!creds) return;

    fetch(`${apiUrl}/public/trip/${token}/chat?key=${creds.participantKey}&sinceId=0`)
      .then(r => (r.ok ? r.json() : null))
      .then((fresh: ChatMessage[] | null) => {
        if (!fresh) return;

        const sorted = [...fresh].sort((a, b) => a.id - b.id);

        lastIdRef.current = sorted.length ? sorted[sorted.length - 1].id : 0;
        setMessages(sorted);
      })
      .catch(() => {});
  }, [apiUrl, token, creds]);

  const refreshCrewAndPhotos = useCallback(() => {
    if (!creds) return;

    fetch(`${apiUrl}/public/trip/${token}/participants?key=${creds.participantKey}`)
      .then(r => {
        if (r.status === 403) {
          // Removed by the leader / link regenerated — drop the dead key and
          // fall back to the join flow.
          window.localStorage.removeItem(storageKey);
          setCreds(null);

          return null;
        }

        return r.ok ? r.json() : null;
      })
      .then((list: Participant[] | null) => {
        if (list) setParticipants(list);
      })
      .catch(() => {});

    fetch(`${apiUrl}/public/trip/${token}/photos?key=${creds.participantKey}`)
      .then(r => (r.ok ? r.json() : null))
      .then((list: Photo[] | null) => {
        if (list) setPhotos(list);
      })
      .catch(() => {});
  }, [apiUrl, token, creds, storageKey]);

  useEffect(() => {
    if (!creds) return undefined;

    refreshMessages();
    refreshCrewAndPhotos();

    // SSE for instant delivery (admin/crew posts through the API node) +
    // a 30 s poll safety net (scheduled concierge posts originate on the
    // scheduler node, which has no SSE emitters).
    const source = new EventSource(
      `${apiUrl}/public/trip/${token}/chat/stream?key=${encodeURIComponent(creds.participantKey)}`
    );

    source.addEventListener('chat', event => {
      try {
        const message = JSON.parse((event as MessageEvent).data) as ChatMessage;

        setMessages(prev => {
          if (prev.some(m => m.id === message.id)) return prev;

          lastIdRef.current = Math.max(lastIdRef.current, message.id);

          return [...prev, message];
        });
      } catch {
        /* malformed frame — the poll picks it up */
      }
    });
    source.onerror = () => {
      /* EventSource auto-reconnects; the poll covers the gap */
    };

    const poll = setInterval(() => {
      refreshMessages();
      refreshCrewAndPhotos();
    }, 30_000);

    return () => {
      source.close();
      clearInterval(poll);
    };
  }, [apiUrl, token, creds, refreshMessages, refreshCrewAndPhotos]);

  /* Auto-scroll chat to the newest message. */
  useEffect(() => {
    const box = chatBoxRef.current;

    if (box) box.scrollTop = box.scrollHeight;
  }, [messages.length]);

  /* Invite QR (owner only). */
  useEffect(() => {
    if (creds?.role !== 'OWNER' || !trip.inviteUnlocked) return;

    QRCode.toDataURL(`${window.location.origin}/trip/${token}`, {
      width: 240,
      margin: 1,
      color: { dark: '#0c2461', light: '#ffffff' },
    })
      .then(setInviteQr)
      .catch(() => {});
  }, [creds, token, trip.inviteUnlocked]);

  /* -------------------------------- actions ------------------------------ */
  const join = async () => {
    if (joinName.trim().length < 2) {
      setJoinError('Please enter your name.');

      return;
    }

    setJoinBusy(true);
    setJoinError(null);

    try {
      const res = await fetch(`${apiUrl}/public/trip/${token}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: joinName.trim() }),
      });

      if (res.ok) {
        const credentials = (await res.json()) as TripOwnerCredentials;

        window.localStorage.setItem(storageKey, JSON.stringify(credentials));
        setCreds(credentials);

        return;
      }

      const body = res.status === 409 ? ((await res.json()) as { reason?: string }) : {};
      const reasons: Record<string, string> = {
        LOCKED: 'The crew area unlocks once the booking is confirmed.',
        FULL: 'This crew is full — ask the trip leader to make room.',
        FINISHED: 'This charter has already ended.',
        CANCELLED: 'This reservation was cancelled.',
      };

      setJoinError(reasons[body.reason ?? ''] ?? 'Could not join right now — try again.');
    } catch {
      setJoinError('Could not join right now — try again.');
    } finally {
      setJoinBusy(false);
    }
  };

  const send = async () => {
    if (!creds || !draft.trim() || sending) return;

    setSending(true);

    try {
      const res = await fetch(`${apiUrl}/public/trip/${token}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: creds.participantKey, body: draft.trim() }),
      });

      if (res.ok) {
        const message = (await res.json()) as ChatMessage;

        setMessages(prev => (prev.some(m => m.id === message.id) ? prev : [...prev, message]));
        lastIdRef.current = Math.max(lastIdRef.current, message.id);
        setDraft('');
      }
    } catch {
      /* keep the draft — the user can retry */
    } finally {
      setSending(false);
    }
  };

  const removeParticipant = async (participant: Participant) => {
    if (!creds || creds.role !== 'OWNER') return;

    // eslint-disable-next-line no-alert
    if (!window.confirm(`Remove ${participant.name} from this trip?`)) return;

    await fetch(
      `${apiUrl}/public/trip/${token}/participants/${participant.id}?key=${encodeURIComponent(creds.participantKey)}`,
      { method: 'DELETE' }
    ).catch(() => {});
    refreshCrewAndPhotos();
  };

  const uploadPhoto = async (file: File | undefined) => {
    if (!creds || !file || uploading) return;

    setUploading(true);

    try {
      const form = new FormData();

      form.append('file', file);
      form.append('key', creds.participantKey);
      form.append('marketingConsent', String(consent));

      const res = await fetch(`${apiUrl}/public/trip/${token}/photos`, { method: 'POST', body: form });

      if (res.ok) refreshCrewAndPhotos();
    } catch {
      /* upload failed — nothing persisted */
    } finally {
      setUploading(false);

      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const deletePhoto = async (photo: Photo) => {
    if (!creds) return;

    // eslint-disable-next-line no-alert
    if (!window.confirm('Delete this photo?')) return;

    await fetch(`${apiUrl}/public/trip/${token}/photos/${photo.id}?key=${encodeURIComponent(creds.participantKey)}`, {
      method: 'DELETE',
    }).catch(() => {});
    refreshCrewAndPhotos();
  };

  const shareInvite = async () => {
    const url = `${window.location.origin}/trip/${token}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Our sailing trip',
          text: `Join our ${trip.yacht.name} trip — documents, chat and countdown:`,
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* user dismissed the share sheet */
    }
  };

  /* ------------------------------- render -------------------------------- */
  if (cancelled || !initialized) return null;

  const isOwner = creds?.role === 'OWNER';

  return (
    <>
      {/* ---------- JOIN ---------- */}
      {!creds && (
        <>
          <div style={H2}>Crew &amp; chat</div>
          <div style={{ ...CARD, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {trip.inviteUnlocked && !finished ? (
              <>
                <div style={{ fontWeight: 800, fontSize: 14 }}>Join the crew of {trip.yacht.name}</div>
                <div style={{ ...SUB, fontSize: 12.5 }}>
                  Just your name — no account needed. You&apos;ll get the group chat, the crew list and the photo album.
                </div>
                <input
                  value={joinName}
                  onChange={e => setJoinName(e.target.value)}
                  placeholder="Your name"
                  maxLength={60}
                  style={{
                    border: '1px solid #d4dcea',
                    borderRadius: 10,
                    padding: '11px 12px',
                    fontSize: 15,
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={join}
                  disabled={joinBusy}
                  style={{ ...BTN_BLUE, opacity: joinBusy ? 0.6 : 1 }}
                >
                  ⛵ Join the crew
                </button>
                {joinError && <div style={{ color: '#b32424', fontSize: 12.5 }}>{joinError}</div>}
              </>
            ) : (
              <div style={{ ...SUB, fontSize: 12.5 }}>
                {finished
                  ? 'This charter has ended — the crew area is closed for new members.'
                  : 'The crew chat and photo album unlock once the booking is confirmed.'}
              </div>
            )}
          </div>
        </>
      )}

      {creds && (
        <>
          {/* ---------- INVITE (owner) ---------- */}
          {isOwner && trip.inviteUnlocked && !finished && (
            <>
              <div style={H2}>Invite your crew</div>
              <div style={{ ...CARD, display: 'flex', gap: 12, alignItems: 'center' }}>
                {inviteQr && (
                  <img
                    src={inviteQr}
                    alt="Trip invite QR"
                    width={92}
                    height={92}
                    style={{ borderRadius: 8, flexShrink: 0 }}
                  />
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                  <div style={{ ...SUB, fontSize: 12.5 }}>
                    Crew members scan the QR or open your link, enter a name and they&apos;re in. They never see prices
                    or payments.
                  </div>
                  <button type="button" onClick={shareInvite} style={{ ...BTN_BLUE, padding: '10px' }}>
                    {copied ? 'Link copied ✓' : '📤 Share the trip link'}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ---------- CREW LIST ---------- */}
          <div style={H2}>Crew on board · {participants.length}</div>
          <div style={{ ...CARD, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {participants.map(participant => (
              <span
                key={participant.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  background: participant.role === 'OWNER' ? '#e9efff' : '#f1f5fb',
                  borderRadius: 99,
                  padding: '6px 11px',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {ROLE_BADGES[participant.role] ?? '⛵'} {participant.name}
                {isOwner && participant.role !== 'OWNER' && (
                  <button
                    type="button"
                    onClick={() => removeParticipant(participant)}
                    aria-label={`Remove ${participant.name}`}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#b32424',
                      fontWeight: 800,
                      cursor: 'pointer',
                      padding: 0,
                      fontSize: 13,
                    }}
                  >
                    ✕
                  </button>
                )}
              </span>
            ))}
            {participants.length <= 1 && (
              <span style={{ ...SUB, fontSize: 12 }}>No crew yet — share the trip link to bring them in.</span>
            )}
          </div>

          {/* ---------- CHAT ---------- */}
          <div style={H2}>Trip chat</div>
          <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
            <div
              ref={chatBoxRef}
              style={{
                maxHeight: 320,
                minHeight: 120,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                padding: '12px 12px 8px',
              }}
            >
              {messages.length === 0 && (
                <div style={{ ...SUB, fontSize: 12.5, textAlign: 'center', padding: '14px 0' }}>
                  No messages yet — say hi to your crew! Your Boat4You concierge reads along and helps with anything.
                </div>
              )}
              {messages.map(message => {
                const mine = message.participantId != null && message.participantId === creds.participantId;
                const concierge = message.senderRole === 'CONCIERGE';

                let bubbleStyle: React.CSSProperties = { background: '#f1f5fb', color: '#0f172a' };

                if (mine) bubbleStyle = { background: '#2856ff', color: '#fff' };
                else if (concierge) bubbleStyle = { background: '#0c2461', color: '#fff' };

                return (
                  <div key={message.id} style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                    <div
                      style={{
                        fontSize: 10.5,
                        color: '#8494ab',
                        margin: mine ? '0 4px 2px 0' : '0 0 2px 4px',
                        textAlign: mine ? 'right' : 'left',
                      }}
                    >
                      {concierge ? '⚓ ' : ''}
                      {message.senderName} · {fmtTime(message.createdAt)}
                    </div>
                    <div
                      style={{
                        ...bubbleStyle,
                        borderRadius: 13,
                        padding: '9px 12px',
                        fontSize: 14,
                        lineHeight: 1.35,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {message.body}
                    </div>
                  </div>
                );
              })}
            </div>
            {chatReadOnly ? (
              <div
                style={{
                  ...SUB,
                  fontSize: 12,
                  textAlign: 'center',
                  padding: '10px 12px',
                  borderTop: '1px solid #edf1f8',
                }}
              >
                The chat is now read-only — thanks for sailing with us!
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8, padding: 10, borderTop: '1px solid #edf1f8' }}>
                <input
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') send();
                  }}
                  placeholder="Message the crew…"
                  maxLength={2000}
                  style={{
                    flex: 1,
                    border: '1px solid #d4dcea',
                    borderRadius: 10,
                    padding: '10px 12px',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={send}
                  disabled={sending || !draft.trim()}
                  style={{
                    ...BTN_BLUE,
                    width: 'auto',
                    padding: '10px 16px',
                    opacity: sending || !draft.trim() ? 0.5 : 1,
                  }}
                >
                  ➤
                </button>
              </div>
            )}
          </div>

          {/* ---------- ALBUM ---------- */}
          <div style={H2}>Trip album · {photos.length}</div>
          <div style={{ ...CARD, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {photos.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                {photos.map(photo => {
                  const mayDelete =
                    isOwner || (photo.participantId != null && photo.participantId === creds.participantId);

                  return (
                    <div key={photo.id} style={{ position: 'relative' }}>
                      <img
                        src={`${apiUrl}/public/trip/${token}/photos/${photo.id}/raw?key=${encodeURIComponent(creds.participantKey)}`}
                        alt={photo.uploaderName ?? 'Trip photo'}
                        loading="lazy"
                        style={{
                          width: '100%',
                          aspectRatio: '1/1',
                          objectFit: 'cover',
                          borderRadius: 9,
                          display: 'block',
                        }}
                      />
                      {mayDelete && (
                        <button
                          type="button"
                          onClick={() => deletePhoto(photo)}
                          aria-label="Delete photo"
                          style={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            border: 'none',
                            borderRadius: 99,
                            width: 22,
                            height: 22,
                            background: 'rgba(12,36,97,.75)',
                            color: '#fff',
                            fontSize: 12,
                            fontWeight: 800,
                            cursor: 'pointer',
                            lineHeight: 1,
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {!uploadsClosed ? (
              <>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                  onChange={e => uploadPhoto(e.target.files?.[0])}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  style={{ ...BTN_BLUE, background: '#f3d300', color: '#442704', opacity: uploading ? 0.6 : 1 }}
                >
                  {uploading ? 'Uploading…' : '📷 Add a photo'}
                </button>
                <label
                  style={{ ...SUB, fontSize: 12, display: 'flex', gap: 7, alignItems: 'flex-start', cursor: 'pointer' }}
                >
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={e => setConsent(e.target.checked)}
                    style={{ marginTop: 2 }}
                  />
                  Boat4You may use this photo for marketing (optional — applies to photos you upload while ticked)
                </label>
              </>
            ) : (
              <div style={{ ...SUB, fontSize: 12 }}>
                The album is closed for new photos — everything here stays for your memories.
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default TripSocial;
