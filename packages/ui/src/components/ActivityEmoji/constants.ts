/**
 * Timeout duration for the emoji animation in milliseconds.
 */
export const ANIMATION_TIMEOUT = 5000;

/**
 * Half of animation duration.
 * Used to time the emoji change in the animation cycle.
 */
export const ANIMATION_TIMEOUT_HALF = 200;

/**
 * Skin tone modifiers for emojis.
 */
export const EMOJI_SKIN_TONES = ['', '🏻', '🏼', '🏽', '🏾', '🏿'];

/**
 * Base sport emojis with skin tone variations.
 */
export const EMOJIS_WITH_SKIN_TONES = [
  '🏃', // running
  '🚴', // biking
  '🏊', // swimming
  '🧗', // climbing
  '🏄', // surfing
  '🤸', // gymnastics
  '🏋️', // weightlifting
  '🚣', // rowing
  '🏇', // horse racing
  '⛹️', // basketball
  '🏌️', // golf
  '🤾', // handball
  '🤽', // water polo
  '🚵', // mountain biking
  '🧘', // yoga/meditation
  '🤺', // fencing
];

/**
 * Other sport emojis without skin tone variations.
 */
export const EMOJIS_WO_SKIN_TONES = [
  '⚽', // soccer
  '🏀', // basketball
  '🏈', // american football
  '⚾', // baseball
  '🥎', // softball
  '🎾', // tennis
  '🏐', // volleyball
  '🏓', // ping pong
  '🏸', // badminton
  '🥍', // lacrosse
  '🏑', // field hockey
  '🥅', // goal net
  '⛳', // golf hole
  '🎯', // target/darts
  '🛝', // playground slide
  '🛼', // roller skate
  '🛹', // skateboard
  '🎿', // skis
  '⛸️', // ice skate
  '🥌', // curling stone
  '⛷️', // skiing
  '🏂', // snowboarding
  '🏆', // trophy/winning
  '🥇', // gold medal
];

/**
 * Complete list of sport emojis including skin tone variations.
 */
export const EMOJIS = [
  ...EMOJIS_WO_SKIN_TONES,
  ...EMOJIS_WITH_SKIN_TONES.flatMap((emoji: string) => (
    EMOJI_SKIN_TONES.map((tone) => {
      if (tone === '') {
        return emoji;
      } else if (emoji.includes('️')) {
        // Handle emojis with variation selector (️)
        // Insert skin tone before the variation selector.
        return emoji.replace('️', tone + '️');
      } else {
        // Regular emoji + skin tone.
        return emoji + tone;
      }
    })
  ))
];
