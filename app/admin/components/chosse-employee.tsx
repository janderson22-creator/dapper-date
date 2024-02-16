"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Admin } from "@prisma/client";
import { Loader2 } from "lucide-react";

interface ChooseEmployeeProps {
  paramsId: string | undefined;
}

const ChosseEmployee: React.FC<ChooseEmployeeProps> = ({ paramsId }) => {
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
        "É ADMIN"
      )}
    </div>
  );
};

export default ChosseEmployee;
