import { toast } from "react-toastify";

class PropertyService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'property';
    
    // Define fields based on Tables & Fields JSON - only Updateable fields for create/update
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'title', 'price', 'location', 'bedrooms', 
      'bathrooms', 'sqft', 'type', 'images', 'description', 'features', 
      'status', 'created_at', 'neighborhood_walkability_score', 
      'neighborhood_safety_rating', 'neighborhood_noise_level', 
      'neighborhood_public_transport_rating', 'total', 'available', 
      'sold', 'pending', 'average_price'
    ];
    
    // All fields for fetch operations
    this.allFields = [
      { "field": { "Name": "Name" } },
      { "field": { "Name": "Tags" } },
      { "field": { "Name": "Owner" } },
      { "field": { "Name": "title" } },
      { "field": { "Name": "price" } },
      { "field": { "Name": "location" } },
      { "field": { "Name": "bedrooms" } },
      { "field": { "Name": "bathrooms" } },
      { "field": { "Name": "sqft" } },
      { "field": { "Name": "type" } },
      { "field": { "Name": "images" } },
      { "field": { "Name": "description" } },
      { "field": { "Name": "features" } },
      { "field": { "Name": "status" } },
      { "field": { "Name": "created_at" } },
      { "field": { "Name": "neighborhood_walkability_score" } },
      { "field": { "Name": "neighborhood_safety_rating" } },
      { "field": { "Name": "neighborhood_noise_level" } },
      { "field": { "Name": "neighborhood_public_transport_rating" } },
      { "field": { "Name": "total" } },
      { "field": { "Name": "available" } },
      { "field": { "Name": "sold" } },
      { "field": { "Name": "pending" } },
      { "field": { "Name": "average_price" } },
      { "field": { "Name": "CreatedOn" } },
      { "field": { "Name": "CreatedBy" } },
      { "field": { "Name": "ModifiedOn" } },
      { "field": { "Name": "ModifiedBy" } }
    ];
  }

  async getAll(filters = {}) {
    try {
      const params = {
        fields: this.allFields,
        orderBy: [
          {
            fieldName: "created_at",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };

      // Apply filters
      const whereConditions = [];
      
      if (filters.location) {
        whereConditions.push({
          FieldName: "location",
          Operator: "Contains",
          Values: [filters.location]
        });
      }
      
      if (filters.priceMin) {
        whereConditions.push({
          FieldName: "price",
          Operator: "GreaterThanOrEqualTo",
          Values: [parseFloat(filters.priceMin)]
        });
      }
      
      if (filters.priceMax) {
        whereConditions.push({
          FieldName: "price",
          Operator: "LessThanOrEqualTo",
          Values: [parseFloat(filters.priceMax)]
        });
      }
      
      if (filters.bedrooms) {
        whereConditions.push({
          FieldName: "bedrooms",
          Operator: "GreaterThanOrEqualTo",
          Values: [parseInt(filters.bedrooms)]
        });
      }
      
      if (filters.propertyType) {
        whereConditions.push({
          FieldName: "type",
          Operator: "EqualTo",
          Values: [filters.propertyType]
        });
      }
      
      if (filters.status) {
        whereConditions.push({
          FieldName: "status",
          Operator: "EqualTo",
          Values: [filters.status]
        });
      }
      
      if (whereConditions.length > 0) {
        params.where = whereConditions;
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching properties:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: this.allFields
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching property with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async getFeatured() {
    try {
      const params = {
        fields: this.allFields,
        where: [
          {
            FieldName: "status",
            Operator: "EqualTo",
            Values: ["available"]
          }
        ],
        orderBy: [
          {
            fieldName: "created_at",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 3,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching featured properties:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async create(propertyData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {};
      this.updateableFields.forEach(field => {
        if (propertyData.hasOwnProperty(field)) {
          filteredData[field] = propertyData[field];
        }
      });

      // Set default values
      filteredData.status = "available";
      filteredData.created_at = new Date().toISOString();
      
      // Handle Owner lookup field - convert to integer ID if needed
      if (filteredData.Owner && typeof filteredData.Owner === 'object') {
        filteredData.Owner = parseInt(filteredData.Owner.Id || filteredData.Owner);
      }

      const params = {
        records: [filteredData]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create properties ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating property:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, propertyData) {
    try {
      // Filter to only include updateable fields
      const filteredData = { Id: parseInt(id) };
      this.updateableFields.forEach(field => {
        if (propertyData.hasOwnProperty(field)) {
          filteredData[field] = propertyData[field];
        }
      });

      // Handle Owner lookup field - convert to integer ID if needed
      if (filteredData.Owner && typeof filteredData.Owner === 'object') {
        filteredData.Owner = parseInt(filteredData.Owner.Id || filteredData.Owner);
      }

      const params = {
        records: [filteredData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update properties ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating property:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete properties ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting property:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  async getStats() {
    try {
      const params = {
        aggregators: [
          {
            id: "totalCount",
            fields: [
              {
                field: { Name: "Id" },
                Function: "Count"
              }
            ]
          },
          {
            id: "availableCount",
            fields: [
              {
                field: { Name: "Id" },
                Function: "Count"
              }
            ],
            where: [
              {
                FieldName: "status",
                Operator: "EqualTo",
                Values: ["available"]
              }
            ]
          },
          {
            id: "soldCount",
            fields: [
              {
                field: { Name: "Id" },
                Function: "Count"
              }
            ],
            where: [
              {
                FieldName: "status",
                Operator: "EqualTo",
                Values: ["sold"]
              }
            ]
          },
          {
            id: "pendingCount",
            fields: [
              {
                field: { Name: "Id" },
                Function: "Count"
              }
            ],
            where: [
              {
                FieldName: "status",
                Operator: "EqualTo",
                Values: ["pending"]
              }
            ]
          },
          {
            id: "averagePrice",
            fields: [
              {
                field: { Name: "price" },
                Function: "Average"
              }
            ]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return {
          total: 0,
          available: 0,
          sold: 0,
          pending: 0,
          averagePrice: 0
        };
      }

      const aggregators = response.aggregators || {};
      
      return {
        total: aggregators.totalCount?.value || 0,
        available: aggregators.availableCount?.value || 0,
        sold: aggregators.soldCount?.value || 0,
        pending: aggregators.pendingCount?.value || 0,
        averagePrice: aggregators.averagePrice?.value || 0
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching property stats:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return {
        total: 0,
        available: 0,
        sold: 0,
        pending: 0,
        averagePrice: 0
      };
    }
  }

  async getNeighborhoodInfo(id) {
    try {
      const property = await this.getById(id);
      
      if (!property) {
        throw new Error("Property not found");
      }

      // Return neighborhood info from property data
      return {
        walkabilityScore: property.neighborhood_walkability_score || 0,
        safetyRating: property.neighborhood_safety_rating || 0,
        noiseLevel: property.neighborhood_noise_level || 0,
        publicTransportRating: property.neighborhood_public_transport_rating || 0,
        // Mock nearby amenities data since it's not in the database schema
        nearbyAmenities: {
          restaurants: [],
          shopping: [],
          education: [],
          healthcare: [],
          parks: []
        }
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching neighborhood info:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw new Error("Neighborhood information not found");
    }
  }
}

export default new PropertyService();