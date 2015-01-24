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

        return (this.getTaxableIncome() / 12);
    };

    this.getTax = function(){

        return tax.totalTax(this) / 12;
    };

    this.getYearIncome = function () {
        return this.getIncome() * 12;
    };
    this.isGrownup = function () {
        return this.age > 17
    }
}