interface EmployeesPageProps {
    params: {
      id?: string;
    };
  }

const Employees: React.FC<EmployeesPageProps> = ({params}) => {
    return ( 
        <div>
            {params.id}
        </div>
    );
}
 
export default Employees;