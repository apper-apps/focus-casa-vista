import React, { useState } from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ onSearch, className = "" }) => {
  const [filters, setFilters] = useState({
    location: "",
    priceMin: "",
    priceMax: "",
    bedrooms: "",
    propertyType: ""
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = () => {
    onSearch && onSearch(filters);
  };

  return (
    <div className={`bg-white rounded-2xl premium-shadow p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <Input
          placeholder="Ciudad o ubicación"
          value={filters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
        />
        <Input
          placeholder="Precio mínimo"
          type="number"
          value={filters.priceMin}
          onChange={(e) => handleFilterChange("priceMin", e.target.value)}
        />
        <Input
          placeholder="Precio máximo"
          type="number"
          value={filters.priceMax}
          onChange={(e) => handleFilterChange("priceMax", e.target.value)}
        />
        <Select
          value={filters.bedrooms}
          onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
        >
          <option value="">Recámaras</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </Select>
        <Select
          value={filters.propertyType}
          onChange={(e) => handleFilterChange("propertyType", e.target.value)}
        >
          <option value="">Tipo</option>
          <option value="casa">Casa</option>
          <option value="departamento">Departamento</option>
          <option value="condominio">Condominio</option>
          <option value="terreno">Terreno</option>
        </Select>
      </div>
      <Button variant="primary" onClick={handleSearch} className="w-full md:w-auto">
        <ApperIcon name="Search" size={16} className="mr-2" />
        Buscar Propiedades
      </Button>
    </div>
  );
};

export default SearchBar;