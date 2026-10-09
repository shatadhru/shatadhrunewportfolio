import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getServerSession } from '@delmaredigital/payload-better-auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      name,
      email,
      phone,
      service,
      projectTitle,
      requirements,
      budget,
      deadline,
      referenceLinks,
      files,
    } = body

    if (!name || !email || !projectTitle || !requirements) {
      return NextResponse.json(
        { error: 'Name, email, project title, and requirements are required.' },
        { status: 400 }
      )
    }

    const headersList = await headers()
    const payload = await getPayload({ config })
    const session = await getServerSession(payload, headersList)

    const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`

    const newOrder = await payload.create({
      collection: 'orders',
      data: {
        orderNumber,
        name,
        email,
        phone: phone || '',
        service: service || 'web_dev',
        projectTitle,
        requirements,
        budget: budget || '',
        deadline: deadline || '',
        referenceLinks: referenceLinks || '',
        files: Array.isArray(files) ? files : [],
        client: session?.user?.id ? session.user.id : undefined,
        status: 'pending',
        paymentStatus: 'unpaid',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Order request submitted successfully.',
      order: {
        id: newOrder.id,
        orderNumber: newOrder.orderNumber,
      },
    })
  } catch (error: any) {
    console.error('Order submission error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to submit order request.' },
      { status: 500 }
    )
  }
}
