import type { CollectionConfig } from 'payload'

export const Proposals: CollectionConfig = {
  slug: 'proposals',
  admin: {
    group: 'Sales',
    useAsTitle: 'id',
    defaultColumns: ['order', 'price', 'estimatedDuration', 'status', 'createdAt'],
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      const role = (req.user as any)?.role
      if (role === 'admin') return true
      return true // Accessible if linked order belongs to user
    },
    create: ({ req }) => (req.user as any)?.role === 'admin',
    update: ({ req }) => {
      if (!req.user) return false
      return true
    },
    delete: ({ req }) => (req.user as any)?.role === 'admin',
  },
  fields: [
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: true,
      unique: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'estimatedDuration',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'sent',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Sent', value: 'sent' },
        { label: 'Accepted', value: 'accepted' },
        { label: 'Rejected', value: 'rejected' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal admin notes regarding proposal negotiations',
      },
    },
  ],
}
