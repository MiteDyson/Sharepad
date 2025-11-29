

# 📝 **Sharepad – Real-Time Collaborative Notepad & Sharing Platform**

<div align="center">

<img src="https://github.com/MiteDyson/Sharepad/blob/main/client/app/Logo.png" width="130" alt="Sharepad Logo">

### **Create, collaborate, and share notes instantly — no login required.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.7-black?logo=socket.io)](https://socket.io/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)](https://render.com/)

🔗 **Live App:** [Here](https://sharepad-io.vercel.app/)
📦 **Repository:** [Here](https://github.com/MiteDyson/Sharepad)

</div>

---

## ✨ **What is Sharepad?**

**Sharepad** is a lightning-fast, real-time notepad application that allows anyone to:

* Create a note instantly
* Share it using an auto-generated link
* Collaborate in real-time with others
* Switch between **text mode** and **drawing canvas mode**
* No accounts. No friction. No database. Pure speed.

Powered by **Next.js 16**, **React 19**, and **Socket.io**, Sharepad offers a seamless collaborative workspace with instant updates, room-based sharing, and smooth UI animations.

---

## 🚀 **Key Features**

### 📝 Core Features

* **Instant Note Creation** – Start writing immediately
* **Link-Based Sharing** – Share your note or room with a single URL
* **Real-Time Sync** – Edits update instantly for all connected users
* **Local Draft Support** – Notes safely stored in browser if connection drops
* **Dual Modes**-

   ✔ Text Mode

  ✔ Drawing Canvas Mode
* **Room-Based Collaboration** – Multiple users editing the same note
* **User Tracking** – See who is connected in your room

### 🎨 UI & Experience

* **Modern Tailwind UI**
* **Next.js 16 App Router**
* **Smooth feedback with Sonner notifications**
* **Light & Dark Themes via next-themes**
* **Responsive and mobile-friendly**

### ⚡ Backend / Realtime

* **Socket.io communication**
* **Event-based syncing**
* **Room creation & sharing**
* **Optimized for low latency**

---

## 🏗️ **Architecture Overview**

```
Sharepad/
├── client/ (Next.js 16 + React 19)
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # Home UI
│   │   ├── [room]/          # Dynamic collaboration room
│   │   └── components/      # UI components
│   ├── hooks/               # Socket & theme hooks
│   ├── utils/               # Helpers
│   └── public/              # Static assets & logo
│
└── server/ (Node.js + Socket.io)
    ├── index.js             # Socket server entry
    ├── rooms.js             # Server-side room logic
    └── utils/               # Event helpers
```

---

## 🔧 **Tech Stack Explained**

### 🌐 **Frontend**

| Tech                 | Purpose                                 |
| -------------------- | --------------------------------------- |
| **Next.js 16**       | File-based routing, SSR, fast rendering |
| **React 19**         | Modern client UI                        |
| **Tailwind CSS**     | Utility-first, responsive styling       |
| **Socket.io Client** | Real-time sync                          |
| **Sonner**           | Notifications & alerts                  |
| **next-themes**      | Theme switching support                 |

### 🖥️ **Backend**

| Tech          | Purpose                                     |
| ------------- | ------------------------------------------- |
| **Node.js**   | Lightweight server runtime                  |
| **Socket.io** | Bi-directional realtime communication       |
| **Render**    | Backend hosting with persistent connections |

---

## 🔗 **Live Demo**

### ✨ Try Sharepad Now

👉 **[https://sharepad-io.vercel.app/](https://sharepad-io.vercel.app/)**

Create a room → Share link → Collaborate instantly.

---

## ⚙️ **Local Setup**

### 🔸 Requirements

* Node.js 18+
* npm / pnpm / yarn

### 1. Clone Repository

```bash
git clone https://github.com/MiteDyson/Sharepad
cd Sharepad
```

---

# 🖥️ Frontend Setup (Next.js)

```bash
cd client
npm install
npm run dev
```

Your app runs at:
➡ [http://localhost:3000](http://localhost:3000)

---

# 🔌 Backend Setup (Socket.io Server)

```bash
cd server
npm install
node server.js
```

Server runs at:
➡ [http://localhost:5000](http://localhost:3001)

---

## 🔐 Environment Variables (Optional)

No strict `.env` required unless customizing URLs.

```
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
```

---

## 📡 **How Collaboration Works**

1. User creates a new note
2. A **unique room ID** is generated
3. Sharepad creates a WebSocket connection
4. Users with the same link join the same room
5. Text / canvas updates broadcast instantly to all users

Real-time syncing powered by:

```
socket.emit("update-note", data)
socket.on("update-note", handler)
```

---

## 🎨 UI Features

### 🖊️ Canvas Mode

* Freehand drawing
* Colors + line width
* Real-time whiteboard style sharing

### 📝 Text Mode

* Clean editor
* Instant syncing
* Local draft fallback

### 🌙 Theme Support

* Light / Dark mode toggle
* Persisted via next-themes

---

## 📄 License

This project is licensed under **MIT**.
Feel free to use, modify, and enhance.

---

<div align="center">

### **Built with ⚡ speed, 🎨 design, and ❤️ collaboration in mind.**

[🌐 Live Demo](https://sharepad-io.vercel.app/) •
[📦 Repo](https://github.com/MiteDyson/Sharepad)

</div>

---

