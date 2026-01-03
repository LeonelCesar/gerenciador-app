export type Factura = {
  id: number;
  client: string;
  total: number;
  status: "paid" | "pending" | "late";
  date: string;
   internalId?: string;
};

let facturas: Factura[] = [
  {
    id: 1,
    client: "Leonel Helder da Costa César",
    total: 1250.5,
    status: "paid",
    date: "2024-12-01",
    internalId: "INV-001"
  },
  {
    id: 2,
    client: "Alberto da Costa César",
    total: 980.0,
    status: "pending",
    date: "2024-12-05",
    internalId: "INV-002"
  },
  {
    id: 3,
    client: "Adão Domingos Gonsalves Costa",
    total: 4320.75,
    status: "late",
    date: "2024-11-28",
    internalId: "INV-003"
  },
  {
    id: 4,
    client: "Eloa Maria Neves Césra",
    total: 310.2,
    status: "pending",
    date: "2024-12-03",
    internalId: "INV-004"
  },
  {
    id: 5,
    client: "Henriqueta Bengui César",
    total: 1599.99,
    status: "late",
    date: "2024-12-06",
    internalId: "INV-005"
  },
  {
    id: 6,
    client: "Elviess Rafael",
    total: 2750.0,
    status: "paid",
    date: "2024-11-20",
    internalId: "INV-006"
  },
  {
    id: 7,
    client: "Cristeen Patrick",
    total: 845.35,
    status: "pending",
    date: "2024-12-02",
    internalId: "INV-007"
  },
  {
    id: 8,
    client: "Andrade Julião",
    total: 129.9,
    status: "paid",
    date: "2024-12-07",
    internalId: "INV-008"
  },
  {
    id: 9,
    client: "António Liquine",
    total: 5600.0,
    status: "late",
    date: "2024-11-15",
    internalId: "INV-009"
  },
  {
    id: 10,
    client: "Rita da Costa César",
    total: 2300.45,
    status: "pending",
    date: "2024-12-04",
    internalId: "INV-010"
  },
  {
    id: 11,
    client: "Lanira Brito Neves",
    total: 760.0,
    status: "paid",
    date: "2024-12-08",
    internalId: "INV-011"
  },
  {
    id: 12,
    client: "Henriques Dionisio",
    total: 1890.6,
    status: "late",
    date: "2024-11-30",
    internalId: "INV-012"
  },
  {
    id: 13,
    client: "José César",
    total: 410.25,
    status: "pending",
    date: "2024-12-01",
    internalId: "INV-013"
  },
  {
    id: 14,
    client: "Rui Andrade Neto",
    total: 920.0,
    status: "late",
    date: "2024-12-09",
    internalId: "INV-014"
  },
  {
    id: 15,
    client: "Joaquim António Panhanha",
    total: 3500.0,
    status: "paid",
    date: "2024-11-18",
    internalId: "INV-015"
  },
  {
    id: 16,
    client: "Giza Rodrigues",
    total: 670.8,
    status: "pending",
    date: "2024-12-10",
    internalId: "INV-016"
  },
  {
    id: 17,
    client: "Juliana Clara",
    total: 1480.0,
    status: "late",
    date: "2024-12-11",
    internalId: "INV-017"
  },
  {
    id: 18,
    client: "José Maria Neto",
    total: 999.99,
    status: "paid",
    date: "2024-12-12",
    internalId: "INV-018"
  }
];

export function getFacturas() {
  return [...facturas];
}

export function getFactura(id: number) {
  return facturas.find((f) => f.id === id);
}

export function addFactura(f: Factura) {
  facturas.push(f);
}

export function updateFactura(id: number, data: Partial<Factura>) {
  const index = facturas.findIndex((f) => f.id === id);
  if (index === -1) return null;

  facturas[index] = { ...facturas[index], ...data };
  return facturas[index];
}

export function deleteFactura(id: number) {
  facturas = facturas.filter((f) => f.id !== id);
}
