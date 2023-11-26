const myArray = [
	{ name: "carlos", age: 31 },
	{ name: "daniel", age: 32 },
	{ name: "diego", age: 31 },
	{ name: "diego", age: 34 },
];

console.log(myArray.sort(sortBy("name", "-age")));

/*
	[
		{ name: "carlos", age: 31 },
		{ name: "daniel", age: 32 },
		{ name: "diego", age: 34 },
		{ name: "diego", age: 31 },
	]
 */
