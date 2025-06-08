import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Unlink } from 'lucide-react'

interface AccountInfo {
  login: string;
  name: string;
  server: string;
  currency: string;
  leverage: string;
  balance: number;
  equity: number;
  margin: number;
  free_margin: number;
  margin_level: number;
}

interface MTAccountInfoProps {
  accountInfo: AccountInfo;
  onDisconnect: () => void;
}

export function MTAccountInfo({ accountInfo, onDisconnect }: MTAccountInfoProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Connected Account</CardTitle>
            <CardDescription>
              Your MetaTrader account is connected
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
            <CheckCircle className="h-3.5 w-3.5" />
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Account Number</p>
            <p className="font-medium">{accountInfo.login}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Server</p>
            <p className="font-medium">{accountInfo.server}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{accountInfo.name || 'N/A'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Currency</p>
            <p className="font-medium">{accountInfo.currency}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Balance</p>
            <p className="font-medium text-lg">${accountInfo.balance.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Equity</p>
            <p className="font-medium text-lg">${accountInfo.equity.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Free Margin</p>
            <p className="font-medium">${accountInfo.free_margin.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Leverage</p>
            <p className="font-medium">{accountInfo.leverage}</p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
          onClick={onDisconnect}
        >
          <Unlink className="h-4 w-4" />
          Disconnect Account
        </Button>
      </CardContent>
    </Card>
  )
} 