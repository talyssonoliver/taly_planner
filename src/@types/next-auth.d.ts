declare module "next-auth" {
  type AdapterType = Record<string, unknown>;
  type ProviderType = { id: string; name: string }; // Define the actual type here
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  type CallbackType = any;
  export interface User {
    AuthOptions: {
      adapter: AdapterType;
      providers: ProviderType[];
      callbacks: CallbackType;
    };
    DefaultSession: { user: User };
    id: string;
    name: string;
    email: string;
    username: string;
    avatar_url: string;
  }
}
import type { HTMLElement } from "dom";
declare global {
  interface HTMLLinkElement extends HTMLElement {}
}
