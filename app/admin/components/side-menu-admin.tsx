"use client";

import { Loader2, LogOutIcon, UsersRound } from "lucide-react";
import Link from "next/link";
import { SheetClose, SheetHeader, SheetTitle } from "@/app/components/ui/sheet";
import { Button } from "@/app/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import { useState } from "react";

interface SideMenuProps {
  paramsId: string | undefined;
}

const SideMenuAdmin: React.FC<SideMenuProps> = ({ paramsId }) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const logout = async () => {
    setIsDeleteLoading(true);
    try {
      localStorage.removeItem("admin");
      window.location.href = "/";
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleteLoading(true);
    }
  };

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

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="justify-start">
              <LogOutIcon size={18} className="mr-2" />
              Sair da conta admin
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="w-[90%] rounded-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>Sair da conta admin</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja sair da conta?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-row gap-3">
              <AlertDialogCancel className="w-full mt-0">
                Voltar
              </AlertDialogCancel>

              <SheetClose asChild>
                <AlertDialogAction className="w-full" onClick={logout}>
                  {isDeleteLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Confirmar
                </AlertDialogAction>
              </SheetClose>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default SideMenuAdmin;
