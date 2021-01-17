import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateRestaurantDto } from "./dtos/create-restaurant.dto";
import { Restaurant } from "./entities/restaurants.entity";
import { RestaurantsService } from "./restaurants.service";

@Resolver(of => Restaurant)
export class RestaurantsReslovers{
    constructor(private readonly restaurantsService:RestaurantsService){}
    @Query(returns=>[Restaurant])
    restaurants():Promise<Restaurant[]>{
        return this.restaurantsService.getAll();
    }
    @Mutation(returns=>Boolean)
    createRestaurant(@Args()dto:CreateRestaurantDto):boolean{
        console.log(dto);
        return true;
    }
}