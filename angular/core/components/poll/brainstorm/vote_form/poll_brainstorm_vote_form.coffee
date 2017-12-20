angular.module('loomioApp').directive 'pollBrainstormVoteForm', (AppConfig, Records, PollService, KeyEventService) ->
  scope: {stance: '='}
  templateUrl: 'generated/components/poll/brainstorm/vote_form/poll_brainstorm_vote_form.html'
  controller: ($scope) ->
    $scope.pollOptionNames = _.pluck $scope.stance.pollOptions(), 'name'

    $scope.submit = PollService.submitStance $scope, $scope.stance,
      prepareFn: (optionName) ->
        $scope.stance.choice = _.compact $scope.pollOptionNames
        $scope.$emit 'processing'

    $scope.addOption = ->
      return unless $scope.newOptionName.length
      $scope.pollOptionNames.push $scope.newOptionName
      $scope.newOptionName = ""

    $scope.removeOption = (name) ->
      _.pull $scope.pollOptionNames, name
