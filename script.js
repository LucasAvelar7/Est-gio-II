// Variáveis globais
let perguntaAtualIndex = 0;
let pontuacao = 0;
let vidas = 3;
let perguntas = [];

// Função para embaralhar as perguntas de forma aleatória
function embaralharPerguntas(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Função para carregar as perguntas do arquivo JSON
async function carregarPerguntas() {
    try {
        const response = await fetch('perguntas.json');
        perguntas = await response.json();
        embaralharPerguntas(perguntas);
        carregarProximaPergunta();
    } catch (error) {
        console.error('Erro ao carregar as perguntas:', error);
    }
}

// Função para carregar a próxima pergunta
function carregarProximaPergunta() {
    if (perguntaAtualIndex < perguntas.length) {
        const perguntaAtual = perguntas[perguntaAtualIndex];
        document.getElementById('pergunta').innerText = perguntaAtual.pergunta;
        const alternativasContainer = document.getElementById('alternativas');
        alternativasContainer.innerHTML = '';
        perguntaAtual.alternativas.forEach((alternativa, index) => {
            const button = document.createElement('button');
            button.classList.add('alternativa');
            button.innerText = alternativa;
            button.onclick = () => verificarResposta(alternativa);
            alternativasContainer.appendChild(button);
        });
        perguntaAtualIndex++;
    } else {
        finalizarJogo();
    }
}

// Função para verificar a resposta selecionada pelo usuário
function verificarResposta(respostaSelecionada) {
    const perguntaAtual = perguntas[perguntaAtualIndex - 1];
    if (respostaSelecionada === perguntaAtual.resposta) {
        pontuacao += 10;
        exibirMensagem('success', 'Resposta correta!');
    } else {
        vidas--;
        exibirMensagem('error', `Resposta incorreta! A resposta correta é: ${perguntaAtual.resposta}`);
        document.getElementById('vidas').innerText = vidas;
        if (vidas === 0) {
            finalizarJogo();
        }
    }
    document.getElementById('pontuacao').innerText = pontuacao;
    carregarProximaPergunta();
}

// Função para exibir mensagens de sucesso ou erro
function exibirMensagem(type, message) {
    const mensagemElement = document.getElementById('mensagem');
    mensagemElement.textContent = message;
    mensagemElement.className = `mensagem ${type}`;
    mensagemElement.style.display = 'block';
    setTimeout(() => {
        mensagemElement.style.display = 'none';
    }, 2000);
}

// Função para finalizar o jogo
function finalizarJogo() {
    alert(`Jogo finalizado! Pontuação: ${pontuacao}`);
    const reiniciar = confirm('Deseja jogar novamente?');
    if (reiniciar) {
        location.reload();
    }
}

// Iniciar o jogo após o carregamento da página
window.onload = carregarPerguntas;
