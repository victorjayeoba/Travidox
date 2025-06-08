"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

interface MobileNavProps {
  links: {
    href: string
    label: string
    icon?: React.ReactNode
    isActive?: (pathname: string) => boolean
  }[]
  children?: React.ReactNode
}

export function MobileNav({ links, children }: MobileNavProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="mr-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px] sm:max-w-[280px]">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              {children}
            </div>
            <nav className="flex-1 overflow-auto py-2">
              <ul className="flex flex-col px-2 space-y-1">
                {links.map((link) => {
                  const isActive = link.isActive 
                    ? link.isActive(pathname) 
                    : pathname === link.href || pathname.startsWith(`${link.href}/`);
                    
                  return (
                    <li key={link.href}>
                      <Link 
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 text-sm rounded-md",
                          isActive
                            ? "bg-green-50 text-green-700 font-medium"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        )}
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
} 