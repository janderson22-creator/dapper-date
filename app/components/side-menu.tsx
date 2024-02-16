"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Sheet, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  CalendarIcon,
  GanttChartSquare,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import LoginForm from "./login-admin";
import { Admin } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SideMenu = () => {
  const router = useRouter();
  const { data } = useSession();
  const [admin, setAdmin] = useState<Admin>();

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

          <Button variant="secondary" size="icon">
            <LogOutIcon onClick={logoutClick} />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col px-5 pt-6 gap-3">
          <div className="flex items-center gap-2">
            <UserIcon size={25} />
            <h2 className="font-bold">Olá, faça seu login!</h2>
          </div>
          <Button
            variant="secondary"
            className="w-full justify-start mb-8 mt-2"
            onClick={loginClick}
          >
            <LogInIcon className="mr-2" size={18} />
            Fazer Login
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-3 px-5">
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
      </div>
    </>
  );
};

export default SideMenu;
