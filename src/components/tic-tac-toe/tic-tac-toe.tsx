import React, { useState } from "react";
import { Board } from "./board";
import "./tic-tac-toe.css";

type BoardArray = Array<Array<string | null>>;

// Function to make a random move for the computer player
const makeComputerMove = (board: BoardArray): [number, number] => {
  const emptyCells: [number, number][] = [];
  board.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (!cell) {
        emptyCells.push([rowIndex, cellIndex]);
      }
    });
  });

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomIndex];
};

// Function to check if there's a winner
const checkWinner = (board: BoardArray): string | null => {
  const lines = [
    // Rows
    [board[0][0], board[0][1], board[0][2]],
    [board[1][0], board[1][1], board[1][2]],
    [board[2][0], board[2][1], board[2][2]],
    // Columns
    [board[0][0], board[1][0], board[2][0]],
    [board[0][1], board[1][1], board[2][1]],
    [board[0][2], board[1][2], board[2][2]],
    // Diagonals
    [board[0][0], board[1][1], board[2][2]],
    [board[0][2], board[1][1], board[2][0]],
  ];

  for (const line of lines) {
    if (line[0] && line[0] === line[1] && line[1] === line[2]) {
      return line[0]; // Return the winner symbol
    }
  }

  return null; // No winner found
};

export const TicTacToe = () => {
  const initialBoard = Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () => null)
  );
  const [board, setBoard] = useState<BoardArray>(initialBoard);
  const [player, setPlayer] = useState<string>("X");
  const [winner, setWinner] = useState<string | null>(null);
  const [isNoWinner, setIsNoWinner] = useState<boolean>(false);

  // Function to handle cell clicks
  const handleOnClick = (row: number, col: number) => {
    if (board[row][col] || winner) {
      return; // If cell is already occupied or there's a winner, do nothing
    }

    const updatedPlayerBoard = board.map((newRow, rowIndex) =>
      newRow.map((cell, cellIndex) =>
        rowIndex === row && cellIndex === col ? player : cell
      )
    );
    setBoard(updatedPlayerBoard);
    const newWinner = checkWinner(updatedPlayerBoard);
    setWinner(newWinner);
    setPlayer("X"); // Set player back to "X"

    // Check for a draw (no winner and no empty cells left)
    const hasNullValue = updatedPlayerBoard.some((row) =>
      row.some((cell) => cell === null)
    );

    if (!winner && !hasNullValue) {
      setIsNoWinner(true); // Set the no winner flag
      return;
    }

    // Computer's move
    if (!newWinner) {
      const [computerRow, computerCol] = makeComputerMove(updatedPlayerBoard);
      const updatedComputerBoard = updatedPlayerBoard.map((newRow, rowIndex) =>
        newRow.map((cell, cellIndex) =>
          rowIndex === computerRow && cellIndex === computerCol ? "O" : cell
        )
      );

      setTimeout(() => {
        setBoard(updatedComputerBoard);
        setWinner(checkWinner(updatedComputerBoard));
      }, 200); // Delay for a more natural feel
    }
  };

  // Function to restart the game
  const restartGame = () => {
    setBoard(initialBoard);
    setPlayer("X");
    setWinner(null);
    setIsNoWinner(false);
  };

  return (
    <div className="game">
      <h1>Tic-Tac-Toe Game</h1>
      <Board board={board} handleClick={handleOnClick} />
      {winner && <p>{winner === "X" ? "You Win!" : "Computer Win!"}</p>}
      {isNoWinner && <p>DRAW!</p>}
      <button className="reset" type="button" onClick={restartGame}>
        Start new Game
      </button>
    </div>
  );
};
