import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export default function Section({ children, className, id }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative px-6 py-24 md:py-32 mx-auto max-w-7xl w-full",
        className
      )}
    >
      {children}
    </section>
  );
}
