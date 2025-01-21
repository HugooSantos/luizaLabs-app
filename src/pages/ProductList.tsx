import { useEffect, useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import FilterForm from '../components/FilterForm';
import Pagination from '../components/Pagination';
import { Product } from '../types/product';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProductPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [productName, setProductName] = useState<string>("");
  const [status, setStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async (page: number) => {
    setIsLoading(true);
    try {
      let url = `${import.meta.env.VITE_API_URL}/products?page=${page}`;
      if (productName) url += `&search=${productName}`;
      if (status !== "all") url += `&is_active=${status === 'true' ? '1' : '0'}`;
      if (locationFilter !== "all") url += `&sales_location=${locationFilter}`;

      const response = await fetch(url);
      const data = await response.json();
      setProducts(data.items);
      setCurrentPage(data.current_page);
      setTotalPages(data.total_pages);
      setTotalResults(data.total_items);
    } catch (error) {
      toast.error('Erro ao buscar os produtos. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductName(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(1);
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocationFilter(event.target.value);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const navigate = useNavigate(); 

  const handleAddProduct = () => {
    navigate('/products/create'); 
  };

  return (
    <div className="h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-white p-2 font-semibold mb-4">
          <h1 className="text-black text-4xl text-center">
            Consulte os seus Produtos cadastrados
          </h1>
        </div>
        <div className="border-t-4 border-blue-500 mb-4"></div>

        <div className="flex justify-between mt-4">
          <button
            className="py-2 px-4 bg-blue-500 text-white rounded"
            onClick={handleToggleFilters}
          >
            {showFilters ? 'Fechar Filtro' : 'Filtrar'}
          </button>

          <button
            className="py-2 px-4 bg-blue-500 text-white rounded"
            onClick={handleAddProduct} 
          >
            Adicionar Produto
          </button>
        </div>

        {showFilters && (
          <FilterForm
            selectedOption={locationFilter}
            productName={productName}
            status={status}
            handleRadioChange={handleRadioChange}
            handleProductNameChange={handleProductNameChange}
            handleStatusChange={handleStatusChange}
            handleFilterSubmit={handleFilterSubmit}
          />
        )}

        {isLoading ? (
          <div className="flex justify-center items-center mt-8">
            <FaSpinner className="animate-spin text-blue-500 text-4xl" />
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
        <ToastContainer />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalResults={totalResults}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ProductPage;
  