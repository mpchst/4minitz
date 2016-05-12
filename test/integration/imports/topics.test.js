/**
 * Created by felix on 09.05.16.
 */
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { expect } from 'meteor/practicalmeteor:chai';

import { MeetingSeries } from '/imports/meetingseries'
import { Minutes } from '/imports/minutes'
import { Topic } from '/imports/topic'

Meteor.methods({
    'getUserId': () => {
        // on the server we cannot call Meteor.userId outside of a meteor method...
        return Meteor.userId();
    }
});

describe('Integration-Test for Topics and TopicItems of Minutes', function () {

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

    if (Meteor.isClient) { // client-only test!
        it('add a new topic item to an existing minute', function () {
            let ms = new MeetingSeries({
                project: 'foo',
                name: 'bar'
            });
            ms.save();
            ms.addNewMinutes();

            // fetch the meeting series again because the minutes array will not be updated!
            ms = new MeetingSeries(ms._id);

            console.log(ms);
            let minute = ms.lastMinutes();
            console.log("last min:" + minute);

            // At this point a meeting series with one minute is prepared
            // now we can test the topics
            // maybe the initialization above should be already done in the beforeEach-hook ?!

            let myTopic = new Topic(minute._id, {
                subject: "topic-subject"
            });
            console.log(myTopic);

            myTopic.save();

            // fetch the minute again because saving the topic does not update the minutes object
            minute = new Minutes(minute._id);

            // the minute should contain the topic
            let checkTopic = minute.findTopic(myTopic._topicDoc._id);
            console.log(checkTopic);
            expect(checkTopic.subject).to.equal(myTopic._topicDoc.subject);
        });
    }
});