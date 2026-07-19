# Student Portfolio - Practical 2: State Management and Routing in React

A modern React-based **B.Tech Student Portfolio** developed as part of the **Advanced Web Development Frameworks (ITUE301)** course. This practical extends the basic portfolio by implementing **React Router**, **State Management**, **Theme Customization**, **Controlled Forms**, and **Error Handling**.

---

## 📌 Project Overview

This project demonstrates the implementation of client-side routing, React Hooks, controlled form handling, dark/light theme switching, and a custom 404 error page using modern React development practices.

---

## 🚀 Features

### 1. Client-Side Routing (React Router DOM v6)

- Implemented **BrowserRouter** in `main.jsx`.
- Configured routes using **Routes** and **Route** in `App.jsx`.
- Used **Link** and **NavLink** for smooth page navigation.
- Active navigation links are highlighted automatically using `NavLink`.

---

### 2. Multi-Page Navigation

#### 🏠 Home (`/`)
Displays:
- Hero Section
- About Me
- Skills
- Education

#### 💻 Projects (`/projects`)
Displays:
- Academic Projects
- Technology Badge Tags
- Project Action Buttons

#### 📞 Contact (`/contact`)
Includes:
- Controlled Contact Form
- Real-time Input Validation
- Live Preview
- Character Counter

#### 🚫 404 Page (`*`)
Custom **Not Found** page displayed for invalid URLs.

---

### 3. React State Management

#### 🌙 Dark / Light Theme Toggle

- Implemented using `useState`
- Theme preference stored in `localStorage`
- Automatically applies theme on reload
- Smooth CSS transitions

---

#### 📝 Controlled Contact Form

Uses `useState` for:
- Name
- Email
- Message

Features:
- Real-time data updates
- Form validation
- Live preview
- Error messages

---

#### 🔤 Live Character Counter

- Displays current message length
- Maximum limit: **500 characters**
- Warning color displayed when approaching the limit

---

#### ℹ️ Help Tooltip

A toggle button shows/hides information about:

- Form validation
- Required fields
- Data handling

---

## 🛠 Technologies Used

- React.js
- React Router DOM v6
- JavaScript (ES6+)
- HTML5
- CSS3
- Vite
- React Hooks (`useState`, `useEffect`)

---

## 📂 Project Structure

```
student-portfolio/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Education.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── Navbar.jsx
│   │   ├── NotFound.jsx
│   │   ├── Projects.jsx
│   │   └── Skills.jsx
│   │
│   ├── pages/
│   │   └── Home.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18 or above)
- npm

---

### Installation

Clone the repository

```bash
git clone https://github.com/parthpatoliya155/student-portfolio.git
```

Navigate into the project

```bash
cd student-portfolio
```

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run dev
```

Open your browser and visit

```
http://localhost:5173
```

---

## 📦 Build for Production

```bash
npm run build
```

Preview the production build

```bash
npm run preview
```

---

## 🎯 Learning Outcomes

After completing this practical, the following React concepts were implemented:

- React Router DOM v6
- BrowserRouter
- Routes & Route
- Link & NavLink
- useState Hook
- useEffect Hook
- Controlled Components
- Form Validation
- Theme Switching
- Local Storage
- Dynamic Rendering
- Conditional Rendering
- Error Handling
- Component-Based Architecture

---

## 👨‍💻 Developer Details

**Student Name:** Parth Patoliya

**Course:** B.Tech Information Technology

**Subject:** Advanced Web Development Frameworks (ITUE301)

**College:** CHARUSAT University

---

## 📄 License

This project is developed for **educational purposes** as part of the **Advanced Web Development Frameworks (ITUE301)** practical coursework.

---

⭐ If you found this project useful, consider giving the repository a star.
