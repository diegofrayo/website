import { email, minLength, object, string, type Input, parse } from "valibot";

const passwordConstraints = {
	minLength: 10,
};

export const SignInForm = {
	inputsConfig: {
		email: {},
		password: passwordConstraints,
	},
	schema: object({
		email: string([email()]),
		password: string([minLength(passwordConstraints.minLength)]),
	}),
};

export type T_SignInForm = Input<typeof SignInForm.schema>;

export function parseRequestBody(input: unknown) {
	return parse(SignInForm.schema, input);
}
