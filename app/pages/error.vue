<template>
  <div class="flex h-[80vh] items-center justify-center">
    <v-card
      max-width="500"
      class="pa-8 text-center"
    >
      <v-card-title class="text-h3 mb-4">
        404
      </v-card-title>

      <v-card-text>
        <p class="text-h6 mb-4">
          Strona nie została znaleziona
        </p>

        <p class="text-gray-400 mb-6">
          Wygląda na to, że zasobu, którego szukasz, nie ma lub został usunięty.
        </p>

        <v-btn
          to="/"
          class="mr-2"
          variant="tonal"
        >
          Wróć na stronę główną
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>
