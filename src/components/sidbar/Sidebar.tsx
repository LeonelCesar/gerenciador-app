import AccountTaggle from "./AccountTaggle";
import Search from "./Search";
import RouteSelect from "./RouteSelect"; 
/* import PlanFooter from "./PlanFooter"; */

function Sidbar() {
  return (
    <div>
      <div className="sticky top-4 h-[calc(100vh-32px-48px)]">
        <AccountTaggle />
        <Search />
        <RouteSelect />
      </div>
      {/*  <PlanFooter /> */}
    </div>
  );
}

export default Sidbar;
