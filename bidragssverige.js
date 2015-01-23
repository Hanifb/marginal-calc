// socialbidrags kalkyl.

function Person(salary, age) {
    var that = this;
    this.age = parseInt(age);
    this.barnbidrag = 0;
    this.income = parseInt(salary);
    this.salary = parseInt(salary);
    this.getTaxableIncome = function () {
        return this.income * 12;
    };
    this.getWorkIncome = function(){
        return this.salary * 12;
    };
    this.getIncome = function () {
        tax = new Tax();
        return (this.getTaxableIncome() - tax.totalTax(this)) / 12;
    };

    this.getTax = function(){
        tax = new Tax();
        return tax.totalTax(this) / 12;
    };

    this.getYearIncome = function () {
        return this.getIncome() * 12;
    };
    this.isGrownup = function () {
        return this.age > 17
    }
}

var Socialbidrag = function () {
    this.getRiksnorm = function () {
        var household = that;

        if(!this.data.length) {
            return 0;
        }
        var sum = 0;
        for (var a = 0; a < household.getKids().length; a++) {
            switch (household.getKids()[a].age) {
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
        this.commonOutcome = function (household) {
            switch (household.numberOfPersons()) {
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
                    var householdExtra = 2120;
                    var rest = household.numberOfPersons() - 7;
                    for (var a = 0; a < rest; a++) {
                        householdExtra = householdExtra + 170;
                    }
                    return householdExtra;
                    break;
            }
        };

        sum += this.commonOutcome(household);

        // Vuxna
        if (household.getGrownups().length == 1) {
            sum += 2950;
        } else if(household.getGrownups().length > 1){
            var grownupCount = household.getGrownups().length;
            sum += 5320;
            grownupCount = grownupCount - 2;
            for (var a = 0; a < grownupCount; a++) {
                sum += 2950;
            }
        }

        return sum;


    };

    this.calculate = function(household){
        if ((household.getGrownupsIncome() +  household.module("bostadsbidrag")) + this.getBarnBidrag() < this.getRiksnorm() + this.getHouseRent()) {
            return Math.round((this.getRiksnorm() + this.getHouseRent()) - (this.getGrownupsIncome() + this.getBostadsBidrag() + this.getBarnBidrag()));
        } else {
            return 0;
        }
    }
};

register("socialbidrag", Socialbidrag, ["house","income", "barnbidrag", "bostadsbidrag"]);
register("house", House);

(MainCalc = function(){
    console.log("Maincalc init");
    this.$modules = [];
    this.$reggedModules = [];
    this.register = function(name, fn, deps){
        if(!deps){
            deps = [];
        }
        this.$reggedModules.push({name: name, module: new fn, dependencys: deps});
    };
    this.$getRegisteredModuleByName = function(nameOfModule){
        for(a; a < $reggedModules.length; a++){
            if($reggedModules[a].name === nameOfModule){
                return $reggedModules[a];
            };
            throw new Error("Could not find module, make sure to register your module");
        }
    };
    this.$loadModuleByName = function(name){
       var module = this.$getRegisteredModuleByName(name);
        this.$modules.push({"name": module.name, "module": module.module});
        return module;
    };
    this.init = function(){
        var done = false;
        /**
         * List of modules to run
         * @type {Array}
         */
        var doList = [];

        var donelist = [];
        /*
        * Fill the doList with the loaded modules
        * */
        for(var a = 0; a < this.$modules.length; a++){
            doList.push(this.$modules[a].name);
        }

        // Loop until all modules are initialized
        var a = 0;
        while(doList.length == 0){
            var current = doList[a];
            var depsLoaded = false;

            for(var b = 0; b < current.dependencys.length; b++){
                depsLoaded = false;
                if(donelist.indexOf(current.dependencys[a]) !== -1){
                    depsLoaded = true;
                }
            }

            if(depsLoaded){
                var deps = new Array();
                for(dep in current.deps){
                    deps.push(this.getModuleByName(dep).module);
                }

                eval("this.$loadModuleByName(current.name).init("+ deps.join(deps.keys()) +");");
                this.$loadModuleByName(current.name).init();
            }
            $a++;
        }
    };
})(MainCalc);
function Household() {
    var that = this;
    this.data = [];

    this.addHouse = function (house) {
        this.house = house;
    };
    this.getHouse = function () {
        if (!this.house) {
            throw new Error("No house set");
        }

        return this.house;
    };
    this.addPerson = function (person) {
        that.data.push(person);
    };

    this.getHouseRent = function () {
        var rent;
        if (this.getHouse().rent) {
            rent = this.getHouse().rent;
        } else {
            rent = this.getHouse().avgRent(this) / 12;
        }
        return Math.round(rent);
    };

    this.getBostadsBidrag = function () {
        var rentBenefit = 0;
        var household = that;
        var house = that.getHouse();
        if (this.getKids().length) {


            var fast = 0;
            var toplimit = 0;
            var sqmtrsLimit = 0;
            var floor = 0;
            var bottomlimit;
            switch (this.getKids().length) {
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


            var rentCost = this.getHouseRent();

            if (house.sqmtrs > sqmtrsLimit) {
                rentCost = rentCost - ((this.getHouseRent() / house.sqmtrs) * (house.sqmtrs - sqmtrsLimit));

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

            if (this.getGrownups().length == 1) {
                if (this.getGrownupsYearIncomeBeforeTax() > 117000) {
                    housingBenefit = housingBenefit - (((this.getGrownupsYearIncomeBeforeTax() - 117000) / 12) * 0.2);
                }
            } else {
                household.getGrownups().forEach(function (person) {
                    if (person.getTaxableIncome() > 58500) {
                        housingBenefit = housingBenefit - (((person.getTaxableIncome() - 58500) / 12) * 0.2);
                    }
                })
            }


        } else {

            var under29 = false;
            // Barnlösa över 29 kan ej få bostadsbidrag
            this.getGrownups().forEach(function (person) {
                if (person.age < 29) {
                    under29 = true;
                }
            });

            if (!under29) {
                return 0;
            }
            rentCost = this.getHouseRent();
            if (house.sqmtrs > 60) {
                rentCost = rentCost - ((this.getHouseRent() / house.sqmtrs) * (house.sqmtrs - 60));
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
            if (household.getGrownups().length < 2) {
                if (household.getGrownupsYearIncomeBeforeTax() > 41000) {
                    rentBenefit = rentBenefit - ((household.getGrownupsYearIncomeBeforeTax() - 41000) * 0.33);
                }
            } else {
                if (household.getGrownupsYearIncomeBeforeTax() > 58000) {
                    rentBenefit = rentBenefit - ((household.getGrownupsYearIncomeBeforeTax() - 58000) * 0.33);
                }
            }
            housingBenefit = rentBenefit;
        }
        if (housingBenefit < 100)
            return 0;

        return Math.round(housingBenefit);

    };


    this.getBarnBidrag = function () {
        var income = this.getHouseHoldIncome();
        var extra = 0;
        if (income < 85000) {
            extra = 855;
        } else if (income > 104999) {
            extra = 570;
        } else if (income > 124999) {
            extra = 285;
        }

        var barnbidrag = 0;

        var kids = this.getKids();
        for (var a = 0; a < kids.length; a++) {
            if (kids[a].age > 16) {
                kids[a].barnbidrag = 1080 + extra;
                kids[a].barnbidrag_extra = true;
            } else {
                kids[a].barnbidrag = 1080
            }
            barnbidrag += kids[a].barnbidrag;

        }
        return barnbidrag;
    };
    this.getSocialBidrag = function () {



    };
    this.getGrownups = function () {
        var grownups = [];
        that.data.forEach(function (person) {
            if (person.isGrownup()) {
                grownups.push(person);
            }
        });
        return grownups;
    };
    this.getGrownupsYearIncomeBeforeTax = function (){
        var grownUps = that.getGrownups();
        var income = 0;
        grownUps.forEach(function (person) {
            income = income + parseInt(person.getTaxableIncome());
        });
        return income;

    };
    this.getGrownupsTotalTax = function(){
        var grownUps = that.getGrownups();
        var income = 0;
        grownUps.forEach(function (person) {
            income = income + parseInt(person.getTax());
        });
        return income;
    };
    this.getGrownupsIncomeBeforeTax = function (){
        var grownUps = that.getGrownups();
        var income = 0;
        grownUps.forEach(function (person) {
            income = income + parseInt(person.getTaxableIncome());
        });
        return income / 12;

    };
    this.getGrownupsIncome = function () {
        var grownUps = that.getGrownups();
        var income = 0;
        grownUps.forEach(function (person) {
            income = income + parseInt(person.getIncome());
        });
        return income;
    };
    this.getHouseHoldIncome = function () {
        var income = 0;
        that.data.forEach(function (person) {
            income = income + parseInt(person.getIncome());
        });
        return income;
    };
    this.getGrownupsYearIncome = function () {
        return this.getGrownupsIncome() * 12;
    };
    this.getKids = function () {
        var kids = [];
        that.data.forEach(function (person) {
            if (!person.isGrownup()) {
                kids.push(person);
            }
        });
        return kids;
    };
    this.numberOfPersons = function () {
        return this.data.length
    }

}

function House(sqmtrs, rent, rental) {
    this.rental = typeof rental  == "undefined" ? true : rental;
    this.sqmtrs = parseInt(sqmtrs);
    this.rent = parseInt(rent);
    this.avgRent = function (household) {
        if (!household.getKids()) {
            if (household.getGrownups().length == 1) {
                return 44700;
            } else {
                return 58400;
            }

        } else {
            if (household.getGrownups().length == 1) {
                return 61400;
            }

            switch (household.getKids().length) {
                case 1:
                    return 65800;
                case 2:
                    return 69400;
                case 3:
                default:
                    return 75500;
                    break;
            }

        }

    }


}

var Tax = function() {
    const PBB = 44400; // 2014 Prisbasbelopp
    const IBB = 56900; // 2014 Inkomstbasbelopp
    const SKIKT1 = 420800; // 2014 Statlig inkomstskatt, brytpunkt
    const SKIKT2 = 602600; //2014 Värnskatt, brytpunkt
    const KI = 0.30; //Kommunalskatt
    this.totalTax = function (person) {
        var JA = Math.round(this.jobbskatteavdrag(person));
        var GA = this.grundAvdrag(person);
        var TI = Math.round(person.getTaxableIncome());
     /*   console.log("Grundavdrag", GA);
        console.log("Income", TI);
        console.log("JSK", JA);
        */
        var totalt = -JA + (TI - GA) * KI + Math.max(0, (TI - GA - SKIKT1) * 0.20) + (Math.max(0, (TI - GA - SKIKT2) * 0.05))
        return Math.round(Math.max(0,totalt));
    };
    this.rundaUppHundra = function(number){
        return Math.ceil(number/100)*100;
    };
    this.rundaNerHundra = function(number){
        return Math.floor(number/100)*100;
    };


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
    this.pensionsavgift = function (person) {
        var avgift = 0;
        if (person.getTaxableIncome() > 0.423 * IBB && person.getTaxableIncome() < 8.07 * IBB) {
            avgift = 0.07 * person.getTaxableIncome();
        } else if (person.getTaxableIncome() >= 8.07 * IBB) {
            avgift = 0.07 * (8.07 * IBB);
        }
        return this.rundaUppHundra(avgift)

    };

    this.grundAvdrag = function (person) {
        var grundavdrag = 0;
        var TI = this.rundaNerHundra(person.getTaxableIncome());
        if (person.age < 65) {
            grundavdrag = this.grundAvdragUnder65(TI);
        } else {
            grundavdrag = this.grundAvdragOver65(TI);
        }
        if(grundavdrag > TI){
            grundavdrag = TI;
        }
        return this.rundaUppHundra(grundavdrag)
    };

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
};