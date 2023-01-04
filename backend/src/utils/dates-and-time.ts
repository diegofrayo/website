import dayjs from "dayjs";

export function relativeToMiliseconds(quantity: number, unit: dayjs.ManipulateType): number {
	return dayjs().add(quantity, unit).valueOf() - dayjs().valueOf();
}
