import Dashboard from "./components/dashboar/Dashboar";
import Sidbar from "./components/sidbar/Sidebar";

function App() {
  return (
    <main className="bg-stone-100 text-stone-950 font-sans grid gap-4 p-4 grid-cols-[220px,_1fr]">
      <Sidbar />
      <Dashboard /> 
    </main>
  );
}

export default App;
