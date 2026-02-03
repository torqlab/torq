import { useTheme } from '@geist-ui/core';
import { useAuthStatus } from '../../hooks/useAuthStatus';
import Preloader from '../../components/Preloader';
import useRemoveAuthUrlParameters from './useRemoveAuthUrlParameters';
import Deferred from '../../components/Deferred';
import Guest from './Guest';
import Member from './Member';

/**
 * Home page component.
 * Shows login button or welcome message based on authentication status.
 * Uses /strava/auth/status endpoint to check auth - does not fetch activities.
 *
 * @returns {JSX.Element} Home page component.
 */
const HomePage = (): JSX.Element => {
  const theme = useTheme();
  const { isAuthenticated, loading } = useAuthStatus();

  useRemoveAuthUrlParameters();

  return (
    <Deferred ready={!loading} fallback={<Preloader />}>
      <main
        style={{
          minHeight: 'calc(100vh - 110px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          backgroundColor: theme.palette.background,
          opacity: loading ? 0 : 1,
          transform: loading ? 'translateY(10px)' : 'translateY(0)',
          transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        }}
        aria-live='polite'
        role='main'
      >
        <section
          style={{
            maxWidth: '800px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {isAuthenticated ? <Member /> : <Guest />}
        </section>
      </main>
    </Deferred>
  );
};

export default HomePage;
