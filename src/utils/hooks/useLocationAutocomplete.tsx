/* eslint-disable react/jsx-no-useless-fragment */
import { startTransition, useActionState, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { getLocations, getPopularLocations, PopularEntry } from '@/actions/locations.actions';
import AutocompleteMultipleChip from '@/components/AutocompleteMultipleChip';
import { AutocompleteOption } from '@/components/AutocompleteMultipleChip/AutocompleteMultipleChip';
import FlagIcon from '@/components/FlagIcon';
import { FormInputProps } from '@/components/Forms/FormInput/FormInput';
import { SearchOptionTag } from '@/components/SearchOptionItem/SearchOptionItem';
import Location from '@/components/SvgIcons/Location';
import Target from '@/components/SvgIcons/Target';
import { LocationModel } from '@/models/locations.model';
import colors from '@/styles/themes/colors';
import { LocationType, LOCATION_TYPE_LABEL_MAP } from '@/types/location.type';
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
}

const RECENT_GROUP = 'Recent searches';
const POPULAR_GROUP = 'Most popular searches';
const SELECTED_GROUP = 'Selected';
const CURRENT_LOCATION_ID = '__current_location__';

const TAG_BY_TYPE: Record<LocationType, SearchOptionTag> = {
  [LocationType.MARINA]: { label: 'marina', color: colors.blue500 },
  [LocationType.REGION]: { label: 'region', color: colors.green500 },
  [LocationType.COUNTRY]: { label: 'country', color: colors.red500 },
};

// Always show the country flag — marinas, regions and countries all get the flag
// of their country (FlagIcon gracefully falls back to a generic Location pin if
// the country code is missing or invalid).
const getLocationIcon = (location: LocationModel) => <FlagIcon countryCode={location.countryCode} />;

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

const useLocationAutocomplete = ({
  isExpanded = true,
  variant = 'expanded',
  selectedValues,
  namesField = 'destinations',
  translations,
  onLocationAdded,
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

  useEffect(() => {
    startTransition(() => {
      actionLocation({
        name: searchString,
        selected: selectedValues,
      });
    });
  }, [searchString, selectedValues]);

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

    selectedIds
      .filter(id => id !== CURRENT_LOCATION_ID)
      .forEach(id => {
        const groupMembers = popularMemberMap.get(id);

        if (groupMembers) {
          groupMembers.forEach(m => {
            if (!expandedIds.includes(m.id)) expandedIds.push(m.id);
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

    expandedIds.forEach(selectId => {
      const location = pool.find(loc => loc.id === selectId);

      if (location) {
        selectedLocationsName.push(location.name);

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

      // 1. Previously selected items (pinned).
      (stateLocation?.content || [])
        .filter(loc => selectedSet.has(loc.id))
        .forEach(loc => push(transformLocationToOption(loc, true)));

      // 2. Recent searches — above popular, only when user actually has any.
      recentSearches
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
            icon: <FlagIcon countryCode={entry.countryCode} />,
            group: POPULAR_GROUP,
            tag: TAG_BY_TYPE[entry.primaryType],
          });
        });

      return collected;
    }

    // When the user is actively typing, show API search results (plus pinned selected).
    (stateLocation?.content || [])
      .filter(loc => selectedSet.has(loc.id))
      .forEach(loc => push(transformLocationToOption(loc, true)));

    (stateLocation?.content || [])
      .filter(loc => !selectedSet.has(loc.id))
      .forEach(loc => push(transformLocationToOption(loc, false)));

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
