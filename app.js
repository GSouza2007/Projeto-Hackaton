// Importar módulo express
const express = require("express");

//Importar módulo fileupload
const fileupload = require('express-fileupload');

//Importar módulo express handlebars
const { engine } = require('express-handlebars');

//Importar módulo Mysql
const mysql = require('mysql2');

// File systems
const fs = require('fs');

const path = require('path');


//app
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

//Habilitando o upload de arquivos
app.use(fileupload());

app.use('/imagens', express.static('./imagens'));
app.use('/assets/logo', express.static('./assets/logo'));
// Adicionar Bootstrap
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));

app.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname,'public', 'home.handlebars'));
});
// Adicionar CSS
app.use('/css', express.static('./css'))

//Configuração do express-handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Manipulação de dados via rotas
app.use(express.json());
app.use(express.urlencoded({extended:false}));


//Configuração de conexão
const conexao = mysql.createConnection({
    host:'localhost',
    port:'3307',
    user:'root',
    password:'#284IV1160G@2062S7XD050I%',
    database:'projeto'
});

//Teste de conexão
conexao.connect(function(error){
    if(error){
        console.log(error)
    }else{
        console.log("Conexão efetuada com sucesso!");
    }
});

// Rota principal
// Página de eventos
app.get('/eventos', function(req, res) {
    let sql = 'SELECT * FROM eventos';

    conexao.query(sql, function(erro, eventos) {
        if (erro) {
            console.error('Erro ao buscar eventos:', erro);
            return res.status(500).send('Erro no servidor ao buscar eventos.');
        }

        // Renderizar a página de eventos
        res.render('eventos', { eventos: eventos });
    });
});

// Página de notícias
app.get('/', function(req, res) {
    let sql = 'SELECT * FROM noticias';

    conexao.query(sql, function(erro, noticias) {
        if (erro) {
            console.error('Erro ao buscar notícias:', erro);
            return res.status(500).send('Erro no servidor ao buscar notícias.');
        }

        // Renderizar a página de notícias
        res.render('home', { noticias: noticias });
    });
});

// Página de comentários
app.get('/comentarios', function(req, res) {
    let sql = 'SELECT * FROM comentarios';

    conexao.query(sql, function(erro, comentarios) {
        if (erro) {
            console.error('Erro ao buscar comentários:', erro);
            return res.status(500).send('Erro no servidor ao buscar comentários.');
        }

        // Renderizar a página de comentários
        res.render('comentarios', { comentarios: comentarios });
    });
});



// Rota de cadastro
app.post('/cadastrar', function(req, res){
    //Obter os dados que serão utilizados no cadastro
    let nome = req.body.nome;
    let descricao = req.body.descricao;
    let imagem = req.files.imagem.name;
    let data = req.body.data;


    //SQL
    let sql = `INSERT INTO eventos (nome, descricao, imagem, datadia) VALUES ('${nome}', '${descricao}', '${imagem}', '${data}')`;

    //Executar comando SQL
    conexao.query(sql, function(erro, retorno){
        //Caso ocorra algum erro
        if(erro){
            console.log(erro);
        }else{
            req.files.imagem.mv(__dirname+'/imagens/'+req.files.imagem.name);
            console.log(retorno);
        }
    });

    res.redirect('/');
});

// Rota para adicionar noticias
app.post('/noticias', function(req, res){
    //Obter os dados que serão utilizados no cadastro
    let nome = req.body.nome;
    let descricao = req.body.descricao;
    let imagem = req.files.imagem.name;
    let autor = req.body.autor;


    //SQL
    let sql = `INSERT INTO noticias (nome, descricao, imagem, autor) VALUES ('${nome}', '${descricao}', '${imagem}', '${autor}')`;

    //Executar comando SQL
    conexao.query(sql, function(erro, retorno){
        //Caso ocorra algum erro
        if(erro){
            console.log(erro);
        }else{
            req.files.imagem.mv(__dirname+'/imagens/'+req.files.imagem.name);
            console.log(retorno);
        }
    });

    res.redirect('/');
});

// Rota para adicionar comentarios
app.post('/comentarios', function(req, res){
    let comentario = req.body.comentario;

    //SQL
    let sql = `INSERT INTO comentarios (comentario) VALUES ('${comentario}')`;

    //Executar comando SQL
    conexao.query(sql, function(erro, retorno){
        //Caso ocorra algum erro
        if(erro){
            console.log(erro);
        }else{
            console.log(retorno);
        }
    });

    res.redirect('comentarios');
});


// Remover produtos
app.get('/remover/:id&:imagem', function(req, res){
    // SQL
    let sql = `DELETE FROM eventos WHERE id = ${req.params.id}`;

    conexao.query(sql, function(erro, retorno){
        if(erro){
            console.log(erro);
        }else{
            fs.unlink(__dirname+'/imagens/'+req.params.imagem, (erro_imagem) =>{
                console.log('Falha ao remover imagem');
            });
        }
    });
    res.redirect('/eventos');
});

// Remover noticias
app.get('/removerNoticias/:id&:imagem', function(req, res){
    // SQL
    let sql = `DELETE FROM noticias WHERE id = ${req.params.id}`;

    conexao.query(sql, function(erro, retorno){
        if(erro){
            console.log(erro);
        }else{
            fs.unlink(__dirname+'/imagens/'+req.params.imagem, (erro_imagem) =>{
                console.log('Falha ao remover imagem');
            });
        }
    });
    res.redirect('/');
});

app.get('/removerComentarios/:id', function(req, res){
    // SQL
    let sql = `DELETE FROM comentarios WHERE id = ${req.params.id}`;

    conexao.query(sql, function(erro, retorno){
        if(erro){
            console.log(erro);
        }else{
            console.log(retorno);
        }
    });
    res.redirect('/comentarios');
});

// Rota para editar eventos
app.get('/eventosEditar/:id', function(req, res){
    let sql = `SELECT * FROM eventos WHERE id = ${req.params.id}`;

    conexao.query(sql, function(erro, retorno){
        if(erro){
            console.log(erro);
        }else{
            res.render('eventosEditar', {eventos:retorno[0]});
        }
    });

});

// Editar os eventos
app.post('/editar', function(req, res){
    let nome = req.body.nome;
    let valor = req.body.valor;
    let id = req.body.id;
    let nomeImagem = req.body.nomeImagem;
    
    try{
        let imagem = req.files.imagem;
        let sql = `UPDATE eventos SET nome='${nome}', valor=${valor}, imagem='${imagem.name}' WHERE id=${id}`;

        conexao.query(sql, function(erro, retorno){
            if(erro){
                console.log(erro);
            }else{
                fs.unlink(__dirname+'/imagens/'+nomeImagem, (erro_imagem)=>{
                    console.log('Falha ao remover a imagem.')
                });
            }
            imagem.mv(__dirname+'/imagens/'+imagem.name);
        });
    }catch(erro){
        let sql = `UPDATE eventos SET nome='${nome}', valor=${valor} WHERE id=${id}`;

        conexao.query(sql, function(erro, retorno){
            if(erro){
                console.log(erro);
            }
        });
    }

    res.redirect('/');  
     
});

// Editar noticias
app.get('/noticiasEditar/:id', function(req, res){
    let sql = `SELECT * FROM noticias WHERE id = ${req.params.id}`;

    conexao.query(sql, function(erro, retorno){
        if(erro){
            console.log(erro);
        }else{
            res.render('noticiasEditar', {noticias:retorno[0]});
        }
    });

});

// Editar as noticias
app.post('/editarNoticias', function(req, res){
    let nome = req.body.nome;
    let descricao = req.body.descricao;
    let nomeImagem = req.body.nomeImagem;
    let autor = req.body.autor;
    let id = req.body.id;

    
    try{
        let imagem = req.files.imagem;
        let sql = `UPDATE noticias SET nome='${nome}', descricao='${descricao}', imagem='${imagem.name}', autor='${autor}', WHERE id=${id}`;

        conexao.query(sql, function(erro, retorno){
            if(erro){
                console.log(erro);
            }else{
                fs.unlink(__dirname+'/imagens/'+nomeImagem, (erro_imagem)=>{
                    console.log('Falha ao remover a imagem.')
                });
            }
            imagem.mv(__dirname+'/imagens/'+imagem.name);
        });
    }catch(erro){
        let sql = `UPDATE noticias SET nome='${nome}', descricao='${descricao}', autor='${autor}' WHERE id=${id}`;

        conexao.query(sql, function(erro, retorno){
            if(erro){
                console.log(erro);
            }
        });
    }

    res.redirect('/');  
     
});

app.get('/noticiasAdicionar/', (req, res) => {
    res.render('noticiasAdicionar');
});

app.get('/eventosAdicionar/', function(req, res){
    res.render('eventosAdicionar');
});

app.get('/comentariosAdicionar/', function(req, res){
    res.render('comentariosAdicionar');
});

app.get('/feedback', function (req, res) {
    res.render('feedback');
});

app.get('/eventos', function(req, res){
    res.render('eventos');
});


app.get('/', function(req, res){
    res.render('/');
});

//Servidor
app.listen(5000);