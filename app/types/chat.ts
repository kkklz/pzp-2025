export interface Chat {
  id: string
  name: string
  team_id: string
  created_at: string
}

export interface Message {
  id: string
  date: string
  user_id: string
  message: string
  chat_id: string
  created_at: string
}
