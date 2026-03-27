// Pseudo-database for the frontend-only application
export type Role = "customer" | "provider";
export type RequestStatus = "open" | "accepted" | "completed";
export type OfferStatus = "pending" | "accepted" | "rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  rating: number;
}

export interface TransportRequest {
  id: string;
  customerId: string;
  customerName: string;
  pickupLocation: string;
  dropoffLocation: string;
  cargoType: string;
  weight: number;
  deliveryDate: string;
  budget: number;
  notes: string;
  status: RequestStatus;
  createdAt: string;
}

export interface Offer {
  id: string;
  requestId: string;
  providerId: string;
  providerName: string;
  providerRating: number;
  price: number;
  estimatedDeliveryDays: number;
  message: string;
  status: OfferStatus;
  submittedAt: string;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const today = new Date();
const addDays = (days: number) => new Date(today.getTime() + days * 86400000).toISOString().split('T')[0];

export const mockUsers: Record<string, User> = {
  "u_cust1": { id: "u_cust1", name: "Acme Electronics", email: "logistics@acme.inc", role: "customer", avatar: "AE", rating: 4.8 },
  "u_cust2": { id: "u_cust2", name: "Fresh Foods Co.", email: "shipping@freshfoods.com", role: "customer", avatar: "FF", rating: 4.9 },
  "u_prov1": { id: "u_prov1", name: "Swift Freight Lines", email: "dispatch@swiftfreight.com", role: "provider", avatar: "SF", rating: 4.7 },
  "u_prov2": { id: "u_prov2", name: "Global Transports", email: "info@globaltrans.com", role: "provider", avatar: "GT", rating: 4.5 },
  "u_prov3": { id: "u_prov3", name: "Express Haulage", email: "hello@expresshaul.net", role: "provider", avatar: "EH", rating: 4.9 },
};

// Initial state
export const mockDb = {
  currentUser: mockUsers["u_cust1"],
  requests: [
    {
      id: "req_1",
      customerId: "u_cust1",
      customerName: "Acme Electronics",
      pickupLocation: "San Jose, CA",
      dropoffLocation: "Austin, TX",
      cargoType: "Electronics",
      weight: 1200,
      deliveryDate: addDays(5),
      budget: 2500,
      notes: "Fragile items. Requires air-ride suspension trailer.",
      status: "open" as RequestStatus,
      createdAt: addDays(-1),
    },
    {
      id: "req_2",
      customerId: "u_cust2",
      customerName: "Fresh Foods Co.",
      pickupLocation: "Miami, FL",
      dropoffLocation: "Atlanta, GA",
      cargoType: "Perishables",
      weight: 5000,
      deliveryDate: addDays(2),
      budget: 1800,
      notes: "Refrigerated transport strictly required (34°F).",
      status: "open" as RequestStatus,
      createdAt: addDays(-2),
    },
    {
      id: "req_3",
      customerId: "u_cust1",
      customerName: "Acme Electronics",
      pickupLocation: "Chicago, IL",
      dropoffLocation: "Detroit, MI",
      cargoType: "Machinery",
      weight: 8500,
      deliveryDate: addDays(3),
      budget: 1200,
      notes: "Standard palletized freight.",
      status: "accepted" as RequestStatus,
      createdAt: addDays(-4),
    },
    {
      id: "req_4",
      customerId: "u_cust2",
      customerName: "Fresh Foods Co.",
      pickupLocation: "Seattle, WA",
      dropoffLocation: "Denver, CO",
      cargoType: "Perishables",
      weight: 2000,
      deliveryDate: addDays(-1),
      budget: 3000,
      notes: "Frozen goods.",
      status: "completed" as RequestStatus,
      createdAt: addDays(-10),
    }
  ] as TransportRequest[],
  offers: [
    {
      id: "off_1",
      requestId: "req_1",
      providerId: "u_prov1",
      providerName: "Swift Freight Lines",
      providerRating: 4.7,
      price: 2450,
      estimatedDeliveryDays: 4,
      message: "We have an air-ride truck in the area ready to pick up tomorrow.",
      status: "pending" as OfferStatus,
      submittedAt: addDays(-1),
    },
    {
      id: "off_2",
      requestId: "req_1",
      providerId: "u_prov2",
      providerName: "Global Transports",
      providerRating: 4.5,
      price: 2200,
      estimatedDeliveryDays: 6,
      message: "Can consolidate with another load to save you money.",
      status: "pending" as OfferStatus,
      submittedAt: addDays(0),
    },
    {
      id: "off_3",
      requestId: "req_3",
      providerId: "u_prov3",
      providerName: "Express Haulage",
      providerRating: 4.9,
      price: 1150,
      estimatedDeliveryDays: 2,
      message: "Direct run, no stops.",
      status: "accepted" as OfferStatus,
      submittedAt: addDays(-3),
    }
  ] as Offer[],
};

// Helpers to simulate network delay
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getCurrentUser: async () => {
    await delay(100);
    return mockDb.currentUser;
  },
  toggleRole: async () => {
    await delay(200);
    const newRole = mockDb.currentUser.role === "customer" ? "provider" : "customer";
    // Switch to a mock user of the opposite role to simulate logging in as that persona
    if (newRole === "provider") {
      mockDb.currentUser = mockDb.currentUser.id === "u_prov1" ? mockDb.currentUser : mockUsers["u_prov1"];
    } else {
      mockDb.currentUser = mockDb.currentUser.id === "u_cust1" ? mockDb.currentUser : mockUsers["u_cust1"];
    }
    return mockDb.currentUser;
  },
  
  getRequests: async () => {
    await delay(300);
    // Providers see all requests, Customers see only their own
    if (mockDb.currentUser.role === "provider") {
      return [...mockDb.requests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return mockDb.requests
      .filter(r => r.customerId === mockDb.currentUser.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  
  getRequestById: async (id: string) => {
    await delay(200);
    const req = mockDb.requests.find(r => r.id === id);
    if (!req) throw new Error("Request not found");
    return req;
  },

  createRequest: async (data: Omit<TransportRequest, "id" | "customerId" | "customerName" | "status" | "createdAt">) => {
    await delay(400);
    const newReq: TransportRequest = {
      ...data,
      id: `req_${generateId()}`,
      customerId: mockDb.currentUser.id,
      customerName: mockDb.currentUser.name,
      status: "open",
      createdAt: new Date().toISOString(),
    };
    mockDb.requests = [newReq, ...mockDb.requests];
    return newReq;
  },

  getOffersForRequest: async (requestId: string) => {
    await delay(200);
    return mockDb.offers.filter(o => o.requestId === requestId);
  },

  getMyBids: async () => {
    await delay(300);
    return mockDb.offers.filter(o => o.providerId === mockDb.currentUser.id);
  },

  submitOffer: async (data: Omit<Offer, "id" | "providerId" | "providerName" | "providerRating" | "status" | "submittedAt">) => {
    await delay(500);
    const newOffer: Offer = {
      ...data,
      id: `off_${generateId()}`,
      providerId: mockDb.currentUser.id,
      providerName: mockDb.currentUser.name,
      providerRating: mockDb.currentUser.rating,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };
    mockDb.offers = [newOffer, ...mockDb.offers];
    return newOffer;
  },

  acceptOffer: async (requestId: string, offerId: string) => {
    await delay(600);
    
    // Update request
    const reqIndex = mockDb.requests.findIndex(r => r.id === requestId);
    if (reqIndex > -1) {
      mockDb.requests[reqIndex] = { ...mockDb.requests[reqIndex], status: "accepted" };
    }

    // Update offers
    mockDb.offers = mockDb.offers.map(o => {
      if (o.requestId === requestId) {
        if (o.id === offerId) return { ...o, status: "accepted" };
        return { ...o, status: "rejected" };
      }
      return o;
    });

    return true;
  },

  getDashboardMetrics: async () => {
    await delay(300);
    let activeRequests = 0;
    let totalOffers = 0;
    let completedJobs = 0;
    let avgPrice = 0;

    if (mockDb.currentUser.role === "customer") {
      const myReqs = mockDb.requests.filter(r => r.customerId === mockDb.currentUser.id);
      activeRequests = myReqs.filter(r => r.status === "open").length;
      completedJobs = myReqs.filter(r => r.status === "completed").length;
      
      const myReqIds = myReqs.map(r => r.id);
      const incomingOffers = mockDb.offers.filter(o => myReqIds.includes(o.requestId));
      totalOffers = incomingOffers.length;
      avgPrice = incomingOffers.length ? incomingOffers.reduce((sum, o) => sum + o.price, 0) / incomingOffers.length : 0;
    } else {
      activeRequests = mockDb.requests.filter(r => r.status === "open").length;
      const myOffers = mockDb.offers.filter(o => o.providerId === mockDb.currentUser.id);
      totalOffers = myOffers.length;
      completedJobs = myOffers.filter(o => o.status === "accepted").length; // Approximation for completed for provider
      avgPrice = myOffers.length ? myOffers.reduce((sum, o) => sum + o.price, 0) / myOffers.length : 0;
    }

    return { activeRequests, totalOffers, completedJobs, avgPrice };
  }
};
