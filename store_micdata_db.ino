#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

#define MIC_PIN 34  // analog pin

// Your WiFi
const char* ssid = "YourWiFiSSID";
const char* password = "YourWiFiPassword";

// Supabase REST API
const char* supabase_url = "https://YOUR_PROJECT.supabase.co/rest/v1/mic_data";
const char* supabase_key = "YOUR_ANON_KEY";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected!");
}

void loop() {
  int micValue = analogRead(MIC_PIN);

  // Convert to Voltage (0–3.3V range on ESP32)
  float voltage = (micValue / 4095.0) * 3.3;

  Serial.printf("Raw: %d, Voltage: %.3f V\n", micValue, voltage);

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(supabase_url);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("apikey", supabase_key);
    http.addHeader("Authorization", String("Bearer ") + supabase_key);

    // JSON payload
    String payload;
    StaticJsonDocument<200> doc;
    doc["raw_value"] = micValue;
    doc["voltage"] = voltage;
    serializeJson(doc, payload);

    int httpResponseCode = http.POST(payload);

    if (httpResponseCode > 0) {
      Serial.printf("Data sent! Code: %d\n", httpResponseCode);
    } else {
      Serial.printf("Error sending: %s\n", http.errorToString(httpResponseCode).c_str());
    }
    http.end();
  }

  delay(2000); // every 2s
}
