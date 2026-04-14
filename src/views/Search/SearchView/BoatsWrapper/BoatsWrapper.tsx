import React from 'react';

import { getLocale } from 'next-intl/server';

import { getLoggedInUser } from '@/actions/auth.actions';
import { getInquiry } from '@/actions/yacht.actions';
import { AllSearchParams } from '@/config/form-models.config';
import { Currency, UserRoleName } from '@/models/user.model';
import { fetchYachts } from '@/services/yacht.service';

import BoatsSection from './BoatsSection';

interface BoatsWrapperProps {
  searchParams: AllSearchParams;
}

const BoatsWrapper = async ({ searchParams }: BoatsWrapperProps) => {
  const locale = await getLocale();
  const user = await getLoggedInUser();

  const currency = user?.currency || (searchParams.currency as Currency) || Currency.EUR;

  const data = await fetchYachts(searchParams, currency, locale);

  let inquiry = null;

  if (user && user.roles[0].roleName !== UserRoleName.USER && searchParams.inquiryId) {
    inquiry = await getInquiry(searchParams.inquiryId);
  }

  return <BoatsSection data={data} user={user} inquiry={inquiry} />;
};

export default BoatsWrapper;
