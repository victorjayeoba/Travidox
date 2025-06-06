# Travidox Frontend

## Nigeria Stock Slider

The Nigeria Stock Slider is a feature that displays real-time Nigerian stock data in a horizontally scrolling slider. It fetches data from our internal API endpoint, which proxies the data from an external source to prevent direct exposure of the third-party API.

### Features

- Displays 10 randomly selected Nigerian stocks from the API
- Shows stock name, symbol, current price, and price change percentage
- Sleek auto-scrolling animation with smooth continuous flow
- Pauses animation on hover or click for easier reading
- Visual indicators for price changes (green for increase, red for decrease)
- Efficient caching strategy - data persists until site refresh
- Dark-themed UI design that fits with modern financial interfaces

### Implementation

The feature is implemented with these components:

1. **API Route**: `/api/nigeria-stocks` - Proxies data from the external API with server-side caching
2. **Hook**: `useNigeriaStocks` - Provides data fetching with client-side caching
3. **UI Component**: `NigeriaStockSlider` - Renders the sliding stock ticker using Framer Motion for smooth animations

### Caching Strategy

The slider uses a two-level caching strategy:
1. Server-side caching in the API route (data persists until server restart/deployment)
2. Client-side module-level caching in the hook (data persists until page refresh)

This ensures minimal API calls to the external service while maintaining a responsive UI.

### Usage

The stock slider is included on the homepage, appearing below the header. It can be added to other pages by importing and using the `NigeriaStockSlider` component:

```jsx
import { NigeriaStockSlider } from "@/components/nigeria-stock-slider"

export default function YourPage() {
  return (
    <div>
      <NigeriaStockSlider />
      {/* Other page content */}
    </div>
  )
}
``` 