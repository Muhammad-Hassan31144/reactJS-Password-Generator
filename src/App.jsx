import { useState, useCallback, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Generator from "./components/Generator";
import Header from "./components/Header";
import TitleChange from "./components/TitleChange";
import PasswordStrengthMeter from "./components/PasswordStrengthMeter";
import PasswordHistory from "./components/PasswordHistory";
import ConfigPanel from "./components/ConfigPanel";
import { savePasswordToAPI, validatePasswordAgainstPolicy } from "./services/api";
import { encryptData } from "./utils/encryption";
import { usePasswordPolicy } from "./hooks/usePasswordPolicy";

function App() {
  // Core password states
  const [password, setPassword] = useState("");
  const [passwordHistory, setPasswordHistory] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Password configuration
  const [length, setLength] = useState(16); // Increased default length for better security
  const [numberPerm, setNumberPerm] = useState(true); // Enable by default
  const [specialcharPerm, setSpecialCharPerm] = useState(true); // Enable by default
  const [uppercasePerm, setUppercasePerm] = useState(true); // New option
  const [lowercasePerm, setLowercasePerm] = useState(true); // New option
  const [avoidAmbiguous, setAvoidAmbiguous] = useState(false); // New option
  
  // Security and compliance
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [enforcePolicy, setEnforcePolicy] = useState(true);
  const { policySettings, policyEnabled, setPolicyEnabled } = usePasswordPolicy();
  
  // Enterprise integration
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const [enterpriseMode, setEnterpriseMode] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [apiKey, setApiKey] = useState("");

  // Update document title when component mounts
  useEffect(() => {
    document.title = "Secure Password Generator";
  }, []);

  // Get cryptographically secure random values
  const getSecureRandomValue = (max) => {
    if (window.crypto && window.crypto.getRandomValues) {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return array[0] % max;
    }
    // Fallback with warning
    console.warn("Crypto API not available, using less secure Math.random()");
    return Math.floor(Math.random() * max);
  };

  // Shuffle an array using Fisher-Yates algorithm with secure random
  const secureShuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = getSecureRandomValue(i + 1);
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Generate password with improved security and character selection
  const passwordGen = useCallback(() => {
    try {
      // Character sets
      const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
      const lowercase = "abcdefghijkmnopqrstuvwxyz";
      const numbers = "23456789";
      const specials = "!@#$%^&*()-_=+[]{}|;:,.<>?";
      
      // Remove ambiguous characters if option selected
      const ambiguousChars = "Il1O0";
      const getFilteredSet = (set) => avoidAmbiguous 
        ? set.split('').filter(c => !ambiguousChars.includes(c)).join('')
        : set;
      
      // Apply filters to character sets
      const upperSet = uppercasePerm ? getFilteredSet(uppercase) : "";
      const lowerSet = lowercasePerm ? getFilteredSet(lowercase) : "";
      const numberSet = numberPerm ? getFilteredSet(numbers) : "";
      const specialSet = specialcharPerm ? specials : "";
      
      // Ensure at least one character set is selected
      if (upperSet === "" && lowerSet === "" && numberSet === "" && specialSet === "") {
        throw new Error("At least one character set must be enabled");
      }
      
      // Build character pool
      const charPool = upperSet + lowerSet + numberSet + specialSet;
      if (charPool.length === 0) {
        throw new Error("Character pool is empty");
      }
      
      // Ensure minimum requirements based on policy
      let pass = [];
      
      // Add at least one character from each enabled set to ensure requirements
      if (uppercasePerm && upperSet.length > 0) {
        pass.push(upperSet.charAt(getSecureRandomValue(upperSet.length)));
      }
      if (lowercasePerm && lowerSet.length > 0) {
        pass.push(lowerSet.charAt(getSecureRandomValue(lowerSet.length)));
      }
      if (numberPerm && numberSet.length > 0) {
        pass.push(numberSet.charAt(getSecureRandomValue(numberSet.length)));
      }
      if (specialcharPerm && specialSet.length > 0) {
        pass.push(specialSet.charAt(getSecureRandomValue(specialSet.length)));
      }
      
      // Fill remaining length from the pool
      while (pass.length < length) {
        pass.push(charPool.charAt(getSecureRandomValue(charPool.length)));
      }
      
      // Shuffle the password array for randomness
      pass = secureShuffleArray(pass);
      const finalPassword = pass.join("");
      
      // Validate against policy if enabled
      if (enforcePolicy && policyEnabled) {
        const validationResult = validatePasswordAgainstPolicy(finalPassword, policySettings);
        if (!validationResult.valid) {
          throw new Error(`Policy validation failed: ${validationResult.reason}`);
        }
      }
      
      // Set password and update history
      setPassword(finalPassword);
      updatePasswordHistory(finalPassword);
      
      // Handle enterprise integration
      if (enterpriseMode && autoSaveEnabled) {
        handlePasswordSave(finalPassword);
      }
      
      return finalPassword;
    } catch (error) {
      toast.error(`Password generation failed: ${error.message}`);
      console.error("Password generation error:", error);
      return "";
    } finally {
      setIsGenerating(false);
    }
  }, [
    length, 
    numberPerm, 
    specialcharPerm, 
    uppercasePerm, 
    lowercasePerm, 
    avoidAmbiguous,
    enforcePolicy,
    policyEnabled,
    policySettings,
    enterpriseMode,
    autoSaveEnabled
  ]);

  // Update password history
  const updatePasswordHistory = (newPassword) => {
    if (!newPassword) return;
    
    const timestamp = new Date().toISOString();
    setPasswordHistory(prev => {
      const updated = [
        { password: newPassword, timestamp, strength: passwordStrength },
        ...prev.slice(0, 9) // Keep last 10 passwords
      ];
      
      // Store encrypted history in localStorage if not in enterprise mode
      if (!enterpriseMode) {
        try {
          const encryptedHistory = encryptData(JSON.stringify(updated));
          localStorage.setItem('securePasswordHistory', encryptedHistory);
        } catch (error) {
          console.error("Failed to save password history:", error);
        }
      }
      
      return updated;
    });
  };

  // Handle password generation with loading state
  const handleGeneratePassword = () => {
    setIsGenerating(true);
    // Small delay for UX with minimum entropy collection
    setTimeout(() => {
      passwordGen();
    }, 600);
  };

  // Save password to external API for enterprise integration
  const handlePasswordSave = async (passwordToSave) => {
    if (!apiEndpoint || !enterpriseMode) return;
    
    try {
      const result = await savePasswordToAPI({
        password: passwordToSave,
        endpoint: apiEndpoint,
        apiKey,
        metadata: {
          strength: passwordStrength,
          generated: new Date().toISOString(),
          config: {
            length,
            hasNumbers: numberPerm,
            hasSpecial: specialcharPerm,
            hasUppercase: uppercasePerm,
            hasLowercase: lowercasePerm
          }
        }
      });
      
      if (result.success) {
        toast.success("Password saved to security system");
      } else {
        throw new Error(result.message || "API save failed");
      }
    } catch (error) {
      toast.error(`Failed to save to security system: ${error.message}`);
      console.error("API integration error:", error);
    }
  };

  // Copy password to clipboard with security measures
  const copyToClipboard = async () => {
    if (!password) return;
    
    try {
      await navigator.clipboard.writeText(password);
      toast.success("Password copied to clipboard");
      
      // Security measure: Clear clipboard after 60 seconds
      setTimeout(() => {
        navigator.clipboard.writeText("");
      }, 60000);
    } catch (error) {
      toast.error("Failed to copy password");
      console.error("Clipboard error:", error);
    }
  };

  // Clear sensitive data on unmount
  useEffect(() => {
    return () => {
      setPassword("");
      setApiKey("");
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-blue-200 flex flex-col justify-normal items-center p-4">
      <TitleChange />
      <Header />
      
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex flex-col justify-center items-center w-full md:w-3/4 lg:w-2/3 xl:w-1/2 mt-4 gap-6">
        <Generator
          password={password}
          length={length}
          numberPerm={numberPerm}
          specialcharPerm={specialcharPerm}
          uppercasePerm={uppercasePerm}
          lowercasePerm={lowercasePerm}
          avoidAmbiguous={avoidAmbiguous}
          setLength={setLength}
          setNumberPerm={setNumberPerm}
          setSpecialCharPerm={setSpecialCharPerm}
          setUppercasePerm={setUppercasePerm}
          setLowercasePerm={setLowercasePerm}
          setAvoidAmbiguous={setAvoidAmbiguous}
          isGenerating={isGenerating}
          handleGeneratePassword={handleGeneratePassword}
          copyToClipboard={copyToClipboard}
        />
        
        <PasswordStrengthMeter 
          password={password} 
          setPasswordStrength={setPasswordStrength} 
        />
        
        {enterpriseMode && (
          <ConfigPanel 
            enforcePolicy={enforcePolicy}
            setEnforcePolicy={setEnforcePolicy}
            policyEnabled={policyEnabled}
            setPolicyEnabled={setPolicyEnabled}
            policySettings={policySettings}
            apiEndpoint={apiEndpoint}
            setApiEndpoint={setApiEndpoint}
            apiKey={apiKey}
            setApiKey={setApiKey}
            autoSaveEnabled={autoSaveEnabled}
            setAutoSaveEnabled={setAutoSaveEnabled}
          />
        )}
        
        <PasswordHistory 
          passwordHistory={passwordHistory}
          setPasswordHistory={setPasswordHistory}
          setPassword={setPassword}
        />
      </div>
    </div>
  );
}

export default App;