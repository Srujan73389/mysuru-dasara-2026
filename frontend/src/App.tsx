import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import LoadingScreen from '@/components/ui/LoadingScreen';

// Direct synchronous import for Home Page to ensure instant rendering
import HomePage from '@/pages/HomePage';

// Lazy-loaded secondary pages
const ExploreMysuru = lazy(() => import('@/pages/ExploreMysuru'));
const PalacePage = lazy(() => import('@/pages/PalacePage'));
const ChamanundiPage = lazy(() => import('@/pages/ChamanundiPage'));
const JambooSavariPage = lazy(() => import('@/pages/JambooSavariPage'));
const TorchlightParadePage = lazy(() => import('@/pages/TorchlightParadePage'));
const CulturalMuseumPage = lazy(() => import('@/pages/CulturalMuseumPage'));
const EventsPage = lazy(() => import('@/pages/EventsPage'));
const PlannerPage = lazy(() => import('@/pages/PlannerPage'));
const MapPage = lazy(() => import('@/pages/MapPage'));
const AIGuidePage = lazy(() => import('@/pages/AIGuidePage'));
const FoodExhibitionPage = lazy(() => import('@/pages/FoodExhibitionPage'));
const VisitorServicesPage = lazy(() => import('@/pages/VisitorServicesPage'));
const HeritagePassportPage = lazy(() => import('@/pages/HeritagePassportPage'));
const GalleryPage = lazy(() => import('@/pages/GalleryPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const CertificateVerifyPage = lazy(() => import('@/pages/CertificateVerifyPage'));
const GICraftsPage = lazy(() => import('@/pages/GICraftsPage'));

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExploreMysuru />} />
            <Route path="/palace" element={<PalacePage />} />
            <Route path="/chamundi" element={<ChamanundiPage />} />
            <Route path="/jamboo-savari" element={<JambooSavariPage />} />
            <Route path="/torchlight-parade" element={<TorchlightParadePage />} />
            <Route path="/cultural-museum" element={<CulturalMuseumPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/planner" element={<PlannerPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/ai-guide" element={<AIGuidePage />} />
            <Route path="/food-exhibition" element={<FoodExhibitionPage />} />
            <Route path="/visitor-services" element={<VisitorServicesPage />} />
            <Route path="/heritage-passport" element={<HeritagePassportPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/verify" element={<CertificateVerifyPage />} />
            <Route path="/gi-crafts" element={<GICraftsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Fallback to Home */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
