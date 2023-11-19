import { Injectable, Inject } from '@nestjs/common';
import * as schema from '../drizzle/schema'
import { eq, and } from 'drizzle-orm';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
@Injectable()
export class UsersOfUserService {
    constructor(@Inject(DrizzleAsyncProvider) private db: MySql2Database<typeof schema>) {}

    async AddUser(user: schema.NewUserOfUser, id: number) {
        const users = await this.db.insert(schema.usersOfUsers).values({...user, user_id: id});
        // @ts-ignore
        //console.log(users.insertId)
        return users
    }
    async getUsers(id: number) {
        const users = await this.db.query.usersOfUsers.findMany({
            where: eq(schema.usersOfUsers.user_id, id)
        });
        
        return users
    }
    async findOne(idToFind: number, id: number) {
        console.log(id)
        const user = await this.db.select().from(schema.usersOfUsers).where(and(eq(schema.usersOfUsers.id, idToFind), eq(schema.usersOfUsers.user_id, id)))
        return user
    }

    async updateUser(user: schema.NewUserOfUser, id: number) {
        const userUpdate = await this.db.update(schema.usersOfUsers)
        .set(user)
        .where(eq(schema.usersOfUsers.id, id));
        return userUpdate
    }

    async deleteUser(id: number) {
        const userDelete = await this.db.delete(schema.usersOfUsers).where(eq(schema.usersOfUsers.id, id));
        return userDelete
    }
}
