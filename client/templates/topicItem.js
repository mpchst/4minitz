import { Minutes } from '/imports/minutes'
import { Topic } from '/imports/topic'
import { InfoItem } from '/imports/infoitem'


Template.topicItem.onCreated(function () {
});

Template.topicItem.onRendered(function () {
    $.material.init();
    let editor = new MediumEditor('.infoItem-editor', {
        placeholder: {
            text: "Add information item...",
            hideOnClick: false
        },
        disableReturn: true,
        toolbar: false
    });
    editor.subscribe("editableKeydownEnter", function (event, element) {
        element.blur();
        console.log($(element));
    }.bind(editor))
});

Template.topicItem.helpers({
    detailsArray: function () {
        return this.topic.details;
    },

    topicStateClass: function () {
        if (this.topic.isOpen) {
            return "actionitem-open";
        } else {
            return "actionitem-closed";
        }
    },

    checkedState: function () {
        if (this.topic.isOpen) {
            return "";
        } else {
            return {checked: "checked"};
        }
    },

    disabledState: function () {
        if (this.isEditable) {
            return "";
        } else {
            return {disabled: "disabled"};
        }
    }
});


Template.topicItem.events({
    'click #btnDelTopic'(evt, tmpl) {
        evt.preventDefault();

        if (!this.minutesID) {
            return;
        }

        console.log("Delete topics: "+this.topic._id+" from minutes "+this.minutesID);
        let aMin = new Minutes(this.minutesID);
        aMin.removeTopic(this.topic._id);
    },

    'click #btnToggleState'(evt, tmpl) {
        evt.preventDefault();

        if (!this.minutesID) {
            return;
        }

        console.log("Toggle topic state ("+this.topic.isOpen+"): "+this.topic._id+" from minutes "+this.minutesID);
        let aTopic = new Topic(this.minutesID, this.topic._id);
        if (aTopic) {
            aTopic.toggleState();
            aTopic.save();
        }
    },

    'click #btnEditTopic'(evt, tmpl) {
        evt.preventDefault();

        if (!this.minutesID) {
            return;
        }

        Session.set("topicEditMinutesId", this.minutesID);
        Session.set("topicEditTopicId", this.topic._id);
    },

    'blur .editInfoItem'(evt, tmpl) {
        let minutesID = tmpl.data.minutesID;
        if (!minutesID) {
            return;
        }

        let topicId = $(evt.target).closest('.list-group').data("topicid");
        let newSubject = $(evt.target).html();



        let aTopic = new Topic(minutesID, topicId);
        let editInfoItem = aTopic.findInfoItem(this._id);

        if (undefined === editInfoItem) {
            if (!newSubject) {
                return;
            }

            // create a new one
            let doc = {
                subject: newSubject
            };
            let newInfoItem = new InfoItem(aTopic, doc);
            newInfoItem.save();
        } else {
            // check if the subject has changed
            if (this.subject === newSubject) {
                console.log("nothig changed");
                return;
            }

            if (!newSubject) {
                aTopic.removeInfoItem(this._id);
            } else {
                editInfoItem._infoItemDoc.subject = newSubject;
                editInfoItem.save();
            }
        }

        $(evt.target).html("");
    }
});