import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/cars?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <section className="py-8 bg-white shadow-md relative -mt-6 rounded-t-lg z-10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <form className="flex flex-col md:flex-row gap-4" onSubmit={handleSearch}>
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search by make, model, or name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button 
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition"
            >
              <i className="fas fa-search mr-2"></i> Search
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SearchBar;
