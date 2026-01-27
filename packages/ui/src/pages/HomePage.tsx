import { Card, Button, Text, Grid, Spacer } from '@geist-ui/core';
import { Activity as ActivityIcon } from '@geist-ui/icons';
import { authorizeStrava } from '../api/strava';

export default function HomePage() {
  return (
    <Grid.Container
      gap={2}
      justify="center"
      style={{ minHeight: '100vh', alignContent: 'center' }}
    >
      <Grid xs={24} sm={20} md={16} lg={12}>
        <Card width="100%">
          <Card.Content>
            <Text h1>PACE</Text>
            <Text p>Strava Activity Image Generator</Text>
            <Spacer h={1} />
            <Text>
              Connect your Strava account to generate beautiful activity images.
            </Text>
          </Card.Content>
          <Card.Footer>
            <Button
              type="success"
              icon={<ActivityIcon />}
              onClick={authorizeStrava}
              width="100%"
            >
              Authorize with Strava
            </Button>
          </Card.Footer>
        </Card>
      </Grid>
    </Grid.Container>
  );
}
