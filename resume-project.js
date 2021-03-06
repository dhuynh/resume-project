Points = new Mongo.Collection("points");


if (Meteor.isClient) {
  Meteor.subscribe("points");

  Template.body.helpers({
    points: function() {
      return Points.find({});
    }
  });

  Template.body.events({
  "submit .new-point": function (event) {
    // This function is called when the new task form is submitted

    var text = event.target.text.value;

    Meteor.call("addPoint", text);

    // Clear form
    event.target.text.value = "";

    // Prevent default form submit
    return false;
  },

  "click .delete": function () {
    Meteor.call("deletePoint", this._id);
  }

});

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.publish("points", function () {
    return Points.find({owner: this.userId});
  });
}


Meteor.methods({
  addPoint: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Points.insert({
      point: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deletePoint: function (pointId) {
    var point = Points.findOne(pointId);
    if (point.owner !== Meteor.userId()) {
      // Make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }

    Points.remove(pointId);
  },
});
