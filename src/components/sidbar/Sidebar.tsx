import AccountTaggle from "./AccountTaggle";
import RouteSelect from "./RouteSelect";

function Sidbar() {
  return (
    <div className="sticky top-4 h-[calc(100vh-32px-48px)] border-collapse">
      <AccountTaggle />
      <RouteSelect />
    </div>
  );
}

export default Sidbar;
