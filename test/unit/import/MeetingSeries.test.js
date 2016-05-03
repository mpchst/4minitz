import { expect } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';

import { MeetingSeries } from '/imports/meetingseries'



describe('MeetingSeries', function() {

    let testSeriesDoc;

    beforeEach(function () {
        testSeriesDoc = {
            project: "TestProject",
            name: "SeriesName"
        };
    });

    it('Create new meeting series', function () {
        let spyOnMeteorCalls = sinon.spy(Meteor, 'call');

        let testSeries = new MeetingSeries(testSeriesDoc);
        testSeries.save();

        expect(spyOnMeteorCalls).calledWith('meetingseries.insert', testSeries);

        spyOnMeteorCalls.restore();
    });

    it('Update existing meeting series', function () {
        // first we insert a new series to have one which we can update later
        let testSeries = new MeetingSeries(testSeriesDoc);
        testSeries.save();

        let spyOnMeteorCalls = sinon.spy(Meteor, 'call');

        testSeries.name = "OtherName";
        testSeries.save();

        expect(spyOnMeteorCalls).calledWith('meetingseries.update', testSeries);
        spyOnMeteorCalls.restore();
    })

});