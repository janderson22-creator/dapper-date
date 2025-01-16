"use client";

import Image from "next/image";
import { Admin, Booking, Employee, Service } from "@prisma/client";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { toast } from "sonner";
import { Card, CardContent } from "@/app/components/ui/card";
import { Textarea } from "@/app/components/ui/textarea";
import { updateService } from "../../actions/service/update-service";
import { saveService } from "../../actions/service/create-service";
import { deleteService } from "../../actions/service/delete-service";
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
} from "@/app/components/ui/alert-dialog";
import { Slider } from "@/app/components/ui/slider";
import { validateAdminAccess } from "../../utils/validateAdminAccess";

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
  const [serviceDuration, setServiceDuration] = useState(0);
  const router = useRouter();

  useEffect(() => {
    validateAdminAccess(router, paramsId, setLoadingAdmin);
  }, [paramsId, router]);

  useEffect(() => {
    if (!sheetIsOpen) {
      setServiceSelected(undefined);
      setImageUrl("");
      setName("");
      setDescription("");
      setPrice("");
      setServiceDuration(0);
    }
  }, [sheetIsOpen]);

  const editService = (service: Service) => {
    const { name, description, price, imageUrl, duration } = service;
    setServiceSelected(service);
    setName(name);
    setDescription(description);
    setPrice(price);
    setImageUrl(imageUrl);
    setServiceDuration(duration);
    setSheetIsOpen(true);
  };

  const submitService = async () => {
    // TODO ADICIONAR ERROR HANDLING
    if (!paramsId || !name || !description || !price || !serviceDuration)
      return;

    try {
      const data = {
        imageUrl: imageUrl || serviceSelected?.imageUrl || "/avatar.webp",
        name,
        description,
        price: parseFloat(price),
        duration: serviceDuration,
        establishmentId: paramsId,
      };

      if (serviceSelected) {
        await updateService({ ...data, serviceId: serviceSelected.id });
        toast.success("Serviço editado com sucesso!", { duration: 4000 });
      } else {
        await saveService(data);
        toast.success("Serviço adicionado com sucesso!", { duration: 4000 });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteService = useCallback(async () => {
    if (!serviceSelected) return;
    try {
      await deleteService({ serviceId: serviceSelected.id });
      toast.success("Serviço deletado com sucesso!", { duration: 4000 });
    } catch (error) {
      console.error(error);
    }
  }, [serviceSelected]);

  const serviceHasBookings = useMemo(
    () => serviceSelected?.booking?.length > 0 || false,
    [serviceSelected]
  );

  useEffect(() => {
    if (serviceSelected) {
      setServiceDuration(serviceSelected.duration);
    }
  }, [serviceSelected]);

  if (loadingAdmin) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="pl-2 text-xs uppercase text-gray-400 font-bold">
          Serviços
        </h2>

        <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
          <SheetTrigger className="cursor-pointer mb-2" asChild>
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
                image={serviceSelected?.imageUrl || imageUrl || "/avatar.webp"}
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

              <div className="w-full flex flex-col mb-10 relative">
                <p className="text-gray-400 font-bold uppercase">
                  duração de um serviço
                </p>
                <div className="relative px-2 mb-10 mt-4">
                  <Slider
                    defaultValue={[serviceDuration]}
                    onValueChange={(value) => setServiceDuration(value[0])}
                    max={200}
                    step={5}
                    className="SliderRange"
                  />
                  <span
                    className="absolute left-0 top-[30px] transform -translate-y-1/2 text-sm font-semibold whitespace-nowrap"
                    style={{
                      left: `${(serviceDuration / 200) * 100}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {serviceDuration} Min
                  </span>
                </div>
              </div>

              <SheetClose asChild>
                <Button
                  onClick={submitService}
                  className="w-full mt-5"
                  type="submit"
                >
                  Salvar
                </Button>
              </SheetClose>

              {serviceSelected && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full mt-2">
                      Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-[90%] rounded-lg">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir Serviço</AlertDialogTitle>
                      <AlertDialogDescription>
                        {serviceHasBookings
                          ? "Esse serviço não pode ser excluir pois possui agendamentos em aberto para ele, falar com nosso suporte."
                          : "Tem certeza que deseja remover esse serviço?"}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-row gap-3">
                      <AlertDialogCancel className="w-full mt-0">
                        Voltar
                      </AlertDialogCancel>

                      <SheetClose asChild>
                        <AlertDialogAction
                          disabled={serviceHasBookings}
                          className="w-full"
                          onClick={() => handleDeleteService()}
                        >
                          Confirmar
                        </AlertDialogAction>
                      </SheetClose>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-col gap-4">
        {services.map((service: Service, index: number) => (
          <Card
            className="cursor-pointer"
            onClick={() => editService(service)}
            key={index}
          >
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
                <p className="text-sm text-gray-400">{service.description}</p>

                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-primary font-bold">
                    R$ {service.price}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServiceItemAdmin;
