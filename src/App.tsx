import { useEffect, useState } from "react";

export default function Index() {
  const [grid, setGrid] = useState(Array(6).fill(Array(5).fill("")));
  const [currentRow, setCurrentRow] = useState(0);
  const [input, setInput] = useState("");
  const [targetWord, setTragetWord] = useState("");
  const LETTERS = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];

  useEffect(() => {
    resetGame();
  }, []);

  const updateBoard = (e) => {
    setInput(e.target.value);
    const word = [...e.target.value.split("")];
    while (word.length < 5) {
      word.push("");
    }
    const updatedGrid = [...grid];
    updatedGrid[currentRow] = word;
    setGrid(updatedGrid);
  };

  const submitRow = () => {
    if (input.length === 5) {
      setInput("");
      setCurrentRow((prev) => prev + 1);
      colorLetters();
    }
  };

  const colorLetters = () => {
    const inputArr = input.split("");
    inputArr.forEach((char, i) => {
      if (char === targetWord[i]) {
        console.log(1);
      } else {
        console.log(0);
      }
    });
  };

  const resetGame = async () => {
    setGrid(Array(6).fill(Array(5).fill("")));
    setCurrentRow(0);
    setInput("");
    generateTargetWord();
  };

  const generateTargetWord = async () => {
    const rndLetter = LETTERS[Math.round(Math.random() * 25)];
    const response = await fetch(
      `https://api.datamuse.com/words?sp=${rndLetter}????`
    );
    const words = await response.json();
    setTragetWord(words[Math.floor(words.length * Math.random())].word);
  };

  return (
      <div>
        <div className="flex justify-center">
          <span className="text-3xl">{targetWord}</span>
        </div>
        <div className="grid h-[600px] w-full grid-cols-5 grid-rows-6 gap-2  bg-[#33a332] p-2">
          {grid.map((row: String[][], rowIndex: number) =>
            row.map((col: String[], colIndex: number) => (
              <div
                key={colIndex}
                className="flex items-center justify-center rounded-lg bg-slate-300 text-[60px]"
              >
                {col}
              </div>
            ))
          )}
        </div>

        <div className=" flex justify-around bg-slate-400 p-1">
          <input
            onKeyDown={(e) => e.key === "Enter" && submitRow()}
            value={input}
            onChange={updateBoard}
            type="text"
            maxLength={5}
            className="rounded-md border-2 border-red-700 bg-slate-300"
          />
          <button
            onClick={submitRow}
            className="m-1 h-8 w-20 rounded-md border-2 border-black bg-red-400 px-[2px]"
          >
            Enter
          </button>
          <button
            onClick={resetGame}
            className="m-1 h-8 w-20 rounded-md border-2 border-black bg-red-400 px-[2px]"
          >
            Reset
          </button>
        </div>
      </div>
  );
}
