import { Module } from '@nestjs/common';
import {
  Activity,
  ToDoList
} from './vo';
import {
  CreateToDoListDto,
  AddActivityDto,
  AddActivityParamDto,
  GetToDoListParamDto,
  GetActivityParamDto,
  GetActivitiesParamDto,
  UpdateToDoListDto,
  UpdateActivityDto,
  DeleteToDoListParamDto,
  DeleteActivityParamDto,
  UpdateActivityParamDto,
} from './dto';

const vo = [
  Activity,
  ToDoList
]

const dto = [
  CreateToDoListDto,
  AddActivityDto,
  AddActivityParamDto,
  GetToDoListParamDto,
  GetActivityParamDto,
  GetActivitiesParamDto,
  UpdateToDoListDto,
  UpdateActivityDto,
  UpdateActivityParamDto,
  DeleteToDoListParamDto,
  DeleteActivityParamDto,
]

@Module({
  imports: [
    ...vo,
    ...dto,
  ],
  controllers: [],
  providers: [],
  exports: [
    ...vo,
    ...dto,
  ],
})
export class SharedModule { }
