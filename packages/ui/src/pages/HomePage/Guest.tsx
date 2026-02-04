import { Button, Text } from '@geist-ui/core';
import { Activity as ActivityIcon } from '@geist-ui/icons';
import { authorizeStrava } from '../../api/strava';

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
      placeholder='Authorize with Strava'
      onPointerEnterCapture={() => undefined}
      onPointerLeaveCapture={() => undefined}
    >
      <span style={{ marginLeft: '8px' }}>Authorize with Strava</span>
    </Button>
  </>
);

export default Guest;
