const tabs = document.querySelectorAll('.tab-btn');

tabs.forEach(tab => tab.addEventListener('click', () => tabClicked(tab)));

const tabClicked = (tab) => {
    tabs.forEach(tab => tab.classList.remove('active'));
    tab.classList.add('active');

    const contents = document.querySelectorAll('.content');
    contents.forEach(content => content.classList.remove('show'));

    const contentId= tab.getAttribute('content-id');
    const content = document.getElementById(contentId);
    
    content.classList.add('show');
}

function add_animal(){
    const subject = document.querySelector("#subject");
    const codigo = "<div id='adicionados'>"
    +"<div class='row'><div class='col-md-8'>Nome do animal:<input type='text' class='form-control' placeholder='Nome do animal' name='nome_animal'><br></div><div class='col-md'>Espécie:<input type='text' class='form-control' placeholder='Espécie' name='especie_animal'><br></div></div>"
    +"<div class='row'><div class='col-md-2'>Idade:<input type='text' class='form-control' placeholder='' name='idade_animal'><br></div><div class='col-md'>Sexo:<input type='text' class='form-control' placeholder='sexo' name='sexo_animal'><br></div><div class='col-md'>Cor:<input type='text' class='form-control' placeholder='cor' name='cor_animal'><br></div>"
    +"<div class='col-md-1 align-self-center'><button type='button' onclick='remove_animal(this)' class='btn btn-secondary w-60 ' alt='Excluir Animal'>"
    +"<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-plus-circle-fill' viewBox='0 0 16 16'>"
    +"<path d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z'/></svg></button></div></div><hr style='background-color:gray;'></div>";
    subject.insertAdjacentHTML("beforebegin",codigo,);
}

function remove_animal(e){
    e.parentNode.parentNode.parentNode.outerHTML = '';
}

function pesquisa_cep(cep) {
    $.ajax({
        url: `https://viacep.com.br/ws/${cep}/json/`,
        type: 'GET',
        success: function(data) {
            $('#logradouro').val(data.logradouro);
            $('#bairro').val(data.bairro);
            $('#cidade').val(data.localidade);
            $('#UF').val(data.uf);
        },
        error: function() {
            alert('Erro ao buscar CEP. Por favor, tente novamente.');
        }
    });
}

document.getElementById('pesquisa_usuario').addEventListener('submit', function(event){
    event.preventDefault();
    dados = document.getElementById('pesquisa_nome').value
    console.log(dados)
    ObterDados(dados);
})

function ObterDados(dados) {
    csrf_token = document.querySelector('[name=csrfmiddlewaretoken]').value
    $.ajax({
        type:'POST',
        url:'exibe_dados',
        headers:{'X-CSRFToken':csrf_token},
        data:{
            pesquisa_nome: dados,
            csrfmiddlewaretoken: csrf_token,
        },
        success: (data) => {
            console.log(data)
            displayData(data)
        }
        
    })
}

function displayData(data) {
    document.getElementById('exibe_usuarios').remove();
    var novodiv = document.createElement("div");
    novodiv.id = "exibe_usuarios";
    var pesquisa = document.querySelector("#pesquisa");
    pesquisa.appendChild(novodiv);
    const codigo = ' <table class="table table-hover">'
        +'<tr>'
        +'<td scope="col">#</td>'
        +'<td scope="col">CPF</td>'
        +'<td scope="col">Nome</td>'
        +'<td scope="col">Endereço</td>'
        +'<td scope="col">Telefone</td>'
        +'<td scope="col">Telefone</td>'
        +'</tr>'
        +'<tbody id="dados_usuarios">'
        +'<tr>'
    document.getElementById('exibe_usuarios').innerHTML += codigo;

    for(i=0; i<data['dados'].length; i++){
        $('#dados_usuarios').append('<tr id="user-' + data['dados'][i]['id'] + '"><td>' + data['dados'][i]['id'] + '</td>'
                                    +'<td>' + data['dados'][i]['fields']['cpf'] + '</td>'
                                    +'<td>' + data['dados'][i]['fields']['nome'] + '</td>'
                                    +'<td>' + data['dados'][i]['fields']['endereco'] + '</td>'
                                    +'<td>' + data['dados'][i]['fields']['telefone1'] + '</td>'
                                    +'<td>' + data['dados'][i]['fields']['telefone2'] + '</td>'
                                    +'<td><span><i class="fas fa-trash"></i></span><button class="btn btn-secondary w-100 py-1" data-toggle="modal" data-target="#exampleModal" onclick="editUser(' + data['dados'][i]['id'] + ')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">'
                                    +'<path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>'
                                    +'</svg> Editar</button></a></td>'
                                    +'<td><a href="/termo/' + data['dados'][i]['id'] + '"><span><i class="fas fa-trash"></i></span>'
                                    +'<button class="btn btn-secondary w-100 py-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-printer" viewBox="0 0 16 16">'
                                    +'<path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>'
                                    +'<path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1"/>'
                                    +'</svg> Imprimir</button></a></td>'
                                    +'<td><a href="/apagar_usuario/' + data['dados'][i]['id'] + '" onclick="return confirm("Tem certeza?")"><span><i class="fas fa-trash"></i></span>'
                                    +'<button class="btn btn-secondary w-100 py-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">'
                                    +'<path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>'
                                    +'</svg> Apagar</button></a></td></tr>')
    }
 
}

function editUser(id){
    if (id){
        
        csrf_token = document.querySelector('[name=csrfmiddlewaretoken]').value
        $.ajax({
            type:'POST',
            url:'edita_dados',
            headers:{'X-CSRFToken':csrf_token},
            data:{
                id: id,
                csrfmiddlewaretoken: csrf_token,
            },
            success: (data) => {
                console.log(data['dados'][0]['id']);
                id = data['dados'][0]['id'];
                nome = data['dados'][0]['fields']['nome'];
                cpf = data['dados'][0]['fields']['cpf'];
                rg = data['dados'][0]['fields']['rg'];
                email = data['dados'][0]['fields']['email'];
                telefone1 = data['dados'][0]['fields']['telefone1'];
                telefone2 = data['dados'][0]['fields']['telefone2'];
                cep = data['dados'][0]['fields']['cep'];
                endereco = data['dados'][0]['fields']['endereco'];
                numero = data['dados'][0]['fields']['numero'];
                bairro = data['dados'][0]['fields']['bairro'];
                cidade =  data['dados'][0]['fields']['cidade'];
                uf = data['dados'][0]['fields']['uf'];
                obs = data['dados'][0]['fields']['obs'];
                //console.log(nome, cpf, rg, email, telefone1, telefone2, cep, endereco, numero, bairro, cidade, uf, obs)
                $('#form-id').val(id)
                $('#nome_modal').val(nome);
                $('#cpf_modal').val(cpf);
                $('#rg_modal').val(rg);
                $('#email_modal').val(email);
                $('#telefone1_modal').val(telefone1);
                $('#telefone2_modal').val(telefone2);
                $('#cep_modal').val(cep);
                $('#endereco_modal').val(endereco);
                $('#numero_modal').val(numero);
                $('#bairro_modal').val(bairro);
                $('#cidade_modal').val(cidade);
                $('#uf_modal').val(uf);
                $('#observacoes_modal').val(obs);

            }
            
        })

    }

}

document.getElementById('updateUser').addEventListener('submit', function(event){
    event.preventDefault();
    var id = $('input[id="form-id"]').val();
    var nome = $('input[id="nome_modal"]').val();
    var cpf =  $('input[id="cpf_modal"]').val();
    var rg =  $('input[id="rg_modal"]').val();
    var email =  $('input[id="email_modal"]').val();
    var telefone1 =  $('input[id="telefone1_modal"]').val();
    var telefone2 =  $('input[id="telefone2_modal"]').val();
    var cep =  $('input[id="cep_modal"]').val();
    var endereco =  $('input[id="endereco_modal"]').val();
    var numero =  $('input[id="numero_modal"]').val();
    var bairro =  $('input[id="bairro_modal"]').val();
    var cidade =   $('input[id="cidade_modal"]').val();
    var uf =  $('input[id="uf_modal"]').val();
    var obs =  document.getElementById('observacoes_modal').value;
    console.log(id, nome, cpf, rg, email, telefone1, telefone2, cep, endereco, numero, bairro, cidade, uf, obs)
    $.ajax({
        url: 'att_usuario',
        type:'POST',
        headers:{'X-CSRFToken':csrf_token},
        data:{
            id: id,
            nome: nome,
            cpf: cpf,
            rg: rg,
            email: email,
            telefone1: telefone1,
            telefone2: telefone2,
            cep: cep,
            endereco: endereco,
            numero: numero,
            bairro: bairro,
            cidade: cidade,
            uf: uf,
            observacoes: obs,
            csrfmiddlewaretoken: csrf_token,
        },
        dataType: 'json',
        sucess: function(data){
            alert("Dados atualizados com sucesso!");
        }
    });
    $('form#updateUser').trigger("reset");
    $('#exampleModal').modal('hide');
    return false;
});

function pesquisa_cep2(cep) {
    $.ajax({
        url: `https://viacep.com.br/ws/${cep}/json/`,
        type: 'GET',
        success: function(data) {
            $('#endereco_modal').val(data.logradouro);
            $('#bairro_modal').val(data.bairro);
            $('#cidade_modal').val(data.localidade);
            $('#uf_modal').val(data.uf);
        },
        error: function() {
            alert('Erro ao buscar CEP. Por favor, tente novamente.');
        }
    });
}