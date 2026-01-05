import type { Block } from 'payload'

export const QuoteBlock: Block = {
  slug: 'quote',
  labels: {
    singular: 'Quote',
    plural: 'Quotes',
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'attribution',
      type: 'text',
      label: 'Attribution',
      admin: {
        placeholder: 'e.g., John Doe, The New York Times',
      },
    },
    {
      name: 'style',
      type: 'select',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Large', value: 'large' },
        { label: 'Minimal', value: 'minimal' },
      ],
      defaultValue: 'default',
    },
  ],
}
