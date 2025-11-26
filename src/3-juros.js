const CONFIG = {
  TAXA_DIARIA: 0.025, 
  LOCALE: 'pt-BR',
  MOEDA: 'BRL'
};

class CalculadoraBoleto {
  constructor(taxaDiaria = CONFIG.TAXA_DIARIA) {
    this.taxaDiaria = taxaDiaria;
    
    this.formatadorMoney = new Intl.NumberFormat(CONFIG.LOCALE, {
      style: 'currency',
      currency: CONFIG.MOEDA,
    });
  }
  processar(valorOriginal, dataVencimentoIso) {
    if (valorOriginal <= 0) return { erro: "Valor inválido" };

    const hoje = new Date();
    const vencimento = new Date(dataVencimentoIso);

    hoje.setHours(0, 0, 0, 0);
    vencimento.setHours(0, 0, 0, 0);

    const diffTime = hoje - vencimento;
    const diasAtraso = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diasAtraso <= 0) {
      return {
        status: "EM DIA",
        diasAtraso: 0,
        valorOriginal,
        juros: 0,
        total: valorOriginal
      };
    }

    const jurosCalculado = valorOriginal * (this.taxaDiaria * diasAtraso);
    const totalPagar = valorOriginal + jurosCalculado;

    return {
      status: "VENCIDO",
      diasAtraso,
      valorOriginal,
      juros: jurosCalculado,
      total: totalPagar
    };
  }

  
  exibirRelatorio(listaBoletos) {
    const wStatus = 10;
    const wData = 12;
    const wDias = 8;
    const wValor = 14;
    const wJuros = 14;
    const wTotal = 14;

    const linha = '='.repeat(wStatus + wData + wDias + wValor + wJuros + wTotal + 16);

    console.log(linha);
    console.log(
      `| ${'Status'.padEnd(wStatus)} | ${'Vencimento'.padEnd(wData)} | ${'Dias'.padStart(wDias)} | ${'Original'.padStart(wValor)} | ${'Juros'.padStart(wJuros)} | ${'Total'.padStart(wTotal)} |`
    );
    console.log(linha);

    listaBoletos.forEach(({ vencimento, valor }) => {
      const resultado = this.processar(valor, vencimento);

      if (resultado.erro) {
        console.log(`| ERRO: ${resultado.erro.padEnd(linha.length - 10)} |`);
        return;
      }

      const statusStr = resultado.status;
      const diasStr = resultado.diasAtraso.toString();
      const valStr = this.formatadorMoney.format(resultado.valorOriginal);
      const jurStr = this.formatadorMoney.format(resultado.juros);
      const totStr = this.formatadorMoney.format(resultado.total);
      
      const dataVisual = vencimento.split('-').reverse().join('/');

      console.log(
        `| ${statusStr.padEnd(wStatus)} | ${dataVisual.padEnd(wData)} | ${diasStr.padStart(wDias)} | ${valStr.padStart(wValor)} | ${jurStr.padStart(wJuros)} | ${totStr.padStart(wTotal)} |`
      );
    });

    console.log(linha);
  }
}

// Simulação

const calculadora = new CalculadoraBoleto();

const massaDeDados = [
  { valor: 1000.00, vencimento: '2025-10-01' }, 
  { valor: 500.50,  vencimento: new Date().toISOString().split('T')[0] }, 
  { valor: 2500.00, vencimento: '2027-12-25' }, 
  { valor: 125.90,  vencimento: '2025-01-10' }, 
];

console.log('\n--- Processamento de Boletos (Taxa: 2,5% a.d.) ---\n');
calculadora.exibirRelatorio(massaDeDados);