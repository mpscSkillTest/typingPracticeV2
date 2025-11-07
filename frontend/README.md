# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list


MPSC Skill Test - 

Typing Practice PlatformThis is a full-stack application designed for MPSC skill test typing practice. It features a modern frontend built with React, Vite, and Tailwind CSS (shadcn/ui), and a robust backend powered by Node.js, Express, and Supabase for the database and authentication.

🌳 Branching StrategyThis project follows a Gitflow-like branching model for managing releases:

dev: The primary development branch. All new features and bugfixes are merged here.
staging: This branch is used for testing and QA. When dev is stable, it's merged into staging for deployment to the testing environment.
master : This is the production branch. Only stable, tested code from staging is merged into this branch for release.

🎯 Service Endpoints
Deployed Environments
Dev (): https://dev-typing-practice-web.onrender.com/
Production (Render): https://mpscskilltest.in/signin


Commands
frontend - npm run start
backend npm start

Npm 

# Start the frontend dev server
npm start
The frontend application will be available at http://localhost:5173.🏗️ Project Structurempscskilltest/
├── backend/
│   ├── controllers/        # Business logic for routes
│   │   ├── authorization/
│   │   ├── student/
│   │   └── subscriptions/
│   ├── middlewares/        # Custom middleware (e.g., auth, validation)
│   ├── models/             # Data models (e.g., User class)
│   ├── routes/             # API route definitions (Express routers)
│   ├── schema/             # Zod validation schemas
│   ├── utils/              # Utility functions (logging, auth helpers)
│   ├── app.js              # Express application entry point
│   ├── constant.js         # Application constants
│   ├── dbClient.js         # Supabase client initialization
│   └── package.json
└── frontend/
    ├── public/             # Static assets
    ├── src/
    │   ├── assets/         # Images, logos, etc.
    │   ├── components/
    │   │   ├── Authentication/ # Login, Register, ResetPassword
    │   │   ├── Dashboard/      # Core dashboard components
    │   │   ├── shared/         # Reusable components (Header, Sidebar)
    │   │   └── ui/             # shadcn/ui components
    │   ├── config/           # Axios instance configuration
    │   ├── enums/            # TypeScript enums
    │   ├── lib/              # Supabase client (frontend) & utils
    │   ├── routes/           # React Router page components
    │   ├── types/            # TypeScript type definitions
    │   ├── utils/            # Hooks, formatters, etc.
    │   ├── main.tsx          # React application entry point
    │   └── index.css         # Global styles (Tailwind)
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.ts


