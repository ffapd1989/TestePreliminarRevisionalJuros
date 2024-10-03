const MODALIDADE = document.getElementById('ip_modalidade');
const DATA_EMPRESTIMO = document.getElementById('ip_data');
const submitButton = document.getElementById('submitButton');

MODALIDADE.addEventListener('change', mudar_modalidade);
DATA_EMPRESTIMO.addEventListener('blur', mudar_modalidade);
MODALIDADE.addEventListener('blur', mudar_modalidade);
DATA_EMPRESTIMO.addEventListener('change', mudar_modalidade);


//submitButton.addEventListener('click', function(event) {
    // Chamar a função mudar_modalidade
    //mudar_modalidade();
//});


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
    const MODALIDADE = event.target;  // Adicionando a referência à modalidade
    
    // Verifica se o valor da modalidade é "nihil"
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
            TAXA_MENSAL_BACEN.value = filtered_data.valor;
            TAXA_ANUAL_BACEN.value = ((((1 + (filtered_data.valor / 100)) ** 12) - 1) * 100).toFixed(2);
            TAXA_MENSAL_BACEN_LIMIT50.value = (filtered_data.valor * 1.5).toFixed(2);
            TAXA_ANUAL_BACEN_LIMIT50.value = ((((1 + (filtered_data.valor / 100)) ** 12) - 1) * 100 * 1.5).toFixed(2);
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
    const GENERATE_PDF_BUTTON = document.getElementById('generatePDF');
    const PDF_TEMPLATE = document.getElementById('pdf-template');
    const PRINT_BUTTON = document.getElementById('printPage')

    if (TAXA_MENSAL_CONTRATUAL) {
        TAXA_MENSAL_CONTRATUAL.addEventListener('change', compararTaxas);
    }
   
    GENERATE_PDF_BUTTON.addEventListener('click', gerarPDF);
    PRINT_BUTTON.addEventListener('click', () => {
        window.print();
    });


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
            CONCLUS.value = `Veja-se que a taxa de juros contratual (${taxaMensalContratual}% a.m.) é superior a ${taxaMensalBacenLimit50}% a.m., valor equivalente a 1,5x (uma vez e meia) o valor da taxa média de juros para o período da contratação conforme apurado pelo BACEN (${taxaMensalBacen}%).`;
            TLDR.value = 'SIM, HÁ JUROS ABUSIVOS.';
        } else if (taxaMensalContratual > taxaMensalBacenLimit30 && taxaMensalContratual <= taxaMensalBacenLimit50) {
            CONCLUS.value = `Verifica-se que a taxa de juros contratual (${taxaMensalContratual}% a.m.) é superior a ${taxaMensalBacenLimit30}% a.m., valor equivalente à margem tolerável de 30% sobre a taxa média de juros (${taxaMensalBacen}% a.m.), mas não excedendo a margem de 50% (que seria de ${taxaMensalBacenLimit50}% a.m.). A constatação de abusividade fica dependente de interpretação jurídica e da oscilação jurisprudencial.`;
            TLDR.value = 'ENTENDEMOS QUE SIM, MAS...';
        } else if (taxaMensalContratual <= taxaMensalBacenLimit30 && taxaMensalContratual >= taxaMensalBacen) {
            CONCLUS.value = `Verifica-se que a taxa contratual (${taxaMensalContratual}% a.m.) até é superior à taxa média apurada pelo BACEN (${taxaMensalBacen}% a.m.), porém sem exceder a margem de 30% (equivalente a ${taxaMensalBacenLimit30}% a.m.), pelo que não pode ser considerada abusiva.`;
            TLDR.value = 'NÃO, não há juros abusivos.';
        } else if (taxaMensalContratual < taxaMensalBacen) {
            CONCLUS.value = `TAXA MENSAL CONTRATUAL (${taxaMensalContratual}% a.m.) É INFERIOR À TAXA MÉDIA DO BACEN (${taxaMensalBacen}% a.m.). NÃO HÁ JUROS ABUSIVOS.`;
            TLDR.value = 'NÃO há juros abusivos no contrato.';
        } else {
            CONCLUS.value = '';
            TLDR.value = '';
        }
    }
    

    function parseFloatSeparator(str) {
        if (!str) return 0;
        // Substituir a vírgula decimal por ponto
        str = str.replace(',', '.');
        return parseFloat(str);

        function gerarPDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
    
            // Preencher o template com os valores do formulário
            document.getElementById('pdf-taxa-mensal-contratual').textContent = TAXA_MENSAL_CONTRATUAL.value;
            document.getElementById('pdf-taxa-mensal-bacen').textContent = TAXA_MENSAL_BACEN.value;
            document.getElementById('pdf-conclus').textContent = CONCLUS.value;
            document.getElementById('pdf-tldr').textContent = TLDR.value;
    
            // Converter o template HTML para PDF
            doc.html(PDF_TEMPLATE, {
                callback: function (doc) {
                    doc.save('resultado.pdf');
                },
                x: 10,
                y: 10,
                width: 180 // largura do conteúdo do PDF
            });
        }
    }
});
