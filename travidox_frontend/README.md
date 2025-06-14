# Travidox Frontend

This is the official frontend repository for Travidox, a modern stock trading and investment learning platform focused on the Nigerian Stock Exchange (NGX). This project is built with Next.js, TypeScript, and Tailwind CSS, utilizing Firebase for backend services and Google's Gemini API for its intelligent AI Assistant.

![Travidox AI Assistant](https://i.imgur.com/example.png) <!-- Replace with a real screenshot -->

---

## About The Project

Travidox aims to democratize access to financial markets for Nigerians by providing a robust, user-friendly platform that combines real-time trading, AI-powered insights, and comprehensive financial education.

### Key Features:
*   **Real-Time Stock Trading:** Live connection to the Nigerian Stock Exchange.
*   **AI Financial Assistant:** An intelligent chatbot powered by Gemini for market analysis, stock insights, and educational queries.
*   **Virtual Trading (Demo Account):** A risk-free environment for users to practice trading.
*   **Educational Content:** A rich library of courses, articles, and learning paths.
*   **User Dashboard:** A comprehensive overview of portfolio performance, market news, and account stats.
*   **Secure Authentication:** Managed by Firebase for robust security.

---

## 🛠️ Built With

*   [Next.js](https://nextjs.org/) - React Framework for Production
*   [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
*   [Tailwind CSS](https://tailwindcss.com/) - Utility-First CSS Framework
*   [Firebase](https://firebase.google.com/) - Backend Services (Auth, Firestore)
*   [Google Gemini](https://ai.google.dev/) - AI Model for the Assistant
*   [Shadcn/ui](https://ui.shadcn.com/) - Re-usable components
*   [Lucide React](https://lucide.dev/) - Icon Library

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or later)
*   npm or yarn
*   A Firebase project
*   A Google Gemini API key

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/travidox-frontend.git
    cd travidox-frontend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    *   Create a `.env.local` file in the root of the `travidox_frontend` directory.
    *   Copy the contents of `.env.example` into your new `.env.local` file.
    *   Fill in the required values for Firebase and Gemini API keys.

    ```dotenv
    # .env.local
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
    NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
    # ... and so on for all other Firebase keys
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## ⚙️ Environment Variables

This project requires the following environment variables to be set. See `.env.example` for a template.

*   `GEMINI_API_KEY`: Your API key for the Google Gemini model.
*   `NEXT_PUBLIC_FIREBASE_API_KEY`: The API key for your Firebase project.
*   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Your Firebase project's auth domain.
*   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Your Firebase project's ID.
*   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Your Firebase project's storage bucket.
*   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase project's messaging sender ID.
*   `NEXT_PUBLIC_FIREBASE_APP_ID`: Your Firebase project's app ID.
*   `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`: (Optional) Your Firebase project's measurement ID for Analytics.

---

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

---

## Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter) - email@example.com

Project Link: [https://github.com/your-username/travidox-frontend](https://github.com/your-username/travidox-frontend)

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