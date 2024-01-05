// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	
  namespace svelteHTML {
    interface HTMLAttributes {
      'on:consider'?: (event: CustomEvent) => void
      'on:finalize'?: (event: CustomEvent) => void
    }
  }
}

export {};
