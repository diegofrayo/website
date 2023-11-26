// ###### "pick" output ######

const car = {
	year: 8,
	brand: "mazda",
	color: "red",
};

const yearAndBrand = pick(car, ["brand", "year"]);
console.log(yearAndBrand.brand); // "mazda"
console.log(yearAndBrand.color); // TS error

const colorAndYear = pick(car, ["whatever"]); // TS error

// ###### "stringifyObjectKeyValues" output ######

const test1 = { num: 4, bool: true };
console.log(stringifyObjectKeyValues(test1));
// output: {num: "4, bool: "true" }

const test2 = { num: 4, bool: "true" };
console.log(stringifyObjectKeyValues(test2)); // TS error

// ###### "mirror" output ######

const VARIANTS = mirror(["UNSTYLED", "SIMPLE", "DEFAULT"]);
type T_Variant = keyof typeof VARIANTS;
console.log(VARIANTS);
// output: { "UNSTYLED": "UNSTYLED", "SIMPLE": "SIMPLE", "DEFAULT": "DEFAULT"}
