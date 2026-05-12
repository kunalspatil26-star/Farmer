# FarmPrice India

FarmPrice India is a mobile-first marketplace UI for farmers, buyers, and admin staff to manage listings, offers, orders, invoices, and GST workflows.

## Features

- Mobile-first responsive marketplace
- Farmer and buyer dashboards
- Product listing with GST tax configuration
- GST calculation engine supporting exempt, CGST+SGST, and IGST
- Invoice preview, billing history, analytics, and reporting
- Firebase Authentication (OTP), Firestore, and Storage
- Mock data fallback when Firebase is not configured
- React + Vite + Tailwind CSS

## Prerequisites

- Node.js (version 18 or higher) - Download from https://nodejs.org/
- Firebase project (optional, app works with mock data)

## Local Setup

1. **Clone or download the project**

2. **Install dependencies**
   ```bash
   cd d:\farmar
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open the app**
   - Vite will show a local URL (usually http://localhost:5173)
   - Open it in your browser

## Firebase Setup (Optional)

1. Create a Firebase project at https://console.firebase.google.com/

2. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Phone provider

3. Enable Firestore Database:
   - Go to Firestore Database
   - Create database in production mode

4. Enable Storage:
   - Go to Storage
   - Create storage bucket

5. Get your web app config:
   - Go to Project Settings > General > Your apps
   - Click "Add app" > Web app
   - Copy the config object

6. Update `src/config/firebase.js`:
   - Replace the placeholder values with your Firebase config

7. Seed mock data (optional):
   - Uncomment the seed call in `src/utils/seedFirebase.js`
   - Run the app once to populate Firebase with sample data

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── data/               # Mock data files
├── utils/              # Utility functions (GST, invoice, market)
├── services/           # Firebase service functions
├── hooks/              # Custom React hooks
└── config/             # Firebase configuration
```

## Key Features

- **Authentication**: Firebase Phone OTP login
- **Marketplace**: Product search, filtering, GST-aware pricing
- **GST Engine**: Supports exempt, CGST+SGST, IGST calculations
- **Invoice Generation**: Complete billing with tax breakdowns
- **Real-time Data**: Firebase Firestore for live data
- **Responsive Design**: Mobile-first with dark mode support
- **Multi-language Ready**: Architecture for Hindi, regional languages

## Usage

1. Start at the welcome page
2. Choose role (Farmer/Buyer/Admin)
3. Complete onboarding/profile setup
4. Browse marketplace or list products
5. Manage offers, orders, invoices
6. View analytics and reports

## Notes

- App uses mock data by default if Firebase is not configured
- GST calculations follow Indian tax rules
- All prices are in INR (₹)
- Mobile OTP requires Firebase configuration for production use
- File uploads use Firebase Storage when configured
- GST logic is implemented in `src/utils/gst.js`
