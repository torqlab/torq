import { Text, Button, useTheme } from '@geist-ui/core';
import { useLocation } from 'wouter';
import { LogOut, Github, Globe } from '@geist-ui/icons';
import { logout } from '../utils/auth';
import { useAuth } from '../hooks/useAuth';
import ThemeSwitcher from './ThemeSwitcher';

interface HeaderProps {
  onThemeChange: (theme: 'light' | 'dark') => void;
}

/**
 * Application header with navigation and theme switcher.
 * @param {HeaderProps} root0 - Component props
 * @param {Function} root0.onThemeChange - Callback to change theme
 * @returns {JSX.Element} Header component
 */
export default function Header({ onThemeChange }: HeaderProps) {
  const theme = useTheme();
  const [location, setLocation] = useLocation();
  const { isAuthenticated, loading } = useAuth();

  /**
   * Handles user logout.
   * @returns {Promise<void>}
   */
  const handleLogout = async () => {
    await logout();
  };

  return (
    <header
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
          fontWeight: 600,
          cursor: location === '/' ? 'default' : 'pointer',
        }}
        onClick={() => {
          if (location !== '/') {
            setLocation('/');
          }
        }}
      >
        PACE
      </Text>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {!loading && isAuthenticated && (
          <Button
            type='default'
            icon={<LogOut />}
            onClick={() => {
              void handleLogout();
            }}
            auto
            scale={0.6}
            aria-label='Logout'
            placeholder='Logout'
            onPointerEnterCapture={() => undefined}
            onPointerLeaveCapture={() => undefined}
          />
        )}
        <Button
          icon={<Globe />}
          onClick={() => {
            window.open('https://balov.dev', '_blank', 'noopener,noreferrer');
          }}
          type='default'
          auto
          scale={0.6}
          aria-label='Visit website'
          placeholder='Visit website'
          onPointerEnterCapture={() => undefined}
          onPointerLeaveCapture={() => undefined}
        />
        <Button
          icon={<Github />}
          onClick={() => {
            window.open('https://github.com/mrbalov/pace', '_blank', 'noopener,noreferrer');
          }}
          type='default'
          auto
          scale={0.6}
          aria-label='View source on GitHub'
          placeholder='View source on GitHub'
          onPointerEnterCapture={() => undefined}
          onPointerLeaveCapture={() => undefined}
        />
        <ThemeSwitcher onThemeChange={onThemeChange} />
      </div>
    </header>
  );
}
