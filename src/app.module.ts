import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { RestaurantsModule } from './restaurants/restaurants.module';


@Module({
  imports: [GraphQLModule.forRoot(
    {
    autoSchemaFile: true  //스키마를 폴더상에 직접만들지 않고 메모리에 저장한다. //join(process.cwd(), 'src/schema.gql'),
  }
  ),
   RestaurantsModule,
  TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'hojunlim',
      password: 'root',
      database: 'uber-eats',
      logging:true,
      synchronize: true,
  })], //root module 설정
  controllers: [],
  providers: [],
})
export class AppModule {}
