'use client';

import { useAuthStatus } from '@/hooks/useAuthStatus';
import Preloader from '@/components/atoms/Preloader';
import Deferred from '@/components/atoms/Deferred';

import useRemoveAuthUrlParams from './useRemoveAuthParams';
import Guest from './Guest';
import Member from './Member';

/**
 * Home page.
 * @returns {JSX.Element} Home page.
 */
const HomePage = (): JSX.Element => {
  const { isAuthenticated, loading } = useAuthStatus();

  useRemoveAuthUrlParams();

  return (
    <Deferred ready={!loading} fallback={<Preloader />}>
      {isAuthenticated ? <Member /> : <Guest />}
    </Deferred>
  );
};

export default HomePage;
