# Jukebox Fusion

Im Projekt „Jukebox Fusion“ wird das KI-Tool Jukebox verwendet, um musikalische Audioaufnahmen aus Venedig und der Biennale reproduzieren und zu ergänzen. Zudem wird eine Webseite erstellt, auf der die künst-lich hergestellte Klanglandschaft zu hören ist. Des weiterem ist es möglich auf der Webseite mit Interaktionen weitere Audioeindrücke aus Venedig zu hören. 

## Technologien


### Audio – Jukebox AI, FL Studio, Adobe Audition

Jukebox: Jukebox ist ein neuronales Netz das Musik generiert. Dabei benötigt es eine Audiodatei und ein Genre als Input. Zudem ist es möglich einen Künstler auszuwählen, den die KI versucht zu imitieren. Zuletzt muss die Länge des Outputs eingestellt werden.

### Webseite – JavaScript, React, Web Audio API, Tuna.js

Die Webseite hat das Ziel durch viel minimalistische Dynamik die atmosphärische Musik, die durch die AI generiert wurde zu ergänzen.

Die Webseite wurde größtenteils mit JavaScript in eine React-Projektstruktur entwickelt. Das zentrale Element der Webseite sind die Partikel die permanent neu in einem Canvas-Element gerendert werden. Mithilfe der Web Audio API, können wir Audiodateien beliebig abspielen. Für die Web Audio API haben wir Tuna.js benutzt. Das ist eine JS-Library die auf die Web Audio API aufbaut und nahezu identisch funktioniert. Neben der Interaktivität mit Mauscursor und Partikeln, wollten wir auch eine Interaktivität zwischen Mauscursor und Audio herstellen. Bei Bewegung der Maus über die Webseite ändern sich die Parameter der einzelnen Audioeffekte. 
