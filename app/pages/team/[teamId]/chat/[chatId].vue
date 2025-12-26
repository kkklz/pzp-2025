<template>
  <TeamPage>
    <v-card
      height="80vh"
      class="d-flex flex-column"
      :loading="loading"
    >
      <!-- Chat Header -->
      <v-card-title class="text-white px-8 py-4">
        <v-icon class="me-2">
          mdi-chat
        </v-icon>
        {{ chat?.name || 'Chat' }}
        <v-spacer />

        <v-chip
          size="small"
          color="success"
          variant="outlined"
        >
          <v-icon start>
            mdi-circle
          </v-icon>
          Online
        </v-chip>
      </v-card-title>

      <v-divider />
      <!-- Messages Area -->
      <v-card-text class="flex-grow-1 overflow-hidden">
        <div
          ref="messagesContainer"
          class="px-8 flex flex-col gap-4 h-full overflow-y-auto"
        >
          <div
            v-for="m in messages"
            :key="m.id"
            class="mb-1 flex gap-3 items-end"
            :class="[
              m.user_id === user?.id
                ? 'flex-row-reverse justify-start'
                : '',
            ]"
          >
            <v-avatar
              size="36"
              class="shrink-0 shadow"
            >
              <v-img
                :src="users.find((u) => u.id === m.user_id)?.photoUrl || '/default-avatar.webp'"
                alt="avatar"
              />
            </v-avatar>

            <div
              class="flex flex-col gap-1"
              :class="[
                m.user_id === user?.id
                  ? 'items-end'
                  : 'items-start',
              ]"
            >
              <div
                class="text-xs text-[#a0aec0] mb-0.5 flex gap-2 items-center"
                :class="[
                  m.user_id === user?.id
                    ? 'justify-end'
                    : 'justify-start',
                ]"
              >
                <span class="text-[#e2e8f0] font-semibold">
                  {{ users.find((u) => u.id === m.user_id)?.name || 'Unknown' }}
                </span>

                <span class="text-[#718096] opacity-70">
                  {{ formatTime(new Date(m.created_at
                    ? m.created_at
                    : Date.now())) }}
                </span>
              </div>

              <div
                class="leading-relaxed px-3 py-2 rounded-2xl max-w-[900px] break-words"
                :class="[
                  m.user_id === user?.id
                    ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-rb-1'
                    : 'bg-surface-light rounded-lb-1',
                ]"
              >
                {{ m.message }}
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div
            v-if="messages.length === 0"
            class="text-center flex flex-col h-50 items-center justify-center"
          >
            <v-icon
              size="48"
            >
              mdi-chat-outline
            </v-icon>

            <p class="mt-2">
              No messages yet. Start the conversation!
            </p>
          </div>
        </div>
      </v-card-text>

      <v-divider />
      <!-- Message Input -->
      <v-card-actions class="pa-3">
        <v-text-field
          v-model="message"
          placeholder="Type a message..."
          variant="plain"
          density="comfortable"
          hide-details
          :disabled="!user"
          class="px-8 py-0"
          autocomplete="off"
          @keydown.enter="sendMessage"
        >
          <template
            #append-inner
          >
            <div>
              <v-btn
                icon="mdi-send"
                size="small"
                :disabled="!message.trim() || !user"
                @click="sendMessage"
              />
            </div>
          </template>
        </v-text-field>
      </v-card-actions>
    </v-card>
  </TeamPage>
</template>

<script setup lang="tsx">
import type { Message } from '~/types/chat'

const chatStore = useChatStore()
const { messages, chat } = storeToRefs(chatStore)

const route = useRoute()
const chatId = route.params.chatId as string
const teamId = route.params.teamId as string

const message = ref<string>('')
const messagesContainer = ref<HTMLElement>()

const supabase = useSupabaseClient()

const loading = ref(true)

const myChannel = supabase.channel(chatId, {
  config: {
    broadcast: {
      self: false,
    },
  },
})

const userStore = useUserStore()
const { user, users } = storeToRefs(userStore)

const teamStore = useTeamStore()
const { teamMembers } = storeToRefs(teamStore)

// Format time for display
function formatTime(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

// Scroll to bottom when new message arrives
function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

async function sendMessage() {
  if (!message.value.trim() || !user.value)
    return

  const userId = user.value.id

  try {
    // First, add to database and local store
    const addedMessage = await chatStore.addMessage({
      chat_id: chatId,
      user_id: userId,
      message: message.value.trim(),
      created_at: new Date().toISOString(),
    })

    // Then broadcast to others
    myChannel.send({
      type: 'broadcast',
      event: 'shout',
      payload: {
        id: addedMessage.id,
        chat_id: chatId,
        user_id: userId,
        message: message.value.trim(),
        created_at: new Date().toISOString(),
      },
    })

    message.value = ''
    scrollToBottom()
  }
  catch (error) {
    console.error('Failed to send message:', error)
  }
}

function messageReceived(payload: Message) {
  // Check if message already exists to avoid duplicates
  if (!messages.value.some(m => m.id === payload.id)) {
    messages.value.push(payload)
    scrollToBottom()
  }
}

onMounted(async () => {
  loading.value = true
  messages.value = []
  await teamStore.fetchTeamMembers(teamId)
  const userIds = teamMembers.value.map(m => m.user_id)
  await userStore.fetchUsersByIds(userIds)
  await chatStore.fetchChatWithMessages(chatId)
  scrollToBottom()

  myChannel
    .on(
      'broadcast',
      { event: 'shout' },
      (payload: { payload: Message }) => {
        messageReceived(payload.payload)
      },
    )
    .subscribe()

  loading.value = false
})

onUnmounted(() => {
  myChannel.unsubscribe()
})
</script>
