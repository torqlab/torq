import { useState, useEffect, useRef } from 'react';
import { ANIMATION_TIMEOUT, ANIMATION_TIMEOUT_HALF, EMOJIS } from './constants';

/**
 * Interactive activity emoji component.
 * Changes emoji every 5 seconds with smooth fade and scale animation.
 * Cycles through comprehensive list of sport activities with skin tone variations.
 * @returns {JSX.Element} Interactive activity emoji component with rotation animation.
 */
const ActivityEmoji = (): JSX.Element => {
  const [activeEmojiIndex, setActiveEmojiIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const activeEmoji: string = EMOJIS[activeEmojiIndex];

  useEffect(() => {
    intervalIdRef.current = setInterval(() => {
      setIsAnimating(true);
      timeoutIdRef.current = setTimeout(() => {
        setActiveEmojiIndex(
          (prevIndex: number) => {
            const nextIndex: number = Math.floor(Math.random() * EMOJIS.length);

            return nextIndex === prevIndex ? (nextIndex + 1) % EMOJIS.length : nextIndex;
          },
        );
        setIsAnimating(false);
      }, ANIMATION_TIMEOUT_HALF);
    }, ANIMATION_TIMEOUT);

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes emojiTransition {
            0% {
              opacity: 1;
              transform: scale(1) rotate(0deg);
            }
            50% {
              opacity: 0.3;
              transform: scale(0.8) rotate(5deg);
            }
            100% {
              opacity: 1;
              transform: scale(1) rotate(0deg);
            }
          }
          
          .activity-emoji {
            display: inline-block;
            font-size: 1.2em;
            transition: all 0.4s ease-in-out;
            animation: ${isAnimating ? `emojiTransition ${ANIMATION_TIMEOUT_HALF}ms ease-in-out` : 'none'};
          }
        `}
      </style>
      <span 
        className="activity-emoji"
        role="img" 
        aria-label={`Activity emoji: ${activeEmoji}`}
        title="Rotating sport activity emoji"
      >
        {activeEmoji}
      </span>
    </>
  );
};

export default ActivityEmoji;
