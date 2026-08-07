'use client';

/**
 * Tailor-made itinerary builder (Mario + colleague, 7.8.2026). The
 * visitor picks a start marina and a trip length, then builds the week
 * day by day — but only from REALISTIC hops: actual day-legs of our
 * curated routes (with their copy) plus sensible day-sail-range stops,
 * and the loop always stays closeable back to the start. Finish = a
 * branded PDF of their own plan.
 */
import { useMemo, useState } from 'react';

import { Box, Button, Chip, Container, MenuItem, Popover, Select, Stack, Typography } from '@mui/material';
import { useMessages, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

import { CUSTOM_START_KEYS, CustomStop } from '@/config/itinerary/customLegs.config';
import { Suggestion, startOptions, stopByKey, stopContentRef, suggestNext } from '@/helper/customItineraryBuilder';
import colors from '@/styles/themes/colors';
import useCustomItineraryPdf from '@/utils/hooks/useCustomItineraryPdf';

const BuilderMap = dynamic(() => import('./BuilderMap'), { ssr: false });

const COUNTRY_LABELS: Record<string, string> = {
  croatia: 'Croatia',
  greece: 'Greece',
  italy: 'Italy',
  spain: 'Spain',
  turkey: 'Türkiye',
  france: 'France',
  montenegro: 'Montenegro',
  seychelles: 'Seychelles',
  caribbeans: 'Caribbean',
};

interface ChosenDay {
  stop: CustomStop;
  nm: number;
  content?: { ns: string; routeId: string; day: number };
}

const CustomBuilder = () => {
  const t = useTranslations('itinerary');
  // Localized curated-day copy for suggestion blurbs / the PDF: the legs
  // graph stores (ns, routeId, day) refs into the message catalogs.
  const messages = useMessages() as Record<
    string,
    { routes?: Record<string, { days?: Record<string, { shortDescription?: string; description?: string }> }> }
  >;

  const [startKey, setStartKey] = useState('');
  const [tripDays, setTripDays] = useState(7);
  const [days, setDays] = useState<ChosenDay[]>([]);
  const { downloadCustomPdf, isDownloading } = useCustomItineraryPdf();
  // Bočni info-popup lokacije (Mario 7.8): hover/klik na prijedlog otvara
  // panel s našom slikom i postojećim tekstom te destinacije.
  const [infoAnchor, setInfoAnchor] = useState<HTMLElement | null>(null);
  const [infoSug, setInfoSug] = useState<Suggestion | null>(null);

  const starts = useMemo(() => startOptions(CUSTOM_START_KEYS), []);
  const start = startKey ? stopByKey(startKey) : undefined;
  const currentKey = days.length ? days[days.length - 1].stop.key : startKey;
  const remainingDays = tripDays - days.length;
  const finished = days.length === tripDays && days[days.length - 1]?.stop.key === startKey;

  const suggestions = useMemo(() => {
    if (!startKey || finished || remainingDays < 1) return [];

    return suggestNext(currentKey, startKey, [startKey, ...days.map(d => d.stop.key)], remainingDays);
  }, [startKey, currentKey, days, remainingDays, finished]);

  const blurbOf = (content?: { ns: string; routeId: string; day: number }): string => {
    if (!content) return '';

    return messages[content.ns]?.routes?.[content.routeId]?.days?.[String(content.day)]?.shortDescription ?? '';
  };

  // Existing copy for every day: exact curated leg first, else the text of
  // any curated day arriving at that destination (Mario 7.8 — reuse, don't
  // invent). Only a hop nobody ever wrote about falls back to the generic line.
  const dayBlurb = (d: ChosenDay): string => blurbOf(d.content) || blurbOf(stopContentRef(d.stop.key));

  const longTextOf = (stopKey: string, content?: { ns: string; routeId: string; day: number }): string => {
    const ref = content ?? stopContentRef(stopKey);

    if (!ref) return '';

    const day = messages[ref.ns]?.routes?.[ref.routeId]?.days?.[String(ref.day)];

    return day?.description || day?.shortDescription || '';
  };

  // Any change to the day list unmounts the hovered suggestion card; a
  // Popover left anchored to that detached node renders at the viewport's
  // top-left corner (Mario 7.8), so every mutation also closes the popup.
  const closeInfo = () => {
    setInfoAnchor(null);
    setInfoSug(null);
  };

  const pickSuggestion = (sug: Suggestion) => {
    closeInfo();
    setDays(prev => [...prev, { stop: sug.stop, nm: sug.nm, content: sug.content }]);
  };

  const removeLastDay = () => {
    closeInfo();
    setDays(prev => prev.slice(0, -1));
  };

  const resetAll = () => {
    closeInfo();
    setDays([]);
    setStartKey('');
  };

  const routeStops = useMemo(() => (start ? [start, ...days.map(d => d.stop)] : []), [start, days]);
  const totalNm = days.reduce((acc, d) => acc + d.nm, 0);

  const exportPdf = () => {
    if (!start) return;

    downloadCustomPdf(
      {
        title: t('builder.pdfTitle', { start: start.label }),
        subtitle: t('builder.pdfSubtitle', {
          days: tripDays,
          country: COUNTRY_LABELS[start.country] ?? start.country,
        }),
        startLabel: start.label,
        totalNm,
        days: days.map((d, i) => ({
          day: i + 1,
          from: i === 0 ? start.label : days[i - 1].stop.label,
          to: d.stop.label,
          nm: d.nm,
          blurb:
            longTextOf(d.stop.key, d.content) ||
            dayBlurb(d) ||
            t('builder.genericLeg', {
              from: i === 0 ? start.label : days[i - 1].stop.label,
              to: d.stop.label,
              nm: d.nm,
            }),
        })),
        labels: {
          day: t('builder.day'),
          total: t('builder.total'),
          disclaimer: t('builder.disclaimer'),
          site: 'www.boat4you.com',
        },
      },
      routeStops
    );
  };

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 }, py: 4 }}>
      {/* korak 1: polazna marina + trajanje */}
      <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} sx={{ mb: 3 }} alignItems={{ sm: 'center' }}>
        <Select
          size="small"
          displayEmpty
          value={startKey}
          onChange={e => {
            setStartKey(e.target.value);
            setDays([]);
          }}
          sx={{ minWidth: 280, bgcolor: '#fff' }}
        >
          <MenuItem value="" disabled>
            {t('builder.pickStart')}
          </MenuItem>
          {starts.map(({ stop, country }) => (
            <MenuItem key={stop.key} value={stop.key}>
              {stop.label} · {COUNTRY_LABELS[country] ?? country}
            </MenuItem>
          ))}
        </Select>
        <Select
          size="small"
          value={tripDays}
          onChange={e => {
            setTripDays(Number(e.target.value));
            setDays([]);
          }}
          sx={{ minWidth: 140, bgcolor: '#fff' }}
        >
          {[7, 10, 14].map(n => (
            <MenuItem key={n} value={n}>
              {t('builder.daysOption', { days: n })}
            </MenuItem>
          ))}
        </Select>
        {days.length > 0 && (
          <Button size="small" onClick={resetAll} sx={{ color: colors.white, whiteSpace: 'nowrap', flexShrink: 0 }}>
            {t('builder.reset')}
          </Button>
        )}
      </Stack>

      {start && (
        <Stack direction={{ xs: 'column', md: 'row' }} gap={3}>
          {/* lijevo: dnevni plan + prijedlozi */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack gap={1} sx={{ mb: 2 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.blue950 }}>
                {t('builder.yourPlan', { start: start.label })}
              </Typography>
              {days.map((d, i) => (
                <Stack
                  // eslint-disable-next-line react/no-array-index-key -- ista stanica smije se ponoviti u planu
                  key={`${d.stop.key}-${i}`}
                  direction="row"
                  alignItems="center"
                  gap={1.2}
                  sx={{ p: 1.2, bgcolor: '#fff', borderRadius: 2, border: '1px solid #e2e6f0' }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      bgcolor: colors.blue600,
                      color: '#fff',
                      fontSize: 13,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.blue950 }}>
                      {i === 0 ? start.label : days[i - 1].stop.label} → {d.stop.label}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: '#64708a' }}>~{d.nm} NM</Typography>
                  </Box>
                  {i === days.length - 1 && (
                    <Button size="small" onClick={removeLastDay} sx={{ color: colors.white, minWidth: 0 }}>
                      ✕
                    </Button>
                  )}
                </Stack>
              ))}
            </Stack>

            {!finished && suggestions.length > 0 && (
              <>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.blue950, mb: 1 }}>
                  {t('builder.dayN', { day: days.length + 1 })} — {t('builder.suggestions')}
                </Typography>
                <Stack gap={1}>
                  {suggestions.map(sug => (
                    <Box
                      key={sug.stop.key}
                      onClick={() => pickSuggestion(sug)}
                      onMouseEnter={e => {
                        setInfoAnchor(e.currentTarget);
                        setInfoSug(sug);
                      }}
                      onMouseLeave={() => {
                        setInfoAnchor(null);
                        setInfoSug(null);
                      }}
                      sx={{
                        p: 1.4,
                        bgcolor: '#fff',
                        borderRadius: 2,
                        border: '1px solid #e2e6f0',
                        cursor: 'pointer',
                        '&:hover': { borderColor: colors.blue600, bgcolor: '#f6f8ff' },
                      }}
                    >
                      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.blue950 }}>
                          {sug.isReturn ? t('builder.returnTo', { start: sug.stop.label }) : sug.stop.label}
                        </Typography>
                        <Chip size="small" label={`~${sug.nm} NM`} sx={{ bgcolor: '#eef1fb', fontWeight: 600 }} />
                      </Stack>
                      {(blurbOf(sug.content) || blurbOf(stopContentRef(sug.stop.key))) && (
                        <Typography
                          sx={{
                            fontSize: 12.5,
                            color: '#3c4257',
                            mt: 0.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {blurbOf(sug.content) || blurbOf(stopContentRef(sug.stop.key))}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Stack>
              </>
            )}

            {!finished && suggestions.length === 0 && days.length > 0 && (
              <Typography sx={{ fontSize: 13, color: '#b3261e' }}>{t('builder.deadEnd')}</Typography>
            )}

            {finished && (
              <Box sx={{ p: 2, bgcolor: '#eef7ee', borderRadius: 2, border: '1px solid #bfe3c0' }}>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#15803d', mb: 0.5 }}>
                  {t('builder.done')}
                </Typography>
                <Typography sx={{ fontSize: 13, color: '#3c4257', mb: 1.5 }}>
                  {t('builder.doneSummary', { days: tripDays, nm: totalNm })}
                </Typography>
                <Button
                  variant="contained"
                  onClick={exportPdf}
                  disabled={isDownloading}
                  sx={{ bgcolor: colors.blue950 }}
                >
                  {isDownloading ? t('builder.pdfWorking') : t('builder.pdfButton')}
                </Button>
              </Box>
            )}

            {finished && (
              <Stack gap={2} sx={{ mt: 3 }}>
                {days.map((d, i) => (
                  <Box
                    // eslint-disable-next-line react/no-array-index-key -- ista stanica smije se ponoviti u planu
                    key={`detail-${d.stop.key}-${i}`}
                    sx={{ bgcolor: '#fff', borderRadius: 2, border: '1px solid #e2e6f0', overflow: 'hidden' }}
                  >
                    {d.stop.img && (
                      // eslint-disable-next-line @next/next/no-img-element -- galerija iz configa, preskačemo next/image pipeline
                      <img
                        src={d.stop.img}
                        alt={d.stop.label}
                        style={{ width: '100%', height: 190, objectFit: 'cover', display: 'block' }}
                        loading="lazy"
                      />
                    )}
                    <Box sx={{ p: 2 }}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                        <Typography sx={{ fontSize: 15, fontWeight: 700, color: colors.blue950 }}>
                          {t('builder.dayN', { day: i + 1 })}: {i === 0 ? start.label : days[i - 1].stop.label} →{' '}
                          {d.stop.label}
                        </Typography>
                        <Chip size="small" label={`~${d.nm} NM`} sx={{ bgcolor: '#eef1fb', fontWeight: 600 }} />
                      </Stack>
                      {(longTextOf(d.stop.key, d.content) || dayBlurb(d)) && (
                        <Typography sx={{ fontSize: 13.5, lineHeight: 1.6, color: '#3c4257', mt: 0.8 }}>
                          {longTextOf(d.stop.key, d.content) || dayBlurb(d)}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>

          {/* bočni info-popup lokacije */}
          <Popover
            open={!!infoAnchor && !!infoSug && infoAnchor.isConnected}
            anchorEl={infoAnchor}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            sx={{ pointerEvents: 'none', ml: 1 }}
            disableRestoreFocus
            disableScrollLock
          >
            {infoSug && (
              <Box sx={{ width: 330, maxWidth: '82vw' }}>
                {infoSug.stop.img && (
                  // eslint-disable-next-line @next/next/no-img-element -- mali popup thumb, preskačemo next/image pipeline
                  <img
                    src={infoSug.stop.img}
                    alt={infoSug.stop.label}
                    style={{ width: '100%', height: 150, objectFit: 'cover', display: 'block' }}
                  />
                )}
                <Box sx={{ p: 1.6 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                    <Typography sx={{ fontSize: 15, fontWeight: 700, color: colors.blue950 }}>
                      {infoSug.stop.label}
                    </Typography>
                    <Chip size="small" label={`~${infoSug.nm} NM`} sx={{ bgcolor: '#eef1fb', fontWeight: 600 }} />
                  </Stack>
                  {longTextOf(infoSug.stop.key, infoSug.content) && (
                    <Typography
                      sx={{
                        fontSize: 12.5,
                        lineHeight: 1.5,
                        color: '#3c4257',
                        mt: 0.7,
                        display: '-webkit-box',
                        WebkitLineClamp: 8,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {longTextOf(infoSug.stop.key, infoSug.content)}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          </Popover>

          {/* desno: živa karta */}
          <Box sx={{ flex: 1, minWidth: 0, height: { xs: 320, md: 520 }, position: 'sticky', top: 110 }}>
            <BuilderMap stops={routeStops} previewStop={infoSug?.stop ?? null} />
          </Box>
        </Stack>
      )}
    </Container>
  );
};

export default CustomBuilder;
