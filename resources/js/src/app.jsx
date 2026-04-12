import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Dashboard from './pages/Dashboard.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import '../../css/app.css'; 
import 'flatpickr/dist/flatpickr.min.css'; // Fixes the calendar text
import 'jsvectormap/dist/jsvectormap.css'; // Ensures the map looks correct
import AppLayout from './Layouts/AppLayout';
import { ThemeProvider } from './contexts/ThemeContext'; // Ensure this path matches your folder
import Profile from './pages/Profile'; // 1. Add the import

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
            {/* Other protected routes go here */}
            <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;