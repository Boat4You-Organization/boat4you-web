'use client';

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useMemo, useState } from 'react';

import LogoWithoutText from '@/components/SvgIcons/LogoWithoutText';

import TripSocial, { TripOwnerCredentials } from './TripSocial';

/**
 * Boat4You Trip hub — standalone mobile-first PWA surface (English only by
 * decision). Everything here is crew-shareable: NO prices except the
 * leader-only payments card injected server-side for the authenticated owner.
 */

export interface TripDto {
  reservationNumber: string;
  status: 'OPTION' | 'OPTION_WAITING' | 'RESERVATION' | 'CANCELLED' | string;
  dateFrom: string;
  dateTo: string;
  ownerFirstName: string | null;
  yacht: {
    name: string;
    fullLabel: string;
    slug: string;
    buildYear: number | null;
    cabins: number | null;
    berths: number | null;
    wc: number | null;
    lengthMeters: number | null;
    mainImageId: number | null;
    imageIds: number[];
  };
  marina: { name: string; countryCode: string | null; lat: number | null; lon: number | null } | null;
  crewListUrl: string | null;
  agencyPhone: string | null;
  documents: {
    id: number;
    filename: string;
    sizeBytes: number;
    uploadedAt: string;
    documentType?: string;
  }[];
  /** VAPID public key — null/absent means push is off and the reminders card hides. */
  vapidPublicKey?: string | null;
  /** Crew invites open only after the first payment. */
  inviteUnlocked?: boolean;
}

export interface TripOwnerPayment {
  reservationId: number;
  nextAmountEur: number | null;
  nextDeadline: string | null;
}

interface TripHubProps {
  trip: TripDto;
  token: string;
  apiUrl: string;
  ownerPayment: TripOwnerPayment | null;
  ownerCredentials: TripOwnerCredentials | null;
}

/** Official maritime SAR numbers where well-established; 112 works EU-wide. */
const SOS_BY_COUNTRY: Record<string, { label: string; number: string }[]> = {
  HR: [{ label: 'Search & rescue at sea', number: '195' }],
  GR: [{ label: 'Coast guard', number: '108' }],
  IT: [{ label: 'Guardia Costiera', number: '1530' }],
  FR: [{ label: 'CROSS (sea rescue)', number: '196' }],
  ES: [{ label: 'Salvamento Marítimo', number: '900 202 202' }],
  TR: [{ label: 'Coast guard', number: '158' }],
};

const DOC_LABELS: Record<string, string> = {
  BOARDING_PASS: 'Boarding pass / Base info',
  CREW_LIST: 'Crew list (form)',
  PREFERENCE_LIST: 'Preference list',
};

const WMO_ICONS: Record<number, string> = {
  0: '☀️',
  1: '🌤',
  2: '⛅',
  3: '☁️',
  45: '🌫',
  48: '🌫',
  51: '🌦',
  53: '🌦',
  55: '🌧',
  61: '🌧',
  63: '🌧',
  65: '🌧',
  80: '🌦',
  81: '🌧',
  82: '⛈',
  95: '⛈',
  96: '⛈',
  99: '⛈',
};

interface ForecastDay {
  date: string;
  code: number;
  tMax: number;
  windMaxKn: number;
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

/** VAPID key (base64url) → Uint8Array for pushManager.subscribe. */
const urlBase64ToUint8Array = (base64: string) => {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const raw = window.atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'));

  return Uint8Array.from(raw, c => c.charCodeAt(0));
};

type PushState = 'unsupported' | 'idle' | 'subscribing' | 'subscribed' | 'denied';

type TabId = 'trip' | 'documents' | 'chat' | 'more';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'trip', label: 'Trip', icon: '⛵' },
  { id: 'documents', label: 'Documents', icon: '📄' },
  { id: 'chat', label: 'Chat', icon: '💬' },
  { id: 'more', label: 'More', icon: '☰' },
];

const TripHub = ({ trip, token, apiUrl, ownerPayment, ownerCredentials }: TripHubProps) => {
  const dateFrom = useMemo(() => new Date(trip.dateFrom), [trip.dateFrom]);
  const dateTo = useMemo(() => new Date(trip.dateTo), [trip.dateTo]);

  const [now, setNow] = useState<Date | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[] | null>(null);
  const [standalone, setStandalone] = useState(true);
  const [pushState, setPushState] = useState<PushState>('unsupported');
  const [tab, setTab] = useState<TabId>('trip');

  // Day-1 analytics — fire-and-forget, the hub must never wait on it.
  const sendEvent = useCallback(
    (type: string, meta?: string) => {
      fetch(`${apiUrl}/public/trip/${token}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, meta }),
        keepalive: true,
      }).catch(() => {});
    },
    [apiUrl, token]
  );

  const postSubscription = useCallback(
    (subscription: PushSubscription) => {
      const json = subscription.toJSON();

      if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) return;

      fetch(`${apiUrl}/public/trip/${token}/push-subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: json.endpoint,
          p256dh: json.keys.p256dh,
          auth: json.keys.auth,
          // The backend verifies this key against the OWNER participant —
          // it gates the (amount-free) installment reminders.
          ownerKey: ownerCredentials?.participantKey ?? null,
          userAgent: navigator.userAgent,
        }),
        keepalive: true,
      }).catch(() => {});
    },
    [apiUrl, token, ownerCredentials]
  );

  useEffect(() => {
    setNow(new Date());

    const t = setInterval(() => setNow(new Date()), 30_000);

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as { standalone?: boolean }).standalone === true;

    setStandalone(isStandalone);
    sendEvent('HUB_VIEW', isStandalone ? 'standalone' : 'browser');

    const pushParam = new URLSearchParams(window.location.search).get('push');

    if (pushParam) sendEvent('PUSH_OPEN', pushParam);

    return () => clearInterval(t);
  }, [sendEvent]);

  // Trip reminders (web-push). Register the SW and reflect the current
  // subscription; iOS Safari outside the installed PWA has no Notification
  // API, so the card simply stays hidden there (install guide covers it).
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;

    if (!trip.vapidPublicKey) return;

    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return;

    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => registration.pushManager.getSubscription())
      .then(subscription => {
        if (subscription) {
          setPushState('subscribed');
          // Re-post so a pruned/re-bound reservation heals itself.
          postSubscription(subscription);
        } else if (Notification.permission === 'denied') {
          setPushState('denied');
        } else {
          setPushState('idle');
        }
      })
      .catch(() => {});
  }, [trip.vapidPublicKey, postSubscription]);

  const enableReminders = async () => {
    const key = trip.vapidPublicKey;

    if (!key) return;

    try {
      setPushState('subscribing');

      const permission = await Notification.requestPermission();

      if (permission !== 'granted') {
        setPushState(permission === 'denied' ? 'denied' : 'idle');

        return;
      }

      await navigator.serviceWorker.register('/sw.js');

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key),
      });

      postSubscription(subscription);
      sendEvent('PUSH_SUBSCRIBE');
      setPushState('subscribed');
    } catch {
      setPushState('idle');
    }
  };

  // Weather for the EXACT marina (Open-Meteo, keyless). 7 days.
  useEffect(() => {
    const { lat, lon } = trip.marina ?? {};

    if (lat == null || lon == null) return undefined;

    let cancelled = false;

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        '&daily=weather_code,temperature_2m_max,wind_speed_10m_max&wind_speed_unit=kn&timezone=auto&forecast_days=7'
    )
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (cancelled || !data?.daily?.time) return;

        const days: ForecastDay[] = data.daily.time.map((d: string, i: number) => ({
          date: d,
          code: data.daily.weather_code[i],
          tMax: Math.round(data.daily.temperature_2m_max[i]),
          windMaxKn: Math.round(data.daily.wind_speed_10m_max[i]),
        }));

        setForecast(days);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [trip.marina]);

  const cancelled = trip.status === 'CANCELLED';
  const finished = now != null && now > dateTo;
  const msLeft = now ? dateFrom.getTime() - now.getTime() : 0;
  const days = Math.max(0, Math.floor(msLeft / 86_400_000));
  const hours = Math.max(0, Math.floor((msLeft % 86_400_000) / 3_600_000));
  const mins = Math.max(0, Math.floor((msLeft % 3_600_000) / 60_000));

  const img = (id: number, w = 480) => `${apiUrl}/public/image/${id}?width=${w}`;
  const boatUrl = `https://www.boat4you.com/boat/${trip.yacht.slug}`;

  const sosNumbers = SOS_BY_COUNTRY[trip.marina?.countryCode?.toUpperCase() ?? ''] ?? [];

  let heroBackground = 'linear-gradient(160deg,#0c2461 0%,#1e4bd8 55%,#3a7bd5 100%)';

  if (cancelled) heroBackground = 'linear-gradient(160deg,#4b5563,#6b7280)';
  else if (finished) heroBackground = 'linear-gradient(160deg,#0a3d2e 0%,#16815f 60%,#3aa87c 100%)';

  let greeting = 'Welcome aboard 👋';

  if (finished) greeting = `Your voyage ✓ · ${fmtDate(trip.dateFrom)} – ${fmtDate(trip.dateTo)}`;
  else if (trip.ownerFirstName) greeting = `Welcome back, ${trip.ownerFirstName} 👋`;

  /* ------------ styles (inline; standalone page, no site CSS) ------------ */
  const S = {
    page: {
      maxWidth: 480,
      margin: '0 auto',
      fontFamily: "'Inter',-apple-system,'Segoe UI',Roboto,Arial,sans-serif",
      color: '#0f172a',
      paddingBottom: 32,
    } as const,
    hero: {
      background: heroBackground,
      color: '#fff',
      padding: '18px 18px 20px',
    } as const,
    card: { background: '#fff', border: '1px solid #e3e9f2', borderRadius: 14, padding: '13px 15px' } as const,
    btnYellow: {
      display: 'block',
      textAlign: 'center' as const,
      background: '#f3d300',
      color: '#442704',
      fontWeight: 800,
      fontSize: 15,
      borderRadius: 12,
      padding: '13px 10px',
      textDecoration: 'none',
    },
    btnBlue: {
      display: 'block',
      textAlign: 'center' as const,
      background: '#2856ff',
      color: '#fff',
      fontWeight: 800,
      fontSize: 15,
      borderRadius: 12,
      padding: '13px 10px',
      textDecoration: 'none',
    },
    sub: { color: '#5b6b82', fontSize: 13 } as const,
    h2: { fontSize: 15, fontWeight: 800, margin: '18px 2px 8px' } as const,
  };

  return (
    <div style={S.page}>
      {/* ---------- HERO ---------- */}
      <div style={S.hero}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <a
            href="https://www.boat4you.com"
            style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#fff', textDecoration: 'none' }}
          >
            <LogoWithoutText size={24} />
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em' }}>boat4you</span>
          </a>
          <span
            style={{
              background: 'rgba(255,255,255,.16)',
              borderRadius: 99,
              padding: '3px 11px',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            #{trip.reservationNumber}
          </span>
        </div>

        {cancelled ? (
          <>
            <div style={{ fontSize: 21, fontWeight: 800 }}>This reservation was cancelled</div>
            <div style={{ opacity: 0.85, fontSize: 13, marginTop: 6 }}>
              Questions? Call Boat4You:{' '}
              <a href="tel:+385913000009" style={{ color: '#fff' }}>
                +385 91 3000 009
              </a>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 13, opacity: 0.85 }}>{greeting}</div>
            <a
              href={boatUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sendEvent('SITE_CLICK', 'hero')}
              style={{ color: '#fff', textDecoration: 'none' }}
            >
              <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.01em', margin: '2px 0' }}>
                {finished ? 'Thank you for sailing with us!' : `${trip.yacht.fullLabel} ↗`}
              </div>
            </a>
            <div style={{ fontSize: 13, opacity: 0.85 }}>
              {trip.marina?.name ?? ''} · {fmtDate(trip.dateFrom)} → {fmtDate(trip.dateTo)}
            </div>

            {!finished && now && (
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                {[
                  [days, 'days'],
                  [hours, 'hours'],
                  [mins, 'min'],
                ].map(([v, l]) => (
                  <div
                    key={l as string}
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,.14)',
                      borderRadius: 12,
                      padding: '9px 0',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 22, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
                      {v as number}
                    </div>
                    <div style={{ fontSize: 10, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '.08em' }}>
                      {l as string}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {!cancelled && (
        <>
          <div style={{ padding: '14px 14px 128px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* ============================= TRIP ============================= */}
            {tab === 'trip' && (
              <>
                {trip.yacht.imageIds.length > 0 && (
                  <a
                    href={boatUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sendEvent('SITE_CLICK', 'gallery')}
                    style={{ ...S.card, textDecoration: 'none', color: 'inherit' }}
                  >
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: 5, flex: 1, overflow: 'hidden' }}>
                        {trip.yacht.imageIds.slice(0, 3).map(id => (
                          <img
                            key={id}
                            src={img(id, 320)}
                            alt={trip.yacht.name}
                            style={{ width: '32%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 9 }}
                          />
                        ))}
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: 800, color: '#2856ff', whiteSpace: 'nowrap' }}>
                        View
                        <br />
                        boat ↗
                      </div>
                    </div>
                    <div style={{ ...S.sub, marginTop: 8 }}>
                      {[
                        trip.yacht.buildYear,
                        trip.yacht.cabins != null ? `${trip.yacht.cabins} cabins` : null,
                        trip.yacht.berths != null ? `${trip.yacht.berths} berths` : null,
                        trip.yacht.lengthMeters != null ? `${trip.yacht.lengthMeters.toFixed(2)} m` : null,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </div>
                  </a>
                )}

                {finished && (
                  <>
                    <a
                      href={boatUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => sendEvent('SITE_CLICK', 'rebook')}
                      style={S.btnBlue}
                    >
                      Sail {trip.yacht.name} again next year →
                    </a>
                    <div style={{ ...S.card, ...S.sub }}>
                      We hope {trip.yacht.name} was everything you wished for. Your travel documents stay here for 30
                      days.
                    </div>
                  </>
                )}

                {ownerPayment && ownerPayment.nextAmountEur != null && !finished && (
                  <>
                    <div style={S.h2}>
                      Payments{' '}
                      <span
                        style={{
                          fontSize: 10,
                          background: '#e9efff',
                          color: '#1a3fd6',
                          borderRadius: 99,
                          padding: '2px 8px',
                          verticalAlign: 2,
                        }}
                      >
                        ONLY YOU
                      </span>
                    </div>
                    <a
                      href={`https://www.boat4you.com/my-bookings/${ownerPayment.reservationId}`}
                      style={{ ...S.card, display: 'block', textDecoration: 'none', color: 'inherit' }}
                    >
                      <div style={{ fontWeight: 800, fontSize: 14 }}>
                        Next installment: {Math.round(ownerPayment.nextAmountEur).toLocaleString('en-GB')} €
                      </div>
                      <div style={S.sub}>
                        {ownerPayment.nextDeadline ? `Due by ${fmtDate(ownerPayment.nextDeadline)} · ` : ''}
                        <span style={{ color: '#2856ff', fontWeight: 700 }}>Pay on boat4you.com →</span>
                      </div>
                    </a>
                  </>
                )}

                {trip.marina && forecast && (
                  <>
                    <div style={S.h2}>Weather · {trip.marina.name}</div>
                    <div style={{ ...S.card, display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {forecast.map(day => (
                        <div key={day.date} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                          <span style={{ width: 42, fontWeight: 700 }}>
                            {new Date(day.date).toLocaleDateString('en-GB', { weekday: 'short' })}
                          </span>
                          <span style={{ fontSize: 17 }}>{WMO_ICONS[day.code] ?? '🌤'}</span>
                          <span style={{ marginLeft: 'auto', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
                            {day.tMax}°
                          </span>
                          <span style={{ width: 64, textAlign: 'right', color: '#5b6b82', fontSize: 12 }}>
                            {day.windMaxKn} kn
                          </span>
                        </div>
                      ))}
                      <div style={{ ...S.sub, fontSize: 11, textAlign: 'center' }}>
                        Forecast for the marina&apos;s exact location
                      </div>
                    </div>
                  </>
                )}

                <div style={S.h2}>SOS &amp; contacts</div>
                <div
                  style={{
                    ...S.card,
                    borderColor: '#f3c1c1',
                    background: '#fff8f8',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  {sosNumbers.map(sos => (
                    <a
                      key={sos.number}
                      href={`tel:${sos.number.replace(/\s/g, '')}`}
                      style={{
                        background: '#b32424',
                        color: '#fff',
                        borderRadius: 11,
                        padding: '11px 10px',
                        textAlign: 'center',
                        fontWeight: 800,
                        fontSize: 14,
                        textDecoration: 'none',
                      }}
                    >
                      📞 {sos.number} · {sos.label}
                    </a>
                  ))}
                  <a
                    href="tel:112"
                    style={{
                      background: '#8a1f1f',
                      color: '#fff',
                      borderRadius: 11,
                      padding: '11px 10px',
                      textAlign: 'center',
                      fontWeight: 800,
                      fontSize: 14,
                      textDecoration: 'none',
                    }}
                  >
                    📞 112 · All emergencies (EU)
                  </a>
                  {trip.agencyPhone && (
                    <a
                      href={`tel:${trip.agencyPhone.replace(/[^+\d]/g, '')}`}
                      style={{ ...S.sub, textDecoration: 'none', textAlign: 'center', fontWeight: 700 }}
                    >
                      Charter base: {trip.agencyPhone}
                    </a>
                  )}
                  <a
                    href="tel:+385913000009"
                    style={{ ...S.sub, textDecoration: 'none', textAlign: 'center', fontWeight: 700 }}
                  >
                    Boat4You support: +385 91 3000 009
                  </a>
                </div>
              </>
            )}

            {/* =========================== DOCUMENTS ========================= */}
            {tab === 'documents' && (
              <>
                <div style={S.h2}>Travel documentation</div>
                {trip.crewListUrl || trip.documents.length > 0 ? (
                  <>
                    {trip.crewListUrl && (
                      <a href={trip.crewListUrl} target="_blank" rel="noopener noreferrer" style={S.btnYellow}>
                        Crew list — fill in online ↗
                      </a>
                    )}
                    {trip.documents.map(doc => (
                      <a
                        key={doc.id}
                        href={`${apiUrl}/public/trip/${token}/documents/${doc.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => sendEvent('DOC_OPEN', doc.documentType ?? 'OTHER')}
                        style={S.btnYellow}
                      >
                        {DOC_LABELS[doc.documentType ?? ''] ?? doc.filename} ⬇
                      </a>
                    ))}
                    <div style={{ ...S.sub, fontSize: 12 }}>
                      The charter company registers every guest with the port authority — enter each guest&apos;s
                      details exactly as they appear on their passport.
                    </div>
                  </>
                ) : (
                  <div style={{ ...S.card, ...S.sub, fontSize: 12.5, textAlign: 'center', padding: '22px 15px' }}>
                    📄 Your travel documents — crew list, boarding pass and base info — appear here as your charter
                    approaches. We&apos;ll let you know the moment they&apos;re ready.
                  </div>
                )}
              </>
            )}

            {/* ============================= CHAT ============================ */}
            {tab === 'chat' && (
              <TripSocial trip={trip} token={token} apiUrl={apiUrl} ownerCredentials={ownerCredentials} />
            )}

            {/* ============================= MORE ============================ */}
            {tab === 'more' && (
              <>
                {pushState !== 'unsupported' && !finished && (
                  <>
                    <div style={S.h2}>Trip reminders</div>
                    <div style={{ ...S.card, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {pushState === 'subscribed' && (
                        <div style={{ fontWeight: 800, fontSize: 14, color: '#16815f' }}>
                          🔔 Reminders are on for this phone
                        </div>
                      )}
                      {pushState === 'denied' && (
                        <div style={{ ...S.sub, fontSize: 12.5 }}>
                          Notifications are blocked for this site — enable them in your browser settings to get trip
                          reminders.
                        </div>
                      )}
                      {(pushState === 'idle' || pushState === 'subscribing') && (
                        <button
                          type="button"
                          onClick={enableReminders}
                          disabled={pushState === 'subscribing'}
                          style={{
                            ...S.btnBlue,
                            border: 'none',
                            width: '100%',
                            cursor: 'pointer',
                            opacity: pushState === 'subscribing' ? 0.6 : 1,
                          }}
                        >
                          🔔 Get trip reminders
                        </button>
                      )}
                      <div style={{ ...S.sub, fontSize: 12 }}>
                        Countdown nudges, the weather on departure day and a heads-up when it&apos;s time to check in —
                        straight to this phone.
                      </div>
                    </div>
                  </>
                )}

                {!standalone && (
                  <>
                    <div style={S.h2}>Keep this trip on your phone</div>
                    <div style={{ ...S.card, ...S.sub, fontSize: 12.5 }}>
                      <b style={{ color: '#0f172a' }}>iPhone:</b> Safari → Share ⬆ → &quot;Add to Home Screen&quot;
                      <br />
                      <b style={{ color: '#0f172a' }}>Android:</b> Chrome → menu ⋮ → &quot;Install app&quot;
                    </div>
                  </>
                )}

                <div style={S.h2}>About &amp; support</div>
                <div style={{ ...S.card, ...S.sub, fontSize: 12.5, lineHeight: 1.7 }}>
                  Boat4You support:{' '}
                  <a href="tel:+385913000009" style={{ color: '#2856ff', fontWeight: 700 }}>
                    +385 91 3000 009
                  </a>
                  <br />
                  <a href="https://www.boat4you.com" style={{ color: '#5b6b82' }}>
                    boat4you.com
                  </a>{' '}
                  · your charter, one tap away
                </div>
              </>
            )}
          </div>

          {/* ======================= BOTTOM TAB BAR ======================= */}
          <nav style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 20 }}>
            <div
              style={{
                maxWidth: 480,
                margin: '0 auto',
                display: 'flex',
                background: '#fff',
                borderTop: '1px solid #e3e9f2',
                boxShadow: '0 -2px 14px rgba(15,23,42,.07)',
                paddingBottom: 'env(safe-area-inset-bottom)',
              }}
            >
              {TABS.map(item => {
                const active = tab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      padding: '12px 0 12px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: active ? '#2856ff' : '#64748b',
                      fontWeight: 700,
                    }}
                  >
                    <span style={{ fontSize: 27, lineHeight: 1, opacity: active ? 1 : 0.85 }}>{item.icon}</span>
                    <span style={{ fontSize: 12.5 }}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </>
      )}
    </div>
  );
};

export default TripHub;
