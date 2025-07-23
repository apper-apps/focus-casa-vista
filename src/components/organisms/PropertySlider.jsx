import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const PropertySlider = ({ properties = [], onViewProperty }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % properties.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [properties.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + properties.length) % properties.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % properties.length);
  };

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

  if (!properties.length) return null;

  const currentProperty = properties[currentIndex];

  return (
    <div className="relative h-[600px] rounded-2xl overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={currentProperty.images[0]}
            alt={currentProperty.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200"
      >
        <ApperIcon name="ChevronLeft" size={24} />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200"
      >
        <ApperIcon name="ChevronRight" size={24} />
      </button>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Badge variant={getStatusBadge(currentProperty.status)} className="mb-4">
                {currentProperty.status.charAt(0).toUpperCase() + currentProperty.status.slice(1)}
              </Badge>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-display text-4xl font-bold text-white mb-2"
              >
                {currentProperty.title}
              </motion.h2>
              <div className="flex items-center text-white/90 mb-4">
                <ApperIcon name="MapPin" size={20} className="mr-2" />
                <span className="text-lg">{currentProperty.location}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white">
                {formatPrice(currentProperty.price)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-white/90">
              <div className="flex items-center">
                <ApperIcon name="Bed" size={20} className="mr-2" />
                <span>{currentProperty.bedrooms} Recámaras</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Bath" size={20} className="mr-2" />
                <span>{currentProperty.bathrooms} Baños</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Square" size={20} className="mr-2" />
                <span>{currentProperty.sqft} m²</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => onViewProperty(currentProperty)}
              className="bg-white text-secondary-800 hover:bg-secondary-50"
            >
              Ver Propiedad
              <ApperIcon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {properties.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              index === currentIndex ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PropertySlider;