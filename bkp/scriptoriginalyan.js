const MODALIDADE = document.getElementById('ip_modalidade');
const DATA_EMPRESTIMO = document.getElementById('ip_data');

const VALOR_LIQUIDO = document.getElementById('ip_val_liq');
const VAL_ENTRADA = document.getElementById('ip_val_ent');
const VALOR_IOF = document.getElementById('ip_iof');
const VALOR_PRESTAMISTA = document.getElementById('ip_seg_prest');
const VALOR_DIVERSOS = document.getElementById('ip_tarifa_diversa');

VALOR_LIQUIDO.addEventListener('blur', atualiza_valor_total_financiado);
VAL_ENTRADA.addEventListener('blur', atualiza_valor_total_financiado);
VALOR_IOF.addEventListener('blur', atualiza_valor_total_financiado);
VALOR_PRESTAMISTA.addEventListener('blur', atualiza_valor_total_financiado);
VALOR_DIVERSOS.addEventListener('blur', atualiza_valor_total_financiado);

MODALIDADE.addEventListener('change', mudar_modalidade);
DATA_EMPRESTIMO.addEventListener('blur', mudar_modalidade);

function mudar_modalidade(component){
    const TAXA_MENSAL_BACEN = document.getElementById('ip_taxa_mensal_bacen');
    const TAXA_ANUAL_BACEN = document.getElementById('ip_taxa_anual_bacen');
    let data_para_busca = `${DATA_EMPRESTIMO.value}-01`.split('-');
    data_para_busca = new Date(data_para_busca[0], data_para_busca[1] - 1, data_para_busca[2]).toLocaleDateString('pt-Br');

    fetch(`https://api.bcb.gov.br/dados/serie/bcdata.sgs.${component.target.value}/dados?formato=json`)
    .then(response=> response.json())
    .then(data=>{
        let filtered_data = data.filter(row=> row.data === data_para_busca)[0];
        TAXA_MENSAL_BACEN.value = filtered_data.valor;
        TAXA_ANUAL_BACEN.value = ((((1 + (filtered_data.valor/100))**12)-1)*100).toFixed(2);
        
    })
    .catch(err=>{
        alert(`Valor de Taxa Mensal Não encontrado para a Data ${data_para_busca} de Modalidade ${MODALIDADE.innerText}`)
    })
}

function atualiza_valor_total_financiado(component){
    const VALOR_TOTAL_FINANCIADO = document.getElementById('ip_val_tot_financiado');
    const CURRENT_SUM = ((parseFloatSeparator(VALOR_LIQUIDO.value,'R$') * -1) +
                         parseFloatSeparator(VAL_ENTRADA.value,'R$')          +
                         parseFloatSeparator(VALOR_IOF.value,'R$')            +
                         parseFloatSeparator(VALOR_PRESTAMISTA.value,'R$')    +
                         parseFloatSeparator(VALOR_DIVERSOS.value,'R$'));

    VALOR_TOTAL_FINANCIADO.value = CURRENT_SUM.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    console.log(CURRENT_SUM)
    if (CURRENT_SUM < 0)
        VALOR_TOTAL_FINANCIADO.classList.add("valor-negativo");
    else
        VALOR_TOTAL_FINANCIADO.classList.remove("valor-negativo");

}

function parseFloatSeparator(str, sep) {
    if (!str)
        return parseFloat(0)
    return parseFloat(str.replace(sep, '').replaceAll('.','').replaceAll(',','.'));
}