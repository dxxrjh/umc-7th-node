import mysql from "mysql2/promise";
import dotenv from "dotenv";

import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

dotenv.config();

