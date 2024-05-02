import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateToDoListDto {
    @IsNotEmpty()
    @IsString()
    name: string;
}

export class GetToDoListParamDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => {
        return parseInt(value, 10);
    })
    toDoListId: number;
}

export class UpdateToDoListDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class UpdateToDoListParamDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => {
        return parseInt(value, 10);
    })
    toDoListId: number;
}

export class DeleteToDoListParamDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => {
        return parseInt(value, 10);
    })
    toDoListId: number;
}