import { object, string, type Input, enumType, minLength, parse } from "valibot";

export const DencryptForm = {
	schema: object({
		action: enumType(["encrypt", "decrypt"]),
		text: string([minLength(1)]),
	}),
};

export type T_DencryptForm = Input<typeof DencryptForm.schema>;

export type T_DencryptResponse = { output: string };

export function parseRequestBody(input: unknown) {
	return parse(DencryptForm.schema, input);
}
