import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import '../../css/app.css'; 
import 'flatpickr/dist/flatpickr.min.css'; // Fixes the calendar text
import 'jsvectormap/dist/jsvectormap.css'; // Ensures the map looks correct
import AppLayout from './Layouts/AppLayout';
//import { ThemeProvider } from './contexts/ThemeContext'; // Ensure this path matches your folder
import Profile from './pages/Profile'; // 1. Add the import
import InventoryList from './pages/Inventory/InventoryList'; // 1. Import it
import RentalCalendar from './pages/Rentals/RentalCalendar'; // 1. Import it
import EquipmentProfile from './pages/Inventory/EquipmentProfile';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
        {/* Other protected routes go here */}
        <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
        {/* 2. Add the Inventory Route */}
        <Route path="/inventory" element={<AppLayout><InventoryList /></AppLayout>} />
        <Route path="/rentals" element={<RentalCalendar />} />
        <Route path="/equipment/:id" element={<EquipmentProfile />} />
      </Route>
    </Routes>
  );
}

export default App;