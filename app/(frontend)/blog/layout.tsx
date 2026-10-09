import { Footer } from '@/components/basic/footer'
import Header from '@/components/basic/header'
import React from 'react'


export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-teal-500/20 selection:text-teal-700 dark:selection:text-teal-300">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}
