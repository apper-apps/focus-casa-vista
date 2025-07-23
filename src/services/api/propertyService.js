import propertiesData from "@/services/mockData/properties.json";

class PropertyService {
  constructor() {
    this.properties = [...propertiesData];
  }

  async getAll(filters = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredProperties = [...this.properties];
    
    // Apply filters
    if (filters.location) {
      filteredProperties = filteredProperties.filter(property =>
        property.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.priceMin) {
      filteredProperties = filteredProperties.filter(property =>
        property.price >= parseFloat(filters.priceMin)
      );
    }
    
    if (filters.priceMax) {
      filteredProperties = filteredProperties.filter(property =>
        property.price <= parseFloat(filters.priceMax)
      );
    }
    
    if (filters.bedrooms) {
      filteredProperties = filteredProperties.filter(property =>
        property.bedrooms >= parseInt(filters.bedrooms)
      );
    }
    
    if (filters.propertyType) {
      filteredProperties = filteredProperties.filter(property =>
        property.type === filters.propertyType
      );
    }
    
    if (filters.status) {
      filteredProperties = filteredProperties.filter(property =>
        property.status === filters.status
      );
    }
    
    return [...filteredProperties];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const property = this.properties.find(p => p.Id === parseInt(id));
    return property ? { ...property } : null;
  }

  async getFeatured() {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    // Return first 3 available properties as featured
    return this.properties
      .filter(p => p.status === "available")
      .slice(0, 3)
      .map(p => ({ ...p }));
  }

  async create(propertyData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newId = Math.max(...this.properties.map(p => p.Id)) + 1;
    const newProperty = {
      ...propertyData,
      Id: newId,
      createdAt: new Date().toISOString(),
      status: "available"
    };
    
    this.properties.push(newProperty);
    return { ...newProperty };
  }

  async update(id, propertyData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = this.properties.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Property not found");
    }
    
    this.properties[index] = {
      ...this.properties[index],
      ...propertyData,
      Id: parseInt(id) // Ensure Id is not overwritten
    };
    
    return { ...this.properties[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.properties.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Property not found");
    }
    
    const deletedProperty = this.properties.splice(index, 1)[0];
    return { ...deletedProperty };
  }

  async getStats() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      total: this.properties.length,
      available: this.properties.filter(p => p.status === "available").length,
      sold: this.properties.filter(p => p.status === "sold").length,
      pending: this.properties.filter(p => p.status === "pending").length,
      averagePrice: this.properties.reduce((sum, p) => sum + p.price, 0) / this.properties.length
    };
  }
}

export default new PropertyService();