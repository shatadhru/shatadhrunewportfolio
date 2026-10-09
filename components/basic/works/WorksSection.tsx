import React from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface WorkItem {
  id?: string
  title: string
  description: string
  category: string
  status: string
  url?: string
  image: string
  tags: string[]
}

const defaultWorks: WorkItem[] = [
  {
    id: '1',
    title: 'Mr Tripy',
    description: 'A modern travel platform for tours, visa services, flights, hotels, and travel bookings.',
    category: 'Travel Platform',
    status: 'Live',
    image: '/work/mrtripy.png',
    url: '#',
    tags: ['Next.js', 'Payload CMS', 'MongoDB'],
  },
  {
    id: '2',
    title: 'UTM Education',
    description: 'An online education platform for courses, classes, student enrollments, and digital learning.',
    category: 'Education Platform',
    status: 'Live',
    image: '/work/utm.png',
    url: '#',
    tags: ['Next.js', 'Payload CMS', 'Better Auth'],
  },
  {
    id: '3',
    title: 'Custom Web App',
    description: 'A custom web application built around specific business requirements and workflows.',
    category: 'Web Application',
    status: 'Completed',
    image: '/work/project.png',
    url: '#',
    tags: ['Next.js', 'Node.js', 'PostgreSQL'],
  },
]

export function WorksSection({ works = defaultWorks }: { works?: WorkItem[] }) {
  return (
    <section className="w-full px-4 py-16 sm:px-6 md:py-20 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <Badge>Work Demo</Badge>

        <h2 className="mt-4 max-w-4xl text-pretty text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          Some of My <span className="text-primary">Recent Work</span>
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
          A selection of websites and applications I&apos;ve designed, developed, and delivered for real-world use.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {works.map((item, idx) => (
            <Card key={item.id || idx} className="group p-0 flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card transition-all duration-300 hover:shadow-md">
              <div>
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <Image
                    src={item.image || '/work/project.png'}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <CardHeader className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <Badge>{item.category}</Badge>
                    <span className="text-xs text-muted-foreground">{item.status}</span>
                  </div>

                  <CardTitle className="mt-3 text-2xl">{item.title}</CardTitle>

                  <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                </CardHeader>
              </div>

              <CardContent className="p-6 pt-0">
                <div className="flex flex-wrap gap-2">
                  {item.tags?.map((tag, tIdx) => (
                    <Badge key={tIdx} variant="secondary">
                      {typeof tag === 'object' && tag !== null ? (tag as any).tag || String(tag) : String(tag)}
                    </Badge>
                  ))}
                </div>

                <a href={item.url || '#'} target={item.url?.startsWith('http') ? '_blank' : '_self'} rel="noreferrer" className="block mt-6">
                  <Button variant="outline" className="w-full">
                    {item.status === 'Live' ? 'View Live Demo' : 'View Project'}
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
