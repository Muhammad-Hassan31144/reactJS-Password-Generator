import { useRef, useState, useEffect } from "react";
import { FiLock } from "react-icons/fi";
import { motion } from "framer-motion";
import { Tooltip as ReactTooltip } from "react-tooltip";

const TARGET_TEXT = "Generate Password";
const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;
const CHARS = "!@#$%^&*():{};|,.<>/?";

const tips = [
  "Use a mix of letters, numbers, and special characters.",
  "Avoid using easily guessable information like names or birthdays.",
  "Use different passwords for different accounts.",
  "Change your passwords regularly.",
  "Use a password manager to keep track of your passwords.",
];

const Button = ({ onClick, isGenerating }) => {
  const intervalRef = useRef(null);
  const [text, setText] = useState(TARGET_TEXT);
  const [currentTip, setCurrentTip] = useState(0);
  const [triggerScramble, setTriggerScramble] = useState(false);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prevTip) => (prevTip + 1) % tips.length);
    }, 5000); // Change tip every 5 seconds

    return () => clearInterval(tipInterval);
  }, []);

  useEffect(() => {
    if (triggerScramble) {
      scramble();
    }
  }, [triggerScramble]);

  const scramble = () => {
    let pos = 0;
    intervalRef.current = setInterval(() => {
      const scrambled = TARGET_TEXT.split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) {
            return char;
          }
          const randomCharIndex = Math.floor(Math.random() * CHARS.length);
          const randomChar = CHARS[randomCharIndex];
          return randomChar;
        })
        .join("");
      setText(scrambled);
      pos++;
      if (pos >= TARGET_TEXT.length * CYCLES_PER_LETTER) {
        stopScramble();
      }
    }, SHUFFLE_TIME);
  };

  const stopScramble = () => {
    clearInterval(intervalRef.current || undefined);
    setText(TARGET_TEXT);
  };

  return (
    <motion.div className="relative group">
      <motion.button
        whileHover={{
          scale: 1.025,
        }}
        whileTap={{
          scale: 0.975,
        }}
        onMouseEnter={() => setTriggerScramble(true)}
        onMouseLeave={() => setTriggerScramble(false)}
        onTouchStart={() => setTriggerScramble(true)}
        onTouchEnd={() => setTriggerScramble(false)}
        onClick={onClick}
        className={`relative overflow-hidden rounded-lg border-[1px] border-emerald-500 bg-emerald-600 px-4 py-2 font-mono font-medium uppercase text-neutral-100 transition-colors hover:bg-emerald-700 ${
          isGenerating ? "opacity-50 cursor-not-allowed" : ""
        }`}
        data-tooltip-id="securityTip"
        disabled={isGenerating}
      >
        <div className="relative z-10 flex items-center gap-2">
          <FiLock />
          <span>{text}</span>
        </div>
        <motion.span
          initial={{
            y: "100%",
          }}
          animate={{
            y: "-100%",
          }}
          transition={{
            repeat: Infinity,
            repeatType: "mirror",
            duration: 1,
            ease: "linear",
          }}
          className="duration-300 absolute inset-0 z-0 scale-125 bg-gradient-to-t from-emerald-400/0 from-40% via-emerald-400/100 to-emerald-400/0 to-60% opacity-0 transition-opacity group-hover:opacity-100"
        />
      </motion.button>
      <ReactTooltip
        id="securityTip"
        place="right"
        effect="solid"
        content={tips[currentTip]}
      />
    </motion.div>
  );
};

export default Button;
