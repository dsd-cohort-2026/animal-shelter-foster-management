/*
  Warnings:

  - The `foster_user_id` column on the `InventoryTransaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `foster_user_id` column on the `MedicalLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `foster_user_id` on the `AnimalAssignment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `assigned_by_staff_id` on the `AnimalAssignment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `staff_user_id` on the `AnimalModification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `created_by_staff_user_id` on the `InventoryTransaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "AnimalAssignment" DROP CONSTRAINT "AnimalAssignment_assigned_by_staff_id_fkey";

-- DropForeignKey
ALTER TABLE "AnimalAssignment" DROP CONSTRAINT "AnimalAssignment_foster_user_id_fkey";

-- DropForeignKey
ALTER TABLE "AnimalModification" DROP CONSTRAINT "AnimalModification_staff_user_id_fkey";

-- DropForeignKey
ALTER TABLE "InventoryTransaction" DROP CONSTRAINT "InventoryTransaction_created_by_staff_user_id_fkey";

-- DropForeignKey
ALTER TABLE "InventoryTransaction" DROP CONSTRAINT "InventoryTransaction_foster_user_id_fkey";

-- DropForeignKey
ALTER TABLE "MedicalLog" DROP CONSTRAINT "MedicalLog_foster_user_id_fkey";

-- AlterTable
ALTER TABLE "AnimalAssignment" DROP COLUMN "foster_user_id",
ADD COLUMN     "foster_user_id" UUID NOT NULL,
DROP COLUMN "assigned_by_staff_id",
ADD COLUMN     "assigned_by_staff_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "AnimalModification" DROP COLUMN "staff_user_id",
ADD COLUMN     "staff_user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "InventoryTransaction" DROP COLUMN "foster_user_id",
ADD COLUMN     "foster_user_id" UUID,
DROP COLUMN "created_by_staff_user_id",
ADD COLUMN     "created_by_staff_user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "MedicalLog" DROP COLUMN "foster_user_id",
ADD COLUMN     "foster_user_id" UUID;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "AnimalAssignment" ADD CONSTRAINT "AnimalAssignment_foster_user_id_fkey" FOREIGN KEY ("foster_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimalAssignment" ADD CONSTRAINT "AnimalAssignment_assigned_by_staff_id_fkey" FOREIGN KEY ("assigned_by_staff_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimalModification" ADD CONSTRAINT "AnimalModification_staff_user_id_fkey" FOREIGN KEY ("staff_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_foster_user_id_fkey" FOREIGN KEY ("foster_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_created_by_staff_user_id_fkey" FOREIGN KEY ("created_by_staff_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalLog" ADD CONSTRAINT "MedicalLog_foster_user_id_fkey" FOREIGN KEY ("foster_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
