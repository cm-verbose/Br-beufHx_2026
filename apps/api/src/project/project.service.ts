import { Injectable } from "@nestjs/common";
import PrismaService from "src/prisma/prisma.service";
import { CreateProjectDTO } from "./projectDTO/CreateProjectDTO";

@Injectable()
export class ProjectService {
  constructor(private prismaService: PrismaService) {}

  async createProject(projectDTO: CreateProjectDTO) {
    return this.prismaService.project.create({
      data: {
        category: projectDTO.category,
        title: projectDTO.title,
        estimatedEndDate: new Date(projectDTO.estimatedEndDate),
      },
    });
  }
  async getProjects() {
    return this.prismaService.project.findMany();
  }

  async getProjectByName(name: string) {
    return this.prismaService.project.findMany({
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

  async createProjectFromAI(aiData: any) {
    // 1. Recursive helper to format children for Prisma
    const mapTasksRecursive = (tasks: any[]) => {
      if (!tasks || tasks.length === 0) return undefined;

      return {
        create: tasks.map((task) => ({
          name: task.name,
          description: task.description,
          state: "NOT_STARTED", // Default state for RPG logic
          // RECURSION: If this task has children, format them too!
          children: task.children ? mapTasksRecursive(task.children) : undefined,
        })),
      };
    };

    // 2. Save everything in ONE database transaction
    return await this.prismaService.project.create({
      data: {
        title: aiData.title,
        category: aiData.category,
        // Ensure date is a valid Date object
        estimatedEndDate: new Date(aiData.estimatedEndDate),
        Tasks: mapTasksRecursive(aiData.Tasks),
      },
      include: {
        Tasks: {
          include: {
            children: {
              include: { children: true },
            },
          },
        },
      },
    });
  }

  async deleteProject(id: number) {
    return this.prismaService.project.delete({
      where: { id: id },
    });
  }
}
