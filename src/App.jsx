import { useMemo, useState, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase.js';
import WelcomePage from './pages/WelcomePage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import RoleSelectPage from './pages/RoleSelectPage.jsx';
import FarmerOnboardingPage from './pages/FarmerOnboardingPage.jsx';
import MarketplacePage from './pages/MarketplacePage.jsx';
import ProductFormPage from './pages/ProductFormPage.jsx';
import ProductDetailsPage from './pages/ProductDetailsPage.jsx';
import PriceInsightsPage from './pages/PriceInsightsPage.jsx';
import OffersPage from './pages/OffersPage.jsx';
import CartCheckoutPage from './pages/CartCheckoutPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import InvoiceDetailsPage from './pages/InvoiceDetailsPage.jsx';
import BillingHistoryPage from './pages/BillingHistoryPage.jsx';
import PaymentsPage from './pages/PaymentsPage.jsx';
import ProfileSettingsPage from './pages/ProfileSettingsPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import GstSettingsPage from './pages/GstSettingsPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import Layout from './components/Layout.jsx';
import { mockUser } from './data/mockUsers.js';

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState('farmer');
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email,
          mobile: firebaseUser.phoneNumber,
          role: selectedRole
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [selectedRole]);

  const activeRole = useMemo(() => selectedRole || 'farmer', [selectedRole]);

  const toggleTheme = () => setDarkMode((value) => !value);

  return (
    <div className={darkMode ? 'dark-mode bg-slate-950 text-slate-100' : 'light-mode bg-farmsoil text-farmgray'}>
      <Layout
        user={user || mockUser}
        role={activeRole}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      >
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<AuthPage setUser={setUser} />} />
          <Route path="/role" element={<RoleSelectPage role={activeRole} setSelectedRole={setSelectedRole} />} />
          <Route path="/onboarding" element={<FarmerOnboardingPage user={user || mockUser} setUser={setUser} />} />
          <Route path="/marketplace" element={<MarketplacePage userRole={activeRole} />} />
          <Route path="/product/new" element={<ProductFormPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/insights" element={<PriceInsightsPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/checkout" element={<CartCheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/invoice/:id" element={<InvoiceDetailsPage />} />
          <Route path="/billing" element={<BillingHistoryPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/profile" element={<ProfileSettingsPage user={user || mockUser} setUser={setUser} />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/gst" element={<GstSettingsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="*" element={<div className="p-6 text-center">Page not found</div>} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
