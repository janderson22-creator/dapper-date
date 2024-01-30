"use client";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { SearchIcon } from "lucide-react";

const Search = () => {
  return (
    <div className="w-full flex items-center gap-2">
      <Input type="text" placeholder="Busque por um estabelecimento..." />

      <Button size="icon" className="w-12 h-10">
        <SearchIcon size={20} />
      </Button>
    </div>
  );
};

export default Search;
