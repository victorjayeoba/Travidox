import React from 'react'
import { Metadata } from 'next'
import { ProductsSection } from '@/components/products-section'

export const metadata: Metadata = {
  title: 'Products | Travidox',
  description: 'Explore our range of investment products and services designed to help you build a secure financial future.',
  keywords: 'investment products, trading, financial services, Travidox products',
  openGraph: {
    title: 'Investment Products | Travidox',
    description: 'Discover our comprehensive range of investment products and services.',
    url: 'https://travidox.com/products',
    siteName: 'Travidox',
    images: [
      {
        url: '/images/products-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Travidox Investment Products',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Investment Products | Travidox',
    description: 'Discover our comprehensive range of investment products and services.',
    images: ['/images/products-og.jpg'],
  },
}

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Investment Products</h1>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-12">
        Explore our range of investment products designed to help you achieve your financial goals.
      </p>
      <ProductsSection />
    </div>
  )
} 