import { connect } from "@planetscale/database"
import { drizzle } from "drizzle-orm/planetscale-serverless";
import * as schema from './schema';
export const DrizzleAsyncProvider = "drizzleProvider"

export const drizzleProvider = [
    {
        provide: DrizzleAsyncProvider,
        useFactory: async () => {
            const connection = connect({
                host: process.env.DATABASE_HOST,
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
            });
            try {
                const db = drizzle(connection, { schema});;
                console.log(process.env.DATABASE_HOST)
                return db
            } catch (err) {
                console.log("connection faild", err)
            }
            
            
            
        },
        exports: [DrizzleAsyncProvider]
    }
]