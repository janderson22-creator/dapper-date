"use client";

import Image from "next/image";
import {
  CalendarIcon,
  GanttChartSquare,
  HomeIcon,
  Loader2,
  LogOutIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "./card";
import { Sheet, SheetTrigger } from "./sheet";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "./button";
import LoginForm from "../login-admin";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Admin } from "@prisma/client";
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
} from "./alert-dialog";

const HeaderWeb = () => {
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
    <Card className="hidden lg:flex rounded-none">
      <CardContent className="max-w-[1280px] m-auto p-5 pr-10 flex items-center justify-between">
        <Link href={"/"}>
          <Image src="/logo.png" alt="dapper date" height={22} width={120} />
        </Link>

        <div className="flex gap-3">
          <Button className="justify-start bg-transparent border-none" asChild>
            <Link href="/">
              <HomeIcon size={18} className="mr-2" />
              Início
            </Link>
          </Button>

          {data?.user && (
            <Button
              className="justify-start bg-transparent border-none"
              asChild
            >
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
                className="justify-start bg-transparent border-none"
              >
                <GanttChartSquare size={18} className="mr-2" />
                Adiministrador
              </Button>
            ) : (
              <Sheet>
                <SheetTrigger asChild>
                  <Button className="justify-start bg-transparent border-none">
                    <GanttChartSquare size={18} className="mr-2" />
                    Adiministrador
                  </Button>
                </SheetTrigger>

                <LoginForm />
              </Sheet>
            ))}

          {data?.user ? (
            <div className="flex items-center">
              <div className="flex items-center gap-4">
                <Avatar className="max-w-[30px] max-h-[30px]">
                  <AvatarImage
                    src={data.user?.image ?? ""}
                    className="rounded-full"
                  />
                </Avatar>

                <h2 className="font-bold">{data.user.name}</h2>
              </div>

              <AlertDialog>
                <AlertDialogTrigger className="cursor-pointer" asChild>
                  <LogOutIcon size={20} className="ml-4" />
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
              <div className="flex">
                <Button className="w-full justify-start" onClick={loginClick}>
                  <UserIcon className="mr-2" size={18} />
                  Fazer Login
                </Button>
              </div>
            )
          )}

          {admin && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <LogOutIcon size={18} className="mr-2" />
                  Sair da conta admin
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="w-[90%] rounded-lg">
                <AlertDialogHeader className="flex items-center">
                  <AlertDialogTitle>Sair da conta admin</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja sair da conta?
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex-row gap-3">
                  <AlertDialogCancel className="w-full mt-0">
                    Voltar
                  </AlertDialogCancel>

                  <AlertDialogAction className="w-full" onClick={logout}>
                    {isDeleteLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HeaderWeb;
