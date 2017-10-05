  int a = 2;
  int b = 3;
  int c = 4;
  int d = 5;
  int e = 6;
  int f = 7;
  int g = 8;

void setup() {
  pinMode(a, OUTPUT);  
  pinMode(b, OUTPUT);
  pinMode(c, OUTPUT);
  pinMode(d, OUTPUT);
  pinMode(e, OUTPUT);
  pinMode(f, OUTPUT);
  pinMode(g, OUTPUT);
}

void loop() {
  for(int i=0; i<10; i++){
    writeNumber(i);
    delay(1000);
  }
}

void writeNumber(int val){
  String codes[] = {
     "1111110",
     "0110000",
     "1101101",
     "1111001",
     "0110011",
     "1011011",
     "1011111",
     "1110000",
     "1111111",
     "1111011",
  };

  String code = codes[val];

  digitalWrite(a, code[0]!='1');
  digitalWrite(b, code[1]!='1');
  digitalWrite(c, code[2]!='1');
  digitalWrite(d, code[3]!='1');
  digitalWrite(e, code[4]!='1');
  digitalWrite(f, code[5]!='1');
  digitalWrite(g, code[6]!='1');
}

