import React from "react";

/**
 * Strips any AI-related data attributes, classes, or watermarks from props.
 */
export function cleanAIAttributes<T extends Record<string, any>>(props: T): T {
  const cleaned: Record<string, any> = { ...props };

  // Remove AI-related data attributes
  delete cleaned["data-ai"];
  delete cleaned["data-ai-generated"];
  delete cleaned["ai-powered"];
  delete cleaned["aiPowered"];

  // Filter out any AI-related class names
  if (typeof cleaned.className === "string") {
    cleaned.className = cleaned.className
      .split(" ")
      .filter(
        (cls: string) =>
          !cls.startsWith("ai-") &&
          !cls.startsWith("AI-") &&
          !cls.includes("watermark")
      )
      .join(" ");
  }

  // Clean string children if they contain AI text
  if (typeof cleaned.children === "string") {
    cleaned.children = cleaned.children
      .replace(/powered by ai/gi, "")
      .replace(/ai generated/gi, "")
      .replace(/ai-powered/gi, "");
  }

  return cleaned as T;
}

/**
 * Higher-order component to wrap and cleanse any component of AI artifacts.
 */
export function withoutAI<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  const CleanedComponent: React.FC<P> = (props: P) => {
    const cleanedProps = cleanAIAttributes(props);
    return React.createElement(Component, cleanedProps);
  };

  CleanedComponent.displayName = `withoutAI(${
    Component.displayName || Component.name || "Component"
  })`;

  return CleanedComponent;
}

export default withoutAI;
