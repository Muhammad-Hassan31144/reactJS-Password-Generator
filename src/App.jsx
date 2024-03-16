import { useState, useCallback, useEffect } from "react";
import Generator from "./components/Generator";
function App() {
  const [length, setLength] = useState(8);
  const [numberPerm, setNumberPerm] = useState(false);
  const [specialcharPerm, setSpecialCharPerm] = useState(false);
  const [password, setPassword] = useState("");

  const passwordGen = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let numbers = "0123456789";
    let specials = "~`!@#$%^&*()-_+=[]{}|?\":;/><.,'";

    // Function to shuffle characters in a string
    const shuffleString = (input) => {
      const array = input.split("");
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
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
      let random_char = Math.floor(Math.random() * str.length);
      pass += str.charAt(random_char);
    }

    setPassword(pass);
  }, [length, numberPerm, specialcharPerm, setPassword]);

  useEffect(() => {
    passwordGen();
  }, [passwordGen]);
  return (
    <div className="h-screen w-full bg-green-300 flex flex-col justify-normal md:justify-center items-center border border-indigo-800">
   
    <h1 className="text-2xl md:text-4xl text-white text-left font-bold m-2 p-2 md:m-4 md:p-4">
      Password Generator
    </h1>
      <Generator
        password={password}
        length={length}
        numberPerm={numberPerm}
        specialcharPerm={specialcharPerm}
        setLength={setLength}
        setNumberPerm={setNumberPerm}
        setSpecialCharPerm={setSpecialCharPerm}
      />
    </div>
  );
}

export default App;
