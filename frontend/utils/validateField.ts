// ~/utils/validateField.ts
import type { ZodRawShape, ZodObject } from "zod";

export function validateField<T extends ZodRawShape>(
    field: keyof T,
    value: any,
    schema: ZodObject<T>
): string {
    // Create a mask to pick the single field.
    const mask = { [field]: true };
    // Cast mask as any to satisfy the strict type required by schema.pick.
    const fieldSchema = schema.pick(mask as any);
    const result = fieldSchema.safeParse({ [field]: value });

    if (!result.success) {
        // Cast flattened.fieldErrors to a Record<string, string[]> so we can index it.
        const flattened = result.error.flatten();
        const fieldErrors = flattened.fieldErrors as Record<string, string[]>;
        return fieldErrors[field as string]?.join(", ") || "";
    }
    return "";
}
