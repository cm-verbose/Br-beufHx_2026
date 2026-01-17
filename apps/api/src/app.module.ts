import { Module } from "@nestjs/common";
import { ProjectModule } from "./project/project.module";
import { PrismaModule } from "./prisma/prisma.module";
import { TaskModule } from "./task/task.module";

@Module({
  imports: [ProjectModule, PrismaModule, TaskModule],
  controllers: [],
  providers: [AiService],
})
export class AppModule {}
