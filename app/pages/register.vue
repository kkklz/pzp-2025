<template>
  <v-card
    max-width="600px"
    min-width="420px"
    class="mx-auto mt-24 pa-8"
  >
    <v-card-title>Register</v-card-title>

    <v-card-text>
      <v-form
        v-model="isFormValid"
        validate-on="lazy"
        class="flex flex-col gap-3"
        @submit.prevent="handleRegister"
      >
        <v-alert
          v-if="error"
          type="error"
        >
          Error
        </v-alert>

        <v-text-field
          v-model="name"
          label="Name"
          variant="underlined"
          type="text"
          :rules="nameRules"
          required
          density="comfortable"
        />

        <v-text-field
          v-model="email"
          label="E-mail"
          placeholder="john.doe@gmail.com"
          variant="underlined"
          type="email"
          :rules="emailRules"
          required
        />

        <v-text-field
          v-model="password"
          label="Password"
          :type="showPassword
            ? 'text'
            : 'password'"
          variant="underlined"
          :rules="passwordRules"
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

        <v-text-field
          v-model="confirmPassword"
          label="Confirm Password"
          :type="showConfirmPassword
            ? 'text'
            : 'password'"
          variant="underlined"
          required
          :rules="confirmPasswordRules"
        >
          <template #append>
            <v-icon
              :icon="showConfirmPassword
                ? 'mdi-eye'
                : 'mdi-eye-off'"
              @click="showConfirmPassword = !showConfirmPassword"
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
          Register
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useValidationRules } from '~/utils/validationRules'

const authStore = useAuthStore()
const { error } = storeToRefs(authStore)

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isFormValid = ref<boolean | null>(null)

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const { emailRules, passwordRules, nameRules } = useValidationRules()

const confirmPasswordRules = [(value: string) => {
  if (value !== password.value) {
    return 'Passwords do not match.'
  }

  return true
}]

async function handleRegister() {
  await authStore.register(email.value, password.value, { name: name.value, email: email.value, photoUrl: null })
  if (!error.value)
    navigateTo('/')
}
</script>
