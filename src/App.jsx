import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/client/Home";
import Gallery from "./pages/client/Gallery";
import Crew from "./pages/client/Crew";
import CrewMember from "./pages/client/CrewMember";
import Gears from "./pages/client/Gears";
import GearDetail from "./pages/client/GearDetail";
import Reviews from "./pages/client/Reviews";
import Contact from "./pages/client/Contact";
import AboutUs from "./pages/client/AboutUs";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/client/NotFound";
import { AuthProvider } from "./db/authContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ClientPageLayout from "./components/layouts/ClientPageLayout";
import AdminPageLayout from "./components/layouts/AdminPageLayout";

function App() {
  return (
    <div className="font-prodFont-bold">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<ClientPageLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/gallery/:slug?" element={<Gallery />} />
              <Route path="/crew" element={<Crew />} />
              <Route path="/crew/:id" element={<CrewMember />} />
              <Route path="/gears" element={<Gears />} />
              <Route path="/gears/:id" element={<GearDetail />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/admin-login" element={<AdminLogin />} />

            <Route element={<AdminPageLayout />}>
              <Route element={<ProtectedRoute />}>
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
