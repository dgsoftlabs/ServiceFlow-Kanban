# ServiceFlow Kanban

![Next.js](https://img.shields.io/badge/Next.js-15.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![SQLite](https://img.shields.io/badge/SQLite-3-blue)
![License](https://img.shields.io/badge/license-MIT-green)

ServiceFlow Kanban is a fullstack web application built entirely with Next.js, designed to help manufacturing companies manage work orders and team workload using the Kanban methodology.

The system combines frontend UI and backend logic in a single Next.js application, making it lightweight, fast to deploy, and ideal for SaaS or internal company tools.

### Kanban Board
![ServiceFlow Kanban Board](ServiceFlow.png)

### Mobile View
![ServiceFlow Mobile View](ServiceFlowMoble.png)

## 🎯 Business Problem

Manufacturing companies often manage tasks using emails, spreadsheets, or disconnected tools, which leads to: 

- ❌ Lack of real-time visibility
- ❌ Unclear task ownership
- ❌ Missed deadlines
- ❌ Inefficient workload distribution

## ✅ Solution

ServiceFlow Kanban provides a centralized Kanban board that allows teams to:

- ✅ Manage work orders visually
- ✅ Assign tasks to team members
- ✅ Control workflow with WIP limits
- ✅ Track deadlines and delays in real time

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/dgsoftlabs/serviceflow-kanban. git

# Install dependencies
cd serviceflow-kanban
npm install

# Set up environment variables
cp . env.example . env. local
# Edit .env.local with your database credentials

# Run database migrations
npx prisma migrate dev

# Seed demo data (optional)
npm run seed

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

### 🔐 Environment Variables

Create a `.env.local` file with:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

### 🔑 Demo Credentials

After running the seed script, you can login with:

- **Admin:** admin@serviceflow.com / password123
- **Manager:** manager@serviceflow.com / password123
- **Worker 1:** worker1@serviceflow.com / password123
- **Worker 2:** worker2@serviceflow.com / password123

## 🧩 Core Features

### Kanban Board

- Configurable columns (Backlog, To Do, In Progress, Review, Done)
- Drag & Drop task management
- WIP limits per column
- Overdue task highlighting
- Blocked task status

### Task Management

- Task title, description, priority, due date
- Task assignment
- Comments and activity history
- Status change tracking

### User Roles

- **Admin** – system configuration and user management
- **Manager** – task planning and assignment
- **Worker** – task execution and updates

### Business Rules

- ✓ Tasks cannot be completed without a completion comment
- ✓ Overdue tasks are automatically detected
- ✓ Workers can access only their assigned tasks
- ✓ All task changes are logged for audit purposes

## 👥 Use Cases

### As a Manager: 
- I can create and assign tasks to team members
- I can see the overall workload distribution
- I can track which tasks are overdue or blocked

### As a Worker:
- I can view my assigned tasks
- I can update task status by dragging cards
- I can add completion comments when finishing tasks

### As an Admin: 
- I can manage users and their roles
- I can configure Kanban board columns
- I can view audit logs of all changes

## 🏗 Architecture

```
Next.js (App Router)
├── Frontend (UI)
├── Backend (API Routes)
├── Authentication (NextAuth)
└── Database Access (ORM)
```

## 🧠 Technology Stack

### Frontend
- [Next.js 15](https://nextjs.org/) - App Router
- [React 18](https://react.dev/) - Server & Client Components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [dnd-kit](https://dndkit.com/) - Drag & Drop

### Backend
- Next.js API Routes & Server Actions
- [Prisma](https://www.prisma.io/) - ORM
- [SQLite](https://www.sqlite.org/) - Database

### Authentication
- [NextAuth. js](https://next-auth.js.org/)
- Role-based access control (RBAC)
- Protected routes via middleware

## 🐳 DevOps & Deployment

- Docker support
- Environment-based configuration
- Database migrations
- Demo seed data
- Ready for deployment on Vercel or VPS

## 📁 Project Structure

```
/app
  /login
  /dashboard
  /kanban
  /admin
/app/api
/components
/lib
/prisma
/docs
```

## 🧪 Testing

- Business logic tests
- API route tests
- Authorization tests

## 🚀 Roadmap

### v1 (MVP)
- ✅ Kanban board
- ✅ User roles
- ✅ Task management

### v2
- ⏳ Reports and analytics
- ⏳ SLA tracking
- ⏳ Notifications

### v3
- 📋 Multi-tenant SaaS
- 📋 Subscription and billing

## 📷 Screenshots

### Kanban Board
![ServiceFlow Kanban Board](ServiceFlow.png)

### Task Detail View
> Coming soon

### Admin Dashboard
> Coming soon

## 🤝 Contributing

This is a case study project, but contributions are welcome! 

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📌 Project Type

This project is a commercial-style case study, created to demonstrate: 

- ✓ Real-world business problem solving
- ✓ Fullstack development with Next.js
- ✓ Production-ready application structure

## 📄 License

MIT

---

**Built with ❤️ by [DgSoftLabs](https://github.com/dgsoftlabs) using Next.js**<!-- docs: update project documentation -->
<!-- style: adjust code formatting -->
<!-- chore: cleanup configuration -->
<!-- fix: minor ui glitch -->
<!-- refactor: simplify component structure -->
<!-- docs: refine installation guide -->
<!-- style: fix indentation -->
<!-- chore: update dev dependencies -->
<!-- fix: resolve mobile view issue -->
<!-- feat: optimize performance -->
<!-- docs: add usage examples -->
<!-- style: update color palette comments -->
<!-- chore: organize imports -->
<!-- fix: typo in variable name -->
<!-- refactor: improve error handling logic -->
<!-- docs: update contributing guidelines -->
<!-- style: normalize css properties -->
<!-- chore: remove unused files -->
<!-- fix: header alignment -->
<!-- feat: update dashboard layout -->
<!-- docs(auth): improve documentation -->
<!-- refactor(ui): add logic -->
<!-- refactor(admin): improve documentation -->
<!-- feat(config): improve styles -->
<!-- refactor(config): improve performance -->
<!-- chore(kanban): improve error handling -->
<!-- chore(auth): add component -->
<!-- chore(config): remove error handling -->
<!-- style(config): optimize styles -->
<!-- refactor(admin): improve error handling -->
<!-- refactor(auth): update code -->
<!-- perf(config): fix component -->
<!-- feat(dashboard): fix documentation -->
<!-- test(ui): fix logic -->
<!-- docs(db): refactor layout -->
<!-- docs(ui): remove component -->
<!-- docs(ui): update performance -->
<!-- test(deps): clean logic -->
<!-- style(ui): add tests -->
<!-- feat(dashboard): clean error handling -->
<!-- test(auth): update performance -->
<!-- fix(config): refactor code -->
<!-- fix(ui): add component -->
<!-- fix(dashboard): improve styles -->
<!-- docs(api): optimize performance -->
<!-- docs(api): refactor bug -->
<!-- perf(config): refactor error handling -->
<!-- chore(api): refactor bug -->
<!-- test(auth): clean logic -->
<!-- feat(kanban): fix layout -->
<!-- refactor(db): fix styles -->
<!-- perf(db): add component -->
<!-- fix(dashboard): add code -->
<!-- perf(dashboard): fix bug -->
<!-- test(admin): clean error handling -->
<!-- feat(deps): add styles -->
<!-- perf(auth): fix component -->
<!-- fix(deps): optimize layout -->
<!-- style(dashboard): update error handling -->
<!-- refactor(ui): remove code -->
<!-- refactor(auth): add code -->
<!-- docs(admin): refactor code -->
<!-- perf(config): add tests -->
<!-- docs(dashboard): update layout -->
<!-- perf(config): improve documentation -->
<!-- test(ui): fix styles -->
<!-- style(deps): improve bug -->
