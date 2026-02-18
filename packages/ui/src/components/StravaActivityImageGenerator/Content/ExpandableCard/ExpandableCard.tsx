import { useCallback, useState } from 'react';
import { Button, Card, Text } from '@geist-ui/core';
import ChevronDown from '@geist-ui/icons/chevronDown';
import ChevronUp from '@geist-ui/icons/chevronUp';

import Preloader from '../../../Preloader';
import StatusEmoji from './StatusEmoji';
import getStatus from './getStatus';
import StatusText from './StatusText';

interface ExpandableCardProps {
  isLoading: boolean;
  isLoaded: boolean;
  children?: React.ReactNode;
  loadingMessage?: string;
  pendingMessage?: string;
  errorMessage?: string;
  title?: string;
  minHeight?: string;
  withPreloader?: boolean;
  withExpander?: boolean;
}

/**
 * Expandable card.
 * @param {ExpandableCardProps} props - Component props.
 * @param {boolean} props.isLoading - Whether the content is loading.
 * @param {boolean} props.isLoaded - Whether the content has been loaded.
 * @param {React.ReactNode} [props.children] - The content to display inside the card.
 * @param {string} [props.loadingMessage] - Custom loading message to display while loading.
 * @param {string} [props.pendingMessage] - Custom pending message to display while waiting.
 * @param {string} [props.errorMessage] - Custom error message to display if loading fails.
 * @param {string} [props.title] - Custom title to display when content is successfully loaded.
 * @param {string} [props.minHeight] - Minimum height of the card.
 * @param {boolean} [props.withPreloader] - Whether to display a preloader for loading states.
 * @param {boolean} [props.withExpander] - Whether to display an expander button for the card.
 * @returns {JSX.Element} The expandable card component.
 */
const ExpandableCard = ({
  isLoading,
  isLoaded,
  children = null,
  loadingMessage = 'Loading...',
  pendingMessage = 'Pending...',
  errorMessage = 'Someting went wrong...',
  title = 'Content',
  minHeight = '100px',
  withPreloader = false,
  withExpander = false,
}: ExpandableCardProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const status = getStatus({
    hasContent: Boolean(children),
    isLoading,
    isLoaded,
  });

  /**
   * Toggles the expanded state of the card.
   * @returns {void}
   */
  const handleToggleExpand = useCallback((event: React.MouseEvent) => {
    if (withExpander) {
      event.stopPropagation();
      setIsExpanded((prev) => !prev);
    }
  }, [withExpander]);

  return (
    <Card
      style={{
        position: 'relative',
        width: '100%',
        minHeight: minHeight,
        maxHeight: isExpanded ? '800px' : minHeight,
        overflow: 'hidden',
        paddingBottom: withExpander ? '10px' : 0,
        cursor: withExpander ? 'pointer' : 'default',
        transition: 'max-height 0.3s ease',
      }}
      onClick={handleToggleExpand}
      hoverable
    >
      <Card.Content>
        <Text h5 type="secondary">
          <StatusEmoji status={status} />
          {' '}
          {title}
          {' '}
          (<StatusText status={status} />)
        </Text>
        {isLoading ? (
          withPreloader ? (
            <Preloader
              message={loadingMessage}
              withFullHeight={false} />
          ) : (
            <Text p small type="secondary">
              {loadingMessage}
            </Text>
          )
        ) : (isLoaded && children) ? (
          children
        ) : isLoaded ? (
          <Text p small type="error">
            {errorMessage}
          </Text>
        ) : (
          withPreloader ? (
            <Preloader
              message={pendingMessage}
              withFullHeight={false} />
          ) : (
            <Text p small type="secondary">
              {pendingMessage}
            </Text>
          )
        )}
      </Card.Content>
      {withExpander && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50px',
            background: isExpanded
              ? 'transparent'
              : 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.75))',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingBottom: '4px',
          }}
        >
          {status === 'loaded' && (
            <Button
              auto
              ghost
              scale={0.1}
              type="default"
              icon={isExpanded ? <ChevronUp /> : <ChevronDown />}
              onClick={handleToggleExpand}
              onPointerEnterCapture={() => undefined}
              onPointerLeaveCapture={() => undefined}
              placeholder="Toggle"
            />
          )}
        </div>
      )}
    </Card>
  );
};

export default ExpandableCard;
