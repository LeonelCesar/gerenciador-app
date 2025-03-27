import { FiFolderMinus, FiHome, FiLink, FiPaperclip, FiRss, FiSettings, FiUsers } from "react-icons/fi";

function RouteSelect() {
  return (
    <div className="space-y-1">
      <Rout Icon={FiHome} selected={true} title="Dashboard" />
      <Rout Icon={FiUsers} selected={false} title="Team" />
      <Rout Icon={FiPaperclip} selected={false} title="Invoices" />
      <Rout Icon={FiLink} selected={false} title="Interations" />
      <Rout Icon={FiFolderMinus} selected={false} title="Folders Index" />
      <Rout Icon={FiRss} selected={false} title="Internet Work" />
      <Rout Icon={FiSettings} selected={false} title="Services" />
    </div>
  )
}

export default RouteSelect;

const Rout = ({
  selected,
  Icon,
  title,
}: {
  selected: Boolean;
  Icon: IconType;
  title: String;
}) => {
  return(
    <button
     className={`flex items-center justify-start gap-2 w-full 
      rounded px-2 py-1.5 text-sm 
      transition-[box-shadow,_background-color,_color] ${
        selected
        ? "bg-white text-stone-950 shadow"
        : "hover:bg-slate-200 bg-transparent text-stone-500 shadow-none"
      }`}
    >
      <Icon className={selected ? "text-violet-500" : ""} />
      <span>{title}</span>
    </button>
  )
};