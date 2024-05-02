import { Module } from '@nestjs/common';
import { SharedModule } from './shared/share.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ToDoListModule } from './to-do-list/to-do-list.module';

@Module({
  imports: [ToDoListModule, SharedModule, CacheModule.register()],
  controllers: [],
  providers: [],
  exports: [CacheModule, SharedModule]
})
export class AppModule {}
