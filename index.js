const express = require('express');
const app = express();
const connection = require("./database/database");
const Pergunta = require("./database/Perguntar");
const Resposta = require("./database/Resposta");

connection.authenticate().then(() => {

    console.log("Conexão estabelecida");

}).catch(err => {

    console.log(err);
})

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.get('/', (req, res) => {

    Pergunta.findAll({
        raw: true,
        order: [
            ['id', 'DESC']
        ]
    }).then(perguntas => {

        res.render('index', { perguntas: perguntas });

    })

})

app.get('/perguntar', (req, res) => {

    res.render("perguntar");

})

app.post('/salvarPergunta', (req, res) => {

    let titulo = req.body.titulo;
    let descricao = req.body.descricao;

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {

        res.redirect('/');

    })

});

app.get('/pergunta/:id?', (req, res) => {

    if (req.params.id != undefined) {

        let id = req.params.id;

        Pergunta.findOne({
            where: { id: id }
        }).then(pergunta => {

            if (pergunta != undefined) {


                Resposta.findAll({
                    where: {
                        perguntaId: pergunta.id
                    },
                    order: [
                        ['id', 'DESC']
                    ]
                }).then(respostas => {

                    res.render('pergunta', {
                        pergunta: pergunta,
                        respostas: respostas
                    });

                })



            } else {

                res.redirect('/');
            }

        })
    } else {

        res.redirect('/');
    }

});


app.post('/responder', (req, res) => {

    let corpo = req.body.corpo;
    let perguntaId = req.body.pergunta;

    Resposta.create({

        corpo: corpo,
        perguntaId: perguntaId,

    }).then(() => {

        res.redirect('/pergunta/' + perguntaId);

    })
})


app.use(function(req, res, next) {

    res.render('404', { url: req.url });

})

app.listen(3000, () => {

    console.log("http://localhost:3000");
})