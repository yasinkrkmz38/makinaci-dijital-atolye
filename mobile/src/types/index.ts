export type CompanyRole =
  | "owner"
  | "manager"
  | "maintenance_manager"
  | "technician"
  | "operator"
  | "warehouse_manager"
  | "viewer";

export interface Company {
  id: number;
  name: string;
  code: string;
  role: CompanyRole;
}
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  platform_admin: boolean;
  email_verified: boolean;
  mfa_enabled: boolean;
  company?: Company;
  company_role?: CompanyRole;
}
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: "Bearer";
  expires_in: number;
  refresh_expires_in: number;
}
export interface AuthResponse extends Partial<AuthTokens> {
  user?: User;
  mfa_required?: boolean;
  mfa_ticket?: string;
  message?: string;
  verification_required?: boolean;
}
export interface ApiErrorPayload {
  error?: string;
  code?: string;
  message?: string;
}
export interface PageResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}
export interface DashboardData {
  company: Company;
  machines: number;
  maintenance: number;
  faults: number;
  overdue: number;
  due30: number;
  doneMonth: number;
  critical: number;
  lowStock: number;
  costMonth: number;
  openWorkOrders: number;
  avgHealth: number;
  recentMaintenance: Maintenance[];
  recentFaults: Fault[];
}
export interface Machine {
  id: number;
  name: string;
  manufacturer?: string;
  model?: string;
  serial_no?: string;
  internal_code?: string;
  location?: string;
  department?: string;
  status?: string;
  criticality?: string;
  hours?: number;
  health_score?: number;
  open_faults?: number;
  overdue_maintenance?: number;
  next_maintenance_date?: string;
}
export interface WorkOrder {
  id: number;
  work_order_no?: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  machine_name?: string;
  assigned_user_name?: string;
  assigned_member_name?: string;
  assigned_user_id?: number;
  due_date?: string;
  actual_duration_min?: number;
}
export interface Fault {
  id: number;
  title?: string;
  symptom?: string;
  description?: string;
  status: string;
  severity?: string;
  machine_name?: string;
  assigned_user_name?: string;
  assigned_user_id?: number;
  root_cause?: string;
  action_taken?: string;
  resolution?: string;
  downtime_min?: number;
  created_at?: string;
}
export interface Maintenance {
  id: number;
  task: string;
  status: string;
  priority?: string;
  machine_name?: string;
  due_date?: string;
  technician_name?: string;
  technician_member_name?: string;
  recurrence_type?: string;
}
export interface Part {
  id: number;
  name: string;
  part_code?: string;
  quantity: number;
  min_quantity: number;
  unit?: string;
  location?: string;
}
export interface NotificationItem {
  id: number;
  type: string;
  level: string;
  title: string;
  body: string;
  target: string;
  read_at?: string;
  created_at: string;
}
export interface QueueItem {
  id: string;
  method: "POST" | "PATCH";
  path: string;
  body: Record<string, unknown>;
  kind: "fault" | "maintenance" | "work-order";
  createdAt: string;
  attempts: number;
  lastError?: string;
  attachments?: Array<{
    id: string;
    uri: string;
    name: string;
    mimeType: string;
  }>;
}
