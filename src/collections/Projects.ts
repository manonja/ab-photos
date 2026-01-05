import type { CollectionConfig } from 'payload'
import { HeroBlock } from '../blocks/Hero/config'
import { GalleryBlock } from '../blocks/Gallery/config'
import { TextBlock } from '../blocks/Text/config'
import { ImageTextBlock } from '../blocks/ImageText/config'
import { QuoteBlock } from '../blocks/Quote/config'
import { SpacerBlock } from '../blocks/Spacer/config'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'isPublished', 'order'],
    livePreview: {
      url: ({ data }) => {
        const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
        return `${baseUrl}/work/${data.slug}`
      },
    },
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
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Project Description',
    },
    {
      name: 'dateRange',
      type: 'text',
      label: 'Date Range',
      admin: {
        placeholder: 'e.g., 2020-2023',
        position: 'sidebar',
      },
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Hero Image',
    },
    {
      name: 'layout',
      type: 'blocks',
      label: 'Page Layout',
      blocks: [
        HeroBlock,
        GalleryBlock,
        TextBlock,
        ImageTextBlock,
        QuoteBlock,
        SpacerBlock,
      ],
    },
  ],
}
