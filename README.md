# James Brown Life Sciences — Official Web Platform

> A full-stack pharmaceutical company platform built for James Brown Life Sciences, handling product discovery, bulk order management, career applications, and real-time AI-powered customer support.

![Stack](https://img.shields.io/badge/Stack-MERN-20232A?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=node.js)
![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb)
![AI](https://img.shields.io/badge/AI-Groq%20%2B%20LLaMA%203.3-FF6B35?style=for-the-badge)

---

## 🔒 Private Repository

This is proprietary client work. The source code is not available for download or public use. This repository exists to document the project for portfolio purposes only.

---

## 🌐 Live Site

**[jamesbrownlifesciences.com](https://jamesbrownlifesciences.com)**

---

## 📌 About the Project

James Brown Life Sciences is a pharmaceutical manufacturer and exporter based in Gandhidham, Gujarat, India. They supply 200+ medicine formulations across 6 therapeutic areas to 50+ countries worldwide, holding WHO-GMP, ISO 9001:2015, EU GMP, and FDA registrations.

This platform was built to digitise their entire customer-facing and internal operations — from product browsing and bulk order placement to hiring and 24/7 AI support.

---

## ✨ Features

### 🤖 AI Chatbot (JBLS Assistant)
- Powered by **Groq API** with **LLaMA 3.3 70B Versatile** model
- Custom system prompt trained on company-specific knowledge
- Quick-access chips for common queries
- Typing indicator, unread badge, smooth animations
- Mobile-responsive floating widget

### 🛒 Order Management
- Bulk order placement with product selection
- Real-time order tracking per user
- Admin dashboard to view and manage all orders
- Email notifications via Gmail SMTP on order events

### 👤 Authentication
- JWT-based auth with secure HTTP-only cookies
- Google OAuth 2.0 login integration
- Role-based access control (User / Admin)
- Protected routes on both frontend and backend

### 💊 Product Catalogue
- Browse 200+ pharmaceutical formulations
- Filter by therapeutic area
- Detailed product pages with specifications

### 💼 Careers Module
- Job listings managed by admin
- Application submission with resume upload
- Email notification to HR on new applications

### 📬 Contact & Enquiry
- Contact form with email routing to company inbox
- Emergency contact line prominently displayed
- Location details with Google Maps integration

### 🔐 Admin Dashboard
- Manage products, orders, job postings
- View all user accounts and roles
- Order status updates with automated email triggers

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Routing | React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT, Google OAuth 2.0 |
| AI / Chatbot | Groq API, LLaMA 3.3 70B |
| Email | Nodemailer, Gmail SMTP |
| Hosting | Vercel (frontend), Render (backend) |
| Domain | jamesbrownlifesciences.com |

---

## 🏗 Architecture

```
├── client/                  # React + Vite frontend
│   ├── public/
│   │   └── logojb.svg       # Company logo
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ChatBot.jsx  # AI assistant widget
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Careers.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Checkout.jsx
│   │   │   └── Orders.jsx
│   │   └── context/
│   │       └── AuthContext.jsx
│
└── server/                  # Node.js + Express backend
    ├── routes/
    │   ├── auth.js
    │   ├── orders.js
    │   ├── products.js
    │   ├── careers.js
    │   └── contact.js
    ├── models/
    └── index.js
```

---

## 🤖 AI Chatbot — Technical Detail

The JBLS Assistant is a custom-trained chatbot embedded as a floating widget across the site. It uses the Groq inference API for sub-second response times with the LLaMA 3.3 70B model.

- **System prompt** — scoped strictly to JBLS company knowledge (products, certifications, ordering, contact)
- **Context-aware** — maintains full conversation history per session
- **Guardrails** — refuses medical advice, redirects emergencies to the company hotline
- **UI** — built entirely in React with CSS animations, no third-party chat library

---

## 🔑 Environment Variables

The project requires the following environment variables (not included in this repo):

**Frontend (`client/.env`)**
```
VITE_GROQ_API_KEY=
VITE_API_URL=
```

**Backend (`server/.env`)**
```
NODE_ENV=
PORT=
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
ADMIN_EMAIL=
HR_EMAIL=
ORDERS_EMAIL=
CLIENT_ORIGIN=
```

---

## 👨‍💻 Developer

**Manveer Singh Khangarot**
Full Stack Developer

Built, designed, and deployed solo — from UI/UX to backend architecture, AI integration, and production hosting.

- Freelance / contract project for James Brown Life Sciences
- Development period: 2025–2026

---

## 📄 License

This project is proprietary and confidential. All rights reserved by James Brown Life Sciences. No part of this codebase may be reproduced, distributed, or used without explicit written permission.
