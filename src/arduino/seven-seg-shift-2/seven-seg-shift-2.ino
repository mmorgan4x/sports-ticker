int dataIn = 2;
int clk = 4;
int latch = 3;
unsigned long time = millis();

void setup() {
  pinMode(dataIn, OUTPUT);
  pinMode(clk, OUTPUT);
  pinMode(latch, OUTPUT);
}

void loop() {

  for (int i = 0; i < 100; i++) {
    writeNumber(i % 10);
    writeNumber(i / 10);
    cycle(latch);

    while ((time + 1000) > millis());
    time = millis();
  }
}

void writeNumber(int val) {
  String codes[] = {
    "11111100",
    "01100000",
    "11011010",
    "11110010",
    "01100110",
    "10110110",
    "10111110",
    "11100000",
    "11111110",
    "11110110",
  };

  String code = codes[val];

  for (int i = 0; i < 8; i++) {
    digitalWrite(dataIn, code[7 - i] != '1');
    delay(1);
    cycle(clk);
  }
}

void cycle(int pin) {
  digitalWrite(pin, HIGH);
  delay(1);
  digitalWrite(pin, LOW);
  delay(1);
}

