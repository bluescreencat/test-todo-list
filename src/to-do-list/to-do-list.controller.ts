import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post, Put, Query, Req } from '@nestjs/common';
import { ToDoListService } from './to-do-list.service';
import { CreateToDoListDto, AddActivityDto, AddActivityParamDto, GetActivitiesParamDto, UpdateToDoListDto, UpdateActivityDto, UpdateActivityParamDto, GetActivityParamDto, UpdateToDoListParamDto, DeleteToDoListParamDto, DeleteActivityParamDto, GetToDoListParamDto } from '../shared/dto';
import { Activity, ToDoList } from '../shared/vo';

@Controller('to-do-list')
export class ToDoListController {

    constructor(private toDoListService: ToDoListService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createToDoList(@Body() createToDoListDto: CreateToDoListDto): Promise<number> {
        return await this.toDoListService.createToDoList(createToDoListDto);
    }

    @Get()
    getAllToDoList(): ToDoList[] {
        return this.toDoListService.getAllToDoList();
    }

    @Get(':toDoListId')
    getToDoList(@Param() getToDoListParamDto: GetToDoListParamDto) {
        return this.toDoListService.getToDoList(getToDoListParamDto);
    }

    @Post('/:toDoListId/activities')
    @HttpCode(HttpStatus.CREATED)
    addActivity(@Body() addActivityDto: AddActivityDto, @Param() addActivityParamDto: AddActivityParamDto): number {
        return this.toDoListService.addActivity(addActivityDto, addActivityParamDto);
    }

    @Get('/:toDoListId/activities')
    getActivities(@Param() getActivitiesParamDto: GetActivitiesParamDto): Activity[] {
        return this.toDoListService.getActivities(getActivitiesParamDto);
    }

    @Get('/:toDoListId/activities/:activityId')
    getActivity(@Param() getActivityParamDto: GetActivityParamDto): Activity {
        return this.toDoListService.getActivity(getActivityParamDto);
    }

    @Put('/:toDoListId')
    updateToDoList(@Param() updateToDoListParamDto: UpdateToDoListParamDto, @Body() updateToDoListDto: UpdateToDoListDto): void {
        return this.toDoListService.updateToDoList(updateToDoListParamDto, updateToDoListDto);
    }

    @Put('/:toDoListId/activities/:activityId')
    updateActivity(@Param() updateActivityParamDto: UpdateActivityParamDto, @Body() updateActivityDto: UpdateActivityDto): void {
        return this.toDoListService.updateActivity(updateActivityParamDto, updateActivityDto);
    }

    @Delete('/:toDoListId')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteToDoList(@Param() deleteToDoListParamDto: DeleteToDoListParamDto): void {
        return this.toDoListService.deleteToDoList(deleteToDoListParamDto);
    }

    @Delete('/:toDoListId/activities/:activityId')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteActivity(@Param() deleteActivityParamDto: DeleteActivityParamDto): void {
        return this.toDoListService.deleteActivity(deleteActivityParamDto);
    }
}