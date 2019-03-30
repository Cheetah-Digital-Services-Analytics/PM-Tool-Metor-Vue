import { Meteor } from 'meteor/meteor';
import { Roles } from "meteor/alanning:roles";

const ApplicationRoles = Object.freeze({
  ADMIN: "admin",
  INACTIVE: "inactive"
});

export const Permissions = {
  isAdmin (userId, scope=Roles.GLOBAL_GROUP) {
    if (!userId) {
      return false;
    }
    return Roles.userIsInRole(userId, ApplicationRoles.ADMIN, scope)
  },

  isActive (userId) {
    if (!userId) {
      return false;
    }
    return !Roles.userIsInRole(userId, ApplicationRoles.INACTIVE, Roles.GLOBAL_GROUP)
  },

  setInactive (userId) {
    if (!this.isAdmin(Meteor.userId())) {
      throw new Meteor.Error(401, "not-authorized");
    }
    Roles.addUsersToRoles(userId, ApplicationRoles.INACTIVE, Roles.GLOBAL_GROUP)
    Meteor.users.update(userId, {
      $set: {
          "services.resume.loginTokens": []
      }
    });
  },

  setActive (userId, scope=Roles.GLOBAL_GROUP) {
    if (!this.isAdmin(Meteor.userId())) {
      throw new Meteor.Error(401, "not-authorized");
    }
    if (this.isActive(userId)) {
      return;
    }
    Roles.removeUsersFromRoles(userId, ApplicationRoles.INACTIVE, scope)
  }
}

if (Meteor.isServer) {
  Accounts.validateLoginAttempt(function(attemptObj) {
    if (attemptObj.user && !Permissions.isActive(attemptObj.user._id)) {
      throw new Meteor.Error(403, "Your account is disabled.");
    }
    if (!attemptObj.user) {
      return false;
    }
    if (Permissions.isAdmin(attemptObj.user._id)) {
      return true;
    }

    if (attemptObj.user.emails[0].verified === true) {
      return true;
    } else {
      throw new Meteor.Error('email-not-verified', 'You must verify your email address before you can log in');
    }
    
    return true;
  });
}

export const checkLoggedIn = () => {
  if (!Meteor.userId()) {
    throw new Meteor.Error("not-authorized");
  }
}