import Image from "next/image";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import SideMenuAdmin from "./side-menu-admin";

interface HeaderAdminProps {
  paramsId: string | undefined;
}

const HeaderAdmin: React.FC<HeaderAdminProps> = ({ paramsId }) => {
  return (
    <Card className="rounded-none">
      <CardContent className="p-5 flex items-center justify-between">
        <Link href={"/"}>
          <Image src="/logo.png" alt="dapper date" height={22} width={120} />
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <MenuIcon size={16} />
            </Button>
          </SheetTrigger>

          <SheetContent className="p-0">
            <SideMenuAdmin paramsId={paramsId} />
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
};

export default HeaderAdmin;
