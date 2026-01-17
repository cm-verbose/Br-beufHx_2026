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

/*
model Task {
  id Int @id @default(autoincrement())
  name String
  description String
  state TaskState @default(NOT_STARTED)

  projectId Int
  project Project @relation(fields: [projectId],references: [id],onDelete: Cascade)
  //TODO: A TASK CAN HAS MULTIPLE FATHERS
  parentId Int?
  parent Task? @relation("TaskHistory",fields: [parentId],references: [id])

  children Task[] @relation("TaskHistory")
} */
