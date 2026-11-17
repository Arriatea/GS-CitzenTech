/*
  Gota a Gota — controlador do poço, da caixa d'água e da horta (ESP32)

  Peças simuladas no Wokwi:
  - Sensor ultrassônico (HC-SR04) na tampa da caixa  -> nível da caixa
  - Sensor de luz (LDR)                               -> "sol" (se o painel solar tem energia)
  - Potenciômetro                                     -> umidade da terra do canteiro
  - Botão azul                                        -> previsão "vai chover amanhã" (liga/desliga)
  - LED azul                                          -> bomba do poço (só funciona com sol)
  - LED branco                                        -> válvula da caixa (irriga sem sol)
  - LEDs verde/amarelo/vermelho                       -> semáforo da caixa
  - Display LCD                                       -> painel no local

  Regras:
  - Com sol: a bomba solar liga, enche a caixa e, se a terra estiver seca, irriga direto do poço.
  - Sem sol: a bomba desliga; se a terra estiver seca, a válvula abre e irriga com a água da caixa.
  - A caixa guarda uma RESERVA PARA BEBER: abaixo dela, a válvula não abre para a horta.
  - Se vai chover amanhã, a irrigação fica pausada (a bomba ainda enche a caixa).
  - A cada 2 segundos, o ESP32 monta o JSON que seria enviado para a API Java.
*/

#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// ---------- Pinos ----------
const int PINO_TRIG = 5;
const int PINO_ECHO = 18;
const int PINO_LUZ = 34;      // sensor de luz (saída analógica)
const int PINO_SOLO = 35;     // potenciômetro = umidade da terra
const int PINO_CHUVA = 4;     // botão "vai chover amanhã"
const int PINO_VERDE = 25;
const int PINO_AMARELO = 26;
const int PINO_VERMELHO = 27;
const int PINO_BOMBA = 14;
const int PINO_VALVULA = 13;

// ---------- Ajustes ----------
const float ALTURA_CAIXA_CM = 100.0;  // distância do sensor até o fundo da caixa
const int LIMIAR_SOL = 2000;          // leitura do sensor de luz: abaixo disso = tem sol (veja o Serial)
const int TERRA_SECA = 40;            // % de umidade abaixo do qual a horta precisa de água
const int RESERVA_BEBER = 20;         // % da caixa guardado para beber

LiquidCrystal_I2C lcd(0x27, 16, 2);

bool chuvaAmanha = false;
bool botaoAntes = HIGH;
unsigned long ultimoEnvio = 0;
bool telaAlternada = false;

float medirDistanciaCm() {
  digitalWrite(PINO_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PINO_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PINO_TRIG, LOW);
  long duracao = pulseIn(PINO_ECHO, HIGH, 30000);
  return duracao * 0.0343 / 2.0;
}

int nivelCaixa() {
  float distancia = medirDistanciaCm();
  int nivel = (int)((ALTURA_CAIXA_CM - distancia) / ALTURA_CAIXA_CM * 100.0);
  return constrain(nivel, 0, 100);
}

void setup() {
  Serial.begin(115200);
  pinMode(PINO_TRIG, OUTPUT);
  pinMode(PINO_ECHO, INPUT);
  pinMode(PINO_CHUVA, INPUT_PULLUP);
  pinMode(PINO_VERDE, OUTPUT);
  pinMode(PINO_AMARELO, OUTPUT);
  pinMode(PINO_VERMELHO, OUTPUT);
  pinMode(PINO_BOMBA, OUTPUT);
  pinMode(PINO_VALVULA, OUTPUT);

  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("  Gota a Gota  ");
  lcd.setCursor(0, 1);
  lcd.print("  iniciando... ");
  delay(1500);
}

void loop() {
  // --- botão de previsão de chuva (liga/desliga a cada toque) ---
  bool botaoAgora = digitalRead(PINO_CHUVA);
  if (botaoAntes == HIGH && botaoAgora == LOW) {
    chuvaAmanha = !chuvaAmanha;
  }
  botaoAntes = botaoAgora;

  // --- leituras ---
  int leituraLuz = analogRead(PINO_LUZ);
  bool temSol = leituraLuz < LIMIAR_SOL;
  int nivel = nivelCaixa();
  int umidadeSolo = map(analogRead(PINO_SOLO), 0, 4095, 0, 100);
  bool terraSeca = umidadeSolo < TERRA_SECA;
  bool precisaIrrigar = terraSeca && !chuvaAmanha;

  // --- decisões ---
  bool bomba = temSol;                                       // bomba solar: só com sol
  bool valvula = !temSol && precisaIrrigar && nivel > RESERVA_BEBER;  // sem sol: água da caixa

  // semáforo da caixa
  String semaforo;
  if (nivel >= 50) semaforo = "verde";
  else if (nivel >= RESERVA_BEBER) semaforo = "amarelo";
  else semaforo = "vermelho";

  digitalWrite(PINO_BOMBA, bomba);
  digitalWrite(PINO_VALVULA, valvula);
  digitalWrite(PINO_VERDE, semaforo == "verde");
  digitalWrite(PINO_AMARELO, semaforo == "amarelo");
  digitalWrite(PINO_VERMELHO, semaforo == "vermelho");

  // --- display e envio a cada 2 segundos ---
  if (millis() - ultimoEnvio > 2000) {
    ultimoEnvio = millis();
    telaAlternada = !telaAlternada;

    lcd.clear();
    if (!telaAlternada) {
      lcd.setCursor(0, 0);
      lcd.print(temSol ? "Sol  Bomba:LIGA" : "Noite Bomba:DESL");
      lcd.setCursor(0, 1);
      lcd.print("Caixa ");
      lcd.print(nivel);
      lcd.print("% ");
      lcd.print(semaforo);
    } else {
      lcd.setCursor(0, 0);
      lcd.print("Terra ");
      lcd.print(umidadeSolo);
      lcd.print("% ");
      lcd.print(terraSeca ? "seca" : "ok");
      lcd.setCursor(0, 1);
      if (chuvaAmanha) lcd.print("Chuva: pausado");
      else if (valvula) lcd.print("Irriga: caixa");
      else if (bomba && precisaIrrigar) lcd.print("Irriga: poco");
      else lcd.print("Irriga: nao");
    }

    // JSON que seria enviado para a API Java (POST /leituras)
    Serial.print("{\"nivelCaixa\":");
    Serial.print(nivel);
    Serial.print(",\"umidadeSolo\":");
    Serial.print(umidadeSolo);
    Serial.print(",\"temSol\":");
    Serial.print(temSol ? "true" : "false");
    Serial.print(",\"bomba\":");
    Serial.print(bomba ? "true" : "false");
    Serial.print(",\"valvula\":");
    Serial.print(valvula ? "true" : "false");
    Serial.print(",\"irrigando\":");
    Serial.print((valvula || (bomba && precisaIrrigar)) ? "true" : "false");
    Serial.print(",\"chuvaAmanha\":");
    Serial.print(chuvaAmanha ? "true" : "false");
    Serial.print(",\"semaforo\":\"");
    Serial.print(semaforo);
    Serial.print("\",\"leituraLuz\":");
    Serial.print(leituraLuz);
    Serial.println("}");
  }

  delay(50);
}
