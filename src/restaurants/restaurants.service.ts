
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Restaurant } from "./entities/restaurants.entity";

@Injectable()
export class RestaurantsService{
    constructor(@InjectRepository(Restaurant)
    private readonly restaurantsRepo:Repository<Restaurant>){}
    getAll():Promise<Restaurant[]>{
        return this.restaurantsRepo.find(); //promise method
    }
}