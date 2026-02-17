import { Download } from '@geist-ui/icons';
import { Button, Text, Note, Grid, Card } from '@geist-ui/core';

import Preloader from '../../../Preloader';
import downloadBase64Image from './downloadBase64Image';

interface ImageProps {
  isLoading: boolean;
  isLoaded: boolean;
  image?: string | null;
}

interface ImageContentProps {
  image: string;
}

/**
 * Image generation result.
 * @param {ImageContentProps} props - Component props.
 * @param {string} props.image - Generated image data URL.
 * @param {Function} props.downloadImage - Function to download the generated image.
 * @returns {JSX.Element} Image generation result component.
 */
const ImageContent = ({
  image,
}: ImageContentProps) => (
  <>
    <Grid xs={24}>
      <img
        src={image}
        alt="Generated activity image"
        style={{
          width: '100%',
          height: 'auto',
          maxWidth: '100%',
          borderRadius: '8px',
          display: 'block',
        }}
        onLoad={() => {
          console.info('Image loaded successfully');
        }}
        onError={(error) => {
          console.error('Image load error:', error);
        }}
      />
    </Grid>
    <Grid xs={24}>
      <Button
        onClick={() => {
          downloadBase64Image(image).catch(console.error);
        }}
        type="default"
        width="100%"
        icon={<Download />}
        placeholder="Download Image"
        onPointerEnterCapture={() => undefined}
        onPointerLeaveCapture={() => undefined}
      >
        Download Image
      </Button>
    </Grid>
  </>
);

/**
 * Image generation progress.
 * @param {ImageProps} props - Component props.
 * @param {boolean} props.isLoading - Whether the image is being generated.
 * @param {boolean} props.isLoaded - Whether the image has been generated successfully.
 * @param {string} [props.error] - Error message if generation failed.
 * @param {Function} props.onRetry - Function to retry image generation.
 * @param {string} [props.image] - Generated image data URL.
 * @param {Function} props.setError - Function to set error message.
 * @returns {JSX.Element} Image generation progress component.
 */
const Image = ({
  isLoading,
  isLoaded,
  image,
}: ImageProps) => (
  <Card style={{ width: '100%' }}>
    {isLoading ? (
      <Preloader message="Creating your activity image..." withFullHeight={false} />
    ) : (isLoaded && image) ? (
      <ImageContent image={image} />
    ) : isLoaded ? (
      <Grid xs={24}>
        <Note type="error" label="Error">
          <Text>Failed to generate image for your activity... Let's cry together.</Text>
        </Note>
      </Grid>
    ) : null}
  </Card>
);

export default Image;
