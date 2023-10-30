import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import * as schema from '../drizzle/schema'
import { NewUser } from '../drizzle/schema';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
@Injectable()
export class UserService {
    constructor(@Inject(DrizzleAsyncProvider) private db: MySql2Database<typeof schema>) {

    }

    async getUsers() {
        const users = await this.db.query.users.findMany();
        console.log(users)
        return users
    }
    async AddUser(user: NewUser) {
        const users = await this.db.insert(schema.users).values(user);
        // @ts-ignore
        console.log(users.insertId)
        return users
    }

    async findOne(emailToFind: string) {
        const user = await this.db.select().from(schema.users).where(eq(schema.users.email, emailToFind))
        return user
    }
    async getApiKey(key: string) {
        const user = await this.db.select().from(schema.users).where(eq(schema.users.apiKey, key))
        return user
    }
}
