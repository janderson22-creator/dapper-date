"use client"

import { FormEvent, useState } from "react";
import { SheetContent } from "./ui/sheet";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { getAdmin } from "../admin/actions/get-admin";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Admin } from "@prisma/client";

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitIsLoading, setSubmitIsLoading] = useState(false);

  const submitClick = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitIsLoading(true);

    try {
      const admin: Admin = await getAdmin(email, password);

      if (!admin) {
        return toast.error("Email ou Senha incorretos!");
      }

      localStorage.setItem("admin", JSON.stringify(admin));
      router.push(`/admin/${admin.establishmentId}`);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitIsLoading(false);
    }
  };

  return (
    <SheetContent side="bottom">
      <form onSubmit={submitClick}>
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-gray-200" htmlFor="email">
            E-mail:
          </label>
          <Input
            placeholder="email@gmail.com"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1 mt-4">
          <label className="font-semibold text-gray-200" htmlFor="password">
            Senha:
          </label>
          <Input
            placeholder="********"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button
          className="w-full mt-10"
          type="submit"
          disabled={!email || !password || submitIsLoading}
        >
          {submitIsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Confirmar
        </Button>
      </form>
    </SheetContent>
  );
};

export default LoginForm;
