import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';


@Module({
  imports: [GraphQLModule.forRoot()], //root module 설정
  controllers: [],
  providers: [],
})
export class AppModule {}
