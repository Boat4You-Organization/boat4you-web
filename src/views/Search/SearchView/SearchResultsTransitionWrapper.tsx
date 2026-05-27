'use client';

/* eslint-disable react/jsx-no-useless-fragment */
import { ReactNode } from 'react';

// WORKAROUND — left intentionally as a pass-through.
//
// The original design swapped children for `<BoatsSection />` while
// `useTransition().isPending` was true, giving filter changes a dedicated
// loader during the router.push → RSC-refetch window.
//
// Under Next.js 16 + Turbopack the transition never completes: `isPending`
// flips true on the first filter-change-triggered `startTransition` and stays
// true forever, hiding the real listings indefinitely even though the DOM has
// the fresh cards. Reproduced 21.4.2026 with a second attempt that consumed
// the provider's isPending (same source of truth the startTransition is
// dispatched from) — still stuck. The likely culprit is an upstream change in
// how the App Router marks transitions resolved; nothing in our hook audit
// (useLocationAutocomplete / useModelAutocompleteMultiple / DestinationContent
// are all loop-free now) would keep a transition pending on its own.
//
// The `<Suspense key={JSON.stringify(searchParams)}>` boundary in SearchView
// already re-renders `<BoatsSection />` when filters change (the key changes
// → Suspense resets → fallback is shown until BoatsWrapper resolves), so the
// user still gets a loader. This wrapper is kept as a placeholder so the
// fix can be reinstated in one file once Next.js / React mark transitions
// resolved reliably again.
interface SearchResultsTransitionWrapperProps {
  children: ReactNode;
}

export function SearchResultsTransitionWrapper({ children }: SearchResultsTransitionWrapperProps) {
  return <>{children}</>;
}
