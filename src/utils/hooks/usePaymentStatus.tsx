import { useMemo } from 'react';

import { useTranslations } from 'next-intl';

import { PaymentPhase } from '@/models/reservation.model';

interface NextInstallment {
  amount: number;
  deadline: string;
  phaseId: number;
}

interface PaymentStatus {
  paidTotal: number;
  installmentDisplay: string;
  nextInstallment: NextInstallment | null;
  isFullyPaid: boolean;
}

const usePaymentStatus = (phases: PaymentPhase[]): PaymentStatus => {
  const t = useTranslations('common');

  return useMemo(() => {
    if (!phases?.length) {
      return {
        paidTotal: 0,
        installmentDisplay: '0/0 installments',
        nextInstallment: null,
        isFullyPaid: false,
      };
    }

    const paidPhases = phases.filter(phase => phase.paidOn && phase.paidOn.trim() !== '');
    const unpaidPhases = phases.filter(phase => !phase.paidOn || phase.paidOn.trim() === '');

    const paidTotal = Number(paidPhases.reduce((sum, phase) => sum + phase.amount, 0).toFixed(2));

    const nextPhase =
      unpaidPhases.length > 0
        ? unpaidPhases.reduce((earliest, current) =>
            new Date(current.deadline).getTime() < new Date(earliest.deadline).getTime() ? current : earliest
          )
        : null;

    const nextInstallment = nextPhase
      ? {
          amount: nextPhase.amount,
          deadline: nextPhase.deadline,
          phaseId: nextPhase.id,
        }
      : null;

    const isFullyPaid = paidPhases.length === phases.length;
    const installmentDisplay =
      isFullyPaid && phases.length === 1
        ? t('paymentCompleted')
        : t('installmentsProgress', {
            paid: paidPhases.length.toString(),
            total: phases.length.toString(),
          });

    return {
      paidTotal,
      installmentDisplay,
      nextInstallment,
      isFullyPaid,
    };
  }, [phases, t]);
};

export default usePaymentStatus;
