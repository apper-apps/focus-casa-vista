import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const PropertyCard = ({ property, onViewDetails }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      available: "available",
      sold: "sold",
      pending: "pending"
    };
    return statusMap[status] || "default";
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl card-shadow overflow-hidden group cursor-pointer"
      onClick={() => onViewDetails && onViewDetails(property)}
    >
      <div className="relative">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge variant={getStatusBadge(property.status)}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </Badge>
        </div>
        <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full font-bold text-sm">
          {formatPrice(property.price)}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold text-secondary-800 mb-2 line-clamp-2">
          {property.title}
        </h3>
        
        <div className="flex items-center text-secondary-600 mb-4">
          <ApperIcon name="MapPin" size={16} className="mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
        
        <div className="flex items-center justify-between text-secondary-600 mb-6">
          <div className="flex items-center">
            <ApperIcon name="Bed" size={16} className="mr-1" />
            <span className="text-sm mr-4">{property.bedrooms}</span>
            <ApperIcon name="Bath" size={16} className="mr-1" />
            <span className="text-sm mr-4">{property.bathrooms}</span>
            <ApperIcon name="Square" size={16} className="mr-1" />
            <span className="text-sm">{property.sqft} m²</span>
          </div>
        </div>
        
        <Button 
          variant="primary" 
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails && onViewDetails(property);
          }}
        >
          Ver Detalles
        </Button>
      </div>
    </motion.div>
  );
};

export default PropertyCard;