<script lang="ts" setup>
import { useSudoku } from '~/composables/useSudoku'

const { 
  board, 
  gridSize, 
  selectedCell, 
  hints, 
  generate, 
  setCell, 
  selectCell, 
  clearCell, 
  isOriginalCell, 
  isSelectedCell, 
  isInvalidCell,
  isPuzzleSolved
} = useSudoku()

const gridSizes = [3, 4, 6, 9]
const showClearConfirmation = ref(false)

onMounted(() => {
  generate(9)
})

const handleCellClick = (row: number, col: number) => {
  selectCell(row, col)
}

const handleNumberClick = (number: number) => {
  if (selectedCell.value && board.value[selectedCell.value.row]) {
    const { row, col } = selectedCell.value
    if (isOriginalCell(row, col)) return
    
    if (board.value[row] && board.value[row][col] === number) {
      clearCell(row, col)
    } else {
      setCell(row, col, number)
    }
  }
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (!selectedCell.value || !board.value[selectedCell.value.row]) return
  
  const { row, col } = selectedCell.value
  if (isOriginalCell(row, col)) return
  
  const key = event.key
  
  if (key >= '1' && key <= '9') {
    const number = parseInt(key)
    if (number <= gridSize.value) {
      if (board.value[row] && board.value[row][col] === number) {
        clearCell(row, col)
      } else {
        setCell(row, col, number)
      }
    }
  } else if (key === 'Backspace' || key === 'Delete' || key === '0') {
    clearCell(row, col)
  }
}

const changeGridSize = (size: number) => {
  generate(size)
}

const getNumberButtons = () => {
  const buttons = []
  for (let i = 1; i <= gridSize.value; i++) {
    buttons.push(i)
  }
  return buttons
}

const clearAllUserNumbers = () => {
  for (let row = 0; row < gridSize.value; row++) {
    for (let col = 0; col < gridSize.value; col++) {
      if (!isOriginalCell(row, col)) {
        clearCell(row, col)
      }
    }
  }
  showClearConfirmation.value = false
  selectedCell.value = null
}
</script>

<template>
  <div class="relative">
    <!-- Game Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold mb-2">Sudoku Puzzle</h1>
      <p class="text-gray-600 dark:text-gray-400">Fill in the grid so every row, column, and box contains each number exactly once!</p>
    </div>

    <!-- Grid Size Selector -->
    <div class="text-center mb-6">
      <h3 class="text-lg font-semibold mb-3">Grid Size</h3>
      <div class="flex justify-center gap-2">
        <UButton
          v-for="size in gridSizes"
          :key="size"
          :variant="gridSize === size ? 'solid' : 'outline'"
          :color="gridSize === size ? 'primary' : 'neutral'"
          @click="changeGridSize(size)"
          size="sm"
        >
          {{ size }}×{{ size }}
        </UButton>
      </div>
    </div>

    <!-- Game Container -->
    <div class="flex flex-col lg:flex-row gap-8 justify-center items-start">
      <!-- Sudoku Board -->
      <div class="flex-shrink-0">
        <div 
          v-if="board.length > 0"
          class="sudoku-board"
          :style="{
            '--grid-size': gridSize,
            '--cell-size': gridSize <= 6 ? '60px' : '50px'
          }"
          tabindex="0"
          @keydown="handleKeyPress"
        >
          <div 
            v-for="(row, rowIndex) in board" 
            :key="rowIndex" 
            class="sudoku-row"
          >
            <div 
              v-for="(cell, colIndex) in row" 
              :key="colIndex" 
              class="sudoku-cell"
              :class="{
                'original-cell': isOriginalCell(rowIndex, colIndex),
                'selected-cell': isSelectedCell(rowIndex, colIndex),
                'invalid-cell': isInvalidCell(rowIndex, colIndex)
              }"
              @click="handleCellClick(rowIndex, colIndex)"
            >
              <span v-if="cell !== 0" class="cell-number">{{ cell }}</span>
            </div>
          </div>
        </div>
        <div v-else class="flex items-center justify-center h-64">
          <p class="text-gray-500">Loading puzzle...</p>
        </div>
      </div>

      <!-- Controls Panel -->
      <div class="flex flex-col gap-6 min-w-[200px]">
        <!-- Number Pad -->
        <div class="space-y-3">
          <h3 class="text-lg font-semibold">Number Pad</h3>
          <div class="grid grid-cols-3 gap-2">
            <UButton
              v-for="number in getNumberButtons()"
              :key="number"
              @click="handleNumberClick(number)"
              size="lg"
              class="h-12 text-lg font-bold"
              :color="selectedCell && board[selectedCell.row] && board[selectedCell.row][selectedCell.col] === number ? 'primary' : 'neutral'"
            >
              {{ number }}
            </UButton>
          </div>
          <UButton
            @click="selectedCell && board[selectedCell.row] && clearCell(selectedCell.row, selectedCell.col)"
            variant="outline"
            color="error"
            size="lg"
            class="w-full"
          >
            Clear Cell
          </UButton>
        </div>

        <!-- Hints -->
        <div v-if="selectedCell && hints.length > 0" class="space-y-3">
          <h3 class="text-lg font-semibold">Hints</h3>
          <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Possible numbers for this cell:
            </p>
            <div class="flex gap-1 flex-wrap">
              <span 
                v-for="hint in hints" 
                :key="hint"
                class="px-2 py-1 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-sm font-medium"
              >
                {{ hint }}
              </span>
            </div>
          </div>
        </div>

        <!-- Celebration Message -->
        <div v-if="isPuzzleSolved" class="p-4 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg">
          <div class="text-center">
            <div class="text-2xl mb-2">🎉</div>
            <h4 class="font-bold text-green-800 dark:text-green-200">Congratulations!</h4>
            <p class="text-sm text-green-700 dark:text-green-300">You've completed the Sudoku puzzle correctly!</p>
          </div>
        </div>

        <!-- New Game Button -->
        <UButton
          @click="generate(gridSize)"
          color="primary"
          size="lg"
          class="w-full"
        >
          New Game
        </UButton>

        <!-- Clear All Button -->
        <UButton
          @click="showClearConfirmation = true"
          variant="outline"
          color="warning"
          size="lg"
          class="w-full"
        >
          Clear All
        </UButton>
      </div>
    </div>

    <!-- Clear Confirmation Dialog -->
    <div v-if="showClearConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Clear All Numbers</h3>
          
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to clear all your entered numbers? This will keep the original puzzle numbers but remove all your progress.
          </p>
          
          <div class="flex gap-3 justify-end">
            <UButton
              @click="showClearConfirmation = false"
              variant="outline"
              color="neutral"
            >
              Cancel
            </UButton>
            <UButton
              @click="clearAllUserNumbers"
              color="warning"
            >
              Clear All
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sudoku-board {
  display: grid;
  grid-template-rows: repeat(var(--grid-size), var(--cell-size));
  grid-template-columns: repeat(var(--grid-size), var(--cell-size));
  border: 3px solid #333;
  outline: none;
  margin: 0 auto;
}

.sudoku-row {
  display: contents;
}

.sudoku-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: white;
  color: #333;
}

.sudoku-cell:hover {
  background-color: #f0f0f0;
}

.sudoku-cell.original-cell {
  background-color: #e8f4fd;
  color: #1e40af;
  font-weight: 900;
  cursor: not-allowed;
}

.sudoku-cell.selected-cell {
  background-color: #3b82f6;
  color: white;
  box-shadow: inset 0 0 0 2px #1d4ed8;
}

.sudoku-cell.invalid-cell {
  background-color: #fee2e2;
  color: #991b1b;
  font-weight: bold;
}

.sudoku-cell.invalid-cell.selected-cell {
  background-color: #ef4444;
  color: white;
  box-shadow: inset 0 0 0 2px #dc2626;
}

.cell-number {
  font-size: 1.1rem;
}

/* Add thicker borders for 3x3 boxes */
.sudoku-cell:nth-child(3n) {
  border-right: 2px solid #333;
}

.sudoku-cell:nth-child(9n) {
  border-right: 3px solid #333;
}

.sudoku-row:nth-child(3n) .sudoku-cell {
  border-bottom: 2px solid #333;
}

.sudoku-row:nth-child(9n) .sudoku-cell {
  border-bottom: 3px solid #333;
}

/* Responsive adjustments for smaller grids */
@media (max-width: 768px) {
  .sudoku-board {
    --cell-size: 40px;
  }
  
  .cell-number {
    font-size: 0.9rem;
  }
}
</style>
