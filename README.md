# MCP Server Starter Template

A comprehensive starter template for building **Model Context Protocol (MCP) servers**, specifically designed for UI libraries and component registries. This template provides a robust foundation for creating MCP servers that can fetch, categorize, and provide component information to AI assistants like Claude.

## 🌎 Real world example?

Check out the [stackzero-labs/mcp](https://github.com/stackzero-labs/mcp) which uses this template to expose its UI components and blocks to AI models. You can also checkout the UI referenced project [stackzero/ui](https://github.com/stackzero-labs/ui)

## 🚀 Features

- **Ready-to-use MCP server** with TypeScript support
- **Component registry integration** for UI libraries
- **Categorized component organization** with flexible category system
- **Zod schema validation** for type safety
- **Development tools** including hot reload and inspector
- **Example implementation** using a real project URL for demonstration
- **Extensible architecture** for custom component types and categories

## 📋 Prerequisites

- Node.js 18 or higher
- pnpm (recommended) or npm
- Basic understanding of TypeScript and MCP

## 🤝 Intended Use Cases

This template is specifically designed for libraries following the `registry` format (like `shadcn/ui`), making it ideal for:

- UI component libraries
- Design systems
- Component registries that need to be accessible via AI assistants
- Tools, utilities, and frameworks that require a structured way to expose UI components to AI models

> Read more about components registries like shadcn/ui here [Component Registries](https://ui.shadcn.com/docs/registry).

With some customizations however, it can be adapted for other types of MCP servers as well.

## 🛠️ Installation

1. Clone or download this template:

```bash
git clone https://github.com/mnove/mcp-starter.git
cd mcp-starter
```

2. Install dependencies:

```bash
pnpm install
```

3. Build the project:

```bash
pnpm run build
```

## ⚙️ Configuration

### 1. Update Project Configuration

Edit `src/lib/config.ts` to point to your own component registry:

```typescript
export const mcpConfig = {
  projectName: "your-project-name",
  // Replace with your actual project URL
  baseUrl: "https://your-ui-library.com",
  registryUrl: "https://your-ui-library.com/r",
  registryFileUrl: "https://your-ui-library.com/registry.json",
};
```

**Note**: This template currently uses `https://ui.stackzero.co` as a demonstration URL. You **must** replace this with your actual project URL for production use.

### 2. Define Component Categories

Customize `src/lib/categories.ts` to match your component structure:

```typescript
export const componentCategories = {
  Buttons: ["button-primary", "button-secondary", "button-ghost"],
  Forms: ["input-text", "input-email", "textarea"],
  // Add your categories here
};
```

### 3. Update Server Metadata

Modify `src/server.ts` to customize your server information:

```typescript
const server = new McpServer({
  name: "your-mcp-server-name",
  version: "1.0.0",
});
```

## 🏃‍♂️ Development

### Start Development Server

```bash
pnpm run dev
```

### Build for Production

```bash
pnpm run build
```

### Inspect MCP Server

```bash
pnpm run inspect
```

This opens the MCP Inspector to test your server tools interactively.
Make sure you auth token is present in the inspector url, otherwise the connection will fail. 

## 📚 Available Tools

The MCP server provides the following tools:

### `getUIComponents`

Returns a comprehensive list of all UI components from your registry.

### Category-specific Tools

Dynamic tools are created for each category defined in `componentCategories`:

- `getButtons` - Get all button components
- `getForms` - Get all form components
- etc.

Each category tool provides:

- Component implementation details
- Usage examples
- Installation instructions
- Related components

## 🏗️ Project Structure

```
mcp-starter/
├── src/
│   ├── server.ts              # Main MCP server implementation
│   ├── lib/
│   │   ├── config.ts          # Configuration settings
│   │   └── categories.ts      # Component categories
│   └── utils/
│       ├── api.ts             # API fetching utilities
│       ├── formatters.ts      # Data formatting helpers
│       ├── schemas.ts         # Zod validation schemas
│       └── index.ts           # Utility exports
├── dist/                      # Built files
├── package.json
└── README.md
```

## 🔧 Customization

### Adding New Component Types

1. **Update schemas** in `src/utils/schemas.ts`:

```typescript
export const CustomComponentSchema = z.object({
  name: z.string(),
  category: z.string(),
  // Add your fields
});
```

2. **Add API functions** in `src/utils/api.ts`:

```typescript
export async function fetchCustomComponents() {
  // Your implementation
}
```

3. **Register new tools** in `src/server.ts`:

```typescript
server.tool("getCustomComponents" /*...*/);
```

### Extending Categories

Simply add new categories to `src/lib/categories.ts`:

```typescript
export const componentCategories = {
  // Existing categories...
  Navigation: ["navbar", "sidebar", "breadcrumbs"],
  DataDisplay: ["table", "card", "badge"],
};
```

The server will automatically create tools for new categories.

### Why categories?

Categories help organize components logically, making it easier for AI assistants to find and suggest relevant components based.
Also, some models and IDE have a limit on the number of tools they can handle, so categorizing helps to keep the number of tools manageable.

You can customize your categories however you want, depending on your cases. If you do not have many tools, then you could also consider not using categories at all.

## 📖 Registry Format

Your component registry should follow this structure:

### Registry File (`registry.json`)

```json
{
  "registry": [
    {
      "name": "button-primary",
      "type": "registry:component",
      "description": "Primary button component"
    }
  ]
}
```

### Component Details (`/r/{component-name}.json`)

```json
{
  "name": "button-primary",
  "type": "registry:component",
  "files": [
    {
      "content": "// Component implementation"
    }
  ]
}
```

## 🚀 Deployment

### As a Local MCP Server

1. Build the project:

```bash
pnpm run build
```

2. Configure in your MCP client (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "your-mcp-server": {
      "command": "node",
      "args": ["/path/to/mcp-starter/dist/server.js"]
    }
  }
}
```

### As an NPM Package

You can also publish this template as an NPM package for easy installation in other projects.

1. Update `package.json` with your details
2. Build and publish:

```bash
pnpm run build
npm publish
```

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contact

Marcello - [@mnove](https://github.com/mnove)

## 🙏 Acknowledgments

- Built with [Model Context Protocol SDK](https://github.com/modelcontextprotocol/sdk)
- Originally inspired by magic-ui MCP server
- Inspired by the need for better AI-component integration
- Thanks to the MCP community for their contributions

---

**⚠️ Important**: Remember to replace `https://ui.stackzero.co` with your actual project URL before using this template in production!
