import { ref, computed } from 'vue'

export const useSudoku = () => {
  const board = ref<number[][]>([])
  const originalBoard = ref<number[][]>([])
  const gridSize = ref<number>(9)
  const selectedCell = ref<{ row: number; col: number } | null>(null)
  const hints = ref<number[]>([])

  const generate = (size: number = 9) => {
    gridSize.value = size
    
    // Generate a proper Sudoku puzzle
    const puzzle = generateValidSudokuPuzzle(size)
    board.value = puzzle
    
    // Store original board for validation
    originalBoard.value = board.value.map(row => [...row])
    selectedCell.value = null
    hints.value = []
  }

  const generateValidSudokuPuzzle = (size: number): number[][] => {
    // Start with a solved grid
    const solvedGrid = generateSolvedGrid(size)
    
    // Create a puzzle by removing numbers
    const puzzle = solvedGrid.map(row => [...row])
    const cellsToRemove = Math.floor((size * size) * 0.6) // Remove 60% of cells
    
    for (let i = 0; i < cellsToRemove; i++) {
      const row = Math.floor(Math.random() * size)
      const col = Math.floor(Math.random() * size)
      puzzle[row][col] = 0
    }
    
    return puzzle
  }

  const generateSolvedGrid = (size: number): number[][] => {
    const grid: number[][] = []
    for (let i = 0; i < size; i++) {
      grid[i] = new Array(size).fill(0)
    }
    
    // Fill the grid using a simple algorithm
    if (size === 9) {
      // Use a known valid 9x9 solution pattern
      const solution = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9]
      ]
      return solution
    } else if (size === 6) {
      // Generate a 6x6 solution
      const solution = [
        [1, 2, 3, 4, 5, 6],
        [4, 5, 6, 1, 2, 3],
        [2, 3, 1, 5, 6, 4],
        [5, 6, 4, 2, 3, 1],
        [3, 1, 2, 6, 4, 5],
        [6, 4, 5, 3, 1, 2]
      ]
      return solution
    } else if (size === 4) {
      // Generate a 4x4 solution
      const solution = [
        [1, 2, 3, 4],
        [3, 4, 1, 2],
        [2, 3, 4, 1],
        [4, 1, 2, 3]
      ]
      return solution
    } else {
      // Generate a 3x3 solution
      const solution = [
        [1, 2, 3],
        [2, 3, 1],
        [3, 1, 2]
      ]
      return solution
    }
  }

  const validateOriginalPuzzle = (): boolean => {
    if (!board.value.length) return false
    
    // Check each row for duplicates
    for (let row = 0; row < gridSize.value; row++) {
      if (!board.value[row]) return false
      const rowNumbers = new Set<number>()
      for (let col = 0; col < gridSize.value; col++) {
        const num = board.value[row][col]
        if (num !== undefined && num !== 0) {
          if (rowNumbers.has(num)) return false
          rowNumbers.add(num)
        }
      }
    }
    
    // Check each column for duplicates
    for (let col = 0; col < gridSize.value; col++) {
      const colNumbers = new Set<number>()
      for (let row = 0; row < gridSize.value; row++) {
        if (!board.value[row]) return false
        const num = board.value[row][col]
        if (num !== undefined && num !== 0) {
          if (colNumbers.has(num)) return false
          colNumbers.add(num)
        }
      }
    }
    
    // Check each box for duplicates
    const boxSize = Math.sqrt(gridSize.value)
    for (let boxRow = 0; boxRow < gridSize.value; boxRow += boxSize) {
      for (let boxCol = 0; boxCol < gridSize.value; boxCol += boxSize) {
        const boxNumbers = new Set<number>()
        for (let r = boxRow; r < boxRow + boxSize; r++) {
          for (let c = boxCol; c < boxCol + boxSize; c++) {
            if (!board.value[r]) return false
            const num = board.value[r][c]
            if (num !== undefined && num !== 0) {
              if (boxNumbers.has(num)) return false
              boxNumbers.add(num)
            }
          }
        }
      }
    }
    
    return true
  }

  const generateSimpleValidPuzzle = (size: number) => {
    // Generate a simple valid puzzle with minimal numbers
    const newBoard: number[][] = []
    for (let i = 0; i < size; i++) {
      newBoard[i] = new Array(size).fill(0)
    }
    
    // Add a few valid numbers to make it solvable
    if (size === 9) {
      newBoard[0][0] = 1
      newBoard[1][1] = 2
      newBoard[2][2] = 3
      newBoard[3][3] = 4
      newBoard[4][4] = 5
      newBoard[5][5] = 6
      newBoard[6][6] = 7
      newBoard[7][7] = 8
      newBoard[8][8] = 9
    } else if (size === 6) {
      newBoard[0][0] = 1
      newBoard[1][1] = 2
      newBoard[2][2] = 3
      newBoard[3][3] = 4
      newBoard[4][4] = 5
      newBoard[5][5] = 6
    } else if (size === 4) {
      newBoard[0][0] = 1
      newBoard[1][1] = 2
      newBoard[2][2] = 3
      newBoard[3][3] = 4
    } else {
      newBoard[0][0] = 1
      newBoard[1][1] = 2
      newBoard[2][2] = 3
    }
    
    board.value = newBoard
  }

  const setCell = (row: number, col: number, value: number) => {
    if (board.value[row] && originalBoard.value[row] && originalBoard.value[row][col] === 0) {
      board.value[row][col] = value
    }
  }

  const selectCell = (row: number, col: number) => {
    selectedCell.value = { row, col }
    generateHints(row, col)
  }

  const generateHints = (row: number, col: number) => {
    if (!board.value[row] || !originalBoard.value[row] || originalBoard.value[row][col] !== 0) {
      hints.value = []
      return
    }

    const possibleNumbers: number[] = []
    const maxNum = gridSize.value

    for (let num = 1; num <= maxNum; num++) {
      if (isValidMove(row, col, num)) {
        possibleNumbers.push(num)
      }
    }

    hints.value = possibleNumbers
  }

  const getInvalidNumbers = (row: number, col: number): number[] => {
    if (!board.value[row] || originalBoard.value[row][col] !== 0) {
      return []
    }

    const invalidNumbers: number[] = []
    const currentValue = board.value[row][col]
    
    if (currentValue === 0) return []

    // Check if current value conflicts with any other numbers
    for (let r = 0; r < gridSize.value; r++) {
      for (let c = 0; c < gridSize.value; c++) {
        if ((r !== row || c !== col) && board.value[r] && board.value[r][c] === currentValue) {
          // Check if they're in the same row, column, or box
          if (r === row || c === col || isInSameBox(row, col, r, c)) {
            invalidNumbers.push(currentValue)
            break
          }
        }
      }
    }

    return invalidNumbers
  }

  const isInSameBox = (row1: number, col1: number, row2: number, col2: number): boolean => {
    // For 3x3 grids, there are no boxes, so always return false
    if (gridSize.value <= 3) return false
    
    const boxSize = Math.sqrt(gridSize.value)
    const boxRow1 = Math.floor(row1 / boxSize)
    const boxCol1 = Math.floor(col1 / boxSize)
    const boxRow2 = Math.floor(row2 / boxSize)
    const boxCol2 = Math.floor(col2 / boxSize)
    return boxRow1 === boxRow2 && boxCol1 === boxCol2
  }

  const isValidMove = (row: number, col: number, num: number): boolean => {
    if (!board.value[row]) return false
    
    // Check row
    for (let c = 0; c < gridSize.value; c++) {
      if (c !== col && board.value[row][c] === num) {
        return false
      }
    }

    // Check column
    for (let r = 0; r < gridSize.value; r++) {
      if (r !== row && board.value[r] && board.value[r][col] === num) {
        return false
      }
    }

    // Check box only for grids larger than 3x3
    if (gridSize.value > 3) {
      const boxSize = Math.sqrt(gridSize.value)
      const boxRow = Math.floor(row / boxSize) * boxSize
      const boxCol = Math.floor(col / boxSize) * boxSize

      for (let r = boxRow; r < boxRow + boxSize; r++) {
        for (let c = boxCol; c < boxCol + boxSize; c++) {
          if (board.value[r] && (r !== row || c !== col) && board.value[r][c] === num) {
            return false
          }
        }
      }
    }

    return true
  }

  const checkBoardValidity = (): boolean => {
    if (!board.value.length) return true
    
    // Check each row for duplicates
    for (let row = 0; row < gridSize.value; row++) {
      if (!board.value[row]) return false
      const rowNumbers = new Set<number>()
      for (let col = 0; col < gridSize.value; col++) {
        const num = board.value[row][col]
        if (num !== undefined && num !== 0) {
          if (rowNumbers.has(num)) return false
          rowNumbers.add(num)
        }
      }
    }
    
    // Check each column for duplicates
    for (let col = 0; col < gridSize.value; col++) {
      const colNumbers = new Set<number>()
      for (let row = 0; row < gridSize.value; row++) {
        if (!board.value[row]) return false
        const num = board.value[row][col]
        if (num !== undefined && num !== 0) {
          if (colNumbers.has(num)) return false
          colNumbers.add(num)
        }
      }
    }
    
    // Check each box for duplicates only for grids larger than 3x3
    if (gridSize.value > 3) {
      const boxSize = Math.sqrt(gridSize.value)
      for (let boxRow = 0; boxRow < gridSize.value; boxRow += boxSize) {
        for (let boxCol = 0; boxCol < gridSize.value; boxCol += boxSize) {
          const boxNumbers = new Set<number>()
          for (let r = boxRow; r < boxRow + boxSize; r++) {
            for (let c = boxCol; c < boxCol + boxSize; c++) {
              if (!board.value[r]) return false
              const num = board.value[r][c]
              if (num !== undefined && num !== 0) {
                if (boxNumbers.has(num)) return false
                boxNumbers.add(num)
              }
            }
          }
        }
      }
    }
    
    return true
  }

  const isOriginalCell = (row: number, col: number): boolean => {
    return originalBoard.value[row] && originalBoard.value[row][col] !== 0
  }

  const isSelectedCell = (row: number, col: number): boolean => {
    return selectedCell.value?.row === row && selectedCell.value?.col === col
  }

  const isInvalidCell = (row: number, col: number): boolean => {
    if (isOriginalCell(row, col)) return false
    return getInvalidNumbers(row, col).length > 0
  }

  const clearCell = (row: number, col: number) => {
    if (board.value[row] && originalBoard.value[row] && originalBoard.value[row][col] === 0) {
      board.value[row][col] = 0
    }
  }

  const isComplete = computed(() => {
    if (!board.value.length) return false
    
    for (let row = 0; row < gridSize.value; row++) {
      if (!board.value[row]) return false
      for (let col = 0; col < gridSize.value; col++) {
        if (board.value[row][col] === 0) {
          return false
        }
      }
    }
    
    // Debug logging
    console.log('Puzzle is complete!')
    return true
  })

  const isValid = computed(() => {
    const valid = checkBoardValidity()
    // Debug logging
    if (isComplete.value) {
      console.log('Puzzle validity check:', valid)
    }
    return valid
  })

  const isPuzzleSolved = computed(() => {
    return isComplete.value && isValid.value
  })

  return {
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
    isComplete,
    isValid,
    isInvalidCell,
    isPuzzleSolved,
  }
}
