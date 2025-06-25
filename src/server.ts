#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  IndividualComponentSchema,
  fetchComponentDetails,
  fetchExampleComponents,
  fetchExampleDetails,
  fetchUIComponents,
} from "./utils/index.js";
import { formatComponentName } from "./utils/formatters.js";
import { componentCategories } from "./lib/categories.js";

// Initialize the MCP Server
const server = new McpServer({
  name: "your-mcp-server",
  version: "0.0.1",
});

// Register the main tool for getting all components
server.tool(
  "getUIComponents",
  "Provides a comprehensive list of all ui components.",
  {},
  async () => {
    try {
      const uiComponents = await fetchUIComponents();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(uiComponents, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to fetch components",
          },
        ],
        isError: true,
      };
    }
  }
);

function createComponentExampleRegistry(
  exampleComponentList: Array<{
    name: string;
    registryDependencies?: string[];
  }>
): Map<string, string[]> {
  const componentRegistry = new Map<string, string[]>();

  for (const exampleItem of exampleComponentList) {
    if (
      exampleItem.registryDependencies &&
      Array.isArray(exampleItem.registryDependencies)
    ) {
      for (const dependencyUrl of exampleItem.registryDependencies) {
        if (
          typeof dependencyUrl === "string" &&
          dependencyUrl.includes("your-project-url.com")
        ) {
          const nameExtraction = dependencyUrl.match(/\/r\/([^\/]+)$/);
          if (nameExtraction && nameExtraction[1]) {
            const extractedComponentName = nameExtraction[1];
            if (!componentRegistry.has(extractedComponentName)) {
              componentRegistry.set(extractedComponentName, []);
            }
            if (
              !componentRegistry
                .get(extractedComponentName)
                ?.includes(exampleItem.name)
            ) {
              componentRegistry
                .get(extractedComponentName)
                ?.push(exampleItem.name);
            }
          }
        }
      }
    }
  }
  return componentRegistry;
}

async function fetchComponentsByCategory(
  categoryComponents: string[],
  allComponents: any[],
  exampleNamesByComponent: Map<string, string[]>
) {
  const componentResults = [];

  for (const componentName of categoryComponents) {
    const component = allComponents.find((c) => c.name === componentName);
    if (!component) continue;

    try {
      const componentDetails = await fetchComponentDetails(componentName);
      const componentContent = componentDetails.files[0]?.content;

      const relevantExampleNames =
        exampleNamesByComponent.get(componentName) || [];

      // Generate installation instructions
      const installInstructions = `You can install the component using  \
      shadcn/ui CLI. For example, with npx: npx shadcn@latest add \
      "https://your-project-url.com/r/${componentName}.json" (Rules: make sure the URL is wrapped in \
      double quotes. Once installed, you can import the component like this: import { ${formatComponentName(
        component.name
      )} } from \
      "@/components/ui/${componentName}";`;

      const disclaimerText = `The code below is for context only. It helps you understand
      the component's props, types, and behavior. After installing, the component
      will be available for import via: import { ${formatComponentName(
        component.name
      )} } \
      from "@/components/ui/${componentName}";`;

      const exampleDetailsList = await Promise.all(
        relevantExampleNames.map((name) => fetchExampleDetails(name))
      );

      const formattedExamples = exampleDetailsList
        .filter((details) => details !== null)
        .map((details) => ({
          name: details.name,
          type: details.type,
          description: details.description,
          content: details.files[0]?.content,
        }));

      const validatedComponent = IndividualComponentSchema.parse({
        name: component.name,
        type: component.type,
        description: component.description,
        install: installInstructions,
        content: componentContent && disclaimerText + componentContent,
        examples: formattedExamples,
      });

      componentResults.push(validatedComponent);
    } catch (error) {
      console.error(`Error processing component ${componentName}:`, error);
    }
  }

  return componentResults;
}

// Registers tools for each component category
async function registerComponentsCategoryTools() {
  const [components, allExampleComponents] = await Promise.all([
    fetchUIComponents(),
    fetchExampleComponents(),
  ]);

  const exampleNamesByComponent =
    createComponentExampleRegistry(allExampleComponents);

  for (const [category, categoryComponents] of Object.entries(
    componentCategories
  )) {
    const componentNamesString = categoryComponents.join(", ");

    server.tool(
      `get${category}`,
      `Provides implementation details for ${componentNamesString} components.`,
      {},
      async () => {
        try {
          const categoryResults = await fetchComponentsByCategory(
            categoryComponents,
            components,
            exampleNamesByComponent
          );

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(categoryResults, null, 2),
              },
            ],
          };
        } catch (error) {
          let errorMessage = `Error processing ${category} components`;
          if (error instanceof Error) {
            errorMessage += `: ${error.message}`;
          }
          return {
            content: [{ type: "text", text: errorMessage }],
            isError: true,
          };
        }
      }
    );
  }
}

// Start the MCP server
async function startServer() {
  try {
    // Initialize category tools first
    await registerComponentsCategoryTools();
    // Connect to stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    console.error("❌ Error starting MCP server:", error);

    // Try to start server anyway with basic functionality
    try {
      const transport = new StdioServerTransport();
      await server.connect(transport);
      console.error("⚠️ MCP server started with limited functionality");
    } catch (connectionError) {
      console.error("❌ Failed to connect to transport:", connectionError);
      process.exit(1);
    }
  }
}

// Start the server
startServer();
