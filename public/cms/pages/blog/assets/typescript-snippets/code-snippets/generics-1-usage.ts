// It's a number and the type was inferred
const myNumber = identity(5);
console.log(myNumber);

type Person = {
	name: string;
};

// The type was passed explicitely (Person)
const person = identity<Person>({ name: "Diego" });
console.log(person);
