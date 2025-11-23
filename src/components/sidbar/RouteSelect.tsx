/* import { FiFolderMinus, FiHome, FiLink, FiPaperclip, FiRss, FiSettings, FiUsers } from "react-icons/fi";
import Route from "../sidbar/Rout";

function RouteSelect() {
  return (
    <div className="space-y-1">
      <Rout Icon={FiHome} title="Dashboard" to="/dashboard" />
      <Rout Icon={FiUsers} title="Team" to="/team" />
      <Rout Icon={FiPaperclip} title="Invoices" to="/invoices" />
      <Rout Icon={FiLink} title="Interactions" to="/interactions" />
      <Rout Icon={FiFolderMinus} title="Folders Index" to="/folders" />
      <Rout Icon={FiRss} title="Internet Work" to="/internet" />
      <Rout Icon={FiSettings} title="Services" to="/services" />
    </div>
  )
}

export default RouteSelect;


import { IconType } from "react-icons";

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
};  */

import { FiFolderMinus, FiHome, FiLink, FiPaperclip, FiRss, FiSettings, FiUsers } from "react-icons/fi";
import Rout from "../sidbar/Rout";

function RouteSelect() {
  return (
    <div className="space-y-1">
      <Rout Icon={FiHome} title="Dashboard" to="/dashboard" />
      <Rout Icon={FiUsers} title="Team" to="/team" />
      <Rout Icon={FiPaperclip} title="Invoices" to="/invoices" />
      <Rout Icon={FiLink} title="Interactions" to="/interactions" />
      <Rout Icon={FiFolderMinus} title="Folders Index" to="/folders" />
      <Rout Icon={FiRss} title="Internet Work" to="/internet" />
      <Rout Icon={FiSettings} title="Services" to="/services" />
    </div>
  );
}

export default RouteSelect;
