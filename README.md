# Enhanced Reablocks MCP Server

A powerful Model Context Protocol (MCP) server that provides intelligent React
component generation and composition using the
[Reablocks](https://reablocks.dev/) design system. This server combines natural
language processing with deep component knowledge to generate production-ready
React components.

## 🚀 Features

- **🧠 Natural Language Processing** - Describe what you want in plain English
- **⚛️ Intelligent Component Generation** - Generates complete React components
  with TypeScript
- **📚 Comprehensive Component Knowledge** - Deep understanding of 50+ Reablocks
  components
- **🎨 Smart Code Composition** - Automatically combines components with proper
  props and patterns
- **📱 Responsive Design** - Generated components include mobile-first
  responsive layouts
- **♿ Accessibility Built-in** - WCAG 2.1 AA compliant components with ARIA
  labels
- **🔧 Production Ready** - Includes error handling, loading states, and
  TypeScript definitions

## 📦 Installation

### Prerequisites

- Node.js 18+
- Cloudflare Workers account
- Claude Desktop or MCP-compatible client

### Setup

1. **Clone or create your MCP server project**

```bash
mkdir reablocks-mcp-server
cd reablocks-mcp-server
npm init -y
```

2. **Install dependencies**

```bash
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node
```

3. **Replace your `src/index.ts` with the enhanced server code**

4. **Deploy to Cloudflare Workers**

```bash
wrangler deploy
```

5. **Configure Claude Desktop**

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "reablocks": {
      "command": "node",
      "args": ["path/to/your/server"],
      "env": {
        "MCP_SERVER_URL": "https://your-worker.your-subdomain.workers.dev"
      }
    }
  }
}
```

## 🛠️ Available Tools

### 1. `generate_intelligent_dashboard`

Generate complete dashboard components from natural language descriptions.

**Parameters:**

- `description` (string): Natural language description of what you want to build
- `requirements` (array, optional): Specific requirements
- `styling` (object, optional): Theme and styling preferences

**Example:**

```
Generate a dashboard with user metrics, data visualization, and action buttons for an admin panel
```

### 2. `explore_reablocks_components`

Discover and explore available Reablocks components by category or search.

**Parameters:**

- `category` (enum, optional): Elements, Form, Layout, Layers, Data, Typography
- `search` (string, optional): Search term to filter components

**Examples:**

```
Category: "Form"
Search: "button"
```

### 3. `ask_about_components`

Ask questions about components in natural language and get intelligent
recommendations.

**Parameters:**

- `question` (string): Your question about components

**Examples:**

```
"I need a form with validation and error handling"
"How do I create a data table with sorting and filtering?"
"What's the best way to display file sizes?"
```

### 4. `get_component_documentation`

Get comprehensive documentation for any Reablocks component.

**Parameters:**

- `componentName` (string): Name of the component (e.g., "Button", "Input")

**Example:**

```
componentName: "Button"
```

### 5. `list_all_components`

Get a complete overview of all available Reablocks components organized by
category.

**Parameters:** None

## 💡 Usage Examples

### Creating a Login Form

```
Prompt: "Create a login form with email, password fields, and validation"

Generated Output:
- Complete React component with TypeScript
- Form validation and error handling  
- Responsive design
- Accessibility features
- Loading states
```

### Building a Dashboard

```
Prompt: "Generate a dashboard with metrics cards, user table, and navigation"

Generated Output:
- Grid-based responsive layout
- Metric cards with data visualization
- Interactive data table with search/filter
- Navigation sidebar
- Loading and error states
```

### Data Display Components

```
Prompt: "Show me components for displaying file sizes and dates"

Generated Output:
- DataSize component for human-readable file sizes
- DateFormat component for flexible date display
- Usage examples and props documentation
```

## 🎨 Generated Component Features

All generated components include:

### ✅ **React Best Practices**

- Functional components with hooks
- Proper state management
- Event handling
- Component composition

### ✅ **TypeScript Support**

- Full type definitions
- Interface declarations
- Type-safe props
- Generic type support where applicable

### ✅ **Responsive Design**

- Mobile-first approach
- Flexible grid layouts
- Breakpoint-aware styling
- Touch-friendly interactions

### ✅ **Accessibility**

- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- Focus management
- Color contrast compliance

### ✅ **Error Handling**

- Loading states
- Error boundaries
- Graceful degradation
- User feedback

### ✅ **Modern Styling**

- Tailwind CSS classes
- CSS Grid and Flexbox
- Consistent spacing
- Theme-aware colors

## 📋 Component Categories

### Elements (UI Building Blocks)

- **Button** - Primary, secondary, and text variants
- **IconButton** - Icon-only buttons with accessibility
- **Badge** - Status indicators and counts
- **Avatar** - User profile images and initials
- **Chip** - Tags, labels, and selectable items

### Form Components

- **Input** - Text, email, password, and other input types
- **Select** - Dropdown selection with search and multi-select
- **Textarea** - Multi-line text input
- **Checkbox** - Single and group checkboxes
- **Radio** - Radio button groups
- **Toggle** - Switch controls
- **Calendar** - Date selection with range support

### Layout Components

- **Card** - Content containers
- **Stack** - Flexible spacing and alignment
- **Divider** - Visual separation
- **Tabs** - Tabbed interfaces
- **Breadcrumbs** - Navigation trails
- **Stepper** - Step-by-step processes

### Data Display

- **DataSize** - Human-readable file sizes (1.2 MB, 3.4 GB)
- **DateFormat** - Flexible date formatting
- **Duration** - Time duration display
- **Ellipsis** - Text truncation with expansion
- **Pager** - Pagination controls
- **Sort** - Sortable column headers

### Overlay Components (Layers)

- **Dialog** - Modal dialogs and popups
- **Drawer** - Slide-out panels
- **Notification** - Toast messages and alerts
- **Tooltip** - Contextual help text
- **Popover** - Rich contextual content
- **Menu** - Dropdown and context menus

## 🔧 Customization

### Styling Options

```javascript
{
  styling: {
    theme: "light" | "dark" | "auto",
    spacing: "compact" | "normal" | "spacious",
    colorScheme: "blue" | "green" | "purple" | "custom"
  }
}
```

### Component Props

All generated components support standard Reablocks props:

- `variant` - Visual style variants
- `size` - Small, medium, large sizing
- `color` - Theme-based color schemes
- `disabled` - Disabled states
- `className` - Custom CSS classes

## 🤖 Natural Language Processing

The server understands various ways to describe component needs:

### Intent Recognition

- **Dashboard**: "dashboard", "admin panel", "overview", "metrics"
- **Form**: "form", "input", "submit", "validation", "contact"
- **Table**: "table", "list", "data grid", "rows and columns"
- **Navigation**: "menu", "nav", "sidebar", "breadcrumbs"

### Component Mapping

- **Buttons**: "button", "click", "action", "submit"
- **Data**: "display data", "show information", "file size"
- **Layout**: "card", "container", "section", "organize"
- **Interactive**: "select", "choose", "toggle", "check"

## 📖 Example Conversations

### Building a Contact Form

```
You: "I need a contact form with name, email, message fields and validation"

Server Response:
- Suggests Input, Textarea, Button, Card components
- Generates complete form with validation
- Includes error handling and submission logic
- Provides TypeScript interfaces
```

### Creating a Data Dashboard

```
You: "Create a dashboard showing user metrics with charts and action buttons"

Server Response:
- Generates responsive grid layout
- Creates metric cards with DataSize components
- Adds interactive buttons and navigation
- Includes loading and error states
```

### Component Discovery

```
You: "What components can I use to display file information?"

Server Response:
- DataSize for file sizes
- DateFormat for timestamps  
- Ellipsis for long filenames
- Badge for file types
- Complete usage examples
```

## 🚨 Error Handling

The server provides helpful error messages for:

- Invalid component names
- Missing required parameters
- Incompatible component combinations
- Malformed requests

## 🔄 Updates and Maintenance

### Keeping Components Current

The server's component database is based on the latest Reablocks documentation.
To update:

1. Review new Reablocks releases
2. Update component schemas in the code
3. Add new examples and use cases
4. Test generated components

### Performance Optimization

- Component metadata is cached in memory
- Generated code is optimized for bundle size
- Minimal runtime dependencies
- Tree-shakeable imports

## 🤝 Contributing

### Adding New Components

1. Add component schema to `ENHANCED_REABLOCKS_COMPONENTS`
2. Include comprehensive prop definitions
3. Add usage examples and use cases
4. Update category mappings

### Improving NLP

1. Extend intent patterns in `ComponentNLP`
2. Add new keyword mappings
3. Improve component suggestion logic
4. Test with various user inputs

## 📄 License

This MCP server is built for use with the Reablocks component library. Please
refer to [Reablocks licensing](https://reablocks.dev/) for component usage
terms.

## 🔗 Related Links

- [Reablocks Documentation](https://reablocks.dev/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Claude Desktop](https://claude.ai/desktop)
- [Cloudflare Workers](https://workers.cloudflare.com/)

## 🆘 Support

For issues related to:

- **Generated components**: Check Reablocks documentation
- **MCP server functionality**: Review this README and error messages
- **Deployment**: Consult Cloudflare Workers documentation

---

**Built with ❤️ for the React and Reablocks community**
