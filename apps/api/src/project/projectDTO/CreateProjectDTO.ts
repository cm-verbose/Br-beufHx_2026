import { CategoryProject } from "@repo/db";
import { IsString, IsEnum, IsDateString } from "class-validator";

export class CreateProjectDTO {
  @IsString()
  title!: string;

  @IsEnum(CategoryProject)
  category!: CategoryProject;

  @IsDateString()
  estimatedEndDate!: string;
}
