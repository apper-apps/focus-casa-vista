import { toast } from "react-toastify";

class ContactService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'app_contact';
    
    // Define fields based on Tables & Fields JSON - only Updateable fields for create/update
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'email', 'phone', 'lead_status', 
      'interested_in', 'notes', 'last_contact', 'hot', 'warm', 'cold', 'total'
    ];
    
    // All fields for fetch operations
    this.allFields = [
      { "field": { "Name": "Name" } },
      { "field": { "Name": "Tags" } },
      { "field": { "Name": "Owner" } },
      { "field": { "Name": "email" } },
      { "field": { "Name": "phone" } },
      { "field": { "Name": "lead_status" } },
      { "field": { "Name": "interested_in" } },
      { "field": { "Name": "notes" } },
      { "field": { "Name": "last_contact" } },
      { "field": { "Name": "hot" } },
      { "field": { "Name": "warm" } },
      { "field": { "Name": "cold" } },
      { "field": { "Name": "total" } },
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
            fieldName: "last_contact",
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
      
      if (filters.leadStatus) {
        whereConditions.push({
          FieldName: "lead_status",
          Operator: "EqualTo",
          Values: [filters.leadStatus]
        });
      }
      
      if (filters.search) {
        // Use whereGroups for OR search across multiple fields
        params.whereGroups = [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "Name",
                    operator: "Contains",
                    values: [filters.search]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "email",
                    operator: "Contains",
                    values: [filters.search]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "phone",
                    operator: "Contains",
                    values: [filters.search]
                  }
                ]
              }
            ]
          }
        ];
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
        console.error("Error fetching contacts:", error?.response?.data?.message);
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
        console.error(`Error fetching contact with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(contactData) {
    try {
      // Filter to only include updateable fields and map UI field names to database field names
      const filteredData = {};
      
      // Map UI field names to database field names
      const fieldMapping = {
        'name': 'Name',
        'leadStatus': 'lead_status',
        'interestedIn': 'interested_in',
        'lastContact': 'last_contact'
      };

      Object.keys(contactData).forEach(key => {
        const dbFieldName = fieldMapping[key] || key;
        if (this.updateableFields.includes(dbFieldName)) {
          filteredData[dbFieldName] = contactData[key];
        }
      });

      // Set default values
      filteredData.lead_status = filteredData.lead_status || "cold";
      filteredData.last_contact = new Date().toISOString();
      
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
          console.error(`Failed to create contacts ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating contact:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, contactData) {
    try {
      // Filter to only include updateable fields and map UI field names to database field names
      const filteredData = { Id: parseInt(id) };
      
      // Map UI field names to database field names
      const fieldMapping = {
        'name': 'Name',
        'leadStatus': 'lead_status',
        'interestedIn': 'interested_in',
        'lastContact': 'last_contact'
      };

      Object.keys(contactData).forEach(key => {
        const dbFieldName = fieldMapping[key] || key;
        if (this.updateableFields.includes(dbFieldName)) {
          filteredData[dbFieldName] = contactData[key];
        }
      });

      // Update last contact time
      filteredData.last_contact = new Date().toISOString();

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
          console.error(`Failed to update contacts ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating contact:", error?.response?.data?.message);
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
          console.error(`Failed to delete contacts ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting contact:", error?.response?.data?.message);
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
            id: "hotCount",
            fields: [
              {
                field: { Name: "Id" },
                Function: "Count"
              }
            ],
            where: [
              {
                FieldName: "lead_status",
                Operator: "EqualTo",
                Values: ["hot"]
              }
            ]
          },
          {
            id: "warmCount",
            fields: [
              {
                field: { Name: "Id" },
                Function: "Count"
              }
            ],
            where: [
              {
                FieldName: "lead_status",
                Operator: "EqualTo",
                Values: ["warm"]
              }
            ]
          },
          {
            id: "coldCount",
            fields: [
              {
                field: { Name: "Id" },
                Function: "Count"
              }
            ],
            where: [
              {
                FieldName: "lead_status",
                Operator: "EqualTo",
                Values: ["cold"]
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
          hot: 0,
          warm: 0,
          cold: 0
        };
      }

      const aggregators = response.aggregators || {};
      
      return {
        total: aggregators.totalCount?.value || 0,
        hot: aggregators.hotCount?.value || 0,
        warm: aggregators.warmCount?.value || 0,
        cold: aggregators.coldCount?.value || 0
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching contact stats:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return {
        total: 0,
        hot: 0,
        warm: 0,
        cold: 0
      };
    }
  }
}

export default new ContactService();