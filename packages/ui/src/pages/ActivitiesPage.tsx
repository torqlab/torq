import { Card, Button, Text, Grid, Spacer, Loading, Note } from '@geist-ui/core';
import { ArrowLeft, Navigation, Clock, TrendingUp } from '@geist-ui/icons';
import { useLocation } from 'wouter';
import { useActivities } from '../api/hooks';

export default function ActivitiesPage() {
  const [, setLocation] = useLocation();
  const { activities, loading, error, refetch } = useActivities();

  if (loading) {
    return (
      <Grid.Container
        gap={2}
        justify="center"
        style={{ minHeight: '100vh', alignContent: 'center' }}
      >
        <Grid xs={24} style={{ textAlign: 'center' }}>
          <Loading size="large">Loading your activities...</Loading>
        </Grid>
      </Grid.Container>
    );
  }

  if (error) {
    return (
      <Grid.Container gap={2} justify="center" style={{ padding: '2rem' }}>
        <Grid xs={24} sm={20} md={16} lg={12}>
          <Note type="error" label="Error">
            {error}
          </Note>
          <Spacer h={1} />
          <Button onClick={refetch} width="100%">
            Try Again
          </Button>
        </Grid>
      </Grid.Container>
    );
  }

  return (
    <Grid.Container gap={2} style={{ padding: '2rem' }}>
      <Grid xs={24}>
        <Button
          auto
          type="abort"
          icon={<ArrowLeft />}
          onClick={() => setLocation('/')}
        >
          Back to Home
        </Button>
      </Grid>

      <Grid xs={24}>
        <Text h1>Your Activities</Text>
      </Grid>

      {activities?.map((activity) => (
        <Grid xs={24} sm={12} md={8} lg={6} key={activity.id}>
          <Card width="100%" hoverable>
            <Card.Content>
              <Text h4>{activity.name}</Text>
              <Text type="secondary" small>
                {activity.type}
              </Text>
              <Spacer h={0.5} />
              
              <Text small>
                <Navigation size={14} /> {(activity.distance / 1000).toFixed(2)} km
              </Text>
              <Text small>
                <Clock size={14} /> {Math.floor(activity.moving_time / 60)} min
              </Text>
              <Text small>
                <TrendingUp size={14} /> {activity.total_elevation_gain} m
              </Text>
            </Card.Content>
            <Card.Footer>
              <Button type="success" width="100%" scale={0.8}>
                Generate Image
              </Button>
            </Card.Footer>
          </Card>
        </Grid>
      ))}
    </Grid.Container>
  );
}
