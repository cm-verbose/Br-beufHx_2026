import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@repo/db";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";

/**
 * Database service for interacting with Postgres.
 */
@Injectable()
export default class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    dotenv.config({ quiet: true });
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  onModuleInit() {
    return this.$connect();
  }

  onModuleDestroy() {
    return this.$disconnect();
  }
}
