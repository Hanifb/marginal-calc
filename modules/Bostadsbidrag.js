marginalCalc.addModule("bostadsBidrag", function(houseHold){
    this.totalCalc = function (){
        return this.getBostadsBidrag();
    };
    this.getBostadsBidrag = function () {
        var rentBenefit = 0;
        var house = houseHold.getHouse();
        if (houseHold.getKids().length) {


            var fast = 0;
            var toplimit = 0;
            var sqmtrsLimit = 0;
            var floor = 0;
            var bottomlimit;
            switch (houseHold.getKids().length) {
                case 1:
                    fast = 1500;
                    bottomlimit = 1400;
                    toplimit = 5300;
                    sqmtrsLimit = 80;
                    floor = 3000;
                    break;
                case 2:
                    fast = 2000;
                    bottomlimit = 1400;
                    toplimit = 5900;
                    sqmtrsLimit = 100;
                    floor = 3300;
                    break;
                case 3:
                    fast = 2650;
                    bottomlimit = 1400;
                    toplimit = 6600;
                    sqmtrsLimit = 120;
                    floor = 3600;
                    break;
                case 4:
                    fast = 2650;
                    bottomlimit = 1400;
                    toplimit = 6600;
                    sqmtrsLimit = 140;
                    floor = 3900;
                    break;
                default:
                case 5:
                    fast = 2650;
                    bottomlimit = 1400;
                    toplimit = 6600;
                    sqmtrsLimit = 160;
                    floor = 4200;
                    break

            }


            var rentCost = house.rent;

            if (house.sqmtrs > sqmtrsLimit) {
                rentCost = rentCost - ((house.getRent() / house.sqmtrs) * (house.sqmtrs - sqmtrsLimit));

                if (rentCost < floor) {
                    rentCost = floor;
                }
            }



            // if familjehemsplacering
            /*if (rentCost > 2000) {
             if (rentCost > toplimit) {
             rentCost = toplimit;
             }


             }
             */
            rentBenefit = (rentCost - bottomlimit) * 0.5;

            var housingBenefit = fast + rentBenefit;

            if (houseHold.getGrownups().length == 1) {
                if (houseHold.getHouseHoldTaxableIncome() > 117000) {
                    housingBenefit = housingBenefit - (((houseHold.getHouseHoldTaxableIncome() - 117000) / 12) * 0.2);
                }
            } else {
                houseHold.getGrownups().forEach(function (person) {
                    if (person.getTaxableIncome() > 58500) {
                        housingBenefit = housingBenefit - (((person.getTaxableIncome() - 58500) / 12) * 0.2);
                    }
                })
            }


        } else {

            var under29 = false;
            // Barnlösa över 29 kan ej få bostadsbidrag
            houseHold.getGrownups().forEach(function (person) {
                if (person.age < 29) {
                    under29 = true;
                }
            });

            if (!under29) {
                return 0;
            }
            rentCost = house.getRent();
            if (house.sqmtrs > 60) {
                rentCost = rentCost - ((house.getRent() / house.sqmtrs) * (house.sqmtrs - 60));
            }

            if (rentCost > 1800) {
                rentBenefit = (rentCost - 1800) * 0.75;
                if (rentCost > 2600) {
                    rentBenefit = (2600 - 1800) * 0.75;

                    if (rentCost > 3600) {
                        rentCost = 3600;
                    }

                    rentBenefit += (rentCost - 2600) * 0.5
                }

            }
            if (houseHold.getGrownups().length < 2) {
                if (houseHold.getHouseHoldTaxableIncome() > 41000) {
                    rentBenefit = rentBenefit - ((houseHold.getHouseHoldTaxableIncome() - 41000) * 0.33);
                }
            } else {
                if (houseHold.getHouseHoldTaxableIncome() > 58000) {
                    rentBenefit = rentBenefit - ((houseHold.getHouseHoldTaxableIncome() - 58000) * 0.33);
                }
            }
            housingBenefit = rentBenefit;
        }
        if (housingBenefit < 100)
            return 0;

        return Math.round(housingBenefit);

    };
},100);

marginalCalc.scriptLoader.loadComplete("bostadsbidrag");