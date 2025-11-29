# Documentação do Projeto - Enterprise Level

Este documento fornece um guia completo para desenvolvimento, arquitetura, padrões, testes, guidelines e diagramas do projeto.

---

## 1. Visão Geral do Projeto

Aplicação Front-End React avançada, focada em gestão de dados, com interface moderna, responsiva e altamente performática. O sistema permite manipulação de tabelas, filtros, modais e operações CRUD simuladas, pronto para integração com APIs reais.

## 2. Stack Tecnológica

* **React 18+** com hooks e Context API/Zustand
* **TypeScript** para tipagem estática
* **TailwindCSS** para estilização
* **Framer Motion** para animações
* **React Icons** para iconografia
* **Vite / CRA** como bundler
* **SWR / Axios** para chamadas a APIs
* **Jest / Vitest + React Testing Library** para testes

## 3. Arquitetura

### 3.1 Estrutura de Pastas

```
src/
  components/          # Componentes reutilizáveis
    Header/
    Modal/
    Table/
    Filters/
  pages/               # Páginas da aplicação
    Dashboard/
    Invoices/
  hooks/               # Hooks customizados
  context/             # Estados globais Context API
  store/               # Store global (Zustand/Redux)
  utils/               # Funções utilitárias
  types/               # Tipos TypeScript
  services/            # Chamadas a APIs / simuladores de backend
  assets/              # Imagens, fontes, ícones
```

### 3.2 Componentização

* **Atomic Design**: componentes pequenos e reutilizáveis
* **Separation of Concerns**: lógica separada em hooks e serviços
* **Reatividade**: estados locais + globais bem definidos

### 3.3 Fluxo de Dados

* Dados simulados via `services/facturas.ts`
* Uso de `SWR` para cache, revalidação e simulação de API
* Hooks de filtro, pesquisa e ordenação encapsulados para reuso

### 3.4 Diagramas

#### 3.4.1 Diagrama de Componentes

```
Page(Dashboard)
 ├─ Header
 ├─ Filters
 ├─ Table
 │   └─ TableRow (motion.tr)
 └─ Modal (Portal)
```

#### 3.4.2 Diagrama de Fluxo de Dados

```
User Action --> State (useState / Context / Store) --> SWR/Service --> Componentes renderizam
```

## 4. Padrões de Desenvolvimento

* **Functional Components** + Hooks
* **Props tipadas** via TypeScript
* **Reusable Hooks**: `useFilter`, `usePagination`, `useEditInline`
* **Modal via Portal** para cobertura de toda a tela
* **Tailwind Utility Classes** consistentes
* **Framer Motion** para animações suaves
* **Opacidade e z-index centralizados** para modais e overlays

## 5. Guidelines de Código

* Nomes semânticos e consistentes (`camelCase` para variáveis, `PascalCase` para componentes)
* Componentes pequenos (<150 linhas de código)
* Separar lógica de UI e dados
* Documentar tipos, props e hooks
* Testes unitários obrigatórios para lógica crítica

## 6. Testes

* **Jest / Vitest + React Testing Library**
* Cobertura mínima de 80% para componentes críticos
* Exemplos:

```ts
import { render, screen } from '@testing-library/react';
import Facturas from '../pages/Invoices';

test('renderiza header da tabela', () => {
  render(<Facturas />);
  expect(screen.getByText('Facturas')).toBeInTheDocument();
});
```

## 7. Documentação de APIs Simuladas

* `getFacturas()`: retorna todas as facturas
* `getFactura(id)`: retorna factura específica
* `addFactura(f)`: adiciona nova factura
* `updateFactura(id, data)`: atualiza factura existente
* `deleteFactura(id)`: remove factura

## 8. Boas Práticas Profissionais

* Separação de UI e lógica de negócio
* Componentes pequenos e reutilizáveis
* Hooks customizados para lógica repetitiva
* Modal com portal para cobertura total da tela
* Tailwind para consistência visual e responsividade
* Framer Motion para animações elegantes e suaves
* Testes unitários para todos os componentes críticos
* Documentação contínua para novos desenvolvedores

## 9. Deploy

* Netlify / Vercel / GitHub Pages
* Scripts de build:

```bash
npm run build
npm run preview
```

## 10. Roadmap

* Implementação de dark mode
* Testes end-to-end (Cypress)
* Performance optimizations (lazy loading, memoization)
* Internacionalização (i18n)
* Documentação visual interativa

## 11. Licença

Adicionar tipo de licença (MIT, GPL, etc.)

---

Este documento deve servir como referência full enterprise para desenvolvimento, manutenção e expansão do projeto.

