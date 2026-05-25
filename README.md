# 🧠 Project: non_disclosure.exe (anv os)

```
              _  __             ___  ____  
  /\_/\      / |/ /__    _ __  / _ \/ ___| 
 ( o.o )    /    / _ \  | '_ \| | | \___ \ 
  > ^ <    /    / (_) | | |_) | |_| |___) |
 /_/ \_\  /_/|_/ \___/  | .__/ \___/|____/ 
                        |_|                
```

> **Warning: This repository is a sentient environment.** If you are reading this, you have already initialized the session. You are now part of the ecosystem.

---

## 🚨 System Status

![Environment: Production](https://img.shields.io/badge/environment-production-emerald?style=for-the-badge&logo=vercel)
![Stability: Schrödinger's Build](https://img.shields.io/badge/stability-schrödinger's%20build-yellow?style=for-the-badge&logo=statuspage)
![Bugs: Features](https://img.shields.io/badge/bugs-promoted%20to%20features-sky?style=for-the-badge&logo=bugsnag)
![Framework: Next.js 16](https://img.shields.io/badge/framework-next.js%2016-black?style=for-the-badge&logo=nextdotjs)
![Styling: Tailwind 4](https://img.shields.io/badge/styling-tailwind%204-cyan?style=for-the-badge&logo=tailwindcss)

---

## 🖥️ What is anv os?

`anv os` is a highly immersive, operating-system-inspired portfolio ecosystem masquerading as a modern portfolio. It blends the robust performance of low-level systems architectures with premium, high-fidelity front-end experiences, creating an environment that responds dynamically to your presence.

### 🌟 Visual Highlights & Interactions

*   🌐 **Three.js Particle Nebula:** A fluid background comprising `7,000` particles running active spring-back physics, mouse repulsion mechanics, and three-dimensional camera parallax.
*   ⏳ **Boot Diagnostics Terminal:** A realistic UNIX-style loading screen displaying core system logs, custom layered svg loading indicators, and boot percentages before launching.
*   🧭 **macOS/iOS Interactive Dock:** A bottom navigation bar featuring magnetic hover expansion, audio feedback, tooltips, and scrolling auto-hide.
*   🔍 **Spotlight Command Palette (Cmd + K):** A global search command overlay with interactive category matching, Arrow-key navigation, and Enter key action execution.
*   🎧 **Lofi Streamer Integration:** A top menu widget embedding soothing lofi streams (*Yasumu - We Met*) using the YouTube Iframe API, with a sleek slide-out volume slider.
*   💬 **Global Anonymous Lobby:** A real-time Firestore chat window featuring random animal/adjective nickname generation, drag-to-resize panel controls, online user estimates, and real-time syncing.
*   🔒 **Admin Console Suite:** A protected, cookie-verified administrative page with automatic routing and feedback handling.

---

## 🧬 Tech Stack

### Front-End Foundations
*   **Next.js 16 (App Router):** Fast, modern React framework utilizing server components and middleware protection.
*   **TypeScript:** Type-safe development with legal immunity against JavaScript anomalies.
*   **Tailwind CSS v4 & PostCSS:** Curated dark-themed tokens, noise filters, and glassmorphic layers held together by strict modern layout rules.
*   **Framer Motion 12:** Smooth micro-animations, spring dynamics, drag controllers, and exit-entry layout state transitions.

### 3D Render & Audio Pipeline
*   **React Three Fiber (R3F) & Drei:** WebGL canvas hosting active gravity particle systems and camera perspective matrices.
*   **YouTube Player API:** Asynchronous hidden player streams.
*   **useSoundEffect Hooks:** Context-aware UI action hums and keyboard thoccs.

### Backend & Storage
*   **Firebase / Firestore:** Serverless architecture handling anonymous authentication and real-time document listeners.
*   **Nodemailer:** Automated SMTP relays sending secure feedback reports.

---

## 📁 System Architecture Map

Here is how the core modules of `anv os` are laid out:

```
portfolio-app/
├── src/
│   ├── app/                      # Next.js App Router Page Layouts
│   │   ├── admin/                # Admin Panel and Login Console
│   │   ├── api/                  # Serverless APIs (auth, projects, contact, skills)
│   │   ├── layout.tsx            # Global ClientWrapper & Noise Overlays
│   │   └── page.tsx              # Home Shell holding Sections
│   ├── components/
│   │   ├── layout/               # System Layout (MenuBar, Dock, Nav wrappers)
│   │   ├── sections/             # Interactive sections (Hero, About, Bento Projects, Skills)
│   │   └── ui/                   # High-Fidelity UI Blocks
│   │       ├── ChatWindow.tsx    # Firebase Anonymous Resizable Chat Console
│   │       ├── DynamicBackground.tsx # Three.js Particle Mesh Canvas
│   │       ├── LoadingScreen.tsx # Boot Sequence Logger
│   │       └── Toast.tsx         # macOS styled system notifications
│   ├── data/                     # Local JSON registries (Skills and Project details)
│   ├── hooks/                    # Reusable React hooks (useSoundEffect)
│   └── lib/                      # Firebase setup and security wrappers
└── .env.local                    # Secrets config register (gitignore)
```

---

## ⚙️ Environment Configuration

To unlock full system capabilities, configure a `.env.local` file at the root of the project with the following variables:

```env
# Administrative Password
ADMIN_PASSWORD=your_secure_password
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password

# Image Assets Manager
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_preset

# Firebase Credentials (Powers the Global Chat Lobby)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Mail Relays (Powers the Contact Terminal)
EMAIL_USER=your_smtp_email@gmail.com
EMAIL_PASS=your_smtp_app_password
```

---

## 🚀 Booting Up Locally

Follow these instructions to run `anv os` on your local hardware:

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Stewy8506/portfolio-app.git
cd portfolio-app
npm install
```

### 2. Launch Local Environment
```bash
npm run dev
```

### 3. Build & Compile Production Target
```bash
npm run build
npm run start
```

If it successfully spins up on `localhost:3000`:
> **Verdict:** Extremely suspicious. You have broken code probability laws.

If the shell throws a stack trace:
> **Verdict:** Intended behavior. Welcome to the workspace.

---

## 🐛 Diagnostics & Known Anomalies

*   **Custom Nicknames:** Renaming yourself `Admin` doesn't bypass administrative cookie gates. The systems are watching.
*   **The Clock:** Clicking the top-right clock toggles 12/24-hour modes, prompting desktop notifications directly. If you hear thoccs when clicking, your sound adapter is operating normally.
*   **The Particles:** If your GPU fan starts sounding like a jet turbine, decrease the particle density count in `DynamicBackground.tsx` from `7000` to `3000`.

---

## 🗿 Final Session Words

You came here looking for a traditional developer resume.

Instead, you found a system.

We advise interacting with the **Spotlight Search (`Ctrl/Cmd + K`)** to locate remaining directories, or checking the **Lobby** to chat anonymously with other active users.

*Remember: This repo was a mistake. But now that you've cloned it, you're responsible for it.*

---

## 🧍‍♂️ Kernel Maintainer

*   **Developer:** Anuvab Das (Stewy8506)
*   **Status:** Currently debugging a ghost loop that was fixed three builds ago.
