/* eslint-disable react/prop-types */
import { useCallback, useRef, useState, useEffect } from "react";
import Button from "./Button";

const PasswordLengthSlider = ({ length, setLength }) => {
  const percentage = ((length - 8) / (32 - 8)) * 100;

  const bgColor = `linear-gradient(90deg, #48BB78 ${percentage}%, #2D3748 ${percentage}%)`;

  return (
    <div className="mt-2">
      <input
        id="inputRange"
        type="range"
        min={8}
        max={window.innerWidth < 700 ? 20 : 32}
        value={length}
        onChange={(e) => setLength(parseInt(e.target.value, 10))}
        className="w-full h-2 rounded-full outline-none"
        style={{ background: bgColor }}
      />
      <label
        htmlFor="inputRange"
        className="text-md font-bold text-green-200 block mt-2"
      >
        Length : {length}
      </label>
    </div>
  );
};

const evaluatePasswordStrength = (password) => {
  const lengthCriteria = password.length >= 12;
  const numberCriteria = /\d/.test(password);
  const specialCharCriteria = /[~`!@#$%^&*()-_+=\[\]{}|?":;/><.,']/.test(password);
  const uppercaseCriteria = /[A-Z]/.test(password);
  const lowercaseCriteria = /[a-z]/.test(password);
  const varietyCriteria = [numberCriteria, specialCharCriteria, uppercaseCriteria, lowercaseCriteria].filter(Boolean).length >= 3;

  // Check for common patterns (repeated characters, sequences)
  const patternsCriteria = !/(.)\1{2,}|(?:012|123|234|345|456|567|678|789|890|098|987|876|765|654|543|432|321|210)/.test(password);

  // Example of checking against known breached passwords (you should implement an API call for a real check)
  const breachedPasswords = ["123456", "password", "12345678", "qwerty", "123456789", "12345", "1234", "111111", "1234567", "dragon"];
  const breachCriteria = !breachedPasswords.includes(password);

  const criteriaMet = [lengthCriteria, varietyCriteria, patternsCriteria, breachCriteria].filter(Boolean).length;
  const maxCriteria = 4; // Adjust based on the number of criteria

  return criteriaMet / maxCriteria;
};

const PasswordEvaluation = ({ password }) => {
  const [strength, setStrength] = useState(0);
  const strengthText = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];

  useEffect(() => {
    const strengthValue = evaluatePasswordStrength(password);
    setStrength(strengthValue);
  }, [password]);

  return (
    <div className="bg-yellow-200 p-2 rounded-lg mt-2 w-full">
      <div className="flex justify-between">
      <h2 className="text-sm font-bold text-yellow-700 mb-1">Password Strength</h2>
      <div className="text-sm text-yellow-600">{strengthText[Math.round(strength * 5)]}</div>
      </div>
      <div className="w-full bg-gray-300 h-2 rounded-full mt-1">
        <div
          className={`h-2 rounded-full ${
            strength === 0.2 ? "bg-red-500" : strength === 0.4 ? "bg-orange-500" : strength === 0.6 ? "bg-yellow-500" : strength === 0.8 ? "bg-green-500" : "bg-green-700"
          }`}
          style={{ width: `${strength * 100}%` }}
        />
      </div>
    </div>
  );
};

const Generator = ({
  password,
  length,
  numberPerm,
  specialCharPerm,
  setLength,
  setNumberPerm,
  setSpecialCharPerm,
  isGenerating,
  handleGeneratePassword,
}) => {
  const passwordRef = useRef(null);
  const copyPasstoClipboard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, 30);
    window.navigator.clipboard.writeText(password);
  }, [password]);

  return (
    <div className="bg-emerald-700 flex flex-col justify-center items-center p-4 w-full sm:w-10/12 md:w-8/12 lg:w-6/12">
      <div className="bg-emerald-700 w-full">
        <div className="rounded-lg bg-gray-200 p-2 w-full mb-4">
          <div className="flex">
            <input
              type="text"
              value={password}
              readOnly
              className="w-full rounded-l-lg bg-white pl-2 text-base font-semibold outline-0"
              ref={passwordRef}
            />
            <button
              onClick={copyPasstoClipboard}
              className="bg-blue-500 p-2 rounded-r-lg text-white font-semibold hover:bg-blue-800 transition-colors"
            >
              Copy
            </button>
          </div>
        </div>
        <div className="w-full mb-4">
          <PasswordLengthSlider length={length} setLength={setLength} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex my-1 items-center justify-between">
            <label
              className="text-md font-bold text-green-200 mr-1"
              htmlFor="number"
            >
              Add Numbers
            </label>
            <input
              className="w-8 h-8"
              type="checkbox"
              defaultChecked={numberPerm}
              name="NumberAddition"
              id="number"
              onClick={() => {
                setNumberPerm((prev) => !prev);
              }}
            />
          </div>

          <div className="flex my-1 items-center justify-between">
            <label
              className="text-md font-bold text-green-200 mr-1"
              htmlFor="specialChar"
            >
              Add Special Characters
            </label>
            <input
              className="w-8 h-8"
              type="checkbox"
              name="specialcharacter"
              id="specialChar"
              defaultChecked={specialCharPerm}
              onClick={() => {
                setSpecialCharPerm((prev) => !prev);
              }}
            />
          </div>
        </div>
        <Button onClick={handleGeneratePassword} isGenerating={isGenerating} />
        {password && <PasswordEvaluation password={password} />}
      </div>
    </div>
  );
};

export default Generator;
