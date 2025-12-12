import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, RequireAuth } from "./context/AuthContext";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { CalendarPage } from "./pages/CalendarPage";
import { AttendancePage } from "./pages/AttendancePage";
import { HollandTestPage } from "./pages/HollandTestPage";
import { LandingPage } from "./pages/LandingPage";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="edusaas-theme">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

            <Route path="/login" element={<LoginPage />} />

            {/* Protected Dashboard Routes */}
            <Route path="/app" element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }>
              <Route index element={<DashboardPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="holland-test" element={<HollandTestPage />} />
            </Route>

            {/* Redirect unknown routes to Landing Page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
