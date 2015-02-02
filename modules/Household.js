/**
 * Denna fil innehåller defintioner för modulen {@link houseHold} samt klasserna {@link Housing} och {@link Person}
 *
 * @file
 * @author Hanif Bali
 * @version 1.0
 */

(function () {
    /**
     * Detta är hjärtat i kalkylatorn, den håller reda på alla personer och boendet.
     * @alias houseHold
     * @implements {Module}
     * @type {houseHold}
     * @constructor
     */
    var houseHold = function () {
        /**
         * Här sparas alla hushållets medlemmar
         * @type {Array}
         */
        this.persons = [];
        /**
         * Skapar ett gratis boende automatiskt.
         * @type {Housing}
         */
        this.house = new Housing(0, 0, true);
        /**
         * Lägger till boende i hushållet
         * @param {Housing} house Hushållets nya boende.
         */
        this.addHouse = function (house) {
            this.house = house;
        };
        /**
         * Hämtar hushållets boende.
         * @returns {Housing}
         */
        this.getHouse = function () {
            return this.house;
        };
        /**
         * Lägger till Person i hushållet
         * @param {Person} person En ny person att lägga till i hushållet.
         */
        this.addPerson = function (person) {
            this.persons.push(person);
        };

        /**
         * Personer i hushållet
         *
         * Returnerar en array med personerna i hushållet.
         * @returns {Person[]} Persons
         */
        this.getPersons = function () {
            return this.persons.slice(0);
        };
        /**
         * Hushållets inkomster exklusive skatt
         * @returns {Number}
         */
        this.totalCalc = function () {
            return this.getHouseHoldTaxableIncome() / 12;
        };
        /**
         * Gives you an array with all the persons in the household above the age you requested.
         * @param {Number} age Age
         * @returns {Person[]} Persons above defined param age
         */
        this.getPersonsAboveAge = function (age) {
            filteredPersons = [];
            this.getPersons().forEach(function (person) {
                if (person.age > age) {
                    filteredPersons.push(person);
                }
            });
            return filteredPersons;
        };
        /**
         * Gives you an array with all the persons in the household between the ages you requested.
         * @param {Number} lowAge the lower age of the interval
         * @param {Number} upperAge the upper age of the interval
         * @returns {Person[]} Persons between the defined ages
         */
        this.getPersonsBetweenAge = function (lowAge, upperAge) {
            filteredPersons = [];
            this.getPersons().forEach(function (person) {
                if (person.age > lowAge && person.age < upperAge) {
                    filteredPersons.push(person);
                }
            });
            return filteredPersons;
        };
        /**
         * Gives you an array with all the persons in the household below the age you requested.
         * @param {Number} age Age
         * @returns {Person[]} Persons below defined param age
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
        /**
         * Returnerar alla vuxna i hushållet.
         *
         * @returns {Person[]}
         */
        this.getGrownups = function () {
            var grownups = [];
            this.persons.forEach(function (person) {
                if (person.isGrownup()) {
                    grownups.push(person);
                }
            });
            return grownups;
        };
        /**
         * Summerar och returnerar den totala taxerbara inkomsten i hushållet
         * @returns {Number}
         */
        this.getHouseHoldTaxableIncome = function () {
            var persons = this.getPersons();
            var income = 0;
            persons.forEach(function (person) {
                income = income + parseInt(person.getTaxableIncome());
            });
            return income;

        };
        /**
         * Returnerar alla vuxnas inkomster före skatt.
         * @returns {Number}
         */
        this.getGrownupsIncomeBeforeTax = function () {
            var grownUps = this.getGrownups();
            var income = 0;
            grownUps.forEach(function (person) {
                income = income + parseInt(person.getTaxableIncome());
            });
            return income / 12;

        };
        /**
         * Returnerar alla barn.
         *
         * @returns {Person[]}
         */
        this.getKids = function () {
            var kids = [];
            this.persons.forEach(function (person) {
                if (!person.isGrownup()) {
                    kids.push(person);
                }
            });
            return kids;
        }
        /**
         * Antal personer i hushållet.
         *
         * @returns {Number}
         */
        this.numberOfPersons = function () {
            return this.persons.length
        }

    };

    marginalCalc.addModule("houseHold", houseHold, 0);
    marginalCalc.scriptLoader.loadComplete("household");
})();

/**
 * Denna klass använder hushållet och kalkylatorn för att göra uträkningar, tex bostadsbidraget och socialbidraget.
 *
 * @example // Skapa en hyresrätt på 50 kvadrat med 4000kr i hyra.
 * var lgh = new Housing(50, 4000);
 *
 * @param {Number} sqmtrs Boendets kvadratmeter
 * @param {Number} rent Boendets hyra eller avgift
 * @param {Boolean} [rental = true] Om boendet är en hyresrätt eller ej
 * @constructor
 */
function Housing(sqmtrs, rent, rental) {
    this.rental = typeof rental == "undefined" ? true : rental;
    this.sqmtrs = parseInt(sqmtrs);
    this.rent = parseInt(rent);
    this.getRent = function () {
        return this.rent;
    };
    this.setRent = function (rent) {
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
/**
 * Personen som används av {@link houseHold} och andra moduler för att beräkna skatt och bidrag.
 *
 * @example //Skapa en person 30 årig person med 20000 kr i månadsinkomst
 * var Steffo = new Person(20000, 30);
 * @param {Number} salary Arbetsinkomster personen har
 * @param {Number} age  Ålder på personen
 * @constructor
 */

function Person(salary, age) {
    var that = this;
    this.data = [];
    this.age = parseInt(age);
    this.income = parseInt(salary);
    this.salary = parseInt(salary);
    this.setData = function(dataKey, data){
        this.data[dataKey] = data;
    };
    this.getData = function (dataKey) {
        if(typeof this.data[dataKey] === "undefined"){
            return undefined;
        }
        return this.data[dataKey];
    };
    this.getTaxableIncome = function () {
        return this.salary * 12;
    };
    this.getWorkIncome = function () {
        return this.salary * 12;
    };
    this.isGrownup = function () {
        return this.age > 17
    }
}