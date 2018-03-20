void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:

  //  if (Serial.available() > 0) {
  //    // read the incoming byte:
  //    int incomingByte = Serial.read();
  //
  //    // say what you got:
  //    Serial.print("I received: ");
  //    Serial.println(incomingByte);
  //  }

  delay(1000);
  Serial.println("helllo");
  Serial.println("hey");
  //  Serial.println("hey");
  //  Serial.println("sup");
}
