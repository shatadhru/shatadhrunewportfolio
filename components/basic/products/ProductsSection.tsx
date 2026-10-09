import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface ProductItem {
  id?: string
  title: string
  description: string
  category: string
  year: string
  url?: string
  tags: string[]
}

const defaultProducts: ProductItem[] = [
  {
    id: '1',
    title: 'NextLoad',
    description: 'A production-ready Next.js and Payload CMS starter designed for building modern web applications faster.',
    category: 'Developer Tool',
    year: '2026',
    url: '/admin',
    tags: ['Next.js', 'Payload CMS', 'MongoDB', 'Better Auth'],
  },
  {
    id: '2',
    title: 'Fastmerch',
    description: 'A modern self-hosted commerce platform focused on performance, flexibility, and developer experience.',
    category: 'E-commerce',
    year: '2026',
    url: '#',
    tags: ['Next.js', 'Node.js', 'MongoDB', 'TypeScript'],
  },
  {
    id: '3',
    title: 'UTM Education',
    description: 'A modern education platform for courses, classes, enrollments, and digital learning experiences.',
    category: 'Education',
    year: '2026',
    url: '#',
    tags: ['Next.js', 'Payload CMS', 'Better Auth', 'MongoDB'],
  },
]

export function ProductsSection({ products = defaultProducts }: { products?: ProductItem[] }) {
  return (
    <section className="w-full px-4 py-16 sm:px-6 md:py-20 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <Badge>My Products</Badge>

        <h2 className="mt-4 max-w-4xl text-pretty text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          Products I&apos;ve <span className="text-primary">Built</span>
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
          A collection of products, platforms, and developer tools I&apos;ve built and worked on.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((item, idx) => (
            <Card key={item.id || idx} className="group p-0 flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card transition-all duration-300 hover:bg-muted/30 hover:shadow-md">
              <CardHeader className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <Badge>{item.category}</Badge>
                  <span className="text-xs text-muted-foreground">{item.year}</span>
                </div>

                <CardTitle className="mt-3 text-2xl">{item.title}</CardTitle>

                <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
              </CardHeader>

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
                    View Product
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
