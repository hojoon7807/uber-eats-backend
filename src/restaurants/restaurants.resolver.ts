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
    async createRestaurant(@Args('input')createRestaurantdto:CreateRestaurantDto):Promise<boolean>{
        try{
            await this.restaurantsService.createRestaurant(createRestaurantdto);
            return true;
        }catch(e){
            console.log(e)
            return false;
        }
    }
}