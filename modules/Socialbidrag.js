marginalCalc.addModule("socialBidrag", function (houseHold, tax, barnBidrag, studieBidrag, bostadsBidrag) {
    this.commonOutcome = function () {
        switch (houseHold.numberOfPersons()) {
            case 0:
                return 0;
            case 1:
                return 930;
                break;
            case 2:
                return 1040;
                break;
            case 3:
                return 1310;
                break;
            case 4:
                return 1490;
                break;
            case 5:
                return 1710;
                break;
            case 6:
                return 1950;
                break;
            case 7:
                return 2120;
                break;
            default :
                var houseHoldExtra = 2120;
                var rest = houseHold.numberOfPersons() - 7;
                for (var a = 0; a < rest; a++) {
                    houseHoldExtra = houseHoldExtra + 170;
                }
                return houseHoldExtra;
                break;
        }
    };

    this.getRiksnorm = function () {

        if (!houseHold.numberOfPersons()) {
            return 0;
        }
        var sum = 0;
        for (var a = 0; a < houseHold.getKids().length; a++) {
            switch (houseHold.getKids()[a].age) {
                case 0:
                    sum += 1740;
                    break;
                case 1:
                case 2:
                    sum += 1980;
                    break;
                case 3:
                    sum += 1730;
                    break;
                case 4:
                case 5:
                case 6:
                    sum += 1980;
                    break;
                case 7:
                case 8:
                case 9:
                case 10:
                    sum += 2410;
                    break;
                case 11:
                case 12:
                case 13:
                case 14:
                    sum += 2840;
                    break;
                case 15:
                case 16:
                case 17:
                case 18:
                    sum += 3250;
                    break;
                case 19:
                case 20:
                    sum += 3280;
            }
        }


        sum += this.commonOutcome(houseHold);

        // Vuxna
        if (houseHold.getGrownups().length == 1) {
            sum += 2950;
        } else if (houseHold.getGrownups().length > 1) {
            var grownupCount = houseHold.getGrownups().length;
            sum += 5320;
            grownupCount = grownupCount - 2;
            for (var a = 0; a < grownupCount; a++) {
                sum += 2950;
            }
        }
        return sum;


    };
    this.totalCalc = function () {
        var income = (houseHold.totalCalc() + tax.totalCalc());

        /* Jobbstimulans */
        if (houseHold.getPersons()[0].langtidsSoc) {
                income = income * 0.75;
        }

        var totalIncome = income + bostadsBidrag.totalCalc() + studieBidrag.totalCalc() + barnBidrag.totalCalc();

        var socialBidrag = (this.getRiksnorm() + houseHold.getHouse().getRent()) - (totalIncome);
        return Math.max(0, Math.round(socialBidrag));

    }
}, 200);
marginalCalc.scriptLoader.loadComplete("socialbidrag");