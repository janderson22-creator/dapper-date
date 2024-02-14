import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { cn } from "@/app/lib/utils";
import { Employee } from "@prisma/client";
import React, { Dispatch, SetStateAction } from "react";

interface EmployeeItemProps {
  employee: Employee;
  employeeId: string | undefined;
  setEmployee: Dispatch<SetStateAction<string | undefined>>;
}

const EmployeeItem: React.FC<EmployeeItemProps> = ({
  employee,
  employeeId,
  setEmployee,
}) => {
  return (
    <div
      onClick={() => setEmployee(employee.id)}
      className="flex flex-col items-center"
    >
      <div className="flex items-center justify-center min-w-24 min-h-24">
        <Avatar
          className={cn(
            "h-20 w-20 transition-all ease-in-out duration-200",
            employee.id === employeeId &&
              "border-[3px] border-primary w-[88px] h-[88px]"
          )}
        >
          <AvatarImage src={employee.imageUrl} className="object-cover" />

          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </div>

      <h2 className="font-medium text-lg">{employee.name}</h2>
      <p className="font-normal text-sm text-gray-400">{employee.position}</p>
    </div>
  );
};

export default EmployeeItem;
