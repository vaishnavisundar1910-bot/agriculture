import type { RouteObject } from "react-router-dom";
import LandingPage from "./pages/index";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import ForgotPasswordPage from "./pages/forgot-password";
import DashboardPage from "./pages/dashboard";
import AgriculturePage from "./pages/agriculture";
import CropDetailPage from "./pages/crop-detail";
import LivestockPage from "./pages/livestock";
import SchemesPage from "./pages/schemes";
import SchemeDetailPage from "./pages/scheme-detail";
import ChatPage from "./pages/chat";
import DiseaseDetectionPage from "./pages/disease-detection";
import WeatherPage from "./pages/weather";
import MarketPricesPage from "./pages/market-prices";
import VaccinationsPage from "./pages/vaccinations";
import ConsultationsPage from "./pages/consultations";
import NotificationsPage from "./pages/notifications";
import ProfilePage from "./pages/profile";
import AdminDashboardPage from "./pages/admin/index";
import AdminUsersPage from "./pages/admin/users";
import AdminSchemesPage from "./pages/admin/schemes";
import AdminConsultationsPage from "./pages/admin/consultations";
import { ProtectedRoute, AdminRoute } from "./components/agrivet/ProtectedRoute";
import NotFoundPage from "./pages/_404";

export const routes: RouteObject[] = [
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/dashboard", element: <ProtectedRoute><DashboardPage /></ProtectedRoute> },
  { path: "/agriculture", element: <ProtectedRoute><AgriculturePage /></ProtectedRoute> },
  { path: "/agriculture/:cropId", element: <ProtectedRoute><CropDetailPage /></ProtectedRoute> },
  { path: "/livestock", element: <ProtectedRoute><LivestockPage /></ProtectedRoute> },
  { path: "/schemes", element: <ProtectedRoute><SchemesPage /></ProtectedRoute> },
  { path: "/schemes/:id", element: <ProtectedRoute><SchemeDetailPage /></ProtectedRoute> },
  { path: "/chat", element: <ProtectedRoute><ChatPage /></ProtectedRoute> },
  { path: "/disease-detection", element: <ProtectedRoute><DiseaseDetectionPage /></ProtectedRoute> },
  { path: "/weather", element: <ProtectedRoute><WeatherPage /></ProtectedRoute> },
  { path: "/market-prices", element: <ProtectedRoute><MarketPricesPage /></ProtectedRoute> },
  { path: "/vaccinations", element: <ProtectedRoute><VaccinationsPage /></ProtectedRoute> },
  { path: "/consultations", element: <ProtectedRoute><ConsultationsPage /></ProtectedRoute> },
  { path: "/notifications", element: <ProtectedRoute><NotificationsPage /></ProtectedRoute> },
  { path: "/profile", element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
  { path: "/admin", element: <AdminRoute><AdminDashboardPage /></AdminRoute> },
  { path: "/admin/users", element: <AdminRoute><AdminUsersPage /></AdminRoute> },
  { path: "/admin/schemes", element: <AdminRoute><AdminSchemesPage /></AdminRoute> },
  { path: "/admin/consultations", element: <AdminRoute><AdminConsultationsPage /></AdminRoute> },
  { path: "*", element: <NotFoundPage /> },
];
