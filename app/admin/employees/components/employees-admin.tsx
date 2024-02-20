"use client";

import Image from "next/image";
import { Card, CardContent } from "@/app/components/ui/card";
import { Admin, Employee } from "@prisma/client";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, PlusCircle, Trash } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";

interface EmployeesAdminProps {
  employees: Employee;
  paramsId: string | undefined;
}

const EmployeesAdmin: React.FC<EmployeesAdminProps> = ({
  employees,
  paramsId,
}) => {
  const [loadingAdmin, setLoadingAdmin] = useState<boolean>(true);
  const [imageUrl, setImageUrl] = useState("");
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

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const imageUrl = await convertBlobToUrl(file);

      if (typeof imageUrl === "string") {
        setImageUrl(imageUrl);
      } else {
        console.error("Failed to convert blob to URL");
      }
    }
  };

  const convertBlobToUrl = async (file: Blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result as string);
      };

      reader.readAsDataURL(file);
    });
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
                <SheetHeader className="text-left px-5 py-2 border-b border-secondary">
                  <SheetTitle>
                    {employeeSelected ? "Editar" : "Adicionar"} Profissional
                  </SheetTitle>
                </SheetHeader>

                <form onSubmit={submitClick} className="px-5 py-3">
                  <label htmlFor="imageUrl" className="block mb-1">
                    Imagem URL:
                  </label>
                  <input
                    id="imageUrl"
                    name="imageUrl"
                    className="border border-gray-300 rounded px-3 py-2 mb-3"
                    type="file"
                    onChange={(e) => handleImageChange(e)}
                  />

                  <label htmlFor="name" className="block mb-1">
                    Nome:
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="border border-gray-300 rounded px-3 py-2 mb-3"
                  />

                  <label htmlFor="position" className="block mb-1">
                    Cargo:
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    className="border border-gray-300 rounded px-3 py-2 mb-3"
                  />

                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Salvar
                  </button>
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
