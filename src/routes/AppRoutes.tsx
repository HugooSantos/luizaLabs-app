import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductPage from "../pages/ProductList";

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<ProductPage />} />
    </Routes>
  </Router>
);

export default AppRoutes;
