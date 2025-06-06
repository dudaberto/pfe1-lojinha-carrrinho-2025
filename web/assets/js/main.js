document.addEventListener('DOMContentLoaded', function() {
    carregarProdutos();
    atualizarContadorCarrinho();
});

// Carrega produtos do JSON
async function carregarProdutos() {
    try {
        const response = await fetch('assets/dados.json');
        if (!response.ok) {
            throw new Error('Erro ao carregar produtos');
        }
        const data = await response.json();
        exibirProdutos(data.produtos);
    } catch (error) {
        console.error('Erro:', error);
        // Exibe mensagem de erro para o usuário
        document.getElementById('produtos-container').innerHTML = `
            <div class="alert alert-danger col-12">
                Não foi possível carregar os produtos. Por favor, tente novamente mais tarde.
            </div>
        `;
    }
}

// Exibe os produtos na página
function exibirProdutos(produtos) {
    const container = document.getElementById('produtos-container');
    container.innerHTML = '';

    produtos.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'col';
        card.innerHTML = `
            <div class="card h-100">
                <img src="${produto.imagem}" class="card-img-top" alt="${produto.nome}" 
                     onerror="this.src='https://via.placeholder.com/300?text=Produto+Sem+Imagem'">
                <div class="card-body">
                    <h5 class="card-title">${produto.nome}</h5>
                    <span class="badge bg-primary">${produto.categoria}</span>
                    <p class="card-text mt-2">${produto.descricao}</p>
                </div>
                <div class="card-footer bg-transparent">
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="fs-4 text-success">R$ ${produto.preco.toFixed(2)}</span>
                        <div>
                            <button class="btn btn-outline-primary btn-sm" onclick="adicionarAoCarrinho(${produto.id})">
                                <i class="bi bi-cart-plus"></i>
                            </button>
                            <a href="detalhes.html?id=${produto.id}" class="btn btn-primary btn-sm ms-2">
                                <i class="bi bi-eye"></i> Detalhes
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Funções do Carrinho
function adicionarAoCarrinho(idProduto) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    // Verifica se o produto já está no carrinho
    const produtoExistente = carrinho.find(item => item.id === idProduto);
    
    if (produtoExistente) {
        produtoExistente.quantidade += 1;
    } else {
        carrinho.push({
            id: idProduto,
            quantidade: 1
        });
    }
    
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
    alert('Produto adicionado ao carrinho!');
}

function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    document.getElementById('carrinho-contador').textContent = totalItens;
}

// Função global para ser usada em outras páginas
window.atualizarContadorCarrinho = atualizarContadorCarrinho;