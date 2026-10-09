"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/basic/header'
import { Footer } from '@/components/basic/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle2, ArrowRight, ShieldCheck, Send } from 'lucide-react'

export default function OrderPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'web_dev',
    projectTitle: '',
    requirements: '',
    budget: '',
    deadline: '',
    referenceLinks: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submittedOrder, setSubmittedOrder] = useState<{ id: string; orderNumber: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit project request.')
      }

      setSubmittedOrder(data.order)
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-12 xl:px-20 max-w-5xl mx-auto w-full">
        {submittedOrder ? (
          <Card className="p-0 border border-primary/30 bg-card overflow-hidden my-8 shadow-lg">
            <CardContent className="p-8 text-center space-y-6">
              <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 className="size-8" />
              </div>

              <div className="space-y-2">
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                  Request Received
                </Badge>
                <h1 className="text-3xl font-extrabold tracking-tight">Order #{submittedOrder.orderNumber}</h1>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Thank you! Your project request has been submitted. I will review your requirements and get back to you with a proposal shortly.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-border/60">
                <Link href="/dashboard/orders">
                  <Button variant="default" className="w-full sm:w-auto">
                    Track Order in Dashboard
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Return to Homepage
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <Badge>Project Order Request</Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                Start Your <span className="text-primary">Project</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Fill out the project request form below with your requirements. I will review your request and send a tailored proposal with estimated timelines and pricing.
              </p>
            </div>

            <Card className="p-0 border border-border/80 bg-card shadow-md overflow-hidden">
              <CardHeader className="p-6 sm:p-8 border-b border-border/60">
                <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                  <Send className="size-5 text-primary" />
                  Project Specification & Contact Details
                </CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Provide as much detail as possible so we can get started smoothly.
                </p>
              </CardHeader>

              <CardContent className="p-6 sm:p-8 space-y-6">
                {error && (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground">
                        Your Name <span className="text-destructive">*</span>
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground">
                        Email Address <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground">
                        Phone / WhatsApp
                      </label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 234 567 890"
                      />
                    </div>
                  </div>

                  {/* Service & Title */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground">
                        Service Category <span className="text-destructive">*</span>
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="web_dev" className="bg-background">Web Development</option>
                        <option value="app_dev" className="bg-background">App Development (Mobile/Desktop)</option>
                        <option value="ui_ux" className="bg-background">UI/UX Design</option>
                        <option value="payload_cms" className="bg-background">Payload CMS Integration</option>
                        <option value="fullstack" className="bg-background">Full-Stack Custom Web App</option>
                        <option value="other" className="bg-background">Other Custom Service</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground">
                        Project Title <span className="text-destructive">*</span>
                      </label>
                      <Input
                        name="projectTitle"
                        value={formData.projectTitle}
                        onChange={handleChange}
                        placeholder="e.g. E-learning Web Application"
                        required
                      />
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">
                      Detailed Project Requirements <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Describe what you want to build, key features, target audience, technical preferences, etc."
                      required
                    />
                  </div>

                  {/* Budget & Deadline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground">
                        Estimated Budget
                      </label>
                      <Input
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        placeholder="e.g. $500 - $1,500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground">
                        Expected Deadline / Timeline
                      </label>
                      <Input
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        placeholder="e.g. Within 3 weeks / Oct 30"
                      />
                    </div>
                  </div>

                  {/* Reference links */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">
                      Reference Links / Inspiration URLs
                    </label>
                    <Textarea
                      name="referenceLinks"
                      value={formData.referenceLinks}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Links to websites, Figma designs, or document references (one per line)"
                    />
                  </div>

                  <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
                      <span>No payment required upfront. Proposal will be sent first.</span>
                    </div>

                    <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
                      Submit Order Request
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
