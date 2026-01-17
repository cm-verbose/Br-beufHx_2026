import { IsOptional, IsString, IsEnum, IsInt, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { TaskState } from "@repo/db";

export class CreateTaskDTO {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsEnum(TaskState)
  state?: TaskState;

  @IsOptional()
  @IsInt()
  projectId!: number;

  @IsOptional()
  @IsInt()
  parentId?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskDTO) //
  children?: CreateTaskDTO[];
}
