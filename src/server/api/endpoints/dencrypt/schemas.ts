import { object, string, type Input, enumType, minLength } from "valibot";

export const DencryptForm = {
	schema: object({
		action: enumType(["encrypt", "decrypt"]),
		text: string([minLength(1)]),
	}),
};

export type T_DencryptFormSchema = Input<typeof DencryptForm.schema>;

export type T_DencryptResponseSchema = { output: string };
