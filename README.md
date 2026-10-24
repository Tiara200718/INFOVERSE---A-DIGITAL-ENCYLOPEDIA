<div align="center">

# 📚 InfoVerse
### Universal Scholarly Digital Encyclopedia

**Explore knowledge. Discover ideas. Learn without limits.**

A responsive, interactive digital encyclopedia built with HTML5, CSS3, and Vanilla JavaScript for academic research and knowledge discovery.

[![HTML5](https://img.shields.io/badge/HTML5-Markup-orange?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Styling-blue?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![GitHub Pages](https://img.shields.io/badge/Deployment-GitHub%20Pages-222222?style=for-the-badge&logo=githubpages&logoColor=white)](https://pages.github.com/)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Project Objectives](#-project-objectives)
- [Features](#-features)
- [Five-Module Architecture](#-five-module-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [How to Use](#-how-to-use)
- [Data and Storage](#-data-and-storage)
- [Security Notes](#-security-notes)
- [Viva Questions and Answers](#-viva-questions-and-answers)
- [Future Enhancements](#-future-enhancements)
- [Author](#-author)

---

## 🌟 Overview

**InfoVerse** is a web-based digital encyclopedia designed to make exploring educational topics simple and engaging. It brings information from areas such as computer science, history, space, biology, and philosophy into a single, easy-to-navigate interface.

The project combines a responsive user interface with modular JavaScript functionality. Users can discover topics, search for information, read structured articles, adjust reading preferences, and—where supported by the current implementation—use account and content-management features.

> **Project type:** Academic web development project  
> **Frontend:** HTML5, CSS3, Vanilla JavaScript  
> **Storage:** Browser storage for the current demo implementation

## 🎯 Project Objectives

- Organize educational topics in a single digital platform.
- Make topic discovery faster through search and category browsing.
- Provide a comfortable reading experience with customizable display settings.
- Demonstrate modular front-end development and separation of responsibilities.
- Explore user roles and content-management workflows in an academic demo.
- Create a project that can be shared through GitHub.

## ✨ Features

### 🔎 Search and Discovery
- Search for topics from the encyclopedia interface.
- Browse subject categories, including computer science, history, space, biology, and philosophy.
- Use topic suggestions and trending research tags where available.

### 📖 Reading Experience
- Display topic content in a structured, readable layout.
- Use supporting images for selected articles.
- Navigate long articles with a table of contents where implemented.
- Adjust text size, typography, or line spacing if the relevant controls are enabled.
- Use browser text-to-speech support where implemented.

### 🔐 Accounts and Roles
- Demonstration registration and login flows.
- Demo accounts for trying different user roles, if configured in the application.
- Role-based interface and administrative actions where implemented.

### 📝 Content Management
- Administrative workflows for adding, editing, or removing encyclopedia topics where implemented.
- Topic lists and category filtering where available.
- Browser-based persistence for supported demo data.

## 🧩 Five-Module Architecture

| Module | Name | Responsibility |
|---|---|---|
| 1 | Authentication and User Management | Registration, login, session state, and account-related UI |
| 2 | Category and Topic Discovery | Search, topic suggestions, subject categories, and discovery |
| 3 | Information Display | Article content, images, reading controls, and navigation |
| 4 | Content Management | Topic administration and content editing workflows |
| 5 | User and Admin Management | Role-aware access and administrative user controls |

*Module descriptions summarize the project's intended organization. The exact availability of each feature depends on the current source code.*

## 🛠️ Technology Stack

| Technology | Use |
|---|---|
| HTML5 | Page structure and semantic content |
| CSS3 | Layout, styling, responsive design, and visual effects |
| JavaScript ES6+ | Search, navigation, UI interactions, and application logic |
| Web Storage API | Browser-side persistence for demo data, where used |
| Web Speech API | Text-to-speech reading, where implemented |
| Git and GitHub | Version control and project hosting |
| GitHub Pages | Static website hosting, when enabled |

## 📁 Project Structure

```text
INFOVERSE---A-DIGITAL-ENCYLOPEDIA/
│
├── index.html
├── README.md
│
├── css/
│   └── style.css
│
├── js/
│   ├── app.js
│   ├── auth.js
│   ├── database.js
│   └── encyclopedia.js
│
└── images/
    ├── database_sql_architecture.jpg
    ├── dna_crispr_genetics.jpg
    ├── library_of_alexandria.jpg
    ├── neural_network_ai.jpg
    ├── quantum_space_cosmos.jpg
    └── stoic_philosophy_statue.jpg
```

## 🚀 Getting Started

### Option 1: Run locally

1. Clone the repository:

   ```bash
   git clone https://github.com/Tiara200718/INFOVERSE---A-DIGITAL-ENCYLOPEDIA.git
   ```

2. Open the project folder:

   ```bash
   cd INFOVERSE---A-DIGITAL-ENCYLOPEDIA
   ```

3. Open `index.html` in your browser.

### Option 2: Run with a local development server

If Node.js is installed, run:

```bash
npx serve .
```

Open the local URL printed in the terminal.

### Option 3: Open the hosted version

If GitHub Pages is enabled and deployment has completed, visit:

**https://tiara200718.github.io/INFOVERSE---A-DIGITAL-ENCYLOPEDIA/**

## 🧭 How to Use

1. Open `index.html` or the deployed website.
2. Explore available categories and encyclopedia topics.
3. Use search to find a topic.
4. Open an article and explore its reading controls, if available.
5. Try the demonstration account flow if it is enabled.
6. Explore administrative options only if your account and the current implementation permit them.

## 💾 Data and Storage

The current demo is a front-end web application. If user or topic data is saved using `localStorage`, it is stored in the browser on that device and browser profile.

- Browser storage is not the same as a shared online database.
- Data stored in one browser generally does not automatically appear in another user's browser.
- Clearing site data can remove locally stored demo information.
- A production multi-user application would typically require a server-side API and database.

## 🔒 Security Notes

This project is intended as an educational demonstration. Browser-only authentication and client-side role checks should not be treated as production-grade security. A production version should use server-side authentication, secure password handling, authorization checks on the server, and a database with appropriate access controls.

Do not put passwords, API keys, private tokens, or other secrets in this repository.

## 🎓 Viva Questions and Answers

### 1. What is InfoVerse?
InfoVerse is a web-based digital encyclopedia that organizes educational topics and provides a user-friendly interface for discovering and reading information.

### 2. Which technologies are used?
The project uses HTML5 for structure, CSS3 for presentation, and Vanilla JavaScript for application logic and interactive features.

### 3. What is the purpose of `style.css`?
It defines the website's visual presentation, including layout, colors, typography, and responsive styling.

### 4. What is the purpose of `app.js`?
It acts as an application-level JavaScript module for coordinating interface behavior and connecting different features, according to the current implementation.

### 5. Why split JavaScript into modules?
Separate files help organize responsibilities, make code easier to maintain, and simplify debugging.

### 6. What is browser local storage?
`localStorage` is a browser API that can store key-value data across page reloads for the same website and browser profile.

### 7. Is browser storage a shared database?
No. Browser storage is local to a browser profile. A shared, multi-user system generally needs a backend service and database.

### 8. What is GitHub Pages?
GitHub Pages is a hosting service that can publish static website files from a GitHub repository.

### 9. What does responsive design mean?
Responsive design adapts a website's layout to different screen sizes, such as desktop, tablet, and mobile.

### 10. What improvements could be made?
A backend API, shared database, stronger server-side authentication, automated testing, and accessibility improvements could help evolve the demo into a production-ready system.

## 🔮 Future Enhancements

- Add a backend API and shared database.
- Implement server-side authentication and authorization.
- Add article bookmarks and user reading history.
- Expand article search and filtering.
- Improve accessibility and mobile usability.
- Add automated tests and continuous deployment.
- Add more educational categories and verified references.

## 👩‍💻 Author

**GitHub:** [@Tiara200718](https://github.com/Tiara200718)

**Repository:** [INFOVERSE---A-DIGITAL-ENCYLOPEDIA](https://github.com/Tiara200718/INFOVERSE---A-DIGITAL-ENCYLOPEDIA)

---

<div align="center">

**📚 InfoVerse — Knowledge at your fingertips.**

*Built as an academic web development project.*

</div>
