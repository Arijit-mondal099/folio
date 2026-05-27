import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/lib/env";
import { schema } from "@/db/schema";

export const db = drizzle(env.DATABASE_URL, { schema });
