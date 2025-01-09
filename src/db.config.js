import mysql from "mysql2/promise";
import dotenv from "dotenv";

import { PrismaClient } from "@prisma/client";

//Custom JSON serialization for BigInt
BigInt.prototype.toJSON = function () {
    return this.toString(); // 또는 Number(this)로 변환 가능
  };

export const prisma = new PrismaClient();

dotenv.config();

