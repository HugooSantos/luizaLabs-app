import React from "react";

interface FilterFormProps {
  selectedOption: string;
  productName: string;
  status: string;
  handleRadioChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleProductNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleFilterSubmit: (e: React.FormEvent) => void;
}

const FilterForm: React.FC<FilterFormProps> = ({
  selectedOption,
  productName,
  status,
  handleRadioChange,
  handleProductNameChange,
  handleStatusChange,
  handleFilterSubmit,
}) => {
  return (
    <div className="p-4 rounded-md shadow-md mb-4 mt-3">
      <h3 className="text-xl font-semibold">Filtros</h3>
      <form className="mt-4" onSubmit={handleFilterSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nome do Produto</label>
          <input
            type="text"
            placeholder="Pesquisar por nome"
            value={productName}
            onChange={handleProductNameChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={status}
            onChange={handleStatusChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          >
            <option value="all">Todos</option>
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>
        </div>
        <div className="mb-4 flex">
          <label className="block text-sm font-medium text-gray-700 mx-3">Local de Venda:</label>
          <div className="flex items-center mx-3">
            <input
              type="radio"
              id="all"
              checked={selectedOption === "all"}
              onChange={handleRadioChange}
              value="all"
              name="sales_location"
              className="mr-2"
            />
            <label htmlFor="all" className="text-sm">Todos</label>
          </div>
          <div className="flex items-center mx-3">
            <input
              type="radio"
              id="store"
              checked={selectedOption === "store"}
              onChange={handleRadioChange}
              value="store"
              name="sales_location"
              className="mr-2"
            />
            <label htmlFor="store" className="text-sm">Loja</label>
          </div>
          <div className="flex items-center mx-3">
            <input
              type="radio"
              id="event"
              checked={selectedOption === "event"}
              onChange={handleRadioChange}
              value="event"
              name="sales_location"
              className="mr-2"
            />
            <label htmlFor="event" className="text-sm">Evento</label>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4"
        >
          Aplicar Filtros
        </button>
      </form>
    </div>
  );
};

export default FilterForm;
