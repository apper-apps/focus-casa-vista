import React from "react";
import { motion } from "framer-motion";
import PropertyCard from "@/components/molecules/PropertyCard";

const PropertyGrid = ({ properties = [], onViewProperty }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  if (!properties.length) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🏠</span>
        </div>
        <h3 className="font-display text-2xl font-bold text-secondary-800 mb-2">
          No se encontraron propiedades
        </h3>
        <p className="text-secondary-600 mb-6">
          Ajusta tus filtros de búsqueda para ver más resultados
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {properties.map((property) => (
        <motion.div key={property.Id} variants={itemVariants}>
          <PropertyCard
            property={property}
            onViewDetails={onViewProperty}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PropertyGrid;