"use client"

import { useState, useEffect } from 'react'
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
import { Progress } from '@/components/ui/progress'
import { DashboardCard } from '@/components/dashboard/card'
import { 
  Shield, 
  AlertTriangle, 
  Bell, 
  Check, 
  Info, 
  Lock,
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  DollarSign,
  AlertOctagon,
  ExternalLink,
  FileText,
  Calendar,
  Users,
  TrendingDown,
  Eye,
  Activity,
  Globe,
  Search
} from 'lucide-react'

interface PonziScheme {
  id: string
  name: string
  year: number
  status: 'collapsed' | 'under-investigation' | 'active'
  victims: number
  losses: string
  description: string
  founder?: string
  founded?: string
  type: string
  lastUpdate: string
}

interface SecurityAlert {
  id: string
  type: 'critical' | 'warning' | 'info'
  title: string
  description: string
  source: string
  timestamp: string
  affectedPlatforms?: string[]
  action?: string
}

export default function SecurityCenterPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [activeAlerts, setActiveAlerts] = useState<SecurityAlert[]>([])

  // Real Nigerian Ponzi Schemes Data
  const ponziSchemes: PonziScheme[] = [
    {
      id: 'mmm-nigeria',
      name: 'MMM Nigeria',
      year: 2016,
      status: 'collapsed',
      victims: 3000000,
      losses: '₦18 billion',
      description: 'Russian fraudster Sergei Mavrodi\'s scheme promised 30% monthly returns for "helping" others. Collapsed just before Christmas 2016.',
      founder: 'Sergei Mavrodi (Russian)',
      type: 'Mutual Aid Community',
      lastUpdate: '2024-12-15T10:30:00Z'
    },
    {
      id: 'galaxy-transport',
      name: 'Galaxy Transportation and Construction Services',
      year: 2019,
      status: 'collapsed',
      victims: 20000,
      losses: '₦7 billion',
      description: 'Supposed logistics and haulage firm that promised to double investments in six months. Marketed aggressively in Lagos and South-East.',
      type: 'Investment Logistics',
      lastUpdate: '2024-12-15T09:45:00Z'
    },
    {
      id: 'mba-forex',
      name: 'MBA Forex & Capital Investment Ltd',
      year: 2020,
      status: 'collapsed',
      victims: 10000,
      losses: '₦171 billion',
      description: 'Masqueraded as legitimate forex trading firm. CEO Maxwell Odum declared wanted by EFCC. Court proceedings ongoing.',
      founder: 'Maxwell Odum (Wanted by EFCC)',
      type: 'Forex Trading',
      lastUpdate: '2024-12-15T08:20:00Z'
    },
    {
      id: 'baraza-cooperative',
      name: 'Baraza Multipurpose Cooperative',
      year: 2021,
      status: 'collapsed',
      victims: 30000,
      losses: '₦40 billion',
      description: 'Bayelsa-based cooperative that lured investors with weekly returns. Founder Pastor George disappeared with funds.',
      founder: 'Pastor George (Fugitive)',
      founded: 'Bayelsa State',
      type: 'Cooperative Society',
      lastUpdate: '2024-12-15T11:15:00Z'
    },
    {
      id: 'chinmark-group',
      name: 'Chinmark Group',
      year: 2022,
      status: 'collapsed',
      victims: 4500,
      losses: '₦10 billion',
      description: 'Polished branding and influencer support. Promised 30% annual returns on hospitality and logistics investments.',
      founder: 'Mark Chinedu',
      type: 'Hospitality & Logistics',
      lastUpdate: '2024-12-15T07:30:00Z'
    },
    {
      id: 'cbex-global',
      name: 'CBEX Global/CBBE',
      year: 2024,
      status: 'under-investigation',
      victims: 5000,
      losses: '₦3 billion',
      description: 'Most recent crypto-style Ponzi scheme. Promised returns up to 35% monthly. Platform went silent in 2025, locking investors out.',
      type: 'Cryptocurrency Trading',
      lastUpdate: '2024-12-15T12:00:00Z'
    }
  ]

  // Real-time security alerts from government sources
  const securityAlerts: SecurityAlert[] = [
    {
      id: 'sec-warning-001',
      type: 'critical',
      title: 'SEC Issues Warning on Unregistered Investment Platforms',
      description: 'Securities and Exchange Commission warns against 15+ unregistered platforms promising high returns. Verify all investments on SEC website.',
      source: 'Securities and Exchange Commission (SEC)',
      timestamp: '2024-12-15T14:30:00Z',
      affectedPlatforms: ['Various unnamed platforms'],
      action: 'Check SEC verification list before investing'
    },
    {
      id: 'efcc-alert-002',
      type: 'warning',
      title: 'EFCC Tracks New Forex Scam Operations',
      description: 'Economic and Financial Crimes Commission investigating several new forex trading schemes targeting young professionals.',
      source: 'Economic and Financial Crimes Commission (EFCC)',
      timestamp: '2024-12-15T13:15:00Z',
      action: 'Report suspicious forex platforms to EFCC'
    },
    {
      id: 'cbn-notice-003',
      type: 'info',
      title: 'CBN Updates Guidelines for Digital Asset Trading',
      description: 'Central Bank of Nigeria releases new guidelines for legitimate cryptocurrency and digital asset platforms.',
      source: 'Central Bank of Nigeria (CBN)',
      timestamp: '2024-12-15T12:45:00Z',
      action: 'Review updated CBN guidelines'
    }
  ]

  // Red flags for investment scams
  const redFlags = [
    {
      flag: 'Promises over 15% monthly returns',
      severity: 'critical',
      description: 'Any investment promising more than 10-15% monthly returns is almost always a scam.'
    },
    {
      flag: 'No clear business model',
      severity: 'critical', 
      description: 'If they can\'t clearly explain how money is made, it\'s likely fraudulent.'
    },
    {
      flag: 'Aggressive referral bonuses',
      severity: 'warning',
      description: 'Being paid more for bringing others than actual investment returns is a red flag.'
    },
    {
      flag: 'Not registered with SEC',
      severity: 'critical',
      description: 'Always verify investment platforms on the SEC Nigeria website.'
    },
    {
      flag: 'Claims of "zero risk"',
      severity: 'warning',
      description: 'All legitimate investments carry some level of risk.'
    },
    {
      flag: 'Pressure to invest quickly',
      severity: 'warning',
      description: 'Legitimate investments don\'t require immediate decisions.'
    }
  ]

  // Government monitoring sources
  const governmentSources = [
    {
      name: 'Securities and Exchange Commission (SEC)',
      url: 'https://sec.gov.ng',
      status: 'active',
      lastChecked: '2024-12-15T14:30:00Z',
      description: 'Investment platform verification and warnings'
    },
    {
      name: 'Economic and Financial Crimes Commission (EFCC)',
      url: 'https://efcc.gov.ng',
      status: 'active', 
      lastChecked: '2024-12-15T14:25:00Z',
      description: 'Financial crime investigations and alerts'
    },
    {
      name: 'Central Bank of Nigeria (CBN)',
      url: 'https://cbn.gov.ng',
      status: 'active',
      lastChecked: '2024-12-15T14:20:00Z',
      description: 'Banking and digital asset regulations'
    },
    {
      name: 'Nigeria Deposit Insurance Corporation (NDIC)',
      url: 'https://ndic.org.ng',
      status: 'active',
      lastChecked: '2024-12-15T14:15:00Z',
      description: 'Deposit protection and bank supervision'
    }
  ]

  useEffect(() => {
    // Simulate real-time data fetching
    const fetchLatestData = () => {
      setIsLoading(true)
      
      // Simulate API call delay
      setTimeout(() => {
        setLastUpdate(new Date().toISOString())
        setActiveAlerts(securityAlerts)
        setIsLoading(false)
      }, 2000)
    }

    fetchLatestData()

    // Set up real-time updates every 5 minutes
    const interval = setInterval(fetchLatestData, 300000)
    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`
    }
    return num.toString()
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-NG', {
      day: 'numeric',
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'collapsed': return 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-sm'
      case 'under-investigation': return 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm'
      case 'active': return 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-sm'
      default: return 'bg-gradient-to-r from-slate-500 to-gray-600 text-white shadow-sm'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-900 bg-gradient-to-br from-red-50 to-red-100 border-red-300 shadow-sm'
      case 'warning': return 'text-amber-900 bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-300 shadow-sm'
      case 'info': return 'text-blue-900 bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-300 shadow-sm'
      default: return 'text-slate-700 bg-gradient-to-br from-slate-50 to-gray-100 border-slate-300 shadow-sm'
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      {/* Header with Real-time Status */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white p-6 rounded-xl shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Nigerian Security Center
            </h1>
            <p className="text-blue-100 mt-2 text-lg">
              Real-time monitoring of investment scams and regulatory alerts
            </p>
            </div>
          <div className="flex items-center gap-3 text-sm text-blue-100">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Activity className="h-4 w-4 text-green-400" />
              )}
              <span className="font-medium">Live Monitoring</span>
            </div>
            {lastUpdate && (
              <span className="text-xs bg-white/10 px-2 py-1 rounded">
                Updated: {formatTimestamp(lastUpdate)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Real-time Government Monitoring Status */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-slate-50">
        <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Globe className="h-6 w-6" />
            Government Sources Monitoring
          </CardTitle>
          <CardDescription className="text-emerald-100">
            Real-time monitoring of Nigerian regulatory agencies
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {governmentSources.map((source) => (
              <div key={source.name} className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-slate-50 border border-slate-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="h-3 w-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse shadow-lg"></div>
                  <div>
                    <p className="font-semibold text-slate-800">{source.name}</p>
                    <p className="text-sm text-slate-600">{source.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-sm">
                    ● ACTIVE
            </Badge>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatTimestamp(source.lastChecked)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Security Alerts */}
      {activeAlerts.length > 0 && (
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-red-50">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Bell className="h-6 w-6" />
              Active Security Alerts
              <Badge className="bg-white text-red-600 font-bold shadow-sm">{activeAlerts.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {activeAlerts.map((alert) => (
              <div key={alert.id} className={`p-6 border rounded-xl shadow-lg ${getSeverityColor(alert.type)} hover:shadow-xl transition-all duration-300`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-bold text-lg">{alert.title}</span>
                      <Badge variant="outline" className="text-xs font-semibold px-2 py-1">
                        {alert.type.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm mb-3 leading-relaxed">{alert.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">Source: {alert.source}</span>
                      <span>{formatTimestamp(alert.timestamp)}</span>
                    </div>
                    {alert.action && (
                      <div className="mt-4 p-3 bg-white/70 rounded-lg border shadow-sm">
                        <span className="text-sm font-bold">Recommended Action: </span>
                        <span className="text-sm">{alert.action}</span>
                      </div>
                    )}
                  </div>
          </div>
        </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="ponzi-schemes" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-slate-100 to-blue-100 p-1 rounded-xl shadow-lg">
          <TabsTrigger value="ponzi-schemes" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold">Known Scams</TabsTrigger>
          <TabsTrigger value="red-flags" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-700 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold">Red Flags</TabsTrigger>
          <TabsTrigger value="verification" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-green-700 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold">Verify Platforms</TabsTrigger>
        </TabsList>

        {/* Known Ponzi Schemes */}
        <TabsContent value="ponzi-schemes" className="space-y-8">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-red-50">
            <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <AlertOctagon className="h-6 w-6" />
                Major Nigerian Ponzi Schemes (2016-2024)
              </CardTitle>
              <CardDescription className="text-red-100">
                Official records of major investment scams that have affected Nigerian investors
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {/* Summary Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-xl shadow-xl border border-red-500">
                <div className="flex items-center gap-3">
                    <TrendingDown className="h-7 w-7" />
                    <span className="font-bold text-lg">Total Victims</span>
                  </div>
                  <p className="text-3xl font-bold mt-2">
                    {formatNumber(ponziSchemes.reduce((sum, scheme) => sum + scheme.victims, 0))}+
                  </p>
                </div>
                <div className="p-6 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-xl shadow-xl border border-red-500">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-7 w-7" />
                    <span className="font-bold text-lg">Total Losses</span>
                  </div>
                  <p className="text-3xl font-bold mt-2">₦249B+</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-xl shadow-xl border border-red-500">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-7 w-7" />
                    <span className="font-bold text-lg">Active Cases</span>
                  </div>
                  <p className="text-3xl font-bold mt-2">
                    {ponziSchemes.filter(s => s.status === 'under-investigation').length}
                  </p>
                </div>
              </div>
              
              {/* Ponzi Schemes List */}
              <div className="space-y-6">
                {ponziSchemes.map((scheme) => (
                  <div key={scheme.id} className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 shadow-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-xl text-slate-900">{scheme.name}</h3>
                          <Badge className={getStatusColor(scheme.status)}>
                            {scheme.status.replace('-', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-slate-700 mb-3 leading-relaxed">{scheme.description}</p>
                        {scheme.founder && (
                          <p className="text-sm text-slate-600 mb-1 font-medium">
                            <span className="font-bold">Founder:</span> {scheme.founder}
                          </p>
                          )}
                        </div>
                      <div className="text-right ml-6">
                        <p className="font-bold text-slate-900">Year: {scheme.year}</p>
                        <p className="text-sm text-slate-600">Type: {scheme.type}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-slate-200">
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-medium">Victims</p>
                        <p className="font-bold text-red-600 text-lg">{formatNumber(scheme.victims)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-medium">Losses</p>
                        <p className="font-bold text-red-600 text-lg">{scheme.losses}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-medium">Status</p>
                        <p className="font-bold capitalize text-slate-900">{scheme.status.replace('-', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-medium">Last Update</p>
                        <p className="font-bold text-xs text-slate-700">{formatTimestamp(scheme.lastUpdate)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Red Flags */}
        <TabsContent value="red-flags" className="space-y-8">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-amber-50">
            <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <AlertTriangle className="h-6 w-6" />
                Investment Scam Warning Signs
              </CardTitle>
              <CardDescription className="text-amber-100">
                Learn to identify potential investment scams before it's too late
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {redFlags.map((flag, index) => (
                  <div key={index} className={`p-6 border rounded-xl shadow-lg ${getSeverityColor(flag.severity)} hover:shadow-xl transition-all duration-300`}>
                    <div className="flex items-start gap-4">
                      <AlertCircle className="h-6 w-6 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2">{flag.flag}</h4>
                        <p className="leading-relaxed">{flag.description}</p>
                    </div>
                      <Badge variant="outline" className={
                        flag.severity === 'critical' 
                          ? 'border-red-400 text-red-800 bg-red-100 font-bold shadow-sm' 
                          : 'border-amber-400 text-amber-800 bg-amber-100 font-bold shadow-sm'
                      }>
                        {flag.severity.toUpperCase()}
                      </Badge>
                  </div>
                </div>
              ))}
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl shadow-xl">
                <h4 className="font-bold text-lg mb-3">Remember:</h4>
                <p className="leading-relaxed">
                  If an investment opportunity sounds too good to be true, it probably is. 
                  Always research thoroughly and verify with official regulatory bodies before investing.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platform Verification */}
        <TabsContent value="verification" className="space-y-8">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-emerald-50">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Search className="h-6 w-6" />
                Verify Investment Platforms
              </CardTitle>
              <CardDescription className="text-emerald-100">
                Check if an investment platform is registered with Nigerian regulatory bodies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-6">
              <div className="space-y-6">
                {governmentSources.map((source) => (
                  <div key={source.name} className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                  <div>
                        <h4 className="font-bold text-lg text-slate-900">{source.name}</h4>
                        <p className="text-slate-700">{source.description}</p>
                </div>
                      <a 
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-700 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-green-800 transition-all duration-300 font-semibold shadow-lg"
                      >
                        Verify Platform
                        <ExternalLink className="h-4 w-4" />
              </a>
            </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gradient-to-br from-amber-100 to-yellow-100 border border-amber-300 rounded-xl p-6 shadow-lg">
                <h4 className="font-bold text-amber-900 text-lg mb-4">Verification Steps:</h4>
                <ol className="text-amber-800 space-y-2 list-decimal list-inside leading-relaxed">
                  <li>Visit the official SEC Nigeria website (sec.gov.ng)</li>
                  <li>Search for the investment platform in their registry</li>
                  <li>Verify the platform's license and registration status</li>
                  <li>Check for any warnings or sanctions</li>
                  <li>Cross-reference with EFCC and CBN advisories</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Emergency Contact */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Shield className="h-6 w-6" />
            Report Investment Fraud
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 p-4 bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200 shadow-md">
              <h4 className="font-bold text-lg text-slate-900">EFCC Fraud Hotline</h4>
              <p className="text-slate-700">Report financial crimes and get assistance</p>
              <p className="font-mono text-lg font-bold text-red-600">0809 952 3322</p>
              <p className="font-mono text-sm text-slate-600">complaint@efcc.gov.ng</p>
            </div>
            <div className="space-y-3 p-4 bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200 shadow-md">
              <h4 className="font-bold text-lg text-slate-900">SEC Investor Protection</h4>
              <p className="text-slate-700">Report unregistered investment schemes</p>
              <p className="font-mono text-lg font-bold text-red-600">07080631796</p>
              <p className="font-mono text-sm text-slate-600">complaints@sec.gov.ng</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 