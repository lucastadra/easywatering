#include <ESP8266WiFi.h>
#include <ArduinoWebsockets.h>
#include <DHT.h>

#define DHTTYPE DHT22
#define INTERVALO_ENVIO 10000

const char* ssid = "Xiaomi_37DD"; // Nome da rede
const char* password = "znid306879168"; // Senha da rede
const char* websockets_server_host = "192.168.31.61"; // IP do servidor websocket
const int websockets_server_port = 8080; // Porta de conexão do servidor
String ESP_UUID = "6f9629a8-8827-44d2-94ed-cad4b6fe9154"; // Identificador único do ESP

const int DHTPin = D4;
const int SMPin = A0;
DHT dht(DHTPin, DHTTYPE);

long lastConnectionTime;

// Utilizamos o namespace de websocket para podermos utilizar a classe WebsocketsClient
using namespace websockets;

// Objeto websocket client
WebsocketsClient client;

// Led
const int led = BUILTIN_LED;

String sendSensorData(){
    // Wait a few seconds between measurements.
    delay(2000);
    
    // Reading temperature or humidity takes about 250 milliseconds!
    // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
    float h = dht.readHumidity();
    // Read temperature as Celsius
    float t = dht.readTemperature();
    
    // Check if any reads failed and exit early (to try again).
    if (isnan(h) || isnan(t)) {
      Serial.println(F("Failed to read from DHT sensor!"));
      return "";
    }

    // Soil humidity (brute analog 0-978 value)
    int sh;

    // Soil humidity percentage
    float sph;
    
    sh = analogRead(SMPin);   //978 -> 3,3V
    
    if (isnan(sh) || sh == 0) {
      Serial.println(F("Failed to read from Soil sensor!"));
      return "";
    }

    sph = 100 * ((978-(float)sh) / 978);
    
    String data = "temp:" + String(t) + ";" + "umid:" + String(h) + ";" + "soil:" + String(sph);
    return data;
}
  
void setup() 
{
    // Iniciamos a serial com velocidade de 115200
    Serial.begin(115200);
    lastConnectionTime = 0;

    // Definimos o pino como saída
    pinMode(led, OUTPUT);

    // Conectamos o wifi
    WiFi.begin(ssid, password);

    // Enquanto não conectar printamos um "."
    while(WiFi.status() != WL_CONNECTED)
    {
        Serial.print(".");
        delay(1000);
    }
  

    // Exibimos "WiFi Conectado"
    Serial.println("Connected to Wifi, Connecting to server.");

    // Tentamos conectar com o websockets server
    bool connected = client.connect(websockets_server_host, websockets_server_port, "/");

    // Se foi possível conectar
    if(connected) 
    {
        // Exibimos mensagem de sucesso
        Serial.println("Connected!");
        // Enviamos uma msg "Hello Server" para o servidor
        client.send("Hello Server: " + ESP_UUID);
    }   // Se não foi possível conectar
    else 
    {
        // Exibimos mensagem de falha
        Serial.println("Not Connected!");
        return;
    }

    // Inicializa o Sensor de Temperatura/Umidade
    dht.begin();
    
}

void connect_websocket() {
    // Tentamos conectar com o websockets server
    bool connected = client.connect(websockets_server_host, websockets_server_port, "/");

    // Se foi possível conectar
    if(connected) 
    {
        // Exibimos mensagem de sucesso
        Serial.println("Connected!");
        // Enviamos uma msg "Hello Server" para o servidor
        client.send("Hello Server: " + ESP_UUID);
    }   // Se não foi possível conectar
    else 
    {
        return;
    }
}

void read_ledstate() {
  // Iniciamos o callback onde as mesagens serão recebidas
  client.onMessage([&](WebsocketsMessage message) {        
      // Exibimos a mensagem recebida na serial
      Serial.print("Mensagem recebida: ");
      Serial.println(message.data());

      // Ligamos/Desligamos o led de acordo com o comando
      if(message.data().equalsIgnoreCase("ON"))
          digitalWrite(led, HIGH);
      else
      if(message.data().equalsIgnoreCase("OFF"))
          digitalWrite(led, LOW);
  });
}

void loop() {
    int connection_retries = 0;
    // De tempo em tempo, o websockets client checa por novas mensagens recebidas, e então aproveitamos
    // para enviar dados
    if(client.available() && (millis() - lastConnectionTime > INTERVALO_ENVIO)) {
      connection_retries = 0;
      String data;
      if (client.poll()) {
        read_ledstate();
      }
    
      if ((data = sendSensorData()) != "") {
        client.send(data + ";id:" + ESP_UUID);
        Serial.println("Data sent: " + data);
      }
    // Tenta reconectar ao Websocket 5 vezes consecutivas;
    } else if (connection_retries < 6) {
      Serial.println("Not Connected! Retrying...");
      connect_websocket();
      connection_retries++;
      delay(5000);
    } else {
      Serial.println("Não foi possível conectar ao Websocket após 5 tentativas.");
    }
}