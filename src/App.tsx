import { useEffect, useRef, useState } from "react";

export default function Index() {
  const [grid, setGrid] = useState(Array(6).fill(Array(5).fill("")));
  const [currentRow, setCurrentRow] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [targetWord, setTragetWord] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
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
    if (missingChars !== 0) {
      for (let i = 0; i < missingChars; i++) {
        inputArr.push("");
      }
    }
    const updatedGrid = [...grid];
    updatedGrid[currentRow] = inputArr;
    setGrid(updatedGrid);
  };

  // const updateBoard = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const input = e.target.value;
  //   setUserInput(input);

  //   if (input.length <= 5) {
  //     const inputArr = input.split("");
  //     const updatedGrid = [...grid];

  //     // Update only the current row without affecting other rows
  //     const rowToUpdate = [...updatedGrid[currentRow]];
  //     inputArr.forEach((char, index) => {
  //       rowToUpdate[index] = char; // Update the row with the input characters
  //     });

  //     updatedGrid[currentRow] = rowToUpdate;
  //     setGrid(updatedGrid);
  //   }
  // };

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

  const submitRow = async () => {
    if (userInput.length === 5) {
      if (await isWord()) {
        const colors = colorRow();
        setUserInput("");
        animateCell(colors);
        setCurrentRow((prev) => prev + 1);
        if (currentRow === 5) {
        }
      } else notAWordAlert();
    }
  };

  const isWord = async () => {
    const response = await fetch(
      `https://api.datamuse.com/words?sp=${userInput}`
    );
    const words = await response.json();
    return words.find(
      (obj: { word: string; score: number }) => obj.word === userInput
    );
  };

  const notAWordAlert = () => {
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 2000);
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
    const rndLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    const response = await fetch(
      `https://api.datamuse.com/words?sp=${rndLetter}????`
    );
    const words = await response.json();
    const word = words[Math.floor(words.length * Math.random())].word;
    setTragetWord(word.toUpperCase().split(""));
  };

  return (
    <div className="flex flex-col bg-black">
      <div className="flex justify-center items-center mt-4">
        <span className="text-[52px] px-6 rounded-md bg-white text-black">
          {targetWord}
        </span>
      </div>
      <div className="inline-grid w-fit grid-cols-5 grid-rows-6 gap-3 p-6 relative">
        <div
          className={`${
            isVisible ? "opacity-100" : "opacity-0"
          } transition-opacity duration-700 z-50 ease-out absolute w-full flex justify-center top-14`}
        >
          <div className="text-center text-3xl bg-white px-8 py-2 text-black font-semibold">
            Not a word!
          </div>
        </div>
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

        <input
          onKeyDown={handleKeyDown}
          value={userInput}
          onChange={updateBoard}
          type="text"
          maxLength={5}
          className="rounded-md border-2 border-red-700 bg-slate-800 absolute top-0 left-0 w-full h-full opacity-0 z-1000"
        />
        {/* <button
            onClick={submitRow}
            className="m-1 h-8 w-20 rounded-md border-2 border-black bg-red-400 px-[2px]"
          >
            Enter
          </button> */}
      </div>
      <button
        onClick={resetGame}
        className="ml-[22px] mr-[22px] text-black text-3xl rounded-lg border-4 border-red-800 bg-white "
      >
        Reset
      </button>
    </div>
  );
}
