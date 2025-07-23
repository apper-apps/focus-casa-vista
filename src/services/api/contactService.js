import contactsData from "@/services/mockData/contacts.json";

class ContactService {
  constructor() {
    this.contacts = [...contactsData];
  }

  async getAll(filters = {}) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    let filteredContacts = [...this.contacts];
    
    if (filters.leadStatus) {
      filteredContacts = filteredContacts.filter(contact =>
        contact.leadStatus === filters.leadStatus
      );
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredContacts = filteredContacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm) ||
        contact.email.toLowerCase().includes(searchTerm) ||
        contact.phone.includes(searchTerm)
      );
    }
    
    return [...filteredContacts];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const contact = this.contacts.find(c => c.Id === parseInt(id));
    return contact ? { ...contact } : null;
  }

  async create(contactData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newId = Math.max(...this.contacts.map(c => c.Id)) + 1;
    const newContact = {
      ...contactData,
      Id: newId,
      leadStatus: "cold",
      interestedIn: [],
      notes: "",
      lastContact: new Date().toISOString()
    };
    
    this.contacts.push(newContact);
    return { ...newContact };
  }

  async update(id, contactData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    this.contacts[index] = {
      ...this.contacts[index],
      ...contactData,
      Id: parseInt(id),
      lastContact: new Date().toISOString()
    };
    
    return { ...this.contacts[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    const deletedContact = this.contacts.splice(index, 1)[0];
    return { ...deletedContact };
  }

  async getStats() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      total: this.contacts.length,
      hot: this.contacts.filter(c => c.leadStatus === "hot").length,
      warm: this.contacts.filter(c => c.leadStatus === "warm").length,
      cold: this.contacts.filter(c => c.leadStatus === "cold").length
    };
  }
}

export default new ContactService();