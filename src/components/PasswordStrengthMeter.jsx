import { useEffect } from "react";
import zxcvbn from "zxcvbn";

const PasswordStrengthMeter = ({ password, setPasswordStrength }) => {
  // Evaluate password strength using zxcvbn
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    const result = zxcvbn(password);
    setPasswordStrength(result.score);
  }, [password, setPasswordStrength]);
  
  // If no password, don't show meter
  if (!password) return null;
  
  // Get strength score (0-4)
  const strength = zxcvbn(password);
  const score = strength.score;
  
  // Determine label and color based on score
  const getLabel = () => {
    switch(score) {
      case 0: return { text: "Very Weak", color: "bg-red-500" };
      case 1: return { text: "Weak", color: "bg-orange-500" };
      case 2: return { text: "Fair", color: "bg-yellow-500" };
      case 3: return { text: "Good", color: "bg-blue-500" };
      case 4: return { text: "Strong", color: "bg-green-500" };
      default: return { text: "N/A", color: "bg-gray-300" };
    }
  };
  
  const { text, color } = getLabel();
  
  // Get feedback for the user
  const getFeedback = () => {
    if (score >= 3) return null;
    
    const suggestions = strength.feedback.suggestions.slice(0, 2);
    if (suggestions.length === 0) return null;
    
    return (
      <div className="text-sm text-gray-600 mt-1">
        <p>Suggestions:</p>
        <ul className="list-disc list-inside">
          {suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-2">Password Strength</h3>
      
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-300 ease-in-out`}
          style={{ width: `${(score + 1) * 20}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm font-medium">{text}</span>
        <span className="text-xs text-gray-500">
          {score < 3 ? "Not recommended for sensitive accounts" : "Suitable for all accounts"}
        </span>
      </div>
      
      {getFeedback()}
      
      {strength.crack_times_display && (
        <div className="mt-2 text-xs text-gray-600">
          <p>Estimated time to crack: <span className="font-medium">{strength.crack_times_display.offline_fast_hashing_1e10_per_second}</span></p>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;