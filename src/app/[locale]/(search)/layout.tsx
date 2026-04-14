import { getLocale } from 'next-intl/server';
import { headers } from 'next/headers';

import { getLoggedInUser } from '@/actions/auth.actions';
import { getAmenities, getCharterTypes, getFilters, getManufacturers, getServices } from '@/actions/catalogue.actions';
import HeaderSearch from '@/components/HeaderSearch';
import HeaderSearchMobile from '@/components/HeaderSearchMobile';
import { MANUFACTURERS_PAGE_SIZE } from '@/config/constants.config';
import { CatalogueData } from '@/models/catalogue.model';
import { Currency } from '@/models/user.model';
import { isMobileUserAgent } from '@/utils/static/device';

interface HeaderSearchLayoutProps {
  children: React.ReactNode;
}

const HeaderSearchLayout = async ({ children }: HeaderSearchLayoutProps) => {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent');
  const isMobile = isMobileUserAgent(userAgent);

  const locale = await getLocale();
  const user = await getLoggedInUser();

  const [amenities, charterTypes, manufacturersResponse, services, catalogueFilters] = await Promise.all([
    getAmenities(),
    getCharterTypes(),
    getManufacturers(undefined, { page: 0, size: MANUFACTURERS_PAGE_SIZE }),
    getServices(),
    getFilters(Currency.EUR, locale.toUpperCase()),
  ]);

  const catalogueData: CatalogueData = {
    amenities,
    charterTypes,
    manufacturers: manufacturersResponse.content || [],
    services,
  };

  return (
    <>
      {isMobile ? (
        <HeaderSearchMobile catalogueData={catalogueData} catalogueFilters={catalogueFilters} />
      ) : (
        <HeaderSearch user={user} />
      )}
      {children}
    </>
  );
};

export default HeaderSearchLayout;
