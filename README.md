# marginal-calc
## Marginaleffektskalkylator i HTML5 och Javscript

Kom igång:
----------

marginalCalc använder olika moduler som kan i samklang med varandra räkna ut olika bidrag eller skatter.
Medföljande moduler är just nu:

*   Barnbidrag
*   Socialbidrag
*   Studiebidrag
*   Bostadsbidrag
*   Skattesystem (Grundavdrag, Pensionsavgift, Jobbskatteavdrag, Kommunalskatt)

## Installation:
Du behöver endast inkludera **marginalCalc.js** samt ha en mapp som heter *modules* där alla moduler ligger.

## Exempel:
För vårt exempel så ska vi börja med att räkna ett bostadsbidrag. Först ska vi ladda in alla moduler vi behöver. Bostadsbidraget är beroende av modulen Household för att kunna fungera, därför laddar vi in den.

    marginalCalc.scriptLoader.addScript(["houseHold", "bostadsBidrag"])

Därefter ska vi skapa hushållet, marginalCalc håller reda på alla moduler som är beroende av varandra åt dig, men du måste definiera vilka moduler du vill direkt tillgång till som argument i funktionen marginalCalc.run:

    marginalCalc.run(function(houseHold, bostadsBidrag){

    });

Nu vill vi addera hushållet, då ska vi först skapa några personer, det gör vi med funktionen **Person(salary, age)**. Låt oss göra personen Hanif till 24 år gammal och en inkomst på 2000kr i månaden.


        var Hanif = new Person(24, 2000);
        houseHold.addPerson(Hanif);


Därefter ska vi skapa själva lägenheten, det gör vi med funktionen **Housing(sqmtrs, rent, rental)**, låt oss ge Hanif en lägenhet på 30 kvadrat, som är en hyresrätt (i wish), och har en hyra på 4000 kr (låt oss drömma).

    var Lgh = new Houseing(30, 4000, true);
    household.addHouse(Lgh);

Om vi vill få ut Hanifs bostadsbidrag så behöver vi endast:

     alert(bostadsBidrag.totalCalc());

Hela funktionen ser nu ut som:

    marginalCalc.run(function(houseHold, bostadsBidrag){
        var Hanif = new Person(24, 2000);
        houseHold.addPerson(Hanif);

        var Lgh = new Housing(30, 4000, true);
        household.addHouse(Lgh);

        alert(bostadsBidrag.totalCalc());
    });

# Vad mer kan du göra?
För fler exempel på vad man kan göra i väntan på en full dokumentation av alla funktioner så kan du spana in demot som inkluderas med paketet.

