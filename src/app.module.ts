import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [TasksModule, TypeOrmModule.forRoot(typeOrmConfig), AuthModule],
})
export class AppModule {}
