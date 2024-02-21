import { db } from "@/app/lib/prisma";
import { Employee } from "@prisma/client";
import HeaderAdmin from "../../components/header-admin";
import EmployeesAdmin from "../components/employees-admin";

interface EmployeesPageProps {
  params: {
    id?: string;
  };
}

const Employees: React.FC<EmployeesPageProps> = async ({ params }) => {
  
  const employees: Employee = await db.employee.findMany({
    where: {
      establishmentId: params.id,
    },
    include: {
      establishment: true,
      bookings: true
    },
  });

  return (
    <div>
      <HeaderAdmin paramsId={params.id} />

      <div className="mt-6 px-5">
        <EmployeesAdmin paramsId={params.id} employees={employees} />
      </div>
    </div>
  );
};

export default Employees;
