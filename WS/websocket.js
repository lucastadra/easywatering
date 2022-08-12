var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');

//Porta que o server irá escutar
const port = 8080;

//Cria o server
var server = http.createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'text/html' })
    fs.createReadStream('index.html').pipe(res)
  });

//Server irá escutar na porta definida em 'port'
server.listen(port, () => {
    //Server está pronto
    console.log(`Server está executando na porta ${port}`);
});

//Cria o WebSocket server
const wsServer = new WebSocketServer({
  httpServer: server
});

//Chamado quando um client deseja conectar
wsServer.on('request', (request) => {
    //Estado do led: false para desligado e true para ligado
    let state = false;

    //Aceita a conexão do client
    let client = request.accept(null, request.origin);
    console.log('Conexão aberta')

    //Chamado quando o client envia uma mensagem
    client.on('message', (message) => {
        //Se é uma mensagem string utf8
        if (message.type === 'utf8') {
            //Mostra no console a mensagem
            console.log("Mensagem client:", message.utf8Data);

            let data = {};

            let rawData = message.utf8Data.split(';');

            data.id = String(rawData[3]).split(':')[1];
            data.temperatura = String(rawData[0]).split(':')[1];
            data.umidadeAr = String(rawData[1]).split(':')[1];
            data.umidadeSolo = String(rawData[2]).split(':')[1];


            console.log(data);
        }
        //Cria uma função que será executada a cada 1 segundo (1000 millis) para enviar o estado do led
        // let interval = setInterval(() => {
            //Envia para o client "ON" ou "OFF" dependendo do estado atual da variável state
            client.sendUTF(state? "ON" : "OFF");
            //Inverte o estado
            state = !state;
        // }, 10000);//Tempo entre chamadas => 1000 millis = 1 segundo 
    });


    //Chamado quando a conexão com o client é fechada
    client.on('close', () => {
        console.log("Conexão fechada");
        //Remove o intervalo de envio de estado
        // clearInterval(interval);
    });

});