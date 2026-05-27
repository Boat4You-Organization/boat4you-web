/* eslint-disable react/jsx-no-useless-fragment, no-restricted-syntax, no-nested-ternary */
import { startTransition, useActionState, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Box } from '@mui/material';

import { PopularEntry, getLocations, getPopularLocations } from '@/actions/locations.actions';
import AutocompleteMultipleChip from '@/components/AutocompleteMultipleChip';
import { AutocompleteOption } from '@/components/AutocompleteMultipleChip/AutocompleteMultipleChip';
import FlagIcon from '@/components/FlagIcon';
import { FormInputProps } from '@/components/Forms/FormInput/FormInput';
import { SearchOptionTag } from '@/components/SearchOptionItem/SearchOptionItem';
import Location from '@/components/SvgIcons/Location';
import Target from '@/components/SvgIcons/Target';
import { LocationModel } from '@/models/locations.model';
import colors from '@/styles/themes/colors';
import { LOCATION_TYPE_LABEL_MAP, LocationType } from '@/types/location.type';
import { PaginatedResponse } from '@/types/response.type';
import useRecentSearches from '@/utils/hooks/useRecentSearches';

interface UseLocationAutocompleteProps {
  isExpanded?: boolean;
  variant?: 'expanded' | 'compact';
  selectedValues?: string[];
  namesField?: string;
  translations?: {
    whereAreYouGoing: string;
    where: string;
    searchLocations: string;
    aroundCurrentLocation?: string;
    locating?: string;
    locationError?: string;
  };
  /**
   * Fires once every time the user adds one or more locations (useful for
   * auto-advancing the user to the date picker, for example).
   */
  onLocationAdded?: () => void;
  /**
   * Keep the suggestions dropdown always visible (no focus required).
   * Used in the mobile full-screen picker modal so recent + popular are
   * shown as soon as the modal opens.
   */
  alwaysOpen?: boolean;
}

const RECENT_GROUP = 'Recent searches';
const POPULAR_GROUP = 'Most popular searches';
const SELECTED_GROUP = 'Selected';
const CURRENT_LOCATION_ID = '__current_location__';

const TAG_BY_TYPE: Record<LocationType, SearchOptionTag> = {
  // Booking.com-inspired palette (primary blue / Genius gold / deals
  // green) — clearly distinct from boataround's green/red and readable
  // on a white background unlike the earlier blue950 country tag.
  [LocationType.MARINA]: { label: 'marina', color: colors.blue500 },
  [LocationType.REGION]: { label: 'region', color: colors.mandalay900 },
  [LocationType.COUNTRY]: { label: 'country', color: colors.green500 },
};

// Marinas and countries get a country flag; regions get the generic map pin
// regardless of country_code. A flag next to "Split region" implied this row
// was a country-specific entry, when in fact the dropdown already groups it
// under "Region" + carries the smeđi `region` tag. The pin reads more like
// "this is an area" and matches the MAP fallback users were already
// rewarded with on legacy rows that lacked country_code.
const getLocationIcon = (location: LocationModel) => {
  if (location.locationType === LocationType.REGION) {
    return (
      <Box
        sx={{
          display: 'flex',
          '& > div:first-of-type': {
            width: 20,
            height: 20,
          },
        }}
      >
        {/* FlagIcon with empty/invalid countryCode falls back to the
            generic Location pin SVG — reuse that path so we keep one icon
            component end-to-end. */}
        <FlagIcon countryCode={null} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        '& > div:first-of-type': {
          width: 20,
          height: 20,
        },
      }}
    >
      <FlagIcon countryCode={location.countryCode} />
    </Box>
  );
};

const transformLocationToOption = (
  location: LocationModel,
  isSelected: boolean,
  overrideGroup?: string,
  iconOverride?: React.ReactNode
): AutocompleteOption => {
  const baseGroup = LOCATION_TYPE_LABEL_MAP[location.locationType];

  return {
    id: location.id,
    label: location.name,
    icon: iconOverride ?? getLocationIcon(location),
    group: isSelected ? SELECTED_GROUP : overrideGroup || baseGroup,
    tag: TAG_BY_TYPE[location.locationType],
  };
};

/**
 * Collapse paired REGION duplicates that come from the legacy dual-source
 * import (one row per provider per region — e.g. "Dubrovnik / Montenegro"
 * with no country_code AND "Dubrovnik region" with HR). Both render in the
 * autocomplete and confuse users.
 *
 * Strategy: bucket REGION rows by their first lowercase token (split on
 * whitespace OR `/`); within each bucket prefer the row WITH a country_code.
 * Those rows also carry the "<area> region" naming convention, which feeds
 * the search-results H1 ("Catamaran charter in Split region") so the page
 * title still reads as a region rather than a city. The map-pin icon is
 * applied uniformly via getLocationIcon, so the visual treatment matches
 * regardless of which row wins.
 *
 * Non-REGION rows pass through untouched.
 */
const dedupeRegionDuplicates = (locations: LocationModel[]): LocationModel[] => {
  const primaryByKey = new Map<string, string>(); // key → location id we keep

  for (const loc of locations) {
    if (loc.locationType !== LocationType.REGION) continue;

    const key = loc.name.toLowerCase().split(/[\s/]/).filter(Boolean)[0];

    if (!key) continue;

    const winnerId = primaryByKey.get(key);

    if (!winnerId) {
      primaryByKey.set(key, loc.id);
      continue;
    }

    const winner = locations.find(l => l.id === winnerId);

    if (winner && !winner.countryCode && loc.countryCode) {
      primaryByKey.set(key, loc.id);
    }
  }

  return locations.filter(loc => {
    if (loc.locationType !== LocationType.REGION) return true;

    const key = loc.name.toLowerCase().split(/[\s/]/).filter(Boolean)[0];

    if (!key) return true;

    return primaryByKey.get(key) === loc.id;
  });
};

const useLocationAutocomplete = ({
  isExpanded = true,
  variant = 'expanded',
  selectedValues,
  namesField = 'destinations',
  translations,
  onLocationAdded,
  alwaysOpen = false,
}: UseLocationAutocompleteProps) => {
  const [stateLocation, actionLocation] = useActionState(getLocations, undefined);
  const { setValue, getValues } = useFormContext();
  const [searchString, setSearchString] = useState<string>('');
  const [popularEntries, setPopularEntries] = useState<PopularEntry[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { recentSearches, addRecentSearch } = useRecentSearches();

  const aroundLabel = translations?.aroundCurrentLocation || 'Around current location';
  const locatingLabel = translations?.locating || 'Locating…';
  const locationErrorLabel = translations?.locationError || "Couldn't get your location";

  const handleAroundCurrentLocation = () => {
    if (isLocating) return;

    setLocationError(null);

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocationError(locationErrorLabel);

      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async position => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await res.json();
          const countryCode: string | undefined = data?.countryCode;
          const principalSubdivision: string | undefined = data?.principalSubdivision;
          const city: string | undefined = data?.city || data?.locality;

          // Try most-specific first (city), then region, then country.
          const queries = [city, principalSubdivision, data?.countryName].filter(Boolean) as string[];
          const matches: LocationModel[] = [];

          for (const q of queries) {
            // eslint-disable-next-line no-await-in-loop
            const locRes = await fetch(
              `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/locations?name=${encodeURIComponent(q)}&size=20`
            );
            // eslint-disable-next-line no-await-in-loop
            const json: PaginatedResponse<LocationModel> = await locRes.json();
            const filtered = (json.content || []).filter(
              loc => !countryCode || !loc.countryCode || loc.countryCode === countryCode
            );

            filtered.forEach(loc => {
              if (!matches.find(m => m.id === loc.id)) matches.push(loc);
            });

            if (matches.length >= 5) break;
          }

          if (matches.length === 0) {
            setLocationError(locationErrorLabel);
          } else {
            // Auto-select the best match (most specific first) as if the user had picked it.
            const best = matches[0];
            const currentIds: string[] = getValues(namesField === 'destinations' ? 'did' : namesField) || [];
            const currentNames: string[] = getValues(namesField) || [];

            if (!currentIds.includes(best.id)) {
              setValue(namesField === 'destinations' ? 'did' : namesField, [...currentIds, best.id]);
              setValue(namesField, [...currentNames, best.name]);
              addRecentSearch(best);
              onLocationAdded?.();
            }
          }
        } catch {
          setLocationError(locationErrorLabel);
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        setLocationError(locationErrorLabel);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  // Depend on the serialized list (string), not the array reference — consumers
  // often pass a react-hook-form `watch('did')` here, which returns a new array
  // reference every render. Using the reference would re-fire the server action
  // on every parent render and, via setState, create an infinite POST loop.
  const selectedValuesKey = (selectedValues || []).join(',');

  useEffect(() => {
    startTransition(() => {
      actionLocation({
        name: searchString,
        selected: selectedValues,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchString, selectedValuesKey]);

  // Popular searches are fixed — fetch once on mount.
  useEffect(() => {
    let cancelled = false;

    getPopularLocations()
      .then(result => {
        if (!cancelled) setPopularEntries(result);
      })
      .catch(() => {
        if (!cancelled) setPopularEntries([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleInputChange = (value: string): void => {
    setSearchString(value);
  };

  const handleSelectionChange = (selectedIds: string[], previousIds: string[] = []) => {
    // Intercept the special "Around current location" pseudo-option — it is
    // not a real selectable value, it triggers the geolocation flow instead.
    if (selectedIds.includes(CURRENT_LOCATION_ID) && !previousIds.includes(CURRENT_LOCATION_ID)) {
      handleAroundCurrentLocation();

      return previousIds;
    }

    // Expand any popular-entry synthetic ids (e.g. "popular:lefkada-region") to
    // their underlying real location ids. A single click on a group entry then
    // adds all its members (Lefkada + Marina Preveza) to the selection.
    const popularMemberMap = new Map<string, LocationModel[]>();

    popularEntries.forEach(entry => popularMemberMap.set(entry.id, entry.members));

    const expandedIds: string[] = [];
    // Remember which popular entry a member id expanded from, so we can
    // surface that entry's displayLabel (e.g. "Split Region") rather than
    // the raw backend location name ("Split"). Otherwise the user sees a
    // different word than the one they tapped — confusing.
    const popularLabelByMemberId = new Map<string, string>();

    selectedIds
      .filter(id => id !== CURRENT_LOCATION_ID)
      .forEach(id => {
        const groupMembers = popularMemberMap.get(id);
        const popularEntry = popularEntries.find(e => e.id === id);

        if (groupMembers) {
          groupMembers.forEach(m => {
            if (!expandedIds.includes(m.id)) expandedIds.push(m.id);

            if (popularEntry) popularLabelByMemberId.set(m.id, popularEntry.displayLabel);
          });
        } else if (!expandedIds.includes(id)) {
          expandedIds.push(id);
        }
      });

    const pool: LocationModel[] = [
      ...(stateLocation?.content || []),
      ...popularEntries.flatMap(e => e.members),
      ...recentSearches,
    ];

    const selectedLocationsName: string[] = [];
    const newlyAdded: LocationModel[] = [];
    // Dedupe by display label so dual-source region pairs (Ionian + Ionian
    // Islands → "Ionian Region", Split + Split region → "Split Region") show
    // up as ONE chip in the search bar even though `did` keeps both backend
    // ids so search hits both providers.
    const seenLabels = new Set<string>();

    expandedIds.forEach(selectId => {
      const location = pool.find(loc => loc.id === selectId);

      if (location) {
        const popularLabel = popularLabelByMemberId.get(selectId);
        const label = popularLabel ?? location.name;
        const labelKey = label.toLowerCase();

        if (!seenLabels.has(labelKey)) {
          seenLabels.add(labelKey);
          selectedLocationsName.push(label);
        }

        if (!previousIds.includes(selectId)) {
          newlyAdded.push(location);
        }
      }
    });

    setValue(namesField, selectedLocationsName);

    // Track each newly added location in recent searches.
    newlyAdded.forEach(loc => addRecentSearch(loc));

    if (newlyAdded.length > 0) {
      onLocationAdded?.();
    }

    return expandedIds;
  };

  const buildOptions = (currentSelectedIds: string[]): AutocompleteOption[] => {
    const selectedSet = new Set(currentSelectedIds);
    const collected: AutocompleteOption[] = [];
    const seen = new Set<string>();

    const push = (option: AutocompleteOption) => {
      if (seen.has(option.id)) return;

      seen.add(option.id);
      collected.push(option);
    };

    // When input is empty we show a minimal curated list only:
    //   Around current location → Recent searches → Most popular (Croatia, Greece, Split Region, Italy, Lefkada).
    // The generic API dump is hidden to keep the dropdown clean (user preference).
    if (!searchString) {
      // 0. "Around current location" — always at the very top.
      const aroundLabelText = isLocating
        ? locatingLabel
        : locationError
          ? `${aroundLabel} — ${locationError}`
          : aroundLabel;

      push({
        id: CURRENT_LOCATION_ID,
        label: aroundLabelText,
        icon: <Target props={{ width: 20, height: 20 }} />,
      });

      // 1. Previously selected items (pinned). For popular dual-source pairs
      //    where every member id is currently selected, render ONE row using
      //    the popular displayLabel + the primary member id — the autocomplete
      //    chip then collapses to a single chip (e.g. "Ionian Region") instead
      //    of two stacked rows ("Ionian" + "Ionian Islands"). The hidden
      //    duplicate id is still in form `did`, so backend search keeps hitting
      //    both providers; clearing the chip wipes the whole `did` value.
      const popularSelectedMemberIds = new Set<string>();

      popularEntries.forEach(entry => {
        const memberIds = entry.members.map(m => m.id);
        const allSelected = memberIds.length > 0 && memberIds.every(id => selectedSet.has(id));

        if (!allSelected) return;

        memberIds.forEach(id => popularSelectedMemberIds.add(id));

        const primary = entry.members[0];

        if (primary) {
          push({
            id: primary.id,
            label: entry.displayLabel,
            icon: getLocationIcon(primary),
            group: SELECTED_GROUP,
            tag: TAG_BY_TYPE[entry.primaryType],
          });
        }
      });

      (stateLocation?.content || [])
        .filter(loc => selectedSet.has(loc.id) && !popularSelectedMemberIds.has(loc.id))
        .forEach(loc => push(transformLocationToOption(loc, true)));

      // 2. Recent searches — above popular, only when user actually has any.
      //    Run the same REGION dedup as the typing path: picking the bundled
      //    "Split Region" popular entry adds BOTH backend rows (r-5 "Split
      //    region" + r-189 "Split") to recents, which otherwise stack as two
      //    near-identical region chips here. dedupeRegionDuplicates collapses
      //    them to one (keeps the country_code-bearing row).
      dedupeRegionDuplicates(recentSearches)
        .filter(loc => !selectedSet.has(loc.id))
        .forEach(loc => push(transformLocationToOption(loc, false, RECENT_GROUP)));

      // 3. Most popular — the fixed entries configured in popular-searches.config.ts.
      //    Each entry may expand to multiple locations (e.g. "Lefkada Region" →
      //    Lefkada + Marina Preveza). The entry is hidden once all its members
      //    are already selected, so it doesn't sit there as a no-op.
      popularEntries
        .filter(entry => entry.members.some(m => !selectedSet.has(m.id)))
        .forEach(entry => {
          push({
            id: entry.id,
            label: entry.displayLabel,
            // Same 20×20 wrapper as getLocationIcon — matches the boat-type
            // SVG size so both dropdowns read as the same visual weight.
            icon: (
              <Box
                sx={{
                  display: 'flex',
                  '& > div:first-of-type': {
                    width: 20,
                    height: 20,
                  },
                }}
              >
                <FlagIcon countryCode={entry.countryCode} />
              </Box>
            ),
            group: POPULAR_GROUP,
            tag: TAG_BY_TYPE[entry.primaryType],
          });
        });

      return collected;
    }

    // When the user is actively typing, show API search results (plus pinned
    // selected). Run REGION dedup so paired duplicates from the dual-source
    // import (e.g. "Dubrovnik / Montenegro" + "Dubrovnik region") collapse to
    // one row.
    const apiLocations = dedupeRegionDuplicates(stateLocation?.content || []);

    apiLocations.filter(loc => selectedSet.has(loc.id)).forEach(loc => push(transformLocationToOption(loc, true)));

    apiLocations.filter(loc => !selectedSet.has(loc.id)).forEach(loc => push(transformLocationToOption(loc, false)));

    return collected;
  };

  const renderLocationInput: FormInputProps['renderInput'] = ({ field }) => {
    const selectedIds: string[] = field.value || [];
    const options = buildOptions(selectedIds);

    return (
      <AutocompleteMultipleChip
        value={field.value}
        inputValue={searchString}
        options={options}
        groupBy={option => option.group || ''}
        onChange={(newValue: string[]) => {
          const previous = field.value || [];
          const filtered = handleSelectionChange(newValue, previous);

          field.onChange(filtered);
          setSearchString('');
        }}
        placeholder={
          variant === 'compact'
            ? translations?.whereAreYouGoing || 'Where are you going?'
            : [translations?.where || 'Where', translations?.searchLocations || 'Search locations']
        }
        icon={Location}
        onInputChange={handleInputChange}
        variant={isExpanded ? 'expanded' : 'compact'}
        alwaysOpen={alwaysOpen}
        TextFieldProps={{
          variant: 'outlined',
          fullWidth: true,
        }}
      />
    );
  };

  return renderLocationInput;
};

export default useLocationAutocomplete;
export { transformLocationToOption };
export type { PaginatedResponse };
