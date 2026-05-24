import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import TechniciansPage from './pages/TechniciansPage';
import OrderSummaryPage from './pages/OrderSummaryPage';
import PaymentPage from './pages/PaymentPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import RatingPage from './pages/RatingPage';
import ChatListPage from './pages/ChatListPage';
import ChatDetailPage from './pages/ChatDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import AccountPage from './pages/AccountPage';
import BantuinPage from './pages/BantuinPage';
import BantuinFormPage from './pages/BantuinFormPage';
import BantuinDetailPage from './pages/BantuinDetailPage';
import BantuinListPage from './pages/BantuinListPage';
import WarTiketFormPage from './pages/WarTiketFormPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services/:category" element={<ServicesPage />} />
          <Route path="/technicians/:serviceId" element={<TechniciansPage />} />
          <Route path="/order-summary" element={<OrderSummaryPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path="/order-detail/:orderId" element={<OrderDetailPage />} />
          <Route path="/order-tracking/:orderId" element={<OrderTrackingPage />} />
          <Route path="/rating/:orderId" element={<RatingPage />} />
          <Route path="/chat" element={<ChatListPage />} />
          <Route path="/chat/:conversationId" element={<ChatDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/bantuin" element={<BantuinPage />} />
          <Route path="/bantuin/new" element={<BantuinFormPage />} />
          <Route path="/bantuin/war-tiket" element={<WarTiketFormPage />} />
          <Route path="/bantuin/request/:requestId" element={<BantuinDetailPage />} />
          <Route path="/bantuin/my-requests" element={<BantuinListPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
