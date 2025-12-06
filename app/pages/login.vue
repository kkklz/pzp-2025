<template>
  <v-card
    max-width="600px"
    min-width="420px"
    class="mx-auto mt-24 pa-8"
  >
    <v-card-title>Login</v-card-title>

    <v-card-text>
      <v-form
        v-model="isFormValid"
        validate-on="lazy"
        class="flex flex-col gap-3"
        @submit.prevent="handleLogin"
      >
        <v-alert
          v-if="error"
          type="error"
        >
          Error
        </v-alert>

        <v-text-field
          v-model="email"
          label="E-mail"
          placeholder="john.doe@gmail.com"
          variant="underlined"
          type="email"
          :rules="notEmpty"
          required
        />

        <v-text-field
          v-model="password"
          label="Password"
          :type="showPassword
            ? 'text'
            : 'password'"
          variant="underlined"
          :rules="notEmpty"
          required
        >
          <template #append>
            <v-icon
              :icon="showPassword
                ? 'mdi-eye'
                : 'mdi-eye-off'"
              @click="showPassword = !showPassword"
            />
          </template>
        </v-text-field>

        <v-btn
          size="large"
          variant="tonal"
          type="submit"
          class="block"
          :disabled="!isFormValid"
        >
          Login
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const { error } = storeToRefs(authStore)

const email = ref('')
const password = ref('')
const isFormValid = ref<boolean | null>(null)

const showPassword = ref(false)

const notEmpty = [(value: string) => {
  return value.length > 0 || 'This field is required.'
}]

async function handleLogin() {
  await authStore.login(email.value, password.value)
  if (!error.value)
    navigateTo('/')
}
</script>
