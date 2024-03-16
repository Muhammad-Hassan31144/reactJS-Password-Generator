/* eslint-disable react/prop-types */
import { useCallback, useRef } from "react";

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

    <div className="bg-emerald-700 flex flex-col justify-center items-center p-4 h-4/6 sm:w-10/12">
      
    <div className="bg-emerald-700 ">
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
    </div>
    </div>
  );
};

export default Generator;
