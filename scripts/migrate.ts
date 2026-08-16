import { Pool } from "pg"; import { migrate } from "../packages/database/src/migrations.ts";
const pool=new Pool({connectionString:process.env.DATABASE_URL}); await migrate(pool); await pool.end(); console.log("Migrations complete");
