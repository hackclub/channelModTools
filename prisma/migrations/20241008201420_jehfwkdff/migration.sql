/*
  Warnings:

  - The primary key for the `SlowUsers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user` on the `SlowUsers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SlowUsers" DROP CONSTRAINT "SlowUsers_pkey",
DROP COLUMN "user",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "SlowUsers_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SlowUsers_id_seq";
