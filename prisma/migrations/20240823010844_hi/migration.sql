/*
  Warnings:

  - You are about to drop the column `files` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "files",
ADD COLUMN     "time_banned" TEXT,
ADD COLUMN     "time_nlp" TEXT;
