# 📚 InfoVerse — A Digital Encyclopedia

**Universal Scholarly Digital Encyclopedia**

Explore knowledge. Discover ideas. Learn without limits.

InfoVerse is a responsive digital encyclopedia that helps users explore educational topics through search, subject categories, articles, bookmarks, and content-management features.

## ✨ Features

- 🔎 Search and discover educational topics
- 📖 Browse articles across different subject areas
- 👤 Register, log in, and manage user sessions
- 🔐 Server-side authentication with bcrypt password hashing
- 🗄️ MySQL database for user accounts and profile information
- 🛡️ Role-based admin access and user management
- 📱 Responsive website interface

## 🛠️ Technology Stack

- HTML5, CSS3, JavaScript
- Node.js and Express
- MySQL
- bcrypt for password hashing
- Git and GitHub

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or later
- MySQL 8 or later

### 1. Clone the repository

```bash
git clone https://github.com/Tiara200718/INFOVERSE---A-DIGITAL-ENCYLOPEDIA.git
cd INFOVERSE---A-DIGITAL-ENCYLOPEDIA
```

### 2. Configure environment variables

Copy `.env.example` to `.env`:

On Windows Command Prompt:

```cmd
copy .env.example .env
```

Edit `.env` and enter your local MySQL connection details. **Never commit `.env` or publish your database password.**

### 3. Install dependencies

```bash
npm install
```

### 4. Initialize the database

```bash
npm run db:init
```

### 5. Start the application

```bash
npm start
```

Open http://localhost:3000 in your browser.

## 🗄️ Database

The application uses MySQL to store user accounts and related information. The database initialization script creates missing tables without intentionally dropping existing records.

Database connection settings are read from `.env`.

## 🔒 Security Notes

- Passwords are hashed using bcrypt.
- Authentication and authorization are handled by the server.
- Session cookies are configured by the application.
- Admin privileges should only be granted to authorized users.
- Never upload `.env`, database passwords, session secrets, or other credentials to GitHub.

## 📁 Project Structure

```text
INFOVERSE---A-DIGITAL-ENCYLOPEDIA/
├── database/
│   └── schema.sql
├── public/
├── scripts/
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

## 🔮 Future Enhancements

- Expand the encyclopedia article collection
- Improve article search and filtering
- Add automated tests
- Improve accessibility and mobile usability
- Add deployment documentation

## 👩‍💻 Author

**GitHub:** [@Tiara200718](https://github.com/Tiara200718)

**Repository:** [INFOVERSE — A Digital Encyclopedia](https://github.com/Tiara200718/INFOVERSE---A-DIGITAL-ENCYLOPEDIA)

---

*Built as an academic web development project.*

**InfoVerse — Knowledge at your fingertips.**