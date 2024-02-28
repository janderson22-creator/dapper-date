"use client";

import Image from "next/image";
import { Admin, Employee, Service } from "@prisma/client";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Loader2, PlusCircle } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import ImageUpload from "../../components/image-upload";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { saveEmployee } from "../../actions/employee/create-employee";
import { toast } from "sonner";
import { updateEmployee } from "../../actions/employee/update-employee";
import { deleteEmployee } from "../../actions/employee/delete-employee";
import { Card, CardContent } from "@/app/components/ui/card";
import { Textarea } from "@/app/components/ui/textarea";
import { updateService } from "../../actions/service/update-service";
import { saveService } from "../../actions/service/create-service";

interface EmployeesAdminProps {
  services: Service;
  paramsId: string | undefined;
}

const ServiceItemAdmin: React.FC<EmployeesAdminProps> = ({
  services,
  paramsId,
}) => {
  const [loadingAdmin, setLoadingAdmin] = useState<boolean>(true);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [serviceSelected, setServiceSelected] = useState<
    Employee | undefined
  >();
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const adminJson = localStorage.getItem("admin");

      if (!adminJson || !paramsId) {
        return router.push("/");
      }

      const admin: Admin = JSON.parse(adminJson);
      const isAdmin = paramsId === admin.establishmentId;

      if (!isAdmin) {
        return router.push("/");
      }

      setLoadingAdmin(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editService = (service: Service) => {
    setServiceSelected(service);
    setName(service.name);
    setDescription(service.description);
    setPrice(service.price);
    setSheetIsOpen(true);
  };

  useEffect(() => {
    if (sheetIsOpen) return;

    if (!sheetIsOpen) {
      setServiceSelected(undefined);
      setImageUrl("");
      setName("");
      setDescription("");
      setPrice("");
    }
  }, [sheetIsOpen]);

  const submitClick = useCallback(async () => {
    if (!paramsId) return;

    try {
      if (serviceSelected) {
        await updateService({
          serviceId: serviceSelected.id,
          imageUrl: imageUrl ? imageUrl : serviceSelected.imageUrl,
          name,
          description,
          price: parseFloat(price),
        });

        toast.success("Serviço editado com sucesso!", {
          duration: 4000,
          position: "top-center",
        });

        return;
      }

      if (!imageUrl || !name || !description || !paramsId) {
        return;
      }

      await saveService({
        imageUrl,
        name,
        description,
        price: parseFloat(price),
        establishmentId: paramsId,
      });

      toast.success("Serviço adicionado com sucesso!", {
        duration: 4000,
        position: "top-center",
      });
    } catch (error) {
      console.error(error);
    }
  }, [description, imageUrl, name, paramsId, price, serviceSelected]);

  useEffect(() => {
    console.log(imageUrl);
    console.log(name);
    console.log(description);
    console.log(description);
  }, [description, imageUrl, name]);

  return (
    <div>
      {loadingAdmin ? (
        <div className="flex items-center justify-center m-auto h-[80vh]">
          <Loader2 className="h-16 w-16 animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="pl-2 text-xs uppercase text-gray-400 font-bold">
              Serviços
            </h2>

            <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
              <SheetTrigger className="mb-2" asChild>
                <PlusCircle />
              </SheetTrigger>

              <SheetContent>
                <SheetHeader className="px-5 py-2 border-b border-secondary">
                  <SheetTitle>
                    {serviceSelected ? "Editar" : "Adicionar"} Serviço
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col items-center mt-10">
                  <ImageUpload
                    height={170}
                    width={170}
                    rounded={1000}
                    image={
                      serviceSelected?.imageUrl || imageUrl || "/avatar.webp"
                    }
                    setImage={setImageUrl}
                  />

                  <div className="w-full flex flex-col items-center">
                    <Input
                      placeholder="Nome"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />

                    <Input
                      className="mt-4"
                      placeholder="Preço"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />

                    <Textarea
                      className="text-xs resize-none mt-4"
                      id="description"
                      name="description"
                      placeholder="Descrição"
                      maxLength={60}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground ml-auto pr-1">
                      {description.length}/60
                    </p>
                  </div>

                  <SheetClose asChild>
                    <Button
                      onClick={submitClick}
                      className="w-full mt-5"
                      type="submit"
                    >
                      Salvar
                    </Button>
                  </SheetClose>

                  {serviceSelected && (
                    <SheetClose asChild>
                      <Button
                        variant="destructive"
                        // onClick={() => handleDeleteEmployee()}
                        className="w-full mt-2"
                        type="submit"
                      >
                        Excluir
                      </Button>
                    </SheetClose>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex flex-col gap-4">
            {services.map((service: Service, index: number) => (
              <Card onClick={() => editService(service)} key={index}>
                <CardContent className="flex items-center gap-4 p-3">
                  <Image
                    src={service.imageUrl}
                    alt={""}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="object-cover rounded-lg min-w-[110px] min-h-[110px] max-w-[110px] max-h-[110px]"
                  />

                  <div className="flex flex-col w-full">
                    <h2 className="font-bold">{service.name}</h2>
                    <p className="text-sm text-gray-400">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm text-primary font-bold">
                        {Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(service.price))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const tableHead = [
  {
    name: "#",
    width: "10%",
  },
  {
    name: "Foto",
    width: "25%",
  },
  {
    name: "Nome",
    width: "35%",
  },
  {
    name: "Função",
    width: "30%",
  },
];

export default ServiceItemAdmin;
