import { expect } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';

import StubCollections from 'meteor/hwillson:stub-collections';
import { MeetingSeriesCollection } from '/imports/collections/meetingseries_private'

import { MeetingSeries } from '/imports/meetingseries'

Meteor.methods({
    'removeAll': () => {
        MeetingSeriesCollection.remove({});
    }
});

describe('MeetingSeries', function() {

    let testSeriesDoc;

    beforeEach(function () {
        testSeriesDoc = {
            project: "TestProject",
            name: "SeriesName"
        };

        // mock our meetingSeriesCollection
        StubCollections.stub(MeetingSeriesCollection);
        Meteor.call('removeAll');
    });

    afterEach(function() {
        StubCollections.restore();
    });

    it('Create new meeting series', function () {
        let spyOnMeteorCalls = sinon.spy(Meteor, 'call');

        let testSeries = new MeetingSeries(testSeriesDoc);
        testSeries.save();

        expect(spyOnMeteorCalls).calledWith('meetingseries.insert', testSeries);

        // now we should found our new inserted series in the database
        // and no series else
        expect(MeetingSeriesCollection.find().count()).to.equal(1);
        let seriesFromDb = MeetingSeriesCollection.findOne();
        // the id should be the same
        expect(seriesFromDb._id).to.equal(testSeries._id);
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