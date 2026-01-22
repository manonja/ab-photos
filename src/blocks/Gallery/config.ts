import type { Block } from 'payload'

export const GalleryBlock: Block = {
  slug: 'gallery',
  labels: {
    singular: 'Gallery',
    plural: 'Galleries',
  },
  fields: [
    {
      name: 'photoSource',
      type: 'select',
      label: 'Photo Source',
      options: [
        { label: 'Existing Photos (Neon DB)', value: 'existing' },
        { label: 'New Payload Media', value: 'payload' },
      ],
      defaultValue: 'existing',
      required: true,
      admin: {
        description: 'Choose where to load photos from',
      },
    },
    {
      name: 'projectId',
      type: 'text',
      label: 'Project ID (Neon)',
      admin: {
        condition: (_, siblingData) => siblingData?.photoSource === 'existing',
        description: 'Enter the project slug to fetch photos from the existing database',
      },
    },
    {
      name: 'images',
      type: 'array',
      label: 'Images',
      admin: {
        condition: (_, siblingData) => siblingData?.photoSource === 'payload',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Masonry', value: 'masonry' },
        { label: 'Carousel', value: 'carousel' },
        { label: 'Single Column', value: 'single' },
      ],
      defaultValue: 'grid',
    },
    {
      name: 'columns',
      type: 'select',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
      defaultValue: '3',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.layout === 'grid' || siblingData?.layout === 'masonry',
      },
    },
    {
      name: 'showCaptions',
      type: 'checkbox',
      label: 'Show Captions',
      defaultValue: false,
    },
    {
      name: 'enableLightbox',
      type: 'checkbox',
      label: 'Enable Lightbox',
      defaultValue: true,
    },
  ],
}
