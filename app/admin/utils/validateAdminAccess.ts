"use client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface Admin {
  establishmentId: string;
}

export const validateAdminAccess = (
  router: AppRouterInstance,
  paramsId: string | undefined,
  setLoadingAdmin: (loading: boolean) => void
) => {
  const adminJson = localStorage.getItem("admin");
  if (!adminJson || !paramsId) return router.push("/");

  const admin: Admin = JSON.parse(adminJson);
  if (paramsId !== admin.establishmentId) return router.push("/");

  setLoadingAdmin(false);
};
