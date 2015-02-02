/**
 * Includes {@link etableringsBidrag}
 * @file
 * @version 1.0
 */
(function () {
    var etableringsBidrag = function (bostadsBidrag, houseHold) {
        /**
         * Gets persons in the household that are enrolled in Arbetsförmedlingens etableringsprogram.
         * @returns {Person[]}
         */
        this.getProgramParticipants = function () {
            var filteredPersons = [];
            var tempPersons = houseHold.getPersonsBetweenAge(19, 65);
            tempPersons.forEach(function (person) {

                if (person.getData("inEtablering" === true)) {
                    filteredPersons.push(person);
                }


            });
            return filteredPersons;

        };
        /**
         * Returns your etableringsbidrag
         * @returns {Number}
         */
        this.getEtableringsBidrag = function () {
            var participants = this.getProgramParticipants();
            const workDaysPerMonth = 20;
            //2 kap. Ersättning till nyanlända § 1
            for (var i = 0; i < participants.length; i++) {
                var person = participants[i];
                var intensity = person.getData("etableringsIntensity");
                var highestIntensity = 0;
                if (highestIntensity < intensity) {
                    highestIntensity = intensity;
                }
                var ersattning = 0;
                switch (intensity) {
                    case 25:
                        ersattning = 308 * workDaysPerMonth;
                    case 50:
                        ersattning = 231 * workDaysPerMonth;
                    case 75:
                        ersattning = 154 * workDaysPerMonth;
                    case 100:
                        ersattning = 77 * workDaysPerMonth;
                }
                person.setData("etableringsErsattning", ersattning);

            }


            // Etableringstilägg
            var kids = houseHold.getPersonsBelowAge(21);
            if (kids.length) {

                while (kids.length > 3) {
                    //TODO If we have Underhållsstöd  then we should only count the two oldest children.
                    // if you have Underhållstöd and more than 4 children we should only count the oldest kid.
                    // if you have underhållstöd and more than 6 children then you get nothing.
                    var youngestkidAge = kids[0].age;
                    var youngestkidIndex = 0;
                    for (var i = 0; i < kids.length; i++) {

                        if (kids[i].age < youngestkidAge) {
                            youngestkidAge = temp[i];
                            youngestkidIndex = i;
                        }

                    }
                    kids = kids.splice(youngestkidIndex, 1);
                }

                var etableringsTillag = 0;
                for (var i = 0; i < kids.length; i++) {
                    if (kids[i].age < 12) {
                        etableringsTillag += 800;
                    } else if (kids[i].age > 11) {
                        etableringsTillag += 1500;
                    }
                }
                etableringsTillag = etableringsTillag * (highestIntensity / 100);
                ersattning += etableringsTillag;
            }

            // bostadsersättning
            var bostadsErsattning = 0;
            if (houseHold.getHouse().getRent() > 1800) {
                bostadsErsattning = houseHold.getHouse().getRent() - 1800;
                if (bostadsErsattning > 3900) {
                    bostadsErsattning = 3900;
                }
            }
            bostadsErsattning = bostadsErsattning * (highestIntensity / 100);
            bostadsErsattning = Math.max(0, bostadsErsattning - bostadsBidrag.totalCalc());

            ersattning += bostadsErsattning;

            return ersattning;
        }

    };

    marginalCalc.addModule("etableringsBidrag", etableringsBidrag, 100);
    marginalCalc.scriptLoader.loadComplete("etableringsbidrag");
})
();