"use client"

import { useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
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
  Eye, 
  Lock,
  CheckCircle, 
  AlertCircle, 
  Lightbulb,
  TrendingUp,
  RefreshCw,
  DollarSign,
  Trophy,
  Star,
  AlertOctagon,
  Newspaper,
  User,
  Search,
  HelpCircle,
  BookOpen,
  Award,
  ArrowRight,
  ExternalLink,
  FileText,
  ChevronRight,
  ThumbsUp
} from 'lucide-react'

export default function TradingSecurityCenterPage() {
  const { user } = useAuth()
  const [securityProgress, setSecurityProgress] = useState(30)
  const [completedModules, setCompletedModules] = useState<string[]>(['scam_basics'])
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)
  
  const securityGuides = [
    {
      id: 'scam_detection',
      title: 'Scam Detection',
      description: 'Learn to identify and avoid investment scams',
      icon: <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />,
      progress: 20,
      color: 'yellow',
      questions: [
        {
          id: 'scam_basics',
          question: 'What are the common signs of investment scams?',
          answer: 'Investment scams often share key warning signs including: unrealistic returns (promises of high guaranteed returns), high-pressure sales tactics, requests for upfront payments, unregistered investments, lack of documentation, secrecy or complexity, and unsolicited offers. Always research thoroughly before investing.',
          completed: true
        },
        {
          id: 'scam_ponzi',
          question: 'How do Ponzi and pyramid schemes work?',
          answer: 'Ponzi schemes pay existing investors with money from new investors, creating the illusion of returns until the scheme collapses. Pyramid schemes focus on recruiting new members who pay fees that flow upward to earlier participants. Both promise high returns with little risk and eventually collapse when new recruitment slows.',
          completed: false
        },
        {
          id: 'scam_digital',
          question: 'What are the most common crypto and digital asset scams?',
          answer: 'Common crypto scams include fake ICOs/token sales, pump and dump schemes, fake exchanges/wallets, phishing attempts to steal private keys, fake giveaways ("send 1 BTC to get 2 back"), rug pulls on new tokens, and social media impersonation of influencers or companies.',
          completed: false
        },
        {
          id: 'scam_report',
          question: 'How and where should I report investment scams?',
          answer: 'Report investment scams to your country\'s financial regulator (SEC in the US, FCA in the UK, etc.), your local consumer protection agency, law enforcement, and the platform where you encountered the scam. Document all communications and transactions for evidence.',
          completed: false
        }
      ]
    },
    {
      id: 'account_security',
      title: 'Account Protection',
      description: 'Protect your investments and trading accounts',
      icon: <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />,
      progress: 10,
      color: 'green',
      questions: [
        {
          id: 'account_password',
          question: 'What makes a strong password for financial accounts?',
          answer: 'A strong financial account password should be at least 12 characters long, use a mix of uppercase/lowercase letters, numbers, and special characters, avoid personal information, be unique to each account, and changed regularly. Consider using a password manager and always enable two-factor authentication.',
          completed: false
        },
        {
          id: 'account_2fa',
          question: 'Why is two-factor authentication essential?',
          answer: 'Two-factor authentication (2FA) adds a critical second layer of security beyond your password. Even if someone discovers your password, they still can\'t access your account without the second factor (typically a temporary code from an app or text). This significantly reduces the risk of unauthorized access to your financial accounts.',
          completed: false
        },
        {
          id: 'account_phishing',
          question: 'How can I identify phishing attempts targeting investors?',
          answer: 'Watch for unexpected emails about "account issues," suspicious links/attachments, urgent requests for action, poor grammar/spelling, generic greetings, requests for personal information, and mismatched/suspicious URLs. Always verify by contacting the company directly through official channels rather than links in the email.',
          completed: false
        },
        {
          id: 'account_devices',
          question: 'What are best practices for device and network security?',
          answer: 'For trading securely: use dedicated devices when possible, keep software updated, install reputable antivirus/anti-malware, avoid public Wi-Fi for trading (or use a VPN), use secure browsers, clear cache/cookies regularly, be cautious with browser extensions, and enable device encryption and remote wiping capabilities.',
          completed: false
        }
      ]
    },
    {
      id: 'financial_literacy',
      title: 'Financial Literacy',
      description: 'Understand key concepts for informed decisions',
      icon: <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />,
      progress: 0,
      color: 'blue',
      questions: [
        {
          id: 'financial_research',
          question: 'How do I properly research investments?',
          answer: 'Thorough investment research includes examining company financials, understanding the business model, analyzing industry trends, checking management track records, reviewing analyst reports, comparing with competitors, and understanding risk factors. Use multiple reliable sources rather than relying on social media or single recommendations.',
          completed: false
        },
        {
          id: 'financial_risk',
          question: 'What does risk management in investing involve?',
          answer: 'Effective risk management involves diversification across asset classes, industries and geographies; position sizing to limit exposure to any single investment; setting stop-loss orders; understanding your risk tolerance; having an emergency fund; regular portfolio rebalancing; and maintaining a long-term perspective rather than making emotional decisions.',
          completed: false
        },
        {
          id: 'financial_news',
          question: 'How should I interpret financial news and market data?',
          answer: 'When consuming financial news: verify information from multiple credible sources, distinguish between facts and opinions, understand potential biases, be wary of sensationalism, consider market context, focus on relevant information for your investment strategy, and avoid making impulsive decisions based on headlines or short-term market movements.',
          completed: false
        },
        {
          id: 'financial_regulation',
          question: 'What should I know about trading regulations and compliance?',
          answer: 'Investors should understand key regulations like securities laws, KYC/AML requirements, tax reporting obligations, insider trading prohibitions, and market manipulation rules. Ensure platforms you use are properly licensed in your jurisdiction, and maintain records of all transactions for tax and compliance purposes.',
          completed: false
        }
      ]
    }
  ]
  
  // Security alerts to display
  const securityAlerts = [
    {
      id: 'alert1',
      type: 'warning',
      title: 'Phishing Alert',
      description: 'Beware of emails claiming to be from Travidox requesting account verification.',
      date: 'June 15, 2025'
    },
    {
      id: 'alert2',
      type: 'info',
      description: 'We\'ve enhanced our two-factor authentication system for improved security.',
      title: 'Security Update',
      date: 'June 10, 2025'
    },
    {
      id: 'alert3',
      type: 'warning',
      title: 'Fake Mobile Apps',
      description: 'Fraudulent Travidox mobile apps spotted on unofficial app stores. Only download our app from official sources.',
      date: 'June 5, 2025'
    }
  ]

  const completeQuestion = (moduleId: string, questionId: string) => {
    if (!completedModules.includes(questionId)) {
      setCompletedModules([...completedModules, questionId])
      
      // Recalculate progress
      const totalQuestions = securityGuides.reduce((total, guide) => total + guide.questions.length, 0)
      const newProgress = Math.round((completedModules.length + 1) / totalQuestions * 100)
      setSecurityProgress(newProgress)
    }
  }

  const toggleQuestion = (questionId: string) => {
    if (expandedQuestion === questionId) {
      setExpandedQuestion(null)
    } else {
      setExpandedQuestion(questionId)
    }
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Trading Security Center</h1>
      
      {/* Introduction Card */}
      <DashboardCard className="bg-gradient-to-br from-green-50 to-yellow-50 border-0 shadow-md overflow-hidden">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-black" />
            </div>
            <div className="space-y-2 sm:space-y-3 text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Stay Safe in the Financial World</h2>
              <p className="text-sm sm:text-base text-gray-700">
                Learn to identify scams, protect your accounts, and make informed decisions
                based on reliable information. Complete security modules to strengthen your
                trading knowledge.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white bg-opacity-50 px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-xs sm:text-sm font-medium">Your Security Progress</div>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 text-xs">
              {securityProgress}% Complete
            </Badge>
          </div>
          <div className="w-full sm:w-24">
            <Progress value={securityProgress} className="h-2" />
          </div>
        </div>
      </DashboardCard>
      
      <Tabs defaultValue="guides" className="space-y-5 sm:space-y-6">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
          <TabsTrigger value="guides" className="text-xs sm:text-sm">Security Guides</TabsTrigger>
          <TabsTrigger value="alerts" className="text-xs sm:text-sm">Alerts & Updates</TabsTrigger>
          <TabsTrigger value="resources" className="text-xs sm:text-sm">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="guides" className="space-y-5 sm:space-y-6 mt-5 sm:mt-6">
          {/* Security Learning Modules */}
          {securityGuides.map((guide) => (
            <DashboardCard key={guide.id} className="overflow-hidden border border-gray-200">
              <div className={`pb-3 p-4 sm:p-5 border-b border-gray-100 bg-${guide.color}-50`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 sm:p-3 bg-${guide.color}-100 rounded-full`}>
                    {guide.icon}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">{guide.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{guide.description}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Progress value={guide.progress} className="h-1.5 flex-1" />
                  <span className="text-xs text-gray-500">{guide.progress}%</span>
                </div>
              </div>
              
              <div className="p-0">
                {guide.questions.map((q) => (
                  <div key={q.id} className="border-b border-gray-100 last:border-0">
                    <div 
                      className="p-4 sm:p-5 flex justify-between items-start cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleQuestion(q.id)}
                    >
                      <div className="flex gap-3 items-start">
                        <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          q.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {q.completed ? <Check className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-medium text-gray-900 pr-4">{q.question}</h4>
                          
                          {expandedQuestion === q.id && (
                            <div className="mt-2 text-xs sm:text-sm text-gray-600">
                              {q.answer}
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronRight className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform ${
                        expandedQuestion === q.id ? 'rotate-90' : ''
                      }`} />
                    </div>
                    
                    {expandedQuestion === q.id && !q.completed && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 flex justify-end">
                        <Button 
                          size="sm"
                          className="text-xs sm:text-sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            completeQuestion(guide.id, q.id)
                          }}
                        >
                          <ThumbsUp className="mr-1.5 h-3.5 w-3.5" />
                          I Understand This
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </DashboardCard>
          ))}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-5 sm:space-y-6 mt-5 sm:mt-6">
          {/* Security Alerts */}
          <DashboardCard title="Recent Security Alerts" icon={<Bell className="h-5 w-5 text-red-500" />}>
            <div className="space-y-3 sm:space-y-4">
              {securityAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-3 sm:p-4 rounded-lg border ${
                    alert.type === 'warning' 
                      ? 'bg-yellow-50 border-yellow-200' 
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {alert.type === 'warning' ? (
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <Info className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm sm:text-base font-medium">
                        {alert.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {alert.description}
                      </p>
                      <div className="text-xs text-gray-500">{alert.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
          
          <DashboardCard 
            title="Security Settings" 
            icon={<Shield className="h-5 w-5 text-gray-500" />}
            description="Configure additional security for your account"
          >
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm sm:text-base font-medium">Two-Factor Authentication</h4>
                  <p className="text-xs sm:text-sm text-gray-500">Protect your account with an additional verification step</p>
                </div>
                <Button size="sm" className="w-full sm:w-auto text-xs sm:text-sm">Enable 2FA</Button>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm sm:text-base font-medium">Login Notifications</h4>
                  <p className="text-xs sm:text-sm text-gray-500">Receive alerts when your account is accessed</p>
                </div>
                <Button size="sm" variant="outline" className="w-full sm:w-auto text-xs sm:text-sm">Configure</Button>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm sm:text-base font-medium">Device Management</h4>
                  <p className="text-xs sm:text-sm text-gray-500">View and manage devices that have accessed your account</p>
                </div>
                <Button size="sm" variant="outline" className="w-full sm:w-auto text-xs sm:text-sm">View Devices</Button>
              </div>
            </div>
          </DashboardCard>
        </TabsContent>

        <TabsContent value="resources" className="space-y-5 sm:space-y-6 mt-5 sm:mt-6">
          {/* Educational Resources */}
          <DashboardCard 
            title="Educational Resources" 
            icon={<BookOpen className="h-5 w-5 text-indigo-500" />}
            description="Expand your knowledge about trading security"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a 
                href="#" 
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm sm:text-base font-medium">Investor Protection Guide</h4>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Comprehensive guide to protecting yourself as an investor
                    </p>
                  </div>
                </div>
              </a>
              
              <a 
                href="#" 
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <AlertOctagon className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm sm:text-base font-medium">Common Scams Database</h4>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Updated list of known financial scams and how to avoid them
                    </p>
                  </div>
                </div>
              </a>
              
              <a 
                href="#" 
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Newspaper className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm sm:text-base font-medium">Market News Verification</h4>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      How to verify financial news and avoid market manipulation
                    </p>
                  </div>
                </div>
              </a>
              
              <a 
                href="#" 
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm sm:text-base font-medium">Security Certification</h4>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Complete our security course and earn a certificate
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </DashboardCard>
          
          <DashboardCard 
            title="Need Help?" 
            icon={<HelpCircle className="h-5 w-5 text-blue-500" />}
            description="Get assistance with security concerns"
          >
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm sm:text-base font-medium">Report a Security Concern</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      If you've noticed suspicious activity or believe your account security
                      might be compromised, please report it immediately.
                    </p>
                    <Button size="sm" className="mt-3 text-xs sm:text-sm">Report Issue</Button>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  <User className="mr-1.5 h-4 w-4" />
                  Contact Support
                </Button>
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  <Search className="mr-1.5 h-4 w-4" />
                  Search Help Center
                </Button>
              </div>
            </div>
          </DashboardCard>
        </TabsContent>
      </Tabs>
    </div>
  )
} 