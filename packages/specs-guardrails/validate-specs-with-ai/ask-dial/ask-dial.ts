#!/usr/bin/env bun

import { CONFIG } from './constants';
import { DialResponse } from './types';

const askDial = async <T extends Record<string, unknown>>(systemPrompt: string, userPrompt: string): Promise<T> => {
  if (!process.env.DIAL_KEY) {
    throw new Error('DIAL_KEY is not set');
  }

  const body = JSON.stringify({
    temperature: CONFIG.TEMPERATURE,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });
  const response = await fetch(
    `https://ai-proxy.lab.epam.com/openai/deployments/${CONFIG.MODEL}/chat/completions?api-version=${CONFIG.API_VERSION}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': CONFIG.API_KEY,
        'Content-Length': Buffer.byteLength(body).toString(),
      },
      body,
    }
  );
  const json = await response.json() as DialResponse;
  const contentRaw = json.choices?.[0]?.message?.content;
  const content = contentRaw ? JSON.parse(contentRaw) as T : null;

  if (json.error) {
    throw new Error(json.error.message || 'Unknown DIAL error.');
  } else if (!content) {
    throw new Error('No content in DIAL response.');
  } else {
    return content;
  }
};

export default askDial;
