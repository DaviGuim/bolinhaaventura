// Variáveis do jogo
let board = Array(16).fill(0);
let score = 0;
let bestScore = localStorage.getItem('2048-best-score') || 0;

// Elementos do DOM
const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const bestScoreDisplay = document.getElementById('best-score');
const newGameButton = document.getElementById('new-game');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  bestScoreDisplay.textContent = bestScore;
  setupBoard();
  startGame();

  // Controles por botão
  newGameButton.addEventListener('click', startGame);

  // Controles por touch (swipe)
  let touchStartX, touchStartY;
  gameBoard.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });

  gameBoard.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
  });
});

// Configura o tabuleiro no DOM
function setupBoard() {
  gameBoard.innerHTML = '';
  for (let i = 0; i < 16; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    gameBoard.appendChild(tile);
  }
}

// Inicia um novo jogo
function startGame() {
  board = Array(16).fill(0);
  score = 0;
  scoreDisplay.textContent = score;
  addRandomTile();
  addRandomTile();
  updateBoard();
}

// Adiciona um bloco (2 ou 4) em posição aleatória vazia
function addRandomTile() {
  const emptyTiles = board.map((val, idx) => val === 0 ? idx : null).filter(val => val !== null);
  if (emptyTiles.length > 0) {
    const randomIndex = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    board[randomIndex] = Math.random() < 0.9 ? 2 : 4;
  }
}

// Atualiza a exibição do tabuleiro
function updateBoard() {
  const tiles = document.querySelectorAll('.tile');
  board.forEach((val, idx) => {
    tiles[idx].className = 'tile';
    if (val > 0) {
      tiles[idx].textContent = val;
      tiles[idx].classList.add(`tile-${val}`);
    } else {
      tiles[idx].textContent = '';
    }
  });
}

// Lógica de movimentos
function moveTiles(direction) {
  let moved = false;
  const oldBoard = [...board];

  // Esquerda (lógica padrão, outras direções são rotações + mesma lógica)
  if (direction === 'left') {
    for (let row = 0; row < 4; row++) {
      const tiles = board.slice(row * 4, row * 4 + 4).filter(val => val !== 0);
      const newRow = [];
      for (let i = 0; i < tiles.length; i++) {
        if (i < tiles.length - 1 && tiles[i] === tiles[i + 1]) {
          newRow.push(tiles[i] * 2);
          score += tiles[i] * 2;
          i++;
        } else {
          newRow.push(tiles[i]);
        }
      }
      while (newRow.length < 4) newRow.push(0);
      board.splice(row * 4, 4, ...newRow);
    }
  }

  // Outras direções (implementar similarmente)
  // ...

  if (JSON.stringify(oldBoard) !== JSON.stringify(board)) {
    moved = true;
    addRandomTile();
    updateBoard();
    updateScore();
    checkGameOver();
  }
  return moved;
}

// Atualiza a pontuação e o recorde
function updateScore() {
  scoreDisplay.textContent = score;
  if (score > bestScore) {
    bestScore = score;
    bestScoreDisplay.textContent = bestScore;
    localStorage.setItem('2048-best-score', bestScore);
  }
}

// Verifica fim de jogo
function checkGameOver() {
  if (!board.includes(0)) {
    // Verifica se há movimentos possíveis (simplificado)
    alert('Fim de jogo! Sua pontuação: ' + score);
  }
}

// Detecta gestos de swipe
function handleSwipe(startX, startY, endX, endY) {
  const dx = endX - startX;
  const dy = endY - startY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) moveTiles('right');
    else moveTiles('left');
  } else {
    if (dy > 0) moveTiles('down');
    else moveTiles('up');
  }
}