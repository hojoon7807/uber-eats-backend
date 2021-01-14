import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateRestaurantDto } from "./dtos/create-restaurant.dto";
import { Restaurant } from "./entities/restaurants.entity";

@Resolver(of => Restaurant)
export class RestaurantsReslovers{
    @Query(returns=>[Restaurant])
    restaurants(@Args('veganOnly')veganOnly:Boolean/*for graphql*/):Restaurant[]{
        console.log(veganOnly)
        return [];        
    }
    @Mutation(returns=>Boolean)
    createRestaurant(
        @Args()dto:CreateRestaurantDto
    ):boolean{
        console.log(dto);
        return true;
    }
}