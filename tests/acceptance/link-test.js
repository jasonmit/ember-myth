import Ember from 'ember';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: Style', {
  setup: function() {
    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('Validating stylesheet using the DOM', function() {
  visit('/');

  andThen(function() {
    var body     = Ember.$('body')[0];
    var a        = document.createElement('a');
    var aStyle   = window.getComputedStyle(a);
    var div      = document.createElement('div');
    var divStyle = window.getComputedStyle(div);

    body.appendChild(a);
    body.appendChild(div);

    equal(aStyle.getPropertyValue('color'), 'rgb(132, 122, 209)', 'Color is able to be set using variable');
    equal(divStyle.getPropertyValue('width'), '10px', 'Width is set using variable');
    equal(divStyle.getPropertyValue('height'), '20px', 'Height is set using variable + calc');
  });
});
