const cartoes = [];

const nomeCartao = document.getElementById('nomeCartao');
const limiteCartao = document.getElementById('limiteCartao');
const btnAdicionarCartao = document.getElementById('btnAdicionarCartao');

const selectCartao = document.getElementById('selectCartao');
const descricaoGasto = document.getElementById('descricaoGasto');
const valorGasto = document.getElementById('valorGasto');
const btnAdicionarGasto = document.getElementById('btnAdicionarGasto');

const resumoGeral = document.getElementById('resumoGeral');
const cartoesContainer = document.getElementById('cartoesContainer');

function atualizarResumo() {
    let totalLimite = 0;
    let totalGasto = 0;
    cartoesContainer.innerHTML = '';

    cartoes.forEach((c, index) => {
        totalLimite += c.limite;
        let gastoTotal = c.gastos.reduce((a,b) => a+b.valor,0);
        totalGasto += gastoTotal;

        let saldo = c.limite - gastoTotal;
        let estado = saldo < 0 ? 'Crítico' : (saldo < c.limite*0.3 ? 'Moderado' : 'Suave');
        let classeEstado = estado.toLowerCase();

        const divCartao = document.createElement('div');
        divCartao.className = 'cartao-card';
        let perc = Math.min((gastoTotal / c.limite) * 100, 100);
        let corBarra = estado === 'Crítico' ? '#E53935' : estado === 'Moderado' ? '#FFA000' : '#43A047';

        // Mini extrato de gastos
        let extratoHTML = '';
        if(c.gastos.length > 0){
            extratoHTML = '<ul class="extrato">';
            c.gastos.forEach(g => {
                extratoHTML += `<li>${g.descricao}: R$ ${g.valor.toFixed(2)}</li>`;
            });
            extratoHTML += '</ul>';
        } else {
            extratoHTML = '<p style="color:#888;">Sem gastos cadastrados</p>';
        }

        divCartao.innerHTML = `
            <h3>${c.nome}</h3>
            <p>Limite: R$ ${c.limite.toFixed(2)}</p>
            <p>Gasto: R$ ${gastoTotal.toFixed(2)}</p>
            <p>Saldo: R$ ${saldo.toFixed(2)}</p>
            <div class="progresso-container">
                <div class="progresso" style="width:${perc}%; background-color:${corBarra}"></div>
            </div>
            <p class="estado-${classeEstado}">Estado: ${estado}</p>
            ${extratoHTML}
        `;
        cartoesContainer.appendChild(divCartao);
    });

    resumoGeral.innerHTML = `
        💳 Limite Total: R$ ${totalLimite.toFixed(2)}<br>
        💰 Total Gasto: R$ ${totalGasto.toFixed(2)}<br>
        📉 Saldo Geral: R$ ${(totalLimite-totalGasto).toFixed(2)}
    `;
}

btnAdicionarCartao.addEventListener('click', () => {
    if(cartoes.length >= 10) return;

    const nome = nomeCartao.value.trim();
    const limite = parseFloat(limiteCartao.value);
    if(!nome || isNaN(limite)) return;

    cartoes.push({nome, limite, gastos: []});

    const option = document.createElement('option');
    option.value = cartoes.length-1;
    option.text = nome;
    selectCartao.add(option);

    nomeCartao.value = '';
    limiteCartao.value = '';

    atualizarResumo();
});

btnAdicionarGasto.addEventListener('click', () => {
    const index = parseInt(selectCartao.value);
    const descricao = descricaoGasto.value.trim();
    const valor = parseFloat(valorGasto.value);

    if(isNaN(index) || !descricao || isNaN(valor)) return;

    cartoes[index].gastos.push({descricao, valor});

    descricaoGasto.value = '';
    valorGasto.value = '';

    atualizarResumo();
});
