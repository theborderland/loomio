angular.module('loomioApp').directive('groupProgressCard', function($translate, Session, Records, IntercomService, ModalService, GroupModal, CoverPhotoForm, LogoPhotoForm, InvitationModal, DiscussionModal, PollCommonStartModal) {
  return {
    scope: {
      group: '=?',
      discussion: '=?'
    },
    restrict: 'E',
    templateUrl: 'generated/components/group_progress_card/group_progress_card.html',
    replace: true,
    controller: function($scope) {
      $scope.group = $scope.group || $scope.discussion.group();
      $scope.show = function() {
        return $scope.group.createdAt.isAfter(moment("2016-10-18")) && $scope.group.isParent() && Session.user().isAdminOf($scope.group) && !Session.user().hasExperienced("dismissProgressCard", $scope.group);
      };
      $scope.activities = [
        {
          translate: "set_description",
          complete: function() {
            return $scope.group.description;
          },
          click: function() {
            return ModalService.open(GroupModal, {
              group: function() {
                return $scope.group;
              }
            });
          }
        }, {
          translate: "set_logo",
          complete: function() {
            return $scope.group.logoUrl() !== '/img/default-logo-medium.png';
          },
          click: function() {
            return ModalService.open(LogoPhotoForm, {
              group: function() {
                return $scope.group;
              }
            });
          }
        }, {
          translate: "set_cover_photo",
          complete: function() {
            return $scope.group.hasCustomCover;
          },
          click: function() {
            return ModalService.open(CoverPhotoForm, {
              group: function() {
                return $scope.group;
              }
            });
          }
        }, {
          translate: "invite_people_in",
          complete: function() {
            return $scope.group.membershipsCount > 1 || $scope.group.invitationsCount > 0;
          },
          click: function() {
            return ModalService.open(InvitationModal, {
              group: function() {
                return $scope.group;
              }
            });
          }
        }, {
          translate: "start_thread",
          complete: function() {
            return $scope.group.discussionsCount > 2;
          },
          click: function() {
            return ModalService.open(DiscussionModal, {
              discussion: function() {
                return Records.discussions.build({
                  groupId: $scope.group.id
                });
              }
            });
          }
        }, {
          translate: "make_decision",
          complete: function() {
            return $scope.group.pollsCount > 1;
          },
          click: function() {
            return ModalService.open(PollCommonStartModal, {
              poll: function() {
                return Records.polls.build({
                  groupId: $scope.group.id
                });
              }
            });
          }
        }
      ];
      $scope.translationFor = function(key) {
        return $translate.instant("loomio_onboarding.group_progress_card.activities." + key);
      };
      $scope.$close = function() {
        Records.memberships.saveExperience("dismissProgressCard", Session.user().membershipFor($scope.group));
        return $scope.dismissed = true;
      };
      return $scope.setupComplete = function() {
        return _.all(_.invoke($scope.activities, 'complete'));
      };
    }
  };
});

angular.module('loomioApp').directive('truncateComment', function() {
  return {
    scope: {
      comment: '='
    },
    restrict: 'E',
    replace: true,
    templateUrl: 'generated/components/truncate_comment/truncate_comment.html',
    controller: function($scope, $timeout) {
      var LONG_COMMENT_HEIGHT, commentHeight;
      commentHeight = 0;
      LONG_COMMENT_HEIGHT = 300;
      $scope.toggleComment = function() {
        angular.element($scope.commentElement()).toggleClass('new-comment__truncated');
        return $scope.commentCollapsed = !$scope.commentCollapsed;
      };
      $scope.commentIsLong = function() {
        return commentHeight > LONG_COMMENT_HEIGHT;
      };
      $scope.commentElement = function() {
        return document.querySelector("#comment-" + $scope.comment.id + " .new-comment__body");
      };
      $scope.elementContainsImage = function() {
        return $scope.commentElement().getElementsByTagName('img').length > 0;
      };
      $timeout(function() {
        commentHeight = $scope.commentElement().clientHeight;
        if ($scope.commentIsLong()) {
          return $scope.toggleComment();
        }
      });
    }
  };
});

angular.module('loomioApp').controller('UpgradePageController', function(AbilityService, $rootScope) {
  $rootScope.$broadcast('currentComponent', {
    page: 'upgradePage'
  });
  if (AbilityService.isLoggedIn()) {
    window.location = '/pricing';
  }
});

angular.module('loomioApp').factory('ChargifyService', function(AppConfig, Session) {
  var ChargifyService;
  return new (ChargifyService = (function() {
    function ChargifyService() {}

    ChargifyService.prototype.chargifyUrlFor = function(group, kind) {
      return "" + (this.chargify().host) + (this.chargify().plans[kind].path) + "?" + (this.encodedParams(group));
    };

    ChargifyService.prototype.encodedParams = function(group) {
      var params;
      params = {
        first_name: Session.user().firstName(),
        last_name: Session.user().lastName(),
        email: Session.user().email,
        organization: group.name,
        reference: group.key + "-" + (moment().unix())
      };
      return _.map(_.keys(params), function(key) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
      }).join('&');
    };

    ChargifyService.prototype.chargify = function() {
      return AppConfig.pluginConfig('loomio_org_plugin').config.chargify;
    };

    return ChargifyService;

  })());
});

angular.module('loomioApp').config(function($provide) {
  return $provide.decorator('ModalService', function($delegate, Session, ChoosePlanModal) {
    var open, paidPlanModals, requirePaidPlan;
    paidPlanModals = ['InstallSlackModal', 'TagModal', 'GroupModal'];
    open = $delegate.open;
    $delegate.open = function(modal, resolve) {
      if (resolve == null) {
        resolve = {};
      }
      if (requirePaidPlan(modal, resolve) && Session.currentGroup && Session.currentGroup.parentOrSelf().subscriptionLevel === 'free') {
        return open(ChoosePlanModal, {
          group: function() {
            return Session.currentGroup.parentOrSelf();
          }
        });
      } else {
        return open(modal, resolve);
      }
    };
    requirePaidPlan = function(modal, resolve) {
      return _.any(paidPlanModals, function(modalName) {
        var matchesTemplate;
        matchesTemplate = modal.templateUrl.match(_.snakeCase(modalName));
        if (modalName === 'GroupModal') {
          return matchesTemplate && resolve.group().isSubgroup();
        } else {
          return matchesTemplate;
        }
      });
    };
    return $delegate;
  });
});

angular.module('loomioApp').config(function($provide) {
  return $provide.decorator('$controller', function($delegate, $location, AppConfig, Session, AbilityService, ChoosePlanModal, SubscriptionSuccessModal) {
    return function() {
      var ctrl;
      ctrl = $delegate.apply(null, arguments);
      if (_.get(arguments, '[1].$router.name') === 'groupPage') {
        ctrl.addLauncher((function(_this) {
          return function() {
            ctrl.group.subscriptionLevel = 'gold';
            ctrl.group.subscriptionKind = 'paid';
            $location.search('chargify_success', null);
            ctrl.openModal(SubscriptionSuccessModal);
            return true;
          };
        })(this), function() {
          return AbilityService.isLoggedIn() && ($location.search().chargify_success != null);
        }, {
          priority: 1
        });
      }
      return ctrl;
    };
  });
});

angular.module('loomioApp').directive('currentPlanButton', function(ChoosePlanModal, SubscriptionSuccessModal, ModalService) {
  return {
    scope: {
      group: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/current_plan_button/current_plan_button.html',
    controller: function($scope) {
      $scope.parentGroup = function() {
        return $scope.group.parentOrSelf();
      };
      $scope.click = function() {
        if ($scope.parentGroup().subscriptionLevel === 'free') {
          return ModalService.open(ChoosePlanModal, {
            group: function() {
              return $scope.parentGroup();
            }
          });
        } else {
          return ModalService.open(SubscriptionSuccessModal, {
            group: function() {
              return $scope.parentGroup();
            }
          });
        }
      };
      return $scope.buttonText = function() {
        if ($scope.parentGroup().subscriptionLevel === 'free') {
          return 'upgrade';
        } else {
          return $scope.parentGroup().subscriptionLevel;
        }
      };
    }
  };
});

angular.module('loomioApp').factory('ChoosePlanModal', function() {
  return {
    templateUrl: 'generated/components/choose_plan_modal/choose_plan_modal.html',
    size: 'choose-plan-modal',
    controller: function($scope, $window, group, Records, Session, ModalService, ChargifyService, IntercomService) {
      $scope.group = group;
      $scope.choosePaidPlan = function(kind) {
        $window.open(ChargifyService.chargifyUrlFor($scope.group, kind));
        return true;
      };
      return $scope.openIntercom = function() {
        IntercomService.contactUs();
        return true;
      };
    }
  };
});

angular.module('loomioApp').factory('SubscriptionSuccessModal', function() {
  return {
    templateUrl: 'generated/components/subscription_success_modal/subscription_success_modal.html',
    size: 'subscription-success-modal',
    controller: function($scope, IntercomService, $rootScope) {
      $scope.openIntercom = function() {
        IntercomService.contactUs();
        return $scope.$close();
      };
      return $scope.dismiss = function() {
        if (Loomio.pluginConfig('loomio_onboarding')) {
          $rootScope.$broadcast('launchIntroCarousel');
        }
        return $scope.$close();
      };
    }
  };
});

angular.module('loomioApp').directive('manageGroupSubscriptionLink', function() {
  return {
    scope: {
      group: '='
    },
    templateUrl: 'generated/components/manage_group_subscription_link/manage_group_subscription_link.html',
    controller: function($scope, $window, AbilityService, ModalService, ChoosePlanModal, ChargifyService) {
      $scope.canManageGroupSubscription = function() {
        return AbilityService.canManageGroupSubscription($scope.group);
      };
      $scope.manageSubscriptions = function() {
        $window.open("https://www.billingportal.com/s/" + (ChargifyService.chargify().appName) + "/login/magic", '_blank');
        return true;
      };
      return $scope.choosePlan = function() {
        return ModalService.open(ChoosePlanModal, {
          group: function() {
            return $scope.group;
          }
        });
      };
    }
  };
});

angular.module('loomioApp').directive('exportGroupDataLink', function() {
  return {
    scope: {
      group: '='
    },
    templateUrl: 'generated/components/export_group_data_link/export_group_data_link.html',
    controller: function($scope, $window, AbilityService, ModalService, ChoosePlanModal, ChargifyService) {
      $scope.ability = function() {
        return AbilityService;
      };
      $scope.downloadExport = function() {
        $window.open("/g/" + $scope.group.key + "/export", '_blank');
        return true;
      };
      return $scope.choosePlan = function() {
        return ModalService.open(ChoosePlanModal, {
          group: function() {
            return $scope.group;
          }
        });
      };
    }
  };
});

angular.module('loomioApp').directive('memberEmailsButton', function(ModalService, ChoosePlanModal) {
  return {
    scope: {
      group: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/member_emails_button/member_emails_button.html',
    controller: function($scope) {
      return $scope.showMemberEmails = function() {
        return ModalService.open(ChoosePlanModal, {
          group: function() {
            return $scope.group;
          }
        });
      };
    }
  };
});

angular.module('loomioApp').directive('memberEmail', function(AbilityService) {
  return {
    scope: {
      membership: '='
    },
    templateUrl: 'generated/components/member_email/member_email.html',
    controller: function($scope) {
      return $scope.canSeeEmail = function() {
        return AbilityService.canAdministerGroup($scope.membership.group()) && $scope.membership.group().parentOrSelf().subscriptionKind === 'paid';
      };
    }
  };
});

angular.module('loomioApp').directive('premiumFeature', function() {
  return {
    scope: {},
    restrict: 'E',
    replace: true,
    templateUrl: 'generated/components/premium_feature/premium_feature.html'
  };
});

angular.module('loomioApp').directive('previewButton', function() {
  return {
    restrict: 'E',
    templateUrl: 'generated/components/preview_button/preview_button.html',
    replace: true,
    controller: function($scope) {
      var selectors;
      selectors = function() {
        return ['.preview-pane', '.lmo-textarea-wrapper textarea', '.lmo-textarea-wrapper .lmo-md-actions'].join(',');
      };
      $scope.toggle = function() {
        angular.element(document.querySelectorAll(selectors())).toggleClass('lmo-hidden');
        return $scope.previewing = !$scope.previewing;
      };
      return $scope.$on('reinitializeForm', function() {
        if ($scope.previewing) {
          return $scope.toggle();
        }
      });
    }
  };
});

angular.module('loomioApp').directive('previewPane', function() {
  return {
    scope: {
      comment: '=?',
      poll: '=?',
      discussion: '=?',
      outcome: '=?'
    },
    restrict: 'E',
    templateUrl: 'generated/components/preview_pane/preview_pane.html',
    replace: true,
    controller: function($scope) {
      $scope.model = $scope.comment || $scope.poll || $scope.discussion || $scope.outcome;
      if ($scope.model) {
        $scope.type = $scope.model.constructor.singular;
      }
      if ($scope.comment) {
        return $scope.$on('reinitializeForm', function(event, comment) {
          return $scope.model = comment;
        });
      }
    }
  };
});

angular.module('loomioApp').controller('TagsPageController', function($rootScope, $routeParams, Records, ThreadQueryService) {
  $rootScope.$broadcast('currentComponent', {
    page: 'tagsPage'
  });
  Records.discussions.fetch({
    path: "tags/" + $routeParams.id
  });
  Records.tags.findOrFetchById($routeParams.id).then((function(_this) {
    return function(tag) {
      var oldThreads;
      _this.tag = Records.tags.find(parseInt($routeParams.id));
      _this.view = ThreadQueryService.queryFor({
        group: _this.tag.group()
      });
      oldThreads = _this.view.threads;
      return _this.view.threads = function() {
        return _.filter(oldThreads(), function(thread) {
          return _.any(Records.discussionTags.find({
            tagId: _this.tag.id,
            discussionId: thread.id
          }));
        });
      };
    };
  })(this));
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('DiscussionTagModel', function(BaseModel) {
  var DiscussionTagModel;
  return DiscussionTagModel = (function(superClass) {
    extend(DiscussionTagModel, superClass);

    function DiscussionTagModel() {
      return DiscussionTagModel.__super__.constructor.apply(this, arguments);
    }

    DiscussionTagModel.singular = 'discussionTag';

    DiscussionTagModel.plural = 'discussionTags';

    DiscussionTagModel.uniqueIndices = ['id'];

    DiscussionTagModel.indices = ['discussionId'];

    DiscussionTagModel.prototype.relationships = function() {
      this.belongsTo('discussion');
      return this.belongsTo('tag');
    };

    DiscussionTagModel.prototype.toggle = function() {
      if (this.isNew()) {
        return this.save();
      } else {
        return this.destroy();
      }
    };

    return DiscussionTagModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('TagModel', function(BaseModel) {
  var TagModel;
  return TagModel = (function(superClass) {
    extend(TagModel, superClass);

    function TagModel() {
      return TagModel.__super__.constructor.apply(this, arguments);
    }

    TagModel.singular = 'tag';

    TagModel.plural = 'tags';

    TagModel.uniqueIndices = ['id'];

    TagModel.indices = ['groupId'];

    TagModel.serializableAttributes = ['groupId', 'color', 'name'];

    TagModel.prototype.relationships = function() {
      return this.belongsTo('group');
    };

    TagModel.prototype.toggle = function(discussionId) {
      this.discussionTagFor(discussionId).toggle();
      return false;
    };

    TagModel.prototype.discussionTagFor = function(discussionId) {
      return _.first(this.recordStore.discussionTags.find({
        tagId: this.id,
        discussionId: discussionId
      })) || this.recordStore.discussionTags.build({
        tagId: this.id,
        discussionId: discussionId
      });
    };

    return TagModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('DiscussionTagRecordsInterface', function(BaseRecordsInterface, DiscussionTagModel) {
  var DiscussionTagRecordsInterface;
  return DiscussionTagRecordsInterface = (function(superClass) {
    extend(DiscussionTagRecordsInterface, superClass);

    function DiscussionTagRecordsInterface() {
      return DiscussionTagRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    DiscussionTagRecordsInterface.prototype.model = DiscussionTagModel;

    return DiscussionTagRecordsInterface;

  })(BaseRecordsInterface);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('TagRecordsInterface', function(BaseRecordsInterface, TagModel) {
  var TagRecordsInterface;
  return TagRecordsInterface = (function(superClass) {
    extend(TagRecordsInterface, superClass);

    function TagRecordsInterface() {
      return TagRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    TagRecordsInterface.prototype.model = TagModel;

    TagRecordsInterface.prototype.fetchByGroup = function(group) {
      return this.fetch({
        params: {
          group_id: group.id
        }
      });
    };

    return TagRecordsInterface;

  })(BaseRecordsInterface);
});

angular.module('loomioApp').config(function($provide) {
  return $provide.decorator('contextPanelDirective', function($delegate, Records, ModalService, TagApplyModal) {
    $delegate[0].compile = function() {
      return function(scope) {
        Records.tags.fetchByGroup(scope.discussion.group().parentOrSelf());
        scope.actions.unshift({
          name: 'tag_thread',
          icon: 'mdi-tag',
          canPerform: function() {
            return _.any(Records.tags.find({
              groupId: scope.discussion.group().parentOrSelf().id
            }));
          },
          perform: function() {
            return ModalService.open(TagApplyModal, {
              discussion: function() {
                return scope.discussion;
              }
            });
          }
        });
        if ($delegate[0].link) {
          return $delegate[0].link.apply(this, arguments);
        }
      };
    };
    return $delegate;
  });
});

angular.module('loomioApp').config(function($provide) {
  return $provide.decorator('LmoUrlService', function($delegate) {
    $delegate.tag = function(tag, params, options) {
      if (params == null) {
        params = {};
      }
      if (options == null) {
        options = {};
      }
      return this.buildModelRoute('tags', tag.id, tag.name.toLowerCase(), params, options);
    };
    return $delegate;
  });
});

angular.module('loomioApp').config(function($provide) {
  return $provide.decorator('Records', function($delegate, DiscussionTagRecordsInterface, TagRecordsInterface) {
    $delegate.addRecordsInterface(DiscussionTagRecordsInterface);
    $delegate.addRecordsInterface(TagRecordsInterface);
    return $delegate;
  });
});

angular.module('loomioApp').directive('tagDisplay', function() {
  return {
    scope: {
      discussion: '='
    },
    restrict: 'E',
    replace: true,
    templateUrl: 'generated/components/tag_display/tag_display.html',
    controller: function($scope, Records) {
      $scope.anyTags = function() {
        return _.any($scope.discussionTags());
      };
      $scope.discussionTags = function() {
        return Records.discussionTags.find({
          discussionId: $scope.discussion.id
        });
      };
    }
  };
});

angular.module('loomioApp').directive('tagCard', function($location, AppConfig, Records, ModalService, TagModal, AbilityService, LoadingService) {
  return {
    scope: {
      group: '='
    },
    templateUrl: 'generated/components/tag_card/tag_card.html',
    controller: function($scope) {
      $scope.parent = $scope.group.parentOrSelf();
      $scope.init = function() {
        return Records.tags.fetchByGroup($scope.parent);
      };
      LoadingService.applyLoadingFunction($scope, 'init');
      $scope.init();
      $scope.showTagCard = function() {
        return $scope.canAdministerGroup() || _.any(Records.tags.find({
          groupId: $scope.parent.id
        }));
      };
      $scope.openTagForm = function() {
        return ModalService.open(TagModal, {
          tag: function() {
            return Records.tags.build({
              groupId: $scope.parent.id,
              color: AppConfig.pluginConfig('loomio_tags').config.colors[0]
            });
          }
        });
      };
      $scope.canAdministerGroup = function() {
        return AbilityService.canAdministerGroup($scope.parent);
      };
      return $scope.$on('editTag', function(e, tag) {
        return ModalService.open(TagModal, {
          tag: function() {
            return tag;
          }
        });
      });
    }
  };
});

angular.module('loomioApp').directive('tagList', function(Records, FlashService, AbilityService) {
  return {
    scope: {
      group: '=?',
      discussion: '=?',
      admin: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/tag_list/tag_list.html',
    controller: function($scope) {
      $scope.parent = ($scope.group || $scope.discussion.group()).parentOrSelf();
      Records.tags.fetchByGroup($scope.parent);
      $scope.groupTags = function() {
        return Records.tags.find({
          groupId: $scope.parent.id
        });
      };
      $scope.tagSelected = function(tagId) {
        return _.any(Records.discussionTags.find({
          discussionId: $scope.discussion.id,
          tagId: tagId
        }));
      };
      $scope.canAdministerGroup = function() {
        return AbilityService.canAdministerGroup($scope.parent);
      };
      return $scope.editTag = function(tag) {
        return $scope.$emit('editTag', tag);
      };
    }
  };
});

angular.module('loomioApp').directive('tagForm', function(AppConfig, Records, ModalService, FormService, DestroyTagModal) {
  return {
    scope: {
      tag: '='
    },
    restrict: 'E',
    replace: true,
    templateUrl: 'generated/components/tag_form/tag_form.html',
    controller: function($scope) {
      $scope.tagColors = AppConfig.pluginConfig('loomio_tags').config.colors;
      $scope.closeForm = function() {
        return $scope.$emit('closeTagForm');
      };
      $scope.openDestroyForm = function() {
        return ModalService.open(DestroyTagModal, {
          tag: function() {
            return $scope.tag;
          }
        });
      };
      $scope.submit = FormService.submit($scope, $scope.tag, {
        flashSuccess: 'loomio_tags.tag_created',
        successCallback: $scope.closeForm
      });
    }
  };
});

angular.module('loomioApp').factory('TagModal', function(Records) {
  return {
    templateUrl: 'generated/components/tag_modal/tag_modal.html',
    controller: function($scope, tag) {
      $scope.tag = tag.clone();
      return $scope.$on('closeTagForm', $scope.$close);
    }
  };
});

angular.module('loomioApp').factory('TagApplyModal', function() {
  return {
    templateUrl: 'generated/components/tag_apply_modal/tag_apply_modal.html',
    controller: function($scope, discussion) {
      return $scope.discussion = discussion;
    }
  };
});

angular.module('loomioApp').factory('DestroyTagModal', function(Records, FormService) {
  return {
    templateUrl: 'generated/components/destroy_tag_modal/destroy_tag_modal.html',
    controller: function($scope, tag) {
      $scope.tag = Records.tags.find(tag.id);
      return $scope.submit = FormService.submit($scope, $scope.tag, {
        submitFn: $scope.tag.destroy,
        flashSuccess: 'loomio_tags.tag_destroyed',
        successCallback: function() {
          $scope.tag.remove();
          return _.each(Records.discussionTags.find({
            tagId: tag.id
          }), function(dtag) {
            return dtag.remove();
          });
        }
      });
    }
  };
});

angular.module("loomioApp").run(["$templateCache", function($templateCache) {$templateCache.put("generated/components/group_progress_card/group_progress_card.html","<div class=\"lmo-blank\"> <section ng-if=\"show()\" class=\"group-progress-card lmo-card\"><div class=\"group-progress-card__row\"><h2 translate=\"loomio_onboarding.group_progress_card.title\" class=\"lmo-card-heading\" id=\"group-progress-card__title\"></h2><material_modal_header_cancel_button class=\"group-progress-card__dismiss\"></material_modal_header_cancel_button></div><ul class=\"group-progress-card__list\"><li ng-click=\"activity.click()\" ng-repeat=\"activity in activities\" ng-class=\"{\'group-progress-card__complete\': activity.complete()}\" class=\"group-progress-card__list-item\"> <i ng-if=\"activity.complete()\" class=\"mdi mdi-24px mdi-checkbox-marked\"></i>  <i ng-if=\"!activity.complete()\" class=\"mdi mdi-24px mdi-checkbox-blank-outline\"></i> <span class=\"group-progress-card__activity-text\">{{ translationFor(activity.translate) }}</span></li></ul><div ng-if=\"setupComplete()\" class=\"group-progress-card__celebration-message\"> <span>🎉</span>  <strong translate=\"loomio_onboarding.group_progress_card.celebration_message\"></strong> <a ng-click=\"$close()\" translate=\"loomio_onboarding.group_progress_card.dismiss_this_card\" class=\"lmo-pointer\"></a></div><a ng-href=\"https://loomio.school\" title=\"{{ \'loomio_onboarding.group_progress_card.learn_more_title\' | translate }}\" class=\"lmo-pointer group-progress-card__learn-more\"> <span translate=\"loomio_onboarding.group_progress_card.learn_more\"></span> </a></section> </div>");
$templateCache.put("generated/components/truncate_comment/truncate_comment.html","<button ng-show=\"commentIsLong()\" ng-click=\"toggleComment()\" aria-hidden=\"true\" class=\"lmo-btn-link new-comment__truncation\"><div ng-show=\"commentCollapsed\" class=\"new-comment__gradient\"></div><div ng-show=\"commentCollapsed\" translate=\"truncate_comment.show_more\" class=\"new-comment__show-more lmo-font--small\"></div></button>");
$templateCache.put("generated/components/upgrade_page/upgrade_page.html","");
$templateCache.put("generated/components/current_plan_button/current_plan_button.html","<button ng-click=\"click()\" class=\"current-plan-button md-button\"><i ng-if=\"parentGroup().subscriptionLevel != \'free\'\" class=\"mdi mdi-star mdi-24px premium-feature__star\"></i><span translate=\"{{\'current_plan_button.\'+buttonText()}}\"></span></button>");
$templateCache.put("generated/components/choose_plan_modal/choose_plan_modal.html","<md-dialog class=\"pricing-table__modal\"><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><div class=\"buh\"></div><h1 translate=\"pricing_page.upgrade_for_premium_features\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content md-body-1\"><div class=\"pricing-table__flex\"><div class=\"pricing-table__option pricing-table__option--gift\"><h2 translate=\"pricing_page.gift\"></h2><p translate=\"pricing_page.gift_price_html\" class=\"pricing-table__price\"></p><p class=\"pricing-table__price--annually\">&nbsp;</p><p translate=\"pricing_page.gift_body\" class=\"pricing-table__plan-description\"></p><p translate=\"pricing_page.gift_features\" class=\"pricing-table__plan-includes\"></p><ul><li translate=\"pricing_page.one_group\"></li><li translate=\"pricing_page.discussions\"></li><li translate=\"pricing_page.decisions\"></li><li translate=\"pricing_page.file_document_storage\"></li><li translate=\"pricing_page.particpate_either_way\"></li><li translate=\"pricing_page.password_free_secure_login\"></li><li translate=\"pricing_page.community_support\"></li></ul></div><div class=\"pricing-table__option pricing-table__option--standard\"><h2 translate=\"pricing_page.standard\"></h2><p translate=\"pricing_page.standard_price_html\" class=\"pricing-table__price\"></p><p translate=\"pricing_page.annual_standard_price_html\" class=\"pricing-table__price--annually\"></p><p translate=\"pricing_page.standard_body_html\" class=\"pricing-table__plan-description\"></p><p translate=\"pricing_page.standard_features\" class=\"pricing-table__plan-includes\"></p><ul><li translate=\"pricing_page.slack_integration_html\"></li><li translate=\"pricing_page.subgroups\"></li><li translate=\"pricing_page.category_tags\"></li><li translate=\"pricing_page.custom_subdomain_html\"></li><li translate=\"pricing_page.data_export\"></li><li translate=\"pricing_page.customer_support_html\"></li></ul><div class=\"pricing-table__button-spacer\"></div><md-button ng-click=\"choosePaidPlan(\'standard\')\" translate=\"pricing_page.select\" class=\"md-accent md-raised\"></md-button></div><div class=\"pricing-table__option pricing-table__option--plus\"><h2 translate=\"pricing_page.plus\"></h2><p translate=\"pricing_page.plus_price_html\" class=\"pricing-table__price\"></p><p translate=\"pricing_page.annual_plus_price_html\" class=\"pricing-table__price--annually\"></p><p translate=\"pricing_page.plus_body_html\" class=\"pricing-table__plan-description\"></p><p translate=\"pricing_page.plus_features\" class=\"pricing-table__plan-includes\"></p><ul><li translate=\"pricing_page.multiple_groups\"></li><li translate=\"pricing_page.analytics_report\"></li><li translate=\"pricing_page.premium_support\"></li><li translate=\"pricing_page.ldap_coming_soon\"></li></ul><div class=\"pricing-table__button-spacer\"></div><md-button ng-click=\"choosePaidPlan(\'plus\')\" translate=\"pricing_page.select\" class=\"md-accent md-raised\"></md-button></div></div><div class=\"modal-footer\"><div class=\"pricing_page__footer\"><p translate=\"pricing_page.prices_in_us_dollars\"></p><p translate=\"pricing_page.free_is_for_community_and_evaluation_html\"></p><p><span translate=\"pricing_page.need_something_else_html\"></span> <a translate=\"pricing_page.lets_talk\" ng-click=\"openIntercom()\"></a> </p><p translate=\"pricing_page.privacy_respected\"></p></div></div></div></md-dialog>");
$templateCache.put("generated/components/subscription_success_modal/subscription_success_modal.html","<md-dialog class=\"subscription-success-modal\"><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"subscription_success_modal.heading\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content md-body-1\"><img src=\"/img/mascot.png\" class=\"subscription-success-modal__mascot\"><div class=\"subscription-success-modal__message\"><p translate=\"subscription_success_modal.receipt\"></p><p><span translate=\"subscription_success_modal.got_questions_then\"></span><span><button translate=\"subscription_success_modal.contact_us\" ng-click=\"openIntercom()\" class=\"subscription-success-modal__contact-link\"></button></span></p><p translate=\"subscription_success_modal.sign_off\"></p></div><div class=\"lmo-md-action\"><button type=\"button\" ng-click=\"dismiss()\" translate=\"subscription_success_modal.ok_got_it\" class=\"lmo-btn--submit\"></button></div></div></md-dialog>");
$templateCache.put("generated/components/manage_group_subscription_link/manage_group_subscription_link.html","<md-menu-item ng-if=\"canManageGroupSubscription()\"><md-button ng-if=\"group.subscriptionKind == \'paid\'\" ng-click=\"manageSubscriptions()\"><span translate=\"group_page.options.manage_subscription\"></span></md-button><md-button ng-if=\"group.subscriptionKind == \'gift\'\" ng-click=\"choosePlan()\"><span translate=\"group_page.options.manage_subscription\"></span></md-button></md-menu-item>");
$templateCache.put("generated/components/export_group_data_link/export_group_data_link.html","<md-menu-item ng-if=\"ability().canAdministerGroup(group) &amp;&amp; group.isParent()\"><md-button ng-if=\"group.subscriptionKind == \'paid\'\" ng-click=\"downloadExport()\"><span translate=\"export_group_data_link.download_group_data_export\"></span></md-button><md-button ng-if=\"group.subscriptionKind != \'paid\'\" ng-click=\"choosePlan()\"><span translate=\"export_group_data_link.download_group_data_export\"></span></md-button></md-menu-item>");
$templateCache.put("generated/components/member_emails_button/member_emails_button.html","<div ng-if=\"group.parentOrSelf().subscriptionLevel == \'free\'\" class=\"member-emails-button\"><md-tooltip md-direction=\"top\" class=\"group-privacy-button__tooltip\"><span translate=\"member_emails_button.helptext\"></span></md-tooltip><md-button ng-click=\"showMemberEmails()\" translate=\"member_emails_button.show_member_emails\" class=\"md-accent member-emails-button__submit\"></md-button></div>");
$templateCache.put("generated/components/member_email/member_email.html","<div ng-if=\"canSeeEmail()\" class=\"member-email md-caption\"><a href=\"mailto:{{::membership.user().email}}\">{{ ::membership.user().email }}</a></div>");
$templateCache.put("generated/components/premium_feature/premium_feature.html","<div class=\"premium-feature lmo-flex lmo-flex__center\"><i class=\"mdi mdi-star mdi-24px premium-feature__star\"></i><div translate=\"premium_feature.premium_feature\" class=\"lmo-hint-text\"></div></div>");
$templateCache.put("generated/components/preview_button/preview_button.html","<div class=\"preview-button\"><md-button ng-click=\"toggle()\" class=\"preview-button md-accent\"><span ng-if=\"previewing\" translate=\"common.action.edit\"></span><span ng-if=\"!previewing\" translate=\"loomio_content_preview.preview_button.preview\"></span></md-button></div>");
$templateCache.put("generated/components/preview_pane/preview_pane.html","<div class=\"preview-pane lmo-hidden preview-pane--{{type}}\"><div ng-if=\"!model.hasDescription()\" translate=\"loomio_content_preview.preview_pane.no_content\" class=\"lmo-hint-text preview-pane--no-content\"></div><!--/ for comment previews--><div ng-if=\"model.hasDescription()\"><div ng-if=\"type == \'comment\'\" class=\"thread-item__header lmo-flex lmo-flex__center\"><user_avatar user=\"model.author()\" size=\"small\" class=\"lmo-margin-right\"></user_avatar><h3 class=\"new-comment__in-reply-to\"> <strong>{{ model.authorName() }}</strong> <span ng-if=\"model.parentId\" translate=\"new_comment_item.in_reply_to\" translate-value-recipient=\"{{model.parentAuthorName}}\"></span></h3><div ng-if=\"!model.parentId\" id=\"event-{{event.id}}\" translate=\"new_comment_item.aria_label\" translate-value-author=\"{{model.authorName()}}\" class=\"sr-only\"></div></div><div ng-if=\"type == \'comment\'\" marked=\"model.cookedBody()\" class=\"thread-item__body new-comment__body lmo-markdown-wrapper\"></div><!--/ for context previews--><div ng-if=\"type != \'comment\'\" marked=\"model.cookedDescription()\" class=\"lmo-markdown-wrapper\"></div></div></div>");
$templateCache.put("generated/components/tags_page/tags_page.html","<div class=\"loading-wrapper lmo-one-column-layout\"><loading ng-if=\"!tagsPage.tag.group()\"></loading><main ng-if=\"tagsPage.tag.group()\" class=\"tags-page\"><div class=\"tags-page__group-theme-padding\"></div><tag_fetcher group=\"group\"></tag_fetcher><group_theme group=\"tagsPage.tag.group()\"></group_theme><h2 translate=\"loomio_tags.tags_marked\" translate-value-name=\"{{tagsPage.tag.name}}\" translate-value-group-name=\"{{tagsPage.tag.group().name}}\" class=\"pull-left tags-page__header lmo-font--small\"></h2><div class=\"clearfix\"></div><div ng-if=\"!tagsPage.view.any()\" class=\"tags-page__no-threads\"> <span translate=\"loomio_tags.no_tags_present\"></span> </div><div ng-if=\"tagsPage.view.any()\" class=\"tags-page__thread-container lmo-card--no-padding\"><section class=\"thread-preview-collection__container\"><thread_preview_collection query=\"tagsPage.view\" class=\"thread-previews-container\"></thread_preview_collection></section></div></main></div>");
$templateCache.put("generated/components/tag_display/tag_display.html","<div ng-show=\"anyTags()\" class=\"thread-tags lmo-flex\"><a ng-repeat=\"dtag in discussionTags() | orderBy: \'tag().name\' track by dtag.id\" lmo-href-for=\"dtag.tag()\" style=\"color: {{dtag.tag().color}}; border-color: {{dtag.tag().color}}\" class=\"lmo-badge\"><span>{{dtag.tag().name}}</span></a></div>");
$templateCache.put("generated/components/tag_card/tag_card.html","<div ng-if=\"showTagCard()\" class=\"lmo-card tag-card\"><h2 translate=\"loomio_tags.card_title\" class=\"lmo-card-heading\"></h2><loading ng-if=\"initExecuting\"></loading><div ng-if=\"!initExecuting\" class=\"poll-tags-card__tags\"><div ng-if=\"!tags().length\" translate=\"loomio_tags.helptext\" class=\"lmo-hint-text\"></div><tag_list group=\"parent\" admin=\"canAdministerGroup()\"></tag_list><div ng-if=\"canAdministerGroup()\" class=\"lmo-md-actions\"><outlet name=\"tag-card-footer\"></outlet><md-button ng-click=\"openTagForm()\" translate=\"loomio_tags.new_tag\" class=\"md-primary md-raised tag-form__create-tag\"></md-button></div></div></div>");
$templateCache.put("generated/components/tag_list/tag_list.html","<md-list class=\"tag-list\"><md-menu-item ng-repeat=\"tag in groupTags() | orderBy: \'name\' track by tag.id\" class=\"tag-list__tag\"><div ng-if=\"!discussion\" style=\"border-color: {{tag.color}}; color: {{tag.color}}\" class=\"md-button tag-list__visit\"><a lmo-href-for=\"tag\" class=\"tag-list__link\"> <strong class=\"md-block\">{{ tag.name }}</strong> <div class=\"tag-list__count lmo-font--small\"> <span ng-if=\"tag.discussionTagsCount == 1\" translate=\"loomio_tags.discussions_count_singular\" translate-value-count=\"{{tag.discussionTagsCount}}\"></span>  <span ng-if=\"tag.discussionTagsCount &gt; 1\" translate=\"loomio_tags.discussions_count_plural\" translate-value-count=\"{{tag.discussionTagsCount}}\"></span> </div></a></div> <div ng-if=\"discussion\" ng-mouseup=\"tag.toggle(discussion.id)\" style=\"border-color: {{tag.color}}; color: {{tag.color}}\" class=\"md-button tag-list__toggle lmo-flex\"><span class=\"tag-list__check\"><i ng-if=\"tagSelected(tag.id)\" class=\"mdi mdi-check mdi-24px\"></i></span><strong class=\"lmo-flex__grow\">{{ tag.name }}</strong></div> <div ng-if=\"admin\" ng-mouseup=\"editTag(tag)\" class=\"md-button tag-list__action\"><i class=\"mdi mdi-pencil mdi-24px\"></i></div></md-menu-item></md-list>");
$templateCache.put("generated/components/tag_form/tag_form.html","<div class=\"tag-form\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-input-container class=\"md-block\"><label for=\"tag-name\" translate=\"loomio_tags.name_label\"></label><input ng-model=\"tag.name\" placeholder=\"Enter tag name...\" class=\"tag-form__name\"><validation_errors subject=\"tag\" field=\"name\"></validation_errors></md-input-container><div class=\"tag-form__color-option-container\"><div ng-repeat=\"color in tagColors\" style=\"background-color: {{color}}\" ng-mouseup=\"tag.color = color\" class=\"tag-form__color-option\"><i ng-if=\"color == tag.color\" class=\"mdi mdi-check mdi-24px\"></i></div></div><div class=\"lmo-md-actions\"><div ng-if=\"tag.isNew()\"></div><div ng-if=\"!tag.isNew()\" ng-click=\"openDestroyForm()\" translate=\"loomio_tags.destroy_tag\" class=\"md-button md-warn\"></div><div ng-click=\"submit()\" translate=\"common.action.save\" class=\"md-button md-primary md-raised tag-form__submit\"></div></div></div>");
$templateCache.put("generated/components/tag_modal/tag_modal.html","<md-dialog class=\"tag-modal\"><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><i class=\"mdi mdi-tag mdi-24px\"></i><h1 ng-if=\"tag.isNew()\" translate=\"loomio_tags.modal_title\" class=\"lmo-h1\"></h1><h1 ng-if=\"!tag.isNew()\" translate=\"loomio_tags.modal_edit_title\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content\"><tag_form tag=\"tag\"></tag_form></div></md-dialog>");
$templateCache.put("generated/components/tag_apply_modal/tag_apply_modal.html","<md-dialog class=\"tag-apply-modal lmo-modal__narrow\"><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><i class=\"mdi mdi-tag\"></i><h1 translate=\"loomio_tags.apply_tags\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div ng-switch=\"currentStep\" class=\"md-dialog-content md-body-1 lmo-slide-animation\"><tag_list discussion=\"discussion\"></tag_list><div class=\"lmo-md-action\"><md-button ng-click=\"$close()\" translate=\"common.action.ok\" class=\"md-raised md-primary tag-apply-modal__submit\"></md-button></div></div></md-dialog>");
$templateCache.put("generated/components/destroy_tag_modal/destroy_tag_modal.html","<md-dialog class=\"destroy-tag-modal\"><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><i class=\"mdi mdi-tag mdi-24px\"></i><h1 translate=\"loomio_tags.modal_destroy_title\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content\"><p translate=\"loomio_tags.destroy_helptext\" class=\"poll-common-helptext\"></p><div class=\"lmo-flex lmo-flex__space-between\"><md-button ng-click=\"$close()\" aria-label=\"{{\'common.action.cancel\' | translate}}\" translate=\"common.action.cancel\"></md-button><md-button ng-click=\"submit()\" aria-label=\"{{\'loomio_tags.destroy_tag\' | translate}}\" translate=\"loomio_tags.destroy_tag\" class=\"md-primary md-raised\"></md-button></div></div></md-dialog>");}]);