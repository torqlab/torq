import { Drawer } from '@geist-ui/core';

import Title from './Title';
import StravaActivityImageGenerator from '../../../../components/StravaActivityImageGenerator';

interface ImageGenerationDrawerProps {
  activityId?: string | null;
  onClose: () => void;
}

/**
 * Image generation drawer.
 * @param {ImageGenerationDrawerProps} props Component props.
 * @param {string | null} [props.activityId] ID of the activity for which the image is being generated.
 * @param {Function} props.onClose Function to handle drawer close.
 * @returns {JSX.Element} Image generation drawer.
 */
const ImageGenerationDrawer = ({
  activityId,
  onClose,
}: ImageGenerationDrawerProps) => (
  <Drawer
    visible={Boolean(activityId)}
    onClose={onClose}
    placement="right"
    width="500px">
    <StravaActivityImageGenerator
      activityId={activityId ?? undefined}
      Header={({ isLoading, isLoaded }) => (
        <Title
          isLoading={isLoading}
          isLoaded={isLoaded}
          onClose={onClose}
        />
      )}
    />
  </Drawer>
);

export default ImageGenerationDrawer;
