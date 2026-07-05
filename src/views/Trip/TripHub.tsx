'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from 'react';

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

const TripHub = ({ trip, token, apiUrl, ownerPayment }: TripHubProps) => {
  const dateFrom = useMemo(() => new Date(trip.dateFrom), [trip.dateFrom]);
  const dateTo = useMemo(() => new Date(trip.dateTo), [trip.dateTo]);

  const [now, setNow] = useState<Date | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[] | null>(null);
  const [standalone, setStandalone] = useState(true);

  useEffect(() => {
    setNow(new Date());

    const t = setInterval(() => setNow(new Date()), 30_000);

    setStandalone(
      window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as { standalone?: boolean }).standalone === true
    );

    return () => clearInterval(t);
  }, []);

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
            style={{ color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: 16 }}
          >
            ⛵ boat4you
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

      {cancelled ? null : (
        <div style={{ padding: '14px 14px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* ---------- GALLERY / BOAT LINK ---------- */}
          {trip.yacht.imageIds.length > 0 && (
            <a
              href={boatUrl}
              target="_blank"
              rel="noopener noreferrer"
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

          {/* ---------- FINISHED: thanks + rebook ---------- */}
          {finished && (
            <>
              <a href={boatUrl} target="_blank" rel="noopener noreferrer" style={S.btnBlue}>
                Sail {trip.yacht.name} again next year →
              </a>
              <div style={{ ...S.card, ...S.sub }}>
                We hope {trip.yacht.name} was everything you wished for. Your travel documents stay here for 30 days.
              </div>
            </>
          )}

          {/* ---------- TRAVEL DOCUMENTATION ---------- */}
          {(trip.crewListUrl || trip.documents.length > 0) && (
            <>
              <div style={S.h2}>Travel documentation</div>
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
                  style={S.btnYellow}
                >
                  {DOC_LABELS[doc.documentType ?? ''] ?? doc.filename} ⬇
                </a>
              ))}
              <div style={{ ...S.sub, fontSize: 12 }}>
                The charter company registers every guest with the port authority — enter each guest&apos;s details
                exactly as they appear on their passport.
              </div>
            </>
          )}

          {/* ---------- LEADER-ONLY PAYMENTS ---------- */}
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

          {/* ---------- WEATHER ---------- */}
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

          {/* ---------- SOS & CONTACTS ---------- */}
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

          {/* ---------- INSTALL GUIDE (browser only, hidden once installed) ---------- */}
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

          <div style={{ ...S.sub, fontSize: 11, textAlign: 'center', marginTop: 10 }}>
            <a href="https://www.boat4you.com" style={{ color: '#5b6b82' }}>
              boat4you.com
            </a>{' '}
            · your charter, one tap away
          </div>
        </div>
      )}
    </div>
  );
};

export default TripHub;
