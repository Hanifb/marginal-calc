marginalCalc.addModule("houseHold", function () {
    this.persons = [];

    this.addPerson = function (person) {
        this.persons.push(person);
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
    this.getGrownupsYearIncomeBeforeTax = function () {
        var grownUps = this.getGrownups();
        var income = 0;
        grownUps.forEach(function (person) {
            income = income + parseInt(person.getTaxableIncome());
        });
        return income;

    };
    this.getGrownupsTotalTax = function () {
        var grownUps = this.getGrownups();
        var income = 0;
        grownUps.forEach(function (person) {
            income = income + parseInt(person.getTax());
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
    this.getGrownupsIncome = function () {
        var grownUps = this.getGrownups();
        var income = 0;
        grownUps.forEach(function (person) {
            income = income + parseInt(person.getIncome());
        });
        return income;
    };
    this.getHouseHoldIncome = function () {
        var income = 0;
        this.persons.forEach(function (person) {
            income = income + parseInt(person.getIncome());
        });
        return income;
    };
    this.getGrownupsYearIncome = function () {
        return this.getGrownupsIncome() * 12;
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

});