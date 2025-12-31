import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import ProtectedRoute from './pages/ProtectedRoute';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';

// Pages
import HomePage from './pages/HomePage';
import CourseListPage from './pages/CourseListPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Dashboard Pages
import StudentDashboard from './features/Dashboard/StudentDashboard';
import InstructorDashboard from './features/Dashboard/InstructorDashboard';
import AdminDashboard from './features/Dashboard/AdminDashboard';

// Payment Pages
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
// Extra pages for sidebar
import EnrollmentsPage from './pages/EnrollmentsPage';
import CertificatesPage from './pages/CertificatesPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

import InstructorCoursesPage from './pages/InstructorCoursesPage';
import InstructorStudentsPage from './pages/InstructorStudentsPage';
import InstructorAnalyticsPage from './pages/InstructorAnalyticsPage';
import InstructorReviewsPage from './pages/InstructorReviewsPage';
import InstructorMessagesPage from './pages/InstructorMessagesPage';

import AdminUsersPage from './pages/AdminUsersPage';
import AdminCoursesPage from './pages/AdminCoursesPage';
import CreateCoursePage from './pages/CreateCoursePage';
import EditCoursePage from './pages/EditCoursePage';
import AdminInstructorsPage from './pages/AdminInstructorsPage';
import CreateInstructorPage from './pages/CreateInstructorPage';
import EditInstructorPage from './pages/EditInstructorPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import AdminPaymentsPage from './pages/AdminPaymentsPage';
import AdminReportsPage from './pages/AdminReportsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';

// Error Boundary
import ErrorBoundary from './components/common/ErrorBoundary';

import './App.css';

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Header />
      <div className="app-container">
        <Sidebar />
        <main className="app-main">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
            <Route path="/courses" element={<AppLayout><CourseListPage /></AppLayout>} />
            <Route path="/courses/:id" element={<AppLayout><CourseDetailsPage /></AppLayout>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes - Student */}
            <Route
              path="/dashboard/student"
              element={
                <ProtectedRoute role="student">
                  <AppLayout><StudentDashboard /></AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Student sub-pages */}
            <Route path="/enrollments" element={<ProtectedRoute><AppLayout><EnrollmentsPage /></AppLayout></ProtectedRoute>} />
            <Route path="/certificates" element={<ProtectedRoute><AppLayout><CertificatesPage /></AppLayout></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><AppLayout><WishlistPage /></AppLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><AppLayout><ProfilePage /></AppLayout></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>} />

            {/* Protected Routes - Instructor */}
            <Route
              path="/dashboard/instructor"
              element={
                <ProtectedRoute role="instructor">
                  <AppLayout><InstructorDashboard /></AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Instructor pages */}
            <Route path="/instructor/courses" element={<ProtectedRoute role="instructor"><AppLayout><InstructorCoursesPage /></AppLayout></ProtectedRoute>} />
            <Route path="/instructor/students" element={<ProtectedRoute role="instructor"><AppLayout><InstructorStudentsPage /></AppLayout></ProtectedRoute>} />
            <Route path="/instructor/analytics" element={<ProtectedRoute role="instructor"><AppLayout><InstructorAnalyticsPage /></AppLayout></ProtectedRoute>} />
            <Route path="/instructor/reviews" element={<ProtectedRoute role="instructor"><AppLayout><InstructorReviewsPage /></AppLayout></ProtectedRoute>} />
            <Route path="/instructor/messages" element={<ProtectedRoute role="instructor"><AppLayout><InstructorMessagesPage /></AppLayout></ProtectedRoute>} />

            {/* Protected Routes - Admin */}
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute role="admin">
                  <AppLayout><AdminDashboard /></AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin pages */}
            <Route path="/admin/users" element={<ProtectedRoute role="admin"><AppLayout><AdminUsersPage /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/courses" element={<ProtectedRoute role="admin"><AppLayout><AdminCoursesPage /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/courses/new" element={<ProtectedRoute role="admin"><AppLayout><CreateCoursePage /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/courses/:id/edit" element={<ProtectedRoute role="admin"><AppLayout><EditCoursePage /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/instructors" element={<ProtectedRoute role="admin"><AppLayout><AdminInstructorsPage /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/instructors/new" element={<ProtectedRoute role="admin"><AppLayout><CreateInstructorPage /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/instructors/:id/edit" element={<ProtectedRoute role="admin"><AppLayout><EditInstructorPage /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute role="admin"><AppLayout><AdminAnalyticsPage /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/payments" element={<ProtectedRoute role="admin"><AppLayout><AdminPaymentsPage /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute role="admin"><AppLayout><AdminReportsPage /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AppLayout><AdminSettingsPage /></AppLayout></ProtectedRoute>} />

            {/* Payment Routes */}
            <Route
              path="/checkout/:courseId"
              element={
                <ProtectedRoute role={['student', 'user']}>
                  <AppLayout><CheckoutPage /></AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-success"
              element={
                <ProtectedRoute>
                  <AppLayout><PaymentSuccessPage /></AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Catch-all - 404 Page */}
            <Route path="*" element={<AppLayout><NotFoundPage /></AppLayout>} />
          </Routes>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
