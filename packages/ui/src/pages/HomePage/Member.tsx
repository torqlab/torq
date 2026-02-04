import { Button, Text } from '@geist-ui/core';
import { Activity as ActivityIcon } from '@geist-ui/icons';
import { Link } from 'wouter';

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
    <Link href='/activities'>
      <Button
        type='default'
        icon={<ActivityIcon />}
        style={{
          marginTop: '8px',
          paddingLeft: '24px',
          paddingRight: '24px',
        }}
        placeholder='View Activities'
        onPointerEnterCapture={() => undefined}
        onPointerLeaveCapture={() => undefined}
      >
        <span style={{ marginLeft: '8px' }}>View Activities</span>
      </Button>
    </Link>
  </>
);

export default Member;
