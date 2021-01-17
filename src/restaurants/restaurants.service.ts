
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRestaurantDto } from "./dtos/create-restaurant.dto";
import { Restaurant } from "./entities/restaurants.entity";

@Injectable()
export class RestaurantsService{
    constructor(@InjectRepository(Restaurant)
    private readonly restaurantsRepo:Repository<Restaurant>){}
    getAll():Promise<Restaurant[]>{
        return this.restaurantsRepo.find(); //promise method
    }
    createRestaurant(createRestaurantdto:CreateRestaurantDto):Promise<Restaurant>{
        // const newRestaurant = new Restaurant();
        // newRestaurant.id = createRestaurantdto.id;
        const newRestaurant = this.restaurantsRepo.create(createRestaurantdto);
        return this.restaurantsRepo.save(newRestaurant); 
    }
}