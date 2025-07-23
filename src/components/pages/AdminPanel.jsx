import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import propertyService from "@/services/api/propertyService";

const AdminPanel = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [stats, setStats] = useState({});
  
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    type: "",
    description: "",
    features: "",
    images: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [propertiesData, statsData] = await Promise.all([
        propertyService.getAll(),
        propertyService.getStats()
      ]);
      
      setProperties(propertiesData);
      setStats(statsData);
    } catch (err) {
      setError("Error al cargar los datos");
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      location: "",
      bedrooms: "",
      bathrooms: "",
      sqft: "",
      type: "",
      description: "",
      features: "",
      images: ""
    });
    setEditingProperty(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        sqft: parseInt(formData.sqft),
        features: formData.features.split(",").map(f => f.trim()),
        images: formData.images.split(",").map(img => img.trim())
      };

      if (editingProperty) {
        await propertyService.update(editingProperty.Id, propertyData);
        toast.success("Propiedad actualizada exitosamente");
      } else {
        await propertyService.create(propertyData);
        toast.success("Propiedad agregada exitosamente");
      }
      
      resetForm();
      loadData();
    } catch (err) {
      toast.error("Error al guardar la propiedad");
    }
  };

  const handleEdit = (property) => {
    setFormData({
      title: property.title,
      price: property.price.toString(),
      location: property.location,
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      sqft: property.sqft.toString(),
      type: property.type,
      description: property.description,
      features: property.features.join(", "),
      images: property.images.join(", ")
    });
    setEditingProperty(property);
    setShowAddForm(true);
  };

  const handleDelete = async (property) => {
    if (window.confirm("¿Estás seguro de eliminar esta propiedad?")) {
      try {
        await propertyService.delete(property.Id);
        toast.success("Propiedad eliminada exitosamente");
        loadData();
      } catch (err) {
        toast.error("Error al eliminar la propiedad");
      }
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-8 bg-secondary-200 rounded w-64 mb-4 animate-pulse"></div>
            <div className="h-4 bg-secondary-200 rounded w-96 animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="h-12 w-12 bg-secondary-200 rounded-full mb-4"></div>
                <div className="h-8 bg-secondary-200 rounded w-16 mb-2"></div>
                <div className="h-4 bg-secondary-200 rounded w-24"></div>
              </div>
            ))}
          </div>
          
          <Loading type="table" />
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
            type="data"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-4xl font-bold text-secondary-800 mb-2">
              Panel de Administración
            </h1>
            <p className="text-secondary-600">
              Gestiona las propiedades y monitorea el rendimiento del catálogo
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowAddForm(true)}
            className="flex items-center"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Agregar Propiedad
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl card-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm mb-1">Total Propiedades</p>
                <p className="font-display text-3xl font-bold gradient-text">
                  {stats.total || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                <ApperIcon name="Home" className="text-white" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl card-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm mb-1">Disponibles</p>
                <p className="font-display text-3xl font-bold text-success">
                  {stats.available || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                <ApperIcon name="CheckCircle" className="text-success" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl card-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm mb-1">Vendidas</p>
                <p className="font-display text-3xl font-bold text-secondary-800">
                  {stats.sold || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                <ApperIcon name="DollarSign" className="text-secondary-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl card-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm mb-1">Precio Promedio</p>
                <p className="font-display text-lg font-bold text-secondary-800">
                  {formatPrice(stats.averagePrice || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="text-accent-600" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Properties Table */}
        <div className="bg-white rounded-xl card-shadow overflow-hidden">
          <div className="p-6 border-b border-secondary-200">
            <h2 className="font-display text-xl font-bold text-secondary-800">
              Lista de Propiedades
            </h2>
          </div>

          {properties.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Propiedad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Ubicación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                  {properties.map((property) => (
                    <motion.tr
                      key={property.Id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-secondary-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-12 h-12 rounded-lg object-cover mr-4"
                          />
                          <div>
                            <div className="text-sm font-medium text-secondary-900">
                              {property.title}
                            </div>
                            <div className="text-sm text-secondary-500">
                              {property.bedrooms} rec • {property.bathrooms} baños • {property.sqft} m²
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-secondary-900">
                          {formatPrice(property.price)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-secondary-900">
                          {property.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusBadge(property.status)}>
                          {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(property)}
                          >
                            <ApperIcon name="Edit" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(property)}
                            className="text-error hover:bg-error/10"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12">
              <Empty 
                type="listings"
                onAction={() => setShowAddForm(true)}
                actionLabel="Agregar primera propiedad"
              />
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Property Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-secondary-200">
              <div className="flex justify-between items-center">
                <h2 className="font-display text-2xl font-bold text-secondary-800">
                  {editingProperty ? "Editar Propiedad" : "Agregar Nueva Propiedad"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <ApperIcon name="X" size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Título"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
                <Input
                  label="Precio"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  required
                />
              </div>

              <Input
                label="Ubicación"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Recámaras"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                  required
                />
                <Input
                  label="Baños"
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                  required
                />
                <Input
                  label="Metros cuadrados"
                  type="number"
                  value={formData.sqft}
                  onChange={(e) => handleInputChange("sqft", e.target.value)}
                  required
                />
              </div>

              <Select
                label="Tipo de propiedad"
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                required
              >
                <option value="">Seleccionar tipo</option>
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
                <option value="condominio">Condominio</option>
                <option value="terreno">Terreno</option>
              </Select>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg text-secondary-900 placeholder-secondary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors duration-200"
                  required
                />
              </div>

              <Input
                label="Características (separadas por comas)"
                value={formData.features}
                onChange={(e) => handleInputChange("features", e.target.value)}
                placeholder="Piscina, Jardín, Estacionamiento"
              />

              <Input
                label="URLs de imágenes (separadas por comas)"
                value={formData.images}
                onChange={(e) => handleInputChange("images", e.target.value)}
                placeholder="https://ejemplo.com/img1.jpg, https://ejemplo.com/img2.jpg"
                required
              />

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="primary">
                  {editingProperty ? "Actualizar" : "Agregar"} Propiedad
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;