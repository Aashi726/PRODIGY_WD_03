    const board = document.getElementById("board");
    const statusText = document.getElementById("status");
    const resetButton = document.getElementById("reset");
    const modeSelect = document.getElementById("mode");
    const clickSound = document.getElementById("click-sound");
    const winSound = document.getElementById("win-sound");

    let cells = [];
    let currentPlayer = "X";
    let gameActive = true;
    let gameMode = "ai";

    const winPatterns = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];

    function createBoard() {
      board.innerHTML = "";
      cells = [];

      for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.addEventListener("click", () => handleCellClick(i));
        board.appendChild(cell);
        cells.push(cell);
      }
    }

    function handleCellClick(index) {
      if (!gameActive || cells[index].textContent !== "") return;

      clickSound.play();
      cells[index].textContent = currentPlayer;

      if (checkWinner()) {
        const result =
          gameMode === "ai"
            ? currentPlayer === "X" ? "🎉 You Win!" : "😢 You Lose!"
            : `🎉 Player ${currentPlayer} Wins!`;
        highlightWinner();
        endGame(result);
        return;
      }

      if (isDraw()) {
        endGame("🤝 It's a Draw!");
        return;
      }

      if (gameMode === "manual") {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.textContent = `Player ${currentPlayer}'s turn`;
      } else {
        currentPlayer = "O";
        statusText.textContent = "AI's turn...";
        setTimeout(aiMove, 500);
      }
    }

    function aiMove() {
      let emptyCells = cells.map((cell, i) => cell.textContent === "" ? i : null).filter(i => i !== null);
      if (!gameActive || emptyCells.length === 0) return;

      let move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      cells[move].textContent = "O";
      clickSound.play();

      if (checkWinner()) {
        highlightWinner();
        endGame("😢 You Lose!");
        return;
      }

      if (isDraw()) {
        endGame("🤝 It's a Draw!");
        return;
      }

      currentPlayer = "X";
      statusText.textContent = "Your turn";
    }

    function checkWinner() {
      return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        if (
          cells[a].textContent &&
          cells[a].textContent === cells[b].textContent &&
          cells[a].textContent === cells[c].textContent
        ) {
          pattern.forEach(i => cells[i].classList.add("win"));
          return true;
        }
        return false;
      });
    }

    function highlightWinner() {
      winSound.play();
    }

    function isDraw() {
      return cells.every(cell => cell.textContent !== "");
    }

    function endGame(message) {
      gameActive = false;
      statusText.textContent = message;
    }

    function resetGame() {
      currentPlayer = "X";
      gameActive = true;
      gameMode = modeSelect.value;
      statusText.textContent = gameMode === "ai" ? "Your turn" : "Player X's turn";
      createBoard();
    }

    resetButton.addEventListener("click", resetGame);
    modeSelect.addEventListener("change", resetGame);

    resetGame();