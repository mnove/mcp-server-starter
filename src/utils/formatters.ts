/**
 * Formats a component name by converting it from kebab-case to PascalCase.
 * @param componentName
 * @returns
 */
export function formatComponentName(componentName: string): string {
  return componentName
    .split("-")
    .map((part) => {
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join("");
}
