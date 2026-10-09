import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'my-products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'year', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'category',
      type: 'text',
      defaultValue: 'Developer Tool',
    },
    {
      name: 'year',
      type: 'text',
      defaultValue: '2026',
    },
    {
      name: 'url',
      type: 'text',
      label: 'Product URL / Link',
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
