/**
 * houseHold
 * The heart and soul of the Swedish Tax and Benefit system
 */
marginalCalc.addModule("houseHold", function () {
    this.persons = [];
    this.house = new Housing(60, 4000, true);

    this.addHouse = function (house) {
        this.house = house;
    };

    this.getHouse = function (house) {
        return this.house;
    };

    this.addPerson = function (person) {
        this.persons.push(person);
    };
    this.getPersons = function () {
        return this.persons.slice(0);
    };

    this.totalCalc = function () {
        return this.getHouseHoldTaxableIncome() / 12;
    };
    /**
     * Returns all the persons in the household below a certain age
     * @param age
     * @returns {Array} Persons below defined param age
     */
    this.getPersonsBelowAge = function (age) {
        filteredPersons = [];
        this.getPersons().forEach(function (person) {
            if (person.age < age) {
                filteredPersons.push(person);
            }
        });
        return filteredPersons;
    };
    this.getGrownups = function () {
        var grownups = [];
        this.persons.forEach(function (person) {
            if (person.isGrownup()) {
                grownups.push(person);
            }
        });
        return grownups;
    };
    this.getHouseHoldTaxableIncome = function () {
        var persons = this.getPersons();
        var income = 0;
        persons.forEach(function (person) {
            income = income + parseInt(person.getTaxableIncome());
        });
        return income;

    };
    this.getGrownupsIncomeBeforeTax = function () {
        var grownUps = this.getGrownups();
        var income = 0;
        grownUps.forEach(function (person) {
            income = income + parseInt(person.getTaxableIncome());
        });
        return income / 12;

    };
    this.getKids = function () {
        var kids = [];
        this.persons.forEach(function (person) {
            if (!person.isGrownup()) {
                kids.push(person);
            }
        });
        return kids;
    };
    this.numberOfPersons = function () {
        return this.persons.length
    }

}, 0);


function Housing(sqmtrs, rent, rental) {
    this.rental = typeof rental == "undefined" ? true : rental;
    this.sqmtrs = parseInt(sqmtrs);
    this.rent = parseInt(rent);
    this.getRent = function(){
        return this.rent;
    };
    this.setRent = function(rent){
        this.rent = rent;
    };
    this.avgRent = function (household) {
        rent = 0;
        if (!household.getKids()) {
            if (household.getGrownups().length == 1) {
                rent = 44700;
            } else {
                rent = 58400;
            }

        } else {
            if (household.getGrownups().length == 1) {
                rent = 61400;
            }

            switch (household.getKids().length) {
                case 1:
                    rent = 65800;
                case 2:
                    rent = 69400;
                case 3:
                default:
                    rent = 75500;
                    break;
            }
        }
        return Math.round(rent / 12);
    }
}

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
    this.isGrownup = function () {
        return this.age > 17
    }
}

marginalCalc.scriptLoader.loadComplete("household");