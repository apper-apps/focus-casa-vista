import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  type = "properties", 
  onAction,
  actionLabel,
  title,
  description 
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case "properties":
        return {
          icon: "Home",
          emoji: "🏠",
          title: title || "No hay propiedades disponibles",
          description: description || "No se encontraron propiedades que coincidan con tus criterios de búsqueda.",
          actionLabel: actionLabel || "Ver todas las propiedades",
          gradient: "from-primary-500 to-accent-500"
        };
      case "search":
        return {
          icon: "Search",
          emoji: "🔍",
          title: title || "Sin resultados de búsqueda",
          description: description || "Intenta ajustar tus filtros o usar términos de búsqueda diferentes.",
          actionLabel: actionLabel || "Limpiar filtros",
          gradient: "from-secondary-500 to-info"
        };
      case "favorites":
        return {
          icon: "Heart",
          emoji: "💖",
          title: title || "Sin propiedades favoritas",
          description: description || "Aún no has marcado ninguna propiedad como favorita. Explora nuestro catálogo.",
          actionLabel: actionLabel || "Explorar propiedades",
          gradient: "from-primary-500 to-accent-500"
        };
      case "contacts":
        return {
          icon: "Users",
          emoji: "👥",
          title: title || "Sin contactos registrados",
          description: description || "No tienes contactos en tu CRM. Los nuevos leads aparecerán aquí automáticamente.",
          actionLabel: actionLabel || "Importar contactos",
          gradient: "from-secondary-500 to-primary-500"
        };
      case "listings":
        return {
          icon: "Building",
          emoji: "🏢",
          title: title || "Sin propiedades en el sistema",
          description: description || "Comienza agregando tu primera propiedad al catálogo.",
          actionLabel: actionLabel || "Agregar propiedad",
          gradient: "from-accent-500 to-primary-500"
        };
      default:
        return {
          icon: "Package",
          emoji: "📦",
          title: title || "No hay elementos",
          description: description || "No se encontraron elementos para mostrar.",
          actionLabel: actionLabel || "Actualizar",
          gradient: "from-secondary-500 to-primary-500"
        };
    }
  };

  const content = getEmptyContent();

  return (
    <div className="text-center py-16">
      <div className={`w-24 h-24 bg-gradient-to-r ${content.gradient}/20 rounded-full flex items-center justify-center mx-auto mb-6`}>
        <span className="text-4xl">{content.emoji}</span>
      </div>
      
      <h3 className="font-display text-2xl font-bold text-secondary-800 mb-3">
        {content.title}
      </h3>
      
      <p className="text-secondary-600 mb-8 max-w-md mx-auto">
        {content.description}
      </p>
      
      {onAction && (
        <Button 
          variant="primary" 
          onClick={onAction}
          className="mx-auto"
        >
          <ApperIcon name={content.icon} size={16} className="mr-2" />
          {content.actionLabel}
        </Button>
      )}
      
      <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-secondary-500">
        <div className="flex items-center">
          <ApperIcon name="Shield" size={16} className="mr-2" />
          <span>Datos seguros</span>
        </div>
        <div className="flex items-center">
          <ApperIcon name="Clock" size={16} className="mr-2" />
          <span>Actualización en tiempo real</span>
        </div>
        <div className="flex items-center">
          <ApperIcon name="Headphones" size={16} className="mr-2" />
          <span>Soporte 24/7</span>
        </div>
      </div>
    </div>
  );
};

export default Empty;