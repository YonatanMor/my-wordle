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
      if (currentRow === 5) {
        alert("game over");
      }
      // colorLetters()
    }
  };

  const setBg = (char, i) => {
    if (char === targetWord[i]) {
      console.log("green");
      return " bg-[#538D4E]";
    } else if (targetWord.includes(char) && char !== "") {
      console.log("yellow");
      return "bg-[#B59F3B]";
    }
    console.log("dark");
    return "bg-[#3A3A3C]";
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
      <div className="grid h-[600px]  grid-cols-5 grid-rows-6 gap-1 bg-black p-2">
        {grid.map((row: String[], rowIndex: number) =>
          row.map((col: String, colIndex: number) => (
            <div
              key={colIndex}
              className={`w-18 h-18 flex items-center justify-center border text-[50px] text-white  ${
                currentRow > rowIndex ? setBg(col, colIndex) : "bg-black"
              }`}
            >
              {col.toUpperCase()}
            </div>
          ))
        )}
      </div>

      <div className="flex justify-around bg-slate-400 p-1">
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
      <h1 className="text-3xl">
        limit keyboard inputs to letters (cancel space char)
      </h1>
    </div>
  );
}
