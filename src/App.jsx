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
import ClientPageLayout from "./components/layouts/ClientPageLayout";
import AdminPageLayout from "./components/layouts/AdminPageLayout";
import { RequireAdmin } from "./db/services/adminAuthServices";
import RedirectIfAuthed from "./db/services/redirectIfLoggedIn";

function App() {
  return (
    <div className="font-prodFont-bold">
      <BrowserRouter>
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

          <Route element={<RedirectIfAuthed />}>
            <Route path="/admin/login" element={<AdminLogin />} />
          </Route>

          <Route element={<RequireAdmin />}>
            <Route element={<AdminPageLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
