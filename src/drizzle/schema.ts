import { mysqlTable } from "drizzle-orm/mysql-core";
import { bigint, varchar, int } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";


export const users = mysqlTable("users", {
    id: bigint('id', {mode: 'number'}).primaryKey().autoincrement(),
    firstName: varchar('firstName', {length: 100}),
    lastName: varchar("lastName", {length: 100}),
    email: varchar("email", {length: 250}),
    password: varchar("password", {length: 500}),
})

export const usersOfUsers = mysqlTable("usersOfUsers", {
    id: bigint('id', {mode: 'number'}).primaryKey().autoincrement(),
    username: varchar('username', {length: 100}),
    email: varchar("email", {length: 250}),
    password: varchar("password", {length: 500}),
    user_id: int("user_id")
})
export const usersRelations = relations(users, ({ many }) => ({
    usersOfUsers: many(usersOfUsers)
  }))
  
  
//👇 This code block defines which columns in the two tables are related
export const blocksRelations = relations(usersOfUsers, ({ one }) => ({
    user: one(users, {
      fields: [usersOfUsers.user_id],
      references: [users.id]
    })
}))

export type User = typeof users.$inferSelect;
export type UserOfUser = typeof usersOfUsers.$inferSelect;

export type NewUser = typeof users.$inferInsert;
export type NewUserOfUser = typeof users.$inferInsert;

