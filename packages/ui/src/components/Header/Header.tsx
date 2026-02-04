import { useCallback } from 'react';
import { Text, Button, useTheme, Page } from '@geist-ui/core';
import { useLocation } from 'wouter';
import { LogOut } from '@geist-ui/icons';

import { logout } from '../../utils/auth';
import { useAuth } from '../../hooks/useAuth';
import ThemeSwitcher from '../ThemeSwitcher';
import ActivityEmoji from '../ActivityEmoji';

interface HeaderProps {
  onThemeChange: (theme: 'light' | 'dark') => void;
}

/**
 * Application header with navigation and theme switcher.
 * 
 * @param {HeaderProps} props - Component props.
 * @param {Function} props.onThemeChange - Callback to change theme.
 * @returns {JSX.Element} Header component.
 */
export default function Header({ onThemeChange }: HeaderProps) {
  const theme = useTheme();
  const [location, setLocation] = useLocation();
  const { isAuthenticated, loading } = useAuth();

  /**
   * Handles user logout.
   */
  const handleLogout = useCallback(() => {
    logout().catch(console.error);
  }, []);

  return (
    <Page.Header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        borderBottom: `1px solid ${theme.palette.border}`,
        backgroundColor: theme.palette.background,
        zIndex: 999,
      }}
    >
      <Text
        h3
        style={{
          margin: 0,
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
        onClick={() => {
          if (location !== '/') {
            setLocation('/');
          }
        }}
      >
        <ActivityEmoji />
        {'\u00A0'}
        PACE
      </Text>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {!loading && isAuthenticated && (
          <Button
            type='default'
            icon={<LogOut />}
            onClick={handleLogout}
            auto
            scale={0.6}
            aria-label='Logout'
            placeholder='Logout'
            onPointerEnterCapture={() => undefined}
            onPointerLeaveCapture={() => undefined}
          />
        )}
        <ThemeSwitcher onThemeChange={onThemeChange} />
      </div>
    </Page.Header>
  );
}
