"use client";

import {
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/app/components/ui/sheet";
import ImageUpload from "../../components/image-upload";
import { Input } from "@/app/components/ui/input";
import { Establishment } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { updateEstablishment } from "../../actions/establishment-info/update-establishment";
import { toast } from "sonner";

interface EditProfileProps {
  establishment: Establishment;
}

const EditProfile: React.FC<EditProfileProps> = ({ establishment }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    setImageUrl(establishment.imageURL);
    setName(establishment.name);
    setAddress(establishment.address);
    setDescription(establishment.description);
    setPhoneNumber(establishment.phoneNumber);
  }, [
    establishment.address,
    establishment.description,
    establishment.imageURL,
    establishment.name,
    establishment.phoneNumber,
  ]);

  const submitClick = useCallback(async () => {
    try {
      await updateEstablishment({
        id: establishment.id,
        imageUrl,
        name,
        phoneNumber,
        address,
        description,
      });

      toast.success("Informações do estabelecimento alterado com sucesso!", {
        duration: 4000,
        position: "top-center",
      });
    } catch (error) {
      console.error(error);
    }
  }, [address, description, establishment.id, imageUrl, name, phoneNumber]);

  return (
    <SheetContent className="p-3">
      <SheetHeader className="px-5 py-2 border-b border-secondary">
        <SheetTitle>Editar Estabelecimento</SheetTitle>
      </SheetHeader>

      <div className="flex flex-col items-center mt-5">
        <ImageUpload
          height={170}
          width={170}
          rounded={1000}
          image={imageUrl || establishment?.imageUrl || "/avatar.webp"}
          setImage={setImageUrl}
        />

        <div className="w-full flex flex-col gap-1 mt-4">
          <label className="text-xs text-gray-400" htmlFor="name">
            Nome:
          </label>
          <Input
            id="name"
            name="name"
            placeholder="Nome"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="w-full flex flex-col gap-1 mt-4">
          <label className="text-xs text-gray-400" htmlFor="phone">
            Número de telefone:
          </label>
          <Input
            id="phone"
            name="phone"
            placeholder="Número de telefone"
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        <div className="w-full flex flex-col gap-1 mt-2">
          <label className="text-xs text-gray-400" htmlFor="address">
            Endereço:
          </label>
          <Input
            id="address"
            name="address"
            placeholder="Endereço"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="w-full flex flex-col gap-1 mt-2">
          <label className="text-xs text-gray-400" htmlFor="description">
            Descrição:
          </label>
          <Textarea
            className="text-xs resize-none"
            id="description"
            name="description"
            placeholder="Descrição"
            maxLength={180}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <p className="text-xs text-muted-foreground ml-auto pr-1">
            {description.length}/180
          </p>
        </div>

        <SheetClose asChild>
          <Button
            onClick={() => submitClick()}
            className="w-full mt-5"
            type="submit"
          >
            Salvar
          </Button>
        </SheetClose>
      </div>
    </SheetContent>
  );
};

export default EditProfile;
