# ESP-Lab v1

## Formål

ESP-Lab skal vere ein webbasert undervisningssimulator for vidaregåande elektro/elektronikk. Elevane skal kunne opne løysinga i nettlesaren frå skulen sitt nettverk utan lokal installasjon.

Første versjon byggjer vidare på Velxio, men skal vere målretta mot undervisning med Arduino Uno og ESP32.

## V1 – støtta mikrokontrollerar

1. ESP32 DevKit V1
2. Arduino Uno

Andre kort skal skjulast frå elevgrensesnittet i V1, men kodebasen skal ikkje øydeleggast slik at dei ikkje kan aktiverast igjen seinare.

## V1 – komponentbibliotek

ESP-Lab skal **behalde heile komponentbiblioteket frå original Velxio**. Vi skal ikkje fjerne komponentar berre for å gjere elevgrensesnittet enklare.

I komponentveljaren skal det i tillegg vere eit eige filter:

- **Elegoo Kit**

Dette filteret samlar dei komponentane frå Elegoo-settet som allereie har ei reell simulatorimplementering. Ein komponent skal ikkje visast som ein annan modell berre fordi funksjonen liknar. Til dømes skal DHT22 ikkje presenterast som DHT11.

Første verifiserte Elegoo-utval omfattar mellom anna:

- LED og RGB LED
- motstandar
- trykknapp og brytar
- potensiometer
- buzzer
- servo
- HC-SR04
- joystick
- PIR
- LDR / fotoresistor
- OLED SSD1306
- keypad
- steppermotor
- L293D
- relé
- 7-segment
- MPU6050
- termistor
- IR-mottakar og IR-fjernkontroll
- transistor

Komponentar frå settet som manglar ei passande simulatorimplementering, blir lagde til seinare.

## V1 – kode og simulering

Elevane skal kunne:

- skrive Arduino C++ i kodeeditoren
- kompilere kode
- starte simulering
- stoppe simulering
- sjå GPIO-endringar visuelt
- bruke Serial Monitor
- sende tekst frå Serial Monitor til programmet når dette er støtta av emulatoren
- lagre prosjekt
- opne prosjekt igjen

### Minimum API som må fungere

- `pinMode()`
- `digitalWrite()`
- `digitalRead()`
- `analogRead()`
- PWM / `analogWrite()` eller ESP32-ekvivalent
- `delay()`
- `millis()`
- `Serial.begin()`
- `Serial.print()`
- `Serial.println()`
- Servo-bibliotek for relevant kort

## Brukargrensesnitt

V1 skal vere enklare og meir undervisningsretta enn original Velxio, utan å fjerne simulatorfunksjonar unødvendig.

### Startskjerm

Elev vel eitt av to kort:

- Arduino Uno
- ESP32 DevKit V1

### Arbeidsflate

Arbeidsflata skal ha:

- prosjektfiler til venstre
- kodeeditor
- simulator/canvas
- komponentveljar
- eige Elegoo Kit-filter
- Start / Stopp
- compiler output
- Serial Monitor

### Språk

ESP-Lab V1 skal støtte:

- norsk
- engelsk
- polsk
- ukrainsk

Engelsk fungerer som fallback dersom ei tekststreng enno ikkje er omsett. Teknisk terminologi som GPIO, Serial Monitor, PWM, I2C og SPI kan behaldast der det gir meining.

## Avgrensing i V1

Dette skal ikkje prioriterast som eigne ESP-Lab-funksjonar i første leveranse:

- full WiFi-simulering til undervisningsopplegga
- Bluetooth/BLE-opplegg
- NTP-opplegg
- MQTT-opplegg
- fleire virtuelle ESP32-kort samtidig som undervisningsscenario
- eigne implementeringar for manglande Elegoo-komponentar
- lærarinnlogging
- elevkontoar
- automatisk vurdering

Original Velxio-funksjonalitet kan framleis liggje i kodebasen og vere tilgjengeleg der ho allereie fungerer.

## Vidare roadmap

### V2 – Elegoo-komponentar og sensorar

- DHT11
- kontrollere LDR / photocell mot fysisk sett
- kontrollere joystick
- kontrollere PIR
- kontrollere tilt switch
- kontrollere HC-SR04
- kontrollere OLED SSD1306
- kontrollere termistor
- manglande sensorar frå Elegoo-settet

### V3 – bussar og meir avansert elektronikk

- I2C-undervisningsopplegg
- SPI-undervisningsopplegg
- RC522
- MPU-6500 / MPU6050-avklaring mot fysisk sett
- 74HC595
- 1-sifra 7-segment
- 4-sifra 7-segment
- 4x4 keypad

### V4 – motor og styring

- DC-motor
- L293D
- relé
- 28BYJ-48 steppermotor
- ULN2003

### V5 – nettverk og IoT

- WiFi STA
- WiFi AP
- AP + STA
- webserver på ESP32
- WiFi-konfigurasjonsportal
- NTP
- TCP mellom to ESP32
- BLE mellom nettlesar og ESP32
- BLE mellom to ESP32

## Teknisk arkitektur

### Klient

- webbasert
- køyrer i moderne Chromium-basert nettlesar
- Arduino Uno kan emulerast i nettlesaren
- ESP32-emulering køyrer via backend/QEMU

### Server

- Docker-basert
- køyrer på lokal skuleserver
- ingen installasjon nødvendig på elev-PC
- prosjektdata skal kunne lagrast sentralt

### Lisens

ESP-Lab er basert på Velxio og må halde fram med å oppfylle vilkåra i AGPLv3. Opphav og lisensinformasjon skal ikkje fjernast.

## Første tekniske milepæl

V1 er godkjend når følgjande scenario fungerer:

1. Elev opnar ESP-Lab i nettlesar.
2. Elev vel ESP32 DevKit V1 eller Arduino Uno.
3. Elev opnar komponentveljaren og kan velje **Elegoo Kit** eller heile originalbiblioteket.
4. Elev legg inn LED og motstand.
5. Elev koplar LED til ein GPIO.
6. Elev skriv eit enkelt Blink-program.
7. Elev trykker Start.
8. LED blinkar i simulatoren.
9. `Serial.println()` blir vist i Serial Monitor.
10. Prosjektet kan lagrast og opnast igjen.

## Prinsipp for vidare utvikling

- Behald Velxio sin fungerande emulatorarkitektur.
- Behald det komplette originalbiblioteket av komponentar.
- Bruk Elegoo Kit-filteret som snarveg til undervisningsutstyret.
- Fjern minst mogleg frå backend i starten.
- Skjul heller funksjonar i elevgrensesnittet enn å slette dei frå kodebasen.
- Legg berre ein Elegoo-komponent i filteret når simulatoren faktisk har ei passande implementering.
- Test kvar relevant komponent både med ESP32 og Arduino Uno der det gir fagleg meining.
