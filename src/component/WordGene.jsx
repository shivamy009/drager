import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

const WordGene = () => {
  const [words, setWords] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [draggingWordId, setDraggingWordId] = useState(null);

  const wordInputRef = useRef(null);

  const addWord = () => {
    const word = wordInputRef.current.value.trim();
    if (word !== "") {
      const newWord = {
        id: uuidv4(),
        text: word,
        size: 16,
        position: { x: 100, y: 100 },
      };
      setWords((prevWords) => [...prevWords, newWord]);
      setUndoStack((prevUndo) => [...prevUndo, words]);
      wordInputRef.current.value = "";
    }
  };

  const increaseSize = () => {
    if (words.length > 0) {
      const lastWordId = words[words.length - 1].id;
      setWords((prevWords) =>
        prevWords.map((word) =>
          word.id === lastWordId ? { ...word, size: word.size + 4 } : word
        )
      );
    }
  };

  const decreaseSize = () => {
    if (words.length > 0) {
      const lastWordId = words[words.length - 1].id;
      setWords((prevWords) =>
        prevWords.map((word) =>
          word.id === lastWordId && word.size > 4
            ? { ...word, size: word.size - 4 }
            : word
        )
      );
    }
  };

  const handleMouseDown = (e, id) => {
    e.preventDefault();
    setDraggingWordId(id);
  };

  const handleMouseMove = (e) => {
    if (draggingWordId) {
      setWords((prevWords) =>
        prevWords.map((word) =>
          word.id === draggingWordId
            ? {
                ...word,
                position: {
                  x: e.clientX - 50, // Adjust based on your needs
                  y: e.clientY - 20, // Adjust based on your needs
                },
              }
            : word
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDraggingWordId(null);
  };

  const undo = () => {
    if (undoStack.length > 0) {
      const lastState = undoStack.pop();
      setWords(lastState);
      setUndoStack([...undoStack]);
    }
  };

  const deleteWord = (id) => {
    setWords((prevWords) => prevWords.filter((word) => word.id !== id));
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-gray-100"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="w-4/5 h-full p-4 relative border-2 border-gray-400 rounded-lg">
        <div className="mb-4 flex space-x-2 justify-center">
          <input
            ref={wordInputRef}
            type="text"
            placeholder="Enter a word"
            className="border border-gray-300 p-2 rounded"
          />
          <button
            onClick={addWord}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Word
          </button>
          <button
            onClick={undo}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Undo
          </button>
          <button
            onClick={increaseSize}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            +
          </button>
          <button
            onClick={decreaseSize}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            -
          </button>
        </div>

        {words.map((word) => (
          <div
            key={word.id}
            style={{
              fontSize: `${word.size}px`,
              left: `${word.position.x}px`,
              top: `${word.position.y}px`,
            }}
            className="absolute cursor-move flex items-center space-x-2"
            onMouseDown={(e) => handleMouseDown(e, word.id)}
          >
            <span>{word.text}</span>
            <button
              onClick={() => deleteWord(word.id)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordGene;
