import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductPage from "../pages/ProductList";
import ProductCreatePage from "../pages/ProductCreatePage";
import ProductEditPage from "../pages/ProductEditPage";

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<ProductPage />} />
      <Route path="/produtos/criar" element={<ProductCreatePage />} />
      <Route path="/produtos/editar/:id" element={<ProductEditPage />} />
    </Routes>
  </Router>
);

export default AppRoutes;
