export interface LogEntry {
  id: string
  user: string
  action: string
  target: string
  timestamp: string
  status: "success" | "warning" | "error"
  details?: string
}