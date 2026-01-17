import { CategoryProject } from "@repo/db";
import { Type } from "class-transformer";
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsArray,
  ValidateNested,
} from "class-validator";
import { CreateTaskDTO } from "src/task/taskDTO/CreateTaskDTO";

export class CreateProjectDTO {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(CategoryProject)
  category!: CategoryProject;

  @IsDateString()
  estimatedEndDate!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskDTO)
  Tasks?: CreateTaskDTO[];
}
