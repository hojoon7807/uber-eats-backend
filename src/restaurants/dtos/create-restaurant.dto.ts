import { ArgsType, Field, InputType, OmitType } from "@nestjs/graphql";
import { IsBoolean, IsNumber, IsString, Length } from "class-validator";
import { Restaurant } from "../entities/restaurants.entity";

@InputType() //InputType
export class CreateRestaurantDto extends OmitType(Restaurant,['id'],InputType){} //omit 명시한 컬럼을 제외한 테이블을 extends 레스토랑 테이블은 오브젝트 타입으로 정의되어있다.
//npm i class-validator 