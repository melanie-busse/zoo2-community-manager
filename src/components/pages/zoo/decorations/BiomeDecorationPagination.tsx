"use client";

import Pagination from "@/components/elements/Pagination/Pagination";
import { useDecorationStore } from "@/store/useDecorationStore";

export default function BiomeDecorationPagination() {
  const currentPage = useDecorationStore((state) => state.currentPage);
  const filteredCount = useDecorationStore((state) => state.filteredCount);
  const itemsPerPage = useDecorationStore((state) => state.itemsPerPage);
  const nextPage = useDecorationStore((state) => state.nextPage);
  const prevPage = useDecorationStore((state) => state.prevPage);

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
