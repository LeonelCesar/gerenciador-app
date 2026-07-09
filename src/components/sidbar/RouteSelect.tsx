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
      {/* <Rout Icon={FiSettings} title="Services" to="/services" />
      <Rout Icon={FiRss} title="Internet Work" to="/internet" /> */}
    </div>
  );
}

export default RouteSelect;
