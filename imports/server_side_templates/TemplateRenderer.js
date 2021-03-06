import { Meteor } from 'meteor/meteor';
import { ServerTemplate } from 'meteor/felixble:server-templates'
import { _ } from 'meteor/underscore';

export class TemplateRenderer {

    constructor(template, templatePathPrefix, loadTmplFromAssets) {
        if (!template) {
            throw new Meteor.Error('invalid-argument', 'Parameter template required');
        }
        if (loadTmplFromAssets === undefined) {
            loadTmplFromAssets = true;
        }

        let tmplString;
        if (loadTmplFromAssets) {
            let templatePath = (templatePathPrefix)
                ? templatePathPrefix + "/" + template + ".html"
                : template + ".html";
            tmplString = Assets.getText(templatePath);
        } else {
            tmplString = template;
        }
        this._templateContent = tmplString;
        this._helpers = {};
        this._data = {};

        this.addHelper('markdown2html', function(text) {
            let html = Markdown(text);

            // as we embed markdown under a <li> tag in emails we
            // don't want <p> tags to destroy the layout...
            // so we replace "<p>....</p>" to "....<br>"
            html = html.replace(/<p>(.*?)<\/p>/gi, "$1<br>");

            return Spacebars.SafeString(html);
        });

        // use this helper to bring the doctype into the email
        // if the doctype is in the html file an error will occur during parsing
        this.addHelper('doctype', function() {
            let dt = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
            return Spacebars.SafeString(dt);
        });
    }

    addHelper(name, helper) {
        this._helpers[name] = helper;
        return this;
    }

    addData(name, value) {
        this._data[name] = value;
        return this;
    }

    addDataObject(data) {
        _.extend(this._data, data);
    }

    render() {
        return ServerTemplate.render(this._templateContent, this._data, this._helpers);
    }

}