/**
 * Created by felix on 09.05.16.
 */
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { MeetingSeries } from '/imports/meetingseries'
import { Minutes } from '/imports/minutes'
import { Topic } from '/imports/topic'

Meteor.methods({
    'getUserId': () => {
        // on the server we cannot call Meteor.userId outside of a meteor method...
        return Meteor.userId();
    }
});

describe('Topics', function () {

    beforeEach(function(done) {

        let initAfterDbReset = function () {

            Meteor.startup(function () {
                if (!Meteor.users.findOne({username: 'velocity'})) {
                    console.log("Creating velocity user!");
                    Accounts.createUser({username: "velocity", password: "velocity"});
                } else {
                    console.log("Found velocity user!");
                }
            });

            if (Meteor.isClient && !Meteor.userId()) {
                Meteor.loginWithPassword({username: "velocity"}, "velocity", done);
            } else {
                done();
            }
        };

        // reset database except the users collection
        resetDatabase({excludedCollections: ['users']}, initAfterDbReset);

    });

    it('add a new topic items to an existing topic', function () {
        if (Meteor.isServer && !(Meteor.call('getUserId'))) {
            // on the server the test will be called first without an authenticated user
            // then with the correct user...
            return;
        }

        let ms = new MeetingSeries({
            project: 'foo',
            name: 'bar'
        });
        ms.save();
        ms.addNewMinutes();

        // fetch the meeting series again because the minutes array will not be updated!
        ms = new MeetingSeries(ms._id);

        console.log("access lastmin");
        console.log(ms);
        let minute = ms.lastMinutes();
        console.log("last min:" + minute);

        // At this point a meeting series with one minutes is prepared
        // now we can test the topics
        // maybe the initialization above should be already done in the beforeEach-hook ?!


    });
});