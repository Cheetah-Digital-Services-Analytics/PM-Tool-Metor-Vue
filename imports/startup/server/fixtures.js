import { Projects } from '../../api/projects/projects.js';
import { Lists } from '../../api/lists/lists.js';
import faker from 'faker';

if (Projects.find().count() === 0) {
  var projects = [
    {
      name: 'Acora',
    },
    {
      name: 'Cartora',
    },
    {
      name: 'Ideal',
    },
  ];

  projects.map(function (project) {
    var id;
    id = Projects.insert({
      name: project.name,
    });

    Lists.insert({
      projectId: id,
      name : 'list'
    });

  });  
}

if (Meteor.users.find().count() <= 2) {
  faker.locale = "fr";

  for (var i = 0; i < 50; i++) {
    var firstName = faker.name.firstName();
    var lastName = faker.name.lastName();
    var email = firstName + '.' + lastName + "@gmail.com";

    let userData = {
      createdAt: new Date(),
      password: 'password',
      email: email,
      profile: {
        firstName: firstName,
        lastName: lastName,
      }
    }
    Accounts.createUser(userData);
  }
}

