// src/api/client.ts
import createClient from "openapi-fetch";
import type { paths } from "@node-sample/schema";

export const client = createClient<paths>({
  baseUrl: "http://localhost:3000", // バックエンドのアドレス
});