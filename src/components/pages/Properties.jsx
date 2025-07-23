import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NeighborhoodCard from "@/components/molecules/NeighborhoodCard";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import SearchBar from "@/components/molecules/SearchBar";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import propertyService from "@/services/api/propertyService";
const Properties = () => {
  const navigate = useNavigate();
  const location = useLocation();
const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);
  const [neighborhoodData, setNeighborhoodData] = useState(null);
  const [loadingNeighborhood, setLoadingNeighborhood] = useState(false);
  // Initialize filters from navigation state or empty
  const [currentFilters, setCurrentFilters] = useState(
    location.state?.filters || {}
  );

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [properties, currentFilters, sortBy]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await propertyService.getAll();
      setProperties(data);
    } catch (err) {
      setError("Error al cargar las propiedades");
      toast.error("Error al cargar las propiedades");
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...properties];

    // Apply filters
    if (currentFilters.location) {
      filtered = filtered.filter(property =>
        property.location.toLowerCase().includes(currentFilters.location.toLowerCase())
      );
    }

    if (currentFilters.priceMin) {
      filtered = filtered.filter(property =>
        property.price >= parseFloat(currentFilters.priceMin)
      );
    }

    if (currentFilters.priceMax) {
      filtered = filtered.filter(property =>
        property.price <= parseFloat(currentFilters.priceMax)
      );
    }

    if (currentFilters.bedrooms) {
      filtered = filtered.filter(property =>
        property.bedrooms >= parseInt(currentFilters.bedrooms)
      );
    }

    if (currentFilters.propertyType) {
      filtered = filtered.filter(property =>
        property.type === currentFilters.propertyType
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "bedrooms":
        filtered.sort((a, b) => b.bedrooms - a.bedrooms);
        break;
      case "size":
        filtered.sort((a, b) => b.sqft - a.sqft);
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredProperties(filtered);
  };

  const handleSearch = (filters) => {
    setCurrentFilters(filters);
  };

  const handleClearFilters = () => {
    setCurrentFilters({});
  };

const handleViewProperty = async (property, action = 'details') => {
    if (action === 'neighborhood') {
      try {
        setLoadingNeighborhood(true);
        const neighborhoodInfo = await propertyService.getNeighborhoodInfo(property.Id);
        setNeighborhoodData(neighborhoodInfo);
        setSelectedNeighborhood(property);
        toast.success("Información del vecindario cargada");
      } catch (err) {
        toast.error("Error al cargar información del vecindario");
      } finally {
        setLoadingNeighborhood(false);
      }
    } else {
      navigate(`/properties/${property.Id}`);
    }
  };

  const handleCloseNeighborhood = () => {
    setSelectedNeighborhood(null);
    setNeighborhoodData(null);
  };

  const hasActiveFilters = () => {
    return Object.values(currentFilters).some(value => value && value !== "");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-8 bg-secondary-200 rounded w-64 mb-4 animate-pulse"></div>
            <div className="h-4 bg-secondary-200 rounded w-96 animate-pulse"></div>
          </div>
          <div className="mb-8">
            <div className="h-20 bg-white rounded-2xl animate-pulse"></div>
          </div>
          <Loading type="properties" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Error 
            message={error} 
            onRetry={loadProperties}
            type="properties"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-secondary-800 mb-2">
            Propiedades Disponibles
          </h1>
          <p className="text-secondary-600">
            Encuentra la propiedad perfecta entre {properties.length} opciones disponibles
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center text-secondary-600">
              <span className="font-medium">
                {filteredProperties.length} propiedades encontradas
              </span>
              {hasActiveFilters() && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="ml-4"
                >
                  <ApperIcon name="X" size={16} className="mr-1" />
                  Limpiar filtros
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-48"
            >
              <option value="newest">Más recientes</option>
              <option value="price-low">Precio: Menor a mayor</option>
              <option value="price-high">Precio: Mayor a menor</option>
              <option value="bedrooms">Más recámaras</option>
              <option value="size">Mayor tamaño</option>
            </Select>

            {/* View Mode */}
            <div className="flex rounded-lg border border-secondary-200 overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-primary-500 text-white"
                    : "bg-white text-secondary-600 hover:bg-secondary-50"
                }`}
              >
                <ApperIcon name="Grid3X3" size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-primary-500 text-white"
                    : "bg-white text-secondary-600 hover:bg-secondary-50"
                }`}
              >
                <ApperIcon name="List" size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredProperties.length > 0 ? (
          <PropertyGrid 
            properties={filteredProperties}
            onViewProperty={handleViewProperty}
          />
        ) : (
          <Empty 
            type={hasActiveFilters() ? "search" : "properties"}
            title={
              hasActiveFilters() 
                ? "No se encontraron propiedades" 
                : "Sin propiedades disponibles"
            }
            description={
              hasActiveFilters()
                ? "Intenta ajustar tus filtros de búsqueda para ver más resultados"
                : "No hay propiedades disponibles en este momento"
            }
            onAction={hasActiveFilters() ? handleClearFilters : null}
            actionLabel={hasActiveFilters() ? "Limpiar filtros" : null}
          />
        )}

        {/* Load more button - for future pagination */}
        {filteredProperties.length > 0 && filteredProperties.length >= 12 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              <ApperIcon name="MoreHorizontal" size={20} className="mr-2" />
Cargar más propiedades
            </Button>
          </div>
        )}

        {/* Neighborhood Modal */}
        {selectedNeighborhood && neighborhoodData && (
          <NeighborhoodCard
            neighborhood={neighborhoodData}
            onClose={handleCloseNeighborhood}
          />
        )}

        {/* Loading Neighborhood Overlay */}
        {loadingNeighborhood && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mr-3"></div>
              <span className="text-secondary-700">Cargando información del vecindario...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;