import { FiArrowUpRight, FiDollarSign, FiMoreHorizontal } from "react-icons/fi";

const TableHeader = () => {
  return (
    <tr className="text-sm font-bold text-stone-500">
      <th className="text-start p-1.5">Customer ID</th>
      <th className="text-start p-1.5">SKU</th>
      <th className="text-start p-1.5">Data</th>
      <th className="text-start p-1.5">Price</th>
      <th className="w-8"></th>
    </tr>
  );
};

const TableRow = ({
  custId,
  sku,
  data,
  price,
  order,
}: {
  custId: string;
  sku: string;
  data: string;
  price: string;
  order: number;
}) => {
  return (
    <tr className={order % 1 ? "bg-stone-100 text-sm" : "text-sm"}>
      <td className="p-1.5">
        <a href="#" className="text-violet-600 underline flex items-center gap-1">
          {custId}
          <FiArrowUpRight />
        </a>
      </td>
      <td className="p-1.5">{sku}</td>
      <td className="p-1.5">{data}</td>
      <td className="p-1.5">{sku}</td>
      <td className="w-8"></td>
      <button className="hover:bg-stone-200 transition-colors grid place-content-center rounded text-sm size-8">
        <FiMoreHorizontal />
      </button>
    </tr>
  );
};

function RecentTransactions() {
  return (
    <div className="col-span-12 p-4 rounded border border-stone-300">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5">
          <FiDollarSign />
          Recent Transactions
        </h3>
        <button className="text-sm text-violet-500 hover:underline">
          See All
        </button>
      </div>

      <table className="w-full table-auto">
        <TableHeader />

        <tbody>
          <TableRow
            custId="#48149"
            sku="Pro 1 Month"
            data="Dez 3nd"
            price="$9.75"
            order={2}
          />
          <TableRow
            custId="#1942s"
            sku="Pro 4 Month"
            data="Aug 2nd"
            price="$3.12"
            order={1}
          />
          <TableRow
            custId="#4192"
            sku="Pro 4 Month"
            data="Jul 1nd"
            price="$2.15"
            order={3}
          />
          <TableRow
            custId="#11330032"
            sku="Pro 1 Month"
            data="Sep 6nd"
            price="$5.75"
            order={1}
          />
          <TableRow
            custId="#99481"
            sku="Pro 8 Month"
            data="MarCh 9nd"
            price="$4.56"
            order={2}
          />
        </tbody>
      </table>
    </div>
  );
}

export default RecentTransactions;
