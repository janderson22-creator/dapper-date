"use client";

import Image from "next/image";
import { Admin, Employee } from "@prisma/client";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, PlusCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import ImageUpload from "../../components/image-upload";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

interface EmployeesAdminProps {
  employees: Employee;
  paramsId: string | undefined;
}

const EmployeesAdmin: React.FC<EmployeesAdminProps> = ({
  employees,
  paramsId,
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [loadingAdmin, setLoadingAdmin] = useState<boolean>(true);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [employeeSelected, setEmployeeSelected] = useState<
    Employee | undefined
  >();
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
    setSheetIsOpen(true);
  };

  useEffect(() => {
    if (sheetIsOpen) return;

    if (!sheetIsOpen) {
      setEmployeeSelected(undefined);
      setImageUrl("");
    }
  }, [sheetIsOpen]);

  const submitClick = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

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
              <SheetTrigger asChild>
                <PlusCircle />
              </SheetTrigger>

              <SheetContent>
                <SheetHeader className="px-5 py-2 border-b border-secondary">
                  <SheetTitle>
                    {employeeSelected ? "Editar" : "Adicionar"} Profissional
                  </SheetTitle>
                </SheetHeader>

                <form
                  onSubmit={submitClick}
                  className="flex flex-col items-center mt-10"
                >
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
                      value={employeeSelected?.name || name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />

                    <Input
                      placeholder="Função"
                      type="text"
                      value={employeeSelected?.position || position}
                      onChange={(e) => setPosition(e.target.value)}
                      required
                    />
                  </div>

                  <Button className="w-full mt-5" type="submit">Salvar</Button>
                </form>
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
                className="flex items-center rounded-2xl bg-transparent py-3 relative"
              >
                <div className="w-[10%] pl-3 text-gray-400 text-sm font-bold">
                  {index}
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

                <div className="pl-2 w-[35%] text-xs font-semibold mt-2">
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
