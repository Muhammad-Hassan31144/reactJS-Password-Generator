/* eslint-disable react/prop-types */
import { useCallback, useRef } from "react";

const PasswordLengthSlider = ({ length, setLength }) => {
  const percentage = ((length - 8) / (32 - 8)) * 100;

  const bgColor = `linear-gradient(90deg, #48BB78 ${percentage}%, #2D3748 ${percentage}%)`;

  return (
    <div className="">
      <div className="mt-2">
        <input
          id="inputRange"
          type="range"
          min={8}
          max={32}
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value, 10))}
          className="appearance-none w-full h-2 rounded-full outline-none"
          style={{ background: bgColor }}
        />
      </div>
      <label
        htmlFor="inputRange"
        className="text-md font-bold text-green-200 mr-1"
      >
        Length : {length}
      </label>
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
}) => {
  const passwordRef = useRef(null);
  const copyPasstoClipboard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, 30);
    window.navigator.clipboard.writeText(password);
  }, [password]);

  return (
    <div className="flex flex-col justify-center items-center bg-emerald-700 w-2/3 h-1/2">
      <div>
        <h1 className="text-4xl text-white font-bold mb-2">
          Password Generator
        </h1>
      </div>
      <div className="flex items-center justify-center p-2 w-full">
        <div className="rounded-lg bg-gray-200 p-2 w-1/2">
          <div className="flex ">
            <input
              type="text"
              value={password}
              readOnly
              className=" w-full rounded-tl-lg rounded-bl-lg bg-white pl-2 text-base font-semibold outline-0"
              ref={passwordRef}
            />
            <button
              onClick={copyPasstoClipboard}
              className="bg-blue-500 p-2 rounded-tr-lg rounded-br-lg text-white font-semibold hover:bg-blue-800 transition-colors"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <PasswordLengthSlider length={length} setLength={setLength} />
        <div>
          <div className="flex my-1 items-center justify-between">
            <label
              className="text-md font-bold text-green-200 mr-1"
              htmlFor="number"
            >
              Add Numbers
            </label>
            <input
              className="dark:border-white-400/20 dark:scale-100 transition-all duration-500 ease-in-out dark:hover:scale-110 dark:checked:scale-100 w-8 h-8"
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
              className="dark:border-white-400/20 dark:scale-100 transition-all duration-500 ease-in-out dark:hover:scale-110 dark:checked:scale-100 w-8 h-8"
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
      </div>
    </div>
  );
};

export default Generator;
