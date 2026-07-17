import { z } from "zod";

/**
 * A lightweight utility to convert Zod schemas to Gemini-compatible JSON Schema.
 * Optimized for robustness across different Zod versions and Node environments.
 */
export function zodToGeminiSchema(schema: z.ZodType<any>): any {
  const def = schema._def as any;
  let description = (schema as any).description || def.description;

  // Handle Optionals/Nullables
  if (def.typeName === "ZodOptional" || def.typeName === "ZodNullable") {
    const inner = zodToGeminiSchema(def.innerType);
    if (description && !inner.description) inner.description = description;
    return inner;
  }

  // Handle Defaults
  if (def.typeName === "ZodDefault") {
    const inner = zodToGeminiSchema(def.innerType);
    if (description && !inner.description) inner.description = description;
    return inner;
  }

  // Handle Objects
  if (def.typeName === "ZodObject") {
    const properties: Record<string, any> = {};
    const required: string[] = [];
    
    // Support both .shape() method and .shape property
    const shape = typeof def.shape === "function" ? def.shape() : def.shape;

    if (shape) {
      for (const key in shape) {
        const field = shape[key];
        properties[key] = zodToGeminiSchema(field);
        
        const fieldDef = field._def as any;
        const isOptional = fieldDef.typeName === "ZodOptional" || fieldDef.typeName === "ZodNullable";
        const hasDefault = fieldDef.typeName === "ZodDefault";
        
        if (!isOptional && !hasDefault) {
          required.push(key);
        }
      }
    }

    return {
      type: "OBJECT",
      description,
      properties,
      required: required.length > 0 ? required : undefined,
    };
  }

  // Handle Arrays
  if (def.typeName === "ZodArray") {
    return {
      type: "ARRAY",
      description,
      items: zodToGeminiSchema(def.type),
    };
  }

  // Handle Strings
  if (def.typeName === "ZodString") {
    return { type: "STRING", description };
  }

  // Handle Numbers
  if (def.typeName === "ZodNumber") {
    return { type: "NUMBER", description }; // Changed from INTEGER to NUMBER for better compatibility with ZodNumber
  }

  // Handle Booleans
  if (def.typeName === "ZodBoolean") {
    return { type: "BOOLEAN", description };
  }

  // Handle Enums
  if (def.typeName === "ZodEnum") {
    return {
      type: "STRING",
      description: description || `Must be one of: ${def.values.join(", ")}`,
      enum: def.values,
    };
  }

  // Fallback for unknown types (Unions, Native Enums, etc.)
  return { type: "STRING", description };
}
