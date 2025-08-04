<template>
  <UApp>
    <!-- Header Navigation -->
    <header class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Left side - Brand -->
          <div class="flex items-center gap-4">
            <h1 class="text-xl font-bold text-primary">Math-It</h1>
          </div>

          <!-- Right side - Navigation -->
          <nav class="flex items-center gap-4">
            <UButton
              to="/"
              variant="ghost"
              icon="i-lucide-home"
              label="Home"
            />
            <UButton
              to="/countdown"
              variant="ghost"
              icon="i-lucide-timer"
              label="Countdown"
            />
            <UButton
              to="/about"
              variant="ghost"
              icon="i-lucide-info"
              label="About"
            />
            <UButton
              to="/contact"
              variant="ghost"
              icon="i-lucide-mail"
              label="Contact"
            />
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <NuxtPage />
    </main>
  </UApp>
</template> 