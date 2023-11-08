import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  var whitelist = ['http://localhost:5173', 'https://auth-user-management.onrender.com'];
  app.use(cookieParser());
  app.enableCors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        console.log("allowed cors for:", origin)
        callback(null, true)
      } else {
        console.log("blocked cors for:", origin)
        callback(new Error('Not allowed by CORS'))
      }
    },
    allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
    methods: "GET,PUT,POST,DELETE,UPDATE,OPTIONS,PATCH",
    credentials: true,
    });
  await app.listen(8000);
}
bootstrap();
