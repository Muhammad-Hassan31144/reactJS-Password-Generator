import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Eye, EyeOff, Copy, Check, Trash } from "lucide-react";

const PasswordHistory = ({ passwordHistory, setPasswordHistory, setPassword }) => {
  const [showPasswords, setShowPasswords] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  
  if (!passwordHistory || passwordHistory.length === 0) {
    return null;
  }
  
  const copyPasswordToClipboard = async (password, index) => {
    try {
      await navigator.clipboard.writeText(password);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error("Failed to copy password:", error);
    }
  };
  
  const useHistoricalPassword = (password) => {
    setPassword(password);
  };
  
  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear your password history?")) {
      setPasswordHistory([]);
      localStorage.removeItem('securePasswordHistory');
    }
  };
  
  // Function to mask password 
  const maskPassword = (password) => {
    return "•".repeat(password.length);
  };
  
  // Get strength label and color
  const getStrengthInfo = (strength) => {
    switch(strength) {
      case 0: return { text: "Very Weak", color: "text-red-500" };
      case 1: return { text: "Weak", color: "text-orange-500" };
      case 2: return { text: "Fair", color: "text-yellow-500" };
      case 3: return { text: "Good", color: "text-blue-500" };
      case 4: return { text: "Strong", color: "text-green-500" };
      default: return { text: "Unknown", color: "text-gray-500" };
    }
  };
  
  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Recent Passwords</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPasswords(!showPasswords)}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
            aria-label={showPasswords ? "Hide passwords" : "Show passwords"}
          >
            {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
            {showPasswords ? "Hide" : "Show"}
          </button>
          <button
            onClick={clearHistory}
            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
            aria-label="Clear history"
          >
            <Trash size={16} />
            Clear
          </button>
        </div>
      </div>
      
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {passwordHistory.map((entry, index) => {
          const { text: strengthText, color: strengthColor } = getStrengthInfo(entry.strength);
          
          return (
            <div 
              key={index} 
              className="flex flex-col p-2 border border-gray-200 rounded hover:bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <div className="font-mono text-sm truncate max-w-md">
                  {showPasswords ? entry.password : maskPassword(entry.password)}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => useHistoricalPassword(entry.password)}
                    className="text-xs py-1 px-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Use
                  </button>
                  <button 
                    onClick={() => copyPasswordToClipboard(entry.password, index)}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Copy password"
                  >
                    {copiedIndex === index ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                <span className={`${strengthColor}`}>{strengthText}</span>
                <span>
                  {entry.timestamp ? formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true }) : "Unknown time"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordHistory;