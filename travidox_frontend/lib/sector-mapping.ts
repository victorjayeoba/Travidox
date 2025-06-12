// Standard Nigerian Stock Exchange (NGX) sector categories
export type NigerianStockSector = 
  | 'Agriculture'
  | 'Conglomerates'
  | 'Construction/Real Estate'
  | 'Consumer Goods'
  | 'Financial Services'
  | 'Healthcare'
  | 'ICT'
  | 'Industrial Goods'
  | 'Natural Resources'
  | 'Oil & Gas'
  | 'Services'
  | 'Telecommunications'
  | 'Uncategorized';

// Map stock symbols or names to standardized NGX sectors
export const getStandardSector = (
  symbol: string,
  currentSector?: string,
  companyName?: string
): NigerianStockSector => {
  const upperSymbol = symbol.toUpperCase();
  const upperName = companyName?.toUpperCase() || '';
  
  // Financial Services
  if (
    upperSymbol === 'ZENITHB' || 
    upperSymbol === 'GTCO' || 
    upperSymbol === 'UBA' || 
    upperSymbol === 'ACCESSCORP' || 
    upperSymbol === 'FBNH' ||
    upperSymbol === 'FIRSTHOLD' ||
    upperSymbol === 'FCMB' ||
    upperSymbol === 'FIDELITYBK' ||
    upperSymbol === 'FIDELIT' ||
    upperSymbol === 'STERLINGNG' ||
    upperSymbol === 'IBTC' ||
    upperSymbol === 'UCAP' ||
    upperName.includes('BANK') ||
    upperName.includes('HOLDINGS') ||
    upperName.includes('CAPITAL') ||
    upperName.includes('INSURANCE')
  ) {
    return 'Financial Services';
  }
  
  // Consumer Goods
  if (
    upperSymbol === 'NESTLE' || 
    upperSymbol === 'NB' || 
    upperSymbol === 'GUINNES' || 
    upperSymbol === 'INTBREW' ||
    upperSymbol === 'BUAFOODS' ||
    upperSymbol === 'FLOURMILL' ||
    upperSymbol === 'DANGSUGAR' ||
    upperSymbol === 'DANGSUG' ||
    upperSymbol === 'PZ' ||
    upperSymbol === 'CADBURY' ||
    upperName.includes('BREWERY') ||
    upperName.includes('BREWERIES') ||
    upperName.includes('FOODS') ||
    upperName.includes('FLOUR') ||
    upperName.includes('SUGAR')
  ) {
    return 'Consumer Goods';
  }
  
  // Industrial Goods
  if (
    upperSymbol === 'DANGCEM' || 
    upperSymbol === 'BUACEMENT' || 
    upperSymbol === 'WAPCO' ||
    upperName.includes('CEMENT') ||
    upperName.includes('LAFARGE')
  ) {
    return 'Industrial Goods';
  }
  
  // Oil & Gas
  if (
    upperSymbol === 'SEPLAT' || 
    upperSymbol === 'TOTAL' || 
    upperSymbol === 'OANDO' || 
    upperSymbol === 'CONOIL' ||
    upperName.includes('OIL') ||
    upperName.includes('GAS') ||
    upperName.includes('PETROL')
  ) {
    return 'Oil & Gas';
  }
  
  // Telecommunications
  if (
    upperSymbol === 'MTNN' || 
    upperSymbol === 'AIRTELAFRI' ||
    upperName.includes('MTN') ||
    upperName.includes('AIRTEL') ||
    upperName.includes('TELECOM')
  ) {
    return 'Telecommunications';
  }

  // Agriculture
  if (
    upperSymbol === 'OKOMUOI' || 
    upperSymbol === 'PRESCO' ||
    upperName.includes('FARM') ||
    upperName.includes('PLANTATION') ||
    upperName.includes('AGRICULT')
  ) {
    return 'Agriculture';
  }

  // Services
  if (
    upperSymbol === 'TRANSCOHOT' ||
    upperName.includes('HOTEL') ||
    upperName.includes('SERVICE')
  ) {
    return 'Services';
  }

  // Conglomerates
  if (
    upperSymbol === 'TRANSCO' ||
    upperName.includes('TRANSCORP') ||
    upperName.includes('CONGLOMERATE')
  ) {
    return 'Conglomerates';
  }

  // Natural Resources
  if (
    upperName.includes('MINING') ||
    upperName.includes('MINERAL')
  ) {
    return 'Natural Resources';
  }

  // ICT
  if (
    upperName.includes('TECH') ||
    upperName.includes('SOFTWARE') ||
    upperName.includes('COMPUTER')
  ) {
    return 'ICT';
  }

  // Healthcare
  if (
    upperName.includes('PHARM') ||
    upperName.includes('HEALTH') ||
    upperName.includes('DRUG') ||
    upperName.includes('MEDICAL')
  ) {
    return 'Healthcare';
  }

  // Power/Energy
  if (
    upperSymbol === 'GEREGU' ||
    upperName.includes('POWER') ||
    upperName.includes('ENERGY') ||
    upperName.includes('ELECTRIC')
  ) {
    return 'Oil & Gas'; // NGX typically groups these with Oil & Gas
  }

  // Construction/Real Estate
  if (
    upperName.includes('REAL ESTATE') ||
    upperName.includes('PROPERTY') ||
    upperName.includes('CONSTRUCTION')
  ) {
    return 'Construction/Real Estate';
  }

  // If we have a known sector from the API that doesn't fit above but is a valid sector
  if (currentSector) {
    const upperCurrentSector = currentSector.toUpperCase();
    
    if (upperCurrentSector.includes('BANK') || upperCurrentSector.includes('FINANCIAL')) {
      return 'Financial Services';
    } else if (upperCurrentSector.includes('CONSUMER')) {
      return 'Consumer Goods';
    } else if (upperCurrentSector.includes('INDUSTRIAL')) {
      return 'Industrial Goods';
    } else if (upperCurrentSector.includes('OIL') || upperCurrentSector.includes('GAS') || upperCurrentSector.includes('ENERGY')) {
      return 'Oil & Gas';
    } else if (upperCurrentSector.includes('TELECOM')) {
      return 'Telecommunications';
    } else if (upperCurrentSector.includes('AGRIC')) {
      return 'Agriculture';
    } else if (upperCurrentSector.includes('SERVICE')) {
      return 'Services';
    } else if (upperCurrentSector.includes('CONGLOMERATE')) {
      return 'Conglomerates';
    } else if (upperCurrentSector.includes('HEALTHCARE')) {
      return 'Healthcare';
    } else if (upperCurrentSector.includes('ICT') || upperCurrentSector.includes('TECHNOLOGY')) {
      return 'ICT';
    } else if (upperCurrentSector.includes('CONSTRUCTION') || upperCurrentSector.includes('REAL ESTATE')) {
      return 'Construction/Real Estate';
    } else if (upperCurrentSector.includes('NATURAL') || upperCurrentSector.includes('RESOURCE')) {
      return 'Natural Resources';
    }
  }

  // Default for unknown sectors
  return 'Uncategorized';
};

// Get a color scheme for sector badge display
export const getSectorColor = (sector: NigerianStockSector): string => {
  switch (sector) {
    case 'Financial Services':
      return 'bg-blue-50 text-blue-700';
    case 'Consumer Goods':
      return 'bg-orange-50 text-orange-700';
    case 'Industrial Goods':
      return 'bg-gray-50 text-gray-700';
    case 'Oil & Gas':
      return 'bg-purple-50 text-purple-700';
    case 'Telecommunications':
      return 'bg-pink-50 text-pink-700';
    case 'Agriculture':
      return 'bg-green-50 text-green-700';
    case 'Services':
      return 'bg-amber-50 text-amber-700';
    case 'Conglomerates':
      return 'bg-indigo-50 text-indigo-700';
    case 'Healthcare':
      return 'bg-red-50 text-red-700';
    case 'ICT':
      return 'bg-cyan-50 text-cyan-700';
    case 'Construction/Real Estate':
      return 'bg-lime-50 text-lime-700';
    case 'Natural Resources':
      return 'bg-emerald-50 text-emerald-700';
    default:
      return 'bg-gray-50 text-gray-700';
  }
}; 