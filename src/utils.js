export function leftRotate90(matrix) {
  const n = matrix.length;
  const m = matrix[0].length;
  const rotatedMatrix = new Array(m)
    .fill(null)
    .map(() => new Array(n).fill(null));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      rotatedMatrix[m - j - 1][i] = matrix[i][j];
    }
  }

  return rotatedMatrix;
}

export function rightRotate90(matrix) {
  const n = matrix.length;
  const m = matrix[0].length;
  const rotatedMatrix = new Array(m)
    .fill(null)
    .map(() => new Array(n).fill(null));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      rotatedMatrix[j][n - i - 1] = matrix[i][j];
    }
  }

  return rotatedMatrix;
}

export function horizontalFlip(matrix) {
  const flippedMatrix = matrix.map((row) => row.slice().reverse());
  return flippedMatrix;
}
