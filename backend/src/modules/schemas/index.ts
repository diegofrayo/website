import { ZodIssue, ZodSchema } from "zod";

import HttpError from "~/exceptions/HttpError";
import ServerError from "~/exceptions/ServerError";

export function parseSchema<G_InputType extends object>(
	schema: ZodSchema,
	input: unknown,
	options?: {
		httpError?: boolean;
	},
): G_InputType {
	const result = schema.safeParse(input);

	if (result.success) {
		return result.data as G_InputType;
	}

	if (options?.httpError) {
		throw new HttpError({
			type: HttpError.types.BAD_REQUEST,
			description: `these request body params are wrong: ${getPropertiesNameWithErrorAsString(
				result.error.issues,
			)}`,
			cause: {
				validation_errors: result.error,
			},
		});
	}

	throw new ServerError({
		id: "parsing_schema_error",
		description: `there are issues parsing these properties: ${getPropertiesNameWithErrorAsString(
			result.error.issues,
		)}`,
		cause: {
			validation_errors: result.error,
		},
	});
}

export function parseSchemaSafe<G_InputType extends object>(
	schema: ZodSchema,
	input: unknown,
):
	| { data: G_InputType; errors: undefined }
	| { data: undefined; errors: Record<keyof G_InputType, true> } {
	const result = schema.safeParse(input);

	if (result.success) {
		return {
			data: result.data as G_InputType,
			errors: undefined,
		};
	}

	return {
		data: undefined,
		errors: getPropertiesNameWithError<Record<keyof G_InputType, true>>(result.error.issues),
	};
}

// --- Utils ---

function getPropertiesNameWithErrorAsString(errors: ZodIssue[]): string {
	return JSON.stringify(errors.map((error) => error.path.join(".")));
}

function getPropertiesNameWithError<G_Return>(errors: ZodIssue[]): G_Return {
	return errors
		.map((error) => error.path)
		.reduce((result, key) => {
			return {
				...result,
				[String(key)]: true,
			};
		}, {} as G_Return);
}
