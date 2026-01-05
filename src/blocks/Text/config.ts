import type { Block } from 'payload'

export const TextBlock: Block = {
  slug: 'text',
  labels: {
    singular: 'Text Block',
    plural: 'Text Blocks',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'alignment',
      type: 'select',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
      defaultValue: 'left',
    },
    {
      name: 'maxWidth',
      type: 'select',
      options: [
        { label: 'Full Width', value: 'full' },
        { label: 'Large (1200px)', value: 'large' },
        { label: 'Medium (800px)', value: 'medium' },
        { label: 'Small (600px)', value: 'small' },
      ],
      defaultValue: 'medium',
    },
  ],
}
