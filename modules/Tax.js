/**
 * @file    Innehåller modulen {@link tax}
 * @version 1.0
 * @author Hanif Bali
 */
(function(){
/**
 * Skatt modul. Som räknar ut grundavdrag, pensionsavgift, jobbskatteavdrag och kommunalskatt.
 *
 * @alias tax
 * @implements {Module}
 * @param {houseHold} houseHold Hushållet som skatten ska beräknas på
 * @constructor
 */
function tax(houseHold) {
    /**
     * Prisbasbeloppet för 2014
     * @default
     * @type {Number}
     */
    var PBB = 44400; // 2014 Prisbasbelopp
    /**
     * Inkomstbasbeloppet för 2014
     * @default
     * @type {Number}
     */
    var IBB = 56900; // 2014 Inkomstbasbelopp
    /**
     * Statlig inkomstskatt, brytpunkt  2014
     * @default
     * @type {Number}
     */
    var SKIKT1 = 420800; // 2014 Statlig inkomstskatt, brytpunkt
    /**
     * Värnskatt, brytpunkt  2014
     * @default
     * @type {Number}
     */
    var SKIKT2 = 602600; //2014 Värnskatt, brytpunkt
    /**
     * Kommunalskatt
     * @default
     * @type {Number}
     */
    var KI = 0.32; //Kommunalskatt

    /**
     * Räknar ihop total skatteskuld
     * @example
     *  tax.totalCalc();
     *  //-> -4500
     * @returns {Number}
     */
    this.totalCalc = function () {
        var grownUps = houseHold.getPersons();
        var totalTax = 0;
        for (var i = 0; i < grownUps.length; i++) {
            totalTax -= this.totalTax(grownUps[i]) / 12;
        }
        return Math.round(totalTax);
    };
    /**
     * Totalt jobbskatteavdrag för hela hushållet.
     *
     * @returns {Number}
     */
    this.totalJSK = function () {
        var grownUps = houseHold.getPersons();
        var jsk = 0;
        for (var i = 0; i < grownUps.length; i++) {
            jsk += this.jobbskatteavdrag(grownUps[i]);
        }
        return jsk;
    };
    /**
     * Räknar ihop total skatt för en person
     *
     * @param {Person} person Personen att beräkna skatten för
     * @returns {Number}
     */
    this.totalTax = function (person) {
        var JA = Math.round(this.jobbskatteavdrag(person));
        var GA = this.grundAvdrag(person);
        var TI = Math.round(person.getTaxableIncome());
        var totalt = -JA + (TI - GA) * KI + Math.max(0, (TI - GA - SKIKT1) * 0.20) + (Math.max(0, (TI - GA - SKIKT2) * 0.05))
        return Math.round(Math.max(0, totalt));
    };
    /**
     * Runda upp en siffra till närmsta hundratal
     * @param {Number} number siffran som ska avrundas
     * @returns {Number}
     */
    this.rundaUppHundra = function (number) {
        return Math.ceil(number / 100) * 100;
    };
    /**
     * Runda ner en siffra till närmsta hundratal
     * @param {Number} number siffran som ska avrundas
     * @returns {Number}
     */
    this.rundaNerHundra = function (number) {
        return Math.floor(number / 100) * 100;
    };

    /**
     * Räknar ut Jobbskatteavdraget för en person.
     * @param {Person} person Personen att beräkna jobbskatteavdraget på.
     * @returns {Number}
     */
    this.jobbskatteavdrag = function (person) {
        var GA = this.grundAvdrag(person);
        var TI = this.rundaNerHundra(person.getTaxableIncome());
        var PA = this.rundaUppHundra(this.pensionsavgift(person));
        var jsk = 0;
        if (person.age < 65) {
            jsk = this.jskUnder65(person);
        } else {
            jsk = this.jskOver65(person);
        }

        if (jsk > (TI - GA - PA)) {

            jsk = TI - GA - PA;
        }
        return (jsk);

    };
    /**
     * Jobbskatteavdrag för någon över 65 år
     *
     * @param {Person} person Personen att beräkna jobbskatteavdraget på.
     * @returns {Number}
     */
    this.jskOver65 = function (person) {
        var AI = this.rundaNerHundra(person.getWorkIncome());
        if (AI < 100000) {
            return 0.2 * AI;
        } else if (AI <= 300000) {
            return 15000 + 0.05 * AI
        } else if (AI > 300000) {
            return 30000;
        }

    };
    /**
     * Jobbskatteavdrag för någon under 65 år
     *
     * @param {Person} person Personen att beräkna jobbskatteavdraget på.
     * @returns {Number}
     */
    this.jskUnder65 = function (person) {
        /*
         Inkomstskattelag 1999:1229 67 kap. 5 § 2014

         https://lagen.nu/1999:1229#K67P7S2
         Arbetsinkomst som Skattereduktion beskattas i Sverige
         överstiger inte 0,91 prisbasbelopp	skillnaden mellan arbetsinkomsterna och grundavdraget, multiplicerad med skattesatsen för kommunal inkomstskatt
         överstiger 0,91 men inte 2,94 prisbasbelopp	skillnaden mellan å ena sidan summan av 0,91 prisbasbelopp och 33,2 procent av arbetsinkomsterna mellan 0,91 och 2,94 prisbasbelopp och å andra sidan grundavdraget, multiplicerad med skattesatsen för kommunal inkomstskatt
         överstiger 2,94 men inte 8,08 prisbasbelopp	skillnaden mellan å ena sidan summan av 1,584 prisbasbelopp och 11,1 procent av arbetsinkomsterna mellan 2,94 och 8,08 prisbasbelopp och å andra sidan grundavdraget, multiplicerad med skattesatsen för kommunal inkomstskatt
         överstiger 8,08 prisbasbelopp	skillnaden mellan 2,155 prisbasbelopp och grundavdraget, multiplicerad med skattesatsen för kommunal inkomstskatt
         * */
        var AI = this.rundaNerHundra(person.getWorkIncome());
        var GA = this.grundAvdrag(person);

        if (AI < 0.91 * PBB) {
            return (AI - GA) * KI
        } else if (AI <= 2.94 * PBB) {
            return (0.91 * PBB + (0.332 * (AI - (0.91 * PBB))) - GA) * KI;
        } else if (AI <= 8.08 * PBB) {
            return (1.584 * PBB + 0.11 * (AI - 2.94 * PBB) - GA) * KI
        } else if (AI > 8.08 * PBB) {
            return ((2.155 * PBB) - GA) * KI;
        }


    };
    /**
     * Beräknar pensionsavgift för en person.
     *
     * @param {Person} person Personen att beräkna på.
     * @returns {Number}
     */
    this.pensionsavgift = function (person) {
        var avgift = 0;
        if (person.getTaxableIncome() > 0.423 * IBB && person.getTaxableIncome() < 8.07 * IBB) {
            avgift = 0.07 * person.getTaxableIncome();
        } else if (person.getTaxableIncome() >= 8.07 * IBB) {
            avgift = 0.07 * (8.07 * IBB);
        }
        return this.rundaUppHundra(avgift)

    };
    /**
     * Räknar ut grundavdraget för en person
     *
     * @param {Person} person Personen att beräkna på.
     * @returns {Number}
     */
    this.grundAvdrag = function (person) {
        var grundavdrag = 0;
        var TI = this.rundaNerHundra(person.getTaxableIncome());
        if (person.age < 65) {
            grundavdrag = this.grundAvdragUnder65(TI);
        } else {
            grundavdrag = this.grundAvdragOver65(TI);
        }
        if (grundavdrag > TI) {
            grundavdrag = TI;
        }
        return this.rundaUppHundra(grundavdrag)
    };
    /**
     * Beräknar grundavdraget för en årslön på en person under 65.
     *
     * @param {Number} income Taxerbar årsinkomst
     * @returns {Number}
     */
    this.grundAvdragUnder65 = function (income) {
        /*
         *  Inkomstskattelag 1999:1229 63 kap. 2 § 2014
         *  https://lagen.nu/1999:1229#K63P2S1
         *
         Fastställd förvärvsinkoms
         överstiger inte 0,99 prisbasbelopp	0,423 prisbasbelopp
         överstiger 0,99 men inte 2,72 prisbasbelopp	0,423 prisbasbelopp ökat med 20 procent av det belopp med vilket den fastställda förvärvsinkomsten överstiger 0,99 prisbasbelopp
         överstiger 2,72 men inte 3,11 prisbasbelopp   0,77 prisbasbelopp
         överstiger 3,11 men inte 7,88 prisbasbelopp	0,77 prisbasbelopp minskat med 10 procent av det belopp med vilket den fastställda förvärvsinkomsten överstiger 3,11 prisbasbelopp
         överstiger 7,88 prisbasbelopp 0,293 prisbasbelopp

         *
         */

        if (income < 0.99 * PBB) {
            return 0.423 * PBB
        }
        else if (income < 2.72 * PBB) {
            return 0.423 * PBB + 0.2 * (income - 0.99 * PBB)
        } else if (income < 3.11 * PBB) {
            return 0.77 * PBB
        }
        else if (income < 7.88 * PBB) {
            return 0.77 * PBB - (0.1 * (income - 3.11 * PBB));
        } else if (income >= 7.88 * PBB) {
            return 0.293 * PBB;
        }
    };
    /**
     * Beräknar grundavdraget för en årslön för en person under 65.
     *
     * @param {Number} income Taxerbar årsinkomst
     * @returns {Number}
     */
    this.grundAvdragOver65 = function (income) {
        if (income <= 0.99 * PBB) {
            return 0.682 * PBB
        }
        else if (income <= 1.105 * PBB) {
            return (0.880 * PBB) - 0.2 * income
        }
        else if (income <= 2.72 * PBB) {
            return (0.753 * PBB) - 0.085 * income
        }
        else if (income <= 3.11 * PBB) {
            return (0.208 * PBB) + 0.115 * income
        }
        else if (income <= 3.69 * PBB) {
            return (0.215 * income) - 0.103 * PBB
        }
        else if (income <= 4.785 * PBB) {
            return (0.322 * PBB) + 0.1 * income
        }
        else if (income <= 7.88 * PBB) {
            return (0.753 * PBB) + 0.01 * income
        }
        else if (income <= 12.43 * PBB) {
            return (1.541 * PBB) - 0.09 * income
        }
        else if (income > 12.43 * PBB) {
            return 0.422 * PBB
        }

    }
}
marginalCalc.addModule("tax", tax, 200);

marginalCalc.scriptLoader.loadComplete("tax");
})();