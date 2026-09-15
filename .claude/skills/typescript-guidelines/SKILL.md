---
name: typescript-guidelines
description: Coding rules for TypeScript source files in diegofrayo's projects, covering file naming and function parameter/return type conventions. Use this skill whenever creating or renaming a TypeScript source file, or whenever writing/editing a function that receives an object parameter and/or returns an object. Triggers on requests like "add a new file for X", "create a function that takes X and returns Y", or any TypeScript authoring/review task. Apply these guidelines proactively — don't wait to be asked.
---

# TypeScript Guidelines

## File Naming

All source code file names must be written in kebab-case.

```
get-user-info.ts       ✅
match-history.service.ts ✅
GetUserInfo.ts          ❌
matchHistoryService.ts  ❌
```

## Function Parameter and Return Types

When a function receives an object parameter and returns an object, do not define the parameter or
return types inline.

Instead, create named types immediately above the function using this naming convention:

- `<FunctionName>Params` for the parameter type.
- `<FunctionName>Return` for the return type.

```ts
type CalculateStatsParams = {
	// parameter properties
};

type CalculateStatsReturn = {
	// return properties
};

function calculateStats(params: CalculateStatsParams): CalculateStatsReturn {
	// ...
}
```

Always prefer these named types over inline object types in function signatures.
