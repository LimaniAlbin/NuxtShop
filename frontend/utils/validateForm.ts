import type { ZodSchema } from "zod";

export function validateFormData<T extends Record<string, any>>(formData: T, schema: ZodSchema<T>) {
    const result = schema.safeParse(formData);
    if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors as Record<keyof T, string[] | undefined>;
        const errors: Partial<Record<keyof T, string>> = {};

        (Object.keys(fieldErrors) as (keyof T)[]).forEach((key) => {
            errors[key] = fieldErrors[key]?.join(", ") || "";
        });

        return { valid: false, errors };
    }

    return { valid: true, errors: {} };
}

