"use client";

import Pagination from "@/components/elements/Pagination/Pagination";
import { useBiomeStore } from "@/store/useBiomeStore";

export default function BiomePagination() {
  const currentPage = useBiomeStore((state) => state.currentPage);
  const filteredCount = useBiomeStore((state) => state.filteredCount);
  const itemsPerPage = useBiomeStore((state) => state.itemsPerPage);
  const nextPage = useBiomeStore((state) => state.nextPage);
  const prevPage = useBiomeStore((state) => state.prevPage);

  return (
    <Pagination
      currentPage={currentPage}
      filteredCount={filteredCount}
      itemsPerPage={itemsPerPage}
      onNext={() => nextPage()}
      onPrev={() => prevPage()}
    />
  );
}
