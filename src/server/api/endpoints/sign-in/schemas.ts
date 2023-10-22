import { email, minLength, object, string, type Input } from "valibot";

const passwordConstraints = {
	minLength: 10,
};

export const SignInForm = {
	emailConstraints: {},
	passwordConstraints,
	schema: object({
		email: string([email()]),
		password: string([minLength(passwordConstraints.minLength)]),
	}),
};

export type T_SignInFormSchema = Input<typeof SignInForm.schema>;
