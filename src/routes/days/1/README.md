# Day 1 - Naughty or Nice

## Table des matières

1. [Introduction](#introduction)
  * [Project Objective](#project-objective)
  * [Used Technologies](#used-technologies)
2. [Project Structure](#project-structure)
  * [Src Folder](#src-folder)
  * [Specific Files](#specific-files)

## Introduction

### Project Objective

The Elves have been tirelessly creating presents all year round. They’re right on schedule, but today they’ve run into a big problem; the ancient system for tracking who’s been naughty or nice is out of commission. With the hundreds of thousands of letters from children piling up alongside their records of good and bad deeds, the Elves are in dire need of a modern solution.

Your mission is to build a system for the elves, enabling them to input names and tally each childs deeds to keep track of whether they’re good or bad. You could even categorise these automatically as “naughty” and “nice.” Fortunately, the elves have been meticulous in their record-keeping and have a backup of all the current data in JSON format. You’ll need to import this data into your newly developed system.

Here is an example of what the Elves have stored:

```json
[
	{ "name": "Emma", "tally": 32 },
	{ "name": "Ethan", "tally": 14 },
	{ "name": "Isabella", "tally": 70 },
	{ "name": "Jayden", "tally": -16 },
	{ "name": "Isabella", "tally": -59 },
	{ "name": "Noah", "tally": 19 },
	{ "name": "Mia", "tally": -37 },
	{ "name": "Will", "tally": -20 },
	{ "name": "Sam", "tally": -91 },
	{ "name": "Brittney", "tally": -98 }
	...
]
```

You can fetch this data by making a GET request to `https://advent.sveltesociety.dev/data/2023/day-one.json`

### Used Technologies

- __Svelte Version 5__: This is the latest version of Svelte, a modern JavaScript compiler that allows you to write easy-to-understand JavaScript code which is then compiled to highly efficient code that runs in the browser. It's designed to be simple and intuitive, making it easier to create complex user interfaces 1.
- __SvelteKit Version 2__: SvelteKit is a framework built around Svelte, providing a structured way to build applications. It includes features like server-side rendering, static site generation, and automatic routing. In SvelteKit, you can build entire applications with just a few lines of code 1.
- __Tailwindcss__: This is a utility-first CSS framework packed with classes like ``flex``, ``pt-4``, ``text-center`` and ``rotate-90`` that can be composed to build any design, directly in your markup. It's highly customizable and can be extended with plugins to suit your needs 1.
- __Shadcn__: Shadcn is a library that provides a set of components for Svelte, similar to what you might find in UI libraries like Material UI or Bootstrap. However, unlike those libraries, Shadcn is specifically designed for Svelte and takes advantage of Svelte's reactivity and simplicity 3.
- __Typescript__: TypeScript is a typed superset of JavaScript that adds optional types to the language. It helps catch errors during development through a type system and provides better tooling, like autocompletion, navigation, and refactoring 1.
- __Zod__: Zod is a schema declaration and validation library. It lets you define a schema for your data and validate against it. It's useful for ensuring that your data matches the expected shape and contains valid values 4.

## Project Structure

### Src Folder

The project is divided into two main parts: the `src/` directory and the `$lib` directory.

#### `src/` Directory

The `src/` directory contains all the source code for the application. It is divided into subdirectories according to the day of the advent. For example, for the first day, we have a `day/1` directory. This directory contains the routing for the first day of the advent. Each day has its own similar directory, allowing the code for each day to be isolated and easily managed.

#### `$lib` Directory

The `$lib` directory contains the components and hooks of the application. It is also divided into subdirectories for better organization.

##### `/components` Subdirectory

The `/components` subdirectory contains all the Svelte components used in the application. These components can be reused across different days of the advent.

##### `/hooks` Subdirectory

The `/hooks` subdirectory contains the Svelte hooks. Hooks are special functions that allow interaction with the lifecycle of Svelte components. They are generally used to perform actions upon initialization, update, or destruction of a component.

### Specific Files

#### `src/routes/days/1/schemas.ts`

This file employs the Zod library, a TypeScript-first library for schema declaration and validation, to define two data validation schemas. The first schema, named `ChildSchema`, is an object with two properties: `name` and `tally`. The `name` property is a string with a minimum length requirement of three characters. The `tally` property is a numeric value.

```ts
export const ChildSchema = z.object({
	name: z.string().min(3, { message: 'Name must be at least 3 characters long.' }),
	tally: z.number()
});
```

The second schema, `ChildrenSchema`, is an array of objects that adhere to the `ChildSchema`. This means that it expects an array of objects where each object has a `name` property that is a string of at least three characters, and a `tally` property that is a number.

```ts
export const ChildrenSchema = z.array(ChildSchema);
```

Finally, the `Child` type is derived from the `ChildSchema` using the `z.infer` function. This implies that `Child` is a TypeScript type that corresponds to the object defined by `ChildSchema`.

```ts
export type Child = z.infer<typeof ChildSchema>;
```

#### `src/routes/days/1/+page.server.ts`

This TypeScript file exports a single asynchronous function named `load`. This function is intended to be used as a server-side loader for a SvelteKit page. It uses the Fetch API to retrieve JSON data from a specific URL, and then parses this data using the `ChildrenSchema` imported from another file. The parsed data is then returned within an object.

The `load` function takes an argument which is an object containing a `fetch` method. This `fetch` method is used to make a GET request to a specific URL. The URL appears to be a JSON endpoint for a specific day's data of an Advent calendar hosted on `sveltesociety.dev`. The response from this request is then converted into a JSON object using the `json()` method.

Once the data is retrieved and parsed, it is validated against the `ChildrenSchema` using the `parse` method. This ensures that the data matches the expected structure and contains valid values. If the data does not match the schema, the `parse` method will throw an error.

Finally, the function returns an object containing the validated and parsed data. The key in this object is `children`, and the value is the validated data. This returned object can then be used elsewhere in the application, such as in a Svelte component to render the data.

```ts
export const load: PageServerLoad = async ({ fetch }) => {
	const children = await fetch('https://advent.sveltesociety.dev/data/2023/day-one.json').then(
		(r) => r.json()
	);

	return {
		children: ChildrenSchema.parse(children)
	};
};
```

#### `src/routes/days/1/+page.svelte`

This Svelte component is designed to manage and display a list of children, each associated with a 'tally'. It includes functionality for adding new children, updating their tallies, and paginating the list of children.

The script section begins by defining a constant for the default number of rows displayed per page, and a schema for validating names only. It then initializes stateful values for the list of children and the pagination state. The `onsubmit` function handles form submissions, preventing the default form submission behavior, retrieving the form data, validating it, checking for duplicate names, updating the `children` state with the new child, resetting the form, and resetting the pagination to the first page.

The markup portion of the file creates a layout with a grid container. On the left, a table of children is displayed with their names and tallies, along with controls for adjusting the tally. On the right, a form for adding new children is presented. The form includes input validation and error handling. The pagination component is used to navigate across the list of children [Source 0](https://flowbite-svelte.com/docs/components/pagination).

#### `$lib/hooks/createCounter.ts`

The `createCounter` function in this TypeScript file is a factory function that generates a counter object. This counter object has methods for getting and setting its value, incrementing its value, decrementing its value, and resetting its value to zero.

The `createCounter` function takes two parameters: `updater`, a function that is called whenever the counter's value changes, and `initialValue`, the initial value of the counter. If `initialValue` is not provided, it defaults to 0.

The `createCounter` function begins by declaring a variable `value` and assigning it the `initialValue`. It then returns an object with several methods:

- `value`: This is a getter that returns the current value of the counter.
- `value`: This is a setter that sets the value of the counter to a new value and calls the `updater` function with the new value.
- `increment`: This method increases the value of the counter by one and calls the `updater` function with the new value.
- `decrement`: This method decreases the value of the counter by one and calls the `updater` function with the new value.
- `reset`: This method resets the value of the counter to zero and calls the `updater` function with the new value. This design pattern allows the counter to be generated via localStorage, and resetting to zero serves a semantic purpose in the context of the application, indicating that the child is neither good nor bad

Here's a brief usage example:

```ts
let counter = createCounter((v) => console.log(`New value: ${v}`));
console.log(counter.value); // 0
counter.increment();
console.log(counter.value); // 1
counter.decrement();
console.log(counter.value); // 0
counter.reset();
console.log(counter.value); // 0
```

In this example, `createCounter` is called with a function that logs the new value of the counter every time it changes. The counter's value is initially 0, so the first log statement prints `0`. The `increment` method is then called, increasing the counter's value to 1, and this change is logged. The `decrement` method is called next, decreasing the counter's value back to 0, and this change is also logged. Finally, the `reset` method is called, resetting the counter's value to 0, and this final change is logged.

#### `$lib/hooks/usePagination.svelte.ts`

The `usePagination` function in this TypeScript file is a custom hook for managing pagination of data. It takes three parameters: `input`, an array of data to be paginated; `initialRowPerPage`, the number of rows to display per page; and `defaultPage`, the default page number to start on, which defaults to 1.

The function begins by creating stateful copies of the `input` array, the `defaultPage`, and the `initialRowPerPage`. It then calculates the data to be displayed on the current page (`dataOnPage`) and the total number of pages (`numberOfPages`).

The function returns an object with several properties and methods related to pagination:

- `page`: A getter and setter for the current page number.
- `dataOnPage`: A getter for the data to be displayed on the current page.
- `numberOfPages`: A getter for the total number of pages.
- `rowPerPage`: A getter and setter for the number of rows per page.
- `handleClick`: A method for changing the page number.

This hook is useful for managing the state of paginated data in a Svelte application. It allows you to easily switch between pages and adjust the number of rows per page, providing a smooth user experience for navigating large amounts of data.

#### `$lib/hooks/useStorage.svelte.ts`

The `useStorage` function in this TypeScript file is a custom hook that provides an interface for interacting with the browser's Web Storage API. It's designed to store, retrieve, and manipulate data in either `localStorage` or `sessionStorage` with optional validation through the Zod library.

The function accepts three parameters: `key`, a string representing the key under which the data will be stored; `initialValue`, the initial value to be stored; and `options`, an optional configuration object. The `options` object can specify the storage mechanism to use (`local` or `session`), and a Zod schema for validating the data.

If the global `window` object doesn't exist (which would be the case in a server-side rendering environment), the function simply returns an accessor for the `initialValue`. Otherwise, it determines the storage mechanism to use based on the `options` parameter and retrieves the stored value.

The function attempts to parse and validate the stored value using the provided Zod schema. If parsing and validation fail, it stores the `initialValue` instead. It then returns an accessor for the parsed and validated value.

The accessor is an object with a `value` getter and setter. The getter simply returns the current value, while the setter updates both the value and the stored value in the chosen storage mechanism.

This hook is useful for storing and retrieving data in a type-safe manner, especially in a Svelte application. It provides a simple and intuitive API for managing persistent state.

#### `$lib/components/ui/pagination.svelte`

This file defines a Svelte component named `Pagination`. This component is responsible for generating a pagination interface for a given set of data. It uses the `Button` component from `$lib/components/ui/button` to render individual buttons for each page.

The `Pagination` component accepts several props:

- `count`: The total number of pages.
- `page`: The current page number.
- `siblingCount`: The number of pages to display before and after the current page.
- `boundaryCount`: The number of pages to display at the start and end.
- `onChange`: A callback function to be executed when a page button is clicked.

The component uses several derived state variables to compute the number of pages to display and the actual list of pages to display. It also defines a helper function `getPagination` to compute the list of pages to display based on the provided parameters.

The component renders a flex container that includes buttons for the previous page, the next page, and the individual page buttons. The `buttonPaginate` snippet is used to render each page button. It receives the page number, whether the button is active, whether the button is disabled, and the button label as props.

In terms of functionality, clicking on the previous page button decreases the current page number by 1, while clicking on the next page button increases the current page number by 1. Clicking on a page number button sets the current page number to the corresponding page number. The `onChange` prop is called whenever a page button is clicked, passing the event and the new page number as arguments.