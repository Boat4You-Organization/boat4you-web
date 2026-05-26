import React from 'react';

import { Box, Divider, Grid, List, ListItem, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import Amenities from '@/components/SvgIcons/Amenities';
import Check from '@/components/SvgIcons/Check';
import {
  YACHT_EQUIPMENT_CATEGORY_TYPE_ARRAY,
  YACHT_EQUIPMENT_CATEGORY_TYPE_LABEL_MAP,
  YachtAmenitiesKey,
  YachtAmenitiesModel,
  YachtEquipmentCategoryType,
} from '@/models/yacht-amenities.model';
import { YachtModel } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';

interface AmenitiesTabProps {
  yacht: YachtModel;
}

// Split a free-text amenities/toys block on newlines and drop empty lines.
// Trims each line so the source text can use indented/aligned columns
// without surfacing whitespace as a checkmark item.
const splitTextLines = (text: string | null | undefined): string[] =>
  (text || '')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

const AmenitiesTab = ({ yacht }: AmenitiesTabProps) => {
  const t = useTranslations('yacht');
  const amenitiesT = useTranslations('yacht.amenitiesList');

  // Render an amenity row's label. Matched rows use the predefined
  // Equipment.labelCode → translation. Unmatched rows (partner-synced
  // equipment with no matching Equipment record) fall back to the raw
  // `name` field the partner sent — better to surface "Coffee machine"
  // verbatim than to swallow it because our predefined catalog hasn't
  // mapped it yet.
  const renderAmenityLabel = (amenity: YachtAmenitiesModel): string => {
    if (amenity.equipment?.labelCode) {
      const translated = amenitiesT(amenity.equipment.labelCode as YachtAmenitiesKey);

      // next-intl returns the key itself when the translation is missing —
      // fall through to the partner name in that case.
      if (translated && translated !== amenity.equipment.labelCode) return translated;
    }

    return amenity.name || amenity.equipment?.labelCode || '';
  };

  // Bucket every amenity into one of the 9 modern categories. Rows whose
  // Equipment.category is a legacy bucket (SALOON_AND_CABINS,
  // NAVIGATION_AND_SAFETY) get re-routed to a sensible default so they
  // surface somewhere instead of being dropped — pre-V1_73 yacht_equipment
  // rows would otherwise vanish from the page.
  const bucketCategory = (amenity: YachtAmenitiesModel): YachtEquipmentCategoryType => {
    const cat = amenity.equipment?.category;

    if (cat === YachtEquipmentCategoryType.SALOON_AND_CABINS) return YachtEquipmentCategoryType.INTERIOR;

    if (cat === YachtEquipmentCategoryType.NAVIGATION_AND_SAFETY) return YachtEquipmentCategoryType.NAVIGATION;

    if (cat && cat in YACHT_EQUIPMENT_CATEGORY_TYPE_LABEL_MAP) return cat as YachtEquipmentCategoryType;

    // Unmatched partner row (Equipment.category null) → Deck is the most
    // forgiving catch-all in the reference design (the bulk of unmatched
    // partner rows are anchor / fender / mooring deck gear anyway).
    return YachtEquipmentCategoryType.DECK;
  };

  const renderCategoryRow = (
    category: YachtEquipmentCategoryType,
    items: YachtAmenitiesModel[],
    showDivider: boolean
  ) => {
    if (items.length === 0) return null;

    const sorted = [...items].sort((a, b) =>
      renderAmenityLabel(a).localeCompare(renderAmenityLabel(b), undefined, { sensitivity: 'base' })
    );

    return (
      <React.Fragment key={category}>
        {showDivider && <Divider sx={{ borderColor: colors.black100 }} />}
        <Grid container component="section" spacing={{ xs: 1.5, md: 3 }} py={2.5} alignItems="flex-start">
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="body1" fontWeight={700} color={colors.black950}>
              {t(YACHT_EQUIPMENT_CATEGORY_TYPE_LABEL_MAP[category])}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 9 }}>
            <Grid container columnSpacing={{ xs: 2, md: 4 }}>
              {sorted.map(amenity => {
                const qty = amenity.quantity ? Number(amenity.quantity) : null;
                const qtyPrefix = qty && qty > 1 ? `${qty} x ` : '';
                const label = qtyPrefix + renderAmenityLabel(amenity);
                const comment = amenity.comment?.trim();

                return (
                  <Grid key={`${category}-${amenity.id}`} size={{ xs: 12, sm: 6 }}>
                    <ListItem
                      sx={{
                        px: amenity.highlight ? 1 : 0,
                        py: 0.5,
                        gap: 1,
                        alignItems: 'flex-start',
                        backgroundColor: amenity.highlight ? colors.yellow50 : 'transparent',
                        borderRadius: amenity.highlight ? 1 : 0,
                      }}
                    >
                      <Box pt="2px" flexShrink={0}>
                        <Check size={18} fill={colors.black400} />
                      </Box>
                      <Box>
                        <Typography variant="body2" color={colors.black700} fontWeight={amenity.highlight ? 600 : 400}>
                          {label}
                        </Typography>
                        {comment && (
                          <Typography variant="caption" color={colors.black500} fontStyle="italic">
                            {comment}
                          </Typography>
                        )}
                      </Box>
                    </ListItem>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  };

  // Render a free-text block as a labelled checkmark column. Used only on
  // custom yachts — the admin pastes a multi-line list per category so we
  // can give owners' bespoke wording (named brands, exact bed dimensions,
  // etc.) verbatim. Falls back to null when the column is empty so the
  // grid collapses to a single populated column instead of emitting an
  // orphan header.
  const renderCustomTextList = (label: string, items: string[], keyPrefix: string) => {
    if (items.length === 0) return null;

    return (
      <Grid component="section" size={{ xs: 12, md: 6 }}>
        <Typography variant="body1" fontWeight={700} color={colors.black950} pb={1.5}>
          {label}
        </Typography>
        <List dense disablePadding>
          {items.map((line, idx) => (
            <ListItem key={`${keyPrefix}-${idx}`} sx={{ px: 0, py: 0.4, gap: 1, alignItems: 'flex-start' }}>
              <Check size={18} fill={colors.black400} />
              <Typography variant="body2" color={colors.black700}>
                {line}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Grid>
    );
  };

  // Branch on yacht.custom — the two paths share the same outer header +
  // grid layout but pull data from different sources:
  //   - external yachts → yacht.amenities[] (predefined Equipment dropdown)
  //   - custom yachts → customDetails.{amenitiesText,toysText} (admin's
  //     free-text paste, split on newlines)
  if (yacht.custom) {
    const amenityItems = splitTextLines(yacht.customDetails?.amenitiesText);
    const toyItems = splitTextLines(yacht.customDetails?.toysText);

    if (amenityItems.length === 0 && toyItems.length === 0) return null;

    return (
      <Stack direction="column" spacing={3}>
        <Typography
          component="h2"
          variant="h3"
          fontWeight={700}
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap={1}
        >
          <Amenities variant="secondary" size={32} />
          {t('amenities')}
        </Typography>

        <Grid container spacing={{ xs: 3, md: 4 }} alignItems="flex-start">
          {renderCustomTextList(t('saloonAndCabins'), amenityItems, 'amenity')}
          {renderCustomTextList(t('entertainment'), toyItems, 'toy')}
        </Grid>
      </Stack>
    );
  }

  const amenities = yacht.amenities || [];

  if (amenities.length === 0) return null;

  // Bucket once, then walk the canonical render order so empty categories
  // collapse silently without leaving header rows behind.
  const buckets: Record<string, YachtAmenitiesModel[]> = {};

  amenities.forEach(amenity => {
    const cat = bucketCategory(amenity);

    if (!buckets[cat]) buckets[cat] = [];

    buckets[cat].push(amenity);
  });

  const populatedRows = YACHT_EQUIPMENT_CATEGORY_TYPE_ARRAY.filter(({ type }) => (buckets[type] || []).length > 0);

  return (
    <Stack direction="column" spacing={3}>
      <Typography
        component="h2"
        variant="h3"
        fontWeight={700}
        display="flex"
        flexDirection="row"
        alignItems="center"
        gap={1}
      >
        <Amenities variant="secondary" size={32} />
        {t('amenities')}
      </Typography>

      <Box
        sx={{
          px: { xs: 0, md: 1 },
          py: { xs: 1, md: 2 },
        }}
      >
        {populatedRows.map(({ type }, idx) => renderCategoryRow(type, buckets[type] || [], idx > 0))}
      </Box>
    </Stack>
  );
};

export default AmenitiesTab;
