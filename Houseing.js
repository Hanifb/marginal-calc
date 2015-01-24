function Housing(sqmtrs, rent, rental) {
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