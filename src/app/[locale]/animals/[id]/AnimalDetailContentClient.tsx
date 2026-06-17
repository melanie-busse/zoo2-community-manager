"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import { Animal } from "@/types/animal";
import AnimalDetailContent from "@/components/pages/animals/AnimalDetails/AnimalDetailContent";

interface AnimalDetailContentClientProps {
  animal: Animal;
  locale: string;
}

export default function AnimalDetailContentClient({
  animal,
  locale,
}: AnimalDetailContentClientProps) {
  const router = useRouter();
  const tAnimals = useTranslations("animals");
  const tCommon = useTranslations("common");

  // --- DELETE HANDLER ---
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: tAnimals("messages.deleteErrorTitle") || "Delete Animal?",
      text:
        tAnimals("messages.confirmDelete") ||
        "Are you sure you want to remove this animal from the list?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: tCommon("messages.yes_delete") || "Yes, delete!",
      cancelButtonText: tCommon("messages.cancel") || "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/animals/${animal.id}`, { method: "DELETE" });

        if (res.ok) {
          toast.success(tAnimals("messages.deleteSuccess") || "Animal successfully deleted! 🐾");
          router.push(`/${locale}/animals`); // Zurück zur Liste mit passender Locale
          router.refresh(); // Aktualisiert die Server-Komponenten-Daten im Hintergrund
        } else {
          toast.error(tAnimals("messages.deleteError") || "Error deleting the animal 🐾");
        }
      } catch (error) {
        toast.error("Failed to connect to the server.");
      }
    }
  };

  // --- EDIT HANDLER ---
  const handleEdit = () => {
    router.push(`/${locale}/animals/${animal.id}/edit`);
  };

  return <AnimalDetailContent animal={animal} onDelete={handleDelete} onEdit={handleEdit} />;
}
