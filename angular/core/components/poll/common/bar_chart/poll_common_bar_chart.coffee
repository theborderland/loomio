angular.module('loomioApp').directive 'pollCommonBarChart', (AppConfig, Records) ->
  scope: {poll: '=', namesOnly: '=?'}
  templateUrl: 'generated/components/poll/common/bar_chart/poll_common_bar_chart.html'
  controller: ($scope) ->
    $scope.countFor = (option) ->
      $scope.poll.stanceData[option.name] or 0 unless $scope.namesOnly

    $scope.barTextFor = (option) ->
      _.compact([$scope.countFor(option), option.name]).join(' - ').replace(/\s/g, '\u00a0')

    percentageFor = (option) ->
      return "100%" if $scope.namesOnly
      max = _.max(_.values($scope.poll.stanceData))
      return unless max > 0
      "#{100 * $scope.countFor(option) / max}%"

    backgroundImageFor = (option) ->
      "url(/img/poll_backgrounds/#{option.color.replace('#','')}.png)"

    $scope.styleData = (option) ->
      'background-image': backgroundImageFor(option)
      'background-size': percentageFor(option)
