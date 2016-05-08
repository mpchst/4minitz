import { expect } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { MeetingSeriesCollection } from '/imports/collections/meetingseries_private';
import { MeetingSeries } from '/imports/meetingseries';

describe('MeetingSeries', function() {

    let testSeriesDoc;

    beforeEach(function (done) {
        testSeriesDoc = {
            project: "TestProject",
            name: "SeriesName"
        };

        resetDatabase(null, done);
    });

    it('Create new meeting series', function () {
        let spyOnMeteorCalls = sinon.spy(Meteor, 'call');

        let testSeries = new MeetingSeries(testSeriesDoc);
        testSeries.save();

        expect(spyOnMeteorCalls).calledWith('meetingseries.insert', testSeries);

        // now we should found our new inserted series in the database
        // and no series else
        // this is not correct. server and client tests run parallel
        // checking simply for the number of documents may fail
        // expect(MeetingSeriesCollection.find().count()).to.equal(1);

        expect(MeetingSeriesCollection.find(testSeries._id).count()).to.equal(1);

        let seriesFromDb = MeetingSeriesCollection.findOne(testSeries._id);
        // nonsense now with the latest changes
        // the id should be the same
        // expect(seriesFromDb._id).to.equal(testSeries._id);
        // project should be the same
        expect(seriesFromDb.project).to.equal(testSeries.project);
        // name should be the same
        expect(seriesFromDb.name).to.equal(testSeries.name);

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