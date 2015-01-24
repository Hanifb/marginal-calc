marginalCalc.addModule("barnBidrag", function(houseHold){
    this.getBarnBidrag = function(){
    var income = houseHold.getHouseHoldIncome();
    var extra = 0;
    if (income < 85000) {
        extra = 855;
    } else if (income > 104999) {
        extra = 570;
    } else if (income > 124999) {
        extra = 285;
    }

    var barnbidrag = 0;
    console.log(houseHold);
    var kids = houseHold.getKids();
    for (var a = 0; a < kids.length; a++) {
        if (kids[a].age > 16) {
            kids[a].barnbidrag = 1080 + extra;
            kids[a].barnbidrag_extra = true;
        } else {
            kids[a].barnbidrag = 1080
        }
        barnbidrag += kids[a].barnbidrag;

    }
    console.log("Visar barnbidrag", barnbidrag);
    }
});