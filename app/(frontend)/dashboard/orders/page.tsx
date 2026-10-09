import React from 'react'
import Link from 'next/link'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getServerSession } from '@delmaredigital/payload-better-auth'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ClipboardList, Plus, Eye, DollarSign, Calendar, ArrowRight } from 'lucide-react'

function getStatusBadge(status: string) {
  switch (status) {
    case 'pending':
      return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">Pending</Badge>
    case 'reviewed':
      return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">Reviewed</Badge>
    case 'approved':
      return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">Approved</Badge>
    case 'in_progress':
      return <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">In Progress</Badge>
    case 'completed':
      return <Badge className="bg-green-600/10 text-green-600 dark:text-green-400 border-green-600/20">Completed</Badge>
    case 'cancelled':
      return <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20">Cancelled</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getPaymentBadge(paymentStatus: string) {
  switch (paymentStatus) {
    case 'unpaid':
      return <Badge variant="secondary" className="bg-muted text-muted-foreground">Unpaid</Badge>
    case 'partial':
      return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">Partial</Badge>
    case 'paid':
      return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">Paid</Badge>
    case 'refunded':
      return <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20">Refunded</Badge>
    default:
      return <Badge variant="outline">{paymentStatus}</Badge>
  }
}

export default async function OrdersDashboardPage() {
  const headersList = await headers()
  const payload = await getPayload({ config })
  const session = await getServerSession(payload, headersList)

  const isAdmin = (session?.user as any)?.role === 'admin'

  let orders: any[] = []
  try {
    const whereCondition = isAdmin
      ? {}
      : {
          or: [
            { client: { equals: session?.user?.id } },
            { email: { equals: session?.user?.email } },
          ],
        }

    const res = await payload.find({
      collection: 'orders',
      where: whereCondition,
      sort: '-createdAt',
    })
    orders = res.docs || []
  } catch (err) {
    console.error('Failed to load orders:', err)
    orders = []
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <ClipboardList className="size-7 text-primary" />
            {isAdmin ? 'Client Orders Management' : 'My Orders & Proposals'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isAdmin
              ? 'Review submitted client orders, manage project statuses, send proposals, and track manual payments.'
              : 'Track your submitted project requests, view project proposals, and follow development progress.'}
          </p>
        </div>

        <Link href="/order">
          <Button className="shrink-0 w-full sm:w-auto">
            <Plus className="size-4" />
            New Order Request
          </Button>
        </Link>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card className="p-0 border border-dashed border-border/80 bg-card overflow-hidden">
          <CardContent className="p-10 text-center space-y-4">
            <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20">
              <ClipboardList className="size-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold">No orders found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                You haven&apos;t submitted any project requests yet. Click below to start a new order request.
              </p>
            </div>

            <Link href="/order" className="inline-block">
              <Button size="lg" className="mt-2">
                Submit a Project Request
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order: any) => (
            <Card
              key={order.id}
              className="p-0 border border-border/80 bg-card overflow-hidden transition-all hover:border-primary/40 hover:shadow-md"
            >
              <CardContent className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                      {order.orderNumber}
                    </span>
                    {getStatusBadge(order.status)}
                    {getPaymentBadge(order.paymentStatus)}
                    <span className="text-xs text-muted-foreground uppercase font-semibold">
                      • {order.service?.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground truncate">
                    {order.projectTitle}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {order.requirements}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                    <span>Client: <strong className="text-foreground">{order.name}</strong> ({order.email})</span>
                    {order.budget && <span>Budget: <strong className="text-foreground">{order.budget}</strong></span>}
                    {order.createdAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3 text-primary" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-border/60 shrink-0">
                  <div className="text-left md:text-right">
                    <div className="text-xs text-muted-foreground font-medium">Total Amount</div>
                    <div className="text-lg font-bold text-foreground flex items-center justify-end gap-0.5">
                      <DollarSign className="size-4 text-emerald-500" />
                      {order.totalAmount ? order.totalAmount.toLocaleString() : '0'}
                    </div>
                  </div>

                  <Link href={`/dashboard/orders/${order.id}`}>
                    <Button size="sm" variant="outline" className="w-full sm:w-auto">
                      <Eye className="size-4" />
                      View Order & Proposal
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
