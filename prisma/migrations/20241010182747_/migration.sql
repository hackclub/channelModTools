/*
  Warnings:

  - You are about to drop the column `bannned` on the `SlowUsers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[channel,user]` on the table `SlowUsers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "SlowUsers" DROP COLUMN "bannned",
ADD COLUMN     "banned" BOOLEAN DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "SlowUsers_channel_user_key" ON "SlowUsers"("channel", "user");
