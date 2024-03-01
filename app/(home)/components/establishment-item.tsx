import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Establishment } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface EstablishmentProps {
  establishment: Establishment;
}

const EstablishmentItem: React.FC<EstablishmentProps> = ({ establishment }) => {
  return (
    <Link href={`/e/${establishment.slug}`}>
      <Card className="max-h-[291px] rounded-2xl">
        <CardContent className="p-0">
          <div className="p-1 relative">
            <Image
              src={establishment.imageUrl}
              alt={establishment.name}
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-[159px] rounded-2xl object-cover"
            />
          </div>

          <div className="p-3 pt-0">
            <div className="flex flex-col items-center">
              <h2 className="font-bold mt-2 overflow-hidden text-ellipsis text-nowrap whitespace-nowrap max-w-full">
                {establishment.name}
              </h2>
              <p className="text-sm text-gray-400 overflow-hidden text-ellipsis text-nowrap whitespace-nowrap max-w-full">
                {establishment.address}
              </p>
            </div>
            <Button className="w-full mt-3" variant="secondary">
              Agendar
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default EstablishmentItem;
