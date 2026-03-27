import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// New Admin Marketplace Pages
import MarketplaceDashboard from './pages/admin/MarketplaceDashboard';
import AdminLeads from './pages/admin/AdminLeads';
import AdminProfessionals from './pages/admin/AdminProfessionals';
import AdminCategories from './pages/admin/AdminCategories';
import AdminLocations from './pages/admin/AdminLocations';
import AdminSubscriptions from './pages/admin/AdminSubscriptions';
import LiveTracking from './pages/admin/LiveTracking';
import NearbyProfessionals from './pages/admin/NearbyProfessionals';
import LocationHistory from './pages/admin/LocationHistory';

import AdminLogin from './pages/admin/AdminLogin';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';
import AdminJobs from './pages/admin/AdminJobs';
import JobDetail from './pages/admin/JobDetail';
import Reminders from './pages/admin/Reminders';

// New Professional Pages
import ProfessionalLogin from './pages/professional/ProfessionalLogin';
import ProfessionalDashboard from './pages/professional/Dashboard';
import ProfessionalLeads from './pages/professional/Leads';
import ProfessionalLeadMap from './pages/professional/LeadMap';
import ProfessionalMessages from './pages/professional/Messages';
import ProfessionalReviews from './pages/professional/Reviews';
import ProfessionalSubscription from './pages/professional/Subscription';
import ProfessionalProfile from './pages/professional/Profile';
import ProfessionalSettings from './pages/professional/Settings';

import AdminLayout from './layouts/AdminLayout';
import ProfessionalLayout from './layouts/ProfessionalLayout';
import { DataProvider } from './context/DataContext';
import { MarketplaceProvider } from './context/MarketplaceContext';

function App() {
  return (
    <MarketplaceProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/" element={
              <Navigate to="/professional/login" />
            } />

            {/* Admin Routes */}
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<MarketplaceDashboard />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="jobs/:id" element={<JobDetail />} />
              <Route path="professionals" element={<AdminProfessionals />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="locations" element={<AdminLocations />} />
              <Route path="live-tracking" element={<LiveTracking />} />
              <Route path="nearby" element={<NearbyProfessionals />} />
              <Route path="location-history" element={<LocationHistory />} />
              <Route path="subscriptions" element={<AdminSubscriptions />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="reminders" element={<Reminders />} />
            </Route>


            {/* Professional Routes */}
            <Route path="/professional/login" element={<ProfessionalLogin />} />
            <Route path="/professional" element={<ProfessionalLayout />}>
              <Route path="dashboard" element={<ProfessionalDashboard />} />
              <Route path="leads" element={<ProfessionalLeads />} />
              <Route path="map" element={<ProfessionalLeadMap />} />
              <Route path="messages" element={<ProfessionalMessages />} />
              <Route path="reviews" element={<ProfessionalReviews />} />
              <Route path="subscription" element={<ProfessionalSubscription />} />
              <Route path="profile" element={<ProfessionalProfile />} />
              <Route path="settings" element={<ProfessionalSettings />} />
            </Route>
          </Routes>
        </Router>
      </DataProvider>
    </MarketplaceProvider>
  );
}

export default App;
