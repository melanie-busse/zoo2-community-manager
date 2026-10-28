import React from "react";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";

interface WikiAccordeonProps {
  title: string;
  image: string;
  children: React.ReactNode;
}
export default function WikiAccordeon({ title, image, children }: WikiAccordeonProps) {
  return (
    <InfoAccordion title={title} icon={image} iconSize={50}>
      {children}
    </InfoAccordion>
  );
}
