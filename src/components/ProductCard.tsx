import { format } from 'date-fns';
import { Product } from '../types/product';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }: { product: Product }) => {
    const navigate = useNavigate();

    const formattedDate = format(new Date(product.created_at), 'dd/MM/yyyy');

    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(product.price);

    const handleEdit = () => {
        navigate(`/produtos/editar/${product.id}`);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full transform transition-all duration-300 hover:scale-105 flex flex-col justify-between">
            <div>
                <img
                    src={import.meta.env.VITE_API_URL + '/static/' + product.path_image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <p className="text-gray-500 text-xs italic mb-2">EAN: {product.ean}</p>
                <p className="text-gray-500 text-xs">Cadastro: {formattedDate}</p>
            </div>

            <div className="mt-auto">
                <div className="flex justify-between items-center border-t pt-4 mt-4">
                    <span className="text-lg font-bold text-blue-600">{formattedPrice}</span>
                    <span
                        className={`text-sm font-semibold ${product.active ? 'text-green-500' : 'text-red-500'
                            }`}
                    >
                        {product.active ? 'Ativo' : 'Inativo'}
                    </span>
                </div>
                <div className="mt-4 flex justify-start">
                    <button
                        className="py-2 px-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                        onClick={handleEdit}
                    >
                        Editar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
