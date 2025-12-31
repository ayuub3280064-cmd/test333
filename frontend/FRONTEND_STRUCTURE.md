# Aqoonsoor LMS - Frontend Structure

## 📁 Project Directory Structure

```
frontend/
├── src/
│   ├── api/                          # Backend API Integration
│   │   ├── apiClient.js             # API client functions
│   │   ├── authApi.js               # Authentication endpoints
│   │   ├── courseApi.js             # Course endpoints
│   │   └── index.js                 # API exports
│   │
│   ├── assets/                      # Static Assets
│   │   ├── images/                  # Image files
│   │   ├── icons/                   # Icon files
│   │   └── css/                     # Additional CSS files
│   │
│   ├── components/                  # Reusable Components
│   │   ├── ui/                      # Basic UI Elements
│   │   │   ├── button.jsx
│   │   │   ├── input.jsx
│   │   │   ├── card.jsx
│   │   │   └── modal.jsx
│   │   │
│   │   ├── layout/                  # Layout Components
│   │   │   ├── Header.jsx           # Top navigation bar
│   │   │   ├── Footer.jsx           # Footer section
│   │   │   └── Sidebar.jsx          # Side navigation
│   │   │
│   │   └── common/                  # Common Components
│   │       ├── LoadingSpinner.jsx   # Loading state
│   │       ├── ErrorBoundary.jsx    # Error handling
│   │       └── ErrorAlert.jsx       # Error messages
│   │
│   ├── context/                     # Global State Management
│   │   ├── AuthContext.jsx          # Authentication state
│   │   ├── CourseContext.jsx        # Course state (optional)
│   │   └── reducers/                # Redux reducers (if using Redux)
│   │
│   ├── features/                    # Feature Modules
│   │   ├── Auth/                    # Authentication features
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── Courses/                 # Course features
│   │   │   ├── CourseCard.jsx
│   │   │   ├── CourseDetails.jsx
│   │   │   └── CourseList.jsx
│   │   │
│   │   ├── Dashboard/               # Dashboard features
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── InstructorDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   │
│   │   └── Payments/                # Payment features
│   │       ├── Checkout.jsx
│   │       └── PaymentForm.jsx
│   │
│   ├── pages/                       # Page Components (Routes)
│   │   ├── HomePage.jsx
│   │   ├── CourseListPage.jsx
│   │   ├── CourseDetailsPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── PaymentSuccessPage.jsx
│   │   ├── ProtectedRoute.jsx       # Route protection
│   │   └── NotFoundPage.jsx
│   │
│   ├── hooks/                       # Custom React Hooks
│   │   ├── useAuth.js               # Authentication hook
│   │   ├── useFetch.js              # Data fetching hook
│   │   └── useForm.js               # Form handling hook
│   │
│   ├── utils/                       # Utility Functions
│   │   ├── helpers.js               # Helper functions
│   │   ├── validators.js            # Form validators
│   │   └── constants.js             # Constants
│   │
│   ├── App.jsx                      # Main App component with routing
│   ├── App.css                      # Global styles
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Root styles
│
├── public/                          # Static files
├── package.json
├── vite.config.js
├── index.html
├── jsconfig.json
├── eslint.config.js
└── README.md
```

## 🏗️ Architecture Overview

### 1. **API Layer** (`/api`)
Centralized API client with functions for:
- Authentication (Login, Register, Profile)
- Courses (CRUD operations)
- Enrollments (User course enrollments)
- Payments (Payment processing)
- Users (Admin management)

### 2. **Components** (`/components`)
- **UI**: Reusable, primitive components (Button, Input, Card)
- **Layout**: Page structure components (Header, Footer, Sidebar)
- **Common**: Shared utility components (Spinner, ErrorBoundary)

### 3. **Context** (`/context`)
- **AuthContext**: Global authentication state
- Manages user, token, and authentication methods
- Provides hooks via `useAuth()`

### 4. **Features** (`/features`)
Feature-specific components organized by domain:
- Auth (Login/Register logic)
- Courses (Course display and management)
- Dashboard (Role-based dashboards)
- Payments (Payment processing)

### 5. **Pages** (`/pages`)
Route components that combine features and layout:
- Homepage
- Course List & Details
- Authentication pages
- Protected routes with role-based access

## 🔐 Authentication Flow

1. User registers/logs in
2. Token stored in localStorage
3. AuthContext manages global auth state
4. ProtectedRoute validates access
5. All API calls include token in headers

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints at 768px and 480px
- Sidebar collapses on mobile
- Touch-friendly buttons and inputs

## 🎨 Styling

- CSS custom properties for theming
- Global styles in `App.css`
- Component-specific styles imported with components
- Consistent color scheme and spacing

## 🔧 Environment Setup

Create `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

## 📦 Key Dependencies

- React 18+
- React Router v6
- Modern CSS (Flexbox, Grid)

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

## 📖 Usage Examples

### Using API Functions
```javascript
import { courseApi } from '@/api';

// Fetch courses
const courses = await courseApi.getAllCourses();

// Get single course
const course = await courseApi.getCourseById(courseId);
```

### Using Auth Hook
```javascript
import { useAuth } from '@/context/AuthContext';

function Component() {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated && <p>Welcome {user.name}</p>}
    </div>
  );
}
```

### Creating Protected Routes
```javascript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute role="student">
      <StudentDashboard />
    </ProtectedRoute>
  }
/>
```

## 📝 Notes

- All forms include validation
- API calls include error handling
- Components are fully responsive
- Accessibility features included
- Performance optimized with lazy loading ready

---

**Aqoonsoor LMS** - Modern, scalable Learning Management System built with React & Vite
