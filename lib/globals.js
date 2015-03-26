
////////// Client & Server Code! /////////
Meteor.methods({

    addMeeting: function (aProject, aName) {
        console.log("Adding meeting: "+ aProject + ":" + aName);
        Meetings.insert({
            project: aProject,
            name: aName
        });

    },

    deleteMeeting: function(meetingId) {
        console.log("Delete meeting: "+meetingId);
        Meetings.remove(meetingId);
    }
});
