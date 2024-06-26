import { useState, useCallback } from "react";
import Generator from "./components/Generator";
import Header from "./components/Header";
import TitleChange from "./components/TitleChange";

function App() {
  const [length, setLength] = useState(12);
  const [numberPerm, setNumberPerm] = useState(false);
  const [specialcharPerm, setSpecialCharPerm] = useState(false);
  const [password, setPassword] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const getRandomValue = (max) => {
    if (window.crypto) {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return array[0] % max;
    }
    return Math.floor(Math.random() * max);
  };

  const passwordGen = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let numbers = "0123456789";
    let specials = "~`!@#$%^&*()-_+=[]{}|?\":;/><.,'";

    // Function to shuffle characters in a string
    const shuffleString = (input) => {
      const array = input.split("");
      for (let i = array.length - 1; i > 0; i--) {
        const j = getRandomValue(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array.join("");
    };

    // Shuffle character sets
    str = shuffleString(str);
    numbers = shuffleString(numbers);
    specials = shuffleString(specials);

    // Combine character sets based on conditions
    if (numberPerm) str += numbers;
    if (specialcharPerm) str += specials;

    // Generate password
    for (let i = 0; i < length; i++) {
      let random_char = getRandomValue(str.length);
      pass += str.charAt(random_char);
    }

    setPassword(pass);
    setIsGenerating(false);
  }, [length, numberPerm, specialcharPerm]);

  const handleGeneratePassword = () => {
    setIsGenerating(true);
    setTimeout(passwordGen, Math.floor(Math.random() * 2000) + 1000); // 1-3 second delay
  };

  return (
    <div className="min-h-screen w-full bg-green-300 flex flex-col justify-normal items-center border border-indigo-800 p-4">
      <TitleChange />
      <Header />
      <div className="flex flex-col justify-center items-center w-full md:w-2/3 mt-8">
        
        <Generator
          password={password}
          length={length}
          numberPerm={numberPerm}
          specialcharPerm={specialcharPerm}
          setLength={setLength}
          setNumberPerm={setNumberPerm}
          setSpecialCharPerm={setSpecialCharPerm}
          isGenerating={isGenerating}
          handleGeneratePassword={handleGeneratePassword}
        />
      </div>
    </div>
  );
}

export default App;
