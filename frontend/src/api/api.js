import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Categories
export const getCategories = async () => {
  const response = await axios.get(`${API}/categories`);
  return response.data;
};

// Services
export const getServices = async (category = null) => {
  const url = category ? `${API}/services/category/${category}` : `${API}/services`;
  const response = await axios.get(url);
  return response.data;
};

// Technicians
export const getTechnicians = async (serviceId = null, sortBy = null) => {
  const params = {};
  if (serviceId) params.service_id = serviceId;
  if (sortBy) params.sort_by = sortBy;
  
  const response = await axios.get(`${API}/technicians`, { params });
  return response.data;
};

export const getTechnician = async (technicianId) => {
  const response = await axios.get(`${API}/technicians/${technicianId}`);
  return response.data;
};

// Orders
export const createOrder = async (orderData) => {
  const response = await axios.post(`${API}/orders`, orderData);
  return response.data;
};

export const getOrders = async (status = null) => {
  const params = status ? { status } : {};
  const response = await axios.get(`${API}/orders`, { params });
  return response.data;
};

export const getOrder = async (orderId) => {
  const response = await axios.get(`${API}/orders/${orderId}`);
  return response.data;
};

export const updateOrderStatus = async (orderId, status, timelineEvent = null) => {
  const response = await axios.put(`${API}/orders/${orderId}/status`, {
    status,
    timeline_event: timelineEvent
  });
  return response.data;
};

// Reviews
export const createReview = async (reviewData) => {
  const response = await axios.post(`${API}/reviews`, reviewData);
  return response.data;
};

export const getTechnicianReviews = async (technicianId) => {
  const response = await axios.get(`${API}/technicians/${technicianId}/reviews`);
  return response.data;
};

// Chat
export const getConversations = async () => {
  const response = await axios.get(`${API}/conversations`);
  return response.data;
};

export const getConversation = async (id) => {
  const response = await axios.get(`${API}/conversations/${id}`);
  return response.data;
};

export const startConversation = async (technicianId, initialMessage = null) => {
  const response = await axios.post(`${API}/conversations`, {
    technician_id: technicianId,
    initial_message: initialMessage
  });
  return response.data;
};

export const getMessages = async (conversationId) => {
  const response = await axios.get(`${API}/conversations/${conversationId}/messages`);
  return response.data;
};

export const sendMessage = async (conversationId, text, sender = 'user') => {
  const response = await axios.post(`${API}/conversations/${conversationId}/messages`, {
    text,
    sender
  });
  return response.data;
};

// Activities
export const getActivities = async () => {
  const response = await axios.get(`${API}/activities`);
  return response.data;
};

// Bantuin (Custom Help Request)
export const createBantuin = async (data) => {
  const response = await axios.post(`${API}/bantuin`, data);
  return response.data;
};

export const getBantuinRequests = async (status = null) => {
  const params = status ? { status } : {};
  const response = await axios.get(`${API}/bantuin`, { params });
  return response.data;
};

export const getBantuinRequest = async (id) => {
  const response = await axios.get(`${API}/bantuin/${id}`);
  return response.data;
};

export const getBantuinOffers = async (id) => {
  const response = await axios.get(`${API}/bantuin/${id}/offers`);
  return response.data;
};

export const selectBantuinHelper = async (requestId, offerId) => {
  const response = await axios.put(`${API}/bantuin/${requestId}/select-helper`, { offer_id: offerId });
  return response.data;
};

export const updateBantuinStatus = async (requestId, status) => {
  const response = await axios.put(`${API}/bantuin/${requestId}/status`, { status });
  return response.data;
};

// War Tiket (Ticket War Request)
export const createWarTiket = async (data) => {
  const response = await axios.post(`${API}/bantuin/war-tiket`, data);
  return response.data;
};

export const getWarTiketRequests = async (status = null) => {
  const params = status ? { status } : {};
  const response = await axios.get(`${API}/bantuin/war-tiket`, { params });
  return response.data;
};

export const getWarTiketRequest = async (id) => {
  const response = await axios.get(`${API}/bantuin/war-tiket/${id}`);
  return response.data;
};
