import { useState } from "react";
import { FiCommand, FiSearch } from "react-icons/fi"; 
import { CommandMenu } from "./CommandMenu";

function Search() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="bg-stone-200 mb-4 relative rounded flex items-center px-2 py-1.5 text-sm">
        <FiSearch className="mr-2" />
        <input
          onFocus={(e) => {
            e.target.blur();
            setOpen(true);
          }}
          type="text"
          placeholder="Search"
          className="w-full bg-transparent placeholder:text-stone-400 cursor-pointer focus:outline-none"
        />

      </div>
      <CommandMenu 
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}

export default Search;
