import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const AuthUser = createParamDecorator(
    (data:unknown,context:ExecutionContext)=>{
        const gqlContext = GqlExecutionContext.create(context).getContext().req
        const user = gqlContext.user
        console.log(user)
        return user;
    }
)