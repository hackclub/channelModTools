/*
  Warnings:

  - The `time_banned` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "time_banned",
ADD COLUMN     "time_banned" TIMESTAMP(3);
