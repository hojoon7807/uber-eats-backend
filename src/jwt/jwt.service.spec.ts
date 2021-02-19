import { Test } from "@nestjs/testing";
import { CONFIG_OPTIONS } from "src/common/common.constant";
import { JwtService } from "./jwt.service";
import * as jwt from "jsonwebtoken";

//mock npm moodule
jest.mock('jsonwebtoken',()=>{
    return{
        sign:jest.fn(()=>'TOKEN')
    }
    
})
const TEST_KEY = 'testKey'
describe('Jwt Service',()=>{
    let service:JwtService;
    beforeEach(async () =>{
        const module = await Test.createTestingModule({
            providers:[
                JwtService, {
                    provide:CONFIG_OPTIONS,
                    useValue:{privateKey:TEST_KEY}
                }
            ]
        }).compile();
        service = module.get<JwtService>(JwtService); 
    });
    it("be define",()=>{
        expect(service).toBeDefined();
    });
    describe('sign',()=>{
        it('should return signed token', async () => {
            const ID = 1
            const token = service.sign(ID);
            expect(jwt.sign).toHaveBeenCalledTimes(1);
            expect(jwt.sign).toHaveBeenCalledWith({id:ID},TEST_KEY);
        })
    })
})