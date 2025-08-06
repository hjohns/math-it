<template>
  <div class="flex flex-col items-center justify-center gap-6 h-screen">
    <h1 class="font-bold text-4xl text-(--ui-primary)">
      Welcome to Math It!
    </h1>
    
    <p class="text-lg text-gray-600 dark:text-gray-400 text-center max-w-md">
      A collection of fun and challenging math and logic games.
    </p>

    <div class="flex items-center gap-4">
      <UButton
        label="Play Countdown"
        icon="i-lucide-play"
        to="/countdown"
        size="lg"
        color="primary"
      />
      <UButton
        label="Play Sudoku"
        icon="i-lucide-play"
        to="/sudoku"
        size="lg"
        color="primary"
      />

      <UButton
        label="GitHub"
        color="neutral"
        variant="outline"
        icon="i-simple-icons-github"
        to="https://github.com/hjohns/math-it"
        target="_blank"
      />
    </div>
  </div>
</template>
