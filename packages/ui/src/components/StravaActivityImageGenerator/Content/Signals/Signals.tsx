import { Fragment, useMemo } from 'react';
import { Text } from '@geist-ui/core';
import { StravaActivitySignals } from '@pace/get-strava-activity-signals';

import prettifySignals from './prettifySignals';
import ExpandableCard from '../ExpandableCard';

interface SignalsProps {
  isLoading: boolean;
  isLoaded: boolean;
  signals?: StravaActivitySignals | null;
}

/**
 * Strava activity signals.
 * @param {SignalsProps} props - Component props.
 * @param {boolean} props.isLoading - Whether the signals are loading.
 * @param {boolean} props.isLoaded - Whether the signals have loaded.
 * @param {StravaActivitySignals} [props.signals] - The loaded signals.
 * @returns {JSX.Element} The signals component.
 */
const Signals = ({ isLoading, isLoaded, signals }: SignalsProps) => {
  const prettySignals = useMemo<[string, string][] | null>(() => (
    signals ? prettifySignals(signals) : null
  ), [signals]);

  return (
    <ExpandableCard
      isLoading={isLoading}
      isLoaded={isLoaded}
      loadingMessage="Extracting AI signals from your activity..."
      errorMessage="No activity signals available... Let's cry together."
      pendingMessage="Pending AI signals extraction from your activity..."
      title="Step 1: Extracting AI signals from your activity"
      withExpander
    >
      {prettySignals && (
        <Text p type="secondary" small>
          {prettySignals?.map(([key, value]) => (
            <Fragment key={key}>
              <strong>{key}:</strong> {value};{' '}
            </Fragment>
          ))}
        </Text>
      )}
    </ExpandableCard>
  );
};

export default Signals;
