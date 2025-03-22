// components/Generator.js
import { useState, useEffect } from "react";
import { Copy, RefreshCcw, Check, Save, Download, Share } from "lucide-react";

const Generator = ({
  password,
  length,
  numberPerm,
  specialcharPerm,
  uppercasePerm,
  lowercasePerm,
  avoidAmbiguous,
  setLength,
  setNumberPerm,
  setSpecialCharPerm,
  setUppercasePerm,
  setLowercasePerm,
  setAvoidAmbiguous,
  isGenerating,
  handleGeneratePassword,
  copyToClipboard
}) => {
  const [copied, setCopied] = useState(false);
  
  // Handle copy button click
  const handleCopy = async () => {
    if (!password) return;
    
    await copyToClipboard();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Save password as text file
  const saveAsFile = () => {
    if (!password) return;
    
    const blob = new Blob([password], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `password-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Handle sharing (if supported)
  const sharePassword = async () => {
    if (!password || !navigator.share) return;
    
    try {
      await navigator.share({
        title: 'Secure Password',
        text: 'Here is your secure password:',
        url: window.location.href
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };
  
  // Set document title
  useEffect(() => {
    document.title = "Secure Password Generator";
  }, []);
  
  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">Generate Secure Password</h3>
      
      {/* Password Output Field */}
      <div className="relative mb-6">
        <input
          type="text"
          className="w-full py-3 px-4 bg-gray-100 border border-gray-300 rounded-lg font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          placeholder="Your secure password will appear here"
          readOnly
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
          {password && (
            <>
              <button
                onClick={handleCopy}
                className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                title="Copy to clipboard"
              >
                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
              </button>
              <button
                onClick={saveAsFile}
                className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                title="Save as file"
              >
                <Download size={18} />
              </button>
              {navigator.share && (
                <button
                  onClick={sharePassword}
                  className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  title="Share"
                >
                  <Share size={18} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Password Options */}
      <div className="mb-6 space-y-4">
        {/* Password Length */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="length" className="text-sm font-medium">
              Length: {length} characters
            </label>
            <input
              type="number"
              id="length-number"
              min="6"
              max="128"
              value={length}
              onChange={e => setLength(parseInt(e.target.value) || 12)}
              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
          <input
            type="range"
            id="length"
            min="6"
            max="64"
            value={length}
            onChange={e => setLength(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>6</span>
            <span>16</span>
            <span>32</span>
            <span>48</span>
            <span>64</span>
          </div>
        </div>
        
        {/* Character Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="uppercase"
              checked={uppercasePerm}
              onChange={() => setUppercasePerm(!uppercasePerm)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="uppercase" className="ml-2 text-sm font-medium text-gray-700">
              Include Uppercase (A-Z)
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="lowercase"
              checked={lowercasePerm}
              onChange={() => setLowercasePerm(!lowercasePerm)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="lowercase" className="ml-2 text-sm font-medium text-gray-700">
              Include Lowercase (a-z)
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="numbers"
              checked={numberPerm}
              onChange={() => setNumberPerm(!numberPerm)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="numbers" className="ml-2 text-sm font-medium text-gray-700">
              Include Numbers (0-9)
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="special"
              checked={specialcharPerm}
              onChange={() => setSpecialCharPerm(!specialcharPerm)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="special" className="ml-2 text-sm font-medium text-gray-700">
              Include Special Characters (!@#$)
            </label>
          </div>
          
          <div className="flex items-center md:col-span-2">
            <input
              type="checkbox"
              id="ambiguous"
              checked={avoidAmbiguous}
              onChange={() => setAvoidAmbiguous(!avoidAmbiguous)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="ambiguous" className="ml-2 text-sm font-medium text-gray-700">
              Avoid Ambiguous Characters (Il1O0)
            </label>
          </div>
        </div>
      </div>
      
      {/* Generate Button */}
      <button
        onClick={handleGeneratePassword}
        disabled={isGenerating || (!uppercasePerm && !lowercasePerm && !numberPerm && !specialcharPerm)}
        className={`w-full py-3 px-4 flex items-center justify-center gap-2 rounded-lg text-white font-medium transition ${
          isGenerating || (!uppercasePerm && !lowercasePerm && !numberPerm && !specialcharPerm)
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <RefreshCcw size={20} />
            Generate Secure Password
          </>
        )}
      </button>
      
      {/* Password Validation Errors */}
      {(!uppercasePerm && !lowercasePerm && !numberPerm && !specialcharPerm) && (
        <p className="text-red-500 text-sm mt-2">
          Please select at least one character type.
        </p>
      )}
    </div>
  );
};

export default Generator;
