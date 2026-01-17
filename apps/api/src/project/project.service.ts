import { Injectable } from "@nestjs/common";
import PrismaService from "src/prisma/prisma.service";
import { CreateProjectDTO } from "./projectDTO/CreateProjectDTO";

@Injectable()
export class ProjectService {
  constructor(private prismaService: PrismaService) {}

  async createProjectByAI(projectDto: CreateProjectDTO) {
    const savedProject = await this.prismaService.project.create({
      data: {
        title: projectDto.title,
        description: projectDto.description,
        category: projectDto.category,
        estimatedEndDate: new Date(projectDto.estimatedEndDate),
      },
    });

    if (projectDto.Tasks && projectDto.Tasks.length > 0) {
      await this.saveTasksRecursively(projectDto.Tasks, savedProject.id, null);
    }

    return await this.getProjectById(savedProject.id);
  }

  private async saveTasksRecursively(tasks: any[], projectId: number, parentId: number | null) {
    for (const task of tasks) {
      const savedTask = await this.prismaService.task.create({
        data: {
          name: task.name,
          description: task.description,
          state: "NOT_STARTED",
          projectId: projectId,
          parentId: parentId,
        },
      });

      if (task.children && task.children.length > 0) {
        await this.saveTasksRecursively(task.children, projectId, savedTask.id);
      }
    }
  }

  async getProjectById(id: number) {
    const project = await this.prismaService.project.findUnique({
      where: { id: id },
      include: {
        Tasks: {
          orderBy: { id: "asc" },
        },
      },
    });

    if (!project) return null;

    const taskTree = this.reconstructTaskTree(project.Tasks);

    return { ...project, Tasks: taskTree };
  }

  private reconstructTaskTree(tasks: any[]) {
    const taskMap = new Map();
    const roots: any[] = [];

    tasks.forEach((task) => {
      taskMap.set(task.id, { ...task, children: [] });
    });

    tasks.forEach((task) => {
      const node = taskMap.get(task.id);
      if (task.parentId) {
        const parent = taskMap.get(task.parentId);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  }

  async createProject(projectDTO: CreateProjectDTO) {
    return await this.prismaService.project.create({
      data: {
        category: projectDTO.category,
        title: projectDTO.title,
        description: projectDTO.description,
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

  async updateProject(id: number, projectDTO: CreateProjectDTO) {
    return this.prismaService.project.update({
      where: { id: id },
      data: {
        category: projectDTO.category,
        title: projectDTO.title,
        description: projectDTO.description,
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
