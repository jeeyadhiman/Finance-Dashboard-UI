# 💹 FinFlow — Finance Dashboard

A clean, interactive finance dashboard built with React. Track income, expenses, budgets, and spending patterns — all in one place.

---

## 🚀 Live Demo

> https://famous-cendol-c6b4aa.netlify.app/settings

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js v18+
- npm or yarn

### Install & Run

```bash
# Clone the repo
git clone https://github.com/jeeyadhiman/Finance-Dashboard-UI.git
cd Finance-Dashboard-UI

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── App.jsx               # Root component + routing
│   ├── Layout.jsx            # Sidebar + main layout wrapper
│   ├── Sidebar.jsx           # Navigation sidebar with role toggle
│   ├── Dashboard.jsx         # Overview page
│   ├── Transactions.jsx      # Transactions list + CRUD
│   ├── Insights.jsx          # Spending insights & charts
│   ├── BudgetPlanner.jsx     # Budget setup and tracking
│   ├── Budgetonboarding.jsx  # First-time budget setup flow
│   ├── Transactioncontext.jsx # Global transactions state
│   ├── BudgetContext.jsx      # Global budget state
│   └── RoleContext.jsx        # Role management (Admin/Viewer)
├── App.css                   # Global layout + mobile styles
├── index.css                 # Base styles + typography
└── main.jsx                  # React entry point
```

---

## ✨ Features

### 📊 Dashboard Overview
- Summary cards: Total Balance, Total Income, Total Expenses, Savings Rate
- Balance trend chart (monthly)
- Spending breakdown by category (pie/donut chart)
- Recent transactions preview

### 💸 Transactions
- Full transaction list with Date, Description, Category, Type, Amount
- Search by description
- Filter by type (All / Income / Expense)
- Filter by category
- Pagination (9 per page)
- Add, Edit, Delete transactions (Admin only)
- Empty state with sample data loader
- Animated row entries

### 🎭 Role-Based UI
Two roles are simulated on the frontend — toggle via the sidebar:

| Feature | Admin | Viewer |
|---|---|---|
| View all data | ✅ | ✅ |
| Add transactions | ✅ | ❌ |
| Edit transactions | ✅ | ❌ |
| Delete transactions | ✅ | ❌ |
| Edit budget limits | ✅ | ❌ |
| Reset budgets | ✅ | ❌ |
| Budget onboarding | ✅ | Auto-skip |

Role persists across page refreshes via `localStorage`.

### 🎯 Budget Planner
- First-time onboarding flow to set monthly limits per category
- Live budget vs actual spending bars
- Over/under budget indicators with micro-copy
- Monthly spending heatmap (April 2026)
- Achievements / gamification panel
- XP progress bar

### 📈 Insights
- Highest spending category
- Monthly comparison
- Spending trends
- Category breakdown

### 💾 Data Persistence
All data persists across browser refreshes using `localStorage`:
- Transactions (`finflow_transactions`)
- Budget settings (`finflow_budgets`)
- Onboarding status (`finflow_onboarding`)
- Selected role (`finflow_role`)

---

## 🏗️ Technical Approach

### State Management
Used **React Context API** with three providers:

- **TransactionContext** — CRUD for transactions, sample data loader
- **BudgetContext** — Budget limits per category, onboarding state
- **RoleContext** — Admin/Viewer role toggle

All contexts persist state to `localStorage` so data survives page refreshes.

### Routing
React Router v6 with a shared `Layout` component wrapping all app pages. The `/` route shows the landing Hero page; all other routes render inside the sidebar layout.

### Styling
- Custom CSS with CSS variables for theming
- `Space Grotesk` font for dashboard UI
- `Manrope` font for layout
- Dark theme throughout
- Micro-animations using CSS `@keyframes` and transitions

---

## 📱 Responsive Design

| Breakpoint | Behaviour |
|---|---|
| > 768px | Full sidebar visible, collapsible to icon-only mini mode |
| ≤ 768px | Sidebar hidden, slides in from left as drawer |
| ≤ 480px | Narrower drawer, tighter padding |

---

## 🎨 Design Decisions

- **Dark theme** for reduced eye strain during financial review sessions
- **Green accent** (`#22c55e`) for positive/income, **red** (`#f87171`) for expenses/over-budget — familiar financial color language
- **Micro-copy** on budget rows adds personality ("Eating smart, spending smarter 🥗")
- **Gamification** (achievements, XP bar) to encourage healthy financial habits
- **Smooth animations** on page load, row entries, and transitions for a polished feel

---

## 🔧 Tech Stack

| Tool | Usage |
|---|---|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Context API | State management |
| Recharts | Charts and visualizations |
| CSS Modules / Plain CSS | Styling |
| Vite | Build tool |
| localStorage | Data persistence |

---

## ⚠️ Assumptions Made

- Data is frontend-only (no backend/API) — uses in-memory state + localStorage
- User identity is hardcoded (Jeeya Dhiman) — no real auth
- Dates are relative to April 2026 (assignment context)
- Sample data is pre-loaded to demonstrate all features without manual entry

---

## 📝 Known Limitations

- No real authentication — role toggle is for demo only
- No data export (CSV/JSON) — can be added as enhancement
- Charts may not render on very small screens (< 320px)

---

## 🙏 Acknowledgements

Built as part of a Frontend Developer Intern assignment. All code is original.
