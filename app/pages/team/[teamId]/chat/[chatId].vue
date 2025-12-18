<template>
  <TeamPage>
    <v-card
      width="800"
      height="80vh"
      class="d-flex flex-column chat-container mx-auto"
    >
      <!-- Chat Header -->
      <v-card-title class="chat-header">
        <v-icon class="me-2">
          mdi-chat
        </v-icon>
        Team Chat
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

      <!-- Messages Area -->
      <v-card-text class="chat-messages pa-0 flex-grow-1">
        <div
          ref="messagesContainer"
          class="messages-container"
        >
          <div
            v-for="m in messages"
            :key="m.id"
            class="message-wrapper"
            :class="[
              m.userId === user?.id
                ? 'message-own'
                : 'message-other',
            ]"
          >
            <v-avatar
              size="36"
              class="message-avatar"
            >
              <v-img
                :src="users.find((u) => u.id === m.userId)?.photoUrl || '/default-avatar.webp'"
                alt="avatar"
              />
            </v-avatar>

            <div class="message-content">
              <div class="message-header">
                <span class="message-author">
                  {{ users.find((u) => u.id === m.userId)?.name || 'Unknown' }}
                </span>

                <span class="message-time">
                  {{ formatTime(m.date) }}
                </span>
              </div>

              <div class="message-text">
                {{ m.message }}
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div
            v-if="messages.length === 0"
            class="empty-state"
          >
            <v-icon
              size="48"
              color="grey-lighten-1"
            >
              mdi-chat-outline
            </v-icon>

            <p class="text-grey-lighten-1 mt-2">
              No messages yet. Start the conversation!
            </p>
          </div>
        </div>
      </v-card-text>

      <!-- Message Input -->
      <v-card-actions class="chat-input pa-3">
        <v-text-field
          v-model="message"
          placeholder="Type a message..."
          variant="outlined"
          density="comfortable"
          hide-details
          :disabled="!user"
          @keydown.enter="sendMessage"
        >
          <template #append-inner>
            <v-btn
              icon="mdi-send"
              size="small"
              variant="text"
              :disabled="!message.trim() || !user"
              @click="sendMessage"
            />
          </template>
        </v-text-field>
      </v-card-actions>
    </v-card>
  </TeamPage>
</template>

<script setup lang="tsx">
import { uuid } from '@supabase/supabase-js/dist/module/lib/helpers.js'

interface Message {
  id: string
  date: Date
  userId: string
  message: string
}

const route = useRoute()
const chatId = route.params.chatId as string

const message = ref<string>('')
const messages = ref<Message[]>([])
const messagesContainer = ref<HTMLElement>()

const supabase = useSupabaseClient()
const myChannel = supabase.channel(chatId, {
  config: {
    broadcast: {
      self: true,
    },
  },
})

const userStore = useUserStore()
const { user, users } = storeToRefs(userStore)

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

function sendMessage() {
  if (!message.value.trim() || !user.value)
    return

  myChannel.send({
    type: 'broadcast',
    event: 'shout',
    payload: {
      id: uuid(),
      date: new Date(),
      userId: user.value.id,
      message: message.value.trim(),
    },
  })
    .then(() => {
      message.value = ''
      scrollToBottom()
    })
    .catch((error) => {
      console.error('Failed to send message:', error)
    })
}

function messageReceived(payload: Message) {
  messages.value.push(payload)
  scrollToBottom()
}

onMounted(() => {
  myChannel
    .on(
      'broadcast',
      { event: 'shout' },
      (payload) => {
        messageReceived(payload.payload)
      },
    )
    .subscribe()

  userStore.fetchUsers()
})
</script>

<style scoped>
.chat-container {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  background: #1a1a1a;
  border: 1px solid #333;
}

.chat-header {
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  color: white;
  padding: 16px;
  border-bottom: 1px solid #4a5568;
}

.chat-messages {
  max-height: calc(100vh - 140px);
  overflow-y: auto;
  background: #1a1a1a;
}

.messages-container {
  padding: 16px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 4px;
}

.message-own {
  flex-direction: row-reverse;
  justify-content: flex-start;
}

.message-own .message-content {
  align-items: flex-end;
}

.message-content {
  display: flex;
  flex-direction: column;
  max-width: 70%;
  gap: 4px;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: #a0aec0;
  margin-bottom: 2px;
}

.message-own .message-header {
  justify-content: flex-end;
}

.message-author {
  font-weight: 600;
  color: #e2e8f0;
}

.message-time {
  opacity: 0.7;
  color: #718096;
}

.message-text {
  background: #2d3748;
  color: #e2e8f0;
  padding: 10px 14px;
  border-radius: 18px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  word-wrap: break-word;
  line-height: 1.4;
  border: 1px solid #4a5568;
}

.message-own .message-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.message-avatar {
  flex-shrink: 0;
  border: 2px solid #4a5568;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #718096;
  text-align: center;
}

.chat-input {
  border-top: 1px solid #4a5568;
  background: #2d3748;
  padding: 16px;
}

/* Scrollbar styling */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: #2d3748;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #4a5568;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #718096;
}

/* Responsive */
@media (max-width: 850px) {
  .chat-container {
    width: 100% !important;
    height: 100vh !important;
    margin: 0 !important;
    border-radius: 0 !important;
  }
}
</style>
