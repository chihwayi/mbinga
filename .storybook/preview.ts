import React from 'react';
import type { Preview } from '@storybook/react';
import { CartProvider } from '../src/context/CartContext';

const preview: Preview = {
  decorators: [
    (Story) => (
      <CartProvider>
        <Story />
      </CartProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;

