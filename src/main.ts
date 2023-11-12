import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  var whitelist = ['http://localhost:5173', 'https://auth-user-management.onrender.com'];
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, Access-Control-Allow-Credentials',
    methods: "GET,PUT,POST,DELETE,UPDATE,OPTIONS,PATCH",
    credentials: true,
    });
  await app.listen(8000);
}
bootstrap();
