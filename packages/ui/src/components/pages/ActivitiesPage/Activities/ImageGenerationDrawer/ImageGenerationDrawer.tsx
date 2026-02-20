'use client';

import { Sheet, SheetContent } from '@/components/ui/sheet';
import StravaActivityImageGenerator from '@/components/organisms/StravaActivityImageGenerator';

import Title from './Title';

interface ImageGenerationDrawerProps {
  activityId?: string | null;
  onClose: () => void;
}

/**
 * Image generation drawer — Client Component.
 * Uses shadcn Sheet (Radix Dialog) instead of Geist Drawer.
 * @param {ImageGenerationDrawerProps} props Component props.
 * @param {string | null} [props.activityId] ID of the activity.
 * @param {Function} props.onClose Function to handle sheet close.
 * @returns {JSX.Element} Image generation drawer.
 */
const ImageGenerationDrawer = ({
  activityId,
  onClose,
}: ImageGenerationDrawerProps) => (
  <Sheet open={Boolean(activityId)} onOpenChange={(open) => {
    if (!open) onClose();
  }}>
    <SheetContent side="right" className="w-full sm:max-w-[500px] p-0 overflow-y-auto">
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
    </SheetContent>
  </Sheet>
);

export default ImageGenerationDrawer;
