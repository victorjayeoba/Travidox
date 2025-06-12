"use client"

import React, { useState } from 'react'
import { 
  Activity, CheckCircle, AlertCircle, Clock, 
  Calendar, RefreshCw, ChevronDown, Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

type SystemStatus = 'operational' | 'degraded' | 'partial_outage' | 'major_outage' | 'maintenance';

interface SystemComponent {
  name: string;
  status: SystemStatus;
  description: string;
}

interface IncidentUpdate {
  timestamp: string;
  message: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
}

interface Incident {
  id: string;
  title: string;
  date: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  affected: string[];
  updates: IncidentUpdate[];
}

interface MaintenanceEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  affected: string[];
  description: string;
}

const systemComponents: SystemComponent[] = [
  {
    name: "Website",
    status: "operational",
    description: "Main website and user interface"
  },
  {
    name: "Trading Platform",
    status: "operational",
    description: "Core trading functionality"
  },
  {
    name: "Market Data",
    status: "operational",
    description: "Real-time and historical market data"
  },
  {
    name: "Account Management",
    status: "operational",
    description: "User accounts, profiles, and settings"
  },
  {
    name: "Payment Processing",
    status: "operational",
    description: "Deposits and withdrawals"
  },
  {
    name: "AI Trading Bot",
    status: "degraded",
    description: "Automated trading algorithms"
  },
  {
    name: "Mobile App",
    status: "operational",
    description: "iOS and Android applications"
  },
  {
    name: "API",
    status: "operational",
    description: "Developer API endpoints"
  },
  {
    name: "Notifications",
    status: "operational",
    description: "Email, SMS, and push notifications"
  }
];

const recentIncidents: Incident[] = [
  {
    id: "inc-001",
    title: "AI Trading Bot Performance Degradation",
    date: "June 9, 2025",
    status: "investigating",
    affected: ["AI Trading Bot"],
    updates: [
      {
        timestamp: "June 9, 2025 - 10:15 WAT",
        message: "We are investigating reports of delayed execution and performance issues with the AI Trading Bot.",
        status: "investigating"
      },
      {
        timestamp: "June 9, 2025 - 10:45 WAT",
        message: "We have identified an issue with our machine learning pipeline that is causing increased latency in trading decisions.",
        status: "identified"
      }
    ]
  },
  {
    id: "inc-002",
    title: "Market Data Delays",
    date: "June 2, 2025",
    status: "resolved",
    affected: ["Market Data"],
    updates: [
      {
        timestamp: "June 2, 2025 - 14:30 WAT",
        message: "We are investigating delays in market data updates across all markets.",
        status: "investigating"
      },
      {
        timestamp: "June 2, 2025 - 15:15 WAT",
        message: "We have identified an issue with our data provider's feed. Working with them to resolve the issue.",
        status: "identified"
      },
      {
        timestamp: "June 2, 2025 - 16:45 WAT",
        message: "The data provider has resolved the issue on their end. We are monitoring the system to ensure stability.",
        status: "monitoring"
      },
      {
        timestamp: "June 2, 2025 - 17:30 WAT",
        message: "All market data is now updating correctly and historical data has been backfilled. This incident is now resolved.",
        status: "resolved"
      }
    ]
  }
];

const upcomingMaintenance: MaintenanceEvent[] = [
  {
    id: "maint-001",
    title: "Database Optimization",
    date: "June 15, 2025",
    startTime: "02:00 WAT",
    endTime: "04:00 WAT",
    status: "scheduled",
    affected: ["Account Management", "Payment Processing"],
    description: "Scheduled database maintenance to improve performance. During this time, account management and payment processing will be temporarily unavailable."
  },
  {
    id: "maint-002",
    title: "Mobile App Update Deployment",
    date: "June 20, 2025",
    startTime: "23:00 WAT",
    endTime: "23:30 WAT",
    status: "scheduled",
    affected: ["Mobile App"],
    description: "Deploying version 2.5.0 of our mobile applications with new features and performance improvements. The app may be temporarily unavailable during this time."
  }
];

const getStatusColor = (status: SystemStatus) => {
  switch (status) {
    case 'operational':
      return 'bg-green-100 text-green-800';
    case 'degraded':
      return 'bg-yellow-100 text-yellow-800';
    case 'partial_outage':
      return 'bg-orange-100 text-orange-800';
    case 'major_outage':
      return 'bg-red-100 text-red-800';
    case 'maintenance':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: SystemStatus) => {
  switch (status) {
    case 'operational':
      return 'Operational';
    case 'degraded':
      return 'Degraded Performance';
    case 'partial_outage':
      return 'Partial Outage';
    case 'major_outage':
      return 'Major Outage';
    case 'maintenance':
      return 'Maintenance';
    default:
      return 'Unknown';
  }
};

const getIncidentStatusColor = (status: string) => {
  switch (status) {
    case 'investigating':
      return 'bg-yellow-100 text-yellow-800';
    case 'identified':
      return 'bg-blue-100 text-blue-800';
    case 'monitoring':
      return 'bg-purple-100 text-purple-800';
    case 'resolved':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getMaintenanceStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled':
      return 'bg-blue-100 text-blue-800';
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getMaintenanceStatusText = (status: string) => {
  switch (status) {
    case 'scheduled':
      return 'Scheduled';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    default:
      return 'Unknown';
  }
};

const IncidentDetails = ({ incident }: { incident: Incident }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getIncidentStatusColor(incident.status)}>
                {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
              </Badge>
              <span className="text-sm text-gray-500">{incident.date}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{incident.title}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {incident.affected.map((component, index) => (
                <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {component}
                </span>
              ))}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} />
          </Button>
        </div>
        
        {isExpanded && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Updates</h4>
            <div className="space-y-4">
              {incident.updates.map((update, index) => (
                <div key={index} className="relative pl-6 pb-4">
                  {index !== incident.updates.length - 1 && (
                    <div className="absolute left-[9px] top-6 bottom-0 w-[2px] bg-gray-200"></div>
                  )}
                  <div className="flex items-start">
                    <div className={`absolute left-0 top-1.5 w-[18px] h-[18px] rounded-full flex items-center justify-center ${
                      update.status === 'resolved' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        update.status === 'resolved' ? 'bg-green-600' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{update.timestamp}</p>
                      <p className="text-sm text-gray-700">{update.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function StatusPage() {
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  
  // Calculate system status
  const operationalCount = systemComponents.filter(c => c.status === 'operational').length;
  const totalComponents = systemComponents.length;
  const allOperational = operationalCount === totalComponents;
  
  let overallStatus: SystemStatus = 'operational';
  if (!allOperational) {
    if (systemComponents.some(c => c.status === 'major_outage')) {
      overallStatus = 'major_outage';
    } else if (systemComponents.some(c => c.status === 'partial_outage')) {
      overallStatus = 'partial_outage';
    } else if (systemComponents.some(c => c.status === 'degraded')) {
      overallStatus = 'degraded';
    } else if (systemComponents.some(c => c.status === 'maintenance')) {
      overallStatus = 'maintenance';
    }
  }
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription logic here
    setEmail('');
    setIsSubscribeModalOpen(false);
  };
  
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-16 pb-20 md:pt-20 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-5"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-amber-400" />
              <p className="text-amber-400 font-medium">Support</p>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              System Status
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Check the current status of Travidox services and view recent incidents and maintenance events.
            </p>
          </div>
        </div>
      </section>
      
      {/* Overall Status Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white border border-gray-100 rounded-xl p-6 md:p-8 shadow-sm text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
                allOperational ? 'bg-green-100' : 'bg-yellow-100'
              } mb-4`}>
                {allOperational ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-yellow-600" />
                )}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {allOperational ? 'All Systems Operational' : 'Some Systems Experiencing Issues'}
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                Last updated: {new Date().toLocaleString('en-NG', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                  timeZoneName: 'short'
                })}
              </p>
              <div className="flex items-center justify-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
                <Button 
                  size="sm"
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                  onClick={() => setIsSubscribeModalOpen(true)}
                >
                  <Bell className="w-4 h-4" />
                  Subscribe to Updates
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Components Status Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Components Status</h2>
            
            <div className="space-y-4">
              {systemComponents.map((component, index) => (
                <div key={index} className="bg-white border border-gray-100 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{component.name}</h3>
                    <p className="text-sm text-gray-500">{component.description}</p>
                  </div>
                  <Badge className={getStatusColor(component.status)}>
                    {getStatusText(component.status)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Active Incidents Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Active Incidents</h2>
            
            <div className="space-y-6">
              {recentIncidents.filter(inc => inc.status !== 'resolved').length > 0 ? (
                recentIncidents
                  .filter(inc => inc.status !== 'resolved')
                  .map(incident => (
                    <IncidentDetails key={incident.id} incident={incident} />
                  ))
              ) : (
                <div className="bg-white border border-gray-100 rounded-xl p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Incidents</h3>
                  <p className="text-gray-600">
                    There are currently no active incidents. All systems are operating normally.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Upcoming Maintenance Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Upcoming Maintenance</h2>
            
            <div className="space-y-6">
              {upcomingMaintenance.length > 0 ? (
                upcomingMaintenance.map(maintenance => (
                  <div key={maintenance.id} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getMaintenanceStatusColor(maintenance.status)}>
                        {getMaintenanceStatusText(maintenance.status)}
                      </Badge>
                      <span className="text-sm text-gray-500">{maintenance.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{maintenance.title}</h3>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {maintenance.startTime} - {maintenance.endTime}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {maintenance.date}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{maintenance.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {maintenance.affected.map((component, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {component}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white border border-gray-100 rounded-xl p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Scheduled Maintenance</h3>
                  <p className="text-gray-600">
                    There is no scheduled maintenance at this time.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Recent Incidents Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Recent Incidents</h2>
            
            <div className="space-y-6">
              {recentIncidents.filter(inc => inc.status === 'resolved').length > 0 ? (
                recentIncidents
                  .filter(inc => inc.status === 'resolved')
                  .map(incident => (
                    <IncidentDetails key={incident.id} incident={incident} />
                  ))
              ) : (
                <div className="bg-white border border-gray-100 rounded-xl p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Recent Incidents</h3>
                  <p className="text-gray-600">
                    There have been no incidents in the past 30 days.
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-8 text-center">
              <Button variant="outline">
                View Incident History
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Subscribe Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Stay Informed
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Subscribe to receive notifications about system status changes, incidents, and maintenance events.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="max-w-xs"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleSubscribe}>
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 