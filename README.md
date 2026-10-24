# 📚 InfoVerse — Universal Scholarly Digital Encyclopedia (Modules 1 to 5 Complete)

**College Project Submission & Viva Defense Documentation**  
**Current Status:** All 5 Modules Fully Implemented (100% Architecture Complete).

---

## 🌟 1. Project Overview
**InfoVerse** is a modern, responsive digital encyclopedia platform built for academic research and knowledge discovery. The system is designed following a complete **5-Module Software Engineering Architecture**:

| Module # | Module Name | Status | Key Features |
|---|---|---|---|
| **Module 1** | 🔐 **Authentication & User Management** | **COMPLETED** | User Registration with validation, Password strength meter, Session token storage, 1-Click Demo accounts (`Vyshnavi Donga`, `Naina`, `Dr. Arjun`, `Admin`), Logout. |
| **Module 2** | 🏠 **Category & Topic Discovery Engine** | **COMPLETED** | Real-time Search bar, Auto-suggest dropdown, Category taxonomy (CS, History, Space, Biology, Philosophy), Trending research tags, Match highlighting. |
| **Module 3** | 📖 **Information Display Module** | **COMPLETED** | Clean, readable presentation of topic & category content, structured headings, supporting image layouts, dynamic Table of Contents, typography scaling (A-/A+), Serif/Sans switch, Line spacing, Web Speech API Text-to-Speech audio reader, Continuous topic navigator. |
| **Module 4** | ✍️ **Content Management Module (CMS)** | **COMPLETED** | Administrative portal for adding, editing, and deleting encyclopedia topics without modifying underlying code; instant live preview, topic inventory table, category filter, and persistent storage synchronization. |
| **Module 5** | 🛡️ **User & Admin Management Module (RBAC)** | **COMPLETED** | Role-Based Access Control distinguishing regular scholars from administrators, security guard restricting topic modification to authorized admins, user directory management table, and live role promotion/demotion. |

---

## 🎓 2. Viva Examiner Q&A Guide (How to Answer Questions)

### Q1: "Where will registration and user data save?"
> **Answer to Examiner:**  
> "In this demo phase, user registration and login data are saved persistently in the browser's **HTML5 LocalStorage / Web Storage Engine** using JSON serialization and password hashing.
> 
> When deploying to a production backend (Node.js/Python), this structure directly connects to our relational **SQL Database Schema** (`CREATE TABLE users`, `CREATE TABLE articles`, `CREATE TABLE bookmarks`).
> 
> *Tip: You can click the **'🗄️ Database & Storage Inspector'** button at the top of the website to show the examiner live registered user records and SQL schemas in real time!*"

### Q2: "How does the search bar work?"
> **Answer to Examiner:**  
> "The search engine listens to real-time input events with zero-latency client-side indexing across article titles, categories, tags, and summary contents. It supports live keyword highlighting via regular expressions and category-specific filtering."

### Q3: "What technologies are used in this project?"
> **Answer to Examiner:**  
> - **Frontend & UI:** Semantic HTML5, Vanilla CSS3 (Custom Design System, Glassmorphism, Responsive Grid, Theme Switching).
> - **Logic & Storage Engine:** Vanilla JavaScript ES6+ (Modular architecture: `database.js`, `auth.js`, `encyclopedia.js`, `app.js`).
> - **Web APIs:** Web Speech API for Text-to-Speech synthesis, Web Storage API for database persistence.

---

## 🚀 3. How to Run the Project
1. Double click `index.html` or open it in any web browser (Chrome, Edge, Firefox).
2. Or use a local web server:
   ```bash
   npx serve .
   ```
3. Test Registration by creating a new account or clicking any of the **1-Click Demo Accounts** (`Naina (Student)`, `Dr. Arjun (Researcher)`, `Admin Lead`).
4. Click **"🗄️ Database & Storage Inspector"** to see your new user record added immediately!
