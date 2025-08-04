<template>
  <div class="relative">
    <!-- Main Container -->
    <div class="max-w-4xl mx-auto p-6">
      <!-- Game Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2">Countdown Numbers Game</h1>
        <p class="text-gray-600 dark:text-gray-400">Use arithmetic to reach the target number!</p>
      </div>

      <!-- Game Setup Phase -->
      <div v-if="gamePhase === 'setup'" class="space-y-8">
        <!-- Number Combination Selection -->
        <div class="text-center space-y-6">
          <h2 class="text-xl font-semibold">Choose Your Number Combination</h2>
          <p class="text-gray-600 dark:text-gray-400">Select how many large and small numbers you want</p>
          
          <div class="flex justify-center gap-4">
            <div class="text-center">
              <h3 class="font-medium mb-2">Large Numbers</h3>
              <div class="flex gap-2">
                <UButton
                  v-for="count in [0, 1, 2, 3, 4]"
                  :key="count"
                  :variant="selectedLargeCount === count ? 'solid' : 'outline'"
                  :color="selectedLargeCount === count ? 'primary' : 'neutral'"
                  @click="selectedLargeCount = count"
                  :disabled="count > 4 || (6 - count) < 0"
                >
                  {{ count }}
                </UButton>
              </div>
            </div>
            
            <div class="text-center">
              <h3 class="font-medium mb-2">Small Numbers</h3>
              <div class="flex gap-2">
                <UButton
                  v-for="count in [2, 3, 4, 5, 6]"
                  :key="count"
                  :variant="selectedSmallCount === count ? 'solid' : 'outline'"
                  :color="selectedSmallCount === count ? 'secondary' : 'neutral'"
                  @click="selectedSmallCount = count"
                  :disabled="count > 6 || (6 - count) < 0"
                >
                  {{ count }}
                </UButton>
              </div>
            </div>
          </div>
          
          <div class="text-lg font-medium">
            Total: {{ selectedLargeCount + selectedSmallCount }}/6
          </div>
          
          <UButton 
            @click="drawNumbers" 
            color="success" 
            size="lg"
            icon="i-lucide-shuffle"
            :disabled="selectedLargeCount + selectedSmallCount !== 6"
          >
            Draw Numbers
          </UButton>
        </div>

        <!-- Number Drawing Animation -->
        <div v-if="isDrawing" class="text-center space-y-6">
          <h2 class="text-xl font-semibold">Drawing Your Numbers...</h2>
          <div class="flex justify-center gap-4 flex-wrap">
            <div 
              v-for="(num, index) in 6" 
              :key="index"
              class="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-2xl font-bold"
            >
              <span v-if="drawnNumbers[index] !== undefined">{{ drawnNumbers[index] }}</span>
              <span v-else class="text-gray-400">?</span>
            </div>
          </div>
          <div class="text-lg font-medium">
            {{ drawnNumbers.filter(n => n !== undefined).length }}/6 drawn
          </div>
        </div>

        <!-- Drawn Numbers Display -->
        <div v-if="!isDrawing && drawnNumbers.length === 6" class="text-center space-y-6">
          <h2 class="text-xl font-semibold">Your Numbers</h2>
          <div class="flex justify-center gap-4 flex-wrap">
            <div 
              v-for="(num, index) in drawnNumbers" 
              :key="index"
              class="w-20 h-20 bg-primary text-white rounded-lg flex items-center justify-center text-2xl font-bold"
            >
              {{ num }}
            </div>
          </div>
          
          <UButton 
            @click="startGame" 
            color="primary" 
            size="lg"
            icon="i-lucide-play"
          >
            Start Game
          </UButton>
        </div>
      </div>

      <!-- Game Play Phase -->
      <div v-if="gamePhase === 'playing'" class="space-y-6">
        <!-- Numbers Display -->
        <div class="flex justify-center gap-4 flex-wrap">
          <div 
            v-for="(num, index) in availableNumbers" 
            :key="`${num}-${index}`"
            class="w-20 h-20 bg-primary text-white rounded-lg flex items-center justify-center text-2xl font-bold"
            :class="usedNumbers.includes(index) ? 'opacity-50' : 'cursor-pointer hover:bg-primary-600'"
            @click="!usedNumbers.includes(index) && addNumberToEquation(num, index)"
          >
            {{ num }}
          </div>
        </div>

        <!-- Target Number -->
        <div class="text-center">
          <div class="text-6xl font-bold text-primary">{{ targetNumber }}</div>
        </div>

        <!-- Equation Builder -->
        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="font-medium">Build Your Equation</h3>
              <div class="flex gap-2">
                <UButton 
                  variant="ghost" 
                  icon="i-lucide-undo" 
                  :disabled="equation.length === 0"
                  @click="undoLastAction"
                >
                  Undo
                </UButton>
                <UButton 
                  variant="ghost" 
                  icon="i-lucide-trash" 
                  :disabled="equation.length === 0"
                  @click="clearEquation"
                >
                  Clear
                </UButton>
              </div>
            </div>
          </template>

          <!-- Current Equation Display -->
          <div class="mb-4">
            <div class="min-h-[60px] p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <div v-if="equation.length === 0" class="text-gray-400 text-center">
                Click numbers and operators to build your equation
              </div>
              <div v-else class="text-2xl font-bold flex items-center gap-2 flex-wrap">
                <span 
                  v-for="(item, index) in equation" 
                  :key="index"
                  class="inline-block"
                >
                  {{ item }}
                </span>
              </div>
            </div>
          </div>

          <!-- Operators -->
          <div class="space-y-3">
            <div>
              <h4 class="text-sm font-medium mb-2">Operators</h4>
              <div class="flex gap-2">
                <UButton
                  v-for="op in operators"
                  :key="op"
                  variant="outline"
                  :disabled="!canAddOperator"
                  @click="addOperatorToEquation(op)"
                >
                  {{ op }}
                </UButton>
              </div>
            </div>

            <div>
              <h4 class="text-sm font-medium mb-2">Brackets</h4>
              <div class="flex gap-2">
                <UButton
                  variant="outline"
                  :disabled="!canAddOpenBracket"
                  @click="addOperatorToEquation('(')"
                >
                  (
                </UButton>
                <UButton
                  variant="outline"
                  :disabled="!canAddCloseBracket"
                  @click="addOperatorToEquation(')')"
                >
                  )
                </UButton>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Action Buttons -->
        <div class="flex gap-4 justify-center">
          <UButton 
            color="success"
            icon="i-lucide-check"
            :disabled="currentValue === null"
            @click="submitAnswer"
          >
            Submit Answer
          </UButton>
          
          <UButton 
            variant="outline"
            icon="i-lucide-refresh-cw"
            @click="newGame"
          >
            New Game
          </UButton>
        </div>
      </div>

      <!-- Game Results -->
      <div v-if="gamePhase === 'results'" class="text-center space-y-4">
        <UCard>
          <div class="space-y-4">
            <div>
              <h2 class="text-2xl font-bold mb-2">Game Complete!</h2>
              <div class="text-lg">
                Target: <span class="font-bold text-primary">{{ targetNumber }}</span>
              </div>
              <div class="text-lg">
                Your Answer: <span class="font-bold" :class="finalAnswer === targetNumber ? 'text-green-500' : 'text-orange-500'">{{ finalAnswer }}</span>
              </div>
              <div class="text-lg">
                Difference: <span class="font-bold">{{ Math.abs(targetNumber - finalAnswer) }}</span>
              </div>
            </div>
            
            <div v-if="finalAnswer === targetNumber" class="text-green-500 text-xl font-bold">
              🎉 Perfect Score! 🎉
            </div>
            
            <UButton 
              color="primary"
              icon="i-lucide-play"
              @click="newGame"
            >
              Play Again
            </UButton>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Helper Sidebar - Positioned outside main container -->
    <div v-if="gamePhase === 'playing' && helperMode" class="fixed top-6 right-6 w-80 z-10">
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-medium">Helper Mode</h3>
            <UButton 
              variant="ghost" 
              icon="i-lucide-eye-off"
              @click="helperMode = false"
            >
              Hide
            </UButton>
          </div>
        </template>
        <div class="text-center space-y-4">
          <div>
            <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">Current equation equals:</div>
            <div class="text-3xl font-bold" :class="currentValue === targetNumber ? 'text-green-500' : 'text-gray-900 dark:text-white'">
              {{ currentValue !== null ? currentValue : 'Invalid equation' }}
            </div>
          </div>
          
          <div v-if="currentValue !== null" class="space-y-2">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Difference from target:
            </div>
            <div class="text-xl font-bold" :class="Math.abs(targetNumber - currentValue) === 0 ? 'text-green-500' : 'text-orange-500'">
              {{ Math.abs(targetNumber - currentValue) }}
            </div>
          </div>
          
          <div v-if="currentValue === targetNumber" class="text-green-500 font-medium">
            🎉 Perfect! You found the target!
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
type GamePhase = 'setup' | 'playing' | 'results'

// Game state
const gamePhase = ref<GamePhase>('setup')
const selectedLargeCount = ref<number>(0)
const selectedSmallCount = ref<number>(6)
const drawnNumbers = ref<number[]>([])
const isDrawing = ref(false)
const availableNumbers = ref<number[]>([])
const usedNumbers = ref<number[]>([])
const targetNumber = ref<number>(0)
const equation = ref<string[]>([])
const helperMode = ref(true) // Always show helper by default
const timerEnabled = ref(false)
const timeLeft = ref(30)
const finalAnswer = ref<number>(0)

// Constants
const largeNumbers = [25, 50, 75, 100]
const smallNumbers = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10]
const operators = ['+', '−', '×', '÷']

// Computed
const canAddOperator = computed(() => {
  if (equation.value.length === 0) return false
  const lastItem = equation.value[equation.value.length - 1]
  return lastItem !== undefined && !operators.includes(lastItem) && lastItem !== '('
})

const canAddOpenBracket = computed(() => {
  if (equation.value.length === 0) return true
  const lastItem = equation.value[equation.value.length - 1]
  return lastItem !== undefined && (operators.includes(lastItem) || lastItem === '(')
})

const canAddCloseBracket = computed(() => {
  if (equation.value.length === 0) return false
  const openCount = equation.value.filter(item => item === '(').length
  const closeCount = equation.value.filter(item => item === ')').length
  const lastItem = equation.value[equation.value.length - 1]
  return lastItem !== undefined && openCount > closeCount && !operators.includes(lastItem) && lastItem !== '('
})

const currentValue = computed(() => {
  if (equation.value.length === 0) return null
  try {
    // Convert equation to evaluable string
    let expr = equation.value.join(' ')
    expr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-')
    
    // Simple validation - check if it ends with a number or closing bracket
    const lastItem = equation.value[equation.value.length - 1]
    if (lastItem !== undefined && (operators.includes(lastItem) || lastItem === '(')) return null
    
    // Check balanced brackets
    const openCount = equation.value.filter(item => item === '(').length
    const closeCount = equation.value.filter(item => item === ')').length
    if (openCount !== closeCount) return null
    
    const result = eval(expr)
    return Number.isInteger(result) ? result : null
  } catch {
    return null
  }
})

// Methods
const drawNumbers = async () => {
  isDrawing.value = true
  drawnNumbers.value = []
  
  // Create pools
  const largePool = [...largeNumbers]
  const smallPool = [...smallNumbers]
  
  // Draw large numbers first
  for (let i = 0; i < selectedLargeCount.value; i++) {
    await new Promise(resolve => setTimeout(resolve, 800)) // Suspense delay
    const randomIndex = Math.floor(Math.random() * largePool.length)
    const drawnNumber = largePool.splice(randomIndex, 1)[0]
    if (drawnNumber !== undefined) {
      drawnNumbers.value.push(drawnNumber)
    }
  }
  
  // Draw small numbers
  for (let i = 0; i < selectedSmallCount.value; i++) {
    await new Promise(resolve => setTimeout(resolve, 800)) // Suspense delay
    const randomIndex = Math.floor(Math.random() * smallPool.length)
    const drawnNumber = smallPool.splice(randomIndex, 1)[0]
    if (drawnNumber !== undefined) {
      drawnNumbers.value.push(drawnNumber)
    }
  }
  
  // Shuffle the final array
  drawnNumbers.value = drawnNumbers.value.sort(() => Math.random() - 0.5)
  isDrawing.value = false
}

const startGame = () => {
  // Generate target number
  targetNumber.value = Math.floor(Math.random() * 900) + 100
  
  // Use the drawn numbers
  availableNumbers.value = [...drawnNumbers.value]
  usedNumbers.value = []
  equation.value = []
  helperMode.value = true // Always show helper when game starts
  
  gamePhase.value = 'playing'
  
  // Start timer if enabled
  if (timerEnabled.value) {
    startTimer()
  }
}

const addNumberToEquation = (num: number, index: number) => {
  equation.value.push(num.toString())
  usedNumbers.value.push(index)
}

const addOperatorToEquation = (op: string) => {
  equation.value.push(op)
}

const undoLastAction = () => {
  if (equation.value.length === 0) return
  
  const lastItem = equation.value.pop()
  
  // If it was a number, return it to available numbers
  if (lastItem && !operators.includes(lastItem) && lastItem !== '(' && lastItem !== ')') {
    usedNumbers.value.pop()
  }
}

const clearEquation = () => {
  equation.value = []
  usedNumbers.value = []
}

const submitAnswer = () => {
  if (currentValue.value !== null) {
    finalAnswer.value = currentValue.value
    gamePhase.value = 'results'
  }
}

const newGame = () => {
  selectedLargeCount.value = 0
  selectedSmallCount.value = 6
  drawnNumbers.value = []
  isDrawing.value = false
  gamePhase.value = 'setup'
  timeLeft.value = 30
}

const startTimer = () => {
  const timer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(timer)
      if (currentValue.value !== null) {
        finalAnswer.value = currentValue.value
      } else {
        finalAnswer.value = 0
      }
      gamePhase.value = 'results'
    }
  }, 1000)
}
</script> 