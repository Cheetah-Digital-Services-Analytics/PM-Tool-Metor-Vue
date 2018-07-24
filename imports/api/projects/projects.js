import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Lists } from '/imports/api/lists/lists.js'
import { Tasks } from '/imports/api/tasks/tasks.js'

export const Projects = new Mongo.Collection('projects');

Meteor.methods({
  'projects.insert'(name) {
    check(name, String);

    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    var project = Projects.insert({
      name,
      createdAt: new Date(),
      createdBy: Meteor.userId()
    });

    return project;
  },

  'projects.create'(name, projectType) {
    check(name, String);
    check(projectType, String);

    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    var projectId = Projects.insert({
      name,
      createdAt: new Date(),
      createdBy: Meteor.userId()
    });

    if (projectType === 'kanban') {
      Meteor.call('lists.insert', projectId, 'A planifier');
      Meteor.call('lists.insert', projectId, 'En cours');
      Meteor.call('lists.insert', projectId, 'Terminé');
    }

    return projectId;
  },

  'projects.remove'(projectId) {
    check(projectId, String);

    Tasks.remove({projectId: projectId});
    Lists.remove({projectId: projectId});
    Projects.remove(projectId);
  },

  'projects.updateName'(projectId, name) {
    check(projectId, String);
    check(name, String);
    if (name.length == 0) {
      throw new Meteor.Error('invalid-name');
    }

    Projects.update({_id: projectId}, {$set: {name: name}});
  },

});