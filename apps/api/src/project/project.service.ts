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
  async deleteProject(id: number) {
    return this.prismaService.project.delete({
      where: { id: id },
    });
  }
}
