// Stock symbol to ID mapping for chart data API
interface StockMapping {
  id: string;
  symbol: string;
  name: string;
}

export const STOCK_MAPPINGS: Record<string, StockMapping> = {
  'DANGCEM': {
    id: '101672',
    symbol: 'DANGCEM',
    name: 'Dangote Cement'
  },
  'DANGSUG': {
    id: '101674',
    symbol: 'DANGSUG',
    name: 'Dangote Sugar'
  },
  'ETI': {
    id: '101679',
    symbol: 'ETI',
    name: 'ETI'
  },
  'FIRSTHOLD': {
    id: '101682',
    symbol: 'FIRSTHOLD',
    name: 'First HoldCo'
  },
  'FCMB': {
    id: '101683',
    symbol: 'FCMB',
    name: 'Fcmb'
  },
  'FIDELIT': {
    id: '101684',
    symbol: 'FIDELIT',
    name: 'Fidelitybk'
  },
  'GTCO': {
    id: '101690',
    symbol: 'GTCO',
    name: 'Guaranty Trust Holding'
  },
  'GUINNES': {
    id: '101691',
    symbol: 'GUINNES',
    name: 'Guinness Nigeria'
  },
  'IBTC': {
    id: '101693',
    symbol: 'IBTC',
    name: 'STANBIC IBTC Bank'
  },
  'INTBREW': {
    id: '101695',
    symbol: 'INTBREW',
    name: 'International Breweries'
  },
  'NESTLE': {
    id: '101707',
    symbol: 'NESTLE',
    name: 'Nestle Nigeria'
  },
  'NB': {
    id: '101712',
    symbol: 'NB',
    name: 'Nigerian Breweries'
  },
  'OKOMUOI': {
    id: '101720',
    symbol: 'OKOMUOI',
    name: 'Okomu Oil Palm'
  },
  'PRESCO': {
    id: '101723',
    symbol: 'PRESCO',
    name: 'Presco'
  },
  'SEPLAT': {
    id: '101729',
    symbol: 'SEPLAT',
    name: 'Seplat Petroleum'
  },
  'STERLINGNG': {
    id: '101731',
    symbol: 'STERLINGNG',
    name: 'Sterling Bank'
  },
  'TOTAL': {
    id: '101733',
    symbol: 'TOTAL',
    name: 'Total Nig'
  },
  'TRANSCO': {
    id: '101734',
    symbol: 'TRANSCO',
    name: 'Transcorp'
  },
  'UBA': {
    id: '101738',
    symbol: 'UBA',
    name: 'UBA'
  },
  'UCAP': {
    id: '101739',
    symbol: 'UCAP',
    name: 'United Capital'
  },
  'WAPCO': {
    id: '101750',
    symbol: 'WAPCO',
    name: 'Lafarge Africa'
  },
  'ZENITHB': {
    id: '101753',
    symbol: 'ZENITHB',
    name: 'Zenith Bank'
  },
  'TRANSCOHOT': {
    id: '992699',
    symbol: 'TRANSCOHOT',
    name: 'Transcorp Hotels'
  },
  'MTNN': {
    id: '1131263',
    symbol: 'MTNN',
    name: 'MTN Nigeria'
  },
  'AIRTELAFRI': {
    id: '1153176',
    symbol: 'AIRTELAFRI',
    name: 'Airtel Africa'
  },
  'BUACEMENT': {
    id: '1162446',
    symbol: 'BUACEMENT',
    name: 'BUA Cement'
  },
  'BUAFOODS': {
    id: '1184437',
    symbol: 'BUAFOODS',
    name: 'BUA Foods'
  },
  'ACCESSCORP': {
    id: '1188039',
    symbol: 'ACCESSCORP',
    name: 'Access Holdings'
  },
  'GEREGU': {
    id: '1199633',
    symbol: 'GEREGU',
    name: 'Geregu Power'
  }
};

export function getStockById(symbol: string): StockMapping | null {
  return STOCK_MAPPINGS[symbol.toUpperCase()] || null;
}

export function getChartDataId(symbol: string): string | null {
  const stock = getStockById(symbol);
  return stock ? stock.id : null;
}

export function getAllStockSymbols(): string[] {
  return Object.keys(STOCK_MAPPINGS);
}

export function isValidStockSymbol(symbol: string): boolean {
  return symbol.toUpperCase() in STOCK_MAPPINGS;
} 