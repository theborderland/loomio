angular.module('loomioApp').directive 'pollBrainstormForm', ->
  scope: {poll: '=', back: '=?'}
  templateUrl: 'generated/components/poll/brainstorm/form/poll_brainstorm_form.html'
