export interface Team {
  id: string
  name: string
  created_at: string | null
  created_by: string
}

export interface TeamMember {
  id: string
  team_id: string
  user_id: string
  created_at: string | null
}
