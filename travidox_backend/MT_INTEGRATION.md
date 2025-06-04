# MetaTrader Integration Guide

This guide provides instructions for integrating your local MetaTrader installation with the Travidox backend in development mode.

## Setup for Exness MetaTrader 5

### Prerequisites

1. Install MetaTrader 5
2. Install the MetaTrader 5 Python package:
   ```bash
   pip install MetaTrader5
   ```

### Integration Example

Here's an example of how to implement the local MetaTrader connection functions in `main.py`:

```python
import MetaTrader5 as mt5

def connect_local_mt(login, password, server, platform="mt5"):
    """Connect to local MetaTrader terminal"""
    if not mt5.initialize():
        return {
            "success": False,
            "error": f"Failed to initialize MT5: {mt5.last_error()}"
        }
    
    # Connect to trading account
    authorized = mt5.login(
        login=int(login),
        password=password,
        server=server
    )
    
    if not authorized:
        mt5.shutdown()
        return {
            "success": False,
            "error": f"Failed to login: {mt5.last_error()}"
        }
    
    return {
        "success": True,
        "account_id": login,
        "message": "Connected to local MetaTrader terminal"
    }

def get_local_account_info(account_id):
    """Get account info from local MetaTrader terminal"""
    if not mt5.initialize():
        return {
            "success": False,
            "error": f"Failed to initialize MT5: {mt5.last_error()}"
        }
    
    # Get account information
    account_info = mt5.account_info()
    
    if not account_info:
        return {
            "success": False,
            "error": f"Failed to get account info: {mt5.last_error()}"
        }
    
    # Convert account info to dictionary
    info = {
        "login": account_info.login,
        "name": mt5.account_info()._asdict().get('name', 'Unknown'),
        "server": mt5.account_info()._asdict().get('server', 'Unknown'),
        "currency": account_info.currency,
        "leverage": f"1:{account_info.leverage}",
        "balance": account_info.balance,
        "equity": account_info.equity,
        "margin": account_info.margin,
        "free_margin": account_info.margin_free,
        "margin_level": account_info.margin_level,
    }
    
    return {
        "success": True,
        "account": info
    }

def get_local_positions(account_id):
    """Get positions from local MetaTrader terminal"""
    if not mt5.initialize():
        return {
            "success": False,
            "error": f"Failed to initialize MT5: {mt5.last_error()}"
        }
    
    # Get all positions
    positions = mt5.positions_get()
    
    if positions is None:
        return {
            "success": True,
            "positions": []
        }
    
    # Format positions
    formatted_positions = []
    for position in positions:
        pos_dict = position._asdict()
        formatted_positions.append({
            "id": pos_dict["ticket"],
            "symbol": pos_dict["symbol"],
            "type": "BUY" if pos_dict["type"] == 0 else "SELL",
            "volume": pos_dict["volume"],
            "price_open": pos_dict["price_open"],
            "current_price": pos_dict["price_current"],
            "profit": pos_dict["profit"],
            "swap": pos_dict["swap"],
            "time_open": pos_dict["time"],
            "stop_loss": pos_dict["sl"],
            "take_profit": pos_dict["tp"]
        })
    
    return {
        "success": True,
        "positions": formatted_positions
    }

def place_local_order(account_id, symbol, order_type, volume, stop_loss=None, take_profit=None):
    """Place order using local MetaTrader terminal"""
    if not mt5.initialize():
        return {
            "success": False,
            "error": f"Failed to initialize MT5: {mt5.last_error()}"
        }
    
    # Prepare order request
    order_type_mt5 = mt5.ORDER_TYPE_BUY if order_type == "BUY" else mt5.ORDER_TYPE_SELL
    
    # Get current price
    symbol_info = mt5.symbol_info(symbol)
    if symbol_info is None:
        return {
            "success": False,
            "error": f"Symbol {symbol} not found"
        }
    
    price = symbol_info.ask if order_type == "BUY" else symbol_info.bid
    
    # Prepare request
    request = {
        "action": mt5.TRADE_ACTION_DEAL,
        "symbol": symbol,
        "volume": float(volume),
        "type": order_type_mt5,
        "price": price,
        "deviation": 20,  # Allow price deviation in points
        "magic": 12345,   # Expert Advisor ID
        "comment": "Travidox order",
        "type_time": mt5.ORDER_TIME_GTC,
        "type_filling": mt5.ORDER_FILLING_IOC,
    }
    
    # Add stop loss and take profit if provided
    if stop_loss:
        request["sl"] = float(stop_loss)
    if take_profit:
        request["tp"] = float(take_profit)
    
    # Send order
    result = mt5.order_send(request)
    
    if result.retcode != mt5.TRADE_RETCODE_DONE:
        return {
            "success": False,
            "error": f"Order failed: {result.comment} (Code: {result.retcode})"
        }
    
    # Get order details
    order_info = result._asdict()
    
    return {
        "success": True,
        "order": {
            "id": order_info["order"],
            "symbol": symbol,
            "type": order_type,
            "volume": volume,
            "price": price,
            "time": order_info["request"]["time"],
            "stop_loss": stop_loss,
            "take_profit": take_profit
        }
    }

def close_local_position(account_id, position_id):
    """Close position using local MetaTrader terminal"""
    if not mt5.initialize():
        return {
            "success": False,
            "error": f"Failed to initialize MT5: {mt5.last_error()}"
        }
    
    # Get position info
    position = mt5.positions_get(ticket=position_id)
    
    if not position:
        return {
            "success": False,
            "error": f"Position {position_id} not found"
        }
    
    position = position[0]._asdict()
    
    # Prepare close request
    request = {
        "action": mt5.TRADE_ACTION_DEAL,
        "symbol": position["symbol"],
        "volume": position["volume"],
        "type": mt5.ORDER_TYPE_SELL if position["type"] == 0 else mt5.ORDER_TYPE_BUY,  # Opposite direction
        "position": position_id,
        "price": position["price_current"],
        "deviation": 20,
        "magic": 12345,
        "comment": "Travidox close position",
        "type_time": mt5.ORDER_TIME_GTC,
        "type_filling": mt5.ORDER_FILLING_IOC,
    }
    
    # Send order
    result = mt5.order_send(request)
    
    if result.retcode != mt5.TRADE_RETCODE_DONE:
        return {
            "success": False,
            "error": f"Close position failed: {result.comment} (Code: {result.retcode})"
        }
    
    return {
        "success": True,
        "message": f"Position {position_id} closed successfully"
    }
```

## Exness Account Settings

For the Exness MetaTrader 5 account provided:

```json
{
    "broker_server": "Exness-MT5Trial10",
    "account_number": 81378629,
    "password": "Jayeoba@112"
}
```

Make sure:

1. Your MetaTrader 5 terminal is installed and running
2. You're logged into this account in the terminal
3. Your .env file has these credentials:
   ```
   DEV_MT_LOGIN=81378629
   DEV_MT_PASSWORD=Jayeoba@112
   DEV_MT_SERVER=Exness-MT5Trial10
   DEV_MT_PLATFORM=mt5
   ```

## Symbol Names for Exness

When placing orders, use Exness-specific symbol names:

- Standard Forex pairs: "EURUSD", "GBPUSD", etc.
- Micro Forex pairs: "EURUSDm", "GBPUSDm", etc.
- Crypto: "BTCUSD", "ETHUSD", etc.

## Common Issues

1. **Connection Issues**:
   - Ensure MetaTrader 5 is running
   - Check that your account credentials are correct
   - Verify your internet connection

2. **Order Placement Failures**:
   - Check symbol names (they might be different for each broker)
   - Verify that you have sufficient margin
   - Make sure trading is allowed for the symbol

3. **Permission Issues**:
   - Some brokers restrict API trading
   - Check if EA trading is enabled
   - Ensure that automated trading is allowed in MT5 settings 