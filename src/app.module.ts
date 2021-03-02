import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; //npm i --save @nestjs/config 환경변수 설정을 위해 사용
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi'; //타입스크립트가 아닌 자바스크립트 import 변수의 유효성검사
import { join } from 'path';
import { Restaurant } from './restaurants/entities/restaurants.entity';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { User } from './users/entities/user.entity';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { AuthModule } from './auth/auth.module';
import { Verification } from './users/entities/verification.entity';
import { EmailModule } from './email/email.module';



@Module({
  imports: [GraphQLModule.forRoot(
    {
    autoSchemaFile: true,  //스키마를 폴더상에 직접만들지 않고 메모리에 저장한다. //join(process.cwd(), 'src/schema.gql'),
    context:({req})=>{user:req['user']}
  }
  ),
  
  ConfigModule.forRoot({
    isGlobal:true,
    envFilePath:process.env.NODE_ENV==="dev"?".env.dev":".env.test",
    ignoreEnvFile:process.env.NODE_ENV==='prod',
    validationSchema:Joi.object({
    NODE_ENV:Joi.string().valid('dev','prod','test').required(),
    DB_HOST:Joi.string().required(),
    DB_PORT:Joi.string().required(),
    DB_USERNAME:Joi.string().required(),
    DB_PASSWORD:Joi.string().required(),
    DB_NAME:Joi.string().required(),
    PRIVATE_KEY:Joi.string().required(),
    MAILGUN_API_KEY: Joi.string().required(),
    MAILGUN_DOMAIN_NAME: Joi.string().required(),
    MAILGUN_FROM_EMAIL: Joi.string().required(),
    })
    }),
  TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      logging:process.env.NODE_ENV!=='prod'&&process.env.NODE_ENV!=='test',
      synchronize: process.env.NODE_ENV!=='prod',
      entities:[User,Restaurant,Verification]
  }),
  RestaurantsModule,
  UsersModule,
  CommonModule,
  JwtModule.forRoot({privateKey:process.env.PRIVATE_KEY }),
  EmailModule.forRoot({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN_NAME,
    fromEmail: process.env.MAILGUN_FROM_EMAIL,
  }),
  AuthModule,
], //root module 설정
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule{
  configure(consumer:MiddlewareConsumer){
    consumer.apply(JwtMiddleware).forRoutes({
      path:'/graphql',
      method:RequestMethod.POST
    })
  }
}
