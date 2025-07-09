import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema";

// Configure WebSocket for serverless environment
neonConfig.webSocketConstructor = ws;

// Force use of external Neon database
const externalDatabaseUrl = "postgresql://neondb_owner:npg_vmWaLVr1s6cj@ep-morning-dew-a4gdfkje-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

if (!externalDatabaseUrl) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: externalDatabaseUrl });
export const db = drizzle({ client: pool, schema });