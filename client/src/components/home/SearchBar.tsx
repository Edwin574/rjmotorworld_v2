
import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/cars?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <form className="flex flex-col md:flex-row gap-4 w-full" onSubmit={handleSearch}>
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Search by make, model, or name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-6 text-lg bg-white/90 backdrop-blur-sm border-0 focus:ring-2 focus:ring-primary"
        />
      </div>
      <Button 
        type="submit"
        className="bg-primary hover:bg-primary-dark text-white px-8 py-6 text-lg"
      >
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
