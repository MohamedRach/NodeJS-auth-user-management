// README.md
# Auth & User management API
### Introduction
This project is an open source API that enable developers to organize user interactions for their applications, it ensures logins, user registration and user management. 
### Project Support Features
* Developers can offer login, signup with email and password.
* Developers can also offer authentification with google.
* Developers can manage their users easily.
* Please check this [example Application](https://github.com/MohamedRach/auth-and-user-management-app-example) to see how to work with the API
### API Endpoints
| HTTP Verbs | Endpoints | Action |
| --- | --- | --- |
| GET | /users/ | To get All users |
| POST | /users/ | To Add A user |
| GET | /users/:id | To get a single user by id |
| PATCH | /users/update/:id | To update a user |
| DELETE | /users/delete/:id | To delete a user|
| POST | /auth-users/signup | To signUp a user |
| DELETE | /auth-users/login| To Login a user |
### Technologies Used
* [NodeJS](https://nodejs.org/) This is a cross-platform runtime environment built on Chrome's V8 JavaScript engine used in running JavaScript codes on the server. It allows for installation and managing of dependencies and communication with databases.
* [NestJS](https://www.expresjs.org/) This is a NodeJS web application framework.
* [PlanetScale](https://planetscale.com/) PlanetScale is a MySQL-compatible serverless database that brings you scale, performance, and reliability — without sacrificing developer experience.
* [Drizzle ORM](https://orm.drizzle.team/) Drizzle ORM is a lightweight and intuitive Object-Relational Mapping (ORM) 

### License
This project is available for use under the MIT License.