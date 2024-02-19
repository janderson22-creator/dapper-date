"use client";

import { UsersRound } from "lucide-react";
import Link from "next/link";
import { SheetHeader, SheetTitle } from "@/app/components/ui/sheet";
import { Button } from "@/app/components/ui/button";

interface SideMenuProps {
  paramsId: string | undefined;
}

const SideMenuAdmin: React.FC<SideMenuProps> = ({ paramsId }) => {
  return (
    <>
      <SheetHeader className="text-left border-b border-solid border-secondary p-5">
        <SheetTitle>Menu</SheetTitle>
      </SheetHeader>

      <div className="flex flex-col gap-3 px-5 mt-5">
        <Button variant="outline" className="justify-start" asChild>
          <Link href={`employees/${paramsId}`}>
            <UsersRound size={18} className="mr-2" />
            Profissinais
          </Link>
        </Button>
      </div>
    </>
  );
};

export default SideMenuAdmin;
