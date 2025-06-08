import React from 'react'
import { cn } from '@/lib/utils'

interface Column<T> {
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
  className?: string
  showOnMobile?: boolean
}

interface ResponsiveTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyField: keyof T
  className?: string
  emptyState?: React.ReactNode
  onRowClick?: (row: T) => void
}

export function ResponsiveTable<T>({
  data,
  columns,
  keyField,
  className,
  emptyState,
  onRowClick
}: ResponsiveTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="p-8 text-center">
        {emptyState || (
          <div className="text-gray-500 text-sm">No data available</div>
        )}
      </div>
    )
  }

  // Helper function to get cell value
  const getCellValue = (row: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row)
    }
    
    return row[column.accessor] as React.ReactNode
  }

  return (
    <div className="w-full">
      {/* Desktop view - traditional table */}
      <div className="hidden md:block overflow-x-auto">
        <table className={cn("w-full border-collapse", className)}>
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((column, index) => (
                <th 
                  key={index} 
                  className={cn(
                    "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr 
                key={String(row[keyField])}
                className={cn(
                  "border-b border-gray-200 hover:bg-gray-50 transition-colors",
                  onRowClick ? "cursor-pointer" : ""
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((column, colIndex) => (
                  <td 
                    key={colIndex}
                    className={cn(
                      "px-4 py-3 text-sm text-gray-900",
                      column.className
                    )}
                  >
                    {getCellValue(row, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view - card-based layout */}
      <div className="md:hidden space-y-4">
        {data.map((row) => (
          <div 
            key={String(row[keyField])}
            className={cn(
              "bg-white border border-gray-200 rounded-lg p-4 shadow-sm",
              onRowClick ? "cursor-pointer" : ""
            )}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
          >
            {columns
              .filter(col => col.showOnMobile !== false)
              .map((column, index) => (
                <div key={index} className="flex items-start py-2 border-b border-gray-100 last:border-0">
                  <div className="text-xs font-medium text-gray-500 w-1/3">
                    {column.header}
                  </div>
                  <div className="text-sm text-gray-900 w-2/3">
                    {getCellValue(row, column)}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  )
} 