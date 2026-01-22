import type { CollectionConfig } from 'payload'

export const Exhibits: CollectionConfig = {
  slug: 'exhibits',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'location', 'startDate', 'endDate'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
    },
    {
      name: 'location',
      type: 'group',
      fields: [
        {
          name: 'venue',
          type: 'text',
          required: true,
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'country',
          type: 'text',
        },
        {
          name: 'address',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'relatedProjects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      label: 'Related Projects',
    },
    {
      name: 'externalLink',
      type: 'text',
      label: 'External Link',
      admin: {
        description: 'Link to external exhibition page',
      },
    },
    {
      name: 'isUpcoming',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Mark as upcoming exhibition',
      },
    },
  ],
}
