import React from 'react'
import { notFound, redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getServerSession } from '@delmaredigital/payload-better-auth'
import { OrderDetailView } from '@/components/basic/dashboard/orders/OrderDetailView'

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const headersList = await headers()
  const payload = await getPayload({ config })
  const session = await getServerSession(payload, headersList)

  if (!session?.user) {
    redirect('/auth/login')
  }

  const isAdmin = (session.user as any)?.role === 'admin'

  let order: any = null
  try {
    order = await payload.findByID({
      collection: 'orders',
      id,
      depth: 2,
    })
  } catch (_e) {
    notFound()
  }

  if (!order) {
    notFound()
  }

  const clientUser = typeof order.client === 'object' ? order.client?.id : order.client
  const isOwner = clientUser === session.user.id || order.email === session.user.email

  if (!isAdmin && !isOwner) {
    notFound()
  }

  // Fetch proposal
  let proposal: any = null
  try {
    const propRes = await payload.find({
      collection: 'proposals',
      where: {
        order: { equals: id },
      },
      limit: 1,
    })
    proposal = propRes.docs?.[0] || null
  } catch (_e) {
    proposal = null
  }

  return (
    <OrderDetailView
      initialOrder={JSON.parse(JSON.stringify(order))}
      initialProposal={proposal ? JSON.parse(JSON.stringify(proposal)) : null}
      isAdmin={isAdmin}
    />
  )
}
