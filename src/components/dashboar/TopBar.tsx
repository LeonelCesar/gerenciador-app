import { FiCalendar } from "react-icons/fi";

function TopBar() {
  return (
    <div className="border-b px-4 mt-2 pb-4 border-stone-200 sticky top-0 bg-stone-100 z-10">
      <div className="flex items-center justify-between p-0.5">
        <div>
          <span className="text-sm font-bold block">
            Hy, Leonel Helder César
          </span>
          <span className="text-xs block text-stone-500">
            Sunday, March 29 de 2023
          </span>
        </div>

        <button className="flex text-sm items-center gap-2 bg-stone-100 transition-colors hover:bg-violet-100 hover:text-violet-700 px-3 py-1.5 rounded">
          <FiCalendar />
          <span>Prev 6 Months</span>
        </button>
      </div>
    </div>
  );
}

export default TopBar;

