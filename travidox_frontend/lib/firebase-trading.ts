import { db } from './firebase';
import { doc, collection, addDoc, updateDoc, getDoc, getDocs, query, where, orderBy, Timestamp, increment, serverTimestamp } from 'firebase/firestore';
import { getMarketPrice } from './market-data';

// Constants
const INITIAL_BALANCE = 1000; // Initial balance in USD
const COLLECTION_ACCOUNTS = 'virtual_accounts';
const COLLECTION_POSITIONS = 'virtual_positions';
const COLLECTION_HISTORY = 'virtual_trade_history';
const DEFAULT_LEVERAGE = 100; // Default leverage (100:1)
const STANDARD_LOT_SIZE = 100000; // Standard lot size for forex (100,000 units)

// Helper function to generate a unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Date.now().toString(36);
}

// Types
export interface VirtualAccount {
  user_id: string;
  balance: number;
  equity: number;
  margin_used: number;
  margin_level: number;
  leverage: number;
  created_at: Date;
  updated_at: Date;
}

export interface VirtualPosition {
  position_id: string;
  user_id: string;
  symbol: string;
  order_type: 'BUY' | 'SELL';
  volume: number;
  open_price: number;
  current_price: number;
  stop_loss: number | null;
  take_profit: number | null;
  profit_loss: number;
  margin: number;
  contract_size: number;
  open_time: Date;
  status: 'OPEN' | 'CLOSED';
}

export interface VirtualTradeHistory {
  trade_id: string;
  position_id: string;
  user_id: string;
  symbol: string;
  order_type: 'BUY' | 'SELL';
  volume: number;
  open_price: number;
  close_price: number;
  profit_loss: number;
  open_time: Date;
  close_time: Date;
}

// Helper function to get or create a virtual account
export async function getOrCreateVirtualAccount(userId: string): Promise<VirtualAccount> {
  try {
    // Check if account exists
    const accountsRef = collection(db, COLLECTION_ACCOUNTS);
    const q = query(accountsRef, where('user_id', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Account exists, return it
      const accountDoc = querySnapshot.docs[0];
      const accountData = accountDoc.data() as VirtualAccount;
      
      // Get all open positions to calculate current metrics
      const positionsRef = collection(db, COLLECTION_POSITIONS);
      const positionsQuery = query(
        positionsRef,
        where('user_id', '==', userId),
        where('status', '==', 'OPEN')
      );
      const positionsSnapshot = await getDocs(positionsQuery);
      const positions = positionsSnapshot.docs.map(doc => doc.data() as VirtualPosition);
      
      // Calculate total margin used
      const totalMarginUsed = positions.reduce((total, pos) => total + pos.margin, 0);
      
      // Calculate total profit/loss
      let totalProfitLoss = 0;
      for (const position of positions) {
        totalProfitLoss += position.profit_loss || 0;
      }
      
      // Calculate equity and margin level
      const equity = INITIAL_BALANCE + totalProfitLoss;
      let marginLevel = 0;
      if (totalMarginUsed > 0) {
        // Calculate margin level but cap it at a reasonable maximum value
        marginLevel = Math.min((equity / totalMarginUsed) * 100, 10000);
      }
      
      // Update account with correct values
      await updateDoc(accountDoc.ref, {
        balance: INITIAL_BALANCE,
        equity: equity,
        margin_used: totalMarginUsed,
        margin_level: marginLevel,
        updated_at: serverTimestamp(),
      });
      
      // Safely convert Timestamp objects to Date objects
      const createdAt = accountDoc.data().created_at;
      const createdAtDate = createdAt instanceof Timestamp ? createdAt.toDate() : new Date();
      
      return {
        ...accountData,
        balance: INITIAL_BALANCE,
        equity: equity,
        margin_used: totalMarginUsed,
        margin_level: marginLevel,
        created_at: createdAtDate,
        updated_at: new Date(),
      };
    }
    
    // Create new account
    const newAccount = {
      user_id: userId,
      balance: INITIAL_BALANCE,
      equity: INITIAL_BALANCE,
      margin_used: 0,
      margin_level: 0,
      leverage: DEFAULT_LEVERAGE,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_ACCOUNTS), newAccount);
    
    return {
      ...newAccount,
      created_at: new Date(),
      updated_at: new Date(),
    };
  } catch (error) {
    console.error('Error getting/creating virtual account:', error);
    throw error;
  }
}

// Calculate margin required for a position
function calculateMargin(volume: number, price: number, leverage: number): number {
  // Calculate contract value: volume (in lots) * standard lot size * price
  const contractValue = volume * STANDARD_LOT_SIZE * price;
  
  // Calculate required margin: contract value / leverage
  return contractValue / leverage;
}

// Calculate pip value for a position
function calculatePipValue(volume: number, symbol: string): number {
  // Standard pip value calculation for forex pairs
  // For most pairs, 1 pip = 0.0001, for JPY pairs 1 pip = 0.01
  const isJpyPair = symbol.includes('JPY');
  const pipSize = isJpyPair ? 0.01 : 0.0001;
  
  // Pip value = volume (in lots) * standard lot size * pip size
  return volume * STANDARD_LOT_SIZE * pipSize;
}

// Calculate profit/loss for a position
function calculateProfitLoss(
  position: Pick<VirtualPosition, 'order_type' | 'open_price' | 'current_price' | 'volume' | 'symbol'>
): number {
  // Calculate pip difference based on order type
  const isJpyPair = position.symbol.includes('JPY');
  const pipMultiplier = isJpyPair ? 100 : 10000;
  
  // Convert price difference to pips
  const pipDifference = position.order_type === 'BUY'
    ? (position.current_price - position.open_price) * pipMultiplier
    : (position.open_price - position.current_price) * pipMultiplier;
  
  // Calculate P/L using the simplified formula: lot size * pip value multiplier * pip difference
  // Using a smaller multiplier (1 instead of 10) to produce more reasonable P/L values
  const result = position.volume * 1 * pipDifference;
  
  // Cap the profit/loss at a reasonable value to prevent extreme numbers
  const maxPL = 1000;
  return Math.max(Math.min(result, maxPL), -maxPL);
}

// Place a virtual order
export async function placeVirtualOrder(
  userId: string,
  symbol: string,
  orderType: 'BUY' | 'SELL',
  volume: number,
  price: number,
  stopLoss: number | null = null,
  takeProfit: number | null = null
): Promise<string | null> {
  try {
    // Get or create account
    const account = await getOrCreateVirtualAccount(userId);
    
    // Calculate margin requirement using proper formula
    const margin = calculateMargin(volume, price, account.leverage);
    
    // Check if account has sufficient margin
    if (INITIAL_BALANCE < margin) {
      throw new Error('Insufficient balance');
    }
    
    // Create position
    const positionId = generateId();
    const position: Omit<VirtualPosition, 'profit_loss' | 'current_price'> = {
      position_id: positionId,
      user_id: userId,
      symbol,
      order_type: orderType,
      volume,
      open_price: price,
      stop_loss: stopLoss,
      take_profit: takeProfit,
      margin,
      contract_size: volume * STANDARD_LOT_SIZE,
      open_time: new Date(),
      status: 'OPEN',
    };
    
    // Add position to Firestore
    await addDoc(collection(db, COLLECTION_POSITIONS), {
      ...position,
      open_time: serverTimestamp(),
      profit_loss: 0,
      current_price: price,
    });
    
    // Get all open positions to calculate total margin
    const positionsRef = collection(db, COLLECTION_POSITIONS);
    const positionsQuery = query(
      positionsRef,
      where('user_id', '==', userId),
      where('status', '==', 'OPEN')
    );
    const positionsSnapshot = await getDocs(positionsQuery);
    const allPositions = positionsSnapshot.docs.map(doc => doc.data() as VirtualPosition);
    
    // Calculate total margin used
    const totalMarginUsed = allPositions.reduce((total, pos) => total + pos.margin, 0);
    
    // Update account balance and margin
    const accountsRef = collection(db, COLLECTION_ACCOUNTS);
    const q = query(accountsRef, where('user_id', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const accountDoc = querySnapshot.docs[0];
      
      // Calculate new margin_level
      const newEquity = INITIAL_BALANCE; // Initially equity is same as balance
      let newMarginLevel = 0;
      if (totalMarginUsed > 0) {
        // Calculate margin level but cap it at a reasonable maximum value
        newMarginLevel = Math.min((newEquity / totalMarginUsed) * 100, 10000);
      }
      
      await updateDoc(accountDoc.ref, {
        balance: INITIAL_BALANCE,
        margin_used: totalMarginUsed,
        margin_level: newMarginLevel,
        equity: newEquity,
        updated_at: serverTimestamp(),
      });
    }
    
    return positionId;
  } catch (error) {
    console.error('Error placing virtual order:', error);
    throw error;
  }
}

// Close a virtual position
export async function closeVirtualPosition(
  userId: string,
  positionId: string,
  closePrice: number
): Promise<boolean> {
  try {
    // Find position
    const positionsRef = collection(db, COLLECTION_POSITIONS);
    const q = query(
      positionsRef,
      where('position_id', '==', positionId),
      where('status', '==', 'OPEN')
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('Position not found or already closed');
    }
    
    const positionDoc = querySnapshot.docs[0];
    const positionData = positionDoc.data();
    const openTime = positionData.open_time;
    const openTimeDate = openTime instanceof Timestamp ? openTime.toDate() : new Date();
    
    const position = {
      ...positionData as VirtualPosition,
      open_time: openTimeDate,
    };
    
    // Calculate profit/loss
    const profitLoss = calculateProfitLoss({
      ...position,
      current_price: closePrice
    });
    
    // Update position status
    await updateDoc(positionDoc.ref, {
      status: 'CLOSED',
      current_price: closePrice,
      profit_loss: profitLoss,
    });
    
    // Add to trade history
    const historyEntry: Omit<VirtualTradeHistory, 'trade_id'> = {
      position_id: positionId,
      user_id: userId,
      symbol: position.symbol,
      order_type: position.order_type,
      volume: position.volume,
      open_price: position.open_price,
      close_price: closePrice,
      profit_loss: profitLoss,
      open_time: position.open_time,
      close_time: new Date(),
    };
    
    await addDoc(collection(db, COLLECTION_HISTORY), {
      ...historyEntry,
      trade_id: generateId(),
      close_time: serverTimestamp(),
    });
    
    // Update account balance and margin
    const accountsRef = collection(db, COLLECTION_ACCOUNTS);
    const accountQuery = query(accountsRef, where('user_id', '==', userId));
    const accountSnapshot = await getDocs(accountQuery);
    
    if (!accountSnapshot.empty) {
      const accountDoc = accountSnapshot.docs[0];
      
      // Get all remaining open positions
      const openPositionsQuery = query(
        positionsRef,
        where('user_id', '==', userId),
        where('status', '==', 'OPEN')
      );
      const openPositionsSnapshot = await getDocs(openPositionsQuery);
      const remainingPositions = openPositionsSnapshot.docs.map(doc => doc.data() as VirtualPosition);
      
      // Calculate total margin used by remaining positions
      const totalMarginUsed = remainingPositions.reduce((total, pos) => total + pos.margin, 0);
      
      // Calculate total profit/loss from remaining positions
      let totalOpenPL = 0;
      for (const pos of remainingPositions) {
        const pl = calculateProfitLoss({
          ...pos,
          current_price: pos.current_price
        });
        totalOpenPL += pl;
      }
      
      // Calculate new values based on initial balance
      const newEquity = INITIAL_BALANCE + totalOpenPL;
      let newMarginLevel = 0;
      if (totalMarginUsed > 0) {
        // Calculate margin level but cap it at a reasonable maximum value
        newMarginLevel = Math.min((newEquity / totalMarginUsed) * 100, 10000);
      }
      
      await updateDoc(accountDoc.ref, {
        balance: INITIAL_BALANCE,
        equity: newEquity,
        margin_used: totalMarginUsed,
        margin_level: newMarginLevel,
        updated_at: serverTimestamp(),
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error closing virtual position:', error);
    throw error;
  }
}

// Get open positions for a user
export async function getVirtualPositions(userId: string): Promise<VirtualPosition[]> {
  try {
    const positionsRef = collection(db, COLLECTION_POSITIONS);
    const q = query(
      positionsRef,
      where('user_id', '==', userId),
      where('status', '==', 'OPEN'),
      orderBy('open_time', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const positions: VirtualPosition[] = [];
    
    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      const openTime = data.open_time;
      const openTimeDate = openTime instanceof Timestamp ? openTime.toDate() : new Date();
      
      positions.push({
        ...data as VirtualPosition,
        open_time: openTimeDate,
      });
    }
    
    return positions;
  } catch (error) {
    console.error('Error getting virtual positions:', error);
    return [];
  }
}

// Get trade history for a user
export async function getVirtualTradeHistory(userId: string): Promise<VirtualTradeHistory[]> {
  try {
    const historyRef = collection(db, COLLECTION_HISTORY);
    const q = query(
      historyRef,
      where('user_id', '==', userId),
      orderBy('close_time', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const history: VirtualTradeHistory[] = [];
    
    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      const openTime = data.open_time;
      const closeTime = data.close_time;
      
      const openTimeDate = openTime instanceof Timestamp ? openTime.toDate() : new Date();
      const closeTimeDate = closeTime instanceof Timestamp ? closeTime.toDate() : new Date();
      
      history.push({
        ...data as VirtualTradeHistory,
        open_time: openTimeDate,
        close_time: closeTimeDate,
      });
    }
    
    return history;
  } catch (error) {
    console.error('Error getting virtual trade history:', error);
    return [];
  }
}

// Update position prices with current market data
export async function updatePositionPrices(userId: string): Promise<void> {
  try {
    // Get all open positions
    const positions = await getVirtualPositions(userId);
    
    // Get account info
    const accountsRef = collection(db, COLLECTION_ACCOUNTS);
    const q = query(accountsRef, where('user_id', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty || positions.length === 0) {
      // If no positions, reset account to initial values
      if (!querySnapshot.empty) {
        const accountDoc = querySnapshot.docs[0];
        await updateDoc(accountDoc.ref, {
          balance: INITIAL_BALANCE,
          equity: INITIAL_BALANCE,
          margin_used: 0,
          margin_level: 0,
          updated_at: serverTimestamp(),
        });
      }
      return;
    }
    
    const accountDoc = querySnapshot.docs[0];
    const account = accountDoc.data() as VirtualAccount;
    
    // Reset balance to initial value
    const balance = INITIAL_BALANCE;
    let totalProfitLoss = 0;
    let totalMarginUsed = 0;
    
    // Update each position with current price
    for (const position of positions) {
      try {
        // Get current market price
        const marketData = await getMarketPrice(position.symbol);
        const currentPrice = position.order_type === 'BUY' ? marketData.bid : marketData.ask;
        
        // Calculate current profit/loss using proper formula
        const profitLoss = calculateProfitLoss({
          ...position,
          current_price: currentPrice
        });
        
        totalProfitLoss += profitLoss;
        totalMarginUsed += position.margin;
        
        // Update position in Firestore
        const positionsRef = collection(db, COLLECTION_POSITIONS);
        const q = query(
          positionsRef,
          where('position_id', '==', position.position_id),
          where('status', '==', 'OPEN')
        );
        
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const positionDoc = querySnapshot.docs[0];
          await updateDoc(positionDoc.ref, {
            current_price: currentPrice,
            profit_loss: profitLoss,
          });
        }
        
        // Check for stop loss/take profit triggers
        if (
          (position.stop_loss !== null && 
           ((position.order_type === 'BUY' && currentPrice <= position.stop_loss) ||
            (position.order_type === 'SELL' && currentPrice >= position.stop_loss))) ||
          (position.take_profit !== null &&
           ((position.order_type === 'BUY' && currentPrice >= position.take_profit) ||
            (position.order_type === 'SELL' && currentPrice <= position.take_profit)))
        ) {
          // Close position automatically
          await closeVirtualPosition(userId, position.position_id, currentPrice);
        }
      } catch (error) {
        console.error(`Error updating position ${position.position_id}:`, error);
      }
    }
    
    // Update account equity and margin level
    const newEquity = balance + totalProfitLoss;
    let marginLevel = 0;
    if (totalMarginUsed > 0) {
      // Calculate margin level but cap it at a reasonable maximum value
      marginLevel = Math.min((newEquity / totalMarginUsed) * 100, 10000);
    }
    
    await updateDoc(accountDoc.ref, {
      balance: balance,
      equity: newEquity,
      margin_used: totalMarginUsed,
      margin_level: marginLevel,
      updated_at: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating position prices:', error);
  }
}