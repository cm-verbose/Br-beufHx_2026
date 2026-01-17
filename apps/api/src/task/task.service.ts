import { Injectable } from "@nestjs/common";
import PrismaService from "src/prisma/prisma.service";
import { CreateTaskDTO } from "./taskDTO/CreateTaskDTO";
import { TaskState } from "@repo/db";

@Injectable()
export class TaskService {
  constructor(private prismaService: PrismaService) {}

  async createTask(taskDTO: CreateTaskDTO) {
    return this.prismaService.task.create({
      data: {
        name: taskDTO.name,
        description: taskDTO.description,
        projectId: taskDTO.projectId,
        parentId: taskDTO.parentId,
        state: taskDTO.state,
      },
    });
  }
  async getTasks() {
    return this.prismaService.task.findMany();
  }
  async updateTaskStatus(taskId: number, state: TaskState) {
    return this.prismaService.task.update({
      where: {
        id: taskId,
      },
      data: {
        state: state,
      },
    });
  }

  async getTaskById(id: number) {
    return this.prismaService.task.findUnique({
      where: { id: id },
    });
  }

  async updateTask(id: number, updateDTO: CreateTaskDTO) {
    return this.prismaService.task.update({
      where: { id: id },
      data: {
        name: updateDTO.name,
        description: updateDTO.description,
        projectId: updateDTO.projectId,
        parentId: updateDTO.parentId,
        state: updateDTO.state,
      },
    });
  }

  async deleteTask(id: number) {
    return this.prismaService.task.delete({
      where: { id: id },
    });
  }
}
