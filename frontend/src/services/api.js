// Centralized API Client with interceptors and error handling
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  // Set token after login
  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // Clear token on logout
  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Build headers with auth token
  getHeaders(isFormData = false) {
    const headers = {
      'Accept': 'application/json',
    };

    // Don't set Content-Type for FormData (browser sets it automatically)
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic request handler with error handling
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      body = null,
      isFormData = false,
      retry = 3,
      timeout = 30000,
    } = options;

    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getHeaders(isFormData);

    let lastError;

    // Retry logic for network failures
    for (let attempt = 1; attempt <= retry; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          method,
          headers,
          body: isFormData ? body : (body ? JSON.stringify(body) : null),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle specific status codes
        if (response.status === 401) {
          this.clearToken();
          window.location.href = '/login'; // Redirect to login
          throw new Error('Unauthorized - Please login');
        }

        if (response.status === 403) {
          throw new Error('Forbidden - You do not have permission');
        }

        if (!response.ok) {
          const error = await response.json().catch(() => ({ message: 'Unknown error' }));
          throw new Error(error.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data };

      } catch (error) {
        lastError = error;

        // Don't retry on client errors (4xx)
        if (error.message?.includes('HTTP 4')) {
          break;
        }

        // Retry on network errors
        if (attempt < retry) {
          console.warn(`Attempt ${attempt} failed, retrying...`, error.message);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    return {
      success: false,
      error: lastError?.message || 'Request failed',
    };
  }

  // Convenience methods
  get(endpoint, options) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  post(endpoint, body, options) {
    return this.request(endpoint, { method: 'POST', body, ...options });
  }

  postFormData(endpoint, formData, options) {
    return this.request(endpoint, { method: 'POST', body: formData, isFormData: true, ...options });
  }

  put(endpoint, body, options) {
    return this.request(endpoint, { method: 'PUT', body, ...options });
  }

  patch(endpoint, body, options) {
    return this.request(endpoint, { method: 'PATCH', body, ...options });
  }

  delete(endpoint, options) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

// Export singleton instance
export default new ApiClient();
