const MODALIDADE = document.getElementById('ip_modalidade');
const DATA_EMPRESTIMO = document.getElementById('ip_data');
const submitButton = document.getElementById('submitButton');

MODALIDADE.addEventListener('change', mudar_modalidade);
DATA_EMPRESTIMO.addEventListener('blur', mudar_modalidade);
MODALIDADE.addEventListener('blur', mudar_modalidade);
DATA_EMPRESTIMO.addEventListener('change', mudar_modalidade);


document.addEventListener('DOMContentLoaded', () => {
    const TAXA_MENSAL_CONTRATUAL = document.getElementById('ip_taxa_mensal_contratual');
    const TAXA_ANUAL_CONTRATUAL = document.getElementById('ip_taxa_anual_contratual');

    if (TAXA_MENSAL_CONTRATUAL && TAXA_ANUAL_CONTRATUAL) {
        TAXA_MENSAL_CONTRATUAL.addEventListener('blur', () => {
            const taxaMensal = TAXA_MENSAL_CONTRATUAL.value;
            const taxaAnual = calcularTaxaAnualContratual(taxaMensal);
            TAXA_ANUAL_CONTRATUAL.value = taxaAnual;
        });
    } else {
        console.error("Elementos necessários não foram encontrados na página.");
    }

    function calcularTaxaAnualContratual(taxaMensal) {
        const taxaMensalFloat = parseFloatSeparator(taxaMensal);
        if (isNaN(taxaMensalFloat)) {
            alert('Por favor, insira um valor válido para a taxa mensal contratual.');
            return '';
        }
        return ((((1 + (taxaMensalFloat / 100)) ** 12) - 1) * 100).toFixed(2);
    }

    function parseFloatSeparator(str) {
        if (!str) return 0;
        // Substituir a vírgula decimal por ponto
        str = str.replace(',', '.');
        return parseFloat(str);
    }
});

// Função que cria o botão de impressão
function adicionarBotaoImprimir() {
    return `<button class="btn-imprimir" onclick="imprimirSemReiniciar(event)" style="
        background-color: #006400;  /* Verde escuro */
        color: white;               /* Texto branco */
        font-weight: bold;          /* Negrito */
        font-size: 0.8rem;          /* Fonte pequena */
        border: none;               /* Sem borda */
        padding: 5px 10px;          /* Espaçamento interno */
        margin-top: 10px;           /* Espaçamento superior */
        border-radius: 5px;         /* Borda arredondada */
        cursor: pointer;            /* Cursor de mão */
    ">
    GERAR RELATÓRIO (IMPRIMIR / SALVAR COMO PDF)
    </button>`;
}

function imprimirSemReiniciar(event) {
    event.preventDefault(); // Evita o comportamento padrão do botão (reiniciar o formulário)
    window.print(); // Aciona a impressão
}




// function mudar_modalidade(component){
//     const TAXA_MENSAL_BACEN = document.getElementById('ip_taxa_mensal_bacen');
//     const TAXA_ANUAL_BACEN = document.getElementById('ip_taxa_anual_bacen');
//     const TAXA_ANUAL_BACEN_LIMIT50 = document.getElementById('ip_taxa_anual_bacen_limit50');
//     const TAXA_MENSAL_BACEN_LIMIT50 = document.getElementById('ip_taxa_mensal_bacen_limit50');
//     let data_para_busca = `${DATA_EMPRESTIMO.value}-01`.split('-');
//     data_para_busca = new Date(data_para_busca[0], data_para_busca[1] - 1, data_para_busca[2]).toLocaleDateString('pt-Br');

//     fetch(`https://api.bcb.gov.br/dados/serie/bcdata.sgs.${component.target.value}/dados?formato=json`)
//     .then(response=> response.json())
//     .then(data=>{
//         let filtered_data = data.filter(row=> row.data === data_para_busca)[0];
//         TAXA_MENSAL_BACEN.value = filtered_data.valor;
//         TAXA_ANUAL_BACEN.value = ((((1 + (filtered_data.valor/100))**12)-1)*100).toFixed(2);
//         TAXA_MENSAL_BACEN_LIMIT50.value = (filtered_data.valor*1.5).toFixed(2);
//         TAXA_ANUAL_BACEN_LIMIT50.value = ((((1 + (filtered_data.valor/100))**12)-1)*100*1.5).toFixed(2);

        
//     })
//     .catch(err=>{
//         alert(`Valor de Taxa Mensal Não encontrado para a Data ${data_para_busca} de Modalidade ${MODALIDADE.innerText}`)
//     })
// }

async function mudar_modalidade(event) {
    const TAXA_MENSAL_BACEN = document.getElementById('ip_taxa_mensal_bacen');
    const TAXA_ANUAL_BACEN = document.getElementById('ip_taxa_anual_bacen');
    const TAXA_ANUAL_BACEN_LIMIT50 = document.getElementById('ip_taxa_anual_bacen_limit50');
    const TAXA_MENSAL_BACEN_LIMIT50 = document.getElementById('ip_taxa_mensal_bacen_limit50');
    const TAXA_ANUAL_BACEN_LIMIT30 = document.getElementById('ip_taxa_anual_bacen_limit30');
    const TAXA_MENSAL_BACEN_LIMIT30 = document.getElementById('ip_taxa_mensal_bacen_limit30');
    const MODALIDADE = event.target;

    if (MODALIDADE.value === "nihil") {
        return;  // Sai da função sem fazer nada
    }

    let data_para_busca = `${DATA_EMPRESTIMO.value}-01`.split('-');
    data_para_busca = new Date(data_para_busca[0], data_para_busca[1] - 1, data_para_busca[2]).toLocaleDateString('pt-BR');

    try {
        const response = await fetch(`https://api.bcb.gov.br/dados/serie/bcdata.sgs.${MODALIDADE.value}/dados?formato=json`);
        const data = await response.json();
        const filtered_data = data.filter(row => row.data === data_para_busca)[0];

        if (filtered_data) {
            // Atualizando os campos de taxas médias e limites
            const valorTaxaMensal = filtered_data.valor;
            
            TAXA_MENSAL_BACEN.value = valorTaxaMensal;
            TAXA_ANUAL_BACEN.value = ((((1 + (valorTaxaMensal / 100)) ** 12) - 1) * 100).toFixed(2);
            
            // Cálculo dos limites de 50% e 30%
            TAXA_MENSAL_BACEN_LIMIT50.value = (valorTaxaMensal * 1.5).toFixed(2);
            TAXA_ANUAL_BACEN_LIMIT50.value = ((((1 + (valorTaxaMensal / 100)) ** 12) - 1) * 100 * 1.5).toFixed(2);
            
            TAXA_MENSAL_BACEN_LIMIT30.value = (valorTaxaMensal * 1.3).toFixed(2);
            TAXA_ANUAL_BACEN_LIMIT30.value = ((((1 + (valorTaxaMensal / 100)) ** 12) - 1) * 100 * 1.3).toFixed(2);
        } else {
            console.error(`Valor de Taxa Mensal Não encontrado para a Data ${data_para_busca} de Modalidade ${MODALIDADE.value}`);
        }
    } catch (err) {
        console.log(`Erro ao buscar dados da modalidade: ${err.message}`);
    }
}


function parseFloatSeparator(str, sep) {
    if (!str)
        return parseFloat(0)
    return parseFloat(str.replace(sep, '').replaceAll('.','').replaceAll(',','.'));
}

document.addEventListener('DOMContentLoaded', () => {
    const TAXA_MENSAL_CONTRATUAL = document.getElementById('ip_taxa_mensal_contratual');
    const TAXA_MENSAL_BACEN = document.getElementById('ip_taxa_mensal_bacen');
    const CONCLUS = document.getElementById('conclus');
    const TLDR = document.getElementById('tldr');
    
    if (TAXA_MENSAL_CONTRATUAL) {
        TAXA_MENSAL_CONTRATUAL.addEventListener('change', compararTaxas);
 }
    
 function formatarNumeroComVirgula(numero) {
    return numero.toString().replace('.', ',');
}
    function compararTaxas() {
        const taxaMensalContratual = parseFloatSeparator(TAXA_MENSAL_CONTRATUAL.value);
        const taxaMensalBacen = parseFloatSeparator(TAXA_MENSAL_BACEN.value);
        const taxaMensalBacenLimit50 = (taxaMensalBacen * 1.5).toFixed(2);
        const taxaMensalBacenLimit30 = (taxaMensalBacen * 1.3).toFixed(2);
    
        if (isNaN(taxaMensalContratual) || isNaN(taxaMensalBacen)) {
            CONCLUS.value = 'Por favor, insira valores válidos para as taxas.';
            TLDR.value = '';
            return;
        }
    
        if (taxaMensalContratual > taxaMensalBacenLimit50) {
            CONCLUS.innerHTML = `Veja-se que a taxa de juros contratual (${formatarNumeroComVirgula(taxaMensalContratual)}% a.m.) é superior a ${formatarNumeroComVirgula(taxaMensalBacenLimit50)}% a.m., valor equivalente a 1,5x (uma vez e meia) o valor da taxa média de juros para o período da contratação, conforme apurado pelo BACEN (${formatarNumeroComVirgula(taxaMensalBacen)}%). Assim, é manifesta a abusividade dos juros praticados e é sugerido buscar atendimento para ação revisional, conforme entendimento jurisprudencial consolidado sobre o tema.` + adicionarBotaoImprimir();
            TLDR.value = 'SIM, OS JUROS CONTRATUAIS DO SEU CONTRATO SÃO ABUSIVOS.';
        } else if (taxaMensalContratual > taxaMensalBacenLimit30 && taxaMensalContratual <= taxaMensalBacenLimit50) {
            CONCLUS.innerHTML = `Verifica-se que a taxa de juros contratual (${formatarNumeroComVirgula(taxaMensalContratual)}% a.m.) é superior a ${formatarNumeroComVirgula(taxaMensalBacenLimit30)}% a.m., valor equivalente à margem tolerável de 30% sobre a taxa média de juros para o período da contratação, conforme apurado pelo BACEN (${formatarNumeroComVirgula(taxaMensalBacen)}% a.m.), mas não é superior à margem de 50% (que seria de ${formatarNumeroComVirgula(taxaMensalBacenLimit50)}% a.m.). A constatação de abusividade fica dependente de interpretação jurídica e da oscilação jurisprudencial a respeito de ser tolerável a margem de abusividade considerada como 30% ou de 50% sobre a taxa média. Procure assistência jurídica para analisar a viabilidade de ação revisional.` + adicionarBotaoImprimir();
            TLDR.value = 'A CONSTATAÇÃO DA ABUSIVIDADE ESTÁ NUMA ZONA CINZENTA...';
        } else if (taxaMensalContratual <= taxaMensalBacenLimit30 && taxaMensalContratual >= taxaMensalBacen) {
            CONCLUS.innerHTML = `Verifica-se que a taxa contratual (${formatarNumeroComVirgula(taxaMensalContratual)}% a.m.) até é superior à taxa média apurada pelo BACEN (${formatarNumeroComVirgula(taxaMensalBacen)}% a.m.), porém sem sequer exceder a margem tolerável de 30% (equivalente a ${formatarNumeroComVirgula(taxaMensalBacenLimit30)}% a.m.), pelo que não pode ser considerada abusiva, conforme entendimento jurisprudencial predominante.` + adicionarBotaoImprimir();
            TLDR.value = 'NÃO, NÃO HÁ JUROS ABUSIVOS NO SEU CONTRATO.';
        } else if (taxaMensalContratual < taxaMensalBacen) {
            CONCLUS.innerHTML = `Verifica-se que a taxa mensal contratual praticada (${formatarNumeroComVirgula(taxaMensalContratual)}% a.m.) chega a ser inclusive INFERIOR à taxa média do BACEN para idêntico produto financeiro (${formatarNumeroComVirgula(taxaMensalBacen)}% a.m.). Ou seja, não há qualquer possibilidade de se considerarem abusivos os juros praticados, portanto, se não houver outras situações jurídicas complicadas, fique atento à ação de golpistas que prometam soluções milagrosas envolvendo revisão de juros.` + adicionarBotaoImprimir();
            TLDR.value = 'NÃO, NÃO HÁ JUROS ABUSIVOS NO SEU CONTRATO. NÃO MESMO!';
        }
   }
    
    // Adicionando uma checagem temporal a cada 4 segundos
    setInterval(() => {
        mudar_modalidade();  // Chamando a função sem evento específico
    }, 1000);  // Tempo de 4 segundos (4000 ms)


    function parseFloatSeparator(str) {
        if (!str) return 0;
        // Substituir a vírgula decimal por ponto
        str = str.replace(',', '.');
        return parseFloat(str);
    }
});
