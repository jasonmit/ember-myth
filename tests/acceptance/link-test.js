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
    var link = find('a');
    var pre  = find('pre');
    equal(link.css('color'), 'rgb(132, 122, 209)', 'Color is able to be set using variable');
    equal(pre.css('padding'), '10px', 'Padding is set using variable');
    equal(pre.css('margin'), '20px', 'Margin is set using variable + calc');
  });
});
