import { Button, Text } from '@geist-ui/core';
import { Activity as ActivityIcon } from '@geist-ui/icons';
import { Link } from 'wouter';
import { useState, useEffect } from 'react';
import { authorizeStrava } from '../api/strava';
import { useAuthStatus } from '../hooks/useAuthStatus';
import Preloader from '../components/Preloader';

/**
 * Guest view.
 * @returns {JSX.Element} Guest view.
 */
const Guest = () => (
  <>
    <Text h1 style={{ margin: '0 0 12px 0', color: '#d8a0c7' }}>
      Strava Activity Image Generator
    </Text>
    <Text
      p
      style={{
        margin: '0 0 24px 0',
        maxWidth: '600px',
        fontSize: '1.25rem',
        fontWeight: 600,
        color: '#555',
        lineHeight: '1.7',
      }}
    >
      PACE is a <span style={{ fontWeight: 600, color: '#8b5a8e', letterSpacing: '0.3px' }}>Personal Activity Canvas Engine</span>. It helps you create beautiful visualizations of your athletic activities. Connect your Strava account to get started and transform your workout data into stunning images!
    </Text>
    <Button
      type='default'
      icon={<ActivityIcon />}
      onClick={authorizeStrava}
      style={{
        marginTop: '32px',
        paddingLeft: '24px',
        paddingRight: '24px',
      }}
      placeholder="Authorize with Strava"
      onPointerEnterCapture={() => undefined}
      onPointerLeaveCapture={() => undefined}
    >
      <span style={{ marginLeft: '8px' }}>Authorize with Strava</span>
    </Button>
  </>
);

/**
 * Member view.
 * @returns {JSX.Element} Member view.
 */
const Member = () => (
  <>
    <Text h1 style={{ margin: '0 0 12px 0', color: '#d8a0c7' }}>
      Welcome to PACE!
    </Text>
    <Text
      style={{
        margin: '0 0 32px 0',
        opacity: 0.8,
        maxWidth: '600px',
        fontSize: '1.25rem',
        fontWeight: 600,
        color: '#555',
        lineHeight: '1.7',
      }}
    >
      You're successfully connected to Strava. Review your activities and generate beautiful AI images for them!
    </Text>
    <Link href="/activities">
      <Button
        type='default'
        icon={<ActivityIcon />}
        style={{
          marginTop: '8px',
          paddingLeft: '24px',
          paddingRight: '24px',
        }}
        placeholder="View Activities"
        onPointerEnterCapture={() => undefined}
        onPointerLeaveCapture={() => undefined}
      >
        <span style={{ marginLeft: '8px' }}>View Activities</span>
      </Button>
    </Link>
  </>
);

/**
 * Home page component.
 * Shows login button or welcome message based on authentication status.
 * Uses /strava/auth/status endpoint to check auth - does not fetch activities.
 *
 * @returns {JSX.Element} Home page component.
 */
const HomePage = (): JSX.Element => {
  const { isAuthenticated, loading } = useAuthStatus();
  const [showContent, setShowContent] = useState(false);

  // Remove OAuth callback parameters from URL (security: don't expose internal OAuth details)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthParams = ['code', 'state', 'scope'];
    // eslint-disable-next-line no-restricted-syntax
    let hasOAuthParams = false;

    oauthParams.forEach((param) => {
      if (urlParams.has(param)) {
        urlParams.delete(param);
        hasOAuthParams = true;
      }
    });

    if (hasOAuthParams) {
      const cleanUrl = window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '');
      window.history.replaceState({}, '', cleanUrl);
    }
  }, []);

  // Handle smooth transition from preloader to content
  useEffect(() => {
    if (!loading) {
      // Small delay to allow preloader fade-out before showing content
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 600);
      return () => { clearTimeout(timer); };
    } else {
      setShowContent(false);
    }
  }, [loading]);

  if (loading || !showContent) {
    return <Preloader />;
  }

  return (
    <main
      style={{
        minHeight: 'calc(100vh - 110px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundColor: 'var(--geist-background)',
        opacity: showContent ? 1 : 0,
        transform: showContent ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
      }}
      aria-live="polite"
      role="main"
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
  );
};

export default HomePage;
