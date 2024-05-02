import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class AddActivityDto {
    @IsNotEmpty()
    @IsString()
    detail: string;
}

export class AddActivityParamDto {
    @Min(1)
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => {
        return parseInt(value, 10);
    })
    toDoListId: number;
}

export class GetActivitiesParamDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => {
        return parseInt(value, 10);
    })
    toDoListId: number;
}

export class GetActivityParamDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => {
        return parseInt(value, 10);
    })
    toDoListId: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => {
        return parseInt(value, 10);
    })
    activityId: number;
}

export class UpdateActivityDto {
    @IsBoolean()
    isActive: boolean = false;

    @IsString()
    detail: string = "";
}

export class UpdateActivityParamDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => {
        return parseInt(value, 10);
    })
    toDoListId: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => {
        return parseInt(value, 10);
    })
    activityId: number;
}

export class DeleteActivityParamDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => {
        return parseInt(value, 10);
    })
    toDoListId: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => {
        return parseInt(value, 10);
    })
    activityId: number;
}