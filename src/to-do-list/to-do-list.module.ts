import { Module } from '@nestjs/common';
import { ToDoListService } from './to-do-list.service';
import { ToDoListController } from './to-do-list.controller';
import { SharedModule } from '../shared/share.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [SharedModule, CacheModule.register()],
  controllers: [ToDoListController],
  providers: [ToDoListService],
})
export class ToDoListModule {}
