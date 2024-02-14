import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { cn } from "@/app/lib/utils";
import { Employee } from "@prisma/client";
import React, { Dispatch } from "react";

interface EmployeeItemProps {
  employee: Employee;
  employeeSelected: Employee | undefined;
  setEmployeeSelected: Dispatch<any>;
}

const EmployeeItem: React.FC<EmployeeItemProps> = ({
  employee,
  employeeSelected,
  setEmployeeSelected,
}) => {
  return (
    <div
      onClick={() => setEmployeeSelected(employee)}
      className="flex flex-col items-center"
    >
      <div className="flex items-center justify-center min-w-24 min-h-24">
        <Avatar
          className={cn(
            "h-20 w-20 transition-all ease-in-out duration-200",
            employeeSelected &&
              employee.id === employeeSelected.id &&
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
