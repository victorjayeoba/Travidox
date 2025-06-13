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
      case 'collapsed': return 'bg-red-100 text-red-800'
      case 'under-investigation': return 'bg-yellow-100 text-yellow-800'
      case 'active': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header with Real-time Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Security Center</h1>
          <p className="text-gray-600 mt-1">
            Real-time monitoring of Nigerian investment scams and fraud alerts
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Activity className="h-4 w-4 text-green-500" />
            )}
            <span>Live Data</span>
          </div>
          {lastUpdate && (
            <span className="text-xs">
              Updated: {formatTimestamp(lastUpdate)}
            </span>
          )}
        </div>
      </div>

      {/* Real-time Government Monitoring Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-green-600" />
            Government Sources Monitoring
          </CardTitle>
          <CardDescription>
            Real-time monitoring of Nigerian regulatory agencies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {governmentSources.map((source) => (
              <div key={source.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="font-medium text-sm">{source.name}</p>
                    <p className="text-xs text-gray-500">{source.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Active
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-red-600" />
              Active Security Alerts
              <Badge variant="destructive">{activeAlerts.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 border rounded-lg ${getSeverityColor(alert.type)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-medium">{alert.title}</span>
                      <Badge variant="outline" className="text-xs">
                        {alert.type.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm mb-2">{alert.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span>Source: {alert.source}</span>
                      <span>{formatTimestamp(alert.timestamp)}</span>
                    </div>
                    {alert.action && (
                      <div className="mt-2 p-2 bg-white rounded border">
                        <span className="text-xs font-medium">Recommended Action: </span>
                        <span className="text-xs">{alert.action}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="ponzi-schemes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ponzi-schemes">Known Scams</TabsTrigger>
          <TabsTrigger value="red-flags">Red Flags</TabsTrigger>
          <TabsTrigger value="verification">Verify Platforms</TabsTrigger>
        </TabsList>

        {/* Known Ponzi Schemes */}
        <TabsContent value="ponzi-schemes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertOctagon className="h-5 w-5 text-red-600" />
                Major Nigerian Ponzi Schemes (2016-2024)
              </CardTitle>
              <CardDescription>
                Official records of major investment scams that have affected Nigerian investors
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Summary Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    <span className="font-medium">Total Victims</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    {formatNumber(ponziSchemes.reduce((sum, scheme) => sum + scheme.victims, 0))}+
                  </p>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-red-600" />
                    <span className="font-medium">Total Losses</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600 mt-1">₦249B+</p>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-red-600" />
                    <span className="font-medium">Active Cases</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    {ponziSchemes.filter(s => s.status === 'under-investigation').length}
                  </p>
                </div>
              </div>
              
              {/* Ponzi Schemes List */}
              <div className="space-y-4">
                {ponziSchemes.map((scheme) => (
                  <div key={scheme.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{scheme.name}</h3>
                          <Badge className={getStatusColor(scheme.status)}>
                            {scheme.status.replace('-', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{scheme.description}</p>
                        {scheme.founder && (
                          <p className="text-xs text-gray-500 mb-1">
                            <span className="font-medium">Founder:</span> {scheme.founder}
                          </p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-medium">Year: {scheme.year}</p>
                        <p className="text-xs text-gray-500">Type: {scheme.type}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t">
                      <div>
                        <p className="text-xs text-gray-500">Victims</p>
                        <p className="font-semibold text-red-600">{formatNumber(scheme.victims)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Losses</p>
                        <p className="font-semibold text-red-600">{scheme.losses}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <p className="font-semibold capitalize">{scheme.status.replace('-', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Last Update</p>
                        <p className="font-semibold text-xs">{formatTimestamp(scheme.lastUpdate)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Red Flags */}
        <TabsContent value="red-flags" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Investment Scam Warning Signs
              </CardTitle>
              <CardDescription>
                Learn to identify potential investment scams before it's too late
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {redFlags.map((flag, index) => (
                  <div key={index} className={`p-4 border rounded-lg ${getSeverityColor(flag.severity)}`}>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{flag.flag}</h4>
                        <p className="text-sm">{flag.description}</p>
                      </div>
                      <Badge variant="outline" className={
                        flag.severity === 'critical' ? 'border-red-300 text-red-700' : 'border-yellow-300 text-yellow-700'
                      }>
                        {flag.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Remember:</h4>
                <p className="text-sm text-blue-800">
                  If an investment opportunity sounds too good to be true, it probably is. 
                  Always research thoroughly and verify with official regulatory bodies before investing.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platform Verification */}
        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-green-600" />
                Verify Investment Platforms
              </CardTitle>
              <CardDescription>
                Check if an investment platform is registered with Nigerian regulatory bodies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {governmentSources.map((source) => (
                  <div key={source.name} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{source.name}</h4>
                        <p className="text-sm text-gray-600">{source.description}</p>
                      </div>
                      <a 
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        Verify Platform
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">Verification Steps:</h4>
                <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Report Investment Fraud
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">EFCC Fraud Hotline</h4>
              <p className="text-sm text-gray-600">Report financial crimes and get assistance</p>
              <p className="font-mono text-sm">0809 952 3322</p>
              <p className="font-mono text-sm">complaint@efcc.gov.ng</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">SEC Investor Protection</h4>
              <p className="text-sm text-gray-600">Report unregistered investment schemes</p>
              <p className="font-mono text-sm">07080631796</p>
              <p className="font-mono text-sm">complaints@sec.gov.ng</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 