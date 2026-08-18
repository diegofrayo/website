import { object, parse, string, type InferOutput } from "valibot";

export const SignInRequestBody = {
	schema: object({
		authToken: string(),
	}),
};

export type SignInRequestBody = InferOutput<typeof SignInRequestBody.schema>;

export function parseRequestBody(input: unknown) {
	return parse(SignInRequestBody.schema, input);
}
