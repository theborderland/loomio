angular.module('loomioApp').directive 'pollBrainstormVoteForm', (AppConfig, Records, PollService, KeyEventService) ->
  scope: {stance: '='}
  templateUrl: 'generated/components/poll/brainstorm/vote_form/poll_brainstorm_vote_form.html'
  controller: ($scope) ->
    $scope.submit = PollService.submitStance $scope, $scope.stance,
      prepareFn: (optionName) ->
        option = PollService.optionByName($scope.stance.poll(), optionName)
        $scope.$emit 'processing'
        $scope.stance.stanceChoicesAttributes = [poll_option_id: option.id]

    $scope.yesColor = AppConfig.pollColors.count[0]
    $scope.noColor  = AppConfig.pollColors.count[1]

    KeyEventService.submitOnEnter($scope)
