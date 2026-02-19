import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Navbar from '@/components/layout/Navbar';

const meta: Meta<typeof Navbar> = {
  title: 'Layout/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The main navigation component for MBINGA featuring a responsive design with mobile menu, logo, and shopping cart.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithCartItems: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Navbar with items in the shopping cart. This demonstrates the cart badge functionality.',
      },
    },
  },
};

export const MobileMenuOpen: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile menu in open state. This shows the responsive mobile navigation overlay.',
      },
    },
  },
};
