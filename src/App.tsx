import { useEffect, useRef, useState } from "react";

export default function Index() {
  const [grid, setGrid] = useState(Array(6).fill(Array(5).fill("")));
  const [currentRow, setCurrentRow] = useState(0);
  const [input, setInput] = useState("");
  const [targetWord, setTragetWord] = useState<string[]>([]);
  let cellRefs = useRef<(HTMLDivElement | null)[][]>([]);
  // let mutatedTargetWord = useRef("")
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

  const resetGame = async () => {
    setGrid(Array(6).fill(Array(5).fill("")));
    setCurrentRow(0);
    setInput("");
    generateTargetWord();
    cellRefs.current = [];
  };

  const updateBoard = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    const inputArr = [...e.target.value.split("")];
    const missingChars = 5 - inputArr.length;
    if (missingChars !== 5) {
      for (let i = 0; i < missingChars; i++) {
        inputArr.push("");
      }
    }
    const updatedGrid = [...grid];
    updatedGrid[currentRow] = inputArr;
    setGrid(updatedGrid);
  };

  const colorRow = () => {
    const targetword1 = targetWord.map((char) => {
      return { char, isMarked: false };
    });
    const greenLetterIndex: object[] = [];
    const inputArr = input.split("");
    inputArr.forEach((input, i) => {
      if (targetWord.includes(input)) {
        if (input === targetWord[i]) {
          if (cellRefs.current[currentRow][i]) {
            targetword1[i].isMarked = true;
            cellRefs.current[currentRow][i].style.backgroundColor = "#538D4E";
          }
        } else if (
          targetword1
            .filter((obj) => obj.char === input)
            .filter((obj) => !obj.isMarked)[0]
        ) {
          if (cellRefs.current[currentRow][i]) {
            cellRefs.current[currentRow][i].style.backgroundColor = "#B59F3B";
          }
        }
      }
    });
  };

  const setRef = (el: HTMLDivElement | null, i: number, j: number) => {
    if (!cellRefs.current[i]) {
      cellRefs.current[i] = [];
    }
    cellRefs.current[i][j] = el;
  };

  const submitRow = () => {
    if (input.length === 5) {
      colorRow();
      setInput("");
      setCurrentRow((prev) => prev + 1);
      if (currentRow === 5) {
        alert("game over");
      }
    }
  };

  const generateTargetWord = async () => {
    const rndLetter = LETTERS[Math.round(Math.random() * 25)];
    const response = await fetch(
      `https://api.datamuse.com/words?sp=${rndLetter}????`
    );
    const words = await response.json();
    const word = words[Math.floor(words.length * Math.random())].word;
    setTragetWord(word.split(""));
  };

  return (
    <div className="flex flex-col bg-black">
      <div className="flex justify-center">
        <span className="bg-slate-300 text-[40px]">{targetWord}</span>
      </div>
      <div className="inline-grid w-fit grid-cols-5 grid-rows-6 gap-3 bg-black p-6">
        {grid.map((row: String[], rowIndex: number) =>
          row.map((char: String, colIndex: number) => (
            <div
              key={rowIndex + "," + colIndex}
              ref={(el) => setRef(el, rowIndex, colIndex)}
              className="flex h-32 w-32 items-center justify-center border text-[50px] text-white"
            >
              {char.toUpperCase()}
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
