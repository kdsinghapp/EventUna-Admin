const BASE_URL = "https://eventuna.com/api"

class ApiService {
  // New: Get all users (V2)
  async getAllUsersV2() {
    return this.request("/auth/all-users")
  }
  constructor() {
    this.baseUrl = BASE_URL
    this.token = localStorage.getItem("admin_token")
  }

  setToken(token) {
    this.token = token
    localStorage.setItem("admin_token", token)
  }

  async request(endpoint, options = {}) {
    // Always get the latest token from localStorage before making a request
    this.token = localStorage.getItem("admin_token")
    const url = `${this.baseUrl}${endpoint}`
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Admin Authentication
  async adminLogin(email, password) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  // Merchant Management
  async getAllMerchants() {
    return this.request("/admin/all-merchants")
  }

  // Get total number of merchants
  async getTotalMerchants() {
    const response = await this.request("/admin/all-merchants");
    // The backend response contains totalMerchants
    return response.totalMerchants;
  }

  async updateMerchantApproval(merchantId, status, reason = "") {
    return this.request("/admin/update-merchant-approval-status", {
      method: "PATCH",
      body: JSON.stringify({ merchantId, status, reason }),
    })
  }

  // Services Management
  async addService(serviceData) {
    return this.request("/services", {
      method: "POST",
      body: JSON.stringify(serviceData),
    })
  }

  async getAllServices() {
    return this.request("/services")
  }

  async getSubServices() {
    return this.request("/sub-services")
  }

  async addSubService(subServiceData) {
    return this.request("/subservices", {
      method: "POST",
      body: JSON.stringify(subServiceData),
    })
  }

  // User Management
  async getAllUsers() {
    return this.request("/all-user")
  }

  // Notes Management
  async addNote(noteData) {
    return this.request("/add-notes", {
      method: "POST",
      body: JSON.stringify(noteData),
    })
  }

  // Additional Services
  async addAdditionalService(serviceData) {
    return this.request("/admin/additional-services", {
      method: "POST",
      body: JSON.stringify(serviceData),
    })
  }

  async getAllAdditionalServices() {
    return this.request("/event/additional-services")
  }

  async deleteAdditionalService(serviceId) {
    return this.request(`/admin/additional-services/${serviceId}`, {
      method: "DELETE",
    })
  }

  async updateAdditionalService(serviceId, updateData) {
    return this.request(`/admin/additional-services/${serviceId}`, {
      method: "PATCH",
      body: JSON.stringify(updateData),
    })
  }

  // Place Preferences
  async addPlacePreference(preferenceData) {
    return this.request("/place-preference", {
      method: "POST",
      body: JSON.stringify(preferenceData),
    })
  }

  async addEventType(eventType) {
    return this.request("/event/event-type", {
      method: "POST",
      body: JSON.stringify(eventType),
    })

  }
  async addEventCategory(categoryName, eventTypeId) {
    // Send a single JSON object with both category and eventType (expected by backend)
    return this.request("/event/event-category", {
      method: "POST",
      body: JSON.stringify({ category: categoryName, eventType: eventTypeId }),
    })
  }
  async getEventTypes() {
    return this.request("/event/event-type")    
  }

  async getEventCategories(eventTypeId) {
    return this.request(`/event/event-category/${eventTypeId}`)
  }

  async getAllEventCategories() {
    return this.request("/event/event-category")
  }
}

const apiServiceInstance = new ApiService();
export default apiServiceInstance;
