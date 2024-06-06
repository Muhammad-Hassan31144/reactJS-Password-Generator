import React, { useState, useEffect } from "react";

const SecurityTips = () => {
  const tips = [
    "Use a mix of letters, numbers, and special characters.",
    "Avoid using easily guessable information like names or birthdays.",
    "Use different passwords for different accounts.",
    "Change your passwords regularly.",
    "Use a password manager to keep track of your passwords.",
  ];

  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prevTip) => (prevTip + 1) % tips.length);
    }, 5000); // Change tip every 5 seconds

    return () => clearInterval(tipInterval);
  }, [tips.length]);

  return (
    <div className="bg-blue-200 p-4 rounded-lg mt-4 w-full md:w-auto">
      <h2 className="text-xl font-bold text-blue-700 mb-2">Security Tips</h2>
      <div className="text-blue-600">{tips[currentTip]}</div>
    </div>
  );
};

export default SecurityTips;
