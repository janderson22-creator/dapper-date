import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";

const Header = () => {
  return (
    <Card className="rounded-none">
      <CardContent className="p-5 flex items-center justify-between">
        <Image src="/logo.png" alt="dapper date" height={22} width={120} />
        <Button variant="outline" size="icon" className="w-8 h-8">
          <MenuIcon size={18} />
        </Button>
      </CardContent>
    </Card>
  );
};

export default Header;
