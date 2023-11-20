import { object, type Input, parse, enumType } from "valibot";

export const DataForm = {
	schema: object({
		model: enumType(["books", "films", "timeline"]),
	}),
};

export type T_DataForm = Input<typeof DataForm.schema>;

export function parseRequestBody(input: unknown) {
	return parse(DataForm.schema, input);
}
