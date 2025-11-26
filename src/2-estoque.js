import fs from 'fs';
import { randomUUID } from 'node:crypto';

const dataPath = new URL('../data/estoque.json', import.meta.url);

class GerenciadorEstoque {
  constructor() {
    this.produtos = new Map();
    this.carregarDados();
  }

  carregarDados() {
    try {
      const rawData = fs.readFileSync(dataPath, 'utf-8');
      const dados = JSON.parse(rawData);
      
      if (!dados.estoque || !Array.isArray(dados.estoque)) {
        throw new Error("JSON inválido: propriedade 'estoque' deve ser um array.");
      }

      for (const item of dados.estoque) {
        this.produtos.set(item.codigoProduto, { ...item });
      }

    } catch (error) {
      console.error('Erro fatal:', error.message);
      process.exit(1);
    }
  }

  salvarDados() {
    try {
      const arrayAtualizado = Array.from(this.produtos.values());
      const objetoParaSalvar = { estoque: arrayAtualizado };
      const jsonString = JSON.stringify(objetoParaSalvar, null, 2);
      fs.writeFileSync(dataPath, jsonString);
    } catch (error) {
      console.error('ERRO CRÍTICO AO SALVAR:', error.message);
    }
  }

  movimentar(id, quantidade, descricao) {
    const produto = this.produtos.get(id);

    if (!produto) return { erro: `Produto ID ${id} não encontrado.` };
    
    const novoSaldo = produto.estoque + quantidade;
    if (quantidade < 0 && novoSaldo < 0) {
      return { 
        erro: `Saldo insuficiente para '${produto.descricaoProduto}'. Atual: ${produto.estoque}, Tentativa: ${quantidade}` 
      };
    }

    produto.estoque = novoSaldo;
    this.produtos.set(id, produto);
    this.salvarDados();

    return {
      idTransacao: randomUUID(),
      descricao,
      codigoProduto: id,
      produto: produto.descricaoProduto,
      qtdeMovimentada: quantidade,
      saldoFinal: novoSaldo
    };
  }
}


function exibirReciboFormatado(dados) {
  const wId = 12;
  const wTipo = 10;
  const wProd = 28;
  const wMov = 12;
  const wSaldo = 10;

  const idCurto = dados.idTransacao.split('-')[0]; 
  const tipoTransacao = dados.qtdeMovimentada > 0 ? "ENTRADA" : "SAÍDA";
  const movimentoStr = dados.qtdeMovimentada > 0 ? `+${dados.qtdeMovimentada}` : `${dados.qtdeMovimentada}`;
  const linha = '='.repeat(wId + wTipo + wProd + wMov + wSaldo + 13);

  console.log(linha);
  console.log(
    `| ${'ID'.padEnd(wId)} | ${'Tipo'.padEnd(wTipo)} | ${'Produto'.padEnd(wProd)} | ${'Movimento'.padStart(wMov)} | ${'Saldo'.padStart(wSaldo)} |`
  );
  console.log(linha);

  console.log(
    `| ${idCurto.padEnd(wId)} | ${tipoTransacao.padEnd(wTipo)} | ${dados.produto.padEnd(wProd)} | ${movimentoStr.padStart(wMov)} | ${dados.saldoFinal.toString().padStart(wSaldo)} |`
  );
  
  console.log(linha);
}


const estoque = new GerenciadorEstoque();

console.log('\n--- Controle de Estoque ---\n');

function processar(id, qtde, desc) {
  const resultado = estoque.movimentar(id, qtde, desc);
  
  if (resultado.erro) {
    console.log(`❌ ERRO: ${resultado.erro}\n`);
  } else {
    exibirReciboFormatado(resultado);
  }
}

// Testes
processar(101, 50, 'Entrada Fornecedor A');
processar(102, -5, 'Venda Cliente Balcão');