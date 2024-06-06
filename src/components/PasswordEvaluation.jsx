import React, { useState, useEffect } from "react";

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
    const evaluate = async () => {
      const strengthValue = evaluatePasswordStrength(password);
      setStrength(strengthValue);
    };
    evaluate();
  }, [password]);

  return (
    <div className="bg-yellow-200 p-4 rounded-lg mt-4 w-full md:w-1/2">
      <h2 className="text-xl font-bold text-yellow-700 mb-2">Password Strength</h2>
      <div className="text-yellow-600">{strengthText[Math.round(strength * 5)]}</div>
      <div className="w-full bg-gray-300 h-2 rounded-full mt-2">
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

export default PasswordEvaluation;
