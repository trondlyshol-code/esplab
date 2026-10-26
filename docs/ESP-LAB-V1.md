# ESP-Lab v1

## Formål

ESP-Lab skal vere ein webbasert undervisningssimulator for vidaregåande elektro/elektronikk. Elevane skal kunne opne løysinga i nettlesaren frå skulen sitt nettverk utan lokal installasjon.

Første versjon byggjer vidare på Velxio, men skal vere kraftig forenkla og målretta mot undervisning med Arduino Uno og ESP32.

## V1 – støtta mikrokontrollerar

1. ESP32 DevKit V1
2. Arduino Uno

Andre kort skal skjulast frå elevgrensesnittet i V1, men kodebasen skal ikkje øydeleggast slik at dei ikkje kan aktiverast igjen seinare.

## V1 – komponentar

Det originale Velxio-komponentbiblioteket skal behaldast. I tillegg skal komponentveljaren ha eit eige **Elegoo Kit**-filter som samlar komponentane frå Elegoo-settet elevane brukar.

Elegoo-filteret skal berre vise delar som faktisk har ei fungerande simulering. Dersom ein fysisk del frå settet ikkje finst i simulatoren enno, skal vi ikkje late som ein annan modell er den same. DHT11 skal til dømes ikkje erstattast av DHT22 berre for å fylle menyen.

Første Elegoo-filter inneheld mellom anna:

- LED og RGB LED
- motstandar
- trykknapp og brytar
- potensiometer
- buzzer
- servo
- HC-SR04
- joystick
- PIR
- LDR/photoresistor
- SSD1306 OLED
- 4x4 keypad
- steppermotor
- L293D
- relé
- 7-segment
- MPU6050 som næraste støtta IMU-modell
- NTC temperaturfølar
- IR-mottakar og fjernkontroll
- 2N2222

Manglande Elegoo-delar blir lagt til stegvis når vi har reell simulatorstøtte for dei.

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

V1 skal vere enklare enn original Velxio.

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
- Start / Stopp
- compiler output
- Serial Monitor

### Språk

V1 skal ha desse språka i elevgrensesnittet:

- English
- Norsk
- Polski
- Українська

Engelsk fungerer som fallback for tekstar som enno ikkje er omsette. Teknisk terminologi som GPIO, Serial Monitor, PWM, I2C og SPI kan behaldast der det gir meining.

## Avgrensing i V1

Dette skal ikkje prioriterast som nye simulatorfunksjonar i første leveranse:

- WiFi
- Bluetooth/BLE
- NTP
- MQTT
- fleire virtuelle ESP32-kort samtidig
- eigne nye implementasjonar av RFID
- eigne nye implementasjonar av DHT11
- lærarinnlogging
- elevkontoar
- automatisk vurdering

Originalfunksjonar som allereie finst i Velxio kan framleis ligge i kodebasen og komponentbiblioteket.

## Vidare roadmap

### V2 – sensorar og display

- DHT11
- LDR / photocell
- joystick
- PIR
- tilt switch
- HC-SR04
- OLED SSD1306
- termistor

### V3 – bussar og meir avansert elektronikk

- I2C
- SPI
- RC522
- MPU-6500
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

### Utvikling og test

For raske V1-frontendtestar bruker vi `Dockerfile.esplab-test`. Den byggjer ESP-Lab-frontend frå vår branch og legg han oppå den offisielle self-hosted Velxio-runtimecontaineren. Dermed kan vi teste UI-endringar utan å bygge QEMU/ESP-IDF-runtime på nytt kvar gong.

Ein fullstendig sjølvstendig produksjonsbuild skal seinare bruke `Dockerfile.standalone` med den QEMU-runtime-metoden som er tillaten og dokumentert av upstream.

### Lisens

ESP-Lab er basert på Velxio og må halde fram med å oppfylle vilkåra i AGPLv3. Opphav og lisensinformasjon skal ikkje fjernast.

## Første tekniske milepæl

V1 er godkjend når følgjande scenario fungerer:

1. Elev opnar ESP-Lab i nettlesar.
2. Elev vel ESP32 DevKit V1 eller Arduino Uno.
3. Elev legg inn LED og motstand.
4. Elev koplar LED til ein GPIO.
5. Elev skriv eit enkelt Blink-program.
6. Elev trykker Start.
7. LED blinkar i simulatoren.
8. `Serial.println()` blir vist i Serial Monitor.
9. Prosjektet kan lagrast og opnast igjen.

## Prinsipp for vidare utvikling

- Behald Velxio sin fungerande emulatorarkitektur.
- Fjern minst mogleg frå backend i starten.
- Skjul heller funksjonar i elevgrensesnittet enn å slette dei frå kodebasen.
- Behald heile originalbiblioteket, men gi elevane eit tydeleg Elegoo-filter.
- Bygg Elegoo-støtta stegvis etter dei fysiske komponentane elevane faktisk brukar.
- Test kvar komponent både med ESP32 og Arduino Uno der det gir fagleg meining.
