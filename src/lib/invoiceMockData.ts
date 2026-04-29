// src/mocks/invoiceMockData.ts

// 1. TIPOS
export type InvoiceStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'multibanco' | 'creditcard' | 'transfer';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number; // quantity * unitPrice
}

export interface Client {
  id: string;
  name: string;
  taxId: string;        // NIF/NIPC
  email: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  country?: string;     // default "Portugal"
}

export interface Invoice {
  id: string;
  invoiceNumber: string;      // ex: "FT 2025/001"
  client: Client;              // objeto cliente (evita duplicação)
  issueDate: string;          // YYYY-MM-DD
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;            // ex: 23
  taxAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  paymentReference?: {
    entity: string;           // ex: "21234"
    reference: string;        // ex: "123 456 789"
  };
  paymentMethod?: PaymentMethod;
  notes?: string;
  createdAt: string;          // ISO
  updatedAt: string;
}

// 2. MOCK DE CLIENTES (reutilizável)
export const mockClients: Client[] = [
  {
    id: 'cl_001',
    name: 'Leonel Helder',
    taxId: '123456789',
    email: 'leonel.helder@email.com',
    phone: '+351 912 345 678',
    address: 'Rua das Flores, 10',
    postalCode: '1000-001',
    city: 'Lisboa',
    country: 'Portugal',
  },
  {
    id: 'cl_002',
    name: 'Lanira Neves',
    taxId: '987654321',
    email: 'lanira.neves@email.com',
    phone: '+351 923 456 789',
    address: 'Avenida da Liberdade, 200',
    postalCode: '1250-147',
    city: 'Lisboa',
  },
  {
    id: 'cl_003',
    name: 'Eloa César',
    taxId: '456123789',
    email: 'eloa.cesar@email.com',
    address: 'Rua do Comércio, 45',
    postalCode: '4000-200',
    city: 'Porto',
  },
  {
    id: 'cl_004',
    name: 'Cristeen Patrick',
    taxId: '789456123',
    email: 'cristeen@email.com',
    address: 'Largo da Misericórdia, 8',
    postalCode: '8000-123',
    city: 'Faro',
  },
  {
    id: 'cl_005',
    name: 'Elviess Rafael',
    taxId: '321654987',
    email: 'elviess.rafael@email.com',
    address: 'Travessa do Carvalho, 12',
    postalCode: '3000-000',
    city: 'Coimbra',
  },
];

// 3. ITENS MOCK
const mockItemTemplates = [
  { description: 'Licença FlowBanck - Anual', unitPrice: 299.99 },
  { description: 'Taxa de manutenção (mês)', unitPrice: 19.99 },
  { description: 'Transferência bancária', unitPrice: 1.99 },
  { description: 'Comissão de pagamento', unitPrice: 2.50 },
  { description: 'Assinatura Premium', unitPrice: 49.99 },
  { description: 'Consultoria Financeira', unitPrice: 150.00 },
  { description: 'Suporte Técnico', unitPrice: 79.99 },
  { description: 'Emissão de fatura', unitPrice: 5.00 },
];

// 4. GERADORES DE REFERÊNCIA MULTIBANCO
const generateMBReference = (): { entity: string; reference: string } => {
  const entity = '21234'; // Entidade fixa (pode ser dinâmica)
  const refNum = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
  const refFormatted = `${refNum.slice(0, 3)} ${refNum.slice(3, 6)} ${refNum.slice(6, 9)}`;
  return { entity, reference: refFormatted };
};

// 5. FUNÇÃO PARA CRIAR UMA FATURA MOCK (com dados aleatórios mas consistentes)
let invoiceCounter = 1;

export const generateMockInvoice = (client?: Client, overrides?: Partial<Invoice>): Invoice => {
  const selectedClient = client || mockClients[Math.floor(Math.random() * mockClients.length)];
  const numberOfItems = Math.floor(Math.random() * 3) + 1; // 1 a 3 itens
  const items: InvoiceItem[] = [];
  for (let i = 0; i < numberOfItems; i++) {
    const template = mockItemTemplates[Math.floor(Math.random() * mockItemTemplates.length)];
    const quantity = Math.floor(Math.random() * 4) + 1; // 1 a 4
    const unitPrice = template.unitPrice;
    const total = quantity * unitPrice;
    items.push({
      id: `item_${Date.now()}_${i}`,
      description: template.description,
      quantity,
      unitPrice,
      total,
    });
  }
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxRate = 23;
  const taxAmount = (subtotal * taxRate) / 100;
  const totalAmount = subtotal + taxAmount;

  const issueDate = new Date();
  issueDate.setDate(issueDate.getDate() - Math.floor(Math.random() * 60)); // até 60 dias atrás
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + 30);

  const statuses: InvoiceStatus[] = ['pending', 'paid', 'overdue', 'cancelled'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];

  const invoiceNumber = `FT ${new Date().getFullYear()}/${String(invoiceCounter++).padStart(3, '0')}`;

  return {
    id: `inv_${Math.random().toString(36).substring(2, 10)}`,
    invoiceNumber,
    client: selectedClient,
    issueDate: issueDate.toISOString().split('T')[0],
    dueDate: dueDate.toISOString().split('T')[0],
    items,
    subtotal,
    taxRate,
    taxAmount,
    totalAmount,
    status,
    paymentReference: generateMBReference(),
    paymentMethod: 'multibanco',
    notes: status === 'overdue' ? 'Pagamento em atraso' : undefined,
    createdAt: issueDate.toISOString(),
    updatedAt: issueDate.toISOString(),
    ...overrides,
  };
};

// 6. GERAR 50 FATURAS MOCK
export const mockInvoices: Invoice[] = Array.from({ length: 50 }).map(() => generateMockInvoice());

// 7. SERVIÇO MOCK (simula API REST)
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export interface GetInvoicesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: InvoiceStatus | 'all';
  startDate?: string;
  endDate?: string;
  clientId?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

class InvoiceMockService {
  private invoices: Invoice[] = [...mockInvoices];

  // GET com filtros, ordenação e paginação
  async getInvoices(params: GetInvoicesParams = {}): Promise<PaginatedResult<Invoice>> {
    await delay(600); // simula latência de rede

    let filtered = [...this.invoices];

    // Filtro de busca (nome do cliente, número da fatura, NIF)
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(inv =>
        inv.client.name.toLowerCase().includes(searchLower) ||
        inv.invoiceNumber.toLowerCase().includes(searchLower) ||
        inv.client.taxId.includes(searchLower)
      );
    }

    // Filtro por status
    if (params.status && params.status !== 'all') {
      filtered = filtered.filter(inv => inv.status === params.status);
    }

    // Filtro por data inicial
    if (params.startDate) {
      filtered = filtered.filter(inv => inv.issueDate >= params.startDate!);
    }

    // Filtro por data final
    if (params.endDate) {
      filtered = filtered.filter(inv => inv.issueDate <= params.endDate!);
    }

    // Filtro por cliente específico
    if (params.clientId) {
      filtered = filtered.filter(inv => inv.client.id === params.clientId);
    }

    // Ordenar por data de emissão (mais recente primeiro)
    filtered.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const start = (page - 1) * pageSize;
    const paginatedData = filtered.slice(start, start + pageSize);
    const totalPages = Math.ceil(filtered.length / pageSize);

    return {
      data: paginatedData,
      total: filtered.length,
      page,
      pageSize,
      totalPages,
    };
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    await delay(300);
    const invoice = this.invoices.find(inv => inv.id === id);
    return invoice || null;
  }

  async createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'invoiceNumber'>): Promise<Invoice> {
    await delay(800);
    const newInvoice: Invoice = {
      ...invoice,
      id: `inv_${Math.random().toString(36).substring(2, 10)}`,
      invoiceNumber: `FT ${new Date().getFullYear()}/${String(this.invoices.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.invoices.unshift(newInvoice);
    return newInvoice;
  }

  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice | null> {
    await delay(700);
    const index = this.invoices.findIndex(inv => inv.id === id);
    if (index === -1) return null;
    const updated = {
      ...this.invoices[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.invoices[index] = updated;
    return updated;
  }

  async deleteInvoice(id: string): Promise<boolean> {
    await delay(500);
    const initialLength = this.invoices.length;
    this.invoices = this.invoices.filter(inv => inv.id !== id);
    return this.invoices.length < initialLength;
  }

  // Estatísticas para dashboard
  async getStats() {
    await delay(300);
    const total = this.invoices.length;
    const totalPaid = this.invoices.filter(inv => inv.status === 'paid').length;
    const totalPending = this.invoices.filter(inv => inv.status === 'pending').length;
    const totalOverdue = this.invoices.filter(inv => inv.status === 'overdue').length;
    const totalAmount = this.invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const averageTicket = totalAmount / total;
    return {
      totalInvoices: total,
      totalPaid,
      totalPending,
      totalOverdue,
      totalAmount,
      averageTicket,
    };
  }
}

export const invoiceService = new InvoiceMockService();