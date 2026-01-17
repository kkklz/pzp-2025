export interface Board {
  id: string
  team_id: string
  name: string
  created_at: string
}

export interface Task {
  id: string
  board_id: string
  title: string
  description: string
  status: string
  due_date: string
  created_by: string
  created_at: string
}

export interface TaskAssignee {
  id: string
  task_id: string
  user_id: string
  created_at: string
}
