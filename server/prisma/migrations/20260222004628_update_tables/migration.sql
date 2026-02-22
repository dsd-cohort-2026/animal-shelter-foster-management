/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- CreateEnum
CREATE TYPE "Assignment_Status" AS ENUM ('ACTIVE', 'COMPLETE');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "Species" AS ENUM ('CAT', 'DOG');

-- CreateEnum
CREATE TYPE "Animal_Status" AS ENUM ('SHELTERED', 'FOSTERED', 'ADOPTED');

-- CreateEnum
CREATE TYPE "Size" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "Crate_Status" AS ENUM ('LOANED', 'AVAILABLE', 'DAMAGED');

-- CreateEnum
CREATE TYPE "Life_Stage" AS ENUM ('ADOLESCENT', 'ADULT', 'SENIOR');

-- CreateEnum
CREATE TYPE "Transaction_Status" AS ENUM ('COMPLETE', 'ACTIVE');

-- CreateEnum
CREATE TYPE "Transaction_Type" AS ENUM ('DISTRIBUTION', 'LOAN', 'INTAKE');

-- CreateEnum
CREATE TYPE "Item_Category" AS ENUM ('MEDICINE', 'FOOD', 'CRATE');

-- CreateEnum
CREATE TYPE "Log_Type" AS ENUM ('MEDICAL', 'BEHAVIORAL', 'VETERINARY');

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateTable
CREATE TABLE "AnimalAssignment" (
    "id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "status" "Assignment_Status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "animal_id" TEXT NOT NULL,
    "foster_user_id" TEXT NOT NULL,
    "assigned_by_staff_id" TEXT NOT NULL,

    CONSTRAINT "AnimalAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnimalModification" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "animal_id" TEXT NOT NULL,
    "staff_user_id" TEXT NOT NULL,

    CONSTRAINT "AnimalModification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Animal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "chip_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dob" TIMESTAMP(3) NOT NULL,
    "sex" "Sex" NOT NULL,
    "species" "Species" NOT NULL,
    "foster_status" "Animal_Status" NOT NULL,
    "kennel_id" INTEGER NOT NULL,
    "altered" BOOLEAN NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "last_modified" TIMESTAMP(3) NOT NULL,
    "picture" TEXT NOT NULL,

    CONSTRAINT "Animal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Crate" (
    "id" TEXT NOT NULL,
    "size" "Size" NOT NULL,
    "status" "Crate_Status" NOT NULL,
    "item_id" TEXT NOT NULL,

    CONSTRAINT "Crate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Food" (
    "id" TEXT NOT NULL,
    "life_stage" "Life_Stage" NOT NULL,
    "item_id" TEXT NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryTransaction" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantity" INTEGER NOT NULL,
    "status" "Transaction_Status" NOT NULL,
    "type" "Transaction_Type" NOT NULL,
    "notes" TEXT NOT NULL,
    "foster_user_id" TEXT,
    "created_by_staff_user_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "inventory_id" TEXT NOT NULL,

    CONSTRAINT "InventoryTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "expiration_date" TIMESTAMP(3),
    "item_id" TEXT NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "category" "Item_Category" NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "species" "Species" NOT NULL,
    "unit" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalLog" (
    "id" TEXT NOT NULL,
    "logged_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" "Log_Type" NOT NULL,
    "general_notes" TEXT,
    "behavior_notes" TEXT,
    "qty_administered" DOUBLE PRECISION,
    "dose" TEXT,
    "administered_at" TIMESTAMP(3),
    "prescription" TEXT,
    "documents" TEXT,
    "foster_user_id" TEXT,
    "animal_id" TEXT NOT NULL,
    "assignment_id" TEXT,
    "medication_id" TEXT,

    CONSTRAINT "MedicalLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medication" (
    "id" TEXT NOT NULL,
    "recommended_dose" TEXT NOT NULL,
    "side_effects" TEXT NOT NULL,
    "administration_route" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Animal_chip_id_key" ON "Animal"("chip_id");

-- CreateIndex
CREATE UNIQUE INDEX "Crate_item_id_key" ON "Crate"("item_id");

-- CreateIndex
CREATE UNIQUE INDEX "Food_item_id_key" ON "Food"("item_id");

-- CreateIndex
CREATE UNIQUE INDEX "Medication_item_id_key" ON "Medication"("item_id");

-- AddForeignKey
ALTER TABLE "AnimalAssignment" ADD CONSTRAINT "AnimalAssignment_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "Animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimalAssignment" ADD CONSTRAINT "AnimalAssignment_foster_user_id_fkey" FOREIGN KEY ("foster_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimalAssignment" ADD CONSTRAINT "AnimalAssignment_assigned_by_staff_id_fkey" FOREIGN KEY ("assigned_by_staff_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimalModification" ADD CONSTRAINT "AnimalModification_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "Animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimalModification" ADD CONSTRAINT "AnimalModification_staff_user_id_fkey" FOREIGN KEY ("staff_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crate" ADD CONSTRAINT "Crate_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_foster_user_id_fkey" FOREIGN KEY ("foster_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_created_by_staff_user_id_fkey" FOREIGN KEY ("created_by_staff_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalLog" ADD CONSTRAINT "MedicalLog_foster_user_id_fkey" FOREIGN KEY ("foster_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalLog" ADD CONSTRAINT "MedicalLog_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "Animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalLog" ADD CONSTRAINT "MedicalLog_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "AnimalAssignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalLog" ADD CONSTRAINT "MedicalLog_medication_id_fkey" FOREIGN KEY ("medication_id") REFERENCES "Medication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
