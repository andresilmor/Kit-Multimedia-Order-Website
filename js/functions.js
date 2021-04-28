//Cache
var preco = 0;
var precoBruto = 0;
var numProdutos = 0;
var lucroAdicionado = false;

var keywords = document.querySelector('meta[name="keywords"]').getAttribute("content");
for (var produtoSelecionado in produtosSelecionados) {
     keywords = keywords + ", " + produtosSelecionados[produtoSelecionado].nome;
}
document.querySelector('meta[name="keywords"]').setAttribute("content", keywords);

window.addEventListener("load", Initialize);

function Initialize() {
    
    for (var produtoSelecionado in produtosSelecionados) {
        produtosSelecionados[produtoSelecionado].estaSelecionado = false;
        produtosSelecionados[produtoSelecionado].quantidade = 0;
        produtosSelecionados[produtoSelecionado].preco = 0;
        preco = 0;
        precoBruto = 0;
        numProdutos = 0;
        document.getElementById("precoTexto").innerHTML = "Total: 0€";
        document.getElementById("inputNome").value = "";
        document.getElementById("inputNumMec").value = "";
        document.getElementById("inputEmail").value = "";
        document.getElementById("inputNumeroTelemovel").value = "";

        /*document.getElementById('select_Quantidade_' + produtosSelecionados[produtoSelecionado].id).addEventListener('change', function() {
    alert('change fired');
}, false);*/
        
        if (document.getElementById("checkbox_" + produtosSelecionados[produtoSelecionado].id).checked != null) {
            document.getElementById("checkbox_" + produtosSelecionados[produtoSelecionado].id).checked = false;
        }
    }
    AtualizarTodos();
}

function AtualizarTodos() {
    index = 0;
    for (var produtoSelecionado in produtosSelecionados) {
        if (produtosSelecionados[produtoSelecionado].estaSelecionado == true) {
            AtualizarPreco(produtosSelecionados[produtoSelecionado].id, index, null, true);
        } 
        index++;
    }
}

function Hover(element, imgHover) {
    
  element.setAttribute('src', imgHover);
}

function Unhover(element, imgUnhover) {
  element.setAttribute('src', imgUnhover);
}

function AtualizarPreco(produto, produtoID, selectID = null, estaAtualizando = false ) {
    document.getElementById('option_info_' + produto).style.display = 'flex';

    //var select = document.querySelector(selectID);
  //var option = select.options[select.selectedIndex].value;
    if(selectID != null)
        console.log(document.getElementById(selectID).value);
    if (document.getElementById("checkbox_" + produto).checked == true) {
        produtosSelecionados[produtoID].estaSelecionado = true;
        console.log("checkbox_" + produto);

    } else {
        produtosSelecionados[produtoID].estaSelecionado = false;

        numProdutos -= produtosSelecionados[produtoID].quantidade;

        preco -= produtosSelecionados[produtoID].preco.toFixed(2) * produtosSelecionados[produtoID].quantidade;
        precoBruto -= produtosSelecionados[produtoID].semDesconto.toFixed(2) * produtosSelecionados[produtoID].quantidade;

        //document.getElementById("precoTexto").innerHTML = "Total: " + preco.toFixed(2) + "€";
        AtualizarPrecoTexto();

        produtosSelecionados[produtoID].quantidade = 0;

        document.getElementById('option_info_' + produto).style.display = 'none';

        document.getElementById("select_Quantidade_" + produto).value = 1;
        
        document.getElementById("select_Tamanho_" + produto).value = "XS";

        if (!estaAtualizando)
            AtualizarTodos();

        HandleSticky();

        return;

    }

    quantidade = parseInt(document.getElementById("select_Quantidade_" + produto).value);

    numProdutos -= produtosSelecionados[produtoID].quantidade;

    preco -= produtosSelecionados[produtoID].preco.toFixed(2) * produtosSelecionados[produtoID].quantidade;
    precoBruto -= produtosSelecionados[produtoID].semDesconto.toFixed(2) * produtosSelecionados[produtoID].quantidade;

    produtosSelecionados[produtoID].quantidade -= produtosSelecionados[produtoID].quantidade;

    produtosSelecionados[produtoID].quantidade = quantidade;

    numProdutos += produtosSelecionados[produtoID].quantidade;

    if (numProdutos < 5) {
        produtosSelecionados[produtoID].preco = parseFloat(produtosSelecionados[produtoID].semDesconto);
    } else {
        produtosSelecionados[produtoID].preco = parseFloat(produtosSelecionados[produtoID].comDesconto);
    }

    preco += produtosSelecionados[produtoID].preco * produtosSelecionados[produtoID].quantidade;
    precoBruto += produtosSelecionados[produtoID].semDesconto * produtosSelecionados[produtoID].quantidade;

    document.getElementById("precoUsado_" + produto).value = produtosSelecionados[produtoID].preco.toFixed(2);
    
    //document.getElementById("precoTexto").innerHTML = "Total: " + preco.toFixed(2) + "€";
    AtualizarPrecoTexto();

    if (!estaAtualizando)
        AtualizarTodos();

    HandleSticky();

}

function HandleSticky() {  
    if (numProdutos > 0) {
        document.getElementById("sticky").style.display = 'flex';
    } else {
        document.getElementById("sticky").style.display = 'none';
    }
}

function AtualizarPrecoTexto() {
    if (numProdutos >= 5 && !lucroAdicionado) {
        preco += 5;
        lucroAdicionado = true;
    } else if (numProdutos < 5 && lucroAdicionado) {
        preco -= 5;
        lucroAdicionado = false;
    }
    document.getElementById("precoTexto").innerHTML = numProdutos < 5 ? "Total: " + preco.toFixed(2) + "€" : "Total: <del style=\"-webkit-text-decoration-color: red; text-decoration-color: red; text-decoration-thickness: 1.5px; #I know \">" + precoBruto.toFixed(2) + "€</del> " + preco.toFixed(2) + "€";
}


function Render() {

    var keys = Object.keys(produtosSelecionados);
    var len = keys.length;

    indexProduto = 0;
    col = 2;
    for (index = 0; index <= len; index += 0) {

        document.write(
            '<div class="row  mt-1" >' +
            '    <div class="container" >' +
            '        <div class="row  mt-1" >' +
            '           <div class="col-sm-1"></div>'
        );

        for (indexCol = indexProduto; indexCol < col; indexCol++) {
            if (produtosSelecionados[indexCol] != null) {
                document.write(
                    '<div class="col-sm-5 text-center">' +
                    '   <div class="option">' +
                    '       <input name="checkbox_' + produtosSelecionados[indexCol].id + '" type="checkbox" id="checkbox_' + produtosSelecionados[indexCol].id + '"' +
                    '           onclick="AtualizarPreco(\'' + produtosSelecionados[indexCol].id + '\', ' + indexCol + ', \'select_Quantidade_' + produtosSelecionados[indexCol].id + '\' );"/>' +
                    '       <label for="checkbox_' + produtosSelecionados[indexCol].id + '">');
                    if(!produtosSelecionados[indexCol].imgHover) {
                        document.write(
                    '       <img class="img-fluid" src="' + produtosSelecionados[indexCol].img + '" />'
                        );
                    } else {
                    document.write(
                    '       <img class="img-fluid" src="' + produtosSelecionados[indexCol].img + '" onmouseover="Hover(this, \'' + produtosSelecionados[indexCol].imgHover + '\');" onmouseout="Unhover(this, \'' + produtosSelecionados[indexCol].img + '\');"/>'
                        );    
                    }
                    document.write(
                    '       <h4 class="mt-3">' + produtosSelecionados[indexCol].nome + '</h4>' +
                    '       <h5 class=" mb-1">' + produtosSelecionados[indexCol].semDesconto.toFixed(2) + '&euro;</h5>' +
                    '       <input type="hidden" id="nomeProduto_' + produtosSelecionados[indexCol].id + '"' +
                    '           name="nomeProduto_' + produtosSelecionados[indexCol].id + '" value="' + produtosSelecionados[indexCol].nome + '">' +
                    '       <input type="hidden" id="idProduto_' + produtosSelecionados[indexCol].id + '"' +
                    '           name="idProduto_' + produtosSelecionados[indexCol].id + '" value="' + produtosSelecionados[indexCol].id + '">' +
                    '       <input type="hidden" id="precoUsado_' + produtosSelecionados[indexCol].id + '"' +
                    '       name="precoUsado_' + produtosSelecionados[indexCol].id + '" value="0">' +
                    '       <div class="row mb-2 option_info" id="option_info_' + produtosSelecionados[indexCol].id + '">' +
                    '       <div class="col-sm-6">' +
                    '       <label for="select_Quantidade_' + produtosSelecionados[indexCol].id + '"' +
                    '                class="info mb-1">Quantidade</label>' +
                    '            <select name="select_Quantidade_' + produtosSelecionados[indexCol].id + '" class="form-control"' +
                    '               id="select_Quantidade_' + produtosSelecionados[indexCol].id + '"onchange="AtualizarPreco(\'' + produtosSelecionados[indexCol].id + '\', ' + indexCol + ', \'select_Quantidade_' + produtosSelecionados[indexCol].id + '\' )">' +
                    //'               id="select_Quantidade_' + produtosSelecionados[indexCol].id + '"onchange="AtualizarPreco(\'select_Quantidade_' + produtosSelecionados[indexCol].id + '\', ' + indexCol + ', \'' + produtosSelecionados[indexCol].id + '\')">' +
                    '               <option>1</option>' +
                    '               <option>2</option>' +
                    '               <option>3</option>' +
                    '               <option>4</option>' +
                    '               <option>5</option>' +
                    '               <option>6</option>' +
                    '               <option>7</option>' +
                    '               <option>8</option>' +
                    '               <option>9</option>' +
                    '               <option>10</option>' +
                    '           </select>' +
                    '       </div>' +
                    '       <div class="col-sm-6">' );
                    if(produtosSelecionados[indexCol].temTamanho) {
                    document.write(
                    '           <label for="select_Tamanho_' + produtosSelecionados[indexCol].id + '"' +
                    '               class="info mb-1">Tamanho</label>' +
                    '           <select name="select_Tamanho_' + produtosSelecionados[indexCol].id + '" class="form-control"' +
                    '               id="select_Tamanho_' + produtosSelecionados[indexCol].id + '"onchange="someFunction()">' +
                    '               <option>XS</option>' +
                    '               <option>S</option>' +
                    '               <option>M</option>' +
                    '               <option>L</option>' +
                    '               <option>XL</option>' +
                    '               <option>XXL</option>' +
                    '           </select>' 
                    );
                    }
                    document.write(
                    '       </div>' +
                    '   </div>' +
                    '   </label>' +
                    '   </div>' +
                    '</div>'
                );


            }

        }

        document.write(
            '                           <div class="col-sm-1"></div>' +
            '                       </div>' +
            '                   <div class="col-sm-5 text-center">' +
            '               </div>' +
            '           <div class="col-sm-1"></div>' +
            '       </div>' +
            '   </div>'
        );

        col += 2;
        indexProduto += 2;
        index += 2;
    }
}