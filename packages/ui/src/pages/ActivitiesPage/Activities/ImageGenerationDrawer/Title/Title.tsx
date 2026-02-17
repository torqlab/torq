import { useMemo } from 'react';
import { X } from '@geist-ui/icons';
import { Button, Drawer } from '@geist-ui/core';

interface TitleProps {
  isLoading: boolean;
  isLoaded: boolean;
  onClose: () => void;
}

/**
 * Drawer title component.
 * @param {TitleProps} props - Component props.
 * @param {boolean} props.isLoading - Whether the image is being generated.
 * @param {boolean} props.isLoaded - Whether the image has been generated.
 * @param {Function} props.onClose - Function to handle drawer close.
 * @returns {JSX.Element} Drawer title component.
 */
const Title = ({ isLoading, isLoaded, onClose }: TitleProps) => {
  const title = useMemo(() => {
    if (isLoading) {
      return 'AI is Generating Image...';
    } else if (isLoaded) {
      return 'AI-Generated Image';
    } else {
      return 'AI Image Generation';
    }
  }, [isLoading, isLoaded]);

  return (
    <Drawer.Title
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {title}
      <Button
        onClick={onClose}
        auto
        scale={0.6}
        icon={<X />}
        placeholder="Close"
        onPointerEnterCapture={() => undefined}
        onPointerLeaveCapture={() => undefined}
      />
    </Drawer.Title>
  );
};

export default Title;
