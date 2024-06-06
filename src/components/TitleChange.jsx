import { useEffect } from "react";

const TitleChange = () => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "Sshhhhhhhh! The secret is hidden here!";
      } else {
        document.title = "Passworld: Your Password Generator";
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
};

export default TitleChange;
