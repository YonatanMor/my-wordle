import { useEffect, useRef, useState } from "react";

export default function Index() {
  const [grid, setGrid] = useState(Array(6).fill(Array(5).fill("")));
  const [currentRow, setCurrentRow] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [targetWord, setTragetWord] = useState<string[]>([]);
  let cellRefs = useRef<(HTMLDivElement | null)[][]>([]);

  useEffect(() => {
    resetGame();
  }, []);
  const allowedChars = /^[a-zA-Z]*$/;

  const resetGame = async () => {
    setGrid(Array(6).fill(Array(5).fill("")));
    setCurrentRow(0);
    setUserInput("");
    resetCellsBgColor();
    generateTargetWord();
  };

  const updateBoard = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submitRow();
    } else if (!allowedChars.test(e.key)) {
      e.preventDefault();
    }
  };

  const colorRow = () => {
    const markedChars = targetWord.map((char) => {
      return { char, bgColor: "", counter: 1 };
    });
    const inputArr = userInput.split("");

    inputArr.forEach((input, i) => {
      if (input === targetWord[i]) {
        if (cellRefs.current[currentRow][i]) {
          markedChars[i].bgColor = "#538D4E";
          markedChars[i].counter = 0;
        }
      }
    });

    inputArr.forEach((input, i) => {
      const isFreeForYellow = (inputChar: string) =>
        markedChars.find((obj) => {
          if (obj.char === inputChar && obj.counter) {
            obj.counter = 0;
            return 1;
          }
        });
      if (
        targetWord.includes(input) &&
        markedChars[i].bgColor !== "#538D4E" &&
        isFreeForYellow(input)
      ) {
        markedChars[i].bgColor = "#B59F3B";
      }
    });
    return markedChars.map((obj) => obj.bgColor);
  };

  const resetCellsBgColor = () => {
    cellRefs.current.forEach((row) => {
      row.forEach((cell) => {
        if (cell) {
          cell.style.backgroundColor = "";
          cell.classList.remove("animate-rotate");
        }
      });
    });
  };

  const setRef = (el: HTMLDivElement | null, i: number, j: number) => {
    if (!cellRefs.current[i]) {
      cellRefs.current[i] = [];
    }
    cellRefs.current[i][j] = el;
  };

  const submitRow = () => {
    if (userInput.length === 5) {
      const colors = colorRow();
      setUserInput("");
      animateCell(colors);
      setCurrentRow((prev) => prev + 1);
      if (currentRow === 5) {
      }
    }
  };

  const animateCell = (colors: string[]) => {
    cellRefs.current[currentRow].forEach((item, index) => {
      if (item) {
        item.style.animationDelay = `${index * 0.5}s`;

        setTimeout(() => {
          item.style.transition = "background-color 0.5s ease";
          item.style.backgroundColor = colors[index]
            ? colors[index]
            : "#3a3a3c";
        }, index * 500);

        item.classList.add("animate-rotate");
      }
    });
  };

  const generateTargetWord = async () => {
    // const rndLetter = LETTERS[Math.round(Math.random() * 25)];
    // const response = await fetch(
    //   `https://api.datamuse.com/words?sp=${rndLetter}????`
    // );
    // const words = await response.json();
    // const word = words[Math.floor(words.length * Math.random())].word;
    setTragetWord(["b", "r", "o", "o", "m"]);
    // setTragetWord(word.split(""));
  };

  return (
    <div className="flex flex-col bg-black">
      <div className="flex justify-center">
        <span className="text-[40px]">{targetWord}</span>
      </div>
      <div className="inline-grid w-fit grid-cols-5 grid-rows-6 gap-3 bg-black p-6">
        {grid.map((row: String[], rowIndex: number) =>
          row.map((char: String, colIndex: number) => (
            <div
              key={rowIndex + "," + colIndex}
              ref={(el) => setRef(el, rowIndex, colIndex)}
              className="animate-rotateX flex h-32 w-32 items-center justify-center border text-[50px] text-white"
            >
              {char.toUpperCase()}
            </div>
          ))
        )}
      </div>

      <div className="flex justify-around bg-slate-400 p-1">
        <input
          onKeyDown={handleKeyDown}
          value={userInput}
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
