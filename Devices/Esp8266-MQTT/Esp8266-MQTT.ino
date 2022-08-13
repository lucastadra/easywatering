/* -------------------------------- EASYWATERING v1.1-beta -------------------------------- *
*                                                                                           *
*  Name: EasyWatering                                                                       *
*  Description: Projeto de Irrigação e Monitoramento de Hortas EasyWatering usando MQTT     *
*  Autor: Lucas Tadra & Gláucia Dias                                                        *
*  Subject: Disciplina de Projeto de Sistemas de Computação 2022/1                          *
*  Department: Departamento de Informática, Universidade Estadual de Ponta Grossa           *
*  Info: Curso de Engenharia de Computação                                                  *
*  License: GNU General Public License v3.0                                                 *
*  Date: 13/08/2022                                                                         *
*  Current Version: v1.1-beta                                                               *
*                                                                                           *
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 

/*********** LIBS ***********/
#include <DHT.h>
#include <PubSubClient.h>
#include <Ticker.h>
#include <WiFiManager.h>

/*********** PRE PROCESSORS ***********/
#define DHTPIN 12
#define DHTTYPE DHT22
#define TIME_INTERVAL 10000
#define LED LED_BUILTIN
#define DEBUG true

/*********** CONST ***********/
const String ESP_UUID = "6f9629a8-8827-44d2-94ed-cad4b6fe9154";
const int SMPin = A0;
/* MQTT Config */
const char* MQTT_BROKER_URL = "192.168.31.61";
const int MQTT_BROKER_PORT = 1883;
const char* MQTT_DATA_SUB_TOPIC = "easywatering/data";
const char* MQTT_COMMAND_SUB_TOPIC = "easywatering/command";

/*********** VAR ***********/
long lastConnectionTime;
char macAddress[6];
String strMacAddress;

/*********** OBJECTS/INSTANCES ***********/
DHT dht(DHTPIN, DHTTYPE);
WiFiClient clientWIFI;
PubSubClient clientMQTT(clientWIFI);
WiFiManager wiFiManager;
Ticker ticker;

/*********** SETUP ***********/
void setup() {
  /* Serial */
  Serial.begin(115200);

  /* Pin Modes and States */
  lastConnectionTime = 0;
  pinMode(LED, OUTPUT);
  WiFi.mode(WIFI_STA);

  dht.begin();  //Starts DHT Sensor

  /* Setup WifiManager */
  //wiFiManager.resetSettings();
  wiFiManager.setDebugOutput(false);
  wiFiManager.setAPCallback(wifiManagerCB);

  if (!wiFiManager.autoConnect("EasyWatering-Manager")) {
    Serial.println("Failed to connect to Wi-Fi.\n");

    ESP.restart();
    delay(1000);
  }
  
  if (DEBUG) {
    Serial.println("WiFi Connected.\n");
    Serial.println("Instance IP: ");
    Serial.println(WiFi.localIP());
    Serial.println("MAC Address:");
    Serial.println(WiFi.macAddress());
  }
  
  /* MAC Config */
  strMacAddress = WiFi.macAddress();
  strMacAddress.toCharArray(macAddress, 6);

  ticker.detach();

  /* MQTT Connection */
  clientMQTT.setServer(MQTT_BROKER_URL, MQTT_BROKER_PORT);
  clientMQTT.setCallback(mqttCB);
  
  ticker.detach();
  
  digitalWrite(LED, LOW);
}

/*********** CALLBACKS ***********/
void ledBlink() {
  digitalWrite(LED, !digitalRead(LED));
}

void wifiManagerCB(WiFiManager *wiFiManager) {
  Serial.println("Settings mode ON.");
  ticker.attach(0.2, ledBlink);
}

void mqttCB(char* topic, byte* payload, unsigned int length) {
  String payloadStr = "";

  for (int i = 0; i < length; i++) {
    payloadStr = payloadStr + (char)payload[i];
  }

  if (DEBUG) {
    Serial.println("[RECEIVED MESSAGE] Topic: ");
    Serial.println(topic);
    Serial.println(" / Message: ");
    Serial.println("Payload String: ");
    Serial.println(payloadStr);
  }
}

void connectMQTT() {
  int tries = 0;

  while (!clientMQTT.connected() && tries < 10) {
    delay (500);

    if (DEBUG)
      Serial.print(".");
    
    tries ++;
  }

  if (clientMQTT.connect(macAddress)) {
    if (DEBUG) 
      Serial.println("MQTT connected.");

    /* Subscribes to main topics */
    //clientMQTT.subscribe(MQTT_DATA_SUB_TOPIC);
    clientMQTT.subscribe(MQTT_COMMAND_SUB_TOPIC);
  } else {
    if (DEBUG)
      Serial.println("Failed to connect to MQTT.");
  }
}

String readSensorData(){  
    /* Sensors Var */
    int sh;
    float sph;
    float h = dht.readHumidity();
    float t = dht.readTemperature();
    String sensorData = "";
    
    if (isnan(h) || isnan(t)) {
      if (DEBUG)
        Serial.println(F("Failed to read from DHT sensor!"));
        
      return "";
    }

    sh = analogRead(SMPin);

    if (isnan(sh) || sh == 0) {
      if (DEBUG)
        Serial.println(F("Failed to read from Soil sensor!"));
        
      return "";
    }
    
    /* Soil Moisture Measurement | Multiplied by ~1.83 empirical correction factor */
    sph = ( 100 - ( (sh/1024.00) * 100 ) ) * 1.825555;

    if (sph > 100)
      sph = 100.00;

    /* Builds JSON string */
    sensorData = "{\"temp\":" + String(t) + ", " + "\"umid\":" + String(h) + "," + "\"soil\":" + String(sph);
    
    return sensorData;
}
  
void loop() {
  
    if (!clientMQTT.connected()) {
      connectMQTT();
    }
    clientMQTT.loop();

    /* Check if it's time to send new data */
    if (millis() - lastConnectionTime > TIME_INTERVAL) {
      lastConnectionTime = millis();
      String data = "";

      /* Check if data isn't empty */      
      if ((data = readSensorData()) != "") {
        /* Appends ESP_UUID to payload */
        data += ",\"id\":\"" + ESP_UUID + "\"}";

        /* Loads the String into an charr array for PubSubClient Payload */
        int data_len = data.length() + 1;
        char char_arr[data_len];
        data.toCharArray(char_arr, data_len);

        /* Publish to the specified EasyWatering topic */
        clientMQTT.publish(MQTT_DATA_SUB_TOPIC, char_arr);
        
        if (DEBUG)
          Serial.println("Data sent: " + data);
      }
    }
}
