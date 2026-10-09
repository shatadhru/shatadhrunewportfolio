"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Mail,
  Phone,
  ShieldCheck,
  User,
  XCircle,
  ExternalLink,
  Edit,
  Save,
} from 'lucide-react'

export interface OrderDetailViewProps {
  initialOrder: any
  initialProposal: any
  isAdmin: boolean
}

export function OrderDetailView({ initialOrder, initialProposal, isAdmin }: OrderDetailViewProps) {
  const router = useRouter()
  const [order, setOrder] = useState(initialOrder)
  const [proposal, setProposal] = useState(initialProposal)

  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Admin Controls State
  const [adminStatus, setAdminStatus] = useState(order.status || 'pending')
  const [adminPaymentStatus, setAdminPaymentStatus] = useState(order.paymentStatus || 'unpaid')
  const [adminTotalAmount, setAdminTotalAmount] = useState(order.totalAmount || 0)
  const [adminPaidAmount, setAdminPaidAmount] = useState(order.paidAmount || 0)
  const [adminNotes, setAdminNotes] = useState(order.notes || '')

  // Admin Proposal Form State
  const [propPrice, setPropPrice] = useState(proposal?.price || 0)
  const [propDuration, setPropDuration] = useState(proposal?.estimatedDuration || '')
  const [propDesc, setPropDesc] = useState(proposal?.description || '')
  const [propStatus, setPropStatus] = useState(proposal?.status || 'sent')

  const handleClientProposalAction = async (action: 'accepted' | 'rejected') => {
    setLoading(true)
    setMsg(null)

    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'respond_proposal',
          response: action,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update proposal.')

      setProposal((prev: any) => ({ ...prev, status: action }))
      if (action === 'accepted') {
        setOrder((prev: any) => ({ ...prev, status: 'approved', totalAmount: proposal?.price || prev.totalAmount }))
      }
      setMsg({ type: 'success', text: `Proposal ${action} successfully!` })
      router.refresh()
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Action failed.' })
    } finally {
      setLoading(false)
    }
  }

  const handleAdminSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg(null)

    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: adminStatus,
          paymentStatus: adminPaymentStatus,
          totalAmount: Number(adminTotalAmount),
          paidAmount: Number(adminPaidAmount),
          notes: adminNotes,
          proposal: {
            price: Number(propPrice),
            estimatedDuration: propDuration,
            description: propDesc,
            proposalStatus: propStatus,
          },
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save admin changes.')

      setOrder(data.order || order)
      setMsg({ type: 'success', text: 'Order & proposal details updated successfully!' })
      router.refresh()
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Save failed.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div className="space-y-1">
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-1"
          >
            <ArrowLeft className="size-3.5" />
            Back to Orders
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Order #{order.orderNumber}
            </h1>
            <Badge className="bg-primary/10 text-primary border-primary/20">
              {order.service?.replace('_', ' ')}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link href={`/admin/collections/orders/${order.id}`} target="_blank">
              <Button variant="outline" size="sm">
                <ExternalLink className="size-4" />
                Open in Payload Studio
              </Button>
            </Link>
          )}
        </div>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-xl border text-sm font-medium ${
            msg.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-destructive/10 border-destructive/20 text-destructive'
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Order Specification & Proposal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Details */}
          <Card className="p-0 border border-border/80 bg-card overflow-hidden">
            <CardHeader className="p-6 border-b border-border/60 flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <FileText className="size-5 text-primary" />
                Project Specification
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">{order.status}</Badge>
                <Badge variant="secondary" className="capitalize">{order.paymentStatus}</Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">{order.projectTitle}</h3>
                <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap leading-relaxed">
                  {order.requirements}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/60">
                <div>
                  <span className="text-xs text-muted-foreground font-medium block">Budget Estimate</span>
                  <span className="text-sm font-semibold">{order.budget || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground font-medium block">Expected Deadline</span>
                  <span className="text-sm font-semibold">{order.deadline || 'Flexible'}</span>
                </div>
              </div>

              {order.referenceLinks && (
                <div className="pt-4 border-t border-border/60">
                  <span className="text-xs text-muted-foreground font-medium block mb-1">Reference Links / Notes</span>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{order.referenceLinks}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Proposal Card */}
          <Card className="p-0 border border-border/80 bg-card overflow-hidden">
            <CardHeader className="p-6 border-b border-border/60 flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <DollarSign className="size-5 text-emerald-500" />
                Project Proposal
              </CardTitle>
              {proposal?.status && (
                <Badge
                  className={
                    proposal.status === 'accepted'
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                      : proposal.status === 'rejected'
                      ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                      : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                  }
                >
                  Proposal {proposal.status}
                </Badge>
              )}
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {proposal ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-muted/40 border border-border/60">
                    <div>
                      <span className="text-xs text-muted-foreground block">Proposed Price</span>
                      <span className="text-2xl font-extrabold text-foreground flex items-center gap-0.5">
                        <DollarSign className="size-5 text-emerald-500" />
                        {proposal.price?.toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground block">Estimated Duration</span>
                      <span className="text-lg font-bold text-foreground flex items-center gap-1 mt-1">
                        <Clock className="size-4 text-primary" />
                        {proposal.estimatedDuration}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Scope of Work & Technical Details</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {proposal.description}
                    </p>
                  </div>

                  {/* Client Accept / Reject buttons */}
                  {!isAdmin && proposal.status === 'sent' && (
                    <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center gap-3">
                      <Button
                        onClick={() => handleClientProposalAction('accepted')}
                        disabled={loading}
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <CheckCircle2 className="size-4" />
                        Accept Proposal
                      </Button>

                      <Button
                        onClick={() => handleClientProposalAction('rejected')}
                        disabled={loading}
                        variant="outline"
                        className="w-full sm:w-auto text-destructive border-destructive/30 hover:bg-destructive/10"
                      >
                        <XCircle className="size-4" />
                        Reject Proposal
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-6 text-center text-muted-foreground text-sm">
                  <Clock className="size-8 mx-auto mb-2 opacity-50" />
                  No official proposal has been attached to this order yet.
                  {isAdmin && ' Use the Admin panel on the right to draft and send a proposal.'}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Summary & Admin Form */}
        <div className="space-y-6">
          {/* Contact Details Card */}
          <Card className="p-0 border border-border/80 bg-card overflow-hidden">
            <CardHeader className="p-5 border-b border-border/60">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <User className="size-4 text-primary" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <User className="size-4 text-muted-foreground shrink-0" />
                <span>{order.name}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="size-4 shrink-0" />
                <a href={`mailto:${order.email}`} className="hover:underline text-primary truncate">
                  {order.email}
                </a>
              </div>
              {order.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="size-4 shrink-0" />
                  <span>{order.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Status & Financial Breakdown */}
          <Card className="p-0 border border-border/80 bg-card overflow-hidden">
            <CardHeader className="p-5 border-b border-border/60">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-500" />
                Payment Tracking
              </CardTitle>
            </CardHeader>

            <CardContent className="p-5 space-y-4 text-sm">
              <div className="flex items-center justify-between py-1 border-b border-border/60">
                <span className="text-muted-foreground">Payment Status</span>
                <Badge variant="secondary" className="capitalize">{order.paymentStatus}</Badge>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-border/60">
                <span className="text-muted-foreground">Total Agreed Price</span>
                <span className="font-bold text-foreground">${order.totalAmount || 0}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-border/60">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-bold text-emerald-500">${order.paidAmount || 0}</span>
              </div>

              <div className="flex items-center justify-between py-1 font-semibold">
                <span>Remaining Balance</span>
                <span className="text-foreground">
                  ${Math.max(0, (order.totalAmount || 0) - (order.paidAmount || 0))}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Admin Management Panel */}
          {isAdmin && (
            <Card className="p-0 border border-primary/40 bg-card overflow-hidden shadow-md">
              <CardHeader className="p-5 border-b border-border/60 bg-primary/5">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Edit className="size-4 text-primary" />
                  Admin Order & Proposal Manager
                </CardTitle>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                <form onSubmit={handleAdminSave} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Order Status</label>
                    <select
                      value={adminStatus}
                      onChange={(e) => setAdminStatus(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-xs"
                    >
                      <option value="pending" className="bg-background">Pending</option>
                      <option value="reviewed" className="bg-background">Reviewed</option>
                      <option value="approved" className="bg-background">Approved</option>
                      <option value="in_progress" className="bg-background">In Progress</option>
                      <option value="completed" className="bg-background">Completed</option>
                      <option value="cancelled" className="bg-background">Cancelled</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Manual Payment Status</label>
                    <select
                      value={adminPaymentStatus}
                      onChange={(e) => setAdminPaymentStatus(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-xs"
                    >
                      <option value="unpaid" className="bg-background">Unpaid</option>
                      <option value="partial" className="bg-background">Partial</option>
                      <option value="paid" className="bg-background">Paid</option>
                      <option value="refunded" className="bg-background">Refunded</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold">Total Amount ($)</label>
                      <Input
                        type="number"
                        value={adminTotalAmount}
                        onChange={(e) => setAdminTotalAmount(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold">Paid Amount ($)</label>
                      <Input
                        type="number"
                        value={adminPaidAmount}
                        onChange={(e) => setAdminPaidAmount(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-border/60">
                    <label className="text-xs font-bold text-primary">Proposal Price ($)</label>
                    <Input
                      type="number"
                      value={propPrice}
                      onChange={(e) => setPropPrice(Number(e.target.value))}
                      placeholder="e.g. 1200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-primary">Estimated Duration</label>
                    <Input
                      value={propDuration}
                      onChange={(e) => setPropDuration(e.target.value)}
                      placeholder="e.g. 2 Weeks"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-primary">Proposal Description</label>
                    <Textarea
                      value={propDesc}
                      onChange={(e) => setPropDesc(e.target.value)}
                      rows={4}
                      placeholder="Scope, deliverables, timeline..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-primary">Proposal Status</label>
                    <select
                      value={propStatus}
                      onChange={(e) => setPropStatus(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-xs"
                    >
                      <option value="draft" className="bg-background">Draft</option>
                      <option value="sent" className="bg-background">Sent</option>
                      <option value="accepted" className="bg-background">Accepted</option>
                      <option value="rejected" className="bg-background">Rejected</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Internal Admin Notes</label>
                    <Textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={2}
                      placeholder="Notes on client communication or payments..."
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    <Save className="size-4" />
                    Save Order & Proposal
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
