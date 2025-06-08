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
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Settings, 
  Bell, 
  Globe, 
  Moon, 
  Sun, 
  UserCog,
  Mail,
  Smartphone,
  CreditCard,
  LogOut,
  Save,
  Trash2,
  HelpCircle,
  ExternalLink,
  Check
} from 'lucide-react'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [priceAlerts, setPriceAlerts] = useState(true)
  const [newsAlerts, setNewsAlerts] = useState(false)
  const [tradingAlerts, setTradingAlerts] = useState(true)
  
  // Appearance settings
  const [theme, setTheme] = useState('system')
  const [compactMode, setCompactMode] = useState(false)
  const [highContrastMode, setHighContrastMode] = useState(false)
  
  // Language and region
  const [language, setLanguage] = useState('english')
  const [currency, setCurrency] = useState('usd')
  const [timezone, setTimezone] = useState('Africa/Lagos')
  
  // Privacy settings
  const [showProfile, setShowProfile] = useState(true)
  const [shareTrades, setShareTrades] = useState(false)
  const [allowAnalytics, setAllowAnalytics] = useState(true)
  
  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      
      <Tabs defaultValue="account" className="space-y-6">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5 text-green-600" />
                Account Settings
              </CardTitle>
              <CardDescription>
                Manage your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Personal Information</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Full Name
                    </label>
                    <Input 
                      defaultValue={user?.displayName || ''} 
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Email Address
                    </label>
                    <Input 
                      defaultValue={user?.email || ''} 
                      placeholder="Enter your email"
                      disabled
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Phone Number
                    </label>
                    <Input 
                      defaultValue="" 
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Date of Birth
                    </label>
                    <Input 
                      type="date"
                      defaultValue="" 
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Communication Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Communications</h4>
                      <p className="text-sm text-gray-500">
                        Receive updates, newsletters, and promotional emails
                      </p>
                    </div>
                    <Switch 
                      checked={emailNotifications} 
                      onCheckedChange={setEmailNotifications} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">SMS Notifications</h4>
                      <p className="text-sm text-gray-500">
                        Get text messages for important account updates
                      </p>
                    </div>
                    <Switch 
                      checked={pushNotifications} 
                      onCheckedChange={setPushNotifications} 
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Danger Zone</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-red-600">Delete Account</h4>
                      <p className="text-sm text-gray-500">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Sign Out</h4>
                      <p className="text-sm text-gray-500">
                        Log out of your account on this device
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                Payment Methods
              </CardTitle>
              <CardDescription>
                Manage your payment and billing information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Payment Methods Added</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-4">
                  Add a payment method to fund your account or make trades quickly.
                </p>
                <Button>Add Payment Method</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-green-600" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Control how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Delivery Channels</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-blue-600" />
                          <div>
                            <h4 className="font-medium">Email Notifications</h4>
                            <p className="text-xs text-gray-500">Receive notifications via email</p>
                          </div>
                        </div>
                        <Switch 
                          checked={emailNotifications} 
                          onCheckedChange={setEmailNotifications} 
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Smartphone className="h-5 w-5 text-purple-600" />
                          <div>
                            <h4 className="font-medium">Push Notifications</h4>
                            <p className="text-xs text-gray-500">Receive notifications on your device</p>
                          </div>
                        </div>
                        <Switch 
                          checked={pushNotifications} 
                          onCheckedChange={setPushNotifications} 
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Notification Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Price Alerts</h4>
                      <p className="text-sm text-gray-500">Notifications about significant price changes</p>
                    </div>
                    <Switch 
                      checked={priceAlerts} 
                      onCheckedChange={setPriceAlerts} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">News Alerts</h4>
                      <p className="text-sm text-gray-500">Latest news about your watchlist stocks</p>
                    </div>
                    <Switch 
                      checked={newsAlerts} 
                      onCheckedChange={setNewsAlerts} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Trading Notifications</h4>
                      <p className="text-sm text-gray-500">Alerts about your trades and orders</p>
                    </div>
                    <Switch 
                      checked={tradingAlerts} 
                      onCheckedChange={setTradingAlerts} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-2 flex justify-end">
                <Button className="bg-green-600 hover:bg-green-700">
                  Save Notification Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-green-600" />
                Appearance Settings
              </CardTitle>
              <CardDescription>
                Customize how Travidox looks for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Theme</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card 
                    className={`cursor-pointer hover:border-green-400 ${theme === 'light' ? 'border-2 border-green-500' : ''}`}
                    onClick={() => setTheme('light')}
                  >
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center mb-3">
                        <Sun className="h-6 w-6 text-orange-400" />
                      </div>
                      <h4 className="font-medium">Light</h4>
                      <p className="text-xs text-gray-500">Bright theme for daytime</p>
                      {theme === 'light' && (
                        <div className="absolute top-2 right-2">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={`cursor-pointer hover:border-green-400 ${theme === 'dark' ? 'border-2 border-green-500' : ''}`}
                    onClick={() => setTheme('dark')}
                  >
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mb-3">
                        <Moon className="h-6 w-6 text-gray-100" />
                      </div>
                      <h4 className="font-medium">Dark</h4>
                      <p className="text-xs text-gray-500">Dark theme for low-light</p>
                      {theme === 'dark' && (
                        <div className="absolute top-2 right-2">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={`cursor-pointer hover:border-green-400 ${theme === 'system' ? 'border-2 border-green-500' : ''}`}
                    onClick={() => setTheme('system')}
                  >
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-white to-gray-800 flex items-center justify-center mb-3">
                        <Settings className="h-6 w-6 text-blue-500" />
                      </div>
                      <h4 className="font-medium">System</h4>
                      <p className="text-xs text-gray-500">Follow system preferences</p>
                      {theme === 'system' && (
                        <div className="absolute top-2 right-2">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Display Options</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Compact Mode</h4>
                      <p className="text-sm text-gray-500">Use less space between elements</p>
                    </div>
                    <Switch 
                      checked={compactMode} 
                      onCheckedChange={setCompactMode} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">High Contrast</h4>
                      <p className="text-sm text-gray-500">Increase contrast for better readability</p>
                    </div>
                    <Switch 
                      checked={highContrastMode} 
                      onCheckedChange={setHighContrastMode} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-2 flex justify-end">
                <Button className="bg-green-600 hover:bg-green-700">
                  Save Appearance Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-green-600" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control your data and visibility preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Public Profile</h4>
                    <p className="text-sm text-gray-500">Allow other users to see your profile</p>
                  </div>
                  <Switch 
                    checked={showProfile} 
                    onCheckedChange={setShowProfile} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Trading Activity</h4>
                    <p className="text-sm text-gray-500">Share your trading activity with the community</p>
                  </div>
                  <Switch 
                    checked={shareTrades} 
                    onCheckedChange={setShareTrades} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Usage Analytics</h4>
                    <p className="text-sm text-gray-500">Allow us to collect anonymous usage data to improve services</p>
                  </div>
                  <Switch 
                    checked={allowAnalytics} 
                    onCheckedChange={setAllowAnalytics} 
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Data Management</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-between">
                    Download My Data
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-between">
                    Privacy Policy
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="pt-2 flex justify-end">
                <Button className="bg-green-600 hover:bg-green-700">
                  Save Privacy Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-600" />
                Regional Preferences
              </CardTitle>
              <CardDescription>
                Customize regional settings like language and currency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Language</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English (US)</SelectItem>
                      <SelectItem value="english_uk">English (UK)</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="portuguese">Portuguese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Currency</label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="ngn">NGN (₦)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Zone</label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Lagos">Lagos (UTC+1)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">New York (UTC-5/4)</SelectItem>
                      <SelectItem value="Europe/London">London (UTC+0/1)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (UTC+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="pt-2 flex justify-end">
                <Button className="bg-green-600 hover:bg-green-700">
                  Save Regional Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-green-600" />
                Help & Support
              </CardTitle>
              <CardDescription>
                Get help with your account and platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-between">
                Contact Support
                <ExternalLink className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" className="w-full justify-between">
                View Documentation
                <ExternalLink className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" className="w-full justify-between">
                FAQs
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 