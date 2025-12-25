# CSS Grid Generator

A web application for creating CSS Grid layouts with drag and drop functionality. Build grid layouts visually and export CSS or Tailwind CSS code.

**Inspirations**:
- https://cssgrid-generator.netlify.app
- https://www.tailwindgen.com
- https://github.com/react-grid-layout/react-grid-layout

<img width="2410" height="1630" alt="CSS Grid Generator Screenshot" src="https://github.com/user-attachments/assets/f57e8552-cb59-4521-889c-a2eee9b27860" />

## Features

- Visual grid builder with drag and drop interface
- Configurable grid dimensions and gap spacing
- Real-time preview of grid layouts
- Code generation for CSS, HTML, and Tailwind CSS
- Item resizing and positioning
- Reset functionality
- Responsive design
- Advanced grid layout management with react-grid-layout

### Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **react-grid-layout** - Flexible grid layout library
- **Prism** - Syntax highlighting for code output

### Getting Started

Prerequisites:
- Node.js (version specified in `.nvmrc`)
- pnpm package manager

1. Clone the repository:
```bash
git clone <repository-url>
cd my-css-grid-generator
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

### How to Use

1. **Configure Grid**: Use the control panel to set the number of columns and rows, and adjust gap spacing
2. **Add Items**: Click the "+" buttons in empty grid cells to add new items
3. **Customize Items**: Edit item content and styling directly in the grid
4. **Drag & Drop**: Move items around the grid using drag and drop
5. **Resize Items**: Drag the edges of items to resize them
6. **Copy Code**: Copy the generated CSS, HTML, or Tailwind CSS code from the output panel
7. **Reset**: Use the reset button to clear the grid and start over

### Code Generation

The application generates three types of output:

#### CSS
Clean, vanilla CSS with grid properties:
```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 8px 8px;
  width: 100%;
}
```

#### Tailwind CSS
Utility-first CSS classes:
```css
.grid-container {
    @apply grid grid-cols-4 grid-rows-4 gap-2 w-full;
}
```

#### HTML
Semantic HTML structure:
```html
<div class="grid-container">
  <div class="grid-item-1">Item 1</div>
  <div class="grid-item-2">Item 2</div>
</div>
```

Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): 2025-12-25 15:40:20
Current User's Login: rushi