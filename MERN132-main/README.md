# James Brown Life Sciences

![Project Status](https://img.shields.io/badge/status-production--ready-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![Tech Stack](https://img.shields.io/badge/stack-MERN-teal)

A premium, industry-standard web application built for James Brown Life Sciences. This project demonstrates a production-ready full-stack architecture using the MERN stack (MongoDB, Express, React, Node.js) with a focus on modern UI/UX design, scalability, and clean code principles.

## 🚀 Key Features

### 🎨 Industry-Level UI/UX
- **Glassmorphism Design**: Modern, translucent glass effects on navigation and cards.
- **Premium Typography**: Utilizes `Inter` for interface text and `Playfair Display` for headings, conveying trust and professionalism.
- **Dynamic Animations**: Smooth `fade-in-up` entry animations and interactive hover states.
- **Responsive Layout**: Fully adaptive design for Mobile, Tablet, and Desktop using Tailwind CSS 4.
- **Chatbot Facility**: "JBLS Assistant" powered by Groq (Llama 3) for instant customer support.

### ⚡ Technical Highlights
- **RESTful API**: Robust backend API built with Express.js and clean route architecture.
- **Database Integration**: MongoDB with Mongoose schemas for structured data management.
- **Form Handling**: Secure form submissions for Contact and Career endpoints with validation.
- **Component Architecture**: Reusable, modular React components following best practices.

## 🛠️ Technology Stack

- **Frontend**: 
  - React 19
  - Tailwind CSS 4
  - React Router v7
  - Vite (Build Tool)
- **Backend**: 
  - Node.js
  - Express.js
  - Mongoose (ODM)
- **Database**: 
  - MongoDB
- **AI/ML**:
  - Groq SDK (`groq-sdk`)
  - Llama 3.3 (via Groq Cloud)
- **Tools**: 
  - PostCSS
  - ESLint

## 📂 Project Structure

```bash
james-brown-ls/
├── client/                 # Frontend Application
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, Footer)
│   │   ├── pages/          # Page views (Home, About, Products, etc.)
│   │   ├── assets/         # Static assets
│   │   └── App.jsx         # Main application entry
│   └── tailwind.config.js  # Design system configuration
├── server/                 # Backend API
│   ├── models/             # Mongoose database schemas
│   ├── routes/             # API route handlers
│   ├── index.js            # Server entry point
│   └── .env                # Environment configuration
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- **Node.js**: [Download Here](https://nodejs.org/) (v16 or higher required)
- **MongoDB**: [Download MongoDB Community Server](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **VS Code**: [Download Here](https://code.visualstudio.com/) (Recommended Editor)

### Installation & Running

1. **Clone the repository**
   - Open your terminal or command prompt.
   - Run:
   ```bash
   git clone https://github.com/yourusername/james-brown-ls.git
   ```

2. **Setup Backend**
   - Navigate to the server folder:
   ```bash
   cd server
   ```
   - Install dependencies:
   ```bash
   npm install
   ```
   - Create a `.env` file in the `server` folder and add your keys:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/james_brown_ls
   GROQ_API_KEY=your_groq_api_key_here
   ```
   - Start the server:
   ```bash
   npm start
   ```
   *You should see "Server running on port 5000" and "MongoDB Connected".*

3. **Setup Frontend**
   - Open a **new** terminal window.
   - Navigate to the client folder:
   ```bash
   cd client
   ```
   - Install dependencies:
   ```bash
   npm install
   ```
   > **Note:** This project uses **Tailwind CSS**. This command automatically installs it along with other dependencies.
   - Start the React application:
   ```bash
   npm run dev
   ```
   *The terminal will show a local URL, usually `http://localhost:5173`.*

4. **Access Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## 📡 API Endpoints

| Method | Endpoint      | Description           | Body Parameters |
|:-------|:--------------|:----------------------|:----------------|
| POST   | `/api/contact`| Submit contact form   | `name`, `email`, `message` |
| POST   | `/api/careers`| Submit job application| `name`, `email`, `message`, `resumeLink` |
| POST   | `/api/chat`   | Send chat message     | `message`       |

## 👨‍💻 Developer

Built as a high-fidelity internship project for James Brown Life Sciences.
