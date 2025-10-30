import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Trips from "./pages/Trips/TripDetails";
import TripList from "./pages/Trips/TripList";
import Destinations from "./pages/Destinations/Destinations";
import DestinationList from "./pages/Destinations/DestinationList";
import Blog from "./pages/Blog/Blog";
import Contact from "./pages/Contact/contact";
import About from "./pages/About/About";
import Terms from "./pages/Terms/Terms";
import Privacy from "./pages/Privacy/Privacy";
import Honeymoon from "./pages/Category/Honeymoon/HoneymoonDetails";
import Office from "./pages/Category/Office/OfficeDetails";
import Family from "./pages/Category/Family/FamilyDetails";
export default function App() {
  return (
    <>
      <Header />
      <main className="pt-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trips" element={<Trips />} /> 
          <Route path="/triplist" element={<TripList />} />
          <Route path="/blog" element={<Blog />} /> {/* Blog list page with query params */}
          <Route path="/destinations" element={<DestinationList />} />
          <Route path="/destinfo" element={<Destinations />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/destinfo/honeymoon" element={<Honeymoon />} />
          <Route path="/destinfo/office" element={<Office />} />
          <Route path="/destinfo/family" element={<Family />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}