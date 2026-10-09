import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowRight, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { BlogPost, BlogCategory, BlogAuthor } from './types'

interface PostCardProps {
  post: BlogPost
}

export function PostCard({ post }: PostCardProps) {
  const category = (post.category && typeof post.category === 'object' ? post.category : null) as BlogCategory | null
  const author = (post.author && typeof post.author === 'object' ? post.author : null) as BlogAuthor | null

  const imageUrl =
    typeof post.featuredImage === 'string'
      ? post.featuredImage
      : typeof post.featuredImage === 'object' && post.featuredImage
      ? post.featuredImage.cloudinary?.secure_url || post.featuredImage.url || '/placeholder.svg'
      : '/placeholder.svg'

  const formattedDate = post.publishDate
    ? new Date(post.publishDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Oct 2026'

  return (
    <Card className="group p-0 flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-300 hover:shadow-lg hover:border-primary/40 hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Link href={`/blog/${post.slug}`} className="block h-full w-full">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        {category && (
          <div className="absolute top-3 left-3 z-10">
            <Link href={`/blog/category/${category.slug}`}>
              <Badge className="bg-background/90 backdrop-blur-md text-foreground hover:bg-primary hover:text-primary-foreground border border-border/80 shadow-xs text-[11px] font-semibold transition-colors">
                {category.title}
              </Badge>
            </Link>
          </div>
        )}
      </div>

      {/* Body */}
      <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 font-medium">
              <Calendar className="size-3 text-primary" />
              {formattedDate}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 font-medium">
              <Clock className="size-3 text-primary" />
              {post.readingTime || 1} min read
            </span>
          </div>

          <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
            <Link href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h3>

          {post.excerpt && (
            <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {author?.image ? (
              <div className="relative size-6 rounded-full overflow-hidden border border-border">
                <Image src={author.image} alt={author.name || 'Author'} fill className="object-cover" />
              </div>
            ) : (
              <div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20 font-bold text-[10px]">
                {author?.name ? author.name.charAt(0).toUpperCase() : <User className="size-3" />}
              </div>
            )}
            <span className="text-muted-foreground font-medium truncate max-w-[120px]">
              {author?.name || 'Shatadhru'}
            </span>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 font-semibold text-xs text-primary hover:opacity-80 transition-colors group/link"
          >
            <span>Read Article</span>
            <ArrowRight className="size-3 transition-transform group-hover/link:translate-x-0.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default PostCard

