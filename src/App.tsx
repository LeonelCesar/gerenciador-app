/* import Dashboard from "./components/dashboar/Dashboar";  */
import { BrowserRouter } from "react-router-dom";
import Sidbar from "./components/sidbar/Sidebar";

import AppRouter from "./router/AppRouter";
import TopBar from "./components/dashboar/TopBar";

function App() {
  return (
    <BrowserRouter>
      <main className="bg-stone-100 text-stone-950 font-sans grid gap-4 p-4 grid-cols-[220px,_1fr]">
        <Sidbar />

        <div className="p-4 rounded-lg shadow">
          {/*  <Dashboard />  */}
          <header>
            <TopBar />
          </header>

          <AppRouter />
        </div>
      </main>
    </BrowserRouter>
  );
}

export default App;
