import type { Block } from 'payload'

export const SpacerBlock: Block = {
  slug: 'spacer',
  labels: {
    singular: 'Spacer',
    plural: 'Spacers',
  },
  fields: [
    {
      name: 'size',
      type: 'select',
      options: [
        { label: 'Extra Small (16px)', value: 'xs' },
        { label: 'Small (32px)', value: 'sm' },
        { label: 'Medium (64px)', value: 'md' },
        { label: 'Large (96px)', value: 'lg' },
        { label: 'Extra Large (128px)', value: 'xl' },
      ],
      defaultValue: 'md',
      required: true,
    },
  ],
}
