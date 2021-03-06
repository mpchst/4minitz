import { E2EGlobal } from './helpers/E2EGlobal'
import { E2EApp } from './helpers/E2EApp'
import { E2EMeetingSeries } from './helpers/E2EMeetingSeries'
import { E2EMeetingSeriesEditor } from './helpers/E2EMeetingSeriesEditor'
import { E2EMinutes } from './helpers/E2EMinutes'
import { E2ETopics } from './helpers/E2ETopics'

require('./../../lib/helpers');


describe('ActionItems', function () {
    const aProjectName = "E2E ActionItems";
    let aMeetingCounter = 0;
    let aMeetingNameBase = "Meeting Name #";
    let aMeetingName;
    let aTopicCounter = 0;
    let aTopicNameBase = "Topic Name #";
    let aTopicName;
    let aAICounter = 0;
    let aAINameBase = "Action Item Name #";

    let getNewMeetingName = () => {
        aMeetingCounter++;
        return aMeetingNameBase + aMeetingCounter;
    };
    let getNewTopicName = () => {
        aTopicCounter++;
        return aTopicNameBase + aTopicCounter;
    };
    let getNewAIName = () => {
        aAICounter++;
        return aAINameBase + aAICounter;
    };

    function addActionItemToFirstTopic() {
        let actionItemName = getNewAIName();

        E2ETopics.addInfoItemToTopic({
            subject: actionItemName,
            itemType: "actionItem"
        }, 1);

        return actionItemName;
    }

    beforeEach("make sure test user is logged in, create series and add minutes", function () {
        E2EApp.gotoStartPage();
        expect(browser.getTitle()).to.equal('4minitz!');
        expect (E2EApp.isLoggedIn()).to.be.true;

        aMeetingName = getNewMeetingName();

        E2EMeetingSeries.createMeetingSeries(aProjectName, aMeetingName);
        E2EMinutes.addMinutesToMeetingSeries(aProjectName, aMeetingName);

        aTopicName = getNewTopicName();
        E2ETopics.addTopicToMinutes(aTopicName);
    });

    after("clear database", function () {
        if (E2EGlobal.browserIsPhantomJS()) {
            E2EApp.resetMyApp(true);
        }
    });

    it('can add an info item', function () {
        let topicIndex = 1;
        const actionItemName = getNewAIName();

        E2ETopics.addInfoItemToTopic({
            subject: actionItemName,
            itemType: "actionItem"
        }, topicIndex);

        E2EGlobal.waitSomeTime();

        let selector = "#topicPanel .well:nth-child(" + topicIndex + ") #headingOne";
        expect(browser.isVisible(selector), "Action item should be visible").to.be.true;

        let actionItemExpandElement = browser.element(selector).value.ELEMENT;
        let actionItemExpandElementText = browser.elementIdText(actionItemExpandElement).value;

        expect(actionItemExpandElementText, "Action item visible text should match").to.have.string(actionItemName);
    });

    it('can add an action item by pressing enter in the topic field', function () {
        let topicIndex = 1;
        E2ETopics.openInfoItemDialog(topicIndex);

        const actionItemName = getNewAIName();
        E2ETopics.insertInfoItemDataIntoDialog({
            subject: actionItemName + "\n",
            itemType: "actionItem"
        });

        E2EGlobal.waitSomeTime();

        let selector = "#topicPanel .well:nth-child(" + topicIndex + ") #headingOne";
        expect(browser.isVisible(selector), "Action item should be visible").to.be.true;

        let actionItemExpandElement = browser.element(selector).value.ELEMENT;
        let actionItemExpandElementText = browser.elementIdText(actionItemExpandElement).value;

        expect(actionItemExpandElementText, "Action item visible text should match").to.have.string(actionItemName);
    });

    it('can add an action item by pressing enter in the priority field', function () {
        let topicIndex = 1;
        E2ETopics.openInfoItemDialog(topicIndex);

        const actionItemName = getNewAIName();
        E2ETopics.insertInfoItemDataIntoDialog({
            subject: actionItemName,
            priority: 'low' + "\n",
            itemType: "actionItem"
        });

        E2EGlobal.waitSomeTime();

        let selector = "#topicPanel .well:nth-child(" + topicIndex + ") #headingOne";
        expect(browser.isVisible(selector), "Action item should be visible").to.be.true;

        let actionItemExpandElement = browser.element(selector).value.ELEMENT;
        let actionItemExpandElementText = browser.elementIdText(actionItemExpandElement).value;

        expect(actionItemExpandElementText, "Action item visible text should match").to.have.string(actionItemName);
    });

    it('toggles the open-state of the first AI', function () {
        addActionItemToFirstTopic();

        E2ETopics.toggleActionItem(1, 1);

        expect(E2ETopics.isActionItemClosed(1, 1), "the AI should be closed").to.be.true;
    });

    it('toggles the open-state of the second AI', function () {
        addActionItemToFirstTopic();

        E2ETopics.addInfoItemToTopic({
            subject: getNewAIName(),
            itemType: "actionItem"
        }, 1);
        E2ETopics.toggleActionItem(1, 2);

        expect(E2ETopics.isActionItemClosed(1, 2), "the AI should be closed").to.be.true;
    });


    it('shows security question before deleting action items', function () {
        let actionItemName = addActionItemToFirstTopic();

        E2ETopics.deleteInfoItem(1, 1);

        let selectorDialog = "#confirmDialog";

        E2EGlobal.waitSomeTime(750); // give dialog animation time
        expect(browser.isVisible(selectorDialog), "Dialog should be visible").to.be.true;

        let dialogContentElement = browser.element(selectorDialog + " .modal-body").value.ELEMENT;
        let dialogContentText = browser.elementIdText(dialogContentElement).value;

        expect(dialogContentText, 'dialog content should display the title of the to-be-deleted object').to.have.string(actionItemName);
        expect(dialogContentText, 'dialog content should display the correct type of the to-be-deleted object').to.have.string("action item");

        // close dialog otherwise beforeEach-hook will fail!
        E2EApp.confirmationDialogAnswer(false);
    });


    it('can delete an action item', function () {
        let topicIndex = 1;
        const infoItemName = getNewAIName();
        E2ETopics.addInfoItemToTopic({
            subject: infoItemName,
            itemType: "actionItem"
        }, topicIndex);

        E2EGlobal.waitSomeTime();

        let selector = "#topicPanel .well:nth-child(" + topicIndex + ") #headingOne";
        expect(browser.isVisible(selector), "Info item should be visible").to.be.true;

        E2ETopics.deleteInfoItem(1, 1, true);
        expect(browser.isVisible(selector), "Info item should be deleted").to.be.false;
    });


    it('can cancel a "delete action item"', function () {
        let topicIndex = 1;
        const infoItemName = getNewAIName();
        E2ETopics.addInfoItemToTopic({
            subject: infoItemName,
            itemType: "actionItem"
        }, topicIndex);

        E2EGlobal.waitSomeTime();

        let selector = "#topicPanel .well:nth-child(" + topicIndex + ") #headingOne";
        expect(browser.isVisible(selector), "Info item should be visible").to.be.true;

        E2ETopics.deleteInfoItem(1, 1, false);
        expect(browser.isVisible(selector), "Info item should still exist").to.be.true;
    });
});