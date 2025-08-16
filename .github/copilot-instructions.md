# NeoPersonal Website - DevOps Portfolio

A modern DevOps engineer portfolio built with Astro 5.10.1, React, Tailwind CSS, and TypeScript. Features a blog with syntax-highlighted code examples and deployment through Azure Static Web Apps.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

- Bootstrap, build, and test the repository:
  - `node --version` - Ensure Node.js 20 is installed (required, see .nvmrc)
  - `npm install -g pnpm` - Install pnpm package manager (required, not optional)
  - `pnpm install` - Install dependencies (takes ~1 minute). NEVER CANCEL. Set timeout to 5+ minutes.
  - `pnpm run build` - Build the static site (takes ~6 seconds). NEVER CANCEL. Set timeout to 2+ minutes.
- Test and validate:
  - `pnpm astro check` - Run TypeScript checking (takes ~6 seconds). NEVER CANCEL. Set timeout to 2+ minutes.
- Run the development server:
  - ALWAYS run the bootstrapping steps first.
  - `pnpm run dev` - Start development server on http://localhost:4321/
- Preview built site:
  - `pnpm run preview` - Preview production build on http://localhost:4321/

## Validation

- ALWAYS manually validate any new code by testing the running application.
- ALWAYS run through at least one complete end-to-end scenario after making changes:
  1. Homepage loads correctly (portfolio content, navigation, responsive design)
  2. Blog index page (/blog) loads and lists all posts
  3. Individual blog posts load with proper MDX rendering and syntax highlighting
  4. Navigation between pages works (home, blog, individual posts)
  5. Code blocks render with custom styling (dark theme, borders, syntax highlighting)
- You can build and run the application in development and preview modes for testing.
- ALWAYS take a screenshot when making UI changes to verify visual impact.
- Always run `pnpm astro check` to validate TypeScript before you are done or the CI (.github/workflows/azure-static-web-apps.yml) will fail.

## Common tasks

The following are outputs from frequently run commands. Reference them instead of viewing, searching, or running bash commands to save time.

### Repo root
```
.azuredevops/
.git/
.github/
.gitignore
.nvmrc
astro.config.mjs
components.json
node_modules/
package.json
pnpm-lock.yaml
postcss.config.mjs
public/
src/
staticwebapp.config.json
styles/
tailwind.config.mjs
tailwind.config.ts
terraform/
tsconfig.json
```

### cat package.json
```json
{
  "name": "neopersonalwebsite",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "@astrojs/check": "^0.9.4",
    "@astrojs/mdx": "^4.0.0",
    "@astrojs/react": "^4.0.0",
    "@astrojs/tailwind": "^6.0.0",
    "@tailwindcss/typography": "^0.5.16",
    "astro": "^5.0.0",
    "clsx": "^2.1.1",
    "embla-carousel-react": "8.5.1",
    "gray-matter": "^4.0.3",
    "lucide-react": "^0.523.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^2.5.5",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/node": "^22",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "postcss": "^8.5",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.8.3"
  }
}
```

### Available Scripts
- `pnpm run dev` - Start development server
- `pnpm run start` - Alias for dev
- `pnpm run build` - Build production site to dist/
- `pnpm run preview` - Preview built site
- `pnpm astro check` - TypeScript checking and validation

### Tech Stack Details
- **Framework**: Astro 5.10.1 with React integration
- **Styling**: Tailwind CSS with custom dark theme and syntax highlighting
- **Content**: MDX blog posts in src/content/blog/
- **Package Manager**: pnpm (required, CI uses pnpm)
- **Node Version**: 20 (specified in .nvmrc)
- **TypeScript**: Full TypeScript support with type checking

### Project Structure
```
src/
├── components/         # Reusable UI components
│   ├── sections/      # Page sections (Hero, Projects, etc.)
│   └── ui/            # UI components (Input, cards, etc.)
├── content/
│   └── blog/          # MDX blog posts
├── layouts/           # Page layouts
├── lib/               # Utility functions
└── pages/             # Route pages
```

### Infrastructure & Deployment
- **Primary CI/CD**: GitHub Actions (.github/workflows/azure-static-web-apps.yml)
  - Deploys to Azure Static Web Apps
  - Uses pnpm for build process
  - Builds on every push to master branch
- **Infrastructure CI/CD**: Azure DevOps (.azuredevops/infracicd.yml)
  - Manages Azure infrastructure via Terraform
- **Infrastructure as Code**: terraform/ directory contains:
  - Azure Resource Group and Static Web App definitions
  - Terraform state management

### Content Management
- Blog posts are in src/content/blog/ as MDX files
- Each post has frontmatter with title, date, readTime, tags, category, excerpt
- Code blocks use custom syntax highlighting with dark theme
- Content is auto-generated as collections (should eventually define in src/content.config.ts)

### Styling Guidelines
- Uses custom dark theme with bright accent colors
- Code blocks have distinctive styling: dark background, colored borders, drop shadows
- Responsive design with mobile-first approach
- Custom styling in src/layouts/Layout.astro for syntax highlighting

### Common Gotchas
- Must use pnpm, not npm (CI requires pnpm)
- Node 20 is required (.nvmrc specifies this)
- Astro auto-generates content collections but warns about it (not an error)
- Some deprecation warnings in lucide-react icons (warnings only, not errors)
- Build is very fast (~6 seconds) compared to typical projects

### Timing Expectations
- **NEVER CANCEL**: All operations are fast, but set appropriate timeouts:
  - `pnpm install`: ~1 minute. Set timeout to 5+ minutes.
  - `pnpm run build`: ~6 seconds. Set timeout to 2+ minutes.
  - `pnpm astro check`: ~6 seconds. Set timeout to 2+ minutes.
  - Dev server startup: ~2 seconds
- This is a fast-building project, not like typical projects that take 45+ minutes

### Manual Testing Scenarios
After making changes, ALWAYS test these scenarios:

1. **Homepage Navigation Test**:
   - Load http://localhost:4321/
   - Verify hero section, skills, experience, and projects load
   - Click navigation links (BLOG, social media buttons)
   - Test responsive design by resizing browser

2. **Blog Functionality Test**:
   - Navigate to /blog
   - Verify all blog posts are listed with metadata
   - Click on a blog post (e.g., "DevOps Code Examples Showcase")
   - Verify MDX content renders correctly
   - Verify code syntax highlighting works (colored text, dark background)
   - Test "BACK TO BLOG" navigation

3. **Content Rendering Test**:
   - Verify code blocks have proper styling (dark theme, borders, colors)
   - Check that different language syntax highlighting works (bash, yaml, json, etc.)
   - Ensure responsive design works on mobile and desktop

4. **Build Validation Test**:
   - Run `pnpm run build` to ensure production build works
   - Run `pnpm run preview` to test production build
   - Verify all pages load correctly in preview mode