import { resetDatabase } from 'meteor/xolvio:cleaner';
import { should } from 'meteor/practicalmeteor:chai';
should();

import { MeetingSeries } from '/imports/meetingseries'
import { MeetingSeriesCollection } from '/imports/collections/meetingseries_private'
import { MinutesCollection } from '/imports/collections/minutes_private'
import { Minutes } from '/imports/minutes'

Meteor.methods({
    'test.resetDatabase': () => resetDatabase(),
    'test.addMinutesToSeries': (meetingSeries, minutesId) => {
        doc = {
            minutes: meetingSeries.minutes().push(minutesId)
        };

        MeetingSeriesCollection.update(meetingSeries._id, {$set: doc});
    }
});


Factory.define('meetingSeries', MeetingSeriesCollection, {
    project: () =>  "Test-Project",
    name: () =>  "Test-Series",
    createdAt: () =>  new Date(),
    lastMinutesDate: () =>  formatDateISO8601(new Date()),
    minutes: () =>  []
});

Factory.define('minutes', MinutesCollection, {
    meetingSeries_id: () => Factory.create('meetingSeries')._id,
    date: () => formatDateISO8601(new Date()),
    topics: () =>  [],
    isFinalized: () =>  false,
    isUnfinalized: () =>  false
});

describe('Minutes', function() {

    beforeEach(function() {
        resetDatabase();

    });


    it('Create sample minute in meeting series', function () {
        let dummyMinute = new Minutes(Factory.create('minutes'));
        // add minute_id to minutes array of series
        let parentSeries = dummyMinute.parentMeetingSeries();
        MeetingSeriesCollection.update(parentSeries._id, {$set: { minutes: [dummyMinute._id] } });

        if (Meteor.isClient) {
            let mins = Minutes.find();
            let series = MeetingSeries.find();
            console.log("#Series: " + series.count());
            console.log("#Minutes: " + mins.count());

            series.forEach((serie) => console.log(serie));
            mins.forEach((min) => console.log(min));

            let min = Minutes.findOne();
            min.agenda = "Hallo";
            min.save();
        }
    });

});