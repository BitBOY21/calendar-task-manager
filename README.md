# MasterTasker

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)

> **A Next-Generation Productivity Platform combining Task Management, Calendar Scheduling, and Analytics in a unified Glassmorphism UI.**

---

## 📖 About

**MasterTasker** isn't just another to-do list. It solves the fragmentation problem between task managers and calendars. Instead of managing lists in one app and schedules in another, MasterTasker treats tasks as time-bound events.

Built with a focus on **Developer Experience (DX)** and **User Experience (UX)**, it features a robust recurring task engine (similar to Google Calendar), a drag-and-drop interface, and deep analytics to track productivity trends.

---

## ✨ Key Features

*   **📅 Unified Calendar & Tasks:** Seamlessly switch between list views and monthly/weekly calendar views.
*   **🔁 Smart Recurrence Engine:** Complex recurring logic (Daily, Weekly, Monthly, Yearly) handled natively in the backend.
*   **✋ Drag & Drop Interface:** Powered by `@hello-pangea/dnd` for intuitive task reordering and calendar scheduling.
*   **📊 Productivity Analytics:** Visual insights using `Recharts` to track completion rates, priority distribution, and activity logs.
*   **⚡ Optimistic UI:** Instant feedback on user actions (like checking off a task) before the server responds.
*   **🔍 Advanced Filtering:** Filter by multiple tags, priority levels, date ranges, and status simultaneously.
*   **🔐 Secure Authentication:** JWT-based stateless authentication with Bcrypt password hashing.
*   **🐳 Dockerized:** Fully containerized environment for easy deployment and development.

---

### Calendar Page
![Calendar Work View](./screenshot/Calendar.png)

---

## 🛠️ Tech Stack

### **Frontend (Client)**
*   **Framework:** React 19 (via Vite)
*   **Routing:** React Router DOM v7
*   **State Management:** React Context API + Custom Hooks (`useTasks`)
*   **Styling:** CSS Modules with Glassmorphism Design System
*   **Calendar:** `react-big-calendar` + `date-fns`
*   **Drag & Drop:** `@hello-pangea/dnd`
*   **Charts:** `recharts`
*   **HTTP Client:** `axios`

### **Backend (Server)**
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB (Mongoose ODM)
*   **Validation:** Joi
*   **Security:** Helmet, XSS-Clean, Mongo-Sanitize, CORS
*   **Auth:** JSON Web Tokens (JWT)

### **DevOps**
*   **Containerization:** Docker & Docker Compose
*   **Hot Reloading:** Vite (Client) + Nodemon (Server) inside Docker

---

## 🚀 Getting Started (Docker)

The easiest way to run MasterTasker is using Docker Compose.

### Prerequisites
*   Docker Desktop installed and running.

### Installation Steps

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/MasterTasker.git
    cd MasterTasker
    ```

2.  **Configure Environment Variables**
    Create a `.env` file in the `server/` directory (or rely on the defaults in `docker-compose.yml` for dev):
    ```bash
    # server/.env
    PORT=5000
    MONGO_URI=mongodb://mongo:27017/mastertasker
    JWT_SECRET=your_super_secret_key_123
    NODE_ENV=development
    ```

3.  **Run with Docker Compose**
    ```bash
    docker-compose up --build
    ```

4.  **Access the Application**
    *   **Frontend:** http://localhost:5173
    *   **Backend API:** http://localhost:5000
    *   **MongoDB:** `mongodb://localhost:27017`

5.  **Seed Data (Optional)**
    To populate the DB with realistic demo data (User: `mike@mastertasker.com` / Pass: `mike123`):
    ```bash
    docker-compose exec server npm run seed
    ```

---

## 📂 Project Structure

```bash
MasterTasker/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI (Buttons, Cards, Modals)
│   │   ├── context/        # Global State (TaskContext)
│   │   ├── features/       # Feature-based modules (Auth, Dashboard, Tasks)
│   │   ├── hooks/          # Custom Hooks (useTasks)
│   │   ├── pages/          # Route Views (Dashboard, Work, Analytics)
│   │   └── services/       # API Service Layer
│   └── Dockerfile
│
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── config/         # DB Connection
│   │   ├── controllers/    # Request Logic
│   │   ├── middleware/     # Auth & Error Handling
│   │   ├── models/         # Mongoose Schemas (Task, User)
│   │   ├── routes/         # API Routes
│   │   ├── services/       # Business Logic
│   │   └── utils/          # Helpers (Seeder, Urgency Calc)
│   └── Dockerfile
│
└── docker-compose.yml      # Orchestration
```

---

## 🔑 Environment Variables

| Variable | Description | Default (Dev) | Location |
| :--- | :--- | :--- | :--- |
| `PORT` | Backend server port | `5000` | `server/.env` |
| `MONGO_URI` | MongoDB connection string | `mongodb://mongo:27017/...` | `server/.env` |
| `JWT_SECRET` | Secret key for signing tokens | `mysecretkey123456` | `server/.env` |
| `NODE_ENV` | Environment mode | `development` | `server/.env` |
| `VITE_API_URL` | Backend URL for Frontend | `http://localhost:5000/api` | `client/.env` |

---

## 📸 Screenshots

### Home Page
![Home Page View](./screenshot/HomePage.png)

### Calendar Page
![Calendar Work View](./screenshot/Calendar.png)

### Summary Page
![Summary Page View](./screenshot/SummaryPage.png)

### History Page
![History Page View](./screenshot/HistoryPage.png)

### Add/Edit Task 
![Add/Edit Task View](./screenshot/Add+Edit_Task.png)

### Login/Carte Account 
![Add/Edit Task View](./screenshot/Login+Carte_Account.png)
---

## 📄 License

This project is licensed under the MIT License.
