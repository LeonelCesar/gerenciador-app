import { BrowserRouter } from "react-router-dom";
import Sidbar from "./components/sidbar/Sidebar";

import AppRouter from "./router/AppRouter";
import Header from "./components/Header/header";

function App() {
  return (
    <BrowserRouter>
      <main className="bg-stone-100 text-stone-400 font-sans grid  gap-8 pl-2  grid-cols-[220px,_1fr] ">
        <Sidbar />

        <div className="">
          <Header />
          <AppRouter />
        </div>
      </main>
    </BrowserRouter>
  );
}

export default App;
