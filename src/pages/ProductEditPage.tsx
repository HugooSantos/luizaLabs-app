import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { monetaryMask, removeMonetaryMask } from '../utils/maskMonetary';
import { validateEAN } from '../utils/validateEan';
import { Product } from '../types/product';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('O nome do produto é obrigatório.'),
  price: Yup.string()
    .test(
      'is-valid-number',
      'O Valor da cobrança deve ser maior ou igual a R$ 1,00',
      (value) => {
        const removedMonetaryValue = removeMonetaryMask(value);
        return !isNaN(removedMonetaryValue) && removedMonetaryValue >= 1;
      }
    ),
  ean: Yup.string()
    .length(13, 'EAN deve ter 13 caracteres.')
    .matches(/^\d+$/, 'EAN deve ser numérico.')
    .required('O EAN é obrigatório.'),
  description: Yup.string().required('A descrição é obrigatória.'),
  sales_location: Yup.string().required('A situação do produto é obrigatória.'),
});

const ProductEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [productData, setProductData] = useState<Product>();
  const [isLoading, setIsLoading] = useState(false);
  const [eanError, setEanError] = useState('');
  const [isEanValidating, setIsEanValidating] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`);
        const data = await response.json();
        setProductData(data);
      } catch (error) {
        toast.error('Erro ao carregar os dados do produto.');
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  const handleEanValidation = async (ean: string) => {
    setIsEanValidating(true);
    try {
      await validateEAN(ean);
      setEanError('');
    } catch (error) {
      setEanError('Este EAN já está cadastrado.');
    } finally {
      setIsEanValidating(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return '';
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/images`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data.file_path;
  };


  const handleActiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProductData((prevData: any) => ({
      ...prevData,
      active: event.target.value === 'true'
    }));
  };

  const handleSubmit = async (values: any) => {
    try {
      const imagePath = values.image ? await handleImageUpload(values.image) : productData?.path_image;
      const updatedProductData = {
        ...values,
        price: removeMonetaryMask(values.price),
        path_image: imagePath,
        active: productData?.active,
      };

      if (productData?.ean === values.ean) {
        delete updatedProductData.ean;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProductData),
      });

      if (response.ok) {
        toast.success('Produto atualizado com sucesso!');
        navigate('/');
      } else {
        toast.error('Erro ao atualizar o produto. Tente novamente.');
      }
    } catch (error) {
      toast.error('Erro ao atualizar o produto. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!productData) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Editar Produto</h1>

        <Formik
          initialValues={{
            name: productData.name,
            ean: productData.ean,
            price: monetaryMask(productData.price),
            description: productData.description,
            image: null,
            sales_location: productData.sales_location,
            active: productData.active
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="mb-4 col-span-2">
                <label htmlFor="name" className="block text-2xl font-medium text-gray-700">Nome do Produto</label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Digite o nome"
                  className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="name" component="p" className="text-red-500 text-sm mt-2" />
              </div>

              <div className="mb-4">
                <label htmlFor="ean" className="block text-lg font-medium text-gray-700">EAN</label>
                <Field
                  type="text"
                  id="ean"
                  name="ean"
                  placeholder="Digite o EAN"
                  maxLength={13}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    setEanError('');
                    setFieldValue('ean', value);
                    if (value.length === 13) {
                      handleEanValidation(value);
                    }
                  }}
                  className={`mt-1 p-3 border ${eanError ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {isEanValidating && <p className="text-blue-500 text-sm mt-2">Validando EAN...</p>}
                {eanError && <p className="text-red-500 text-sm mt-2">{eanError}</p>}
                <ErrorMessage name="ean" component="p" className="text-red-500 text-sm mt-2" />
              </div>

              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preço</label>
                <Field
                  type="text"
                  name="price"
                  id="price"
                  value={monetaryMask(values.price)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFieldValue('price', monetaryMask(e.target.value));
                  }}
                  className="block w-full px-3 py-2 mt-4 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite o preço"
                />
                <ErrorMessage name="price" component="p" className="text-red-500 text-sm mt-2" />
              </div>

              <div className="mb-4 col-span-2">
                <label htmlFor="description" className="block text-lg font-medium text-gray-700">Descrição</label>
                <Field
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Digite a descrição"
                  className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="description" component="p" className="text-red-500 text-sm mt-2" />
              </div>

              <div className="mb-4 col-span-2">
                <label htmlFor="image" className="block text-lg font-medium text-gray-700">Imagem</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFieldValue('image', e.target.files?.[0]);
                  }}
                  className="block w-full px-3 py-2 mt-4 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p>{productData.path_image.slice(7)}</p>
                <ErrorMessage name="image" component="p" className="text-red-500 text-sm mt-2" />
              </div>
              <div className="mb-4 col-span-2">
                <label className="block text-lg font-medium text-gray-700">Local de Venda</label>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <Field
                      type="radio"
                      id="event"
                      name="sales_location"
                      value="event"
                      className="mr-2"
                    />
                    <label htmlFor="event" className="text-sm text-gray-700">Evento</label>
                  </div>
                  <div className="flex items-center">
                    <Field
                      type="radio"
                      id="store"
                      name="sales_location"
                      value="store"
                      className="mr-2"
                    />
                    <label htmlFor="store" className="text-sm text-gray-700">Loja</label>
                  </div>
                </div>
                <ErrorMessage name="sales_location" component="p" className="text-red-500 text-sm mt-2" />
              </div>
              <div className="mb-4 col-span-2">
                <label className="block text-lg font-medium text-gray-700">Status do Produto</label>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <Field
                      type="radio"
                      id="active"
                      checked={productData.active}
                      name="active"
                      value="true"
                      className="mr-2"
                      onChange={handleActiveChange}
                    />
                    <label htmlFor="active" className="text-sm text-gray-700">Ativo</label>
                  </div>
                  <div className="flex items-center">
                    <Field
                      type="radio"
                      id="inactive"
                      checked={!productData.active}
                      name="active"
                      value="false"
                      className="mr-2"
                      onChange={handleActiveChange}
                    />
                    <label htmlFor="inactive" className="text-sm text-gray-700">Não Ativo</label>
                  </div>
                </div>
                <ErrorMessage name="active" component="p" className="text-red-500 text-sm mt-2" />
              </div>

              <div className="col-span-2">
                <button
                  type="submit"
                  className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading || isEanValidating || !!eanError}
                >
                  {isLoading ? 'Atualizando...' : 'Atualizar Produto'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ProductEditPage;
