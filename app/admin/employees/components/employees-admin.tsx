"use client";

import Image from "next/image";
import { Admin, Employee } from "@prisma/client";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
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

interface EmployeesAdminProps {
  employees: Employee;
  paramsId: string | undefined;
}

const EmployeesAdmin: React.FC<EmployeesAdminProps> = ({
  employees,
  paramsId,
}) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState<boolean>(true);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [employeeSelected, setEmployeeSelected] = useState<
    Employee | undefined
  >();
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
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

  const editEmployee = (employee: Employee) => {
    setEmployeeSelected(employee);
    setName(employee.name);
    setPosition(employee.position);
    setSheetIsOpen(true);
  };

  useEffect(() => {
    if (sheetIsOpen) return;

    if (!sheetIsOpen) {
      setEmployeeSelected(undefined);
      setImageUrl("");
      setName("");
      setPosition("");
    }
  }, [sheetIsOpen]);

  const submitClick = useCallback(async () => {
    if (!paramsId) return;

    try {
      if (employeeSelected) {
        await updateEmployee({
          employeeId: employeeSelected.id,
          imageUrl: imageUrl ? imageUrl : employeeSelected.imageUrl,
          name,
          position,
          establishmentId: paramsId,
        });

        toast.success("Profissional editado com sucesso!", {
          duration: 4000,
          position: "top-center",
        });

        return;
      }

      if (!imageUrl || !name || !position || !paramsId) {
        return;
      }

      await saveEmployee({
        imageUrl,
        name,
        position,
        establishmentId: paramsId,
      });

      toast.success("Profissional adicionado com sucesso!", {
        duration: 4000,
        position: "top-center",
      });
    } catch (error) {
      console.error(error);
    }
  }, [employeeSelected, imageUrl, name, paramsId, position]);

  const handleDeleteEmployee = useCallback(async () => {
    if (!employeeSelected) return;
    setIsDeleteLoading(true);
    try {
      await deleteEmployee({
        employeeId: employeeSelected.id,
      });

      toast.success("Profissional deletado com sucesso!", {
        duration: 4000,
        position: "top-center",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleteLoading(false);
    }
  }, [employeeSelected]);

  const employeeHasBookings = useMemo(() => {
    if (!employeeSelected) return false;

    const areThereBookings = employeeSelected.bookings.length;

    if (areThereBookings) {
      return true;
    }

    return false;
  }, [employeeSelected]);

  return (
    <div>
      {loadingAdmin ? (
        <div className="flex items-center justify-center m-auto h-[80vh]">
          <Loader2 className="h-16 w-16 animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="pl-3 text-xs uppercase text-gray-400 font-bold">
              Profissionais
            </h2>

            <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
              <SheetTrigger className="cursor-pointer" asChild>
                <PlusCircle />
              </SheetTrigger>

              <SheetContent>
                <SheetHeader className="px-5 py-2 border-b border-secondary">
                  <SheetTitle>
                    {employeeSelected ? "Editar" : "Adicionar"} Profissional
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col items-center mt-10">
                  <ImageUpload
                    height={170}
                    width={170}
                    rounded={1000}
                    image={
                      employeeSelected?.imageUrl || imageUrl || "/avatar.webp"
                    }
                    setImage={setImageUrl}
                  />

                  <div className="w-full flex flex-col items-center gap-4">
                    <Input
                      placeholder="Nome"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />

                    <Input
                      placeholder="Função"
                      type="text"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      required
                    />
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

                  {employeeSelected && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full mt-2">
                          Excluir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="w-[90%] rounded-lg">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Excluir Profissional
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {employeeHasBookings
                              ? "Esse profissional não pode ser excluido, pois tem agendamentos em aberto para ele, dúvidas falar com nosso suporte"
                              : "Tem certeza que deseja remover esse profissional?"}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-row gap-3">
                          <AlertDialogCancel className="w-full mt-0">
                            Voltar
                          </AlertDialogCancel>

                          <SheetClose asChild>
                            <AlertDialogAction
                              disabled={employeeHasBookings}
                              className="w-full"
                              onClick={() => handleDeleteEmployee()}
                            >
                              {isDeleteLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
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

          <div className="flex items-center mt-4 pl-3 py-4 rounded-t-[10px] bg-transparent border">
            {tableHead.map((item, index) => (
              <span
                className="text-[#7E7D80] text-sm font-semibold"
                key={index}
                style={{ width: item.width }}
              >
                {item.name}
              </span>
            ))}
          </div>
          <div className="flex flex-col gap-4 border border-t-transparent rounded-b-[10px]">
            {employees.map((employee: Employee, index: number) => (
              <div
                onClick={() => editEmployee(employee)}
                key={index}
                className="flex items-center rounded-2xl bg-transparent py-3 relative cursor-pointer lg:hover:bg-gray-800 transition-all ease-in duration-100 hover:rounded-none"
              >
                <div className="w-[10%] pl-3 text-gray-400 text-sm font-bold">
                  {index + 1}
                </div>

                <div className="pl-2 w-[25%]">
                  <Image
                    src={employee.imageUrl}
                    alt={employee.name}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="min-w-8 min-h-8 max-w-8 max-h-8 rounded-full object-cover"
                  />
                </div>

                <div className="pl-2 w-[35%] text-xs font-semibold whitespace-nowrap text-ellipsis overflow-hidden">
                  {employee.name}
                </div>

                <div className="pl-1 w-[30%] text-xs font-normal text-gray-400 text-left">
                  {employee.position}
                </div>
              </div>
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

export default EmployeesAdmin;
