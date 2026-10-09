import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    group: 'Sales',
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'projectTitle', 'name', 'email', 'status', 'paymentStatus', 'createdAt'],
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      const role = (req.user as any)?.role
      if (role === 'admin') return true
      return {
        or: [
          { client: { equals: req.user.id } },
          { email: { equals: req.user.email } },
        ],
      }
    },
    create: () => true, // Public order submission
    update: ({ req }) => {
      if (!req.user) return false
      const role = (req.user as any)?.role
      if (role === 'admin') return true
      return {
        or: [
          { client: { equals: req.user.id } },
          { email: { equals: req.user.email } },
        ],
      }
    },
    delete: ({ req }) => (req.user as any)?.role === 'admin',
  },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.orderNumber) {
          data.orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      unique: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone / WhatsApp',
    },
    {
      name: 'service',
      type: 'select',
      defaultValue: 'web_dev',
      options: [
        { label: 'Web Development', value: 'web_dev' },
        { label: 'App Development', value: 'app_dev' },
        { label: 'UI/UX Design', value: 'ui_ux' },
        { label: 'Payload CMS Integration', value: 'payload_cms' },
        { label: 'Full-Stack Web App', value: 'fullstack' },
        { label: 'Other Custom Service', value: 'other' },
      ],
    },
    {
      name: 'projectTitle',
      type: 'text',
      required: true,
    },
    {
      name: 'requirements',
      type: 'textarea',
      required: true,
    },
    {
      name: 'budget',
      type: 'text',
    },
    {
      name: 'deadline',
      type: 'text',
    },
    {
      name: 'referenceLinks',
      type: 'textarea',
    },
    {
      name: 'files',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Reviewed', value: 'reviewed' },
        { label: 'Approved', value: 'approved' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'unpaid',
      options: [
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Partial', value: 'partial' },
        { label: 'Paid', value: 'paid' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    {
      name: 'totalAmount',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'paidAmount',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal admin notes for tracking order progress or payments',
      },
    },
  ],
}
