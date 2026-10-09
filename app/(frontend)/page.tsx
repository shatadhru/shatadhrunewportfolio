import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

import { Footer } from '@/components/basic/footer'
import Header from '@/components/basic/header'
import { ProductsSection } from '@/components/basic/products/ProductsSection'
import { WorksSection } from '@/components/basic/works/WorksSection'
import { PostCard } from '@/components/basic/blog/PostCard'
import { BlogPost } from '@/components/basic/blog/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { FaLocationCrosshairs, FaWhatsapp } from 'react-icons/fa6'
import StackIcon from 'tech-stack-icons'




const webStack = [
  {
    name: 'Next.js',
    icon: <StackIcon name="nextjs" />,
  },
  {
    name: 'React',
    icon: <StackIcon name="react" />,
  },
  {
    name: 'Node.js',
    icon: <StackIcon name="nodejs" />,
  },
  {
    name: 'Tailwind CSS',
    icon: <StackIcon name="tailwindcss" />,
  },
  {
    name: 'shadcn/ui',
    icon: <StackIcon name="shadcnui" />,
  },
  {
    name: 'MongoDB',
    icon: <StackIcon name="mongodb" />,
  },
  {
    name: 'PostgreSQL',
    icon: <StackIcon name="postgresql" />,
  },
  {
    name: 'Firebase',
    icon: <StackIcon name="firebase" />,
  },
  {
    name: 'Redis',
    icon: <StackIcon name="redis" />,
  },
  {
    name: 'Git',
    icon: <StackIcon name="git" />,
  },
  {
    name: 'GitHub',
    icon: <StackIcon name="github" />,
  },
  {
    name: 'Docker',
    icon: <StackIcon name="docker" />,
  },
  {
    name: 'Vercel',
    icon: <StackIcon name="vercel"  />
  },
]

const appStack = [
  {
    name: 'React Native',
    icon: <StackIcon name="reactnative" />,
  },
  {
    name: 'Flutter',
    icon: <StackIcon name="flutter" />,
  },
  {
    name: 'Firebase',
    icon: <StackIcon name="firebase" />,
  },
  {
    name: 'Tauri',
    icon: <StackIcon name="tauri" />,
  },
  {
    name: 'Electron',
    icon: <StackIcon name="electron" />,
  },
]

function StackCard({
  title,
  description,
  stack,
}: {
  title: string
  description: string
  stack: {
    name: string
    icon: React.ReactNode
  }[]
}) {
  return (
    <Card className="rounded-2xl p-0 border border-border/80 bg-card overflow-hidden">
      <CardHeader className="p-6">
        <Badge className="w-fit">Technology</Badge>
        <CardTitle className="mt-3 text-2xl sm:text-3xl">{title}</CardTitle>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {stack.map((item) => (
            <div
              key={item.name}
              className="flex min-h-24 flex-col items-center justify-center gap-3 rounded-xl border border-border/60 bg-muted/30 p-4 text-center transition-colors hover:bg-muted"
            >
              <div className="flex size-10 items-center justify-center [&>svg]:size-9">{item.icon}</div>
              <span className="text-xs font-medium sm:text-sm">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default async function Page() {
  const payload = await getPayload({ config })

  // 1. Fetch live Products from database
  let dbProducts: any[] = []
  try {
    const productsRes = await payload.find({
      collection: 'my-products' as any,
      limit: 6,
      sort: '-createdAt',
    })
    dbProducts = (productsRes.docs || []).map((doc: any) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      category: doc.category || 'Developer Tool',
      year: doc.year || '2026',
      url: doc.url || '#',
      tags: Array.isArray(doc.tags) ? doc.tags.map((t: any) => typeof t === 'object' ? t.tag : t) : [],
    }))
  } catch (_e) {
    dbProducts = []
  }

  // 2. Fetch live Works from database
  let dbWorks: any[] = []
  try {
    const worksRes = await payload.find({
      collection: 'works' as any,
      limit: 6,
      sort: '-createdAt',
    })
    dbWorks = (worksRes.docs || []).map((doc: any) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      category: doc.category || 'Web Application',
      status: doc.status || 'Live',
      url: doc.url || '#',
      image: typeof doc.image === 'object' && doc.image ? doc.image.url || '/work/project.png' : '/work/project.png',
      tags: Array.isArray(doc.tags) ? doc.tags.map((t: any) => typeof t === 'object' ? t.tag : t) : [],
    }))
  } catch (_e) {
    dbWorks = []
  }

  // 3. Fetch live Recent Blogs from database
  let dbPosts: BlogPost[] = []
  try {
    const postsRes = await payload.find({
      collection: 'posts',
      where: {
        and: [
          { status: { equals: 'published' } },
          { visibility: { equals: 'public' } },
        ],
      },
      limit: 3,
      sort: '-publishDate',
      depth: 2,
    })
    dbPosts = (postsRes.docs || []) as unknown as BlogPost[]
  } catch (_e) {
    dbPosts = []
  }

  // Fallback showcase blog posts if DB has no published posts yet
  const fallbackPosts: BlogPost[] = [
    {
      id: 'f1',
      slug: 'javascript-vs-rust-performance',
      title: 'JavaScript vs Rust: Choosing the Right Tool for Next-Gen Web Development',
      excerpt: 'An in-depth architectural comparison between JavaScript runtimes and Rust compiled modules for backend & edge computing.',
      publishDate: '2026-10-01',
      createdAt: '2026-10-01',
      readingTime: 6,
      category: { id: 'c1', title: 'Programming', slug: 'programming' } as any,
      author: { name: 'Shatadhru', image: '/image.avif' } as any,
      featuredImage: '/blog/javascript-vs-rust.png' as unknown,
    },
    {
      id: 'f2',
      slug: 'what-is-serverless-architecture',
      title: 'What Is Serverless Architecture? Scaling Applications to Millions Without Managing Servers',
      excerpt: 'Understand cloud functions, edge runtimes, auto-scaling databases, and cost optimizations in modern serverless apps.',
      publishDate: '2026-09-28',
      createdAt: '2026-09-28',
      readingTime: 4,
      category: { id: 'c2', title: 'Web Development', slug: 'web-development' } as any,
      author: { name: 'Shatadhru', image: '/image.avif' } as any,
      featuredImage: '/blog/serverless.png' as unknown,
    },
    {
      id: 'f3',
      slug: 'building-custom-payment-provider-payload-cms',
      title: 'Building a Payment Provider in Payload CMS 3.0',
      excerpt: 'Understand payment adapters, checkout URLs, callbacks, and payment workflows in Payload CMS.',
      publishDate: '2026-09-20',
      createdAt: '2026-09-20',
      readingTime: 8,
      category: { id: 'c3', title: 'Payload CMS', slug: 'payload-cms' } as any,
      author: { name: 'Shatadhru', image: '/image.avif' } as unknown,
      featuredImage: '/blog/payload-payment.png' as never,
    },
  ]

  const recentPosts = dbPosts.length > 0 ? dbPosts : fallbackPosts

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="w-full px-4 py-12 sm:px-6 md:py-20 lg:px-12 xl:px-20">
          <div className="mx-auto max-w-7xl">
            <Badge className="mb-6">Hi, I Am Shatadhru</Badge>

            <div className="flex flex-col items-center gap-10 md:flex-row md:gap-12">
              <div className="w-full md:w-[60%]">
                <h1 className="text-pretty text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                  Your Personal
                  <br />
                  <span className="text-primary">
                    Web & App Developer
                  </span>
                </h1>

                <p className="my-6 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
                  I&apos;m a web and app developer with 4+ years of experience building modern, responsive, and user-friendly websites and applications. I turn ideas into fast, reliable, and scalable digital experiences.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/order">
                    <Button size="lg" className="w-full sm:w-auto">
                      <FaLocationCrosshairs />
                      Start a Project Request
                    </Button>
                  </Link>

                  <Link href="/dashboard/orders">
                    <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                      Track Orders & Proposals
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex w-full justify-center md:w-[40%]">
                <div className="w-56 rounded-full border-3 border-dashed border-primary p-2 sm:w-72 md:w-80 md:border-4 md:p-3 lg:w-96">
                  <Image
                    src="/image.avif"
                    alt="Shatadhru"
                    width={800}
                    height={800}
                    priority
                    className="aspect-square w-full rounded-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section (Database driven) */}
        <ProductsSection products={dbProducts.length > 0 ? dbProducts : undefined} />

        {/* Work Demo Section (Database driven) */}
        <WorksSection works={dbWorks.length > 0 ? dbWorks : undefined} />

        {/* Recent Blogs Section (Database driven) */}
        <section className="w-full px-4 py-12 sm:px-6 md:py-20 lg:px-12 xl:px-20">
          <div className="mx-auto max-w-7xl">
            <Badge>Recent Blogs</Badge>

            <h2 className="mt-4 max-w-4xl text-pretty text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Thoughts, <span className="text-primary">Tutorials</span> & Insights
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              I write about web development, programming, technologies, and things I learn while building real-world applications.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <PostCard key={post.id || post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="w-full px-4 py-12 sm:px-6 md:py-20 lg:px-12 xl:px-20 border-t border-border/50 bg-muted/10">
          <div className="mx-auto max-w-7xl">
            <Badge>Favorite Stacks</Badge>

            <h2 className="mt-4 max-w-4xl text-pretty text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              The <span className="text-primary">Tech</span> That Powers My Work
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              Technologies I use to build modern web, mobile, and desktop applications.
            </p>

            <Tabs defaultValue="web" className="mt-10 w-full">
              <TabsList className="grid h-12 w-full max-w-md grid-cols-2">
                <TabsTrigger value="web" className="text-sm sm:text-base">
                  Web Development
                </TabsTrigger>

                <TabsTrigger value="app" className="text-sm sm:text-base">
                  App Development
                </TabsTrigger>
              </TabsList>

              <TabsContent value="web" className="mt-6">
                <StackCard
                  title="Web Development"
                  description="My preferred technologies for building fast, scalable and production-ready web applications."
                  stack={webStack}
                />
              </TabsContent>

              <TabsContent value="app" className="mt-6">
                <StackCard
                  title="App Development"
                  description="Technologies I use to build mobile and cross-platform desktop applications."
                  stack={appStack}
                />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

