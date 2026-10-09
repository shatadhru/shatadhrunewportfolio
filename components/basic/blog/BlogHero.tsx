import React from 'react'
import { BookOpen, Newspaper } from 'lucide-react'
import { BlogSearch } from './BlogSearch'
import { CategoryFilter } from './CategoryFilter'
import { BlogCategory } from './types'

interface BlogHeroProps {
  categories?: BlogCategory[]
  activeCategory?: string
  totalCount?: number
}

export function BlogHero({
  categories = [],
  activeCategory,
  totalCount,
}: BlogHeroProps) {
  return (
    <section className="relative py-14 sm:py-20 overflow-hidden border-b border-border/60 bg-muted/10">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-primary/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-10 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-blue-500/10 blur-[110px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6">
        
        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 shadow-xs backdrop-blur-md">
          <Newspaper className="size-3.5 text-primary" />
          <span>Engineering Insights & Tutorials</span>
        </div>

        {/* Title & Description */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Explore <span className="text-primary">
Blogs            </span>
          </h1>
          
        </div>

        {/* Search Input Box */}
        <div className="flex justify-center pt-2">
          <BlogSearch className="w-full max-w-lg shadow-sm" />
        </div>

        {/* Category Pills */}
        {categories.length > 0 && (
          <div className="pt-2 flex justify-center">
            <CategoryFilter categories={categories} activeCategory={activeCategory} />
          </div>
        )}
      </div>
    </section>
  )
}

export default BlogHero

