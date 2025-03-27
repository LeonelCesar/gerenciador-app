import { FiChevronDown, FiChevronUp } from "react-icons/fi";

function AccountTaggle() {
  return (
    <div className="border-b mb-4 mt-2 pb-4 border-stone-300">
      <button className="flex p-0.5 hover:bg-stone-200 rounded transition-colors relative gap-2 w-full items-center">
        <img
          src="https://avatars.githubusercontent.com/u/149327611?v=4"
          alt="avatar"
          className="size-8 rounded shrink-0 bg-violet-500 shadow"
        />
        <div className="text-start">
          <span className="text-sm font-bold block">Leonel Helder César</span>
          <span className="text-xs text-stone-500 font-semibold block">
            leonelcesar62@gmail.com
          </span>
        </div>
        <FiChevronDown className="absolute right-0 top-1/2 translate-y-[calc(-50%+4px)] text-sm" />
        <FiChevronUp className="absolute right-0 top-1/2 translate-y-[calc(-50%-4px)] text-sm" />
      </button>
    </div>
  );
}

export default AccountTaggle;
