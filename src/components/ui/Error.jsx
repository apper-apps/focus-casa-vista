import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Ha ocurrido un error inesperado", 
  onRetry,
  type = "general" 
}) => {
  const getErrorContent = () => {
    switch (type) {
      case "properties":
        return {
          icon: "Home",
          title: "Error al cargar propiedades",
          description: "No pudimos cargar las propiedades en este momento. Por favor, intenta nuevamente."
        };
      case "network":
        return {
          icon: "Wifi",
          title: "Problema de conexión",
          description: "Verifica tu conexión a internet e intenta nuevamente."
        };
      case "data":
        return {
          icon: "Database",
          title: "Error de datos",
          description: "Hubo un problema al procesar la información solicitada."
        };
      default:
        return {
          icon: "AlertTriangle",
          title: "Algo salió mal",
          description: message
        };
    }
  };

  const errorContent = getErrorContent();

  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gradient-to-r from-error/20 to-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <ApperIcon 
          name={errorContent.icon} 
          size={32} 
          className="text-error" 
        />
      </div>
      
      <h3 className="font-display text-2xl font-bold text-secondary-800 mb-3">
        {errorContent.title}
      </h3>
      
      <p className="text-secondary-600 mb-8 max-w-md mx-auto">
        {errorContent.description}
      </p>
      
      {onRetry && (
        <div className="space-y-4">
          <Button 
            variant="primary" 
            onClick={onRetry}
            className="mx-auto"
          >
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Intentar nuevamente
          </Button>
          
          <p className="text-sm text-secondary-500">
            Si el problema persiste, contacta a soporte técnico
          </p>
        </div>
      )}
    </div>
  );
};

export default Error;