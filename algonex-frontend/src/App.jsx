import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ConfigProvider, App as AntApp } from 'antd';
import { theme } from './theme/theme';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BuddyChatbot from './components/chat/BuddyChatbot';
import AnnouncementBanner from './components/AnnouncementBanner';

// Public pages
import Home from './components/Pages/Home';
import CourseListPage from './pages/courses/CourseListPage';
import CourseDetailPage from './pages/courses/CourseDetailPage';
import Events from './components/Pages/Events';
import EventDetailPage from './pages/events/EventDetailPage';
import AboutUs from './components/Pages/AboutUs';
import Contact from './components/Pages/Contact';
import JobListPage from './pages/careers/JobListPage';
import JobDetailPage from './pages/careers/JobDetailPage';
import CaseStudyListPage from './pages/portfolio/CaseStudyListPage';
import CaseStudyDetailPage from './pages/portfolio/CaseStudyDetailPage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import RegisterPage from './pages/auth/registration-form/App';
import SetPasswordPage from './pages/auth/SetPasswordPage';
import ProfilePage from './pages/auth/ProfilePage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import OAuthCallbackPage from './pages/auth/OAuthCallbackPage';

// Programs
import ProgramListPage from './pages/programs/ProgramListPage';
import ProgramDetailPage from './pages/programs/ProgramDetailPage';
import TrainingPage from './pages/programs/TrainingPage';
import InternshipPage from './pages/programs/InternshipPage';
import FellowshipPage from './pages/programs/FellowshipPage';
import CampusCrewPage from './pages/programs/CampusCrewPage';
import CampusCrewRegistrationPage from './pages/programs/CampusCrewRegistrationPage';


// Protected pages
import MyCoursesPage from './pages/courses/MyCoursesPage';
import MyEventsPage from './pages/events/MyEventsPage';
import MyApplicationsPage from './pages/careers/MyApplicationsPage';

import { ErrorBoundary } from './components/common/ErrorBoundary';
import SkillQuiz from './components/quiz/SkillQuiz';
import AlumniPage from './pages/alumni/AlumniPage';
import ProjectDetailPage from './pages/alumni/ProjectDetailPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';
import CertificateVerification from './pages/CertificateVerification';
import CertificateSearchPage from './pages/CertificateSearchPage';

const App = () => {
  return (
    <ConfigProvider theme={theme.antd}>
      <AntApp>
        <Router>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <AnnouncementBanner />

              <Navbar />
              <div style={{ flex: 1 }}>
                <ErrorBoundary>
                  <Routes>
                    {/* Public */}
                    <Route path="/" element={<Home />} />
                    <Route path="/courses" element={<CourseListPage />} />
                    <Route path="/allcourses" element={<CourseListPage />} />
                    <Route path="/courses/:slug" element={<CourseDetailPage />} />
                    <Route path="/stack/:id" element={<CourseDetailPage />} />
                    <Route path="/events" element={<Navigate to="/campus-crew" replace />} />
                    <Route path="/events/:slug" element={<EventDetailPage />} />

                    <Route path="/aboutus" element={<AboutUs />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/careers" element={<JobListPage />} />
                    <Route path="/careers/:slug" element={<JobDetailPage />} />
                    <Route path="/products" element={<CaseStudyListPage />} />
                    <Route path="/products/:slug" element={<CaseStudyDetailPage />} />
                    <Route path="/programs" element={<ProgramListPage />} />
                    <Route path="/programs/:slug" element={<ProgramDetailPage />} />
                    <Route path="/training" element={<TrainingPage />} />
                    <Route path="/internship" element={<InternshipPage />} />
                    <Route path="/fellowship" element={<FellowshipPage />} />
                    <Route path="/campus-crew" element={<CampusCrewPage />} />
                    <Route path="/campus-crew/register" element={<Navigate to="/campus-crew/register/student" replace />} />
                    <Route path="/campus-crew/register/:type" element={<CampusCrewRegistrationPage />} />



                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/quiz" element={<SkillQuiz />} />
                    <Route path="/alumni" element={<AlumniPage />} />
                    <Route path="/alumni/projects/:slug" element={<ProjectDetailPage />} />
                    <Route path="/certificate" element={<CertificateSearchPage />} />
                    <Route path="/verify/Certificate/:id" element={<CertificateVerification />} />

                    {/* Legal */}
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/terms" element={<TermsPage />} />

                    {/* Auth */}
                    <Route path="/signin" element={<LoginPage />} />
                    <Route path="/signup" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/set-password" element={<SetPasswordPage />} />
                    <Route path="/auth/callback" element={<OAuthCallbackPage />} />

                    {/* Protected */}
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="/my-courses" element={<ProtectedRoute><MyCoursesPage /></ProtectedRoute>} />
                    <Route path="/my-events" element={<ProtectedRoute><MyEventsPage /></ProtectedRoute>} />
                    <Route path="/my-applications" element={<ProtectedRoute><MyApplicationsPage /></ProtectedRoute>} />

                    {/* 404 */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </ErrorBoundary>
              </div>
              <Footer />
            </div>
          </AuthProvider>
          {/* Buddy AI Chatbot — globally available on all pages */}
          <BuddyChatbot />
        </Router>
      </AntApp>
    </ConfigProvider>
  );
};

export default App;
