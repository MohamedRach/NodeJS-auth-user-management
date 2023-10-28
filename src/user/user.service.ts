import { Injectable, Inject } from '@nestjs/common';
import * as schema from '../drizzle/schema'
import { NewUser } from '../drizzle/schema';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
@Injectable()
export class UserService {
    constructor(@Inject(DrizzleAsyncProvider) private db: MySql2Database<typeof schema>) {

    }

    async getUsers() {
        const users = await this.db.query.users.findMany();
        console.log(users)
        return users
    }
    async AddUser() {
        const user: NewUser = {
            firstName: "hamid",
            lastName: "said",
            email: "hamid@gmail.com",
            password: "123455",
        }
        const users = await this.db.insert(schema.users).values(user);
        console.log(users)
        return users
    }
}
