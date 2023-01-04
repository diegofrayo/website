import { ZodIssue, ZodSchema } from "zod";

import HttpError from "~/exceptions/HttpError";
import ServerError from "~/exceptions/ServerError";

export function parseSchema<G_InputType>(
	schema: ZodSchema,
	input: unknown,
	options?: { httpError: boolean },
): G_InputType {
	const result = schema.safeParse(input);

	if (result.success) {
		return result.data as G_InputType;
	}

	if (options?.httpError) {
		throw new HttpError({
			type: HttpError.types.BAD_REQUEST,
			description: `these request body params are wrong: ${getErrorsName(result.error.issues)}`,
			cause: {
				validation_errors: result.error,
			},
		});
	} else {
		throw new ServerError({
			id: "parsing_schema_error",
			description: `there are issues parsing these properties: ${getErrorsName(
				result.error.issues,
			)}`,
			cause: {
				validation_errors: result.error,
			},
		});
	}
}

// --- Utils ---

function getErrorsName(errors: ZodIssue[]): string {
	return JSON.stringify(errors.map((error) => error.path.join(".")));
}
