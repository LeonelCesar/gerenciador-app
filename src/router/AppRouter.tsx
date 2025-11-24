import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../components/dashboar/Dashboar";
import FolderIndex from "../page/folderIndex/page";
import Interactions from "../page/interactions/page";
import Team from "../page/team/page";
import Invoices from "../page/invoices/page";
import InternetWork from "../page/internetWork/page";
import Services from "../page/services/page";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />;
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/team" element={<Team />} />;
      <Route path="/folders" element={<FolderIndex />} />;
      <Route path="/invoices" element={<Invoices />} />;
      <Route path="/team" element={<Team />} />
      <Route path="/interactions" element={<Interactions />} />
      <Route path="/services" element={<Services />} />
      <Route path="/internet" element={<InternetWork />} />;
      <Route path="*" element={<div>Página não encontrada</div>} />
    </Routes>
  );
}

export default AppRouter;
