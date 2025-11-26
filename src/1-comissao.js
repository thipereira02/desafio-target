import fs from 'fs';

const dataPath = new URL('../data/vendas.json', import.meta.url);

const formatadorMoney = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function calcularValorComissao(valorVenda) {
  if (valorVenda >= 500) return valorVenda * 0.05;
  if (valorVenda >= 100) return valorVenda * 0.01;
  return 0;
}

function processarComissoes(listaVendas) {
  const mapaVendedores = new Map();

  for (const venda of listaVendas) {
    const comissao = calcularValorComissao(venda.valor);

    const dadosAtuais = mapaVendedores.get(venda.vendedor) || {
      totalVendas: 0,
      totalComissao: 0,
    };

    dadosAtuais.totalVendas += venda.valor;
    dadosAtuais.totalComissao += comissao;

    mapaVendedores.set(venda.vendedor, dadosAtuais);
  }

  const relatorioFinal = [];
  mapaVendedores.forEach((dados, vendedor) => {
    relatorioFinal.push({
      vendedor: vendedor,
      totalVendas: formatadorMoney.format(dados.totalVendas),
      comissao: formatadorMoney.format(dados.totalComissao),
    });
  });

  return relatorioFinal;
}

function exibirTabela(dados) {
  const wNome = 20;
  const wValor = 15;

  // Cabeçalho
  console.log('='.repeat(58));
  console.log(
    `| ${'Vendedor'.padEnd(wNome)} | ${'Total Vendas'.padStart(wValor)} | ${'Comissão'.padStart(wValor)} |`
  );
  console.log('='.repeat(58));

  dados.forEach((item) => {
    console.log(
      `| ${item.vendedor.padEnd(wNome)} | ${item.totalVendas.padStart(wValor)} | ${item.comissao.padStart(wValor)} |`
    );
  });
  console.log('='.repeat(58));
}

try {
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const dados = JSON.parse(rawData);

  if (!dados.vendas || !Array.isArray(dados.vendas)) {
    throw new Error('Formato de arquivo inválido.');
  }

  const relatorio = processarComissoes(dados.vendas);

  console.log('\n--- Relatório de Comissões ---');
  exibirTabela(relatorio);
} catch (error) {
  console.error('Erro:', error.message);
}
