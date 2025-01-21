"use client";
import EditProfile from "@/app/admin/profile/components/edit-profile";
import SideMenu from "@/app/components/screens/side-menu";
import { Button } from "@/app/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { Establishment } from "@prisma/client";
import { ChevronLeftIcon, MapPinIcon, MenuIcon, Pencil } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface EstablishmentInfoProps {
  establishment: Establishment;
  admin: boolean;
}

const EstablishmentHeader: React.FC<EstablishmentInfoProps> = ({
  establishment,
  admin,
}) => {
  const router = useRouter();
  return (
    <div>
      <div className="h-[250px] w-full relative">
        <Button
          onClick={() =>
            router.replace(admin ? `/admin/${establishment.id}` : "/")
          }
          size="icon"
          variant="outline"
          className="absolute z-50 top-4 left-4"
        >
          <ChevronLeftIcon />
        </Button>

        {!admin && (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="absolute z-50 top-4 right-4"
              >
                <MenuIcon />
              </Button>
            </SheetTrigger>

            <SheetContent className="p-0">
              <SideMenu />
            </SheetContent>
          </Sheet>
        )}

        {admin && (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="absolute z-50 top-4 right-4"
              >
                <Pencil size={20} />
              </Button>
            </SheetTrigger>

            <EditProfile establishment={establishment} />
          </Sheet>
        )}

        <Image
          src={establishment?.imageUrl || ""}
          fill
          alt={establishment?.name || ""}
          className="object-cover lg:object-fill opacity-75"
        />
      </div>

      <div className="max-w-[1280px] m-auto px-5 pt-3 pb-6 border-b border-secondary">
        <h1 className="text-xl font-bold">{establishment?.name}</h1>
        <div className="flex items-center gap-2 mt-2">
          <MapPinIcon className="text-primary" size={18} />
          <p className="text-sm">{establishment?.address}</p>
        </div>
      </div>
    </div>
  );
};

export default EstablishmentHeader;
