import { Injectable } from "@nestjs/common";
import PrismaService from "src/prisma/prisma.service";
import { CreateProjectDTO } from "./projectDTO/CreateProjectDTO";

@Injectable()
export class ProjectService {
  constructor(private prismaService: PrismaService) {}

  private buildTaskTree(taskDTO: any) {
    return {
      name: taskDTO.name,
      description: taskDTO.description,
      children:
        taskDTO.children && taskDTO.children.length > 0
          ? {
              create: taskDTO.children.map((child: any) => this.buildTaskTree(child)),
            }
          : undefined,
    };
  }

  async createProjectByAI(projectDTO: CreateProjectDTO) {
    const tasksToCreate = projectDTO.Tasks || [];

    return this.prismaService.project.create({
      data: {
        title: projectDTO.title,
        category: projectDTO.category,
        estimatedEndDate: new Date(projectDTO.estimatedEndDate),
        Tasks: { create: tasksToCreate.map((task) => this.buildTaskTree(task)) },
      },
      include: {
        Tasks: {
          include: {
            children: true,
          },
        },
      },
    });
  }

  async createProject(projectDTO: CreateProjectDTO) {
    return await this.prismaService.project.create({
      data: {
        category: projectDTO.category,
        title: projectDTO.title,
        estimatedEndDate: new Date(projectDTO.estimatedEndDate),
      },
    });
  }
  async getProjects() {
    return await this.prismaService.project.findMany();
  }

  async getProject(id: number) {
    return this.prismaService.project.findUnique({
      where: { id: id },
    });
  }

  async getProjectByName(name: string) {
    return await this.prismaService.project.findMany({
      where: { title: name },
    });
  }
  async getProjectById(id: number) {
    return this.prismaService.project.findUnique({
      where: { id: id },
      include: {
        Tasks: {
          where: { parentId: null },
          orderBy: { id: "asc" },
          include: {
            children: {
              orderBy: { id: "asc" },
              include: { children: true },
            },
          },
        },
      },
    });
  }

  async updateProject(id: number, projectDTO: CreateProjectDTO) {
    return this.prismaService.project.update({
      where: { id: id },
      data: {
        category: projectDTO.category,
        title: projectDTO.title,
        estimatedEndDate: new Date(projectDTO.estimatedEndDate),
      },
    });
  }

  async deleteProject(id: number) {
    return await this.prismaService.project.delete({
      where: { id: id },
    });
  }
}
