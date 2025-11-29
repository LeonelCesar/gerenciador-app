export type Factura = {
  id: string;
  client: string;
  total: number;
  status: "paid" | "pending" | "late";
  date: string;
   internalId?: string;
};

let facturas: Factura[] = [
  {
    id: "F001",
    client: "Rita da Costa César",
    total: 140,
    status: "pending",
    date: "2024-02-10",
  },
    {
    id: "F002",
    client: "José César",
    total: 12,
    status: "paid",
    date: "1985-02-19",
  },
    {
    id: "F003",
    client: "Lanira Reis Brito Neves",
    total: 160,
    status: "late",
    date: "2024-02-10",
  },
  {
    id: "F004",
    client: "Elviess Rafael",
    total: 40,
    status: "pending",
    date: "2024-02-13",
  },
  {
    id: "F005",
    client: "Cristeean Patrick",
    total: 210,
    status: "pending",
    date: "2023-12-01",
  },
    {
    id: "F006",
    client: "Adão Domingos Gonçalves Costa",
    total: 300,
    status: "late",
    date: "2020-01-23",
  },
    {
    id: "F007",
    client: "Henriqueta Bengui César",
    total: 20,
    status: "paid",
    date: "2017-09-01",
  },
    {
    id: "F008",
    client: "Leonel Helder",
    total: 470,
    status: "late",
    date: "2012-03-23",
  },
    {
    id: "F009",
    client: "Eloa Maria Neves César",
    total: 210,
    status: "pending",
    date: "2025-07-18",
  },
    {
    id: "F0010",
    client: "Liquine César",
    total: 10,
    status: "paid",
    date: "2084-06-17",
  },
    {
    id: "F0011",
    client: "Henriques Dionisio César",
    total: 450,
    status: "late",
    date: "2024-02-10",
  },
];

export function getFacturas() {
  return facturas;
}

export function getFactura(id: string) {
  return facturas.find((f) => f.id === id);
}

export function addFactura(f: Factura) {
  facturas.push(f);
}

export function updateFactura(id: string, data: Partial<Factura>) {
  const index = facturas.findIndex((f) => f.id === id);
  if (index === -1) return null;

  facturas[index] = { ...facturas[index], ...data };
  return facturas[index];
}

export function deleteFactura(id: string) {
  facturas = facturas.filter((f) => f.id !== id);
}
