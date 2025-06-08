"use client"

import { useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Filter, 
  Download, 
  Calendar, 
  Search,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  BarChart3,
  Wallet,
  ListFilter,
  Printer,
  History,
  User,
  Lock
} from 'lucide-react'

// Mock transaction data
const transactions = [
  { id: 'TX-2403-8A7B', type: 'buy', symbol: 'MSFT', shares: 5, price: 224.75, amount: 1123.75, date: '2023-03-15', status: 'completed' },
  { id: 'TX-2403-7C6D', type: 'sell', symbol: 'AAPL', shares: 10, price: 156.30, amount: 1563.00, date: '2023-03-10', status: 'completed' },
  { id: 'TX-2403-9E2F', type: 'buy', symbol: 'GOOGL', shares: 2, price: 2250.80, amount: 4501.60, date: '2023-03-05', status: 'completed' },
  { id: 'TX-2402-5B3A', type: 'buy', symbol: 'TSLA', shares: 8, price: 190.25, amount: 1522.00, date: '2023-02-28', status: 'completed' },
  { id: 'TX-2402-4D1C', type: 'deposit', amount: 5000.00, date: '2023-02-20', status: 'completed' },
]

// Mock account activities
const activities = [
  { type: 'login', date: '2023-03-15 14:32:45', device: 'Windows PC', location: 'Lagos, Nigeria', ip: '102.89.23.xx' },
  { type: 'password_change', date: '2023-03-10 09:15:22', device: 'iPhone 13', location: 'Lagos, Nigeria', ip: '102.89.23.xx' },
  { type: 'profile_update', date: '2023-03-05 16:48:11', device: 'Windows PC', location: 'Lagos, Nigeria', ip: '102.89.23.xx' },
  { type: 'login', date: '2023-02-28 19:02:33', device: 'Android Device', location: 'Abuja, Nigeria', ip: '105.112.18.xx' },
  { type: 'login', date: '2023-02-20 08:54:19', device: 'iPhone 13', location: 'Lagos, Nigeria', ip: '102.89.23.xx' },
]

export default function HistoryPage() {
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState(1)
  const [filterType, setFilterType] = useState('all')
  const [dateRange, setDateRange] = useState('30d')
  
  // Filter transactions based on type
  const filteredTransactions = transactions.filter(tx => {
    if (filterType === 'all') return true
    return tx.type === filterType
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">History</h1>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>
      
      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="account">Account Activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          {/* Filter Controls */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex gap-2 flex-wrap">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Transaction Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Transactions</SelectItem>
                      <SelectItem value="buy">Buy Orders</SelectItem>
                      <SelectItem value="sell">Sell Orders</SelectItem>
                      <SelectItem value="deposit">Deposits</SelectItem>
                      <SelectItem value="withdrawal">Withdrawals</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                      <SelectItem value="90d">Last 90 Days</SelectItem>
                      <SelectItem value="1y">Last Year</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input 
                    placeholder="Search transactions..."
                    className="pl-10 w-full sm:w-[250px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-green-600" />
                Transaction History
              </CardTitle>
              <CardDescription>
                View and track your trading activities and financial transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Transaction ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Details</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((tx, index) => (
                        <tr key={tx.id} className={index !== filteredTransactions.length - 1 ? 'border-b' : ''}>
                          <td className="py-3 px-4 font-mono text-sm">{tx.id}</td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant="outline" 
                              className={`
                                ${tx.type === 'buy' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                                ${tx.type === 'sell' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                                ${tx.type === 'deposit' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                ${tx.type === 'withdrawal' ? 'bg-orange-50 text-orange-700 border-orange-200' : ''}
                              `}
                            >
                              {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            {tx.type === 'buy' || tx.type === 'sell' ? (
                              <div>
                                <div className="font-medium">{tx.symbol}</div>
                                <div className="text-xs text-gray-500">{tx.shares} shares @ ${tx.price}</div>
                              </div>
                            ) : (
                              <div className="font-medium">
                                {tx.type === 'deposit' ? 'Account Deposit' : 'Account Withdrawal'}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right font-medium">
                            ${tx.amount.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-gray-500">
                            {tx.date}
                          </td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant="outline" 
                              className={`
                                ${tx.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                ${tx.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                                ${tx.status === 'failed' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                              `}
                            >
                              {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500">
                          No transactions found matching your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-500">
                  Showing {filteredTransactions.length} of {transactions.length} transactions
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">Page {currentPage}</span>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                Account Activity Log
              </CardTitle>
              <CardDescription>
                Track all activities on your account for security monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-full">
                        {activity.type === 'login' && <Wallet className="h-5 w-5 text-blue-600" />}
                        {activity.type === 'password_change' && <Lock className="h-5 w-5 text-purple-600" />}
                        {activity.type === 'profile_update' && <User className="h-5 w-5 text-green-600" />}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">
                            {activity.type === 'login' && 'Account Login'}
                            {activity.type === 'password_change' && 'Password Changed'}
                            {activity.type === 'profile_update' && 'Profile Updated'}
                          </h4>
                          <span className="text-sm text-gray-500">{activity.date}</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {activity.device} • {activity.location} • IP: {activity.ip}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mt-6">
                <Button variant="outline">
                  Load More Activities
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Transaction Analytics
              </CardTitle>
              <CardDescription>
                Visualize your trading patterns and financial activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border">
                <div className="text-center space-y-3">
                  <BarChart3 className="h-10 w-10 text-gray-300 mx-auto" />
                  <div className="text-gray-500">Transaction analytics visualization</div>
                  <Button variant="outline" size="sm">Generate Report</Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <ArrowUpRight className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Buy Volume</p>
                      <p className="text-xl font-bold">$7,147.35</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <ArrowDownLeft className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Sell Volume</p>
                      <p className="text-xl font-bold">$1,563.00</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Wallet className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Net Deposits</p>
                      <p className="text-xl font-bold">$5,000.00</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print Report
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download CSV
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 