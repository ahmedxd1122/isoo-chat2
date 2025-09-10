/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as agora from "../agora.js";
import type * as auth from "../auth.js";
import type * as chat from "../chat.js";
import type * as gifts from "../gifts.js";
import type * as http from "../http.js";
import type * as messages from "../messages.js";
import type * as posts from "../posts.js";
import type * as rooms from "../rooms.js";
import type * as router from "../router.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  agora: typeof agora;
  auth: typeof auth;
  chat: typeof chat;
  gifts: typeof gifts;
  http: typeof http;
  messages: typeof messages;
  posts: typeof posts;
  rooms: typeof rooms;
  router: typeof router;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
