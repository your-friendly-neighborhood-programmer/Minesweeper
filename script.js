const canvas = document.getElementById("minesweeperCanvas");
const ctx = canvas.getContext("2d");
const gameGrid = [];
let level = 1;
let mines = 15 + (level * 5);
let timerInterval = null;
let flagMode = false;
let squareWidth = 30;
let gridSize = 20;
let gridWidth = 20;
let gridHeight = 20;
function resizeCanvas() {
    const container = document.getElementById('game-container');
    const containerWidth = container.clientWidth;
    if (window.innerWidth <= 768) {
        gridWidth = 16;
        gridHeight = 25;
        
        squareWidth = containerWidth / gridWidth;
        if (window.innerWidth > 400) {
            squareWidth = Math.min(squareWidth, 30);
        }
    } else {
        gridWidth = 20;
        gridHeight = 20;
        squareWidth = 30;
    }
    gridSize = gridWidth;
    canvas.width = gridWidth * squareWidth;
    canvas.height = gridHeight * squareWidth;
    if (gameGrid.length > 0) {
        redrawCanvas();
    }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
function redrawCanvas() {
    ctx.fillStyle = "#1e1e2f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < gameGrid.length; y++) {
        for (let x = 0; x < gameGrid[y].length; x++) {
            const cell = gameGrid[y][x];
            if (cell.mine && cell.toggled) {
                ctx.fillStyle = "#FF1744"; 
                ctx.fillRect((x * squareWidth) + 2, (y * squareWidth) + 2, squareWidth - 4, squareWidth - 4);
                ctx.fillStyle = "white";
                ctx.font = `${squareWidth * 0.7}px Orbitron`;
                ctx.fillText("💣", (x * squareWidth) + squareWidth * 0.3, (y * squareWidth) + squareWidth * 0.7);
            } else if (cell.toggled) {
                ctx.fillStyle = "#101625";
                ctx.fillRect((x * squareWidth) + 2, (y * squareWidth) + 2, squareWidth - 4, squareWidth - 4);
                ctx.strokeStyle = "#39ff14";
                ctx.lineWidth = 1;
                ctx.strokeRect((x * squareWidth) + 2, (y * squareWidth) + 2, squareWidth - 4, squareWidth - 4);
                if (cell.neighbors > 0) {
                    ctx.font = `bold ${squareWidth * 0.7}px Orbitron`;
                    if (cell.neighbors === 1) ctx.fillStyle = "#39ff14";  // neon green
                    else if (cell.neighbors === 2) ctx.fillStyle = "#0ff0fc";  // cyan
                    else if (cell.neighbors === 3) ctx.fillStyle = "#d300c4";  // magenta
                    else if (cell.neighbors === 4) ctx.fillStyle = "#7122FA";  // purple
                    else if (cell.neighbors === 5) ctx.fillStyle = "#FF10F0";  // pink
                    else if (cell.neighbors === 6) ctx.fillStyle = "#00FFBA";  // turquoise
                    else if (cell.neighbors === 7) ctx.fillStyle = "#FFFC00";  // yellow
                    else if (cell.neighbors === 8) ctx.fillStyle = "#FF3D00";  // orange
                    ctx.fillText(
                        cell.neighbors, 
                        (x * squareWidth) + (squareWidth * 0.4), 
                        (y * squareWidth) + (squareWidth * 0.7)
                    );
                }
            } else if (cell.flagged) {
                ctx.fillStyle = "#2a304d";
                ctx.fillRect((x * squareWidth) + 2, (y * squareWidth) + 2, squareWidth - 4, squareWidth - 4);
                ctx.fillStyle = "#FF10F0";
                ctx.font = `${squareWidth * 0.7}px Orbitron`;
                ctx.fillText("🚩", (x * squareWidth) + squareWidth * 0.3, (y * squareWidth) + squareWidth * 0.7);
            } else {
                ctx.fillStyle = "#2a2a3a";
                ctx.fillRect((x * squareWidth) + 2, (y * squareWidth) + 2, squareWidth - 4, squareWidth - 4);
                ctx.strokeStyle = "#0ff0fc";
                ctx.lineWidth = 0.5;
                ctx.strokeRect((x * squareWidth) + 2, (y * squareWidth) + 2, squareWidth - 4, squareWidth - 4);
            }
        }
    }
}
function draw() {
    ctx.fillStyle = "#1e1e2f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    gameGrid.length = 0;
    for (let y = 0; y < gridHeight; y++) {
        const row = [];
        for (let x = 0; x < gridWidth; x++) {
            const mine = false; 
            const toggled = false;
            const flagged = false;
            const neighbors = 0;
            row.push({x, y, mine, toggled, flagged, neighbors});
            ctx.fillStyle = "#2a2a3a";
            ctx.fillRect((x * squareWidth) + 2, (y * squareWidth) + 2, squareWidth - 4, squareWidth - 4);
            ctx.strokeStyle = "#0ff0fc";
            ctx.lineWidth = 0.5;
            ctx.strokeRect((x * squareWidth) + 2, (y * squareWidth) + 2, squareWidth - 4, squareWidth - 4);
        }
        gameGrid.push(row);
    }
}
document.getElementById("flagToggle").addEventListener('click', () => {
    flagMode = !flagMode;
    document.getElementById("flagToggle").textContent = 
        flagMode ? "Flag Mode: On" : "Flag Mode: Off";
    document.getElementById("flagToggle").classList.toggle("active", flagMode);
});
canvas.addEventListener('click', handleClick);
canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / squareWidth);
    const row = Math.floor(y / squareWidth);
    
    if (isValidCell(row, col)) {
        placeFlag(row, col);
    }
});
canvas.addEventListener('touchstart', function(e) {
    e.preventDefault(); 
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const col = Math.floor(x / squareWidth);
    const row = Math.floor(y / squareWidth);
    if (isValidCell(row, col)) {
        if (flagMode) {
            placeFlag(row, col);
        } else {
            toggleCell(row, col);
        }
    }
}, false);

function isValidCell(row, col) {
    return row >= 0 && row < gridHeight && col >= 0 && col < gridWidth;
}
function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / squareWidth);
    const row = Math.floor(y / squareWidth);
    if (isValidCell(row, col)) {
        if (flagMode) {
            placeFlag(row, col);
        } else {
            toggleCell(row, col);
        }
    }
}
function toggleCell(row, col) {
    if (!isValidCell(row, col)) return;
    const cell = gameGrid[row][col];
    if (cell.flagged || cell.toggled) return;
    cell.toggled = true;
    if (cell.mine) {
        cell.toggled = true;
        reveal();
        setTimeout(() => {
            alert("Game Over! You hit a mine.");
            level = 1;
            document.getElementById("level").innerText = `Level: ${level}`;
            newGame();
        }, 500);
        return;
    }
    redrawCanvas();
    if (cell.neighbors === 0) {
        if (row > 0) toggleCell(row - 1, col);
        if (row < gameGrid.length - 1) toggleCell(row + 1, col);
        if (col > 0) toggleCell(row, col - 1);
        if (col < gameGrid[row].length - 1) toggleCell(row, col + 1);
        if (row > 0 && col > 0) toggleCell(row - 1, col - 1);
        if (row > 0 && col < gameGrid[row].length - 1) toggleCell(row - 1, col + 1);
        if (row < gameGrid.length - 1 && col > 0) toggleCell(row + 1, col - 1);
        if (row < gameGrid.length - 1 && col < gameGrid[row].length - 1) toggleCell(row + 1, col + 1);
    }
    checkWin();
}
function checkWin() {
    let isWon = true;
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const cell = gameGrid[y][x];
            if (cell.mine && !cell.flagged) isWon = false;
        }
    }
    if (isWon) {
        setTimeout(() => {
            alert("You win!");
            level += 1;
            document.getElementById("level").innerText = `Level: ${level}`;
            newGame();
        }, 100);
    }
}
function makeMines() {
    let minesMade = 0;
    while (minesMade < mines) {
        const xMines = Math.floor(Math.random() * gridWidth);
        const yMines = Math.floor(Math.random() * gridHeight);
        if (!gameGrid[yMines][xMines].mine) {
            gameGrid[yMines][xMines].mine = true;
            minesMade++;
        } 
   }
}
function getNeighbors() {
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const cell = gameGrid[y][x];
            cell.neighbors = 0;
            if (cell.mine) continue;
            if (y > 0 && gameGrid[y - 1][x].mine) cell.neighbors++;
            if (y < gridHeight - 1 && gameGrid[y + 1][x].mine) cell.neighbors++;
            if (x > 0 && gameGrid[y][x - 1].mine) cell.neighbors++;
            if (x < gridWidth - 1 && gameGrid[y][x + 1].mine) cell.neighbors++;
            if (y > 0 && x > 0 && gameGrid[y - 1][x - 1].mine) cell.neighbors++;
            if (y > 0 && x < gridWidth - 1 && gameGrid[y - 1][x + 1].mine) cell.neighbors++;
            if (y < gridHeight - 1 && x > 0 && gameGrid[y + 1][x - 1].mine) cell.neighbors++;
            if (y < gridHeight - 1 && x < gridWidth - 1 && gameGrid[y + 1][x + 1].mine) cell.neighbors++;
        }
    }
}
function reveal() {
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            gameGrid[y][x].toggled = true;
        }
    }
    redrawCanvas();
}
function placeFlag(row, col) {
    const cell = gameGrid[row][col];
    if (cell.toggled) return;
    cell.flagged = !cell.flagged;
    updateFlagCount();
    redrawCanvas();
    checkWin();
}
function updateFlagCount() {
    let flagCount = 0;
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            if (gameGrid[y][x].flagged) flagCount++;
        }
    }
    document.getElementById("flags").innerText = `Flags: ${flagCount}`;
}
function timer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    document.getElementById("timer").innerText = "Time: 0s";
    let time = 0;
    timerInterval = setInterval(() => {
        time++;
        document.getElementById("timer").innerText = `Time: ${time}s`;
    }, 1000);
}
function newGame() {
    gameGrid.length = 0;
    mines = 15 + (level * 5);
    draw();
    makeMines();
    getNeighbors(); 
    checkWin();
    timer(); 
    flagMode = false;
    document.getElementById("flagToggle").textContent = "Flag Mode: Off";
    document.getElementById("flagToggle").classList.remove("active");
    document.getElementById("flags").innerText = "Flags: 0";
    document.getElementById("mines").innerText = `Mines: ${mines}`;
    document.getElementById("level").innerText = `Level: ${level}`;
}
document.getElementById("newGame").addEventListener("click", newGame);
newGame();