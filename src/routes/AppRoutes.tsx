import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductPage from "../pages/ProductList";
import ProductCreatePage from "../pages/ProductCreatePage";

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<ProductPage />} />
      <Route path="/products/create" element={<ProductCreatePage />} />
    </Routes>
  </Router>
);

export default AppRoutes;
