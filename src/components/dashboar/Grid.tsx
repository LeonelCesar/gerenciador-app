import ActivityGraph from "./ActivityGraph";
import RecentTransactions from "./RecentTransactions";
import { StartCard } from "./StartCard";
import UsageRadaGraph from "./UsageRadarGraph";

function Grid() {
  return <div className="px-4 grid gap-3 grid-cols-12">
    <StartCard />
    <ActivityGraph />
    <UsageRadaGraph />
    <RecentTransactions />
  </div>
}

export default Grid;
