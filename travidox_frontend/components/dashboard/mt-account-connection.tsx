import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, ExternalLink, CheckCircle2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { tradingApi } from '@/lib/api'

interface MTAccountConnectionProps {
  onAccountConnected: () => void;
  error?: string | null;
}

export function MTAccountConnection({ onAccountConnected, error }: MTAccountConnectionProps) {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [server, setServer] = useState('Exness-MT5Trial10')
  const [loading, setLoading] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(error || null)

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!login || !password) {
      setConnectionError('Please fill in all required fields')
      return
    }
    
    setLoading(true)
    setConnectionError(null)
    
    try {
      await tradingApi.connectAccount({
        login,
        password,
        server_name: server,
        platform: 'mt5'
      })
      
      // If successful, call the callback
      onAccountConnected()
    } catch (err: any) {
      setConnectionError(err.message || 'Failed to connect account. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Connect MetaTrader Account</CardTitle>
        <CardDescription>
          Connect your MetaTrader 5 account to enable trading
        </CardDescription>
      </CardHeader>
      <CardContent>
        {connectionError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{connectionError}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleConnect} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login">Account Number</Label>
            <Input 
              id="login" 
              value={login} 
              onChange={(e) => setLogin(e.target.value)} 
              placeholder="Enter your MT5 account number"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter your MT5 password"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="server">Server</Label>
            <Input 
              id="server" 
              value={server} 
              onChange={(e) => setServer(e.target.value)} 
              placeholder="MT5 server (e.g., Exness-MT5Trial10)"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Connecting...
              </>
            ) : 'Connect Account'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-start border-t p-4">
        <h4 className="text-sm font-medium mb-2">How to get your Exness MetaTrader credentials:</h4>
        <ol className="text-sm text-muted-foreground list-decimal pl-4 space-y-1">
          <li>Go to <a href="https://exness.com/login" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">Exness.com <ExternalLink className="h-3 w-3 ml-1" /></a> and log in to your account</li>
          <li>Navigate to <strong>My Accounts</strong> and select your trading account</li>
          <li>Click on <strong>View Details</strong> to see your account credentials</li>
          <li>Your <strong>Account Number</strong> is your MT5 login</li>
          <li>Use your <strong>Investor Password</strong> or <strong>Master Password</strong> as the password</li>
          <li>The server name is typically <strong>Exness-MT5Trial10</strong> or similar (check your account details)</li>
        </ol>
        <div className="mt-4 text-sm text-muted-foreground">
          <p className="flex items-center text-amber-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            Your credentials are only used to connect to MetaTrader and are not stored permanently.
          </p>
        </div>
      </CardFooter>
    </Card>
  )
} 