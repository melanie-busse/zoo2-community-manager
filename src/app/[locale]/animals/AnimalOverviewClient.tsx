"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { Animal } from "@/types/animal";
import { useSort } from "@/hooks/useSort";
import AnimalOverviewContent from "@/components/pages/AnimalOverview/AnimalOverviewContent";
import { filterAnimals, sortAnimals, paginate } from "@/utils/AnimalUtil";

interface AnimalOverviewClientProps {
  initialAnimals: Animal[];
}

export default function AnimalOverviewClient({ initialAnimals }: AnimalOverviewClientProps) {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Wir nutzen direkt die initialAnimals. Keine API-Route, kein SWR-Stress.
  const currentAnimals = initialAnimals || [];

  const searchTerm = searchParams.get("search") || "";
  const selectedGehege = searchParams.get("biome") || "all";
  const selectedLevel = searchParams.get("level") || "all";
  const currentPage = Number(searchParams.get("page")) || 1;

  const { sortBy, sortDirection, toggleSort } = useSort("name");

  // Filterung und Sortierung
  const filteredTiere = filterAnimals(currentAnimals, {
    searchTerm,
    selectedGehege,
    selectedLevel,
  });

  const sortedTiere = sortAnimals(filteredTiere, { sortBy, sortDirection });
  const itemsPerPage = 12;
  const currentItems = paginate(sortedTiere, currentPage, itemsPerPage);
  const totalPages = Math.ceil(filteredTiere.length / itemsPerPage);

  // Hilfsfunktionen
  const handleEdit = (id: number) => router.push(`/animals/${id}/edit`);
  const handleAnimalClick = (id: number) => router.push(`/animals/${id}`);

  const handleResetFilters = () => {
    router.push(window.location.pathname);
  };

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: t("Animals.messages.deleteErrorTitle"),
      text: t("Animals.messages.confirmDelete"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: t("Common.messages.yes_delete"),
    });

    if (result.isConfirmed) {
      const response = await fetch(`/api/animals/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success(t("Animals.messages.deleteSuccess"));
        // Statt SWR-Mutate laden wir die Seite einfach neu, um die frischen DB-Daten zu holen
        router.refresh();
      }
    }
  };

  return (
    <AnimalOverviewContent
      animals={currentAnimals}
      currentItems={currentItems}
      filteredCount={filteredTiere.length}
      sortBy={sortBy}
      sortDirection={sortDirection}
      toggleSort={toggleSort}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      handleAnimalClick={handleAnimalClick}
      handleResetFilters={handleResetFilters}
      currentPage={currentPage}
      totalPages={totalPages}
      handleNextPage={() => updatePage(currentPage + 1)}
      handlePrevPage={() => updatePage(currentPage - 1)}
    />
  );
}
