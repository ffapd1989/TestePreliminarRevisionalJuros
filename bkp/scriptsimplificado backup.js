const MODALIDADE = document.getElementById('ip_modalidade');
const DATA_EMPRESTIMO = document.getElementById('ip_data');

MODALIDADE.addEventListener('change', mudar_modalidade);
DATA_EMPRESTIMO.addEventListener('blur', mudar_modalidade);

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

function mudar_modalidade(component){
    const TAXA_MENSAL_BACEN = document.getElementById('ip_taxa_mensal_bacen');
    const TAXA_ANUAL_BACEN = document.getElementById('ip_taxa_anual_bacen');
    const TAXA_ANUAL_BACEN_LIMIT50 = document.getElementById('ip_taxa_anual_bacen_limit50');
    const TAXA_MENSAL_BACEN_LIMIT50 = document.getElementById('ip_taxa_mensal_bacen_limit50');
    let data_para_busca = `${DATA_EMPRESTIMO.value}-01`.split('-');
    data_para_busca = new Date(data_para_busca[0], data_para_busca[1] - 1, data_para_busca[2]).toLocaleDateString('pt-Br');

    fetch(`https://api.bcb.gov.br/dados/serie/bcdata.sgs.${component.target.value}/dados?formato=json`)
    .then(response=> response.json())
    .then(data=>{
        let filtered_data = data.filter(row=> row.data === data_para_busca)[0];
        TAXA_MENSAL_BACEN.value = filtered_data.valor;
        TAXA_ANUAL_BACEN.value = ((((1 + (filtered_data.valor/100))**12)-1)*100).toFixed(2);
        TAXA_MENSAL_BACEN_LIMIT50.value = (filtered_data.valor*1.5).toFixed(2);
        TAXA_ANUAL_BACEN_LIMIT50.value = ((((1 + (filtered_data.valor/100))**12)-1)*100*1.5).toFixed(2);

        
    })
    .catch(err=>{
        alert(`Valor de Taxa Mensal Não encontrado para a Data ${data_para_busca} de Modalidade ${MODALIDADE.innerText}`)
    })
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
        TAXA_MENSAL_CONTRATUAL.addEventListener('blur', compararTaxas);
    }
   
    GENERATE_PDF_BUTTON.addEventListener('click', gerarPDF);
    PRINT_BUTTON.addEventListener('click', () => {
        window.print();
    });


    function compararTaxas() {
        const taxaMensalContratual = parseFloatSeparator(TAXA_MENSAL_CONTRATUAL.value);
        const taxaMensalBacen = parseFloatSeparator(TAXA_MENSAL_BACEN.value);
        const taxaMensalBacenLimit50 = (taxaMensalBacen * 1.5).toFixed(2);

        if (isNaN(taxaMensalContratual) || isNaN(taxaMensalBacen)) {
            CONCLUS.value = 'Por favor, insira valores válidos para as taxas.';
            TLDR.value = '';
            return;
        }

        if (taxaMensalContratual > taxaMensalBacenLimit50) {
            CONCLUS.value = `Veja-se que a taxa de juros contratual (${taxaMensalContratual}% a.m.) é superior a ${taxaMensalBacenLimit50}% a.m., valor equivalente a 1,5x (uma vez e meia) o valor da taxa média de juros para o período da contratação conforme apurado pelo BACEN (${taxaMensalBacen}%).`;
            TLDR.value = 'SIM, HÁ JUROS ABUSIVOS.';
        } else if (taxaMensalContratual <= taxaMensalBacenLimit50 && taxaMensalContratual >= taxaMensalBacen) {
            CONCLUS.value = `Verifica-se que a taxa contratual (${taxaMensalContratual}% a.m.) até é superior à taxa média apurada pelo BACEN  (${taxaMensalBacen}% a.m.), porém sem exceder-lhe em 1,5x (uma vez e meia) (equivalente a totalizaria ${taxaMensalBacenLimit50}% a.m.), pelo que não pode ser considerado abusiva`;
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
