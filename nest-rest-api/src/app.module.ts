import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EmployeesModule } from './employees/employees.module';

@Module({
  imports: [UsersModule, EmployeesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
