# Desafio de Lógica de Negócios (Vendas, Estoque e Financeiro)

Este repositório contém as soluções para um conjunto de desafios técnicos focados em implementação de regras de negócio, manipulação de dados e performance.

O projeto foi desenvolvido utilizando **JavaScript Moderno (ES Modules)** e **Node.js**, com foco em **escalabilidade**, **código limpo** e **performance**.

---

## 📋 Sobre os Desafios

O projeto está dividido em três módulos independentes, cada um resolvendo um problema específico de negócio:

### 1. Sistema de Comissões (`src/1-comissao.js`)
Processa um histórico de vendas e calcula a comissão final de cada vendedor baseado em faixas de valores progressivas.
* **Regras:**
    * Vendas abaixo de R$ 100,00: Sem comissão.
    * Entre R$ 100,00 e R$ 499,99: 1% de comissão.
    * Acima de R$ 500,00: 5% de comissão.
* **Destaque Técnico:** Algoritmo de passagem única ($O(N)$) utilizando `Map` para agregação, garantindo performance mesmo com grandes volumes de dados. Visualização formatada em tabela sem aspas.

### 2. Gestão de Estoque Persistente (`src/2-estoque.js`)
Sistema de controle de inventário que permite entradas e saídas de mercadorias.
* **Funcionalidades:**
    * Validação de saldo (impede estoque negativo).
    * Geração de IDs de transação únicos (`UUID`).
    * **Persistência:** As alterações são salvas automaticamente no arquivo `data/estoque.json`.
* **Destaque Técnico:** Arquitetura desacoplada separando dados da lógica. Uso de `Map` para acesso aos produtos em tempo constante ($O(1)$).

### 3. Cálculo de Juros e Multas (`src/3-juros.js`)
Módulo financeiro para cálculo de boletos em atraso.
* **Regras:** Taxa de juros simples de 2,5% ao dia corrido.
* **Destaque Técnico:** Normalização de datas (UTC/Zero-hour) para garantir precisão no cálculo de dias, aceitando processamento em lote (bulk).

---

## 🛠️ Tecnologias e Ferramentas

* **Runtime:** Node.js
* **Linguagem:** JavaScript (ES6+ / ES Modules)
* **Qualidade de Código:** ESLint (Google Standards + Node)
* **Formatação:** Prettier
* **Versionamento:** Git & GitHub

---

## ⚙️ Instalação e Configuração

Pré-requisito: Tenha o [Node.js](https://nodejs.org/) instalado.

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/thipereira02/desafio-target
    cd nome-do-repo
    ```

2.  **Instale as dependências** (necessário para o ESLint/Prettier):
    ```bash
    npm install
    ```

---

## 🚀 Como Executar

Cada desafio pode ser executado individualmente via terminal:

### Desafio 1: Relatório de Comissões
Lê os dados de `data/vendas.json` e exibe o relatório formatado.
```bash
node src/1-comissao.js
```

### Desafio 2: Controle de Estoque
Executa movimentações de teste e atualiza o arquivo `data/estoque.json`.
```bash
node src/2-estoque.js
```

### Desafio 3: Calculadora de Juros
Simula o processamento de uma lista de boletos com diferentes datas de vencimento.
```bash
node src/3-juros.js
```

---

## ✅ Qualidade de Código (Linting & Formatting)

O projeto segue padrões estritos de código para garantir legibilidade e evitar erros.

* **Verificar erros (Lint):**
```
npm run lint
```

* **Corrigir formatação automaticamente (Prettier):**
```
npm run format
```

## 📂 Estrutura do Projeto

## 📂 Estrutura do Projeto

```text
.
├── data/               # "Banco de dados" (Arquivos JSON)
│   ├── estoque.json    # Dados persistentes do desafio 2
│   └── vendas.json     # Massa de dados do desafio 1
├── src/                # Lógica da Aplicação
│   ├── 1-comissao.js   # Lógica de comissões
│   ├── 2-estoque.js    # Lógica de estoque
│   └── 3-juros.js      # Lógica financeira
├── .gitignore          # Arquivos ignorados pelo Git
├── eslint.config.js    # Configuração de Linter
├── package.json        # Dependências e Scripts
└── README.md           # Documentação