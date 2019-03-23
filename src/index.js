module.exports = function solveSudoku(matrix) {
  const emptyCells = findEmptyCells(matrix);
  const sudoku = matrix.map(r => [...r]);
  return findSolution(sudoku, emptyCells);
}

const possibleDigits = Array.from(
  new Array(9), (val, index) => index + 1
);

function findEmptyCells(matrix) {
  let cellsCollection = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const element = matrix[i][j];
      if (element === 0) {
        cellsCollection.push({
          row: i,
          col: j,
        });
      }
    }
  }
  return cellsCollection;
}

function findPossibleCandidates(matrix, cell) {
  const possibleCandidates = new Set(possibleDigits);
  const areaRowStart = Math.floor(cell.row / 3) * 3;
  const areaColStart = Math.floor(cell.col / 3) * 3;

  matrix[cell.row].forEach((digit) => possibleCandidates.delete(digit));
  matrix.forEach((row) => possibleCandidates.delete(row[cell.col]));
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      possibleCandidates.delete(matrix[areaRowStart + i][areaColStart + j]);
    }
  }
  
  return Array.from(possibleCandidates);
}

function cleanPreviousSuggestions(matrix, cellsToClean) {
  cellsToClean.forEach((cell) => matrix[cell.row][cell.col] = 0);
}

function findSolution(matrix, emptyCells) {
  if (!emptyCells.length) {
    return isSolved(matrix) ? matrix : false;
  }

  let cell = emptyCells[0];
  cleanPreviousSuggestions(matrix, emptyCells);
  const candidates = findPossibleCandidates(matrix, cell);

  for (var i = 0; i < candidates.length; i++) {
    let candidate = candidates[i];
    matrix[cell.row][cell.col] = candidate;
    let result = findSolution(matrix, emptyCells.slice(1));
    if(result) return result;
  }

  return false;
}

function isSolved(sudoku) {

  for (let i = 0; i < 9; i++) {
    if (sudoku[i].indexOf(0) > -1) return false
    const [r,c] = [Math.floor(i/3)*3,(i%3)*3];

    if (
      (sudoku[i].reduce((s,v)=>s.add(v),new Set()).size != 9) ||
      (sudoku.reduce((s,v)=>s.add(v[i]),new Set()).size != 9) ||
      (sudoku.slice(r,r+3).reduce((s,v)=>v.slice(c,c+3).reduce((s,v)=>s.add(v),s),new Set()).size != 9)
      ) return false;
  }
  return true;
}