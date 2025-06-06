# Travidox Frontend

## Nigeria Stock Slider

The Nigeria Stock Slider is a feature that displays real-time Nigerian stock data in a horizontally scrolling slider. It fetches data from our internal API endpoint, which proxies the data from an external source to prevent direct exposure of the third-party API.

### Features

- Displays 10 randomly selected Nigerian stocks from the API
- Shows stock name, symbol, current price, and price change percentage
- Sleek auto-scrolling animation with smooth continuous flow
- Pauses animation on hover or click for easier reading
- Visual indicators for price changes (green for increase, red for decrease)
- Always fetches fresh data to ensure up-to-date stock information
- Dark-themed UI design that fits with modern financial interfaces

### Implementation

The feature is implemented with these components:

1. **API Route**: `/api/nigeria-stocks` - Proxies data from the external API with no caching
2. **Hook**: `useNigeriaStocks` - Provides fresh data fetching on each component mount
3. **UI Component**: `NigeriaStockSlider` - Renders the sliding stock ticker using Framer Motion for smooth animations

### Data Fetching Strategy

The slider uses a direct fetching strategy:
1. API route fetches fresh data with each request (using `cache: 'no-store'`)
2. Client-side hook fetches fresh data on component mount and provides a refresh function

This ensures the most up-to-date stock information is always displayed to users.

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