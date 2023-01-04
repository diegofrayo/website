import { z } from "zod";

import v from "~/lib/validator";

export const authCredentialsSchema = z.object({
	email: z.custom<string>(v.isEmail),
	password: z.custom<string>((input) => (v.isString(input) ? input.length >= 10 : false)),
});

export type T_AuthCredentials = z.infer<typeof authCredentialsSchema>;
