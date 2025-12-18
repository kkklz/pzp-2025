import type { QueryError } from '@supabase/supabase-js'
import type { Chat, Message } from '~/types/chat'

export const useChatStore = defineStore('chat', () => {
  const chat = ref<Chat | null>(null)
  const chats = ref<Chat[]>([])
  const messages = ref<Message[]>([])
  const error = ref<QueryError | null>(null)
  const loading = ref(false)

  const supabase = useSupabaseClient()

  const CHATS = 'team_chats'
  const MESSAGES = 'messages'

  async function addChat(chatData: Omit<Chat, 'id' | 'created_at'>) {
    error.value = null
    loading.value = true
    const { data, error: err } = await supabase.from(CHATS).insert({
      ...chatData,
    }).select().single()

    if (err) {
      error.value = err
    }
    else {
      chat.value = data
    }

    loading.value = false
  }

  async function fetchTeamChats(teamId: string) {
    error.value = null
    loading.value = true
    const { data, error: err } = await supabase.from(CHATS).select().eq('team_id', teamId)

    if (err) {
      error.value = err
    }
    else {
      chats.value = data
    }
    loading.value = false
  }

  async function fetchChatWithMessages(chatId: string) {
    error.value = null
    loading.value = true
    const { data, error: err } = await supabase
      .from(CHATS)
      .select(`
        id,
        name,
        team_id,
        created_at,
        messages (
          id,
          message,
          user_id,
          date,
          created_at,
          chat_id
        )
      `)
      .eq('id', chatId)
      .single()

    if (err) {
      error.value = err
      loading.value = false

      return
    }

    chat.value = {
      id: data.id,
      name: data.name,
      team_id: data.team_id,
      created_at: data.created_at,
    }

    messages.value = data.messages?.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) || []

    loading.value = false
  }

  async function updateChat(chatId: string, name: string) {
    error.value = null
    loading.value = true
    const { data, error: err } = await supabase.from(CHATS).update({
      name,
    }).eq('id', chatId).select().single()

    if (err) {
      error.value = err
    }
    else {
      chat.value = data
    }
    loading.value = false
  }

  async function deleteChat(chatId: string) {
    error.value = null
    loading.value = true
    const { error: err } = await supabase.from(CHATS).delete().eq('id', chatId)

    if (err) {
      error.value = err
    }
    loading.value = false
  }

  async function addMessage(messageData: Omit<Message, 'id'>) {
    error.value = null
    loading.value = true
    const { data, error: err } = await supabase.from(MESSAGES).insert({
      ...messageData,
    }).select().single()

    if (err) {
      error.value = err
    }
    else {
      messages.value.push(data)
    }
    loading.value = false
  }

  return {
    chat,
    chats,
    messages,
    addChat,
    fetchTeamChats,
    fetchChatWithMessages,
    updateChat,
    deleteChat,
    addMessage,
  }
})
