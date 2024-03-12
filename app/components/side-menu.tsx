"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import {
  Sheet,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  CalendarIcon,
  GanttChartSquare,
  HomeIcon,
  Loader2,
  LogInIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import LoginForm from "./login-admin";
import { Admin } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
} from "./ui/alert-dialog";

const SideMenu = () => {
  const router = useRouter();
  const { data } = useSession();
  const [admin, setAdmin] = useState<Admin>();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const logoutClick = () => signOut();

  const loginClick = () => signIn("google");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const adminJson = localStorage.getItem("admin");

      if (!adminJson) return;

      const admin: Admin = JSON.parse(adminJson);

      setAdmin(admin);
    }
  }, []);

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

      {data?.user ? (
        <div className="flex justify-between px-5 py-6 items-center">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={data.user?.image ?? ""} />
            </Avatar>

            <h2 className="font-bold">{data.user.name}</h2>
          </div>

          <AlertDialog>
            <AlertDialogTrigger className="cursor-pointer" asChild>
              <LogOutIcon size={20} />
            </AlertDialogTrigger>

            <AlertDialogContent className="w-[90%] rounded-lg">
              <AlertDialogHeader className="flex items-center">
                <AlertDialogTitle>Sair da conta</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja sair da conta?
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter className="flex-row gap-3">
                <AlertDialogCancel className="w-full mt-0">
                  Voltar
                </AlertDialogCancel>

                <AlertDialogAction className="w-full" onClick={logoutClick}>
                  {isDeleteLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : (
        !admin && (
          <div className="flex flex-col px-5 pt-6 gap-3">
            <div className="flex items-center gap-2">
              <h2 className="font-bold">Olá, faça seu login!</h2>
            </div>
            <Button
              variant="secondary"
              className="w-full justify-start mt-2"
              onClick={loginClick}
            >
              <UserIcon className="mr-2" size={18} />
              Fazer Login
            </Button>
          </div>
        )
      )}

      <div className="flex flex-col gap-3 px-5 mt-6">
        <Button variant="outline" className="justify-start" asChild>
          <Link href="/">
            <HomeIcon size={18} className="mr-2" />
            Início
          </Link>
        </Button>

        {data?.user && (
          <Button variant="outline" className="justify-start" asChild>
            <Link href="/bookings">
              <CalendarIcon size={18} className="mr-2" />
              Agendamentos
            </Link>
          </Button>
        )}

        {!data?.user &&
          (admin ? (
            <Button
              onClick={() => router.push(`/admin/${admin.establishmentId}`)}
              variant="outline"
              className="justify-start"
            >
              <GanttChartSquare size={18} className="mr-2" />
              Adiministrador
            </Button>
          ) : (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <GanttChartSquare size={18} className="mr-2" />
                  Adiministrador
                </Button>
              </SheetTrigger>

              <LoginForm />
            </Sheet>
          ))}

        {admin && (
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
        )}
      </div>
    </>
  );
};

export default SideMenu;
