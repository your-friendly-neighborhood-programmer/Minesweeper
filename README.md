# <a href="https://your-friendly-neighborhood-programmer.github.io/Minesweeper/">Minesweeper Game</a>

A classic implementation of the Minesweeper game using HTML, CSS, and JavaScript.

## Game Description

Minesweeper is a single-player puzzle game where the objective is to clear a rectangular board containing hidden "mines" without detonating any of them, using clues about the number of neighboring mines in each field.

## Features

- 20x20 grid of cells with randomly placed mines
- Left-click to reveal cells
- Right-click to place/remove flags on suspected mines
- Number indicators showing adjacent mines
- Color-coded numbers for easy readability
- Game timer to track elapsed time
- Flag counter to track placed flags
- Mine counter showing total mines in the game
- Win detection when all non-mine cells are revealed or all mines are flagged
- Lose detection when a mine is clicked

## How to Play

1. Left-click on a cell to reveal it
2. If a cell contains a number, it indicates how many mines are in the adjacent cells
3. Right-click on a cell to place a flag if you suspect it contains a mine
4. Clear all non-mine cells to win the game
5. Click the "New Game" button to start a new game at any time

## Technical Implementation

### Tech Stack

- HTML5 Canvas for rendering the game board
- JavaScript for game logic
- CSS for styling

### Key Components

- Canvas-based rendering system for efficient graphics
- Recursive cell revealing for empty cells
- Neighbor-counting algorithm
- Event handlers for mouse interactions
- Timer system with reset functionality
- Dynamic emoji rendering for mines and flags

## Future Enhancements

- Difficulty levels (Easy, Medium, Hard)
- Custom grid size options
- First-click safety (ensuring the first click is never a mine)
- Sound effects
- High score tracking
- Mobile touch support

## Getting Started

Simply open `index.html` in your web browser to play the game.
