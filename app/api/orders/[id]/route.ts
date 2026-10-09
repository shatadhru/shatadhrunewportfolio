import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getServerSession } from '@delmaredigital/payload-better-auth'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const headersList = await headers()
    const payload = await getPayload({ config })
    const session = await getServerSession(payload, headersList)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = (session.user as any)?.role === 'admin'

    const order = await payload.findByID({
      collection: 'orders',
      id,
      depth: 2,
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check ownership unless admin
    const clientUser = typeof order.client === 'object' ? order.client?.id : order.client
    const isOwner = clientUser === session.user.id || order.email === session.user.email

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Fetch linked proposal if any
    const proposalRes = await payload.find({
      collection: 'proposals',
      where: {
        order: { equals: id },
      },
      limit: 1,
    })

    const proposal = proposalRes.docs?.[0] || null

    return NextResponse.json({
      order,
      proposal,
      isAdmin,
    })
  } catch (error: any) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch order details.' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const headersList = await headers()
    const payload = await getPayload({ config })
    const session = await getServerSession(payload, headersList)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = (session.user as any)?.role === 'admin'

    const existingOrder = await payload.findByID({
      collection: 'orders',
      id,
    })

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const clientUser = typeof existingOrder.client === 'object' ? existingOrder.client?.id : existingOrder.client
    const isOwner = clientUser === session.user.id || existingOrder.email === session.user.email

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Admin updates: status, paymentStatus, totalAmount, paidAmount, notes
    if (isAdmin) {
      const updateData: any = {}
      if (body.status) updateData.status = body.status
      if (body.paymentStatus) updateData.paymentStatus = body.paymentStatus
      if (typeof body.totalAmount === 'number') updateData.totalAmount = body.totalAmount
      if (typeof body.paidAmount === 'number') updateData.paidAmount = body.paidAmount
      if (typeof body.notes === 'string') updateData.notes = body.notes

      const updatedOrder = await payload.update({
        collection: 'orders',
        id,
        data: updateData,
      })

      // Admin proposal creation/update
      if (body.proposal) {
        const { price, estimatedDuration, description, proposalStatus, proposalNotes } = body.proposal

        const existingProposal = await payload.find({
          collection: 'proposals',
          where: { order: { equals: id } },
          limit: 1,
        })

        if (existingProposal.docs?.[0]) {
          await payload.update({
            collection: 'proposals',
            id: existingProposal.docs[0].id,
            data: {
              ...(price !== undefined && { price: Number(price) }),
              ...(estimatedDuration && { estimatedDuration }),
              ...(description && { description }),
              ...(proposalStatus && { status: proposalStatus }),
              ...(proposalNotes !== undefined && { notes: proposalNotes }),
            },
          })
        } else if (price && estimatedDuration && description) {
          await payload.create({
            collection: 'proposals',
            data: {
              order: id,
              price: Number(price),
              estimatedDuration,
              description,
              status: proposalStatus || 'sent',
              notes: proposalNotes || '',
            },
          })
        }
      }

      return NextResponse.json({ success: true, order: updatedOrder })
    }

    // Client update (proposal accept/reject)
    if (isOwner && body.action === 'respond_proposal') {
      const proposalRes = await payload.find({
        collection: 'proposals',
        where: { order: { equals: id } },
        limit: 1,
      })

      const proposal = proposalRes.docs?.[0]
      if (!proposal) {
        return NextResponse.json({ error: 'No proposal found for this order' }, { status: 404 })
      }

      if (body.response === 'accepted' || body.response === 'rejected') {
        const updatedProp = await payload.update({
          collection: 'proposals',
          id: proposal.id,
          data: {
            status: body.response,
          },
        })

        if (body.response === 'accepted') {
          await payload.update({
            collection: 'orders',
            id,
            data: {
              status: 'approved',
              totalAmount: proposal.price,
            },
          })
        }

        return NextResponse.json({ success: true, proposal: updatedProp })
      }
    }

    return NextResponse.json({ error: 'Invalid operation' }, { status: 400 })
  } catch (error: any) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update order.' },
      { status: 500 }
    )
  }
}
