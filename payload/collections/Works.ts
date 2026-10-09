import type { CollectionConfig } from 'payload'

export const Works: CollectionConfig = {
  slug: 'works',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'updatedAt'],
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
      defaultValue: 'Web Application',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'Live',
      options: [
        { label: 'Live', value: 'Live' },
        { label: 'Completed', value: 'Completed' },
        { label: 'In Progress', value: 'In Progress' },
      ],
    },
    {
      name: 'url',
      type: 'text',
      label: 'Demo / Live URL',
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
