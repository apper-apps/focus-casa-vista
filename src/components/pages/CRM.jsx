import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import contactService from "@/services/api/contactService";

const CRM = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    search: "",
    leadStatus: ""
  });
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    leadStatus: "cold",
    notes: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [contacts, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [contactsData, statsData] = await Promise.all([
        contactService.getAll(),
        contactService.getStats()
      ]);
      
      setContacts(contactsData);
      setStats(statsData);
    } catch (err) {
      setError("Error al cargar los contactos");
      toast.error("Error al cargar los contactos");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...contacts];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm) ||
        contact.email.toLowerCase().includes(searchTerm) ||
        contact.phone.includes(searchTerm)
      );
    }

    if (filters.leadStatus) {
      filtered = filtered.filter(contact =>
        contact.leadStatus === filters.leadStatus
      );
    }

    setFilteredContacts(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      leadStatus: "cold",
      notes: ""
    });
    setEditingContact(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingContact) {
        await contactService.update(editingContact.Id, formData);
        toast.success("Contacto actualizado exitosamente");
      } else {
        await contactService.create(formData);
        toast.success("Contacto agregado exitosamente");
      }
      
      resetForm();
      loadData();
    } catch (err) {
      toast.error("Error al guardar el contacto");
    }
  };

  const handleEdit = (contact) => {
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      leadStatus: contact.leadStatus,
      notes: contact.notes
    });
    setEditingContact(contact);
    setShowAddForm(true);
  };

  const handleDelete = async (contact) => {
    if (window.confirm("¿Estás seguro de eliminar este contacto?")) {
      try {
        await contactService.delete(contact.Id);
        toast.success("Contacto eliminado exitosamente");
        loadData();
      } catch (err) {
        toast.error("Error al eliminar el contacto");
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      hot: "error",
      warm: "warning", 
      cold: "default"
    };
    return statusMap[status] || "default";
  };

  const getStatusColor = (status) => {
    const colorMap = {
      hot: "bg-error",
      warm: "bg-warning",
      cold: "bg-secondary-400"
    };
    return colorMap[status] || "bg-secondary-400";
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
              Sistema CRM
            </h1>
            <p className="text-secondary-600">
              Gestiona tus contactos y leads de manera eficiente
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowAddForm(true)}
            className="flex items-center"
          >
            <ApperIcon name="UserPlus" size={16} className="mr-2" />
            Agregar Contacto
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl card-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm mb-1">Total Contactos</p>
                <p className="font-display text-3xl font-bold gradient-text">
                  {stats.total || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                <ApperIcon name="Users" className="text-white" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl card-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm mb-1">Leads Calientes</p>
                <p className="font-display text-3xl font-bold text-error">
                  {stats.hot || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-error/20 rounded-full flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="text-error" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl card-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm mb-1">Leads Tibios</p>
                <p className="font-display text-3xl font-bold text-orange-600">
                  {stats.warm || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <ApperIcon name="Activity" className="text-orange-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl card-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm mb-1">Leads Fríos</p>
                <p className="font-display text-3xl font-bold text-secondary-600">
                  {stats.cold || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                <ApperIcon name="Snowflake" className="text-secondary-600" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl card-shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Buscar por nombre, email o teléfono..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
            <Select
              value={filters.leadStatus}
              onChange={(e) => handleFilterChange("leadStatus", e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="hot">Caliente</option>
              <option value="warm">Tibio</option>
              <option value="cold">Frío</option>
            </Select>
            <Button
              variant="outline"
              onClick={() => setFilters({ search: "", leadStatus: "" })}
              className="flex items-center justify-center"
            >
              <ApperIcon name="RotateCcw" size={16} className="mr-2" />
              Limpiar Filtros
            </Button>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="bg-white rounded-xl card-shadow overflow-hidden">
          <div className="p-6 border-b border-secondary-200">
            <h2 className="font-display text-xl font-bold text-secondary-800">
              Lista de Contactos ({filteredContacts.length})
            </h2>
          </div>

          {filteredContacts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Estado del Lead
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Último Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                  {filteredContacts.map((contact) => (
                    <motion.tr
                      key={contact.Id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-secondary-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mr-4 ${getStatusColor(contact.leadStatus)}`}>
                            {contact.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-secondary-900">
                              {contact.name}
                            </div>
                            <div className="text-sm text-secondary-500">
                              {contact.email}
                            </div>
                            <div className="text-sm text-secondary-500">
                              {contact.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusBadge(contact.leadStatus)}>
                          {contact.leadStatus === "hot" && "🔥 Caliente"}
                          {contact.leadStatus === "warm" && "🌡️ Tibio"}
                          {contact.leadStatus === "cold" && "❄️ Frío"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-secondary-900">
                          {format(new Date(contact.lastContact), "dd MMM yyyy", { locale: es })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(contact)}
                          >
                            <ApperIcon name="Edit" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary-600 hover:bg-primary-50"
                          >
                            <ApperIcon name="Phone" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary-600 hover:bg-primary-50"
                          >
                            <ApperIcon name="Mail" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(contact)}
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
                type="contacts"
                onAction={() => setShowAddForm(true)}
                actionLabel="Agregar primer contacto"
              />
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Contact Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-secondary-200">
              <div className="flex justify-between items-center">
                <h2 className="font-display text-2xl font-bold text-secondary-800">
                  {editingContact ? "Editar Contacto" : "Agregar Nuevo Contacto"}
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
              <Input
                label="Nombre completo"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />

              <Input
                label="Teléfono"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
              />

              <Select
                label="Estado del lead"
                value={formData.leadStatus}
                onChange={(e) => handleInputChange("leadStatus", e.target.value)}
                required
              >
                <option value="cold">❄️ Frío</option>
                <option value="warm">🌡️ Tibio</option>
                <option value="hot">🔥 Caliente</option>
              </Select>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Notas
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg text-secondary-900 placeholder-secondary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors duration-200"
                  placeholder="Información adicional sobre el contacto..."
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="primary">
                  {editingContact ? "Actualizar" : "Agregar"} Contacto
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CRM;