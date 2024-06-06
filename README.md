# Password Generator

## Overview

The Password Generator is a web application designed to help users create secure passwords. The application allows users to customize the length and complexity of the passwords and provides real-time feedback on the strength of the generated passwords. Additionally, it offers useful security tips to educate users about best practices for password creation.

## Features

- **Password Generation**: Generate random passwords based on user-defined criteria such as length, inclusion of numbers, and special characters.
- **Password Strength Evaluation**: Real-time evaluation of password strength based on length, character variety, common patterns, and breach criteria.
- **Security Tips**: Display rotating security tips to educate users about password best practices.
- **Responsive Design**: The application is fully responsive and works well on both mobile and desktop devices.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **Vite**: A fast build tool for modern web projects.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.

## Components

### App Component

The main component that holds the entire application together. It manages the state for password criteria, generates passwords, and displays other components.

### Generator Component

Handles the UI for generating passwords based on user-selected criteria and allows users to copy the generated password to the clipboard.

### SecurityTips Component

Displays rotating security tips to educate users about password best practices.

### PasswordEvaluation Component

Evaluates the strength of the generated password in real-time and provides feedback on its security level.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/password-generator.git
   cd password-generator
   npm install
   npm run dev
   ```