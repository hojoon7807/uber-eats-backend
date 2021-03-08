import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection } from 'typeorm';

jest.mock('got',()=>{
  return {
    post:jest.fn(),
  };
});
const GRAPHQL_ENDPOINT = '/graphql';
const testUser = {
  email:'e2etest@gmail.com',
  password:'1234'
}
describe('UserModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });
  describe('createAccount',()=>{
    it('should create account', ()=>{
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation {
            createAccount(input: {
              email:"${testUser.email}",
              password:"${testUser.password}",
              role:Owner
            }) {
              ok
              error
            }
          }
          `,
      }).expect(200)
      .expect(res=>{
        expect(res.body.data.createAccount.ok).toBe(true);
        expect(res.body.data.createAccount.error).toBe(null);
      });
    });
    it('should fail if user exist',()=>{
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation {
            createAccount(input: {
              email:"${testUser.email}",
              password:"${testUser.password}",
              role:Owner
            }) {
              ok
              error
            }
          }
          `,
      }).expect(200)
      .expect(res=>{
        expect(res.body.data.createAccount.ok).toBe(false);
        expect(res.body.data.createAccount.error).toBe("There is a user with that email already");
      })
    })
  })
  it.todo('login')
  describe('login',()=>{
    it('should login with correct credential',()=>{
      return request(app.getHttpServer()).post(GRAPHQL_ENDPOINT).send({
        query:`
        mutation{
          login(input:{
            email:"${testUser.email}",
            password:"${testUser.password}"
        })
          {
            ok
            error
            token
          }
        }`
      }).expect(200)
      .expect(res=>{
        const {
          body:{data:{login}}
        } =res;
        expect(login.ok).toBe(true);
        expect(login.error).toBe(null);
        expect(login.token).toEqual(expect.any(String));
      });
    });
    it('should not be able to login with wrong credential',()=>{
      return request(app.getHttpServer()).post(GRAPHQL_ENDPOINT).send({
        query:`
        mutation{
          login(input:{
            email:"${testUser.email}",
            password:"1"
        })
          {
            ok
            error
            token
          }
        }`
      }).expect(200)
      .expect(res=>{
        const {
          body:{data:{login}}
        } =res;
        expect(login.ok).toBe(false);
        expect(login.error).toBe("Wrong password");
        expect(login.token).toBe(null);
      });
    })
  })
  it.todo('me')
  it.todo('userProfile')
  it.todo('editProfile')
  it.todo('verifyEmail')
});
