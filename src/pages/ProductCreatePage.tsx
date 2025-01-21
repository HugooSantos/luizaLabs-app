import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { monetaryMask, removeMonetaryMask } from '../utils/maskMonetary';
import { validateEAN } from '../utils/validateEan';

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
  image: Yup.mixed().required('A imagem é obrigatória.'),
  sales_location: Yup.string().required('A situação do produto é obrigatória.')
});

const ProductCreatePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [eanError, setEanError] = useState('');
  const [isEanValidating, setIsEanValidating] = useState(false);

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
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/images`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data.file_path;
  };

  const handleSubmit = async (values: any) => {
    setIsLoading(true);

    try {
      const responseImage = await handleImageUpload(values.image);
      const productData = {
        ...values,
        price: removeMonetaryMask(values.price),
        path_image: responseImage,
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        toast.success('Produto cadastrado com sucesso!');
        navigate('/');
      } else {
        toast.error('Erro ao cadastrar o produto. Tente novamente.');
      }
    } catch (error) {
      toast.error('Erro ao cadastrar o produto. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Cadastro de Produto</h1>

        <Formik
          initialValues={{
            name: '',
            ean: '',
            price: monetaryMask('0'),
            description: '',
            image: null,
            sales_location: 'event',
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
                <ErrorMessage name="image" component="p" className="text-red-500 text-sm mt-2" />
              </div>



              <div className="col-span-2">
                <button
                  type="submit"
                  className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading || isEanValidating || !!eanError}
                >
                  {isLoading ? 'Cadastrando...' : 'Cadastrar Produto'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ProductCreatePage;
