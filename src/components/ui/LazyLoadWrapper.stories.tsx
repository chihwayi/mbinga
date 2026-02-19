import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import LazyLoadWrapper from './LazyLoadWrapper';

const meta: Meta<typeof LazyLoadWrapper> = {
  title: 'Components/LazyLoadWrapper',
  component: LazyLoadWrapper,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A wrapper component that lazy loads its children when they come into view using Framer Motion\'s useInView hook.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    threshold: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Percentage of the element that must be visible to trigger the animation',
    },
    triggerOnce: {
      control: 'boolean',
      description: 'Whether the animation should only trigger once',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the wrapper',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="bg-gold text-obsidian p-8 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-4">Lazy Loaded Content</h3>
        <p className="text-lg">This content appears when scrolled into view!</p>
      </div>
    ),
    threshold: 0.1,
    triggerOnce: true,
  },
};

export const MultipleItems: Story = {
  args: {
    children: (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="bg-obsidian border border-gold/30 p-4 rounded-lg">
            <h4 className="text-gold font-bold">Item {item}</h4>
            <p className="text-cream">This is item number {item} in the lazy loaded section.</p>
          </div>
        ))}
      </div>
    ),
    threshold: 0.2,
    triggerOnce: true,
  },
};

export const CustomThreshold: Story = {
  args: {
    children: (
      <div className="bg-gradient-to-br from-gold/20 to-gold/40 p-12 rounded-xl border border-gold/50">
        <h3 className="text-3xl font-bold text-gold mb-6">Custom Threshold Content</h3>
        <p className="text-cream text-lg">This content requires 50% visibility to trigger.</p>
      </div>
    ),
    threshold: 0.5,
    triggerOnce: false,
  },
};

export const RepeatingAnimation: Story = {
  args: {
    children: (
      <div className="bg-obsidian border-2 border-gold p-8 rounded-lg">
        <h3 className="text-2xl font-bold text-gold mb-4">Repeating Animation</h3>
        <p className="text-cream">This animation will trigger every time the element comes into view.</p>
      </div>
    ),
    threshold: 0.3,
    triggerOnce: false,
  },
};
