import { Meteor } from 'meteor/meteor';
import { handleMigration } from './migrations';
import { GlobalSettings } from '/imports/GlobalSettings';

import '/imports/minutes';
import '/imports/meetingseries';
import '/imports/collections/userroles_private';
import '/server/ldap';

Meteor.startup(() => {
    GlobalSettings.publishSettings();
    process.env.MAIL_URL = GlobalSettings.getSMTPMailUrl();

    // Make sure that all server side markdown rendering quotes all HTML <TAGs>
    Markdown.setOptions({
        sanitize: true
    });

    handleMigration();
    // Migrations.migrateTo(1);     // Plz. keep this comment for manual testing... ;-)
});

