import { Injectable } from "@nestjs/common";
import PrismaService from "src/prisma/prisma.service";
import { CreateTaskDTO } from "./taskDTO/CreateTaskDTO";

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

  async getTaskByName(name: string) {
    return this.prismaService.task.findMany({
      where: { name: name },
    });
  }

  async deleteTask(id: number) {
    return this.prismaService.task.delete({
      where: { id: id },
    });
  }
}
