import { Suspense } from 'react';

import { Container } from '@mui/material';
import { getLocale } from 'next-intl/server';

import { getAmenities, getCharterTypes, getFilters, getManufacturers, getServices } from '@/actions/catalogue.actions';
import BoatsSection from '@/components/Loaders/SearchPageLoader/BoatsSection';
import { MANUFACTURERS_PAGE_SIZE } from '@/config/constants.config';
import { AllSearchParams } from '@/config/form-models.config';
import { CatalogueData } from '@/models/catalogue.model';
import { Currency } from '@/models/user.model';

import BoatsWrapper from './BoatsWrapper';
import FiltersSectionV2 from './FiltersSectionV2';
import { SearchResultsTransitionWrapper } from './SearchResultsTransitionWrapper';
import { SearchTransitionProvider } from './SearchTransitionContext';
import styles from './SearchView.module.scss';

interface SearchViewProps {
  searchParams: AllSearchParams;
}

const SearchView = async ({ searchParams }: SearchViewProps) => {
  const locale = await getLocale();
  const currency = (searchParams.currency as Currency) || Currency.EUR;

  const [amenities, charterTypes, manufacturersResponse, services, catalogueFilters] = await Promise.all([
    getAmenities(),
    getCharterTypes(),
    getManufacturers('', { page: 0, size: MANUFACTURERS_PAGE_SIZE }),
    getServices(),
    getFilters(currency, locale.toUpperCase()),
  ]);

  const catalogueData: CatalogueData = {
    amenities,
    charterTypes,
    manufacturers: manufacturersResponse.content || [],
    services,
  };

  const suspenseKey = JSON.stringify(searchParams);

  return (
    <Container maxWidth="xl" disableGutters classes={{ root: styles.root }} className={styles.container}>
      <SearchTransitionProvider>
        <FiltersSectionV2 catalogueData={catalogueData} catalogueFilters={catalogueFilters} />
        <SearchResultsTransitionWrapper>
          <Suspense key={suspenseKey} fallback={<BoatsSection />}>
            <BoatsWrapper searchParams={searchParams} />
          </Suspense>
        </SearchResultsTransitionWrapper>
      </SearchTransitionProvider>
    </Container>
  );
};

export default SearchView;
