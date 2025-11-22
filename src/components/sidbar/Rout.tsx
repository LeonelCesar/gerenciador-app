import { NavLink } from "react-router-dom";
import { IconType } from "react-icons";


export default function Rout({
  Icon,
  title,
  to,
}: {
  Icon: IconType;
  title: string;
  to: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center justify-start gap-2 w-full 
        rounded px-2 py-1.5 text-sm 
        transition-[box-shadow,_background-color,_color] ${
          isActive
            ? "bg-white text-stone-950 shadow"
            : "hover:bg-slate-200 bg-transparent text-stone-500 shadow-none"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={isActive ? "text-violet-600" : "text-stone-500"} />
          <span>{title}</span>
        </>
      )}
    </NavLink>
  );
}
