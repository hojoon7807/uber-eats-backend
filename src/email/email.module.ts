import { DynamicModule, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constant';
import { EmailModuleOptions } from './email.interfaces';
import { EmailService } from './email.service';

@Module({})
export class EmailModule {
    static forRoot(options:EmailModuleOptions):DynamicModule{
        return {
            module:EmailModule,
            exports:[EmailService],
            providers:[{
                provide:CONFIG_OPTIONS,
                useValue:options
            },
        EmailService]
        }
    }
}

