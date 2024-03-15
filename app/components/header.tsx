"use client"

import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import SideMenu from "./side-menu";
import Link from "next/link";
import { useEffect } from "react";
import { Admin } from "@prisma/client";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const adminJson = localStorage.getItem("admin");

      if (!adminJson) return;

      const admin: Admin = JSON.parse(adminJson);
      if (admin) {
        router.push(`/admin/${admin.establishmentId}`);
        return;
      }
    }
  }, [router]);

  return (
    <Card className="rounded-none lg:hidden">
      <CardContent className="p-5 flex items-center justify-between">
        <Link href={"/"} >
        <Image src="/logo.png" alt="dapper date" height={22} width={120} />
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <MenuIcon size={16} />
            </Button>
          </SheetTrigger>

          <SheetContent className="p-0">
            <SideMenu />
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
};

export default Header;
