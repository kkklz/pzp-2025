import type { QueryError } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'
import type { Team, TeamMember } from '~/types/team'
import { defineStore } from 'pinia'

export const useTeamStore = defineStore('team', () => {
  const team = ref<Team | null>(null)
  const teams = ref<Team[]>([])
  const teamMembers = ref<TeamMember[]>([])
  const loading = ref(false)
  const error = ref<QueryError | null>(null)

  const supabase = useSupabaseClient<Database>()
  const TEAM = 'teams'
  const TEAM_MEMBERS = 'team_members'

  function clearStore() {
    team.value = null
    teams.value = []
    teamMembers.value = []
    loading.value = false
    error.value = null
  }

  async function addTeam(teamData: Omit<Team, 'id' | 'created_at'>) {
    error.value = null
    loading.value = true
    const { data, error: err } = await supabase.from(TEAM).insert({
      ...teamData,
    }).select().single()

    if (err) {
      error.value = err
      loading.value = false

      return
    }

    team.value = data
    loading.value = false
  }

  async function updateTeam(teamId: string, teamData: Partial<Omit<Team, 'id'>>) {
    error.value = null
    loading.value = true
    const { data, error: err } = await supabase
      .from(TEAM)
      .update({
        ...teamData,
      })
      .eq('id', teamId)
      .select()
      .single()

    if (err) {
      error.value = err
      loading.value = false

      return
    }

    team.value = data
    loading.value = false
  }

  async function fetchTeam(teamId: string) {
    error.value = null
    loading.value = true
    teamMembers.value = []
    const { data, error: err } = await supabase.from(TEAM).select().eq('id', teamId).single()

    if (err) {
      error.value = err
      loading.value = false

      return
    }

    team.value = data
    loading.value = false
  }

  async function deleteTeam(teamId: string) {
    error.value = null
    loading.value = true
    const { error: err } = await supabase.from(TEAM).delete().eq('id', teamId)

    if (err)
      error.value = err

    loading.value = false
  }

  async function fetchUserTeams(userId: string) {
    error.value = null
    loading.value = true
    const { data, error: err } = await supabase
      .from(TEAM_MEMBERS)
      .select(`
        team_id,
        teams!inner(
          id,
          name,
          created_by,
          created_at
        )
      `)
      .eq('user_id', userId)

    if (err) {
      error.value = err
      loading.value = false

      return
    }

    teams.value = data?.map(member => member.teams) || []
    loading.value = false
  }

  async function addTeamMembers(teamId: string, userIds: string[]) {
    error.value = null
    loading.value = true
    const inserts = userIds.map(user_id => ({ team_id: teamId, user_id }))
    const { data, error: err } = await supabase.from(TEAM_MEMBERS).insert(inserts).select()

    if (err) {
      error.value = err
      loading.value = false

      return
    }

    if (data) {
      teamMembers.value.push(...data)
    }
    loading.value = false
  }

  async function fetchTeamMembers(teamId: string) {
    error.value = null
    loading.value = true
    const { data, error: err } = await supabase.from(TEAM_MEMBERS).select().eq('team_id', teamId).order('created_at', { ascending: false })

    if (err) {
      error.value = err
      loading.value = false

      return
    }
    teamMembers.value = data
    loading.value = false
  }

  async function removeTeamMembers(teamId: string, userIds: string[]) {
    error.value = null
    loading.value = true
    const { error: err } = await supabase
      .from(TEAM_MEMBERS)
      .delete()
      .eq('team_id', teamId)
      .in('user_id', userIds)

    if (err) {
      error.value = err
    }
    else {
      teamMembers.value = teamMembers.value.filter(member => !userIds.includes(member.user_id))
    }
    loading.value = false
  }

  return {
    team,
    teams,
    teamMembers,
    error,
    loading,
    addTeam,
    updateTeam,
    fetchTeam,
    deleteTeam,
    fetchUserTeams,
    addTeamMembers,
    fetchTeamMembers,
    removeTeamMembers,
    clearStore,
  }
})
