"use client";

import Image from "next/image";
import { Employee, Establishment, Service } from "@prisma/client";
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
import { cn } from "@/app/utils/cn";
import { updateEstablishment } from "../../actions/establishment-info/update-establishment";

interface EmployeesAdminProps {
  establishment: Establishment;
  services: Service;
}

const ServiceItemAdmin: React.FC<EmployeesAdminProps> = ({
  establishment,
  services,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState<boolean>(true);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [serviceSelected, setServiceSelected] = useState<Service | undefined>();
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [serviceDuration, setServiceDuration] = useState(0);
  const [averageTimeService, setAverageTimeService] = useState(
    establishment.averageTimeService
  );
  const router = useRouter();

  useEffect(() => {
    validateAdminAccess(router, establishment.id, setLoadingAdmin);
  }, [establishment.id, router]);

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
    if (
      !establishment.id ||
      !name ||
      !description ||
      !price ||
      !serviceDuration
    )
      return;

    try {
      const data = {
        imageUrl: imageUrl || serviceSelected?.imageUrl || "/avatar.webp",
        name,
        description,
        price: parseFloat(price),
        duration: serviceDuration,
        establishmentId: establishment.id,
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
    setServiceDuration(
      serviceSelected?.duration || establishment.averageTimeService
    );
  }, [establishment.averageTimeService, serviceSelected]);

  if (loadingAdmin) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateEstablishment({
        id: establishment.id,
        averageTimeService,
      });

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (error) {
      ("");
      console.error("Erro ao atualizar:", error);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-between">
        <div className="flex flex-col mb-4 relative">
          <p className="text-xs uppercase text-gray-400 font-bold">
            duração média dos serviços
          </p>
          <div className="relative mt-3 mb-10">
            <Slider
              defaultValue={[averageTimeService]}
              onValueChange={(value) => setAverageTimeService(value[0])}
              max={200}
              step={5}
              className="SliderRange"
            />
            <span
              className="absolute left-0 top-[30px] transform -translate-y-1/2 text-sm font-semibold whitespace-nowrap"
              style={{
                left: `${(averageTimeService / 200) * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {averageTimeService} Min
            </span>
          </div>

          <Button
            onClick={() => handleUpdate()}
            disabled={averageTimeService === establishment.averageTimeService}
            className="w-full"
            variant="default"
          >
            {isLoading ? "Alterando..." : isSuccess ? "Alterado" : "Alterar"}
          </Button>
        </div>

        <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
          <div className="flex items-center">
            <h2 className="text-xs uppercase text-gray-400 font-bold">
              Serviços
            </h2>
            <SheetTrigger className="cursor-pointer mb-2 ml-auto" asChild>
              <PlusCircle />
            </SheetTrigger>
          </div>

          <SheetContent className="w-[90%] px-4">
            <SheetHeader className="px-2 pb-2 border-b border-secondary">
              <SheetTitle>
                {serviceSelected ? "Editar" : "Adicionar"} Serviço
              </SheetTitle>
            </SheetHeader>

            <div className="flex flex-col items-center mt-2">
              <ImageUpload
                height={170}
                width={170}
                rounded={1000}
                image={serviceSelected?.imageUrl || imageUrl || "/avatar.webp"}
                setImage={setImageUrl}
              />

              <div className="w-full flex flex-col items-center">
                <Input
                  className="text-xs"
                  placeholder="Nome"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <Input
                  className="mt-3 text-xs"
                  placeholder="Preço"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />

                <Textarea
                  className="text-xs resize-none mt-3"
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

              <div className="w-full flex flex-col relative">
                <p className="text-gray-400 font-medium text-xs">
                  Duração do serviço
                </p>
                <div className="relative mt-4">
                  <Slider
                    value={[serviceDuration]}
                    onValueChange={(value) => setServiceDuration(value[0])}
                    max={200}
                    step={5}
                    className="SliderRange"
                  />
                  <span
                    className="text-xs absolute left-0 top-[30px] transform -translate-y-1/2 font-semibold whitespace-nowrap"
                    style={{
                      left: `${(serviceDuration / 200) * 100}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {serviceDuration} Min
                  </span>

                  {serviceSelected && (
                    <Button
                      onClick={() =>
                        setServiceDuration(establishment.averageTimeService)
                      }
                      className="w-full mt-10 text-xs"
                      variant="outline"
                    >
                      Definir tempo médio de {establishment?.averageTimeService}{" "}
                      min
                    </Button>
                  )}
                </div>
              </div>

              <div
                className={cn(
                  "flex items-center w-full gap-2 mt-10",
                  serviceSelected && "mt-5"
                )}
              >
                <SheetClose asChild>
                  <Button
                    onClick={submitService}
                    className="w-full"
                    type="submit"
                  >
                    Salvar
                  </Button>
                </SheetClose>

                {serviceSelected && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        Excluir Serviço
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
