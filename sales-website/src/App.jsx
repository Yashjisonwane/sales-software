import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import RequestService from './pages/RequestService'; // Added
import Contact from './pages/Contact'; // Added
import JobDetails from './pages/JobDetails';
import FindServices from './pages/FindServices'; // Added
import BecomeProfessional from './pages/BecomeProfessional'; // Added
import AboutUs from './pages/AboutUs';
import TrackStatus from './pages/TrackStatus';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/request-service" element={<RequestService />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/job-details" element={<JobDetails />} />
            <Route path="/find-services" element={<FindServices />} />
            {/* <Route path="/become-professional" element={<BecomeProfessional />} /> */}
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/track/:token" element={<TrackStatus />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
