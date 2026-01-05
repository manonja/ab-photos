import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero',
    plural: 'Heroes',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
    },
    {
      name: 'subheading',
      type: 'text',
      label: 'Subheading',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'overlayOpacity',
      type: 'number',
      label: 'Overlay Opacity',
      min: 0,
      max: 100,
      defaultValue: 40,
      admin: {
        description: 'Percentage of dark overlay (0-100)',
      },
    },
    {
      name: 'height',
      type: 'select',
      options: [
        { label: 'Full Screen', value: 'full' },
        { label: 'Large (80vh)', value: 'large' },
        { label: 'Medium (60vh)', value: 'medium' },
        { label: 'Small (40vh)', value: 'small' },
      ],
      defaultValue: 'full',
    },
  ],
}
