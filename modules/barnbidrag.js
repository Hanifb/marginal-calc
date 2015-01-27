/* Socialförsäkringsbalken (2010:110) 14 kap
 * Denna modul räknar ut barnbidraget och flerbarnstillägget
 *
 * Antaganden:  att barnen bor hos den vuxna i hushållet
 *              att den vuxna har ensam vårdnad av barnet
 *              att barnen inte går i grundskolan efter 15 års ålder
 *
 */

marginalCalc.addModule("barnBidrag", function (houseHold) {
    const Barnbidrag = 1050;

    this.totalCalc = function () {
        return this.getBarnBidrag() + this.getFlerbarnstillagg();
    };
    /**
     * Barnbidrag för samtliga barn
     *
     * Denna funktion sätter barnbidraget även på
     * @return int barnbidrag
     */
    this.getBarnBidrag = function () {

        var totalBarnbidrag = 0;
        var kids = houseHold.getPersonsBelowAge(16);

        for (var a = 0; a < kids.length; a++) {
            totalBarnbidrag += kids[a].barnbidrag = Barnbidrag;
        }
        return totalBarnbidrag;
    };
    /**
     * Flerbarnstillägg
     * @return int flerbarnstillägg
     */
    this.getFlerbarnstillagg = function () {
        var persons = houseHold.getPersonsBelowAge(21);
      switch(persons.length){
          case 0:
          case 1:
              return 0;
              break;
          case 2:
              return 150;
              break;
          case 3:
              return 604;
          break;
          case 4:
              return 1614;
          default:
              /*
               *  1050 kr för varje barn över 4 så adderar du
               */
              var flerbarnsTillag = 2864;
              for(var i = 0; i < (persons.length - 5); i++){
                  flerbarnsTillag += 1250;
              }
              return flerbarnsTillag;
              break;
      }

    }
}, 101);
/*
 Studiestödslag (1999:1395) 2 kap.
 */
marginalCalc.addModule("studieBidrag", function (houseHold) {
    const Studiebidrag = 1050;
    this.totalCalc = function () {
        return this.getStudieBidrag();
    };

    this.getStudieBidrag = function () {
        var income = houseHold.getHouseHoldTaxableIncome();
        var extra = 0;
        if (income < 85000) {
            extra = 855;
        } else if (income > 104999) {
            extra = 570;
        } else if (income > 124999) {
            extra = 285;
        }
        var persons = houseHold.getPersons();
        var studieBidrag = 0;
        for (var a = 0; a < persons.length; a++) {
            if (persons[a].age > 15 && persons[a].age < 21) {
                studieBidrag += persons[a].studiebidrag = Studiebidrag + extra;
            }
        }
        return studieBidrag;
    }
}, 102);

marginalCalc.scriptLoader.loadComplete("barnbidrag");