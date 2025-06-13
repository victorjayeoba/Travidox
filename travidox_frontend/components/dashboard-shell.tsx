interface DashboardShellProps {
  children: React.ReactNode
  className?: string
}

export function DashboardShell({
  children,
  className,
}: DashboardShellProps) {
  return (
    <div className="container mx-auto p-6">
      <div className={className}>
        {children}
      </div>
    </div>
  )
} 