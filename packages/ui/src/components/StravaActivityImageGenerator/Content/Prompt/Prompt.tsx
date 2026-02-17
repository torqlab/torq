import { Card, Text } from '@geist-ui/core';

import Preloader from '../../../Preloader';

interface PromptProps {
  isLoading: boolean;
  isLoaded: boolean;
  prompt?: string | null;
}

/**
 * Image generation prompt.
 * @param {PromptProps} props - Component props.
 * @param {boolean} props.isLoading - Whether the prompt is being generated.
 * @param {boolean} props.isLoaded - Whether the prompt has been loaded.
 * @param {string | null} [props.prompt] - Generated prompt text.
 * @returns {JSX.Element} The prompt component.
 */
const Prompt = ({
  isLoading,
  isLoaded,
  prompt,
}: PromptProps) => (
  <Card style={{ width: '100%' }}>
    {isLoading ? (
      <Preloader
        message="⚙️ Preparing AI image generation prompt for your activity..."
        withFullHeight={false} />
    ) : (isLoaded && prompt) ? (
      <>
        <Text h5 type="secondary">
          AI image generation prompt for your activity:
        </Text>
        <Text p type="secondary" small>
          {prompt}
        </Text>
      </>
    ) : isLoaded ? (
      <Text p small type="error">
        No AI image generation prompt available... Let's cry together.
      </Text>
    ) : (
      <Preloader
        message="⏳ Pending AI prompt preparation for your activity..."
        withFullHeight={false} />
    )}
  </Card>
);

export default Prompt;
