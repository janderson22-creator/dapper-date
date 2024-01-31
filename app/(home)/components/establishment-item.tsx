import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Establishment } from "@prisma/client";
import { StarIcon } from "lucide-react";
import Image from "next/image";

interface EstablishmentProps {
  establishment: Establishment;
}

const EstablishmentItem: React.FC<EstablishmentProps> = ({ establishment }) => {
  return (
    <Card className="min-w-[167px] max-w-[167px] rounded-2xl">
      <CardContent className="p-0">
        <div className="p-1 relative">
          <Badge variant="secondary" className="opacity-90 flex items-center gap-1 absolute left-3 top-3 z-10">
            <StarIcon className="fill-primary text-primary" size={12} />
            <span>5,0</span>
          </Badge>
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
          <h2 className="font-bold mt-2 overflow-hidden text-ellipsis text-nowrap">
            {establishment.name}
          </h2>
          <p className="text-sm text-gray-400 overflow-hidden text-ellipsis text-nowrap">
            {establishment.address}
          </p>
          <Button className="w-full mt-3" variant="secondary">
            Reservar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EstablishmentItem;
