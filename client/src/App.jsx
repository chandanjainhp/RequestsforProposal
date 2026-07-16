import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Login from './pages/login';
import Signup from './pages/Signup';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ForgotPassword from './pages/ForgotPassword';
import OtpVerification from './pages/OtpVerification';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';
import RfpListGallery from './pages/RfpListGallery';
import RfpEditorPage from './pages/RfpEditorPage';
import HistoryPage from './pages/HistoryPage';
import ProposalInboxPage from './pages/ProposalInboxPage';
import ProposalComparisonPage from './pages/ProposalComparisonPage';
import NotificationCenter from './pages/NotificationCenter';
import SettingsPage from './pages/SettingsPage';
import VendorManagementPage from './pages/VendorManagementPage';
import AddVendorPage from './pages/AddVendorPage';
import SendRfpPage from './pages/SendRfpPage';
import CreateRfpPage from './pages/CreateRfpPage';
import RfpAnalyticsPage from './pages/RfpAnalyticsPage';
import LandingPage from './pages/LandingPage';
import PricingPage from './pages/PricingPage';
// Footer pages
import FeaturesPage from './pages/FeaturesPage';
import EnterprisePage from './pages/EnterprisePage';
import SecurityPage from './pages/SecurityPage';
import AboutPage from './pages/AboutPage';
import CareersPage from './pages/CareersPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import DocumentationPage from './pages/DocumentationPage';
import GuidesPage from './pages/GuidesPage';
import SupportPage from './pages/SupportPage';
import ApiReferencePage from './pages/ApiReferencePage';

// Inner component to handle routing logic that depends on useLocation
const AppContent = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Auth Routes (No Layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OtpVerification />} />

        {/* Main Application Routes (Wrapped in Layout) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/rfps" element={<RfpListGallery />} />
          <Route path="/rfps/create" element={<CreateRfpPage />} />
          <Route path="/rfps/analytics" element={<RfpAnalyticsPage />} />
          <Route path="/rfps/editor" element={<RfpEditorPage />} />
          <Route path="/rfps/send" element={<SendRfpPage />} />
          <Route path="/rfps/history" element={<HistoryPage />} />
          <Route path="/proposals" element={<ProposalInboxPage />} />
          <Route path="/proposals/compare" element={<ProposalComparisonPage />} />
          <Route path="/vendors" element={<VendorManagementPage />} />
          <Route path="/vendors/add" element={<AddVendorPage />} />
          <Route path="/notifications" element={<NotificationCenter />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Public Routes (No Layout) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* Product Pages */}
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/enterprise" element={<EnterprisePage />} />
        <Route path="/security" element={<SecurityPage />} />

        {/* Company Pages */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Resources Pages */}
        <Route path="/docs" element={<DocumentationPage />} />
        <Route path="/api" element={<ApiReferencePage />} />
        <Route path="/guides" element={<GuidesPage />} />
        <Route path="/support" element={<SupportPage />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;