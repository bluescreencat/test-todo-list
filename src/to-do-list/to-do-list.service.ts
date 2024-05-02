import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Activity, ToDoList } from '../shared/vo';
import {
    CreateToDoListDto,
    AddActivityParamDto,
    AddActivityDto,
    GetActivitiesParamDto,
    GetActivityParamDto,
    UpdateToDoListParamDto,
    UpdateActivityParamDto,
    UpdateActivityDto,
    DeleteToDoListParamDto,
    GetToDoListParamDto,
    UpdateToDoListDto,
    DeleteActivityParamDto
} from '../shared/dto';

@Injectable()
export class ToDoListService {

    private toDoList: ToDoList[] = [];
    private toDoListIdCounter: number = 0;
    private activityIdCounter: Map<number, number> = new Map();

    constructor() {}


    public getNewToDoListId(): number {
        return ++this.toDoListIdCounter;
    }

    public getNewActivityId(toDoListId: number): number {
        return ++this.activityIdCounter[toDoListId];
    }

    private saveToDoList(toDoList: ToDoList): void {
        this.toDoList.push(toDoList);
    }

    public async createToDoList(createToDoListDto: CreateToDoListDto): Promise<number> {
        let toDoListId = this.getNewToDoListId();
        const toDoList = new ToDoList();
        toDoList.id = toDoListId;
        toDoList.name = createToDoListDto.name;
        toDoList.activities = [];
        this.activityIdCounter[toDoListId] = 0;
        this.saveToDoList(toDoList);
        return toDoListId;
    }

    
    public getAllToDoList(): ToDoList[] {
        return this.toDoList;
    }

    public getToDoList(getToDoListParamDto: GetToDoListParamDto): ToDoList {
        const toDoList = this.toDoList.find((item) => item.id === getToDoListParamDto.toDoListId);
        if (!toDoList) {
            throw new HttpException('the resource is not available.', HttpStatus.NOT_FOUND);
        }

        return toDoList;
    }

    public addActivity(addActivityDto: AddActivityDto, addActivityParamDto: AddActivityParamDto): number {
        const activityId = this.getNewActivityId(addActivityParamDto.toDoListId);
        const toDoList = this.toDoList.find((item) => item.id === addActivityParamDto.toDoListId)
        if (!toDoList) {
            throw new HttpException('the resource is not available.', HttpStatus.NOT_FOUND)
        }

        const activity = new Activity();
        activity.id = activityId;
        activity.isActive = false;
        activity.detail = addActivityDto.detail;
        toDoList.activities.push(activity);
        return activityId;
    }

    public getActivities(getActivitiesParamDto: GetActivitiesParamDto): Activity[] {
        const toDoList = this.toDoList.find((item) => item.id === getActivitiesParamDto.toDoListId);
        if (!toDoList) {
            throw new HttpException('the resource is not available.', HttpStatus.NOT_FOUND);
        }
        return toDoList.activities;
    }

    public getActivity(getActivityParamDto: GetActivityParamDto): Activity {
        const toDoList = this.toDoList.find((item) => item.id === getActivityParamDto.toDoListId);
        if (!toDoList) {
            throw new HttpException('the resource is not available.', HttpStatus.NOT_FOUND);
        }

        const activity = toDoList.activities.find((activity) => activity.id === getActivityParamDto.activityId);
        if (!activity) {
            throw new HttpException('the resource is not available.', HttpStatus.NOT_FOUND);
        }

        return activity;
    }

    public updateToDoList(updateToDoListParamDto: UpdateToDoListParamDto, updateToDoListDto: UpdateToDoListDto): void {
        const toDoList = this.toDoList.find((item) => item.id === updateToDoListParamDto.toDoListId);
        if (!toDoList) {
            throw new HttpException('the resource is not available.', HttpStatus.NOT_FOUND);
        }
        toDoList.name = updateToDoListDto.name;
    }

    public updateActivity(updateActivityParamDto: UpdateActivityParamDto, updateActivityDto: UpdateActivityDto): void {
        const toDoList = this.toDoList.find((item) => item.id === updateActivityParamDto.toDoListId);
        if (!toDoList) {
            throw new HttpException('the resource is not available.', HttpStatus.NOT_FOUND);
        }

        const activity = toDoList.activities.find((activity) => activity.id === updateActivityParamDto.activityId);
        if (!activity) {
            throw new HttpException('the resource is not available.', HttpStatus.NOT_FOUND);
        }
        activity.isActive = updateActivityDto.isActive;
        activity.detail = updateActivityDto.detail;
    }

    public deleteToDoList(deleteToDoListParamDto: DeleteToDoListParamDto): void {
        const toDoList = this.toDoList.find((item) => item.id === deleteToDoListParamDto.toDoListId);
        if (!toDoList) {
            throw new HttpException('the resource is not available.', HttpStatus.NOT_FOUND);
        }
        this.toDoList = this.toDoList.filter((item) => item.id !== deleteToDoListParamDto.toDoListId)
    }

    public deleteActivity(deleteActivityParamDto: DeleteActivityParamDto): void {
        const toDoList = this.toDoList.find((item) => item.id === deleteActivityParamDto.toDoListId);
        if (!toDoList) {
            throw new HttpException('the resource is not available.', HttpStatus.NOT_FOUND);
        }

        const activity = toDoList.activities.find((activity) => activity.id === deleteActivityParamDto.activityId);
        if (!activity) {
            throw new HttpException('the resource is not available.', HttpStatus.NOT_FOUND);
        }

        toDoList.activities = toDoList.activities.filter((activity) => activity.id !== deleteActivityParamDto.activityId);
    }
}