import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NeighborhoodCard = ({ neighborhood, onClose }) => {
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-success";
    if (rating >= 4.0) return "text-accent-500";
    if (rating >= 3.5) return "text-warning";
    return "text-error";
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-success bg-success/10";
    if (score >= 80) return "text-accent-500 bg-accent-500/10";
    if (score >= 70) return "text-warning bg-warning/10";
    return "text-error bg-error/10";
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <ApperIcon key={i} name="Star" size={16} className="text-accent-500 fill-current" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <ApperIcon key={i} name="Star" size={16} className="text-accent-500 fill-current opacity-50" />
        );
      } else {
        stars.push(
          <ApperIcon key={i} name="Star" size={16} className="text-secondary-300" />
        );
      }
    }
    return stars;
  };

  const renderAmenitySection = (title, amenities, icon) => (
    <div className="mb-6">
      <div className="flex items-center mb-3">
        <ApperIcon name={icon} size={20} className="text-primary-500 mr-2" />
        <h4 className="font-display font-semibold text-secondary-800">{title}</h4>
      </div>
      <div className="space-y-2">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-secondary-800">{amenity.name}</p>
              <p className="text-sm text-secondary-600">{amenity.type}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {renderStars(amenity.rating)}
                <span className="ml-1 text-sm font-medium text-secondary-700">
                  {amenity.rating}
                </span>
              </div>
              <div className="text-sm text-secondary-600 min-w-[60px] text-right">
                {amenity.distance}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-secondary-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl font-bold text-secondary-800">
              Información del Vecindario
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-secondary-500 hover:text-secondary-700"
            >
              <ApperIcon name="X" size={24} />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* Ratings Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <ApperIcon name="MapPin" size={24} className="text-primary-500" />
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(neighborhood.walkabilityScore)}`}>
                  {neighborhood.walkabilityScore}
                </span>
              </div>
              <p className="font-semibold text-secondary-800">Caminabilidad</p>
              <p className="text-sm text-secondary-600">Puntuación de accesibilidad</p>
            </div>

            <div className="bg-gradient-to-br from-success/10 to-success/20 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <ApperIcon name="Shield" size={24} className="text-success" />
                <div className="flex items-center">
                  {renderStars(neighborhood.safetyRating)}
                </div>
              </div>
              <p className="font-semibold text-secondary-800">Seguridad</p>
              <p className="text-sm text-secondary-600">{neighborhood.safetyRating}/5.0</p>
            </div>

            <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <ApperIcon name="Volume2" size={24} className="text-accent-500" />
                <div className="flex items-center">
                  {renderStars(neighborhood.noiseLevel)}
                </div>
              </div>
              <p className="font-semibold text-secondary-800">Nivel de Ruido</p>
              <p className="text-sm text-secondary-600">{neighborhood.noiseLevel}/5.0</p>
            </div>

            <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <ApperIcon name="Bus" size={24} className="text-secondary-500" />
                <div className="flex items-center">
                  {renderStars(neighborhood.publicTransportRating)}
                </div>
              </div>
              <p className="font-semibold text-secondary-800">Transporte</p>
              <p className="text-sm text-secondary-600">{neighborhood.publicTransportRating}/5.0</p>
            </div>
          </div>

          {/* Amenities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              {renderAmenitySection("Restaurantes", neighborhood.nearbyAmenities.restaurants, "Utensils")}
              {renderAmenitySection("Compras", neighborhood.nearbyAmenities.shopping, "ShoppingBag")}
              {renderAmenitySection("Parques", neighborhood.nearbyAmenities.parks, "Trees")}
            </div>
            <div>
              {renderAmenitySection("Educación", neighborhood.nearbyAmenities.education, "GraduationCap")}
              {renderAmenitySection("Salud", neighborhood.nearbyAmenities.healthcare, "Heart")}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NeighborhoodCard;