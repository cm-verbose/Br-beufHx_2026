import { Module } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { AiService } from "src/ai/ai.service";

@Module({
  providers: [ProjectService, AiService],
  controllers: [ProjectController],
})
export class ProjectModule {}
