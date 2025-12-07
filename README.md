# Node Hono API Template

A modern, production-ready Node.js API template built with [Hono](https://hono.dev/) framework, TypeScript, and best practices for rapid API development.

## ✨ Features

- **🚀 Hono Framework** - Ultra-fast, lightweight web framework optimized for edge runtimes
- **📘 TypeScript** - Full TypeScript support with strict type checking
- **🔒 Environment Validation** - Type-safe environment variables with Zod
- **🎨 Code Quality Tools** - ESLint, Prettier, and Commitlint pre-configured
- **🔄 Hot Reload** - Fast development with tsx watch mode
- **📦 Path Aliases** - Clean imports with `@/` aliases
- **🪝 Git Hooks** - Automated linting and commit validation with Husky
- **🛠️ VS Code Integration** - Optimized workspace settings and debug configuration

## 📋 Prerequisites

- Node.js 24.x or higher
- npm or yarn

## 🚀 Getting Started

### 1. Use this template

Click the **"Use this template"** button on GitHub to create a new repository from this template.

### 2. Clone your repository

```bash
git clone https://github.com/raulnq/node-hono-api.git
cd your-repo-name
```

### 3. Install dependencies

```bash
npm install
```

### 4. Set up environment variables

Create a `.env` file in the root directory:

```bash
# Environment
NODE_ENV=development

# Server
PORT=3000

# Add your additional environment variables here
```

### 5. Run development server

```bash
npm run dev
```

The server will start at `http://localhost:3000`

## 📁 Project Structure

```
node-hono-api/
├── src/
│   ├── env.ts           # Environment variable validation
│   └── index.ts         # Application entry point
├── dist/                # Compiled output (generated)
├── .vscode/             # VS Code configuration
│   ├── launch.json      # Debug configuration
│   └── settings.json    # Workspace settings
├── .husky/              # Git hooks
├── commitlint.config.ts # Commit message linting
├── eslint.config.ts     # ESLint configuration
├── prettier.config.ts   # Prettier configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies and scripts
```

## 🛠️ Available Scripts

| Script                 | Description                              |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start development server with hot reload |
| `npm run build`        | Build for production                     |
| `npm start`            | Run production build                     |
| `npm run format`       | Format code with Prettier                |
| `npm run format:check` | Check code formatting                    |
| `npm run lint`         | Lint code with ESLint                    |
| `npm run lint:fix`     | Fix linting issues                       |
| `npm run lint:format`  | Fix linting and format code              |
| `npm run commit`       | Interactive commit with Commitlint       |

## 🔧 Configuration

### Environment Variables

Environment variables are validated using Zod in `src/env.ts`. Add your schema:

```typescript
const ENVSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  // Add more variables here
});
```

### Path Aliases

Import aliases are configured in `tsconfig.json`:

```typescript
// Instead of: import { helper } from '../../../utils/helper'
import { helper } from '@/utils/helper';
```

### ESLint & Prettier

The project uses:

- **ESLint** with TypeScript recommended rules
- **Prettier** for code formatting
- **Automatic formatting** on save (VS Code)
- **Automatic lint fixes** on save (VS Code)

### Commit Messages

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```bash
feat: add user authentication
fix(api): resolve CORS issue
docs: update README
```

Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `perf`, `revert`

## 🏗️ Building Your API

### Adding Routes

```typescript
// src/index.ts
import { Hono } from 'hono';

const app = new Hono();

app.get('/api/users', c => {
  return c.json({ users: [] });
});

app.post('/api/users', async c => {
  const body = await c.req.json();
  return c.json({ success: true, data: body }, 201);
});
```

### Adding Middleware

```typescript
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

app.use(logger());
app.use('/api/*', cors());
```

### Error Handling

```typescript
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ error: 'Internal Server Error' }, 500);
});
```

## 🧪 Testing

Add your testing setup (Jest, Vitest, etc.) as needed for your project.

## 📦 Deployment

### Build for production

```bash
npm run build
```

### Start production server

```bash
npm start
```

### Deploy to your platform

The built application in `dist/` can be deployed to:

- **Node.js servers**
- **Docker containers**
- **Cloud platforms** (AWS, Azure, GCP)
- **PaaS** (Heroku, Railway, Render)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Hono](https://hono.dev/) - The web framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Zod](https://zod.dev/) - Schema validation
- Community contributors and maintainers

## 📚 Resources

- [Hono Documentation](https://hono.dev/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Commitlint](https://commitlint.js.org/)
- [ESLint Rules](https://eslint.org/docs/latest/rules/)

---

**Happy coding! 🚀**
