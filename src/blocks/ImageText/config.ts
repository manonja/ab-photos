import type { Block } from 'payload'

export const ImageTextBlock: Block = {
  slug: 'imageText',
  labels: {
    singular: 'Image + Text',
    plural: 'Image + Text Blocks',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'imagePosition',
      type: 'select',
      options: [
        { label: 'Image Left', value: 'left' },
        { label: 'Image Right', value: 'right' },
      ],
      defaultValue: 'left',
    },
    {
      name: 'imageSize',
      type: 'select',
      options: [
        { label: 'Small (1/3)', value: 'small' },
        { label: 'Medium (1/2)', value: 'medium' },
        { label: 'Large (2/3)', value: 'large' },
      ],
      defaultValue: 'medium',
    },
    {
      name: 'verticalAlignment',
      type: 'select',
      options: [
        { label: 'Top', value: 'top' },
        { label: 'Center', value: 'center' },
        { label: 'Bottom', value: 'bottom' },
      ],
      defaultValue: 'center',
    },
  ],
}
