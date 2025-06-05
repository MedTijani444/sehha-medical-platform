import { apiRequest } from "./queryClient";

// Enhanced API request function with auth token
export async function authenticatedApiRequest(
  method: string,
  url: string,
  data?: unknown
): Promise<Response> {
  const token = localStorage.getItem("authToken");
  
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  if (!response.ok) {
    const text = (await response.text()) || response.statusText;
    throw new Error(`${response.status}: ${text}`);
  }

  return response;
}

// Consultation API functions
export const consultationApi = {
  start: async (data: { symptoms: string; duration: string; medicalHistory?: string }) => {
    const response = await authenticatedApiRequest("POST", "/api/consultation/start", data);
    return response.json();
  },

  analyze: async (consultationId: number) => {
    const response = await authenticatedApiRequest("POST", "/api/consultation/analyze", { consultationId });
    return response.json();
  },

  sendMessage: async (consultationId: number, message: string, isQuestion?: boolean) => {
    const response = await authenticatedApiRequest("POST", "/api/consultation/chat", {
      consultationId,
      message,
      isQuestion
    });
    return response.json();
  },

  get: async (consultationId: number) => {
    const response = await authenticatedApiRequest("GET", `/api/consultation/${consultationId}`);
    return response.json();
  },

  getAll: async () => {
    const response = await authenticatedApiRequest("GET", "/api/consultations");
    return response.json();
  },

  generatePDF: async (consultationId: number) => {
    const response = await authenticatedApiRequest("POST", `/api/pdf/generate/${consultationId}`);
    return response.blob();
  }
};

// User API functions
export const userApi = {
  updateProfile: async (updates: any) => {
    const response = await authenticatedApiRequest("PUT", "/api/user/profile", updates);
    return response.json();
  }
};
