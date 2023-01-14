/* -------------------------------- EASYWATERING v3.3 ------------------------------------- *
*                                                                                           *
   Name: EasyWatering
   Description: Projeto de Irrigação e Monitoramento de Hortas EasyWatering usando MQTT
   Autor: Lucas Tadra & Gláucia Dias
   Subject: Disciplina de Projeto de Sistemas de Computação 2022/1
   Department: Departamento de Informática, Universidade Estadual de Ponta Grossa
   Info: Curso de Engenharia de Computação
   License: GNU General Public License v3.0
   Date: 21/08/2022
   Last Revision Date: 14/01/2023
   Current Version: v3.3
*                                                                                           *
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

/*********** LIBS ***********/
#include <DHT.h>
#include <PubSubClient.h>
#include <Ticker.h>
#include <WiFiManager.h>
/*********** PRE PROCESSORS ***********/
#define DEBUG true
#define DHTPIN 12
#define DHTTYPE DHT22
#define RELAYPIN 4
#define SEND_DATA_TIME_INTERVAL 10000 // 10 seconds
#define PUMP_ON_INTERVAL 2000 // 2 seconds
#define IRRIGATION_INTERVAL 1000 // 15 minutes
#define WIFI_LED 16
#define DATA_LED 5
#define ERROR_LED 0
#define SMPIN A0
/*********** CONST ***********/
/* ESP Config */
   /* Unique ESP identifier. Ex.: "6f9629a8-8827-44d2-94ed-cad4b6fe9154" */
const String ESP_UUID = "";
/* MQTT Config */
   /* MQTT Broker (perferably Mosquitto running locally) IP/HOST. Ex.: "192.168.31.61" */
const char* MQTT_BROKER_URL = "";
   /* MQTT Broker port. Ex.: 1883*/
const int MQTT_BROKER_PORT = 0;
   /* Server MQTT Topic for sending ESP Data. Ex.: "easywatering/data" */
const char* MQTT_DATA_SUB_TOPIC = "";
   /* Server MQTT Topic for receiving Irrigator pump status signal, using ESP_UUID. Ex.: "easywatering/pump/6f9629a8-8827-44d2-94ed-cad4b6fe9154" */
const char* MQTT_PUMP_SUB_TOPIC = "";
/*********** VAR ***********/
long lastConnectionTime; // Last time where ESP was connected for sending data. 
long lastIrrigationTime; // Last time where ESP irrigation was activated.
float lastSphMeasuring;  // Last Soil moisture percentage measured.
char macAddress[6]; 
String strMacAddress;
boolean PUMP_STATE = false; // Watering PUMP state (ON/OFF).
/*********** OBJECTS/INSTANCES ***********/
DHT dht(DHTPIN, DHTTYPE); // DHT Sensor config.
WiFiClient clientWIFI; // WifiClient instance for setting Wireless connection.
PubSubClient clientMQTT(clientWIFI); // PubSubClient instance for subscribing/publishing to MQTT topics.
WiFiManager wiFiManager; // WifiManager instance for ESP Wireless configuration.
Ticker ticker;
/*********** SETUP ***********/
void setup() {
  /* Serial */
  if (DEBUG) {
    Serial.begin(115200);
    Serial.println("\nInstance ID: " + String(ESP_UUID));
  }

  /* Pin Modes and States */
  lastConnectionTime = 0;
  pinMode(WIFI_LED, OUTPUT);
  pinMode(DATA_LED, OUTPUT);
  pinMode(ERROR_LED, OUTPUT);
  pinMode(RELAYPIN, OUTPUT);
  WiFi.mode(WIFI_STA);

  dht.begin();  //Starts DHT Sensor

  /* Setup WifiManager */
  //wiFiManager.resetSettings();
  wiFiManager.setDebugOutput(false);
  wiFiManager.setAPCallback(wifiManagerCB);

  if (!wiFiManager.autoConnect("EasyWatering-Manager")) {
    if (DEBUG)
      Serial.println("Failed to connect to Wi-Fi.\n");

    ESP.restart();
    delay(1000);
  }

  if (DEBUG) {
    Serial.println("WiFi Connected.");
    Serial.print("Instance IP: ");
    Serial.print(WiFi.localIP());
    Serial.print("\nMAC Address: ");
    Serial.print(WiFi.macAddress());
  }

  /* MAC Config */
  //strMacAddress = WiFi.macAddress();
  //strMacAddress.toCharArray(macAddress, 6);

  ticker.detach();

  /* MQTT Connection */
  clientMQTT.setServer(MQTT_BROKER_URL, MQTT_BROKER_PORT);
  clientMQTT.setCallback(mqttCB);

  ticker.detach();

  digitalWrite(WIFI_LED, HIGH);
  lastIrrigationTime = millis();
}

/*********** CALLBACKS ***********/
void wifiLedBlink() {
  digitalWrite(WIFI_LED, !digitalRead(WIFI_LED));
}

void wifiManagerCB(WiFiManager *wiFiManager) {
  if (DEBUG)
   Serial.println("Settings mode ON.");
   
  ticker.attach(0.2, wifiLedBlink);
}

void mqttCB(char* topic, byte* payload, unsigned int length) {
  String payloadStr = "";

  /* Loads Payload into a single string */
  for (int i = 0; i < length; i++) {
    payloadStr = payloadStr + (char)payload[i];
  }

  if (DEBUG) {
    Serial.print("\n[RECEIVED MESSAGE]: Topic: ");
    Serial.print(topic);
    Serial.print(" / Message: ");
    Serial.print(payloadStr);
  }

  /* Check if any pump command was received */
  if (String(topic) == String(MQTT_PUMP_SUB_TOPIC)) {
    if (payloadStr == "ON") {
      /* Registers when pump turns on */
      unsigned long startTime = millis();

      if (DEBUG)
        Serial.println("\nTurning Water Pump ON");

      digitalWrite(RELAYPIN, HIGH);
      delay(PUMP_ON_INTERVAL);
      digitalWrite(RELAYPIN, LOW);
      lastIrrigationTime = millis();
    } else if (payloadStr == "OFF") {
      if (DEBUG)
        Serial.println("Turning Water Pump OFF");

      digitalWrite(RELAYPIN, LOW);
    }
  }
}

void connectMQTT() {
  int tries = 0;

  while (!clientMQTT.connected() && tries < 10) {
    delay (500);
    tries ++;
  }

  if (clientMQTT.connect(macAddress)) {
    if (DEBUG)
      Serial.println("\nMQTT connected.");

    /* Subscribes to main topics */
    //clientMQTT.subscribe(MQTT_DATA_SUB_TOPIC);
    clientMQTT.subscribe(MQTT_PUMP_SUB_TOPIC);
  } else {
    if (DEBUG)
      Serial.println("Failed to connect to MQTT.");
  }
}

void autoIrrigation() {
  digitalWrite(RELAYPIN, HIGH);
  delay(PUMP_ON_INTERVAL);
  digitalWrite(RELAYPIN, LOW);
}

String readSensorData() {
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

  sh = analogRead(SMPIN);

  if (isnan(sh) || sh == 0) {
    if (DEBUG)
      Serial.println(F("Failed to read from Soil sensor!"));

    return "";
  }

  /* Soil Moisture Measurement | Multiplied by ~1.83 empirical correction factor */
  sph = ( 100 - ( (sh / 1024.00) * 100 ) ) * 1.825555;

  if (sph > 100)
    sph = 100.00;

   /* Checks if it is dry and was not irrigated in last 15 minutes */
  if (lastSphMeasuring < 40 && (sph < 40)) {
    if ((millis() - lastIrrigationTime) > IRRIGATION_INTERVAL) {
      lastIrrigationTime = millis();
    }
    
    /* Calls auto irrigation routine */
    autoIrrigation();
  }
  
  /* Builds JSON string */
  sensorData = "{\"temp\": " + String(t) + ", " + "\"umid\": " + String(h) + "," + " \"soil\": " + String(sph);
  lastSphMeasuring = sph;
  return sensorData;
}

void publishSensorData() {
  String data = "";
  /* Check if data is not empty */
  if ((data = readSensorData()) != "") {
    /* Appends ESP_UUID to payload */
    data += ", \"id\": \"" + ESP_UUID + "\"}";

    /* Loads the String into an charr array for PubSubClient Payload */
    int data_len = data.length() + 1;
    char char_arr[data_len];
    data.toCharArray(char_arr, data_len);
    /* Publish to the specified EasyWatering topic */
    clientMQTT.publish(MQTT_DATA_SUB_TOPIC, char_arr);

    digitalWrite(DATA_LED, HIGH);
    if (DEBUG) {
      Serial.print("[MESSAGE SENT]: ");
      Serial.print("Topic: ");
      Serial.print(MQTT_DATA_SUB_TOPIC);
      Serial.print(" / Message: " + data + "\n");
    }

    delay(250);
    digitalWrite(DATA_LED, LOW);
  }
}

/*********** LOOP ***********/
void loop() {
  
  if (!clientMQTT.connected()) {
    connectMQTT();
  }
  clientMQTT.loop();

  /* Check if it's time to send new data */
  if (millis() - lastConnectionTime > SEND_DATA_TIME_INTERVAL) {
    lastConnectionTime = millis();
    publishSensorData();
  }
}
