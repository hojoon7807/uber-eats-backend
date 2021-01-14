import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { RestaurantsModule } from './restaurants/restaurants.module';


@Module({
  imports: [GraphQLModule.forRoot({
    autoSchemaFile: true  //스키마를 폴더상에 직접만들지 않고 메모리에 저장한다. //join(process.cwd(), 'src/schema.gql'),
  }
  ), RestaurantsModule], //root module 설정
  controllers: [],
  providers: [],
})
export class AppModule {}
