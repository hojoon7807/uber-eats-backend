import { Module } from '@nestjs/common';
import { RestaurantsReslovers } from './restaurants.resolver';

@Module({
    providers:[RestaurantsReslovers]
})
export class RestaurantsModule {}
