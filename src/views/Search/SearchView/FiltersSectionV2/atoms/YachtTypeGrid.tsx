'use client';

import { Box, ButtonBase } from '@mui/material';
import { useTranslations } from 'next-intl';

import { VesselType } from '@/models/yacht.model';
import { searchV2, searchV2Type } from '@/styles/themes/searchV2';

import YachtTypeIcon from './YachtTypeIcon';

interface YachtTypeGridProps {
  selected: VesselType[];
  onToggle: (type: VesselType) => void;
  /** Per-type counts. Pass `undefined` (or empty map) when backend
   *  aggregations aren't available; tiles render the count slot empty
   *  so the layout doesn't shift once data arrives. */
  counts?: Partial<Record<VesselType, number>>;
}

/**
 * Yacht-type tiles laid out in a 3-column grid per design handoff.
 * Each tile: icon, label, optional count. Selected = filled `--ink`,
 * white text + icon. Multiple selection allowed (parent maintains a
 * Set / array; tile click toggles).
 *
 * The displayed types are an opinionated subset of [VesselType] that
 * covers the bulk of the catalogue; long-tail types (rubber boat,
 * trimaran, mini cruiser) are intentionally omitted from the grid to
 * keep the sidebar scannable. Users wanting them can still filter via
 * URL `boatTypes=` directly.
 */
const TILES: Array<{ id: VesselType; labelKey: string }> = [
  { id: VesselType.SAILING_YACHT, labelKey: 'sailing' },
  { id: VesselType.CATAMARAN, labelKey: 'catamaran' },
  { id: VesselType.MOTORBOAT, labelKey: 'motorboat' },
  { id: VesselType.MOTOR_YACHT, labelKey: 'motoryacht' },
  { id: VesselType.GULET, labelKey: 'gulet' },
  { id: VesselType.POWER_CATAMARAN, labelKey: 'powerCat' },
];

const YachtTypeGrid = ({ selected, onToggle, counts }: YachtTypeGridProps) => {
  const t = useTranslations('filters.vesselType');
  const selectedSet = new Set(selected);

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
      {TILES.map(tile => {
        const on = selectedSet.has(tile.id);
        const count = counts?.[tile.id];

        return (
          <ButtonBase
            key={tile.id}
            onClick={() => onToggle(tile.id)}
            sx={{
              padding: '10px 4px',
              borderRadius: '8px',
              background: on ? searchV2.brand : '#fff',
              color: on ? '#fff' : searchV2.ink,
              border: `1px solid ${on ? searchV2.brand : searchV2.line}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              fontFamily: searchV2Type.fontFamily,
              transition: 'background .12s ease, color .12s ease, border-color .12s ease',
              '&:hover': { borderColor: on ? searchV2.brand : searchV2.lineStrong },
            }}
          >
            <Box
              component="span"
              sx={{
                color: on ? '#fff' : searchV2.brand,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 20,
                height: 20,
              }}
            >
              <YachtTypeIcon type={tile.id} size={20} />
            </Box>
            <Box component="span" sx={{ fontSize: 10.5, fontWeight: 700 }}>
              {t(tile.labelKey as Parameters<typeof t>[0])}
            </Box>
            <Box
              component="span"
              sx={{
                fontSize: 9.5,
                opacity: 0.65,
                fontVariantNumeric: 'tabular-nums',
                minHeight: 12,
              }}
            >
              {count != null ? count.toLocaleString('en-US') : ' '}
            </Box>
          </ButtonBase>
        );
      })}
    </Box>
  );
};

export default YachtTypeGrid;
