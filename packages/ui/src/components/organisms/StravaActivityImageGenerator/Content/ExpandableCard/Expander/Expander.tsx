'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ExpanderProps {
  isExpanded: boolean;
  withButton: boolean;
  handleToggleExpand: (event: React.MouseEvent) => void;
}

/**
 * Expander for the expandable card — Client Component.
 * @param {ExpanderProps} props - Expander props.
 * @param {boolean} props.isExpanded - Whether the card is expanded.
 * @param {boolean} props.withButton - Whether to display the toggle button.
 * @param {Function} props.handleToggleExpand - Function to toggle the expanded state.
 * @returns {JSX.Element} Expander component.
 */
const Expander = ({
  isExpanded,
  withButton,
  handleToggleExpand,
}: ExpanderProps) => (
  <div
    className={[
      'absolute bottom-0 left-0 right-0 h-[50px] flex items-end justify-center pb-1',
      isExpanded ? 'bg-transparent' : 'bg-gradient-to-b from-transparent to-background/90',
    ].join(' ')}
  >
    {withButton && (
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={handleToggleExpand}
        aria-label={isExpanded ? 'Collapse' : 'Expand'}
      >
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </Button>
    )}
  </div>
);

export default Expander;
