"use client";

import Image from "next/image";
import { Card, CardContent } from "@/app/components/ui/card";
import { Admin, Employee } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, PlusCircle, Trash } from "lucide-react";

interface EmployeesAdminProps {
  employees: Employee;
  paramsId: string | undefined;
}

const EmployeesAdmin: React.FC<EmployeesAdminProps> = ({
  employees,
  paramsId,
}) => {
  const [loadingAdmin, setLoadingAdmin] = useState<boolean>(true);
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

            <PlusCircle />
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
