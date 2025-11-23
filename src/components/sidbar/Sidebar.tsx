import AccountTaggle from "./AccountTaggle";
import Search from "./Search";
import RouteSelect from "./RouteSelect";

function Sidbar() {
  return (
    <div>
      <div className="sticky top-4 h-[calc(100vh-32px-48px)]">
        <AccountTaggle />
        <Search />
        <RouteSelect />
      </div>
    </div>
  );
}

export default Sidbar;
