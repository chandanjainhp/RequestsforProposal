import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import MainLayout from './layout/MainLayout';
import ChatPage from './pages/ChatPage';
import RfpEditorPage from './pages/RfpEditorPage';
import SendRfpPage from './pages/SendRfpPage';
import ProposalInboxPage from './pages/ProposalInboxPage';
import ComparePage from './pages/ComparePage';
import VendorPage from './pages/VendorPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/chat" replace />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/editor" element={<RfpEditorPage />} />
          <Route path="/editor/:rfpId" element={<RfpEditorPage />} />
          <Route path="/send" element={<SendRfpPage />} />
          <Route path="/send/:rfpId" element={<SendRfpPage />} />
          <Route path="/proposals" element={<ProposalInboxPage />} />
          <Route path="/proposals/:rfpId" element={<ProposalInboxPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/compare/:rfpId" element={<ComparePage />} />
          <Route path="/vendors" element={<VendorPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="*" element={<Navigate to="/chat" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
