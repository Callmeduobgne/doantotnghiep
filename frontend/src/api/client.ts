import axios from 'axios'

const api = axios.create({ baseURL: '/' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Agent {
  id: string
  username: string
  fullName: string
  farmName: string
  location: string
  role: 'agent' | 'admin'
  createdAt: string
}

export interface TeaBatch {
  id: string
  batchId: string
  agentId: string
  farmName: string
  teaType: string
  weightGram: number
  status: 'growing' | 'processing' | 'packaged'
  batchHash: string
  txHash: string
  qrCode: string
  verifyUrl: string
  createdAt: string
  finalizedAt: string | null
}

export interface Event {
  id: string
  batchId: string
  stage: string
  description: string
  images: string[]
  location: string
  recordedBy: string
  eventHash: string
  txHash: string
  timestamp: string
  createdAt: string
}

export interface VerifyData {
  batch: TeaBatch
  agent: Agent
  events: Event[]
  blockchain: {
    batchHash: string
    txHash: string
    verifyUrl: string
  }
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  register: (data: {
    username: string
    password: string
    fullName: string
    farmName: string
    location: string
  }) => api.post('/api/auth/register', data),

  login: (data: { username: string; password: string }) =>
    api.post<{ token: string; agentId: string; username: string; farmName: string; role: string }>(
      '/api/auth/login',
      data
    ),

  me: () => api.get<Agent>('/api/auth/me'),
}

// ── Batches ───────────────────────────────────────────────────────────────────

export const batchApi = {
  list: () => api.get<TeaBatch[]>('/api/batches'),

  create: (data: { teaType: string; weightGram: number; farmName: string }) =>
    api.post<TeaBatch>('/api/batches', data),

  get: (id: string) =>
    api.get<{ batch: TeaBatch; events: Event[] }>(`/api/batches/${id}`),

  finalize: (id: string) =>
    api.post<{ message: string; batchHash: string; txHash: string; verifyUrl: string; qrCode: string }>(
      `/api/batches/${id}/finalize`
    ),
}

// ── Events ────────────────────────────────────────────────────────────────────

export const eventApi = {
  create: (batchId: string, form: FormData) =>
    api.post<Event>(`/api/batches/${batchId}/events`, form),
}

// ── Verify (public) ───────────────────────────────────────────────────────────

export const verifyApi = {
  get: (hash: string) => api.get<VerifyData>(`/verify/${hash}`),
}

// ── Admin ──────────────────────────────────────────────────────────────────────

export interface AdminBatch extends TeaBatch {
  agentName: string
  agentFarm: string
}

export const adminApi = {
  listUsers: () => api.get<Agent[]>('/api/admin/users'),
  deleteUser: (id: string) => api.delete(`/api/admin/users/${id}`),
  listBatches: () => api.get<AdminBatch[]>('/api/admin/batches'),
}
