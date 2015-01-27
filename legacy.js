// socialbidrags kalkyl.


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



