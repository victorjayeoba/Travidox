"use client"

import React from "react"
import { Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TooltipInfoProps {
  term: string
  description: string
  side?: "top" | "right" | "bottom" | "left"
}

const financialTerms: Record<string, string> = {
  "Balance": "The total amount of money in your account without considering open positions.",
  "Equity": "Your account balance plus or minus any profit/loss from open positions.",
  "Margin Used": "The amount of money set aside as collateral for your open positions.",
  "Margin Level": "The ratio of equity to margin used, expressed as a percentage. Higher values indicate lower risk.",
  "Free Margin": "The amount of money available to open new positions or absorb losses.",
  "Open P/L": "The unrealized profit or loss from all currently open positions.",
  "Leverage": "The ratio of the position size to the required margin. Higher leverage increases both potential profits and risks.",
  "Bid": "The price at which the market is willing to buy. Used when you sell (close a buy position or open a sell position).",
  "Ask": "The price at which the market is willing to sell. Used when you buy (open a buy position or close a sell position).",
  "Spread": "The difference between the bid and ask price. This is essentially the cost of trading.",
  "Lot": "A standardized unit of measurement for transaction quantity in forex trading. Standard lot = 100,000 units.",
  "Pip": "The smallest price movement in a trading pair. For most pairs, 1 pip = 0.0001.",
  "Stop Loss": "An order to close a position at a specified price to limit potential losses.",
  "Take Profit": "An order to close a position at a specified price to secure profits.",
}

export function TooltipInfo({ term, description, side = "top" }: TooltipInfoProps) {
  // Use predefined description if available, otherwise use the provided one
  const finalDescription = financialTerms[term] || description
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <button className="inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus-visible:ring-ring">
            <Info className="h-3 w-3" />
            <span className="sr-only">Info about {term}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs text-sm">
          <p>{finalDescription}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 