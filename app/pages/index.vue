<template>
  <div
    v-if="user"
    class="mt-10 md:mx-8 sm:mx-1 lg:mx-48!"
  >
    <div class="mb-10 p-6 rounded-md shadow-xl from-blue-600 to-pink-500 via-purple-600 bg-gradient-to-r">
      <div class="flex gap-4 items-center">
        <div>
          <h1 class="text-4xl text-white tracking-wide font-light">
            Welcome to <span class="font-black">TASK HUB</span>,
          </h1>

          <p class="text-4xl tracking-wider font-extrabold mt-2">
            {{ user.name }}
          </p>

          <p class="text-sm text-white/70 mt-2">
            Ready to conquer your tasks today?
          </p>
        </div>
      </div>
    </div>

    <v-card class="pa-6">
      <div class="mb-6 flex items-center justify-between">
        <div class="flex gap-3 items-center">
          <v-icon
            icon="mdi-account-group"
            size="28"
            class="text-purple-400"
          />

          <h2 class="text-2xl font-bold">
            Your Teams
          </h2>
        </div>

        <v-btn
          variant="flat"
          color="primary"
          to="/newteam"
          prepend-icon="mdi-plus"
        >
          New Team
        </v-btn>
      </div>

      <v-divider class="mb-6" />

      <div
        v-if="teamsLoading"
        class="flex flex-wrap gap-4"
      >
        <v-skeleton-loader
          v-for="i in 3"
          :key="i"
          type="avatar, text"
          width="120"
        />
      </div>

      <div
        v-else-if="teams && teams.length > 0"
        class="gap-4 grid grid-cols-1 lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-4"
      >
        <NuxtLink
          v-for="team in teams"
          :key="team.id"
          class="bg-surface-light p-4 rounded-md flex flex-col gap-3 cursor-pointer transition-all ease-in items-center hover-opacity-80 hover:shadow-lg"
          :to="`/team/${team.id}`"
        >
          <TeamIcon
            :team="team"
            :size="56"
          />

          <span class="text-sm font-medium text-center w-full truncate">
            {{ team.name }}
          </span>
        </NuxtLink>
      </div>

      <div
        v-else
        class="py-12 text-center"
      >
        <v-icon
          icon="mdi-account-group-outline"
          size="64"
          class="text-gray-500 mb-4"
        />

        <p class="text-lg text-gray-400 mb-2">
          No teams yet
        </p>

        <p class="text-sm text-gray-500">
          Create your first team to get started!
        </p>
      </div>
    </v-card>
  </div>

  <!-- Landing Page for unauthenticated users -->
  <div
    v-else
    class="from-background via-surface to-background min-h-screen bg-gradient-to-b"
  >
    <!-- Hero Section -->
    <section class="mx-auto px-4 py-20 max-w-7xl lg:px-8 md:py-32 sm:px-6">
      <div class="gap-12 grid grid-cols-1 items-center md:grid-cols-2">
        <div class="space-y-8">
          <div class="space-y-4">
            <div class="inline-block">
              <span class="bg-primary/10 text-primary border-primary/20 text-sm font-semibold px-4 py-2 border rounded-full">
                ✨ Organize Better
              </span>
            </div>

            <h1 class="text-5xl tracking-tight font-bold md:text-6xl">
              Manage Your Tasks
              <span class="from-primary via-accent to-secondary text-transparent bg-gradient-to-r bg-clip-text">
                Effortlessly
              </span>
            </h1>

            <p class="text-on-surface-variant text-xl leading-relaxed">
              Stop juggling tasks across multiple platforms. TaskHub brings your team, chats, and tasks into one beautiful, intuitive workspace.
            </p>
          </div>

          <div class="flex flex-col gap-4 sm:flex-row">
            <v-btn
              to="/register"
              size="large"
              variant="flat"
              color="primary"
              class="px-8"
            >
              <template #prepend>
                <v-icon icon="mdi-rocket" />
              </template>
              Start Free Today
            </v-btn>

            <v-btn
              size="large"
              variant="outlined"
              class="px-8"
            >
              <template #prepend>
                <v-icon icon="mdi-play-circle-outline" />
              </template>
              Watch Demo
            </v-btn>
          </div>

          <div class="border-surface-variant pt-8 border-t flex gap-8 items-center">
            <div>
              <p class="text-primary text-2xl font-bold">
                10k+
              </p>

              <p class="text-on-surface-variant text-sm">
                Active Users
              </p>
            </div>

            <div>
              <p class="text-accent text-2xl font-bold">
                500+
              </p>

              <p class="text-on-surface-variant text-sm">
                Teams
              </p>
            </div>

            <div>
              <p class="text-secondary text-2xl font-bold">
                99.9%
              </p>

              <p class="text-on-surface-variant text-sm">
                Uptime
              </p>
            </div>
          </div>
        </div>

        <!-- Hero Illustration -->
        <div class="hidden relative md:block">
          <div class="from-primary/20 to-accent/20 rounded-2xl inset-0 absolute bg-gradient-to-r blur-3xl" />

          <div class="bg-surface-light border-surface-variant p-8 border rounded-2xl relative">
            <div class="space-y-4">
              <div class="flex gap-3 items-center">
                <div class="bg-primary/20 rounded-lg flex h-12 w-12 items-center justify-center">
                  <v-icon
                    icon="mdi-check-circle"
                    class="text-primary"
                    size="24"
                  />
                </div>

                <div>
                  <p class="font-semibold">
                    Task Management
                  </p>

                  <p class="text-on-surface-variant text-sm">
                    Organize all your tasks
                  </p>
                </div>
              </div>

              <div class="flex gap-3 items-center">
                <div class="bg-accent/20 rounded-lg flex h-12 w-12 items-center justify-center">
                  <v-icon
                    icon="mdi-chat"
                    class="text-accent"
                    size="24"
                  />
                </div>

                <div>
                  <p class="font-semibold">
                    Team Chat
                  </p>

                  <p class="text-on-surface-variant text-sm">
                    Communicate instantly
                  </p>
                </div>
              </div>

              <div class="flex gap-3 items-center">
                <div class="bg-secondary/20 rounded-lg flex h-12 w-12 items-center justify-center">
                  <v-icon
                    icon="mdi-account-group"
                    class="text-secondary"
                    size="24"
                  />
                </div>

                <div>
                  <p class="font-semibold">
                    Collaboration
                  </p>

                  <p class="text-on-surface-variant text-sm">
                    Work together seamlessly
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="mx-auto px-4 py-20 max-w-7xl lg:px-8 sm:px-6">
      <div class="mb-16 text-center">
        <h2 class="text-4xl font-bold mb-4 md:text-5xl">
          Three Powerful Features
        </h2>

        <p class="text-on-surface-variant text-xl mx-auto max-w-2xl">
          Everything your team needs to stay organized, connected, and productive
        </p>
      </div>

      <div class="gap-8 grid grid-cols-1 md:grid-cols-3">
        <!-- Feature 1: Real-time Chats -->
        <div class="bg-surface-light border-surface-variant hover:border-primary/50 hover:shadow-primary/10 group p-8 border rounded-xl transition-all hover:shadow-lg">
          <div class="bg-primary/20 group-hover:bg-primary/30 mb-4 rounded-lg flex h-12 w-12 transition-colors items-center justify-center">
            <v-icon
              icon="mdi-chat-processing-outline"
              class="text-primary"
              size="28"
            />
          </div>

          <h3 class="text-xl font-bold mb-3">
            Real-Time Team Chats
          </h3>

          <p class="text-on-surface-variant mb-4">
            Instant communication with your team. Create dedicated chat channels for different topics and stay connected in real-time.
          </p>

          <ul class="text-sm space-y-2">
            <li class="flex gap-2 items-center">
              <v-icon
                icon="mdi-check"
                size="16"
                class="text-success"
              />

              <span>Live messaging</span>
            </li>

            <li class="flex gap-2 items-center">
              <v-icon
                icon="mdi-check"
                size="16"
                class="text-success"
              />

              <span>Organized channels</span>
            </li>

            <li class="flex gap-2 items-center">
              <v-icon
                icon="mdi-check"
                size="16"
                class="text-success"
              />

              <span>Message history</span>
            </li>
          </ul>
        </div>

        <!-- Feature 2: Task Management -->
        <div class="bg-surface-light border-surface-variant hover:border-accent/50 hover:shadow-accent/10 group p-8 border rounded-xl transition-all hover:shadow-lg">
          <div class="bg-accent/20 group-hover:bg-accent/30 mb-4 rounded-lg flex h-12 w-12 transition-colors items-center justify-center">
            <v-icon
              icon="mdi-clipboard-check-multiple-outline"
              class="text-accent"
              size="28"
            />
          </div>

          <h3 class="text-xl font-bold mb-3">
            Smart Task Management
          </h3>

          <p class="text-on-surface-variant mb-4">
            Create boards, assign tasks to team members, set custom statuses, and track deadlines. Full control over your workflow.
          </p>

          <ul class="text-sm space-y-2">
            <li class="flex gap-2 items-center">
              <v-icon
                icon="mdi-check"
                size="16"
                class="text-success"
              />

              <span>Task boards & columns</span>
            </li>

            <li class="flex gap-2 items-center">
              <v-icon
                icon="mdi-check"
                size="16"
                class="text-success"
              />

              <span>User assignments</span>
            </li>

            <li class="flex gap-2 items-center">
              <v-icon
                icon="mdi-check"
                size="16"
                class="text-success"
              />

              <span>Status tracking & due dates</span>
            </li>
          </ul>
        </div>

        <!-- Feature 3: Team Notes -->
        <div class="bg-surface-light border-surface-variant hover:border-secondary/50 hover:shadow-secondary/10 group p-8 border rounded-xl transition-all hover:shadow-lg">
          <div class="bg-secondary/20 group-hover:bg-secondary/30 mb-4 rounded-lg flex h-12 w-12 transition-colors items-center justify-center">
            <v-icon
              icon="mdi-note-multiple-outline"
              class="text-secondary"
              size="28"
            />
          </div>

          <h3 class="text-xl font-bold mb-3">
            Team Notes & Documentation
          </h3>

          <p class="text-on-surface-variant mb-4">
            Keep important information, documentation, and team knowledge in one shared space. Easy access for everyone.
          </p>

          <ul class="text-sm space-y-2">
            <li class="flex gap-2 items-center">
              <v-icon
                icon="mdi-check"
                size="16"
                class="text-success"
              />

              <span>Shared notes</span>
            </li>

            <li class="flex gap-2 items-center">
              <v-icon
                icon="mdi-check"
                size="16"
                class="text-success"
              />

              <span>Team documentation</span>
            </li>

            <li class="flex gap-2 items-center">
              <v-icon
                icon="mdi-check"
                size="16"
                class="text-success"
              />

              <span>Easy searchability</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="mx-auto px-4 py-20 max-w-7xl lg:px-8 sm:px-6">
      <div class="from-primary/20 via-accent/20 to-secondary/20 border-surface-variant p-12 border rounded-2xl relative overflow-hidden bg-gradient-to-r md:p-20">
        <div class="from-primary/5 to-accent/5 opacity-50 inset-0 absolute bg-gradient-to-r" />

        <div class="text-center relative space-y-8">
          <h2 class="text-4xl font-bold md:text-5xl">
            Ready to Transform Your Workflow?
          </h2>

          <p class="text-on-surface-variant text-xl mx-auto max-w-2xl">
            Join thousands of teams already using TaskHub to manage their work more efficiently.
          </p>

          <v-btn
            to="/register"
            size="large"
            variant="flat"
            color="primary"
            class="px-12"
          >
            Get Started for Free
          </v-btn>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-surface-variant mt-20 py-12 border-t">
      <div class="mx-auto px-4 max-w-7xl lg:px-8 sm:px-6">
        <div class="mb-8 gap-8 grid grid-cols-1 md:grid-cols-4">
          <div>
            <div class="mb-4 flex gap-2 items-center">
              <v-icon
                icon="mdi-check-multiple"
                size="28"
                class="text-primary"
              />

              <span class="text-lg font-bold">TaskHub</span>
            </div>

            <p class="text-on-surface-variant text-sm">
              Simplify your team's workflow with powerful collaboration tools.
            </p>
          </div>

          <div>
            <h4 class="font-semibold mb-4">
              Product
            </h4>

            <ul class="text-on-surface-variant text-sm space-y-2">
              <li>
                <a
                  href="#"
                  class="hover:text-primary transition-colors"
                >Features</a>
              </li>

              <li>
                <a
                  href="#"
                  class="hover:text-primary transition-colors"
                >Pricing</a>
              </li>

              <li>
                <a
                  href="#"
                  class="hover:text-primary transition-colors"
                >Security</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 class="font-semibold mb-4">
              Company
            </h4>

            <ul class="text-on-surface-variant text-sm space-y-2">
              <li>
                <a
                  href="#"
                  class="hover:text-primary transition-colors"
                >About</a>
              </li>

              <li>
                <a
                  href="#"
                  class="hover:text-primary transition-colors"
                >Blog</a>
              </li>

              <li>
                <a
                  href="#"
                  class="hover:text-primary transition-colors"
                >Contact</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 class="font-semibold mb-4">
              Legal
            </h4>

            <ul class="text-on-surface-variant text-sm space-y-2">
              <li>
                <a
                  href="#"
                  class="hover:text-primary transition-colors"
                >Privacy</a>
              </li>

              <li>
                <a
                  href="#"
                  class="hover:text-primary transition-colors"
                >Terms</a>
              </li>

              <li>
                <a
                  href="#"
                  class="hover:text-primary transition-colors"
                >Cookies</a>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-surface-variant pt-8 border-t">
          <p class="text-on-surface-variant text-sm text-center">
            © 2025 TaskHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const teamStore = useTeamStore()

const { user } = storeToRefs(userStore)
const { teams, loading: teamsLoading } = storeToRefs(teamStore)

watch(user, async (newUser) => {
  if (newUser) {
    await teamStore.fetchUserTeams(newUser.id)
  }
}, { immediate: true })
</script>
