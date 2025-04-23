-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('user', 'admin');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "RoleEnum" NOT NULL DEFAULT 'user';
