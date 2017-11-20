'use strict';

const Alexa = require('alexa-sdk');
const leapYear = require('leap-year');
const languageStrings = require('./languageStrings');
const APP_ID = "amzn1.ask.skill.3b996d41-9be1-425e-b069-359c0ce91384";

function daysBetweenDates(d1, d2) {
    const MS_IN_DAY = 86400000;
    const diff = Math.abs(d1.getTime() - d2.getTime());
    return Math.ceil(diff / MS_IN_DAY);
}

const handlers = {
    'NumberToDate': function() {

        let thenCode;

        try {
            thenCode = this.event.request.intent.slots.number.value;
        } catch(error) {
            console.log("error with number slot");
            console.log(error);
            this.emit('Error');
        }

        const additionalDays = parseInt(thenCode) - 1;

        // get date code for today
        const now = new Date();
        const jan1 = new Date();
        jan1.setFullYear(now.getFullYear());
        jan1.setMonth(0);
        jan1.setDate(1);
        const nowCode = daysBetweenDates(now, jan1);

        // determine if requested code is from this year or last year
        let thenYear;
        if (thenCode <= nowCode) {
            thenYear = now.getFullYear();
        } else {
            thenYear = now.getFullYear() - 1;
        }

        let maxCode = 365;
        let minCode = 1;
        if (leapYear(thenYear)) {
            maxCode = 366;
        }

        if (thenCode < minCode || maxCode < thenCode) {
            console.log("invalid code");
            this.emit(":tell", this.t('INVALID_CODE', minCode, maxCode));
        } else {
            const packDate = new Date();
            packDate.setFullYear(thenYear);
            packDate.setMonth(0);
            packDate.setDate(1);
            packDate.setDate(packDate.getDate() + additionalDays);

            const daysSincePacking = daysBetweenDates(now, packDate);

            const message = this.t('NUMBER_TO_PAST_DATE_REPORT',
                thenCode,
                this.t('MONTH_NAMES')[packDate.getMonth()],
                packDate.getDate(),
                daysSincePacking);
            console.log(message);

            this.emit(":tell", message);
        }
    },

    'Error': function() {
        this.emit(':tell', this.t('ERROR_MESSAGE'))
    }
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.resources = languageStrings.strings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
