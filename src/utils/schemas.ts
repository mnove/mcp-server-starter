import { z } from "zod";
import { registry } from "zod/dist/types/v4";

export const ComponentSchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string().optional(),
});

const ExampleSchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string(),
  content: z.string(),
});

export const IndividualComponentSchema = ComponentSchema.extend({
  install: z.string(),
  content: z.string(),
  examples: z.array(ExampleSchema),
});

export const ComponentDetailSchema = z.object({
  name: z.string(),
  type: z.string(),
  files: z.array(
    z.object({
      content: z.string(),
    })
  ),
});

export const ExampleComponentSchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string().optional(),
  registryDependencies: z.array(z.string()),
});

export const ExampleDetailSchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string(),
  files: z.array(
    z.object({
      content: z.string(),
    })
  ),
});
