import { mcpConfig } from "../lib/config.js";
import {
  ComponentDetailSchema,
  ComponentSchema,
  ExampleComponentSchema,
  ExampleDetailSchema,
} from "./schemas.js";

/**
 *  Fetches all UI components from the registry.
 *  @returns An array of components with their details.
 */
export async function fetchUIComponents() {
  try {
    const response = await fetch(mcpConfig.registryFileUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch registry.json: ${response.statusText} - Status: ${response.status}`
      );
    }
    const data = await response.json();

    return data.registry
      .filter((item: any) => item.type === "registry:component")
      .map((item: any) => {
        try {
          return ComponentSchema.parse({
            name: item.name,
            type: item.type,
            description: item.description,
          });
        } catch (parseError) {
          return null;
        }
      });
  } catch (error) {
    return [];
  }
}

/**
 * Fetches details for a specific component from the registry.
 * @param componentName The name of the component.
 * @returns The details of the component.
 */
export async function fetchComponentDetails(componentName: string) {
  try {
    const response = await fetch(
      `${mcpConfig.registryUrl}/${componentName}.json`
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch component ${componentName}: ${response.statusText}`
      );
    }
    const data = await response.json();
    return ComponentDetailSchema.parse(data);
  } catch (error) {
    console.error(`Error fetching component ${componentName}:`, error);
    throw error;
  }
}

/**
 * Fetches example components from the registry.
 * @returns An array of example components.
 */
export async function fetchExampleComponents() {
  try {
    const response = await fetch(mcpConfig.registryFileUrl);
    const data = await response.json();

    return data.registry
      .filter((item: any) => item.type === "registry:example")
      .map((item: any) => {
        return ExampleComponentSchema.parse({
          name: item.name,
          type: item.type,
          description: item.description,
          registryDependencies: item.registryDependencies,
        });
      });
  } catch (error) {
    console.error("Error fetching example components:", error);
    return [];
  }
}

/**
 * Fetches details for a specific example component.
 * @param exampleName The name of the example component.
 * @returns The details of the example component.
 */
export async function fetchExampleDetails(exampleName: string) {
  try {
    const response = await fetch(`${mcpConfig.registryUrl}/${exampleName}`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch example details for ${exampleName}: ${response.statusText}`
      );
    }
    const data = await response.json();
    return ExampleDetailSchema.parse(data);
  } catch (error) {
    console.error(`Error fetching example details for ${exampleName}:`, error);
    throw error;
  }
}
