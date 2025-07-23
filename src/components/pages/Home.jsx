import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PropertySlider from "@/components/organisms/PropertySlider";
import MortgageCalculator from "@/components/molecules/MortgageCalculator";
import SearchBar from "@/components/molecules/SearchBar";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import propertyService from "@/services/api/propertyService";

const Home = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [featured, recent] = await Promise.all([
        propertyService.getFeatured(),
        propertyService.getAll()
      ]);
      
      setFeaturedProperties(featured);
      setRecentProperties(recent.slice(0, 6)); // Show only 6 recent properties
    } catch (err) {
      setError("Error al cargar las propiedades");
      toast.error("Error al cargar las propiedades");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters) => {
    navigate("/properties", { state: { filters } });
  };

  const handleViewProperty = (property) => {
    navigate(`/properties/${property.Id}`);
  };

  const handleViewAllProperties = () => {
    navigate("/properties");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-12">
            <Loading type="slider" />
          </div>
          <div className="mb-12">
            <Loading type="calculator" />
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
            onRetry={loadData}
            type="properties"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Featured Properties Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="font-display text-5xl font-bold gradient-text mb-4">
            Encuentra tu hogar perfecto en México
          </h1>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Descubre las mejores propiedades en las ubicaciones más exclusivas del país
          </p>
        </div>
        
        {featuredProperties.length > 0 ? (
          <PropertySlider 
            properties={featuredProperties}
            onViewProperty={handleViewProperty}
          />
        ) : (
          <Empty 
            type="properties"
            title="Sin propiedades destacadas"
            description="Pronto tendremos propiedades destacadas para mostrar"
            onAction={handleViewAllProperties}
            actionLabel="Ver todas las propiedades"
          />
        )}
      </section>

      {/* Search Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar onSearch={handleSearch} />
      </section>

      {/* Mortgage Calculator Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MortgageCalculator />
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Home" className="text-white" size={24} />
              </div>
              <h3 className="font-display text-3xl font-bold gradient-text mb-2">500+</h3>
              <p className="text-secondary-600">Propiedades Disponibles</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-info rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Users" className="text-white" size={24} />
              </div>
              <h3 className="font-display text-3xl font-bold text-secondary-800 mb-2">1,200+</h3>
              <p className="text-secondary-600">Clientes Satisfechos</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-success to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="MapPin" className="text-white" size={24} />
              </div>
              <h3 className="font-display text-3xl font-bold text-secondary-800 mb-2">25+</h3>
              <p className="text-secondary-600">Ciudades en México</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-warning to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Award" className="text-white" size={24} />
              </div>
              <h3 className="font-display text-3xl font-bold text-secondary-800 mb-2">15+</h3>
              <p className="text-secondary-600">Años de Experiencia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Properties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold text-secondary-800 mb-2">
              Propiedades Recientes
            </h2>
            <p className="text-secondary-600">
              Las últimas incorporaciones a nuestro catálogo
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleViewAllProperties}
            className="hidden sm:flex"
          >
            Ver todas
            <ApperIcon name="ArrowRight" size={16} className="ml-2" />
          </Button>
        </div>
        
        {recentProperties.length > 0 ? (
          <PropertyGrid 
            properties={recentProperties}
            onViewProperty={handleViewProperty}
          />
        ) : (
          <Empty 
            type="properties"
            onAction={handleViewAllProperties}
          />
        )}
        
        <div className="text-center mt-8 sm:hidden">
          <Button 
            variant="primary" 
            onClick={handleViewAllProperties}
            className="w-full"
          >
            Ver todas las propiedades
            <ApperIcon name="ArrowRight" size={16} className="ml-2" />
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-500 to-accent-500 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            ¿Listo para encontrar tu nuevo hogar?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Nuestros expertos te ayudarán a encontrar la propiedad perfecta
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline"
              size="lg"
              onClick={handleViewAllProperties}
              className="bg-white text-primary-600 border-white hover:bg-secondary-50"
            >
              <ApperIcon name="Search" size={20} className="mr-2" />
              Explorar Propiedades
            </Button>
            <Button 
              variant="ghost"
              size="lg" 
              className="text-white hover:bg-white/10"
            >
              <ApperIcon name="Phone" size={20} className="mr-2" />
              Contactar Asesor
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;