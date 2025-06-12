import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy,
  limit,
  getDocs,
  Timestamp,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import app from './firebase';

// Initialize Firestore
const db = getFirestore(app);

// Portfolio asset interface
export interface PortfolioAsset {
  symbol: string;
  name: string;
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
  totalInvested: number;
  currentValue: number;
  profit: number;
  profitPercent: number;
  lastUpdated: Timestamp;
}

// Portfolio transaction interface
export interface PortfolioTransaction {
  id: string;
  type: 'buy' | 'sell';
  symbol: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  fees?: number;
  date: Timestamp;
  userId: string;
}

// Portfolio summary interface
export interface Portfolio {
  userId: string;
  assets: PortfolioAsset[];
  totalValue: number;
  totalInvested: number;
  totalProfit: number;
  totalProfitPercent: number;
  lastUpdated: Timestamp;
  created: Timestamp;
}

/**
 * Get user's portfolio from Firestore
 */
export async function getUserPortfolio(userId: string): Promise<Portfolio | null> {
  try {
    const portfolioRef = doc(db, 'portfolios', userId);
    const portfolioSnap = await getDoc(portfolioRef);
    
    if (portfolioSnap.exists()) {
      return portfolioSnap.data() as Portfolio;
    }
    
    // Create empty portfolio if it doesn't exist
    const emptyPortfolio: Portfolio = {
      userId,
      assets: [],
      totalValue: 0,
      totalInvested: 0,
      totalProfit: 0,
      totalProfitPercent: 0,
      lastUpdated: Timestamp.now(),
      created: Timestamp.now()
    };
    
    await setDoc(portfolioRef, emptyPortfolio);
    return emptyPortfolio;
  } catch (error) {
    console.error('Error fetching user portfolio:', error);
    return null;
  }
}

/**
 * Get user's transaction history from Firestore
 */
export async function getUserTransactions(userId: string, limitCount: number = 50): Promise<PortfolioTransaction[]> {
  try {
    const transactionsRef = collection(db, 'transactions');
    const q = query(
      transactionsRef,
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as PortfolioTransaction);
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    return [];
  }
}

/**
 * Buy a stock and update portfolio in Firestore
 */
export async function buyStock(
  userId: string,
  stock: { symbol: string; name: string; price: number },
  quantity: number
): Promise<boolean> {
  try {
    // Get current portfolio
    const portfolio = await getUserPortfolio(userId);
    if (!portfolio) return false;
    
    const totalCost = stock.price * quantity;
    
    // Find if the asset is already in portfolio
    const existingAssetIndex = portfolio.assets.findIndex(
      asset => asset.symbol === stock.symbol
    );
    
    let updatedAssets = [...portfolio.assets];
    
    if (existingAssetIndex >= 0) {
      // Update existing asset
      const existingAsset = updatedAssets[existingAssetIndex];
      const newTotalQuantity = existingAsset.quantity + quantity;
      const newTotalInvested = existingAsset.totalInvested + totalCost;
      const newAveragePrice = newTotalInvested / newTotalQuantity;
      const currentValue = newTotalQuantity * stock.price;
      const profit = currentValue - newTotalInvested;
      const profitPercent = newTotalInvested > 0 ? (profit / newTotalInvested) * 100 : 0;
      
      updatedAssets[existingAssetIndex] = {
        ...existingAsset,
        quantity: newTotalQuantity,
        averageBuyPrice: newAveragePrice,
        currentPrice: stock.price,
        totalInvested: newTotalInvested,
        currentValue: currentValue,
        profit: profit,
        profitPercent: profitPercent,
        lastUpdated: Timestamp.now()
      };
    } else {
      // Add new asset
      const currentValue = quantity * stock.price;
      updatedAssets.push({
        symbol: stock.symbol,
        name: stock.name,
        quantity: quantity,
        averageBuyPrice: stock.price,
        currentPrice: stock.price,
        totalInvested: totalCost,
        currentValue: currentValue,
        profit: 0, // No profit on first buy
        profitPercent: 0,
        lastUpdated: Timestamp.now()
      });
    }
    
    // Calculate new portfolio totals
    const newTotalInvested = portfolio.totalInvested + totalCost;
    const newTotalValue = updatedAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
    const newTotalProfit = newTotalValue - newTotalInvested;
    const newTotalProfitPercent = newTotalInvested > 0 ? (newTotalProfit / newTotalInvested) * 100 : 0;
    
    // Update portfolio in Firestore
    const portfolioRef = doc(db, 'portfolios', userId);
    await updateDoc(portfolioRef, {
      assets: updatedAssets,
      totalValue: newTotalValue,
      totalInvested: newTotalInvested,
      totalProfit: newTotalProfit,
      totalProfitPercent: newTotalProfitPercent,
      lastUpdated: Timestamp.now()
    });
    
    // Create transaction record
    const transaction: PortfolioTransaction = {
      id: `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'buy',
      symbol: stock.symbol,
      name: stock.name,
      quantity: quantity,
      price: stock.price,
      total: totalCost,
      date: Timestamp.now(),
      userId: userId
    };
    
    // Save transaction
    const transactionRef = doc(db, 'transactions', transaction.id);
    await setDoc(transactionRef, transaction);
    
    return true;
  } catch (error) {
    console.error('Error buying stock:', error);
    return false;
  }
}

/**
 * Sell a stock and update portfolio in Firestore
 */
export async function sellStock(
  userId: string,
  symbol: string,
  quantity: number,
  currentPrice: number
): Promise<boolean> {
  try {
    // Get current portfolio
    const portfolio = await getUserPortfolio(userId);
    if (!portfolio) return false;
    
    // Find the asset in portfolio
    const assetIndex = portfolio.assets.findIndex(
      asset => asset.symbol === symbol
    );
    
    if (assetIndex === -1) {
      throw new Error('Asset not found in portfolio');
    }
    
    const asset = portfolio.assets[assetIndex];
    
    // Check if user has enough quantity
    if (asset.quantity < quantity) {
      throw new Error('Insufficient shares to complete this sale');
    }
    
    const totalSaleValue = currentPrice * quantity;
    const soldAssetCost = (asset.totalInvested / asset.quantity) * quantity;
    
    let updatedAssets = [...portfolio.assets];
    
    if (asset.quantity === quantity) {
      // Remove asset completely if selling all shares
      updatedAssets.splice(assetIndex, 1);
    } else {
      // Update asset with remaining quantity
      const remainingQuantity = asset.quantity - quantity;
      const remainingInvested = asset.totalInvested - soldAssetCost;
      const currentValue = remainingQuantity * currentPrice;
      const profit = currentValue - remainingInvested;
      const profitPercent = remainingInvested > 0 ? (profit / remainingInvested) * 100 : 0;
      
      updatedAssets[assetIndex] = {
        ...asset,
        quantity: remainingQuantity,
        currentPrice: currentPrice,
        totalInvested: remainingInvested,
        currentValue: currentValue,
        profit: profit,
        profitPercent: profitPercent,
        lastUpdated: Timestamp.now()
      };
    }
    
    // Calculate new portfolio totals
    const newTotalInvested = portfolio.totalInvested - soldAssetCost;
    const newTotalValue = updatedAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
    const newTotalProfit = newTotalValue - newTotalInvested;
    const newTotalProfitPercent = newTotalInvested > 0 ? (newTotalProfit / newTotalInvested) * 100 : 0;
    
    // Update portfolio in Firestore
    const portfolioRef = doc(db, 'portfolios', userId);
    await updateDoc(portfolioRef, {
      assets: updatedAssets,
      totalValue: newTotalValue,
      totalInvested: newTotalInvested,
      totalProfit: newTotalProfit,
      totalProfitPercent: newTotalProfitPercent,
      lastUpdated: Timestamp.now()
    });
    
    // Create transaction record
    const transaction: PortfolioTransaction = {
      id: `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'sell',
      symbol: symbol,
      name: asset.name,
      quantity: quantity,
      price: currentPrice,
      total: totalSaleValue,
      date: Timestamp.now(),
      userId: userId
    };
    
    // Save transaction
    const transactionRef = doc(db, 'transactions', transaction.id);
    await setDoc(transactionRef, transaction);
    
    return true;
  } catch (error) {
    console.error('Error selling stock:', error);
    return false;
  }
}

/**
 * Update stock prices in portfolio
 */
export async function updatePortfolioPrices(
  userId: string,
  marketData: { symbol: string; price: number }[]
): Promise<boolean> {
  try {
    const portfolio = await getUserPortfolio(userId);
    if (!portfolio || portfolio.assets.length === 0) return true;
    
    let hasChanges = false;
    const updatedAssets = portfolio.assets.map(asset => {
      const latestData = marketData.find(stock => stock.symbol === asset.symbol);
      
      if (latestData && latestData.price !== asset.currentPrice) {
        hasChanges = true;
        const currentValue = asset.quantity * latestData.price;
        const profit = currentValue - asset.totalInvested;
        const profitPercent = asset.totalInvested > 0 ? (profit / asset.totalInvested) * 100 : 0;
        
        return {
          ...asset,
          currentPrice: latestData.price,
          currentValue: currentValue,
          profit: profit,
          profitPercent: profitPercent,
          lastUpdated: Timestamp.now()
        };
      }
      return asset;
    });
    
    if (hasChanges) {
      // Recalculate portfolio totals
      const newTotalValue = updatedAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
      const newTotalProfit = newTotalValue - portfolio.totalInvested;
      const newTotalProfitPercent = portfolio.totalInvested > 0 ? (newTotalProfit / portfolio.totalInvested) * 100 : 0;
      
      const portfolioRef = doc(db, 'portfolios', userId);
      await updateDoc(portfolioRef, {
        assets: updatedAssets,
        totalValue: newTotalValue,
        totalProfit: newTotalProfit,
        totalProfitPercent: newTotalProfitPercent,
        lastUpdated: Timestamp.now()
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error updating portfolio prices:', error);
    return false;
  }
}

/**
 * Get portfolio performance data for charts
 */
export async function getPortfolioPerformance(userId: string, days: number = 30): Promise<{
  date: string;
  value: number;
}[]> {
  try {
    // This would be more complex in a real implementation
    // For now, we'll return sample data based on current portfolio value
    const portfolio = await getUserPortfolio(userId);
    if (!portfolio) return [];
    
    const performance = [];
    const currentValue = portfolio.totalValue;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    for (let i = 0; i <= days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Generate sample performance data (in a real app, this would come from historical data)
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const value = currentValue * (1 + variation * (i / days));
      
      performance.push({
        date: date.toISOString().split('T')[0],
        value: Math.max(0, value)
      });
    }
    
    return performance;
  } catch (error) {
    console.error('Error getting portfolio performance:', error);
    return [];
  }
}

/**
 * Delete a user's portfolio (for account deletion)
 */
export async function deleteUserPortfolio(userId: string): Promise<boolean> {
  try {
    // Delete portfolio
    const portfolioRef = doc(db, 'portfolios', userId);
    await deleteDoc(portfolioRef);
    
    // Delete all user transactions
    const transactionsRef = collection(db, 'transactions');
    const q = query(transactionsRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    return true;
  } catch (error) {
    console.error('Error deleting user portfolio:', error);
    return false;
  }
} 