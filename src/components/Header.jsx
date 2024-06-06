import React from "react";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import logo  from "../assets/logo.png";
const Header = () => {
return (
    <header className="w-full bg-yellow-400 flex justify-between items-center p-4">
        <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full mr-4">
                <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-lg font-bold text-black">PassWorld</h1>
        </div>
        <div className="flex items-center space-x-4">
            <a href="https://github.com/muhammad-hassan31144" target="_blank" rel="noopener noreferrer">
                <FiGithub size={24} className="text-black hover:text-gray-700" />
            </a>
            <a href="https://linkedin.com/in/muhammad-hassan31144" target="_blank" rel="noopener noreferrer">
                <FiLinkedin size={24} className="text-black hover:text-gray-700" />
            </a>
        </div>
    </header>
);
};

export default Header;
