if ((bowser.safari && bowser.version < 9) || (bowser.ie && bowser.version < 10)) {
  window.location.href = "/417.html";
}

angular.module('loomioApp', ['ngNewRouter', 'pascalprecht.translate', 'ngSanitize', 'hc.marked', 'angularFileUpload', 'mentio', 'ngAnimate', 'angular-inview', 'ui.gravatar', 'duScroll', 'angular-clipboard', 'angularMoment', 'offClick', 'ngMaterial', 'angulartics', 'angulartics.google.tagmanager', 'vcRecaptcha', 'ngAnimate', 'angular-sortable-view']);

window.Loomio.routes = [
  {
    path: '/dashboard',
    component: 'dashboardPage'
  }, {
    path: '/dashboard/:filter',
    component: 'dashboardPage'
  }, {
    path: '/polls',
    component: 'pollsPage'
  }, {
    path: '/polls/:filter',
    component: 'pollsPage'
  }, {
    path: '/inbox',
    component: 'inboxPage'
  }, {
    path: '/groups',
    component: 'groupsPage'
  }, {
    path: '/explore',
    component: 'explorePage'
  }, {
    path: '/profile',
    component: 'profilePage'
  }, {
    path: '/contact',
    component: 'contactPage'
  }, {
    path: '/email_preferences',
    component: 'emailSettingsPage'
  }, {
    path: '/verify_stances',
    component: 'verifyStancesPage'
  }, {
    path: '/d/:key',
    component: 'threadPage'
  }, {
    path: '/d/:key/:stub',
    component: 'threadPage'
  }, {
    path: '/d/:key/comment/:comment',
    component: 'threadPage'
  }, {
    path: '/p/new',
    component: 'startPollPage'
  }, {
    path: '/p/new/:poll_type',
    component: 'startPollPage'
  }, {
    path: '/p/:key/',
    component: 'pollPage'
  }, {
    path: '/p/:key/:stub',
    component: 'pollPage'
  }, {
    path: '/g/:key/memberships',
    component: 'membershipsPage'
  }, {
    path: '/g/:key/memberships/:username',
    component: 'membershipsPage'
  }, {
    path: '/g/:key/membership_requests',
    component: 'membershipRequestsPage'
  }, {
    path: '/g/:key/documents',
    component: 'documentsPage'
  }, {
    path: '/g/:key/previous_polls',
    component: 'previousPollsPage'
  }, {
    path: '/g/new',
    component: 'startGroupPage'
  }, {
    path: '/g/:key',
    component: 'groupPage'
  }, {
    path: '/g/:key/:stub',
    component: 'groupPage'
  }, {
    path: '/u/:key',
    component: 'userPage'
  }, {
    path: '/u/:key/:stub',
    component: 'userPage'
  }, {
    path: '/apps/authorized',
    component: 'authorizedAppsPage'
  }, {
    path: '/apps/registered',
    component: 'registeredAppsPage'
  }, {
    path: '/apps/registered/:id',
    component: 'registeredAppPage'
  }, {
    path: '/apps/registered/:id/:stub',
    component: 'registeredAppPage'
  }, {
    path: '/slack/install',
    component: 'installSlackPage'
  }
];

if (document.location.protocol.match(/https/) && (navigator.serviceWorker != null)) {
  navigator.serviceWorker.register(document.location.origin + '/service-worker.js', {
    scope: './'
  });
}

angular.module('loomioApp').config(function($analyticsProvider) {
  $analyticsProvider.firstPageview(true);
  return $analyticsProvider.withAutoBase(true);
});

angular.module('loomioApp').config(function($animateProvider) {
  if (window.Loomio.environment === 'test') {
    return $animateProvider.classNameFilter(/no-elements-shall-animate-on-test/);
  } else {
    return $animateProvider.classNameFilter(/animated/);
  }
});

angular.module('loomioApp').config(function($compileProvider) {
  if (window.Loomio.environment === 'production') {
    return $compileProvider.debugInfoEnabled(false);
  }
});

angular.module('loomioApp').config(function($locationProvider) {
  return $locationProvider.html5Mode(true);
});

angular.module('loomioApp').config(function(markedProvider) {
  var _parse, customRenderer;
  customRenderer = function(opts) {
    var _super, cook, renderer;
    _super = new marked.Renderer(opts);
    renderer = _.clone(_super);
    cook = function(text) {
      text = emojione.shortnameToImage(text);
      text = text.replace(/\[\[@([a-zA-Z0-9]+)\]\]/g, "<a class='lmo-user-mention' href='/u/$1'>@$1</a>");
      return text;
    };
    renderer.paragraph = function(text) {
      return _super.paragraph(cook(text));
    };
    renderer.listitem = function(text) {
      return _super.listitem(cook(text));
    };
    renderer.tablecell = function(text, flags) {
      return _super.tablecell(cook(text), flags);
    };
    renderer.heading = function(text, level) {
      return _super.heading(emojione.shortnameToImage(text), level, text);
    };
    renderer.link = function(href, title, text) {
      return _super.link(href, title, text).replace('<a ', '<a rel="noopener noreferrer" target="_blank" ');
    };
    return renderer;
  };
  _parse = marked.parse;
  marked.parse = function(src, opt, callback) {
    src = src.replace(/<img[^>]+\>/ig, "");
    src = src.replace(/<script[^>]+\>/ig, "");
    return _parse(src, opt, callback);
  };
  return markedProvider.setRenderer(customRenderer({
    gfm: true,
    sanitize: true,
    breaks: true
  }));
});

angular.module('loomioApp').config(function($mdThemingProvider, $mdAriaProvider) {
  var theme;
  theme = window.Loomio.theme;
  if (theme.custom_primary_palette) {
    $mdThemingProvider.definePalette('custom_primary', theme.custom_primary_palette);
  }
  if (theme.custom_accent_palette) {
    $mdThemingProvider.definePalette('custom_accent', theme.custom_accent_palette);
  }
  if (theme.custom_warn_palette) {
    $mdThemingProvider.definePalette('custom_warn', theme.custom_warn_palette);
  }
  $mdThemingProvider.theme('default').primaryPalette(theme.primary_palette, theme.primary_palette_config);
  $mdThemingProvider.theme('default').accentPalette(theme.accent_palette, theme.accent_palette_config);
  $mdThemingProvider.theme('default').warnPalette(theme.warn_palette, theme.warn_palette_config);
  return $mdAriaProvider.disableWarnings();
});

angular.module('loomioApp').config(function($mdDateLocaleProvider) {
  return $mdDateLocaleProvider.formatDate = function(date) {
    return moment(date).format('D MMMM YYYY');
  };
});

angular.module('loomioApp').config(function($provide) {
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector;
  }
  if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
      var el;
      el = this;
      if (!document.documentElement.contains(el)) {
        return null;
      }
      while (true) {
        if (el.matches(s)) {
          return el;
        }
        el = el.parentElement || el.parentNode;
        if (el === null) {
          break;
        }
      }
      return null;
    };
  }
  return $provide.decorator('mentioMenuDirective', function($delegate) {
    var directive;
    directive = _.first($delegate);
    directive.compile = function() {
      return function(scope, elem) {
        var modal;
        directive.link.apply(this, arguments);
        if (modal = scope.parentMentio.targetElement[0].closest('.modal')) {
          return modal.appendChild(elem[0]);
        }
      };
    };
    return $delegate;
  });
});

angular.module('loomioApp').config(function($translateProvider) {
  return $translateProvider.useUrlLoader('/api/v1/translations').useSanitizeValueStrategy('escapeParameters').preferredLanguage(window.Loomio.currentUserLocale || 'en');
});

angular.module('loomioApp').filter('timeFromNowInWords', function() {
  return function(date, excludeAgo) {
    return moment(date).fromNow(excludeAgo);
  };
});

angular.module('loomioApp').filter('exactDateWithTime', function() {
  return function(date) {
    return moment(date).format('dddd MMMM Do [at] h:mm a');
  };
});

angular.module('loomioApp').filter('filterModel', function() {
  return function(records, fragment) {
    if (records == null) {
      records = [];
    }
    return _.filter(records, function(record) {
      return _.some(_.map(record.constructor.searchableFields, function(field) {
        if (typeof record[field] === 'function') {
          field = record[field]();
        }
        if ((field != null) && (field.search != null)) {
          return ~field.search(new RegExp(fragment, 'i'));
        }
      }));
    });
  };
});

angular.module('loomioApp').filter('limitByFn', function() {
  return function(items, f, args) {
    if (items) {
      return items.slice(0, f(args));
    }
  };
});

angular.module('loomioApp').filter('truncate', function() {
  return function(string, length, separator) {
    if (length == null) {
      length = 100;
    }
    if (separator == null) {
      separator = ' ';
    }
    return _.trunc(string, {
      length: length,
      separator: separator
    });
  };
});

emojione.unicodeAlt = false;

emojione.imagePathPNG = "/img/emojis/";

emojione.ascii = true;

_.fromPairs = function(pairs) {
  var index, length, pair, result;
  index = -1;
  length = pairs === null ? 0 : pairs.length;
  result = {};
  while (++index < length) {
    pair = pairs[index];
    result[pair[0]] = pair[1];
  }
  return result;
};

_.pickBy = function(object, fn) {
  var i, key, len, ref, result;
  result = {};
  ref = _.keys(object);
  for (i = 0, len = ref.length; i < len; i++) {
    key = ref[i];
    if (fn(object[key])) {
      result[key] = object[key];
    }
  }
  return result;
};

angular.module('loomioApp').factory('AbilityService', function(AppConfig, Records, Session) {
  var AbilityService;
  return new (AbilityService = (function() {
    function AbilityService() {}

    AbilityService.prototype.isLoggedIn = function() {
      return this.isUser() && (Session.user().restricted == null);
    };

    AbilityService.prototype.isSiteAdmin = function() {
      return this.isLoggedIn() && Session.user().isAdmin;
    };

    AbilityService.prototype.isEmailVerified = function() {
      return this.isLoggedIn() && Session.user().emailVerified;
    };

    AbilityService.prototype.isUser = function() {
      return AppConfig.currentUserId != null;
    };

    AbilityService.prototype.canContactUser = function(user) {
      return this.isLoggedIn() && Session.user().id !== user.id && _.intersection(Session.user().groupIds(), user.groupIds()).length;
    };

    AbilityService.prototype.canAddComment = function(thread) {
      return Session.user().isMemberOf(thread.group());
    };

    AbilityService.prototype.canRespondToComment = function(comment) {
      return Session.user().isMemberOf(comment.group());
    };

    AbilityService.prototype.canStartPoll = function(group) {
      return group && (this.canAdministerGroup(group) || Session.user().isMemberOf(group) && group.membersCanRaiseMotions);
    };

    AbilityService.prototype.canParticipateInPoll = function(poll) {
      if (!poll) {
        return false;
      }
      return this.canAdministerPoll(poll) || !poll.group() || (Session.user().isMemberOf(poll.group()) && poll.group().membersCanVote);
    };

    AbilityService.prototype.canReactToPoll = function(poll) {
      return this.isEmailVerified() && this.canParticipateInPoll(poll);
    };

    AbilityService.prototype.canEditStance = function(stance) {
      return Session.user() === stance.author();
    };

    AbilityService.prototype.canEditThread = function(thread) {
      return this.canAdministerGroup(thread.group()) || Session.user().isMemberOf(thread.group()) && (Session.user().isAuthorOf(thread) || thread.group().membersCanEditDiscussions);
    };

    AbilityService.prototype.canRemoveEventFromThread = function(event) {
      return event.kind === 'discussion_edited' && this.canAdministerDiscussion(event.discussion());
    };

    AbilityService.prototype.canCloseThread = function(thread) {
      return this.canAdministerDiscussion(thread);
    };

    AbilityService.prototype.canReopenThread = function(thread) {
      return this.canAdministerDiscussion(thread);
    };

    AbilityService.prototype.canPinThread = function(thread) {
      return !thread.closedAt && !thread.pinned && this.canAdministerGroup(thread.group());
    };

    AbilityService.prototype.canUnpinThread = function(thread) {
      return !thread.closedAt && thread.pinned && this.canAdministerGroup(thread.group());
    };

    AbilityService.prototype.canMoveThread = function(thread) {
      return this.canAdministerGroup(thread.group()) || Session.user().isAuthorOf(thread);
    };

    AbilityService.prototype.canDeleteThread = function(thread) {
      return this.canAdministerGroup(thread.group()) || Session.user().isAuthorOf(thread);
    };

    AbilityService.prototype.canChangeThreadVolume = function(thread) {
      return Session.user().isMemberOf(thread.group());
    };

    AbilityService.prototype.canChangeGroupVolume = function(group) {
      return Session.user().isMemberOf(group);
    };

    AbilityService.prototype.canAdminister = function(model) {
      switch (model.constructor.singular) {
        case 'group':
          return this.canAdministerGroup(model.group());
        case 'discussion':
        case 'comment':
          return this.canAdministerDiscussion(model.discussion());
        case 'outcome':
        case 'stance':
        case 'poll':
          return this.canAdministerPoll(model.poll());
      }
    };

    AbilityService.prototype.canAdministerGroup = function(group) {
      return Session.user().isAdminOf(group);
    };

    AbilityService.prototype.canAdministerDiscussion = function(discussion) {
      return Session.user().isAuthorOf(discussion) || this.canAdministerGroup(discussion.group());
    };

    AbilityService.prototype.canChangeVolume = function(discussion) {
      return Session.user().isMemberOf(discussion.group());
    };

    AbilityService.prototype.canManageGroupSubscription = function(group) {
      return group.isParent() && this.canAdministerGroup(group) && (group.subscriptionKind != null) && group.subscriptionKind !== 'trial' && group.subscriptionPaymentMethod !== 'manual';
    };

    AbilityService.prototype.isCreatorOf = function(group) {
      return Session.user().id === group.creatorId;
    };

    AbilityService.prototype.canStartThread = function(group) {
      return this.canAdministerGroup(group) || (Session.user().isMemberOf(group) && group.membersCanStartDiscussions);
    };

    AbilityService.prototype.canAddMembers = function(group) {
      return this.canAdministerGroup(group) || (Session.user().isMemberOf(group) && group.membersCanAddMembers);
    };

    AbilityService.prototype.canAddDocuments = function(group) {
      return this.canAdministerGroup(group);
    };

    AbilityService.prototype.canEditDocument = function(group) {
      return this.canAdministerGroup(group);
    };

    AbilityService.prototype.canCreateSubgroups = function(group) {
      return group.isParent() && (this.canAdministerGroup(group) || (Session.user().isMemberOf(group) && group.membersCanCreateSubgroups));
    };

    AbilityService.prototype.canEditGroup = function(group) {
      return this.canAdministerGroup(group) || this.isSiteAdmin();
    };

    AbilityService.prototype.canLeaveGroup = function(group) {
      return Session.user().membershipFor(group) != null;
    };

    AbilityService.prototype.canArchiveGroup = function(group) {
      return this.canAdministerGroup(group);
    };

    AbilityService.prototype.canEditComment = function(comment) {
      return Session.user().isMemberOf(comment.group()) && Session.user().isAuthorOf(comment) && (comment.isMostRecent() || comment.group().membersCanEditComments);
    };

    AbilityService.prototype.canDeleteComment = function(comment) {
      return (Session.user().isMemberOf(comment.group()) && Session.user().isAuthorOf(comment)) || this.canAdministerGroup(comment.group());
    };

    AbilityService.prototype.canRemoveMembership = function(membership) {
      return membership.group().memberIds().length > 1 && (!membership.admin || membership.group().adminIds().length > 1) && (membership.user() === Session.user() || this.canAdministerGroup(membership.group()));
    };

    AbilityService.prototype.canDeactivateUser = function() {
      return _.all(Session.user().memberships(), function(membership) {
        return !membership.admin || membership.group().hasMultipleAdmins;
      });
    };

    AbilityService.prototype.canManageMembershipRequests = function(group) {
      return (group.membersCanAddMembers && Session.user().isMemberOf(group)) || this.canAdministerGroup(group);
    };

    AbilityService.prototype.canViewPublicGroups = function() {
      return AppConfig.features.app.public_groups;
    };

    AbilityService.prototype.canStartGroups = function() {
      return AppConfig.features.app.create_group || Session.user().isAdmin;
    };

    AbilityService.prototype.canViewGroup = function(group) {
      return !group.privacyIsSecret() || Session.user().isMemberOf(group);
    };

    AbilityService.prototype.canViewPrivateContent = function(group) {
      return Session.user().isMemberOf(group);
    };

    AbilityService.prototype.canCreateContentFor = function(group) {
      return Session.user().isMemberOf(group);
    };

    AbilityService.prototype.canViewMemberships = function(group) {
      return Session.user().isMemberOf(group);
    };

    AbilityService.prototype.canViewPreviousPolls = function(group) {
      return this.canViewGroup(group);
    };

    AbilityService.prototype.canJoinGroup = function(group) {
      return (group.membershipGrantedUpon === 'request') && this.canViewGroup(group) && !Session.user().isMemberOf(group);
    };

    AbilityService.prototype.canRequestMembership = function(group) {
      return (group.membershipGrantedUpon === 'approval') && this.canViewGroup(group) && !Session.user().isMemberOf(group);
    };

    AbilityService.prototype.canTranslate = function(model) {
      return (AppConfig.inlineTranslation.isAvailable != null) && _.contains(AppConfig.inlineTranslation.supportedLangs, Session.user().locale) && Session.user().locale !== model.author().locale;
    };

    AbilityService.prototype.canSubscribeToPoll = function(poll) {
      if (poll.group()) {
        return this.canViewGroup(poll.group());
      } else {
        return this.canAdministerPoll() || _.contains(this.poll().voters(), Session.user());
      }
    };

    AbilityService.prototype.canSharePoll = function(poll) {
      return this.canEditPoll(poll);
    };

    AbilityService.prototype.canRemovePollOptions = function(poll) {
      return poll.isNew() || (poll.isActive() && poll.stancesCount === 0);
    };

    AbilityService.prototype.canEditPoll = function(poll) {
      return poll.isActive() && this.canAdministerPoll(poll);
    };

    AbilityService.prototype.canDeletePoll = function(poll) {
      return this.canAdministerPoll(poll);
    };

    AbilityService.prototype.canSetPollOutcome = function(poll) {
      return poll.isClosed() && this.canAdministerPoll(poll);
    };

    AbilityService.prototype.canAdministerPoll = function(poll) {
      if (poll.group()) {
        return this.canAdministerGroup(poll.group()) || (Session.user().isMemberOf(poll.group()) && Session.user().isAuthorOf(poll));
      } else {
        return Session.user().isAuthorOf(poll);
      }
    };

    AbilityService.prototype.canClosePoll = function(poll) {
      return this.canEditPoll(poll);
    };

    AbilityService.prototype.requireLoginFor = function(page) {
      if (this.isLoggedIn()) {
        return false;
      }
      switch (page) {
        case 'emailSettingsPage':
          return Session.user().restricted == null;
        case 'groupsPage':
        case 'dashboardPage':
        case 'inboxPage':
        case 'profilePage':
        case 'authorizedAppsPage':
        case 'registeredAppsPage':
        case 'registeredAppPage':
        case 'pollsPage':
        case 'startPollPage':
        case 'upgradePage':
        case 'startGroupPage':
          return true;
        default:
          return false;
      }
    };

    return AbilityService;

  })());
});

angular.module('loomioApp').factory('AhoyService', function($rootScope, $window, AppConfig) {
  var AhoyService;
  return new (AhoyService = (function() {
    function AhoyService() {}

    AhoyService.prototype.init = function() {
      if (typeof ahoy === "undefined" || ahoy === null) {
        return;
      }
      ahoy.trackClicks();
      ahoy.trackSubmits();
      ahoy.trackChanges();
      $rootScope.$on('currentComponent', (function(_this) {
        return function() {
          return _this.track('$view', {
            page: $window.location.pathname,
            url: $window.location.href,
            title: document.title
          });
        };
      })(this));
      return $rootScope.$on('modalOpened', (function(_this) {
        return function(_, modal) {
          return _this.track('modalOpened', {
            name: modal.templateUrl.match(/(\w+)\.html$/)[1]
          });
        };
      })(this));
    };

    AhoyService.prototype.track = function(event, options) {
      if (typeof ahoy !== "undefined" && ahoy !== null) {
        return ahoy.track(event, options);
      }
    };

    return AhoyService;

  })());
});

angular.module('loomioApp').factory('AppConfig', function() {
  var configData;
  configData = (typeof window !== "undefined" && window !== null) && (window.Loomio != null) ? window.Loomio : {
    bootData: {},
    permittedParams: {}
  };
  configData.pluginConfig = function(name) {
    return _.find(configData.plugins.installed, function(p) {
      return p.name === name;
    });
  };
  configData.providerFor = function(name) {
    return _.find(configData.identityProviders, function(provider) {
      return provider.name === name;
    });
  };
  configData.timeZone = moment.tz.guess();
  return configData;
});

angular.module('loomioApp').factory('AuthService', function($window, Records, RestfulClient) {
  var AuthService;
  return new (AuthService = (function() {
    function AuthService() {}

    AuthService.prototype.emailStatus = function(user) {
      return Records.users.emailStatus(user.email).then((function(_this) {
        return function(data) {
          return _this.applyEmailStatus(user, _.first(data.users));
        };
      })(this));
    };

    AuthService.prototype.applyEmailStatus = function(user, data) {
      var keys;
      keys = ['name', 'email', 'avatar_kind', 'avatar_initials', 'gravatar_md5', 'avatar_url', 'has_token', 'has_password', 'email_status'];
      user.update(_.pick(_.mapKeys(_.pick(data, keys), function(v, k) {
        return _.camelCase(k);
      }), _.identity));
      return user;
    };

    AuthService.prototype.signIn = function(user) {
      return Records.sessions.build({
        email: user.email,
        password: user.password
      }).save().then(function() {
        return $window.location.reload();
      });
    };

    AuthService.prototype.signUp = function(user) {
      return Records.registrations.build({
        email: user.email,
        name: user.name,
        recaptcha: user.recaptcha
      }).save().then(function() {
        return user.sentLoginLink = true;
      });
    };

    AuthService.prototype.confirmOauth = function() {
      return Records.registrations.remote.post('oauth').then(function() {
        return $window.location.reload();
      });
    };

    AuthService.prototype.sendLoginLink = function(user) {
      return new RestfulClient('login_tokens').post('', {
        email: user.email
      }).then(function() {
        return user.sentLoginLink = true;
      });
    };

    return AuthService;

  })());
});

var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular.module('loomioApp').factory('BaseEventWindow', function(RangeSet) {
  var BaseEventWindow;
  return BaseEventWindow = (function() {
    function BaseEventWindow(arg) {
      this.discussion = arg.discussion, this.per = arg.per;
      this.decreaseMin = bind(this.decreaseMin, this);
      this.increaseMax = bind(this.increaseMax, this);
      this.isUnread = bind(this.isUnread, this);
      this.readRanges = _.clone(this.discussion.readRanges);
    }

    BaseEventWindow.prototype.firstLoaded = function() {
      return (_.first(this.loadedEvents()) || {})[this.columnName] || 0;
    };

    BaseEventWindow.prototype.lastLoaded = function() {
      return (_.last(this.loadedEvents()) || {})[this.columnName] || 0;
    };

    BaseEventWindow.prototype.numLoaded = function() {
      return this.loadedEvents().length;
    };

    BaseEventWindow.prototype.anyLoaded = function() {
      return this.numLoaded() > 0;
    };

    BaseEventWindow.prototype.numRead = function() {
      return RangeSet.length(this.readRanges);
    };

    BaseEventWindow.prototype.numUnread = function() {
      return this.numTotal() - this.numRead();
    };

    BaseEventWindow.prototype.anyUnread = function() {
      return this.numUnread() > 0;
    };

    BaseEventWindow.prototype.setMin = function(val) {
      return this.min = _.max([val, this.firstInSequence()]);
    };

    BaseEventWindow.prototype.setMax = function(val) {
      return this.max = val < this.lastInSequence() ? val : false;
    };

    BaseEventWindow.prototype.isUnread = function(event) {
      return !_.any(this.readRanges, function(range) {
        return _.inRange(event.sequenceId, range[0], range[1] + 1);
      });
    };

    BaseEventWindow.prototype.increaseMax = function() {
      if (this.max === false) {
        return false;
      }
      return this.setMax(this.max + this.per);
    };

    BaseEventWindow.prototype.decreaseMin = function() {
      if (!(this.min > this.firstInSequence())) {
        retutrn(false);
      }
      return this.setMin(this.min - this.per);
    };

    BaseEventWindow.prototype.windowNumNext = function() {
      if (this.max === false) {
        return 0;
      } else {
        return this.lastInSequence() - this.max;
      }
    };

    BaseEventWindow.prototype.numPrevious = function() {
      return _.max([this.min - this.firstInSequence(), this.firstLoaded() - this.firstInSequence()]);
    };

    BaseEventWindow.prototype.numNext = function() {
      return _.max([this.windowNumNext(), this.lastInSequence() - this.lastLoaded()]);
    };

    BaseEventWindow.prototype.anyPrevious = function() {
      return this.numPrevious() > 0;
    };

    BaseEventWindow.prototype.anyNext = function() {
      return this.numNext() > 0;
    };

    BaseEventWindow.prototype.showNext = function() {
      this.increaseMax();
      if ((this.max > this.lastLoaded()) || ((this.max === false) && (this.lastLoaded() < this.numTotal()))) {
        return this.loader.loadMore(this.lastLoaded() + 1);
      }
    };

    BaseEventWindow.prototype.showPrevious = function() {
      this.decreaseMin();
      if (this.min < this.firstLoaded()) {
        return this.loader.loadPrevious(this.min);
      }
    };

    BaseEventWindow.prototype.showAll = function() {
      this.loader.params.per = Number.MAX_SAFE_INTEGER;
      this.setMin(this.firstInSequence());
      this.setMax(Number.MAX_SAFE_INTEGER);
      return this.loader.loadMore(this.min);
    };

    return BaseEventWindow;

  })();
});

var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('ChronologicalEventWindow', function(BaseEventWindow, Records, RecordLoader) {
  var ChronologicalEventWindow;
  return ChronologicalEventWindow = (function(superClass) {
    extend(ChronologicalEventWindow, superClass);

    function ChronologicalEventWindow(arg) {
      this.discussion = arg.discussion, this.initialSequenceId = arg.initialSequenceId, this.per = arg.per;
      this.windowedEvents = bind(this.windowedEvents, this);
      this.columnName = 'sequenceId';
      ChronologicalEventWindow.__super__.constructor.call(this, {
        discussion: this.discussion,
        per: this.per
      });
      this.setMin(this.initialSequenceId);
      this.setMax(this.min + this.per);
      this.loader = new RecordLoader({
        collection: 'events',
        params: {
          discussion_id: this.discussion.id,
          order: 'sequence_id',
          per: this.per
        }
      });
    }

    ChronologicalEventWindow.prototype.numTotal = function() {
      return this.discussion.itemsCount;
    };

    ChronologicalEventWindow.prototype.firstInSequence = function() {
      return this.discussion.firstSequenceId();
    };

    ChronologicalEventWindow.prototype.lastInSequence = function() {
      return this.discussion.lastSequenceId();
    };

    ChronologicalEventWindow.prototype.eventsQuery = function() {
      var query;
      query = {
        discussionId: this.discussion.id
      };
      return Records.events.collection.chain().find(query);
    };

    ChronologicalEventWindow.prototype.loadedEvents = function() {
      return this.eventsQuery().simplesort('sequenceId').data();
    };

    ChronologicalEventWindow.prototype.windowedEvents = function() {
      var windowQuery;
      windowQuery = {
        sequenceId: {
          $between: [this.min, this.max || Number.MAX_VALUE]
        }
      };
      return this.eventsQuery().find(windowQuery).simplesort('sequenceId').data();
    };

    return ChronologicalEventWindow;

  })(BaseEventWindow);
});

angular.module('loomioApp').factory('DocumentService', function(Records) {
  var DocumentService;
  return new (DocumentService = (function() {
    function DocumentService() {}

    DocumentService.prototype.listenForPaste = function(scope) {
      return scope.handlePaste = function(event) {
        var data, file, item;
        data = event.clipboardData;
        if (!(item = _.first(_.filter(data.items, function(item) {
          return item.getAsFile();
        })))) {
          return;
        }
        event.preventDefault();
        file = new File([item.getAsFile()], data.getData('text/plain') || Date.now(), {
          lastModified: moment(),
          type: item.type
        });
        return scope.$broadcast('filesPasted', [file]);
      };
    };

    return DocumentService;

  })());
});

angular.module('loomioApp').factory('DraftService', function($timeout, AppConfig) {
  var DraftService;
  return new (DraftService = (function() {
    function DraftService() {}

    DraftService.prototype.applyDrafting = function(scope, model) {
      var draftMode, timeout;
      draftMode = function() {
        return model[model.constructor.draftParent]() && model.isNew();
      };
      timeout = $timeout(function() {});
      scope.$watch(function() {
        return _.pick(model, model.constructor.draftPayloadAttributes);
      }, function() {
        if (!draftMode()) {
          return;
        }
        $timeout.cancel(timeout);
        return timeout = $timeout((function() {
          return model.updateDraft();
        }), AppConfig.drafts.debounce);
      }, true);
      scope.restoreDraft = function() {
        if (draftMode()) {
          return model.restoreDraft();
        }
      };
      scope.restoreRemoteDraft = function() {
        if (draftMode()) {
          return model.fetchDraft().then(scope.restoreDraft);
        }
      };
      return scope.restoreRemoteDraft();
    };

    return DraftService;

  })());
});

angular.module('loomioApp').factory('EmojiService', function($timeout, AppConfig, $translate) {
  var EmojiService;
  return new (EmojiService = (function() {
    function EmojiService() {}

    EmojiService.prototype.source = AppConfig.emojis.source;

    EmojiService.prototype.render = AppConfig.emojis.render;

    EmojiService.prototype.defaults = AppConfig.emojis.defaults;

    EmojiService.prototype.imgSrcFor = function(shortname) {
      var ns, unicode;
      ns = emojione;
      unicode = ns.emojioneList[shortname].unicode[ns.emojioneList[shortname].unicode.length - 1];
      return ns.imagePathPNG + unicode + '.png' + ns.cacheBustParam;
    };

    EmojiService.prototype.translate = function(shortname_with_colons) {
      var shortname, str;
      shortname = shortname_with_colons.replace(/:/g, '');
      str = $translate.instant("reactions." + shortname);
      if (_.startsWith(str, "reactions.")) {
        return shortname;
      } else {
        return str;
      }
    };

    EmojiService.prototype.listen = function(scope, model, field, elem) {
      return scope.$on('emojiSelected', function(_, emoji) {
        var $textarea, caretPosition;
        if (!($textarea = elem.find('textarea')[0])) {
          return;
        }
        caretPosition = $textarea.selectionEnd;
        model[field] = (model[field].toString().substring(0, $textarea.selectionEnd)) + " " + emoji + " " + (model[field].substring($textarea.selectionEnd));
        return $timeout(function() {
          $textarea.selectionEnd = $textarea.selectionStart = caretPosition + emoji.length + 2;
          return $textarea.focus();
        });
      });
    };

    return EmojiService;

  })());
});

angular.module('loomioApp').factory('EventHeadlineService', function($translate, Records) {
  var EventHeadlineService;
  return new (EventHeadlineService = (function() {
    function EventHeadlineService() {}

    EventHeadlineService.prototype.headlineFor = function(event, useNesting) {
      if (useNesting == null) {
        useNesting = false;
      }
      return $translate.instant("thread_item." + (this.headlineKeyFor(event, useNesting)), {
        author: event.actorName() || $translate.instant('common.anonymous'),
        username: event.actorUsername(),
        title: this.titleFor(event),
        polltype: this.pollTypeFor(event)
      });
    };

    EventHeadlineService.prototype.headlineKeyFor = function(event, useNesting) {
      if (useNesting && event.isNested() && _.includes(["new_comment", "stance_created"], event.kind)) {
        return 'new_comment';
      }
      switch (event.kind) {
        case 'new_comment':
          return this.newCommentKey(event);
        case 'discussion_edited':
          return this.discussionEditedKey(event);
        default:
          return event.kind;
      }
    };

    EventHeadlineService.prototype.newCommentKey = function(event) {
      if (event.model().parentId != null) {
        return 'comment_replied_to';
      } else {
        return 'new_comment';
      }
    };

    EventHeadlineService.prototype.discussionEditedKey = function(event) {
      var changes;
      changes = event.customFields.changed_keys;
      if (_.contains(changes, 'title')) {
        return 'discussion_title_edited';
      } else if (_.contains(changes, 'private')) {
        return 'discussion_privacy_edited';
      } else if (_.contains(changes, 'description')) {
        return 'discussion_context_edited';
      } else if (_.contains(changes, 'document_ids')) {
        return 'discussion_attachments_edited';
      } else {
        return 'discussion_edited';
      }
    };

    EventHeadlineService.prototype.titleFor = function(event) {
      switch (event.eventable.type) {
        case 'comment':
          return event.model().parentAuthorName;
        case 'poll':
        case 'outcome':
          return event.model().poll().title;
        case 'group':
        case 'membership':
          return event.model().group().name;
        case 'stance':
          return event.model().poll().title;
        case 'discussion':
          if (event.kind === 'discussion_moved') {
            return Records.groups.find(event.sourceGroupId).fullName;
          } else {
            return event.model().title;
          }
      }
    };

    EventHeadlineService.prototype.pollTypeFor = function(event) {
      var poll;
      poll = (function() {
        switch (event.eventable.type) {
          case 'poll':
          case 'stance':
          case 'outcome':
            return event.model().poll();
        }
      })();
      if (poll) {
        return $translate.instant("poll_types." + poll.pollType).toLowerCase();
      }
    };

    return EventHeadlineService;

  })());
});

angular.module('loomioApp').factory('$exceptionHandler', function($log, AppConfig) {
  var client;
  if (AppConfig.errbit.key == null) {
    return function() {};
  }
  client = new airbrakeJs.Client({
    projectId: AppConfig.errbit.key,
    projectKey: AppConfig.errbit.key,
    reporter: 'xhr',
    host: AppConfig.errbit.url
  });
  client.addFilter(function(notice) {
    notice.context.environment = AppConfig.environment;
    if (notice.errors[0].type === "") {
      return null;
    } else {
      return notice;
    }
  });
  return function(exception, cause) {
    $log.error(exception);
    return client.notify({
      error: exception,
      params: {
        version: AppConfig.version,
        current_user_id: AppConfig.currentUserId,
        angular_cause: cause
      }
    });
  };
});

angular.module('loomioApp').directive('focusOn', function() {
  return function(scope, elem, attr) {
    console.log("elem");
    return scope.$on(attr.focusOn, function(e) {
      console.log("helllooo", e);
      return elem[0].focus();
    });
  };
});

angular.module('loomioApp').factory('FormService', function($rootScope, $translate, $window, FlashService, DraftService, AbilityService) {
  var FormService;
  return new (FormService = (function() {
    var calculateFlashOptions, cleanup, confirm, errorTypes, failure, prepare, success;

    function FormService() {}

    FormService.prototype.confirmDiscardChanges = function(event, record) {
      if (record.isModified() && !confirm($translate.instant('common.confirm_discard_changes'))) {
        return event.preventDefault();
      }
    };

    errorTypes = {
      400: 'badRequest',
      401: 'unauthorizedRequest',
      403: 'forbiddenRequest',
      404: 'resourceNotFound',
      422: 'unprocessableEntity',
      500: 'internalServerError'
    };

    prepare = function(scope, model, options, prepareArgs) {
      FlashService.loading(options.loadingMessage);
      if (typeof options.prepareFn === 'function') {
        options.prepareFn(prepareArgs);
      }
      if (typeof scope.$emit === 'function') {
        scope.$emit('processing');
      }
      scope.isDisabled = true;
      return model.setErrors();
    };

    confirm = function(confirmMessage) {
      if (confirmMessage) {
        return $window.confirm(confirmMessage);
      } else {
        return true;
      }
    };

    success = function(scope, model, options) {
      return function(response) {
        var flashKey;
        FlashService.dismiss();
        if (options.drafts && AbilityService.isLoggedIn()) {
          model.resetDraft();
        }
        if (options.flashSuccess != null) {
          flashKey = typeof options.flashSuccess === 'function' ? options.flashSuccess() : options.flashSuccess;
          FlashService.success(flashKey, calculateFlashOptions(options.flashOptions));
        }
        if ((options.skipClose == null) && typeof scope.$close === 'function') {
          scope.$close();
        }
        if (typeof options.successCallback === 'function') {
          options.successCallback(response);
        }
        if (options.successEvent) {
          return $rootScope.$broadcast(options.successEvent);
        }
      };
    };

    failure = function(scope, model, options) {
      return function(response) {
        FlashService.dismiss();
        if (typeof options.failureCallback === 'function') {
          options.failureCallback(response);
        }
        if (_.contains([401, 422], response.status)) {
          model.setErrors(response.data.errors);
        }
        return $rootScope.$broadcast(errorTypes[response.status] || 'unknownError', {
          model: model,
          response: response
        });
      };
    };

    cleanup = function(scope, model, options) {
      if (options == null) {
        options = {};
      }
      return function() {
        if (typeof options.cleanupFn === 'function') {
          options.cleanupFn(scope, model);
        }
        if (typeof scope.$emit === 'function') {
          scope.$emit('doneProcessing');
        }
        return scope.isDisabled = false;
      };
    };

    FormService.prototype.submit = function(scope, model, options) {
      var confirmFn, submitFn;
      if (options == null) {
        options = {};
      }
      if (options.drafts && AbilityService.isLoggedIn()) {
        DraftService.applyDrafting(scope, model);
      }
      submitFn = options.submitFn || model.save;
      confirmFn = options.confirmFn || (function() {
        return false;
      });
      return function(prepareArgs) {
        if (scope.isDisabled) {
          return;
        }
        prepare(scope, model, options, prepareArgs);
        if (confirm(confirmFn(model))) {
          return submitFn(model).then(success(scope, model, options), failure(scope, model, options))["finally"](cleanup(scope, model, options));
        } else {
          return cleanup(scope, model, options);
        }
      };
    };

    FormService.prototype.upload = function(scope, model, options) {
      var submitFn;
      if (options == null) {
        options = {};
      }
      submitFn = options.submitFn;
      return function(files) {
        if (_.any(files)) {
          prepare(scope, model, options);
          return submitFn(files[0], options.uploadKind).then(success(scope, model, options), failure(scope, model, options))["finally"](cleanup(scope, model, options));
        }
      };
    };

    calculateFlashOptions = function(options) {
      _.each(_.keys(options), function(key) {
        if (typeof options[key] === 'function') {
          return options[key] = options[key]();
        }
      });
      return options;
    };

    return FormService;

  })());
});

angular.module('loomioApp').factory('HotkeyService', function(AppConfig, ModalService, KeyEventService, Records, Session, InvitationModal, GroupModal, DiscussionModal, PollCommonStartModal) {
  var HotkeyService;
  return new (HotkeyService = (function() {
    function HotkeyService() {}

    HotkeyService.prototype.keyboardShortcuts = {
      pressedI: {
        execute: function() {
          return ModalService.open(InvitationModal, {
            group: function() {
              return Session.currentGroup || Records.groups.build();
            }
          });
        }
      },
      pressedG: {
        execute: function() {
          return ModalService.open(GroupModal, {
            group: function() {
              return Records.groups.build();
            }
          });
        }
      },
      pressedT: {
        execute: function() {
          return ModalService.open(DiscussionModal, {
            discussion: function() {
              return Records.discussions.build({
                groupId: (Session.currentGroup || {}).id
              });
            }
          });
        }
      },
      pressedP: {
        execute: function() {
          return ModalService.open(PollCommonStartModal, {
            poll: function() {
              return Records.polls.build({
                authorId: Session.user().id
              });
            }
          });
        }
      }
    };

    HotkeyService.prototype.init = function(scope) {
      return _.each(this.keyboardShortcuts, (function(_this) {
        return function(args, key) {
          return KeyEventService.registerKeyEvent(scope, key, args.execute, function(event) {
            return KeyEventService.defaultShouldExecute(event) && !AppConfig.currentModal;
          });
        };
      })(this));
    };

    return HotkeyService;

  })());
});

angular.module('loomioApp').factory('InboxService', function(Records, Session, ThreadQueryService) {
  var InboxService;
  return new (InboxService = (function() {
    function InboxService() {}

    InboxService.prototype.filters = ['only_threads_in_my_groups', 'show_unread', 'show_recent', 'hide_muted', 'hide_dismissed'];

    InboxService.prototype.load = function(options) {
      if (options == null) {
        options = {};
      }
      return Records.discussions.fetchInbox(options).then((function(_this) {
        return function() {
          return _this.loaded = true;
        };
      })(this));
    };

    InboxService.prototype.unreadCount = function() {
      if (this.loaded) {
        return this.query().length();
      } else {
        return "...";
      }
    };

    InboxService.prototype.query = function() {
      return ThreadQueryService.queryFor({
        name: "inbox",
        filters: this.filters
      });
    };

    InboxService.prototype.queryByGroup = function() {
      return _.fromPairs(_.map(Session.user().inboxGroups(), (function(_this) {
        return function(group) {
          return [
            group.key, ThreadQueryService.queryFor({
              name: "group_" + group.key + "_inbox",
              filters: _this.filters,
              group: group
            })
          ];
        };
      })(this)));
    };

    return InboxService;

  })());
});

angular.module('loomioApp').factory('IntercomService', function($rootScope, $window, AppConfig, Session, ModalService, ContactModal, LmoUrlService) {
  var IntercomService, lastGroup, mapGroup, service;
  lastGroup = {};
  mapGroup = function(group) {
    if (!((group != null) && (group.createdAt != null))) {
      return null;
    }
    return {
      id: group.id,
      company_id: group.id,
      key: group.key,
      name: group.name,
      description: (group.description || "").substring(0, 250),
      admin_link: LmoUrlService.group(group, {}, {
        noStub: true,
        absolute: true,
        namespace: 'admin/groups'
      }),
      plan: group.subscriptionKind,
      subscription_kind: group.subscriptionKind,
      subscription_plan: group.subscriptionPlan,
      subscription_expires_at: (group.subscriptionExpiresAt != null) && group.subscriptionExpiresAt.format(),
      creator_id: group.creatorId,
      group_privacy: group.groupPrivacy,
      cohort_id: group.cohortId,
      created_at: group.createdAt.format(),
      discussions_count: group.discussionsCount,
      memberships_count: group.membershipsCount,
      has_custom_cover: group.hasCustomCover,
      invitations_count: group.invitationsCount
    };
  };
  service = new (IntercomService = (function() {
    function IntercomService() {}

    IntercomService.prototype.available = function() {
      return ($window != null) && ($window.Intercom != null) && ($window.Intercom.booted != null);
    };

    IntercomService.prototype.boot = function() {
      var user;
      if (!(($window != null) && ($window.Intercom != null))) {
        return;
      }
      user = Session.user();
      lastGroup = mapGroup(user.parentGroups()[0]);
      return $window.Intercom('boot', {
        admin_link: LmoUrlService.user(user, {}, {
          noStub: true,
          absolute: true,
          namespace: 'admin/users',
          key: 'id'
        }),
        app_id: AppConfig.intercom.appId,
        user_id: user.id,
        user_hash: AppConfig.intercom.userHash,
        email: user.email,
        name: user.name,
        username: user.username,
        user_id: user.id,
        created_at: user.createdAt,
        is_coordinator: user.isCoordinator,
        locale: user.locale,
        company: lastGroup,
        has_profile_photo: user.hasProfilePhoto(),
        belongs_to_paying_group: user.belongsToPayingGroup()
      });
    };

    IntercomService.prototype.shutdown = function() {
      if (!this.available()) {
        return;
      }
      return $window.Intercom('shutdown');
    };

    IntercomService.prototype.updateWithGroup = function(group) {
      var user;
      if (!((group != null) && this.available())) {
        return;
      }
      if (_.isEqual(lastGroup, mapGroup(group))) {
        return;
      }
      if (group.isSubgroup()) {
        return;
      }
      user = Session.user();
      if (!user.isMemberOf(group)) {
        return;
      }
      lastGroup = mapGroup(group);
      return $window.Intercom('update', {
        email: user.email,
        user_id: user.id,
        company: lastGroup
      });
    };

    IntercomService.prototype.contactUs = function() {
      if (this.available()) {
        return $window.Intercom('showNewMessage');
      } else {
        return ModalService.open(ContactModal);
      }
    };

    $rootScope.$on('logout', function(event, group) {
      return service.shutdown();
    });

    return IntercomService;

  })());
  return service;
});

angular.module('loomioApp').factory('KeyEventService', function($rootScope) {
  var KeyEventService;
  return new (KeyEventService = (function() {
    function KeyEventService() {}

    KeyEventService.prototype.keyboardShortcuts = {
      73: 'pressedI',
      71: 'pressedG',
      80: 'pressedP',
      84: 'pressedT',
      27: 'pressedEsc',
      13: 'pressedEnter',
      191: 'pressedSlash',
      38: 'pressedUpArrow',
      40: 'pressedDownArrow'
    };

    KeyEventService.prototype.broadcast = function(event) {
      var key;
      key = this.keyboardShortcuts[event.which];
      if (key === 'pressedEnter' || (key && !event.ctrlKey && !event.metaKey)) {
        return $rootScope.$broadcast(key, event, angular.element(document.activeElement)[0]);
      }
    };

    KeyEventService.prototype.registerKeyEvent = function(scope, eventCode, execute, shouldExecute) {
      shouldExecute = shouldExecute || this.defaultShouldExecute;
      scope.$$listeners[eventCode] = null;
      return scope.$on(eventCode, function(angularEvent, originalEvent, active) {
        if (shouldExecute(active, originalEvent)) {
          angularEvent.preventDefault() && originalEvent.preventDefault();
          return execute(active, originalEvent);
        }
      });
    };

    KeyEventService.prototype.defaultShouldExecute = function(active, event) {
      if (active == null) {
        active = {};
      }
      if (event == null) {
        event = {};
      }
      return !event.ctrlKey && !event.altKey && !_.contains(['INPUT', 'TEXTAREA', 'SELECT'], active.nodeName);
    };

    KeyEventService.prototype.submitOnEnter = function(scope, opts) {
      if (opts == null) {
        opts = {};
      }
      if (this.previousScope != null) {
        this.previousScope.$$listeners['pressedEnter'] = null;
      }
      this.previousScope = scope;
      return this.registerKeyEvent(scope, 'pressedEnter', scope[opts.submitFn || 'submit'], (function(_this) {
        return function(active, event) {
          return !scope.isDisabled && !scope.submitIsDisabled && (event.ctrlKey || event.metaKey || opts.anyEnter) && _.contains(active.classList, 'lmo-primary-form-input');
        };
      })(this));
    };

    return KeyEventService;

  })());
});

angular.module('loomioApp').factory('LmoUrlService', function(AppConfig) {
  var LmoUrlService;
  return new (LmoUrlService = (function() {
    function LmoUrlService() {}

    LmoUrlService.prototype.route = function(arg) {
      var action, model, options, params;
      model = arg.model, action = arg.action, params = arg.params, options = arg.options;
      options = options || {};
      if ((model != null) && (action != null)) {
        return this[model.constructor.singular](model, {}, _.merge(options, {
          noStub: true
        })) + this.routePath(action);
      } else if (model != null) {
        return this[model.constructor.singular](model, {}, options);
      } else {
        return this.routePath(action);
      }
    };

    LmoUrlService.prototype.routePath = function(route) {
      return "/".concat(route).replace('//', '/');
    };

    LmoUrlService.prototype.group = function(g, params, options) {
      if (params == null) {
        params = {};
      }
      if (options == null) {
        options = {};
      }
      return this.buildModelRoute('g', g.key, g.fullName, params, options);
    };

    LmoUrlService.prototype.discussion = function(d, params, options) {
      if (params == null) {
        params = {};
      }
      if (options == null) {
        options = {};
      }
      return this.buildModelRoute('d', d.key, d.title, params, options);
    };

    LmoUrlService.prototype.poll = function(p, params, options) {
      if (params == null) {
        params = {};
      }
      if (options == null) {
        options = {};
      }
      return this.buildModelRoute('p', p.key, options.action || p.title, params, options);
    };

    LmoUrlService.prototype.outcome = function(o, params, options) {
      if (params == null) {
        params = {};
      }
      if (options == null) {
        options = {};
      }
      return this.poll(o.poll(), params, options);
    };

    LmoUrlService.prototype.pollSearch = function(params, options) {
      if (params == null) {
        params = {};
      }
      if (options == null) {
        options = {};
      }
      return this.buildModelRoute('polls', '', options.action, params, options);
    };

    LmoUrlService.prototype.searchResult = function(r, params, options) {
      if (params == null) {
        params = {};
      }
      if (options == null) {
        options = {};
      }
      return this.discussion(r, params, options);
    };

    LmoUrlService.prototype.user = function(u, params, options) {
      if (params == null) {
        params = {};
      }
      if (options == null) {
        options = {};
      }
      return this.buildModelRoute('u', u[options.key || 'username'], null, params, options);
    };

    LmoUrlService.prototype.comment = function(c, params, options) {
      if (params == null) {
        params = {};
      }
      if (options == null) {
        options = {};
      }
      return this.route({
        model: c.discussion(),
        action: "comment/" + c.id,
        params: params,
        options: options
      });
    };

    LmoUrlService.prototype.membership = function(m, params, options) {
      if (params == null) {
        params = {};
      }
      if (options == null) {
        options = {};
      }
      return this.route({
        model: m.group(),
        action: 'memberships',
        params: params
      });
    };

    LmoUrlService.prototype.membershipRequest = function(mr, params, options) {
      if (params == null) {
        params = {};
      }
      if (options == null) {
        options = {};
      }
      return this.route({
        model: mr.group(),
        action: 'membership_requests',
        params: params
      });
    };

    LmoUrlService.prototype.invitation = function() {};

    LmoUrlService.prototype.oauthApplication = function(a, params, options) {
      if (params == null) {
        params = {};
      }
      if (options == null) {
        options = {};
      }
      return this.buildModelRoute('apps/registered', a.id, a.name, params, options);
    };

    LmoUrlService.prototype.buildModelRoute = function(path, key, name, params, options) {
      var result;
      result = options.absolute ? AppConfig.baseUrl : "/";
      result += (options.namespace || path) + "/" + key;
      if (!((name == null) || (options.noStub != null))) {
        result += "/" + this.stub(name);
      }
      if (options.ext != null) {
        result += "." + options.ext;
      }
      if (_.keys(params).length) {
        result += "?" + this.queryStringFor(params);
      }
      return result;
    };

    LmoUrlService.prototype.stub = function(name) {
      return name.replace(/[^a-z0-9\-_]+/gi, '-').replace(/-+/g, '-').toLowerCase();
    };

    LmoUrlService.prototype.queryStringFor = function(params) {
      if (params == null) {
        params = {};
      }
      return _.map(params, function(value, key) {
        return key + "=" + value;
      }).join('&');
    };

    return LmoUrlService;

  })());
});

var slice = [].slice;

angular.module('loomioApp').factory('LoadingService', function(Records) {
  var LoadingService;
  return new (LoadingService = (function() {
    function LoadingService() {}

    LoadingService.prototype.applyLoadingFunction = function(controller, functionName) {
      var executing, loadingFunction;
      executing = functionName + "Executing";
      loadingFunction = controller[functionName];
      return controller[functionName] = function() {
        var args;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        if (controller[executing]) {
          return;
        }
        controller[executing] = true;
        return loadingFunction.apply(null, args)["finally"](function() {
          return controller[executing] = false;
        });
      };
    };

    LoadingService.prototype.listenForLoading = function(scope) {
      scope.$on('processing', function() {
        return scope.isDisabled = true;
      });
      return scope.$on('doneProcessing', function() {
        return scope.isDisabled = false;
      });
    };

    return LoadingService;

  })());
});

angular.module('loomioApp').factory('MentionLinkService', function() {
  var MentionLinkService;
  return new (MentionLinkService = (function() {
    function MentionLinkService() {}

    MentionLinkService.prototype.cook = function(mentionedUsernames, text) {
      text;
      _.each(mentionedUsernames, function(username) {
        return text = text.replace(RegExp("@" + username, "g"), "[[@" + username + "]]");
      });
      return text;
    };

    return MentionLinkService;

  })());
});

var slice = [].slice;

angular.module('loomioApp').factory('MentionService', function(Records, Session) {
  var MentionService;
  return new (MentionService = (function() {
    function MentionService() {}

    MentionService.prototype.applyMentions = function(scope, model) {
      scope.unmentionableIds = [model.authorId, Session.user().id];
      return scope.fetchByNameFragment = function(fragment) {
        return Records.memberships.fetchByNameFragment(fragment, model.group().key).then(function(response) {
          var userIds;
          userIds = _.without.apply(_, [_.pluck(response.users, 'id')].concat(slice.call(scope.unmentionableIds)));
          return scope.mentionables = Records.users.find(userIds);
        });
      };
    };

    return MentionService;

  })());
});

angular.module('loomioApp').factory('MessageChannelService', function($http, $rootScope, $window, AppConfig, Records, AbilityService, ModalService, SignedOutModal, FlashService) {
  var MessageChannelService;
  return new (MessageChannelService = (function() {
    var handleSubscriptions;

    function MessageChannelService() {}

    MessageChannelService.prototype.subscribe = function(options) {
      if (options == null) {
        options = {};
      }
      if (!AbilityService.isLoggedIn()) {
        return;
      }
      return $http.post('/api/v1/message_channel/subscribe', options).then(handleSubscriptions);
    };

    MessageChannelService.prototype.subscribeToGroup = function(group) {
      return this.subscribe({
        group_key: group.key
      });
    };

    MessageChannelService.prototype.subscribeToPoll = function(poll) {
      return this.subscribe({
        poll_key: poll.key
      });
    };

    handleSubscriptions = function(subscriptions) {
      return _.each(subscriptions.data, function(subscription) {
        PrivatePub.sign(subscription);
        return PrivatePub.subscribe(subscription.channel, function(data) {
          var comment;
          if (data.action != null) {
            switch (data.action) {
              case 'logged_out':
                if (!AppConfig.loggingOut) {
                  ModalService.open(SignedOutModal, function() {
                    return {
                      preventClose: true
                    };
                  });
                }
            }
          }
          if (data.version != null) {
            FlashService.update('global.messages.app_update', {
              version: data.version
            }, 'global.messages.reload', function() {
              return $window.location.reload();
            });
          }
          if (data.memo != null) {
            switch (data.memo.kind) {
              case 'comment_destroyed':
                if (comment = Records.comments.find(memo.data.comment_id)) {
                  comment.destroy();
                }
                break;
              case 'comment_updated':
                Records.comments["import"](memo.data.comment);
                Records["import"](memo.data);
                break;
              case 'comment_unliked':
                if (comment = Records.comments.find(memo.data.comment_id)) {
                  comment.removeLikerId(memo.data.user_id);
                }
            }
          }
          if (data.event != null) {
            if (!_.isArray(data.events)) {
              data.events = [];
            }
            data.events.push(data.event);
          }
          if (data.notification != null) {
            if (!_.isArray(data.notifications)) {
              data.notifications = [];
            }
            data.notifications.push(data.notification);
          }
          Records["import"](data);
          return $rootScope.$digest();
        });
      });
    };

    return MessageChannelService;

  })());
});

angular.module('loomioApp').factory('ModalService', function($mdDialog, $rootScope, $timeout, $translate, AppConfig, LoadingService) {
  var ModalService;
  return new (ModalService = (function() {
    var ariaLabel, buildModal, focusElement;

    function ModalService() {}

    ModalService.prototype.open = function(modal, resolve) {
      AppConfig.currentModal = buildModal(modal, resolve);
      return $mdDialog.show(AppConfig.currentModal).then(function() {
        return $rootScope.$broadcast('modalOpened', modal);
      })["finally"](function() {
        return delete AppConfig.currentModal;
      });
    };

    buildModal = function(modal, resolve) {
      var $scope;
      if (resolve == null) {
        resolve = {};
      }
      resolve = _.merge({
        preventClose: function() {
          return false;
        }
      }, resolve);
      $scope = $rootScope.$new(true);
      $scope.$close = $mdDialog.cancel;
      $scope.$on('$close', $mdDialog.cancel);
      $scope.$on('focus', focusElement);
      LoadingService.listenForLoading($scope);
      return $mdDialog.alert({
        role: 'dialog',
        backdrop: 'static',
        scope: $scope,
        templateUrl: modal.templateUrl,
        controller: modal.controller,
        size: modal.size || '',
        resolve: resolve,
        escapeToClose: !resolve.preventClose(),
        ariaLabel: $translate.instant((modal.templateUrl.split('/').pop().replace('.html', '')) + ".aria_label"),
        onComplete: focusElement
      });
    };

    focusElement = function() {
      return $timeout(function() {
        var elementToFocus;
        elementToFocus = document.querySelector('md-dialog [md-autofocus]') || document.querySelector('md-dialog h1');
        elementToFocus.focus();
        return angular.element(window).triggerHandler('checkInView');
      }, 400);
    };

    ariaLabel = function(modal) {
      return $translate.instant((modal.templateUrl.split('/').pop().replace('.html', '')) + ".aria_label");
    };

    return ModalService;

  })());
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('NestedEventWindow', function(BaseEventWindow, Records, RecordLoader) {
  var NestedEventWindow;
  return NestedEventWindow = (function(superClass) {
    extend(NestedEventWindow, superClass);

    function NestedEventWindow(arg) {
      this.discussion = arg.discussion, this.parentEvent = arg.parentEvent, this.initialSequenceId = arg.initialSequenceId, this.per = arg.per;
      NestedEventWindow.__super__.constructor.call(this, {
        discussion: this.discussion,
        per: this.per
      });
      this.columnName = "position";
      this.setMin(this.positionFromSequenceId() || this.firstLoaded());
      this.setMax(this.lastLoaded() || false);
      this.loader = new RecordLoader({
        collection: 'events',
        params: {
          discussion_id: this.discussion.id,
          parent_id: this.parentEvent.id,
          order: 'position',
          per: this.per
        }
      });
    }

    NestedEventWindow.prototype.positionFromSequenceId = function() {
      var initialEvent;
      initialEvent = Records.events.find({
        discussionId: this.discussion.id,
        sequenceId: this.initialSequenceId
      })[0];
      if ((initialEvent === void 0) || (this.parentEvent === void 0)) {
        return 0;
      }
      if (initialEvent.parentId === this.parentEvent.id) {
        return initialEvent.position;
      } else if (initialEvent.parent().parentId === this.parentEvent.id) {
        return initialEvent.parent().position;
      } else {
        return 0;
      }
    };

    NestedEventWindow.prototype.useNesting = true;

    NestedEventWindow.prototype.numTotal = function() {
      return this.parentEvent.childCount;
    };

    NestedEventWindow.prototype.firstInSequence = function() {
      return 1;
    };

    NestedEventWindow.prototype.lastInSequence = function() {
      return this.parentEvent.childCount;
    };

    NestedEventWindow.prototype.eventsQuery = function() {
      return Records.events.collection.chain().find({
        parentId: this.parentEvent.id
      });
    };

    NestedEventWindow.prototype.loadedEvents = function() {
      return this.eventsQuery().simplesort('position').data();
    };

    NestedEventWindow.prototype.windowedEvents = function() {
      var query;
      query = {
        position: {
          $between: [this.min, this.max || Number.MAX_VALUE]
        }
      };
      return this.eventsQuery().find(query).simplesort('position').data();
    };

    return NestedEventWindow;

  })(BaseEventWindow);
});

angular.module('loomioApp').factory('PaginationService', function(AppConfig) {
  var PaginationService;
  return new (PaginationService = (function() {
    function PaginationService() {}

    PaginationService.prototype.windowFor = function(arg) {
      var current, max, min, pageSize, pageType;
      current = arg.current, min = arg.min, max = arg.max, pageType = arg.pageType;
      pageSize = parseInt(AppConfig.pageSize[pageType]) || AppConfig.pageSize["default"];
      return {
        current: current,
        min: min,
        max: max,
        prev: current > min ? _.max([current - pageSize, min]) : void 0,
        next: current + pageSize < max ? current + pageSize : void 0,
        pageSize: pageSize
      };
    };

    return PaginationService;

  })());
});

angular.module('loomioApp').factory('PollService', function($window, $rootScope, $location, AppConfig, Records, Session, SequenceService, FormService, LmoUrlService, ScrollService, AbilityService) {
  var PollService;
  return new (PollService = (function() {
    function PollService() {}

    PollService.prototype.fieldFromTemplate = function(pollType, field) {
      var template;
      if (!(template = this.templateFor(pollType))) {
        return;
      }
      return template[field];
    };

    PollService.prototype.templateFor = function(pollType) {
      return AppConfig.pollTemplates[pollType];
    };

    PollService.prototype.lastStanceBy = function(participant, poll) {
      var criteria;
      criteria = {
        latest: true,
        pollId: poll.id,
        participantId: AppConfig.currentUserId
      };
      return _.first(_.sortBy(Records.stances.find(criteria), 'createdAt'));
    };

    PollService.prototype.hasVoted = function(user, poll) {
      return this.lastStanceBy(user, poll) != null;
    };

    PollService.prototype.iconFor = function(poll) {
      return this.fieldFromTemplate(poll.pollType, 'material_icon');
    };

    PollService.prototype.optionByName = function(poll, name) {
      return _.find(poll.pollOptions(), function(option) {
        return option.name === name;
      });
    };

    PollService.prototype.applyPollStartSequence = function(scope, options) {
      if (options == null) {
        options = {};
      }
      return SequenceService.applySequence(scope, {
        steps: function() {
          if (scope.poll.group()) {
            return ['choose', 'save'];
          } else {
            return ['choose', 'save', 'share'];
          }
        },
        initialStep: scope.poll.pollType ? 'save' : 'choose',
        emitter: options.emitter || scope,
        chooseComplete: function(_, pollType) {
          return scope.poll.pollType = pollType;
        },
        saveComplete: function(_, poll) {
          scope.poll = poll;
          $location.path(LmoUrlService.poll(poll));
          if (typeof options.afterSaveComplete === 'function') {
            return options.afterSaveComplete(poll);
          }
        }
      });
    };

    PollService.prototype.submitOutcome = function(scope, model, options) {
      var actionName;
      if (options == null) {
        options = {};
      }
      actionName = scope.outcome.isNew() ? 'created' : 'updated';
      return FormService.submit(scope, model, _.merge({
        flashSuccess: "poll_common_outcome_form.outcome_" + actionName,
        drafts: true,
        failureCallback: function() {
          return ScrollService.scrollTo('.lmo-validation-error__message', {
            container: '.poll-common-modal'
          });
        },
        successCallback: function(data) {
          return scope.$emit('outcomeSaved', data.outcomes[0].id);
        }
      }, options));
    };

    PollService.prototype.submitPoll = function(scope, model, options) {
      var actionName;
      if (options == null) {
        options = {};
      }
      actionName = scope.poll.isNew() ? 'created' : 'updated';
      return FormService.submit(scope, model, _.merge({
        flashSuccess: "poll_" + model.pollType + "_form." + model.pollType + "_" + actionName,
        drafts: true,
        prepareFn: (function(_this) {
          return function() {
            scope.$emit('processing');
            switch (model.pollType) {
              case 'proposal':
              case 'count':
                return model.pollOptionNames = _.pluck(_this.fieldFromTemplate(model.pollType, 'poll_options_attributes'), 'name');
              default:
                return $rootScope.$broadcast('addPollOption');
            }
          };
        })(this),
        failureCallback: function() {
          return ScrollService.scrollTo('.lmo-validation-error__message', {
            container: '.poll-common-modal'
          });
        },
        successCallback: function(data) {
          var poll;
          _.invoke(Records.documents.find(model.removedDocumentIds), 'remove');
          poll = Records.polls.find(data.polls[0].key);
          poll.removeOrphanOptions();
          return scope.$emit('nextStep', poll);
        },
        cleanupFn: function() {
          return scope.$emit('doneProcessing');
        }
      }, options));
    };

    PollService.prototype.submitStance = function(scope, model, options) {
      var actionName, pollType;
      if (options == null) {
        options = {};
      }
      actionName = scope.stance.isNew() ? 'created' : 'updated';
      pollType = model.poll().pollType;
      return FormService.submit(scope, model, _.merge({
        flashSuccess: "poll_" + pollType + "_vote_form.stance_" + actionName,
        drafts: true,
        prepareFn: function() {
          return scope.$emit('processing');
        },
        successCallback: function(data) {
          model.poll().clearStaleStances();
          ScrollService.scrollTo('.poll-common-card__results-shown');
          scope.$emit('stanceSaved', data.stances[0].key);
          if (!Session.user().emailVerified) {
            return Session.login({
              current_user_id: data.stances[0].participant_id
            });
          }
        },
        cleanupFn: function() {
          return scope.$emit('doneProcessing');
        }
      }, options));
    };

    return PollService;

  })());
});

angular.module('loomioApp').factory('PrivacyString', function($translate) {
  var PrivacyString;
  return new (PrivacyString = (function() {
    function PrivacyString() {}

    PrivacyString.prototype.groupPrivacyStatement = function(group) {
      var key;
      if (group.isSubgroup() && group.parent().privacyIsSecret()) {
        if (group.privacyIsClosed()) {
          return $translate.instant('group_form.privacy_statement.private_to_parent_members', {
            parent: group.parentName()
          });
        } else {
          return $translate.instant("group_form.privacy_statement.private_to_group");
        }
      } else {
        key = (function() {
          switch (group.groupPrivacy) {
            case 'open':
              return 'public_on_web';
            case 'closed':
              return 'public_on_web';
            case 'secret':
              return 'private_to_group';
          }
        })();
        return $translate.instant("group_form.privacy_statement." + key);
      }
    };

    PrivacyString.prototype.confirmGroupPrivacyChange = function(group) {
      var key;
      if (group.isNew()) {
        return;
      }
      key = group.attributeIsModified('groupPrivacy') ? group.privacyIsSecret() ? group.isParent() ? 'group_form.confirm_change_to_secret' : 'group_form.confirm_change_to_secret_subgroup' : group.privacyIsOpen() ? 'group_form.confirm_change_to_public' : void 0 : group.attributeIsModified('discussionPrivacyOptions') ? group.discussionPrivacyOptions === 'private_only' ? 'group_form.confirm_change_to_private_discussions_only' : void 0 : void 0;
      if (_.isString(key)) {
        return $translate.instant(key);
      } else {
        return false;
      }
    };

    PrivacyString.prototype.discussion = function(discussion, is_private) {
      var key;
      if (is_private == null) {
        is_private = null;
      }
      key = is_private === false ? 'privacy_public' : discussion.group().parentMembersCanSeeDiscussions ? 'privacy_organisation' : 'privacy_private';
      return $translate.instant("discussion_form." + key, {
        group: discussion.group().name,
        parent: discussion.group().parentName()
      });
    };

    PrivacyString.prototype.group = function(group, privacy) {
      var key;
      privacy = privacy || group.groupPrivacy;
      key = (function() {
        if (group.isParent()) {
          switch (privacy) {
            case 'open':
              return 'group_privacy_is_open_description';
            case 'secret':
              return 'group_privacy_is_secret_description';
            case 'closed':
              if (group.allowPublicThreads) {
                return 'group_privacy_is_closed_public_threads_description';
              } else {
                return 'group_privacy_is_closed_description';
              }
          }
        } else {
          switch (privacy) {
            case 'open':
              return 'subgroup_privacy_is_open_description';
            case 'secret':
              return 'subgroup_privacy_is_secret_description';
            case 'closed':
              if (group.isSubgroupOfSecretParent()) {
                return 'subgroup_privacy_is_closed_secret_parent_description';
              } else if (group.allowPublicThreads) {
                return 'subgroup_privacy_is_closed_public_threads_description';
              } else {
                return 'subgroup_privacy_is_closed_description';
              }
          }
        }
      })();
      return $translate.instant("group_form." + key, {
        parent: group.parentName()
      });
    };

    return PrivacyString;

  })());
});

angular.module('loomioApp').factory('RangeSet', function() {
  var RangeSet;
  return new (RangeSet = (function() {
    function RangeSet() {}

    RangeSet.prototype.parse = function(outer) {
      return _.map(outer.split(','), function(pair) {
        return _.map(pair.split('-'), function(s) {
          return parseInt(s);
        });
      });
    };

    RangeSet.prototype.serialize = function(ranges) {
      return _.map(ranges, function(range) {
        return range.join('-');
      }).join(',');
    };

    RangeSet.prototype.reduce = function(ranges) {
      var reduced;
      ranges = _.sortBy(ranges, function(r) {
        return r[0];
      });
      reduced = _.compact([ranges.shift()]);
      _.each(ranges, function(r) {
        var lastr;
        lastr = _.last(reduced);
        if (lastr[1] >= (r[0] - 1)) {
          reduced.pop();
          return reduced.push([lastr[0], _.max([r[1], lastr[1]])]);
        } else {
          return reduced.push(r);
        }
      });
      return reduced;
    };

    RangeSet.prototype.length = function(ranges) {
      return _.sum(_.map(ranges, function(range) {
        return range[1] - range[0] + 1;
      }));
    };

    RangeSet.prototype.overlaps = function(a, b) {
      var ab;
      ab = _.sortBy([a, b], function(r) {
        return r[0];
      });
      return ab[0][1] >= ab[1][0];
    };

    RangeSet.prototype.includesValue = function(ranges, value) {
      return _.any(ranges, function(range) {
        return _.inRange(value, range[0], range[1] + 1);
      });
    };

    RangeSet.prototype.subtractRange = function(whole, part) {
      if ((part.length === 0) || (part[0] > whole[1]) || (part[1] < whole[0])) {
        return [whole];
      }
      if ((part[0] <= whole[0]) && (part[1] >= whole[1])) {
        return [];
      }
      if ((part[0] > whole[0]) && (part[1] < whole[1])) {
        return [[whole[0], part[0] - 1], [part[1] + 1, whole[1]]];
      }
      if ((part[0] === whole[0]) && (part[1] < whole[1])) {
        return [[part[1] + 1, whole[1]]];
      }
      if ((part[0] > whole[0]) && (part[1] === whole[1])) {
        return [[whole[0], part[0] - 1]];
      }
    };

    RangeSet.prototype.subtractRanges = function(wholes, parts) {
      var output;
      output = wholes;
      while (!_.isEqual(this.subtractRangesLoop(output, parts), output)) {
        output = this.subtractRangesLoop(output, parts);
      }
      return this.reduce(output);
    };

    RangeSet.prototype.subtractRangesLoop = function(wholes, parts) {
      var output;
      output = [];
      _.each(wholes, (function(_this) {
        return function(whole) {
          if (_.any(parts, function(part) {
            return _this.overlaps(whole, part);
          })) {
            return _.each(_.select(parts, function(part) {
              return _this.overlaps(whole, part);
            }), function(part) {
              return _.each(_this.subtractRange(whole, part), function(remainder) {
                return output.push(remainder);
              });
            });
          } else {
            return output.push(whole);
          }
        };
      })(this));
      return output;
    };

    RangeSet.prototype.selfTest = function() {
      return {
        length1: this.length([1, 1]) === 1,
        length2: this.length([1, 2]) === 2,
        serialize: this.serialize([[1, 2], [4, 5]]) === "1-2,4-5",
        parse: _.isEqual(this.parse("1-2,4-5"), [[1, 2], [4, 5]]),
        reduceSimple: _.isEqual(this.reduce([[1, 1]]), [[1, 1]]),
        reduceMerge: _.isEqual(this.reduce([[1, 2], [3, 4]]), [[1, 4]]),
        reduceEmpty: _.isEqual(this.reduce([]), []),
        subtractWhole: _.isEqual(this.subtractRange([1, 1], [1, 1]), []),
        subtractNone: _.isEqual(this.subtractRange([1, 1], [2, 2]), [[1, 1]]),
        subtractLeft: _.isEqual(this.subtractRange([1, 2], [1, 1]), [[2, 2]]),
        subtractRight: _.isEqual(this.subtractRange([1, 2], [2, 2]), [[1, 1]]),
        subtractMiddle: _.isEqual(this.subtractRange([1, 3], [2, 2]), [[1, 1], [3, 3]]),
        overlapsNone: this.overlaps([1, 2], [3, 4]) === false,
        overlapsPart: this.overlaps([1, 2], [2, 3]) === true,
        overlapsWhole: this.overlaps([1, 2], [1, 2]) === true,
        subtractRanges1: _.isEqual(this.subtractRanges([[1, 1]], [[1, 1]]), []),
        subtractRanges2: _.isEqual(this.subtractRanges([[1, 2]], [[1, 1]]), [[2, 2]]),
        subtractRanges3: _.isEqual(this.subtractRanges([[1, 2], [4, 6]], [[1, 1], [5, 5]]), [[2, 2], [4, 4], [6, 6]]),
        subtractRanges4: _.isEqual(this.subtractRanges([[1, 2], [4, 8]], [[5, 6], [7, 8]]), [[1, 2], [4, 4]])
      };
    };

    return RangeSet;

  })());
});

angular.module('loomioApp').factory('ReactionService', function(Records, Session) {
  var ReactionService;
  return new (ReactionService = (function() {
    var paramsFor;

    function ReactionService() {}

    ReactionService.prototype.listenForReactions = function($scope, model) {
      return $scope.$on('emojiSelected', function(_event, emoji) {
        var reaction;
        reaction = Records.reactions.find(paramsFor(model))[0] || Records.reactions.build(paramsFor(model));
        reaction.reaction = emoji;
        return reaction.save();
      });
    };

    paramsFor = function(model) {
      return {
        reactableType: _.capitalize(model.constructor.singular),
        reactableId: model.id,
        userId: Session.user().id
      };
    };

    return ReactionService;

  })());
});

angular.module('loomioApp').factory('RecordLoader', function(Records) {
  var RecordLoader;
  return RecordLoader = (function() {
    function RecordLoader(opts) {
      if (opts == null) {
        opts = {};
      }
      this.loadingFirst = true;
      this.collection = opts.collection;
      this.params = _.merge({
        from: 0,
        per: 25,
        order: 'id'
      }, opts.params);
      this.path = opts.path;
      this.numLoaded = opts.numLoaded || 0;
      this.then = opts.then || function(data) {
        return data;
      };
    }

    RecordLoader.prototype.reset = function() {
      this.params['from'] = 0;
      return this.numLoaded = 0;
    };

    RecordLoader.prototype.fetchRecords = function() {
      this.loading = true;
      return Records[_.camelCase(this.collection)].fetch({
        path: this.path,
        params: this.params
      }).then((function(_this) {
        return function(data) {
          var records;
          records = data[_this.collection] || [];
          _this.numLoaded += records.length;
          if (records.length < _this.params.per) {
            _this.exhausted = true;
          }
          return data;
        };
      })(this)).then(this.then)["finally"]((function(_this) {
        return function() {
          _this.loadingFirst = false;
          return _this.loading = false;
        };
      })(this));
    };

    RecordLoader.prototype.loadMore = function(from) {
      if (from != null) {
        this.params['from'] = from;
      } else {
        if (this.numLoaded > 0) {
          this.params['from'] += this.params['per'];
        }
      }
      this.loadingMore = true;
      return this.fetchRecords()["finally"]((function(_this) {
        return function() {
          return _this.loadingMore = false;
        };
      })(this));
    };

    RecordLoader.prototype.loadPrevious = function(from) {
      if (from != null) {
        this.params['from'] = from;
      } else {
        if (this.numLoaded > 0) {
          this.params['from'] -= this.params['per'];
        }
      }
      this.loadingPrevious = true;
      return this.fetchRecords()["finally"]((function(_this) {
        return function() {
          return _this.loadingPrevious = false;
        };
      })(this));
    };

    return RecordLoader;

  })();
});

angular.module('loomioApp').value('RecordStoreDatabaseName', 'default.db');

angular.module('loomioApp').factory('ScrollService', function($timeout) {
  var ScrollService;
  new (ScrollService = (function() {
    function ScrollService() {}

    return ScrollService;

  })());
  return {
    scrollTo: function(target, options) {
      if (options == null) {
        options = {};
      }
      return $timeout(function() {
        var container, elem;
        elem = document.querySelector(target);
        container = document.querySelector(options.container || '.lmo-main-content');
        if (options.bottom) {
          options.offset = document.documentElement.clientHeight - (options.offset || 100);
        }
        if (elem && container) {
          angular.element(container).scrollToElement(elem, options.offset || 50, options.speed || 100).then(function() {
            return angular.element(window).triggerHandler('checkInView');
          });
          return elem.focus();
        }
      });
    }
  };
});

var slice = [].slice;

angular.module('loomioApp').factory('SequenceService', function() {
  var SequenceService;
  return new (SequenceService = (function() {
    function SequenceService() {}

    SequenceService.prototype.applySequence = function(scope, options) {
      var changeStep, emitter;
      if (options == null) {
        options = {};
      }
      changeStep = function(incr, name) {
        return function() {
          var args;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          if (!options.keepDisabled) {
            scope.isDisabled = false;
          }
          (options["" + scope.currentStep + name] || function() {}).apply(null, args);
          scope.currentStep = scope.steps[scope.currentStepIndex() + incr];
          if (typeof (args[0] || {}).stopPropagation === 'function') {
            args[0].stopPropagation();
          }
          if (!scope.currentStep && !options.skipClose) {
            return emitter.$emit('$close');
          }
        };
      };
      scope.steps = typeof options.steps === 'function' ? options.steps() : options.steps;
      scope.currentStep = options.initialStep || _.first(scope.steps);
      scope.currentStepIndex = function() {
        return _.indexOf(scope.steps, scope.currentStep);
      };
      scope.progress = function() {
        if (!(scope.steps.length > 1)) {
          return;
        }
        return 100 * parseFloat(scope.currentStepIndex()) / (scope.steps.length - 1);
      };
      emitter = options.emitter || scope;
      if (typeof emitter.unlistenPrevious === 'function') {
        emitter.unlistenPrevious();
      }
      if (typeof emitter.unlistenNext === 'function') {
        emitter.unlistenNext();
      }
      emitter.unlistenPrevious = emitter.$on('previousStep', changeStep(-1, 'Back'));
      return emitter.unlistenNext = emitter.$on('nextStep', changeStep(1, 'Complete'));
    };

    return SequenceService;

  })());
});

angular.module('loomioApp').factory('Session', function($rootScope, $location, $translate, $window, Records, AppConfig) {
  return {
    login: function(data) {
      var defaultParams, user;
      Records["import"](data);
      defaultParams = _.pick({
        invitation_token: $location.search().invitation_token
      }, _.identity);
      Records.stances.remote.defaultParams = defaultParams;
      Records.polls.remote.defaultParams = defaultParams;
      if (!(AppConfig.currentUserId = data.current_user_id)) {
        return;
      }
      user = this.user();
      this.setLocale(user.locale);
      $rootScope.$broadcast('loggedIn', user);
      if (user.timeZone !== AppConfig.timeZone) {
        user.timeZone = AppConfig.timeZone;
        Records.users.updateProfile(user);
      }
      return user;
    },
    setLocale: function(locale) {
      var lc_locale;
      $translate.use(locale);
      lc_locale = locale.toLowerCase().replace('_', '-');
      if (lc_locale === "en") {
        return;
      }
      return fetch(Loomio.assetRoot + "/moment_locales/" + lc_locale + ".js").then(function(resp) {
        return resp.text();
      }).then(function(data) {
        eval(data);
        return moment.locale(lc_locale);
      });
    },
    logout: function() {
      AppConfig.loggingOut = true;
      return Records.sessions.remote.destroy('').then(function() {
        return $window.location.href = '/';
      });
    },
    user: function() {
      return Records.users.find(AppConfig.currentUserId) || Records.users.build();
    },
    currentGroupId: function() {
      return (this.currentGroup != null) && this.currentGroup.id;
    }
  };
});

angular.module('loomioApp').factory('ThreadQueryService', function(Records, Session) {
  var ThreadQueryService;
  return new (ThreadQueryService = (function() {
    var applyFilters, parseTimeOption;

    function ThreadQueryService() {}

    ThreadQueryService.prototype.queryFor = function(options) {
      if (options == null) {
        options = {};
      }
      if (options.overwrite) {
        Records.discussions.collection.removeDynamicView(options.name);
      }
      return {
        threads: function() {
          return applyFilters(options).data();
        },
        length: function() {
          return this.threads().length;
        },
        any: function() {
          return this.length() > 0;
        },
        constructor: {
          singular: 'query'
        }
      };
    };

    applyFilters = function(options) {
      var view;
      if (view = Records.discussions.collection.getDynamicView(options.name)) {
        return view;
      }
      view = Records.discussions.collection.addDynamicView(options.name);
      if (options.group) {
        view.applyFind({
          groupId: {
            $in: options.group.organisationIds()
          }
        });
      }
      if (options.from) {
        view.applyFind({
          lastActivityAt: {
            $gt: parseTimeOption(options.from)
          }
        });
      }
      if (options.to) {
        view.applyFind({
          lastActivityAt: {
            $lt: parseTimeOption(options.to)
          }
        });
      }
      if (options.ids) {
        view.applyFind({
          id: {
            $in: options.ids
          }
        });
      } else {
        _.each([].concat(options.filters), function(filter) {
          switch (filter) {
            case 'show_recent':
              return view.applyFind({
                lastActivityAt: {
                  $gt: moment().startOf('day').subtract(6, 'week').toDate()
                }
              });
            case 'show_unread':
              return view.applyWhere(function(thread) {
                return thread.isUnread();
              });
            case 'hide_unread':
              return view.applyWhere(function(thread) {
                return !thread.isUnread();
              });
            case 'show_dismissed':
              return view.applyWhere(function(thread) {
                return thread.isDismissed();
              });
            case 'hide_dismissed':
              return view.applyWhere(function(thread) {
                return !thread.isDismissed();
              });
            case 'show_closed':
              return view.applyWhere(function(thread) {
                return thread.closedAt != null;
              });
            case 'show_opened':
              return view.applyFind({
                closedAt: null
              });
            case 'show_pinned':
              return view.applyFind({
                pinned: true
              });
            case 'hide_pinned':
              return view.applyFind({
                pinned: false
              });
            case 'show_muted':
              return view.applyWhere(function(thread) {
                return thread.volume() === 'mute';
              });
            case 'hide_muted':
              return view.applyWhere(function(thread) {
                return thread.volume() !== 'mute';
              });
            case 'show_proposals':
              return view.applyWhere(function(thread) {
                return thread.hasDecision();
              });
            case 'hide_proposals':
              return view.applyWhere(function(thread) {
                return !thread.hasDecision();
              });
            case 'only_threads_in_my_groups':
              return view.applyFind({
                groupId: {
                  $in: Session.user().groupIds()
                }
              });
          }
        });
      }
      return view;
    };

    parseTimeOption = function(options) {
      var parts;
      parts = options.split(' ');
      return moment().startOf('day').subtract(parseInt(parts[0]), parts[1]);
    };

    return ThreadQueryService;

  })());
});

angular.module('loomioApp').factory('ThreadService', function(Session, Records, ModalService, PinThreadModal, CloseExplanationModal, MuteExplanationModal, FlashService) {
  var ThreadService;
  return new (ThreadService = (function() {
    function ThreadService() {}

    ThreadService.prototype.mute = function(thread) {
      var previousVolume;
      if (!Session.user().hasExperienced("mutingThread")) {
        Records.users.saveExperience("mutingThread");
        return Records.users.updateProfile(Session.user()).then(function() {
          return ModalService.open(MuteExplanationModal, {
            thread: function() {
              return thread;
            }
          });
        });
      } else {
        previousVolume = thread.volume();
        return thread.saveVolume('mute').then((function(_this) {
          return function() {
            return FlashService.success("discussion.volume.mute_message", {
              name: thread.title
            }, 'undo', function() {
              return _this.unmute(thread, previousVolume);
            });
          };
        })(this));
      }
    };

    ThreadService.prototype.unmute = function(thread, previousVolume) {
      if (previousVolume == null) {
        previousVolume = 'normal';
      }
      return thread.saveVolume(previousVolume).then((function(_this) {
        return function() {
          return FlashService.success("discussion.volume.unmute_message", {
            name: thread.title
          }, 'undo', function() {
            return _this.mute(thread);
          });
        };
      })(this));
    };

    ThreadService.prototype.close = function(thread) {
      if (!Session.user().hasExperienced("closingThread")) {
        Records.users.saveExperience("closingThread");
        return Records.users.updateProfile(Session.user()).then(function() {
          return ModalService.open(CloseExplanationModal, {
            thread: function() {
              return thread;
            }
          });
        });
      } else {
        return thread.close().then((function(_this) {
          return function() {
            return FlashService.success("discussion.closed.closed", {
              name: thread.title
            }, 'undo', function() {
              return _this.reopen(thread);
            });
          };
        })(this));
      }
    };

    ThreadService.prototype.reopen = function(thread) {
      return thread.reopen().then((function(_this) {
        return function() {
          return FlashService.success("discussion.closed.reopened", 'undo', function() {
            return _this.close(thread);
          });
        };
      })(this));
    };

    ThreadService.prototype.pin = function(thread) {
      if (!Session.user().hasExperienced("pinningThread")) {
        return Records.users.saveExperience("pinningThread").then(function() {
          return ModalService.open(PinThreadModal, {
            thread: function() {
              return thread;
            }
          });
        });
      } else {
        return thread.savePin().then((function(_this) {
          return function() {
            return FlashService.success("discussion.pin.pinned", 'undo', function() {
              return _this.unpin(thread);
            });
          };
        })(this));
      }
    };

    ThreadService.prototype.unpin = function(thread) {
      return thread.savePin().then((function(_this) {
        return function() {
          return FlashService.success("discussion.pin.unpinned", 'undo', function() {
            return _this.pin(thread);
          });
        };
      })(this));
    };

    return ThreadService;

  })());
});

var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular.module('loomioApp').factory('TimeService', function(AppConfig, $translate) {
  var TimeService;
  return new (TimeService = (function() {
    function TimeService() {
      this.inTimeZone = bind(this.inTimeZone, this);
      this.isoDate = bind(this.isoDate, this);
      this.displayDate = bind(this.displayDate, this);
    }

    TimeService.prototype.nameForZone = function(zone) {
      if (AppConfig.timeZone === zone) {
        return $translate.instant('common.local_time');
      } else {
        return _.invert(AppConfig.timeZones)[zone];
      }
    };

    TimeService.prototype.displayDate = function(m, zone) {
      if (m._f === 'YYYY-MM-DD') {
        return m.format("D MMMM" + (this.sameYear(m)));
      } else {
        return this.inTimeZone(m, zone).format("D MMMM" + (this.sameYear(m)) + " - h:mma");
      }
    };

    TimeService.prototype.isoDate = function(m, zone) {
      return this.inTimeZone(m, zone).toISOString();
    };

    TimeService.prototype.timesOfDay = function() {
      var times;
      times = [];
      _.times(24, function(hour) {
        hour = (hour + 8) % 24;
        if (hour < 10) {
          hour = "0" + hour;
        }
        times.push(moment("2015-01-01 " + hour + ":00").format('h:mm a'));
        return times.push(moment("2015-01-01 " + hour + ":30").format('h:mm a'));
      });
      return times;
    };

    TimeService.prototype.inTimeZone = function(m, zone) {
      return m.tz(zone || AppConfig.timeZone);
    };

    TimeService.prototype.sameYear = function(date) {
      if (date.year() === moment().year()) {
        return "";
      } else {
        return " YYYY";
      }
    };

    return TimeService;

  })());
});

angular.module('loomioApp').factory('TranslationService', function($translate, Session, Records) {
  var TranslationService;
  return new (TranslationService = (function() {
    function TranslationService() {}

    TranslationService.prototype.listenForTranslations = function(scope) {
      return scope.$on('translationComplete', (function(_this) {
        return function(e, translatedFields) {
          if (e.defaultPrevented) {
            return;
          }
          e.preventDefault();
          return scope.translation = translatedFields;
        };
      })(this));
    };

    TranslationService.prototype.inline = function(scope, model) {
      return Records.translations.fetchTranslation(model, Session.user().locale).then(function(data) {
        scope.translated = true;
        return scope.$emit('translationComplete', data.translations[0].fields);
      });
    };

    return TranslationService;

  })());
});

angular.module('loomioApp').factory('UserHelpService', function($sce, Session) {
  var UserHelpService;
  return new (UserHelpService = (function() {
    function UserHelpService() {}

    UserHelpService.prototype.helpLocale = function() {
      switch (Session.user().locale) {
        case 'es':
        case 'an':
        case 'ca':
        case 'gl':
          return 'es';
        case 'zh-TW':
          return 'zh';
        case 'ar':
          return 'ar';
        case 'fr':
          return 'fr';
        default:
          return 'en';
      }
    };

    UserHelpService.prototype.helpLink = function() {
      return "https://loomio.gitbooks.io/manual/content/" + (this.helpLocale()) + "/index.html";
    };

    UserHelpService.prototype.helpVideo = function() {
      switch (Session.user().locale) {
        case 'es':
        case 'an':
        case 'ca':
        case 'gl':
          return "https://www.youtube.com/embed/BT9f0Nj0zB8";
        default:
          return "https://www.youtube.com/embed/KS-_g437VD4";
      }
    };

    UserHelpService.prototype.helpVideoUrl = function() {
      return $sce.trustAsResourceUrl(this.helpVideo());
    };

    UserHelpService.prototype.tenTipsArticleLink = function() {
      switch (Session.user().locale) {
        case 'es':
        case 'an':
        case 'ca':
        case 'gl':
          return "http://blog.loomio.org/2015/08/17/10-consejos-para-tomar-decisiones-con-loomio/";
        case 'fr':
          return "http://blog.loomio.org/2015/08/25/10-conseils-pour-prendre-de-grandes-decisions-grace-a-loomio/";
        default:
          return "https://blog.loomio.org/2015/09/10/10-tips-for-making-great-decisions-with-loomio/";
      }
    };

    UserHelpService.prototype.nineWaysArticleLink = function() {
      switch (Session.user().locale) {
        case 'es':
        case 'an':
        case 'ca':
        case 'gl':
          return "http://blog.loomio.org/2015/08/17/9-formas-de-utilizar-propuestas-en-loomio-para-convertir-conversaciones-en-accion/";
        case 'fr':
          return "https:////blog.loomio.org/2015/08/25/9-manieres-dutiliser-loomio-pour-transformer-une-conversation-en-actes/";
        default:
          return "https://blog.loomio.org/2015/09/18/9-ways-to-use-a-loomio-proposal-to-turn-a-conversation-into-action/";
      }
    };

    return UserHelpService;

  })());
});

angular.module('loomioApp').factory('ViewportService', function($window) {
  var ViewportService;
  return new (ViewportService = (function() {
    function ViewportService() {}

    ViewportService.prototype.viewportSize = function() {
      if ($window.innerWidth < 480) {
        return 'small';
      } else if ($window.innerWidth < 992) {
        return 'medium';
      } else {
        return 'large';
      }
    };

    return ViewportService;

  })());
});

angular.module('loomioApp').factory('ArchiveGroupForm', function() {
  return {
    templateUrl: 'generated/components/archive_group_form/archive_group_form.html',
    controller: function($scope, $rootScope, $location, group, FormService, Records) {
      $scope.group = group;
      return $scope.submit = FormService.submit($scope, $scope.group, {
        submitFn: $scope.group.archive,
        flashSuccess: 'group_page.messages.archive_group_success',
        successCallback: function() {
          return $location.path('/dashboard');
        }
      });
    }
  };
});

angular.module('loomioApp').directive('actionDock', function() {
  return {
    scope: {
      actions: '=',
      model: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/action_dock/action_dock.html'
  };
});

angular.module('loomioApp').directive('barChart', function(AppConfig) {
  return {
    template: '<div class="bar-chart"></div>',
    replace: true,
    scope: {
      stanceCounts: '=',
      size: '@'
    },
    restrict: 'E',
    controller: function($scope, $element) {
      var draw, drawPlaceholder, scoreData, scoreMaxValue, shapes;
      draw = SVG($element[0]).size('100%', '100%');
      shapes = [];
      scoreData = function() {
        return _.take(_.map($scope.stanceCounts, function(score, index) {
          return {
            color: AppConfig.pollColors.poll[index],
            index: index,
            score: score
          };
        }), 5);
      };
      scoreMaxValue = function() {
        return _.max(_.map(scoreData(), function(data) {
          return data.score;
        }));
      };
      drawPlaceholder = function() {
        var barHeight, barWidths;
        barHeight = $scope.size / 3;
        barWidths = {
          0: $scope.size,
          1: 2 * $scope.size / 3,
          2: $scope.size / 3
        };
        return _.each(barWidths, function(width, index) {
          return draw.rect(width, barHeight - 2).fill("#ebebeb").x(0).y(index * barHeight);
        });
      };
      return $scope.$watchCollection('stanceCounts', function() {
        var barHeight;
        _.each(shapes, function(shape) {
          return shape.remove();
        });
        if (!(scoreData().length > 0 && scoreMaxValue() > 0)) {
          return drawPlaceholder();
        }
        barHeight = $scope.size / scoreData().length;
        return _.map(scoreData(), function(scoreData) {
          var barWidth;
          barWidth = _.max([($scope.size * scoreData.score) / scoreMaxValue(), 2]);
          return draw.rect(barWidth, barHeight - 2).fill(scoreData.color).x(0).y(scoreData.index * barHeight);
        });
      });
    }
  };
});

angular.module('loomioApp').factory('ChangePasswordForm', function(Session, Records, FormService) {
  return {
    templateUrl: 'generated/components/change_password_form/change_password_form.html',
    controller: function($scope) {
      var actionName;
      $scope.user = Session.user().clone();
      actionName = $scope.user.hasPassword ? 'password_changed' : 'password_set';
      return $scope.submit = FormService.submit($scope, $scope.user, {
        submitFn: Records.users.updateProfile,
        flashSuccess: "change_password_form." + actionName
      });
    }
  };
});

angular.module('loomioApp').factory('ChangePictureForm', function() {
  return {
    templateUrl: 'generated/components/change_picture_form/change_picture_form.html',
    controller: function($scope, $rootScope, $timeout, Session, Records, FormService) {
      $scope.user = Session.user().clone();
      $scope.selectFile = function() {
        return $timeout(function() {
          return document.querySelector('.change-picture-form__file-input').click();
        });
      };
      $scope.submit = FormService.submit($scope, $scope.user, {
        flashSuccess: 'profile_page.messages.picture_changed',
        submitFn: Records.users.updateProfile,
        prepareFn: function(kind) {
          return $scope.user.avatarKind = kind;
        },
        cleanupFn: function() {
          return $rootScope.$broadcast('updateProfile');
        }
      });
      return $scope.upload = FormService.upload($scope, $scope.user, {
        flashSuccess: 'profile_page.messages.picture_changed',
        submitFn: Records.users.uploadAvatar,
        loadingMessage: 'common.action.uploading',
        cleanupFn: function() {
          return $rootScope.$broadcast('updateProfile');
        }
      });
    }
  };
});

angular.module('loomioApp').factory('ChangeVolumeForm', function() {
  return {
    templateUrl: 'generated/components/change_volume_form/change_volume_form.html',
    controller: function($scope, model, FormService, Session, FlashService) {
      $scope.model = model.clone();
      $scope.volumeLevels = ["loud", "normal", "quiet"];
      $scope.defaultVolume = function() {
        switch ($scope.model.constructor.singular) {
          case 'discussion':
            return $scope.model.volume();
          case 'membership':
            return $scope.model.volume;
          case 'user':
            return $scope.model.defaultMembershipVolume;
        }
      };
      $scope.buh = {
        volume: $scope.defaultVolume()
      };
      $scope.translateKey = function(key) {
        return "change_volume_form." + (key || $scope.model.constructor.singular);
      };
      $scope.flashTranslation = function() {
        var key;
        key = (function() {
          if ($scope.applyToAll) {
            switch ($scope.model.constructor.singular) {
              case 'discussion':
                return 'membership';
              case 'membership':
                return 'all_groups';
              case 'user':
                return 'all_groups';
            }
          } else {
            return $scope.model.constructor.singular;
          }
        })();
        return ($scope.translateKey(key)) + ".messages." + $scope.buh.volume;
      };
      $scope.submit = FormService.submit($scope, $scope.model, {
        submitFn: function(model) {
          return model.saveVolume($scope.buh.volume, $scope.applyToAll, $scope.setDefault);
        },
        flashSuccess: $scope.flashTranslation
      });
    }
  };
});

angular.module('loomioApp').factory('CloseExplanationModal', function() {
  return {
    templateUrl: 'generated/components/close_explanation_modal/close_explanation_modal.html',
    controller: function($scope, thread, Records, ThreadService) {
      $scope.thread = thread;
      return $scope.closeThread = function() {
        return ThreadService.close($scope.thread).then($scope.$close());
      };
    }
  };
});

angular.module('loomioApp').factory('ConfirmModal', function(FlashService) {
  return {
    templateUrl: 'generated/components/confirm_modal/confirm_modal.html',
    controller: function($scope, submit, text, forceSubmit) {
      $scope.submit = submit;
      $scope.forceSubmit = forceSubmit;
      $scope.text = _.merge({
        submit: "common.action.ok"
      }, text);
      return $scope.submit = function() {
        $scope.isDisabled = true;
        return submit().then(function() {
          $scope.$close();
          return FlashService.success($scope.text.flash);
        })["finally"](function() {
          return $scope.isDisabled = false;
        });
      };
    }
  };
});

angular.module('loomioApp').controller('ContactPageController', function($scope) {});

angular.module('loomioApp').directive('currentPollsCard', function(Records, LoadingService, AbilityService, ModalService, PollCommonStartModal) {
  return {
    scope: {
      model: '='
    },
    templateUrl: 'generated/components/current_polls_card/current_polls_card.html',
    controller: function($scope) {
      $scope.fetchRecords = function() {
        return Records.polls.fetchFor($scope.model, {
          status: 'active'
        });
      };
      LoadingService.applyLoadingFunction($scope, 'fetchRecords');
      $scope.fetchRecords();
      $scope.polls = function() {
        return _.take($scope.model.activePolls(), $scope.limit || 50);
      };
      $scope.startPoll = function() {
        return ModalService.open(PollCommonStartModal, {
          poll: function() {
            return Records.polls.build({
              groupId: $scope.model.id
            });
          }
        });
      };
      return $scope.canStartPoll = function() {
        return AbilityService.canStartPoll($scope.model.group());
      };
    }
  };
});

angular.module('loomioApp').controller('DashboardPageController', function($rootScope, $routeParams, RecordLoader, Records, Session, ThreadQueryService, AppConfig, $mdMedia, ModalService, GroupModal) {
  var filters, titleKey, viewName;
  this.filter = $routeParams.filter || 'hide_muted';
  titleKey = (function(_this) {
    return function() {
      if (_this.filter === 'show_muted') {
        return 'dashboard_page.filtering.muted';
      } else {
        return 'dashboard_page.filtering.all';
      }
    };
  })(this);
  $rootScope.$broadcast('currentComponent', {
    titleKey: titleKey(),
    page: 'dashboardPage',
    filter: $routeParams.filter
  });
  $rootScope.$broadcast('analyticsClearGroup');
  viewName = (function(_this) {
    return function(name) {
      if (_this.filter === 'show_muted') {
        return "dashboard" + (_.capitalize(name)) + "Muted";
      } else {
        return "dashboard" + (_.capitalize(name));
      }
    };
  })(this);
  filters = (function(_this) {
    return function(filters) {
      return ['only_threads_in_my_groups', 'show_opened', _this.filter].concat(filters);
    };
  })(this);
  this.views = {
    proposals: ThreadQueryService.queryFor({
      name: viewName("proposals"),
      filters: filters('show_proposals')
    }),
    today: ThreadQueryService.queryFor({
      name: viewName("today"),
      from: '1 second ago',
      to: '-10 year ago',
      filters: filters('hide_proposals')
    }),
    yesterday: ThreadQueryService.queryFor({
      name: viewName("yesterday"),
      from: '1 day ago',
      to: '1 second ago',
      filters: filters('hide_proposals')
    }),
    thisweek: ThreadQueryService.queryFor({
      name: viewName("thisWeek"),
      from: '1 week ago',
      to: '1 day ago',
      filters: filters('hide_proposals')
    }),
    thismonth: ThreadQueryService.queryFor({
      name: viewName("thisMonth"),
      from: '1 month ago',
      to: '1 week ago',
      filters: filters('hide_proposals')
    }),
    older: ThreadQueryService.queryFor({
      name: viewName("older"),
      from: '3 month ago',
      to: '1 month ago',
      filters: filters('hide_proposals')
    })
  };
  this.viewNames = _.keys(this.views);
  this.loadingViewNames = _.take(this.viewNames, 3);
  this.loader = new RecordLoader({
    collection: 'discussions',
    path: 'dashboard',
    params: {
      filter: this.filter,
      per: 50
    }
  });
  this.loader.fetchRecords().then((function(_this) {
    return function() {
      return AppConfig.dashboardLoaded = true;
    };
  })(this));
  this.dashboardLoaded = function() {
    return AppConfig.dashboardLoaded;
  };
  this.noGroups = function() {
    return !Session.user().hasAnyGroups();
  };
  this.noThreads = function() {
    return _.all(this.views, function(view) {
      return !view.any();
    });
  };
  this.startGroup = function() {
    return ModalService.open(GroupModal, {
      group: function() {
        return Records.groups.build();
      }
    });
  };
  this.userHasMuted = function() {
    return Session.user().hasExperienced("mutingThread");
  };
  this.showLargeImage = function() {
    return $mdMedia("gt-sm");
  };
});

angular.module('loomioApp').factory('DeactivateUserForm', function() {
  return {
    templateUrl: 'generated/components/deactivate_user_form/deactivate_user_form.html',
    controller: function($scope, $rootScope, $window, Session, Records, FormService) {
      $scope.user = Session.user().clone();
      return $scope.submit = FormService.submit($scope, $scope.user, {
        submitFn: Records.users.deactivate,
        successCallback: function() {
          return $window.location.reload();
        }
      });
    }
  };
});

angular.module('loomioApp').factory('DeactivationModal', function() {
  return {
    templateUrl: 'generated/components/deactivation_modal/deactivation_modal.html',
    controller: function($scope, AbilityService, ModalService, DeactivateUserForm, OnlyCoordinatorModal) {
      return $scope.submit = function() {
        if (AbilityService.canDeactivateUser()) {
          return ModalService.open(DeactivateUserForm);
        } else {
          return ModalService.open(OnlyCoordinatorModal);
        }
      };
    }
  };
});

angular.module('loomioApp').factory('DeleteThreadForm', function() {
  return {
    templateUrl: 'generated/components/delete_thread_form/delete_thread_form.html',
    controller: function($scope, $location, discussion, FormService, LmoUrlService) {
      $scope.discussion = discussion;
      $scope.group = discussion.group();
      return $scope.submit = FormService.submit($scope, $scope.discussion, {
        submitFn: $scope.discussion.destroy,
        flashSuccess: 'delete_thread_form.messages.success',
        successCallback: function() {
          return $location.path(LmoUrlService.group($scope.group));
        }
      });
    }
  };
});

angular.module('loomioApp').directive('dialogScrollIndicator', function() {
  return {
    templateUrl: 'generated/components/dialog_scroll_indicator/dialog_scroll_indicator.html'
  };
});

angular.module('loomioApp').factory('DismissExplanationModal', function() {
  return {
    templateUrl: 'generated/components/dismiss_explanation_modal/dismiss_explanation_modal.html',
    controller: function($scope, thread, Records, FlashService) {
      $scope.thread = thread;
      return $scope.dismiss = function() {
        $scope.thread.dismiss();
        FlashService.success('dashboard_page.thread_dismissed');
        return $scope.$close();
      };
    }
  };
});

angular.module('loomioApp').factory('BaseModel', function() {
  return AngularRecordStore.BaseModelFn();
});

angular.module('loomioApp').factory('BaseRecordsInterface', function(RestfulClient, $q) {
  return AngularRecordStore.BaseRecordsInterfaceFn(RestfulClient, $q);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('CommentModel', function(BaseModel, HasDrafts, HasDocuments, AppConfig) {
  var CommentModel;
  return CommentModel = (function(superClass) {
    extend(CommentModel, superClass);

    function CommentModel() {
      return CommentModel.__super__.constructor.apply(this, arguments);
    }

    CommentModel.singular = 'comment';

    CommentModel.plural = 'comments';

    CommentModel.indices = ['discussionId', 'authorId'];

    CommentModel.serializableAttributes = AppConfig.permittedParams.comment;

    CommentModel.draftParent = 'discussion';

    CommentModel.draftPayloadAttributes = ['body', 'document_ids'];

    CommentModel.prototype.afterConstruction = function() {
      HasDrafts.apply(this);
      return HasDocuments.apply(this);
    };

    CommentModel.prototype.defaultValues = function() {
      return {
        usesMarkdown: true,
        discussionId: null,
        body: '',
        mentionedUsernames: []
      };
    };

    CommentModel.prototype.relationships = function() {
      this.belongsTo('author', {
        from: 'users'
      });
      this.belongsTo('discussion');
      this.belongsTo('parent', {
        from: 'comments',
        by: 'parentId'
      });
      return this.hasMany('versions', {
        sortBy: 'createdAt'
      });
    };

    CommentModel.prototype.createdEvent = function() {
      return this.recordStore.events.find({
        kind: "new_comment",
        eventableId: this.id
      })[0];
    };

    CommentModel.prototype.reactions = function() {
      return this.recordStore.reactions.find({
        reactableId: this.id,
        reactableType: _.capitalize(this.constructor.singular)
      });
    };

    CommentModel.prototype.group = function() {
      return this.discussion().group();
    };

    CommentModel.prototype.isMostRecent = function() {
      return _.last(this.discussion().comments()) === this;
    };

    CommentModel.prototype.isReply = function() {
      return this.parentId != null;
    };

    CommentModel.prototype.hasDescription = function() {
      return !!this.body;
    };

    CommentModel.prototype.parent = function() {
      return this.recordStore.comments.find(this.parentId);
    };

    CommentModel.prototype.reactors = function() {
      return this.recordStore.users.find(_.pluck(this.reactions(), 'userId'));
    };

    CommentModel.prototype.authorName = function() {
      return this.author().name;
    };

    CommentModel.prototype.authorUsername = function() {
      return this.author().username;
    };

    CommentModel.prototype.authorAvatar = function() {
      return this.author().avatarOrInitials();
    };

    CommentModel.prototype.cookedBody = function() {
      var cooked;
      cooked = this.body;
      _.each(this.mentionedUsernames, function(username) {
        return cooked = cooked.replace(RegExp("@" + username, "g"), "[[@" + username + "]]");
      });
      return cooked;
    };

    CommentModel.prototype.beforeDestroy = function() {
      return _.invoke(this.recordStore.events.find({
        kind: 'new_comment',
        eventableId: this.id
      }), 'remove');
    };

    CommentModel.prototype.edited = function() {
      return this.versionsCount > 1;
    };

    CommentModel.prototype.attributeForVersion = function(attr, version) {
      if (!version) {
        return '';
      }
      if (version.changes[attr]) {
        return version.changes[attr][1];
      } else {
        return this.attributeForVersion(attr, this.recordStore.versions.find(version.previousId));
      }
    };

    return CommentModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('CommentRecordsInterface', function(BaseRecordsInterface, CommentModel) {
  var CommentRecordsInterface;
  return CommentRecordsInterface = (function(superClass) {
    extend(CommentRecordsInterface, superClass);

    function CommentRecordsInterface() {
      return CommentRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    CommentRecordsInterface.prototype.model = CommentModel;

    CommentRecordsInterface.prototype.like = function(user, comment, success) {
      return this.remote.postMember(comment.id, "like");
    };

    CommentRecordsInterface.prototype.unlike = function(user, comment, success) {
      return this.remote.postMember(comment.id, "unlike");
    };

    return CommentRecordsInterface;

  })(BaseRecordsInterface);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('ContactMessageModel', function(BaseModel, AppConfig) {
  var ContactMessageModel;
  return ContactMessageModel = (function(superClass) {
    extend(ContactMessageModel, superClass);

    function ContactMessageModel() {
      return ContactMessageModel.__super__.constructor.apply(this, arguments);
    }

    ContactMessageModel.singular = 'contactMessage';

    ContactMessageModel.plural = 'contactMessages';

    ContactMessageModel.serializableAttributes = AppConfig.permittedParams.contact_message;

    return ContactMessageModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('ContactMessageRecordsInterface', function(BaseRecordsInterface, ContactMessageModel) {
  var ContactMessageRecordsInterface;
  return ContactMessageRecordsInterface = (function(superClass) {
    extend(ContactMessageRecordsInterface, superClass);

    function ContactMessageRecordsInterface() {
      return ContactMessageRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    ContactMessageRecordsInterface.prototype.model = ContactMessageModel;

    return ContactMessageRecordsInterface;

  })(BaseRecordsInterface);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('ContactModel', function(BaseModel) {
  var ContactModel;
  return ContactModel = (function(superClass) {
    extend(ContactModel, superClass);

    function ContactModel() {
      return ContactModel.__super__.constructor.apply(this, arguments);
    }

    ContactModel.singular = 'contact';

    ContactModel.plural = 'contacts';

    return ContactModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('ContactRecordsInterface', function(BaseRecordsInterface, ContactModel) {
  var ContactRecordsInterface;
  return ContactRecordsInterface = (function(superClass) {
    extend(ContactRecordsInterface, superClass);

    function ContactRecordsInterface() {
      return ContactRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    ContactRecordsInterface.prototype.model = ContactModel;

    ContactRecordsInterface.prototype.fetchInvitables = function(fragment, groupKey) {
      return this.fetch({
        params: {
          q: fragment,
          group_key: groupKey
        }
      });
    };

    return ContactRecordsInterface;

  })(BaseRecordsInterface);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('ContactRequestModel', function(BaseModel) {
  var ContactRequestModel;
  return ContactRequestModel = (function(superClass) {
    extend(ContactRequestModel, superClass);

    function ContactRequestModel() {
      return ContactRequestModel.__super__.constructor.apply(this, arguments);
    }

    ContactRequestModel.singular = 'contactRequest';

    ContactRequestModel.plural = 'contactRequests';

    ContactRequestModel.prototype.defaultValues = function() {
      return {
        message: ''
      };
    };

    return ContactRequestModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('ContactRequestRecordsInterface', function(BaseRecordsInterface, ContactRequestModel) {
  var ContactRequestRecordsInterface;
  return ContactRequestRecordsInterface = (function(superClass) {
    extend(ContactRequestRecordsInterface, superClass);

    function ContactRequestRecordsInterface() {
      return ContactRequestRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    ContactRequestRecordsInterface.prototype.model = ContactRequestModel;

    return ContactRequestRecordsInterface;

  })(BaseRecordsInterface);
});

var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('DiscussionModel', function(BaseModel, HasDocuments, HasDrafts, AppConfig, RangeSet) {
  var DiscussionModel;
  return DiscussionModel = (function(superClass) {
    extend(DiscussionModel, superClass);

    function DiscussionModel() {
      this.reopen = bind(this.reopen, this);
      this.close = bind(this.close, this);
      this.savePin = bind(this.savePin, this);
      this.move = bind(this.move, this);
      this.saveVolume = bind(this.saveVolume, this);
      this.privateDefaultValue = bind(this.privateDefaultValue, this);
      this.defaultValues = bind(this.defaultValues, this);
      return DiscussionModel.__super__.constructor.apply(this, arguments);
    }

    DiscussionModel.singular = 'discussion';

    DiscussionModel.plural = 'discussions';

    DiscussionModel.uniqueIndices = ['id', 'key'];

    DiscussionModel.indices = ['groupId', 'authorId'];

    DiscussionModel.draftParent = 'group';

    DiscussionModel.draftPayloadAttributes = ['title', 'description'];

    DiscussionModel.serializableAttributes = AppConfig.permittedParams.discussion;

    DiscussionModel.prototype.afterConstruction = function() {
      if (this.isNew()) {
        this["private"] = this.privateDefaultValue();
      }
      HasDocuments.apply(this, {
        showTitle: true
      });
      return HasDrafts.apply(this);
    };

    DiscussionModel.prototype.defaultValues = function() {
      return {
        "private": null,
        usesMarkdown: true,
        lastItemAt: null,
        title: '',
        description: ''
      };
    };

    DiscussionModel.prototype.privateDefaultValue = function() {
      if (this.group()) {
        switch (this.group().discussionPrivacyOptions) {
          case 'private_only':
            return true;
          case 'public_or_private':
            return true;
          case 'public_only':
            return false;
        }
      } else {
        return null;
      }
    };

    DiscussionModel.prototype.relationships = function() {
      this.hasMany('comments', {
        sortBy: 'createdAt'
      });
      this.hasMany('events', {
        sortBy: 'sequenceId'
      });
      this.hasMany('polls', {
        sortBy: 'createdAt',
        sortDesc: true
      });
      this.hasMany('versions', {
        sortBy: 'createdAt'
      });
      this.belongsTo('group');
      this.belongsTo('author', {
        from: 'users'
      });
      return this.belongsTo('createdEvent', {
        from: 'events'
      });
    };

    DiscussionModel.prototype.discussion = function() {
      return this;
    };

    DiscussionModel.prototype.reactions = function() {
      return this.recordStore.reactions.find({
        reactableId: this.id,
        reactableType: "Discussion"
      });
    };

    DiscussionModel.prototype.translationOptions = function() {
      return {
        title: this.title,
        groupName: this.groupName()
      };
    };

    DiscussionModel.prototype.authorName = function() {
      if (this.author()) {
        return this.author().name;
      }
    };

    DiscussionModel.prototype.groupName = function() {
      if (this.group()) {
        return this.group().name;
      }
    };

    DiscussionModel.prototype.activePolls = function() {
      return _.filter(this.polls(), function(poll) {
        return poll.isActive();
      });
    };

    DiscussionModel.prototype.hasActivePoll = function() {
      return _.any(this.activePolls());
    };

    DiscussionModel.prototype.hasDecision = function() {
      return this.hasActivePoll();
    };

    DiscussionModel.prototype.closedPolls = function() {
      return _.filter(this.polls(), function(poll) {
        return !poll.isActive();
      });
    };

    DiscussionModel.prototype.activePoll = function() {
      return _.first(this.activePolls());
    };

    DiscussionModel.prototype.isUnread = function() {
      return !this.isDismissed() && (this.discussionReaderId != null) && ((this.lastReadAt == null) || this.unreadItemsCount() > 0);
    };

    DiscussionModel.prototype.isDismissed = function() {
      return (this.discussionReaderId != null) && (this.dismissedAt != null) && this.dismissedAt.isSameOrAfter(this.lastActivityAt);
    };

    DiscussionModel.prototype.hasUnreadActivity = function() {
      return this.isUnread() && this.unreadItemsCount() > 0;
    };

    DiscussionModel.prototype.hasDescription = function() {
      return !!this.description;
    };

    DiscussionModel.prototype.requireReloadFor = function(event) {
      if (!event || event.discussionId !== this.id || event.sequenceId) {
        return false;
      }
      return _.find(this.events(), function(e) {
        return e.kind === 'new_comment' && e.eventable.id === event.eventable.id;
      });
    };

    DiscussionModel.prototype.minLoadedSequenceId = function() {
      var item;
      item = _.min(this.events(), function(event) {
        return event.sequenceId || Number.MAX_VALUE;
      });
      return item.sequenceId;
    };

    DiscussionModel.prototype.maxLoadedSequenceId = function() {
      var item;
      item = _.max(this.events(), function(event) {
        return event.sequenceId || 0;
      });
      return item.sequenceId;
    };

    DiscussionModel.prototype.allEventsLoaded = function() {
      return this.recordStore.events.find({
        discussionId: this.id
      }).length === this.itemsCount;
    };

    DiscussionModel.prototype.membership = function() {
      return this.recordStore.memberships.find({
        userId: AppConfig.currentUserId,
        groupId: this.groupId
      })[0];
    };

    DiscussionModel.prototype.membershipVolume = function() {
      if (this.membership()) {
        return this.membership().volume;
      }
    };

    DiscussionModel.prototype.volume = function() {
      return this.discussionReaderVolume || this.membershipVolume();
    };

    DiscussionModel.prototype.saveVolume = function(volume, applyToAll) {
      if (applyToAll == null) {
        applyToAll = false;
      }
      if (applyToAll) {
        return this.membership().saveVolume(volume);
      } else {
        if (volume != null) {
          this.discussionReaderVolume = volume;
        }
        return this.remote.patchMember(this.keyOrId(), 'set_volume', {
          volume: this.discussionReaderVolume
        });
      }
    };

    DiscussionModel.prototype.isMuted = function() {
      return this.volume() === 'mute';
    };

    DiscussionModel.prototype.markAsSeen = function() {
      if (!(this.discussionReaderId && !this.lastReadAt)) {
        return;
      }
      this.remote.patchMember(this.keyOrId(), 'mark_as_seen');
      return this.update({
        lastReadAt: moment()
      });
    };

    DiscussionModel.prototype.markAsRead = function(id) {
      if (!this.discussionReaderId || this.hasRead(id)) {
        return;
      }
      this.readRanges.push([id, id]);
      this.readRanges = RangeSet.reduce(this.readRanges);
      return this.updateReadRanges();
    };

    DiscussionModel.prototype.update = function(attributes) {
      if (_.isArray(this.readRanges) && _.isArray(attributes.readRanges) && !_.isEqual(attributes.readRanges, this.readRanges)) {
        attributes.readRanges = RangeSet.reduce(this.readRanges.concat(attributes.readRanges));
      }
      return this.baseUpdate(attributes);
    };

    DiscussionModel.prototype.updateReadRanges = _.throttle(function() {
      return this.remote.patchMember(this.keyOrId(), 'mark_as_read', {
        ranges: RangeSet.serialize(this.readRanges)
      });
    }, 2000);

    DiscussionModel.prototype.hasRead = function(id) {
      return RangeSet.includesValue(this.readRanges, id);
    };

    DiscussionModel.prototype.unreadRanges = function() {
      return RangeSet.subtractRanges(this.ranges, this.readRanges);
    };

    DiscussionModel.prototype.unreadItemsCount = function() {
      return this.itemsCount - this.readItemsCount();
    };

    DiscussionModel.prototype.readItemsCount = function() {
      return RangeSet.length(this.readRanges);
    };

    DiscussionModel.prototype.firstSequenceId = function() {
      return (_.first(this.ranges) || [])[0];
    };

    DiscussionModel.prototype.lastSequenceId = function() {
      return (_.last(this.ranges) || [])[1];
    };

    DiscussionModel.prototype.lastReadSequenceId = function() {
      return (_.last(this.readRanges) || [])[1];
    };

    DiscussionModel.prototype.firstUnreadSequenceId = function() {
      return (_.first(this.unreadRanges()) || [])[0];
    };

    DiscussionModel.prototype.dismiss = function() {
      this.remote.patchMember(this.keyOrId(), 'dismiss');
      return this.update({
        dismissedAt: moment()
      });
    };

    DiscussionModel.prototype.move = function() {
      return this.remote.patchMember(this.keyOrId(), 'move', {
        group_id: this.groupId
      });
    };

    DiscussionModel.prototype.savePin = function() {
      return this.remote.patchMember(this.keyOrId(), 'pin');
    };

    DiscussionModel.prototype.close = function() {
      return this.remote.patchMember(this.keyOrId(), 'close');
    };

    DiscussionModel.prototype.reopen = function() {
      return this.remote.patchMember(this.keyOrId(), 'reopen');
    };

    DiscussionModel.prototype.edited = function() {
      return this.versionsCount > 1;
    };

    DiscussionModel.prototype.attributeForVersion = function(attr, version) {
      if (!version) {
        return '';
      }
      if (version.changes[attr]) {
        return version.changes[attr][1];
      } else {
        return this.attributeForVersion(attr, this.recordStore.versions.find(version.previousId));
      }
    };

    DiscussionModel.prototype.cookedDescription = function() {
      var cooked;
      cooked = this.description;
      _.each(this.mentionedUsernames, function(username) {
        return cooked = cooked.replace(RegExp("@" + username, "g"), "[[@" + username + "]]");
      });
      return cooked;
    };

    return DiscussionModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('DiscussionRecordsInterface', function(BaseRecordsInterface, DiscussionModel) {
  var DiscussionRecordsInterface;
  return DiscussionRecordsInterface = (function(superClass) {
    extend(DiscussionRecordsInterface, superClass);

    function DiscussionRecordsInterface() {
      return DiscussionRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    DiscussionRecordsInterface.prototype.model = DiscussionModel;

    DiscussionRecordsInterface.prototype.search = function(groupKey, fragment, options) {
      if (options == null) {
        options = {};
      }
      options.group_id = groupKey;
      options.q = fragment;
      return this.fetch({
        path: 'search',
        params: options
      });
    };

    DiscussionRecordsInterface.prototype.fetchByGroup = function(groupKey, options) {
      if (options == null) {
        options = {};
      }
      options['group_id'] = groupKey;
      return this.fetch({
        params: options
      });
    };

    DiscussionRecordsInterface.prototype.fetchDashboard = function(options) {
      if (options == null) {
        options = {};
      }
      return this.fetch({
        path: 'dashboard',
        params: options
      });
    };

    DiscussionRecordsInterface.prototype.fetchInbox = function(options) {
      if (options == null) {
        options = {};
      }
      return this.fetch({
        path: 'inbox',
        params: {
          from: options['from'] || 0,
          per: options['per'] || 100,
          since: options['since'] || moment().startOf('day').subtract(6, 'week').toDate(),
          timeframe_for: options['timeframe_for'] || 'last_activity_at'
        }
      });
    };

    return DiscussionRecordsInterface;

  })(BaseRecordsInterface);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('DocumentModel', function(BaseModel, AppConfig) {
  var DocumentModel;
  return DocumentModel = (function(superClass) {
    extend(DocumentModel, superClass);

    function DocumentModel() {
      return DocumentModel.__super__.constructor.apply(this, arguments);
    }

    DocumentModel.singular = 'document';

    DocumentModel.plural = 'documents';

    DocumentModel.indices = ['modelId', 'authorId'];

    DocumentModel.serializableAttributes = AppConfig.permittedParams.document;

    DocumentModel.prototype.relationships = function() {
      this.belongsTo('author', {
        from: 'users',
        by: 'authorId'
      });
      return this.belongsTo('group');
    };

    DocumentModel.prototype.model = function() {
      return this.recordStore[(this.modelType.toLowerCase()) + "s"].find(this.modelId);
    };

    DocumentModel.prototype.modelTitle = function() {
      switch (this.modelType) {
        case 'Group':
          return this.model().name;
        case 'Discussion':
          return this.model().title;
        case 'Outcome':
          return this.model().poll().title;
        case 'Comment':
          return this.model().discussion().title;
        case 'Poll':
          return this.model().title;
      }
    };

    DocumentModel.prototype.authorName = function() {
      if (this.author()) {
        return this.author().name;
      }
    };

    DocumentModel.prototype.isAnImage = function() {
      return this.icon === 'image';
    };

    return DocumentModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('DocumentRecordsInterface', function(BaseRecordsInterface, DocumentModel) {
  var DocumentRecordsInterface;
  return DocumentRecordsInterface = (function(superClass) {
    extend(DocumentRecordsInterface, superClass);

    function DocumentRecordsInterface() {
      return DocumentRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    DocumentRecordsInterface.prototype.model = DocumentModel;

    DocumentRecordsInterface.prototype.fetchByModel = function(model) {
      var obj;
      return this.fetch({
        params: (
          obj = {},
          obj[model.constructor.singular + "_id"] = model.id,
          obj
        )
      });
    };

    DocumentRecordsInterface.prototype.fetchByGroup = function(group, query, options) {
      if (options == null) {
        options = {};
      }
      if (query != null) {
        options.q = query;
      }
      options.group_key = group.key;
      return this.fetch({
        path: 'for_group',
        params: options
      });
    };

    DocumentRecordsInterface.prototype.buildFromModel = function(model) {
      return this.build({
        modelId: model.id,
        modelType: _.capitalize(model.constructor.singular)
      });
    };

    DocumentRecordsInterface.prototype.upload = function(file, progress) {
      return this.remote.upload('', file, {
        data: {
          'document[filename]': file.name.replace(/[^a-z0-9_\-\.]/gi, '_')
        },
        fileFormDataName: 'document[file]'
      }, progress);
    };

    return DocumentRecordsInterface;

  })(BaseRecordsInterface);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('DraftModel', function(BaseModel, AppConfig) {
  var DraftModel;
  return DraftModel = (function(superClass) {
    extend(DraftModel, superClass);

    function DraftModel() {
      return DraftModel.__super__.constructor.apply(this, arguments);
    }

    DraftModel.singular = 'draft';

    DraftModel.plural = 'drafts';

    DraftModel.uniqueIndices = ['id'];

    DraftModel.serializableAttributes = AppConfig.permittedParams.draft;

    DraftModel.prototype.updateFrom = function(model) {
      var payloadField;
      payloadField = _.snakeCase(model.constructor.serializationRoot || model.constructor.singular);
      this.payload[payloadField] = _.pick(model.serialize()[payloadField], model.constructor.draftPayloadAttributes);
      return this.remote.post((this.draftableType.toLowerCase()) + "/" + this.draftableId, this.serialize());
    };

    return DraftModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('DraftRecordsInterface', function(BaseRecordsInterface, DraftModel) {
  var DraftRecordsInterface;
  return DraftRecordsInterface = (function(superClass) {
    extend(DraftRecordsInterface, superClass);

    function DraftRecordsInterface() {
      return DraftRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    DraftRecordsInterface.prototype.model = DraftModel;

    DraftRecordsInterface.prototype.findOrBuildFor = function(model) {
      return _.first(this.find({
        draftableType: _.capitalize(model.constructor.singular),
        draftableId: model.id
      })) || this.build({
        draftableType: _.capitalize(model.constructor.singular),
        draftableId: model.id,
        payload: {}
      });
    };

    DraftRecordsInterface.prototype.fetchFor = function(model) {
      return this.remote.get(model.constructor.singular + "/" + model.id);
    };

    return DraftRecordsInterface;

  })(BaseRecordsInterface);
});

var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('DraftableModel', function(BaseModel) {
  var DraftableModel;
  return DraftableModel = (function(superClass) {
    extend(DraftableModel, superClass);

    function DraftableModel() {
      this.fetchDraft = bind(this.fetchDraft, this);
      return DraftableModel.__super__.constructor.apply(this, arguments);
    }

    DraftableModel.draftParent = 'undefined';

    DraftableModel.prototype.draftParent = function() {
      return this[this.constructor.draftParent]();
    };

    DraftableModel.prototype.draft = function() {
      var parent;
      if (!(parent = this.draftParent())) {
        return;
      }
      return this.recordStore.drafts.findOrBuildFor(parent);
    };

    DraftableModel.prototype.fetchDraft = function() {
      var parent;
      if (!(parent = this.draftParent())) {
        return;
      }
      return this.recordStore.drafts.fetchFor(parent);
    };

    DraftableModel.prototype.restoreDraft = function() {
      var draft, payloadField;
      if (!(draft = this.draft())) {
        return;
      }
      payloadField = _.snakeCase(this.constructor.serializationRoot || this.constructor.singular);
      return this.update(_.omit(draft.payload[payloadField], _.isNull));
    };

    DraftableModel.prototype.resetDraft = function() {
      var draft;
      if (!(draft = this.draft())) {
        return;
      }
      return draft.updateFrom(this.recordStore[this.constructor.plural].build());
    };

    DraftableModel.prototype.updateDraft = function() {
      var draft;
      if (!(draft = this.draft())) {
        return;
      }
      return draft.updateFrom(this);
    };

    return DraftableModel;

  })(BaseModel);
});

var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('EventModel', function(BaseModel) {
  var EventModel;
  return EventModel = (function(superClass) {
    extend(EventModel, superClass);

    function EventModel() {
      this.removeFromThread = bind(this.removeFromThread, this);
      return EventModel.__super__.constructor.apply(this, arguments);
    }

    EventModel.singular = 'event';

    EventModel.plural = 'events';

    EventModel.indices = ['id', 'discussionId'];

    EventModel.eventTypeMap = {
      group: 'groups',
      discussion: 'discussions',
      poll: 'polls',
      outcome: 'outcomes',
      stance: 'stances',
      comment: 'comments',
      comment_vote: 'comments',
      membership: 'memberships',
      membership_request: 'membershipRequests'
    };

    EventModel.prototype.relationships = function() {
      this.belongsTo('parent', {
        from: 'events'
      });
      this.belongsTo('actor', {
        from: 'users'
      });
      this.belongsTo('discussion');
      return this.hasMany('notifications');
    };

    EventModel.prototype.parentOrSelf = function() {
      if (this.parentId) {
        return this.parent();
      } else {
        return this;
      }
    };

    EventModel.prototype.isNested = function() {
      return this.depth > 1;
    };

    EventModel.prototype.isSurface = function() {
      return this.depth === 1;
    };

    EventModel.prototype.surfaceOrSelf = function() {
      if (this.isNested()) {
        return this.parent();
      } else {
        return this;
      }
    };

    EventModel.prototype.children = function() {
      return this.recordStore.events.find({
        parentId: this.id
      });
    };

    EventModel.prototype["delete"] = function() {
      return this.deleted = true;
    };

    EventModel.prototype.actorName = function() {
      if (this.actor()) {
        return this.actor().name;
      }
    };

    EventModel.prototype.actorUsername = function() {
      if (this.actor()) {
        return this.actor().username;
      }
    };

    EventModel.prototype.model = function() {
      return this.recordStore[this.constructor.eventTypeMap[this.eventable.type]].find(this.eventable.id);
    };

    EventModel.prototype.isUnread = function() {
      return !this.discussion().hasRead(this.sequenceId);
    };

    EventModel.prototype.markAsRead = function() {
      if (this.discussion()) {
        return this.discussion().markAsRead(this.sequenceId);
      }
    };

    EventModel.prototype.beforeRemove = function() {
      return _.invoke(this.notifications(), 'remove');
    };

    EventModel.prototype.removeFromThread = function() {
      return this.remote.patchMember(this.id, 'remove_from_thread').then((function(_this) {
        return function() {
          return _this.remove();
        };
      })(this));
    };

    EventModel.prototype.next = function() {
      return this.recordStore.events.find({
        parentId: this.parentId,
        position: this.position + 1
      })[0];
    };

    EventModel.prototype.previous = function() {
      return this.recordStore.events.find({
        parentId: this.parentId,
        position: this.position - 1
      })[0];
    };

    return EventModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('EventRecordsInterface', function(BaseRecordsInterface, EventModel) {
  var EventRecordsInterface;
  return EventRecordsInterface = (function(superClass) {
    extend(EventRecordsInterface, superClass);

    function EventRecordsInterface() {
      return EventRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    EventRecordsInterface.prototype.model = EventModel;

    EventRecordsInterface.prototype.fetchByDiscussion = function(discussionKey, options) {
      if (options == null) {
        options = {};
      }
      options['discussion_key'] = discussionKey;
      return this.fetch({
        params: options
      });
    };

    EventRecordsInterface.prototype.findByDiscussionAndSequenceId = function(discussion, sequenceId) {
      return this.collection.chain().find({
        discussionId: discussion.id
      }).find({
        sequenceId: sequenceId
      }).data()[0];
    };

    return EventRecordsInterface;

  })(BaseRecordsInterface);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('GroupIdentityModel', function(AppConfig, BaseModel) {
  var GroupIdentityModel;
  return GroupIdentityModel = (function(superClass) {
    extend(GroupIdentityModel, superClass);

    function GroupIdentityModel() {
      return GroupIdentityModel.__super__.constructor.apply(this, arguments);
    }

    GroupIdentityModel.singular = 'groupIdentity';

    GroupIdentityModel.plural = 'groupIdentities';

    GroupIdentityModel.serializableAttributes = AppConfig.permittedParams.groupIdentity;

    GroupIdentityModel.prototype.defaultValues = function() {
      return {
        customFields: {}
      };
    };

    GroupIdentityModel.prototype.relationships = function() {
      return this.belongsTo('group');
    };

    GroupIdentityModel.prototype.userIdentity = function() {
      return _.first(this.recordStore.identities.find({
        id: this.identityId
      }));
    };

    GroupIdentityModel.prototype.slackTeamName = function() {
      return this.userIdentity().customFields.slack_team_name;
    };

    GroupIdentityModel.prototype.slackChannelName = function() {
      return this.customFields.slack_channel_name;
    };

    return GroupIdentityModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('GroupIdentityRecordsInterface', function(BaseRecordsInterface, GroupIdentityModel) {
  var GroupIdentityRecordsInterface;
  return GroupIdentityRecordsInterface = (function(superClass) {
    extend(GroupIdentityRecordsInterface, superClass);

    function GroupIdentityRecordsInterface() {
      return GroupIdentityRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    GroupIdentityRecordsInterface.prototype.model = GroupIdentityModel;

    return GroupIdentityRecordsInterface;

  })(BaseRecordsInterface);
});

var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('GroupModel', function(BaseModel, HasDrafts, HasDocuments, AppConfig) {
  var GroupModel;
  return GroupModel = (function(superClass) {
    extend(GroupModel, superClass);

    function GroupModel() {
      this.uploadPhoto = bind(this.uploadPhoto, this);
      this.archive = bind(this.archive, this);
      return GroupModel.__super__.constructor.apply(this, arguments);
    }

    GroupModel.singular = 'group';

    GroupModel.plural = 'groups';

    GroupModel.uniqueIndices = ['id', 'key'];

    GroupModel.indices = ['parentId'];

    GroupModel.serializableAttributes = AppConfig.permittedParams.group;

    GroupModel.draftParent = 'draftParent';

    GroupModel.draftPayloadAttributes = ['name', 'description'];

    GroupModel.prototype.draftParent = function() {
      return this.parent() || this.recordStore.users.find(AppConfig.currentUserId);
    };

    GroupModel.prototype.defaultValues = function() {
      return {
        parentId: null,
        name: '',
        description: '',
        groupPrivacy: 'closed',
        discussionPrivacyOptions: 'private_only',
        membershipGrantedUpon: 'approval',
        membersCanAddMembers: true,
        membersCanEditDiscussions: true,
        membersCanEditComments: true,
        membersCanRaiseMotions: true,
        membersCanVote: true,
        membersCanStartDiscussions: true,
        membersCanCreateSubgroups: false,
        motionsCanBeEdited: false
      };
    };

    GroupModel.prototype.afterConstruction = function() {
      if (this.privacyIsClosed()) {
        this.allowPublicThreads = this.discussionPrivacyOptions === 'public_or_private';
      }
      HasDrafts.apply(this);
      return HasDocuments.apply(this, {
        showTitle: true
      });
    };

    GroupModel.prototype.relationships = function() {
      this.hasMany('discussions');
      this.hasMany('polls');
      this.hasMany('membershipRequests');
      this.hasMany('memberships');
      this.hasMany('invitations');
      this.hasMany('groupIdentities');
      this.hasMany('allDocuments', {
        from: 'documents',
        "with": 'groupId',
        of: 'id'
      });
      this.hasMany('subgroups', {
        from: 'groups',
        "with": 'parentId',
        of: 'id'
      });
      return this.belongsTo('parent', {
        from: 'groups'
      });
    };

    GroupModel.prototype.hasRelatedDocuments = function() {
      return this.hasDocuments() || this.allDocuments().length > 0;
    };

    GroupModel.prototype.parentOrSelf = function() {
      if (this.isParent()) {
        return this;
      } else {
        return this.parent();
      }
    };

    GroupModel.prototype.group = function() {
      return this;
    };

    GroupModel.prototype.shareableInvitation = function() {
      return this.recordStore.invitations.find({
        singleUse: false,
        groupId: this.id
      })[0];
    };

    GroupModel.prototype.closedPolls = function() {
      return _.filter(this.polls(), function(poll) {
        return !poll.isActive();
      });
    };

    GroupModel.prototype.activePolls = function() {
      return _.filter(this.polls(), function(poll) {
        return poll.isActive();
      });
    };

    GroupModel.prototype.pendingMembershipRequests = function() {
      return _.filter(this.membershipRequests(), function(membershipRequest) {
        return membershipRequest.isPending();
      });
    };

    GroupModel.prototype.hasPendingMembershipRequests = function() {
      return _.some(this.pendingMembershipRequests());
    };

    GroupModel.prototype.hasPendingMembershipRequestFrom = function(user) {
      return _.some(this.pendingMembershipRequests(), function(request) {
        return request.requestorId === user.id;
      });
    };

    GroupModel.prototype.previousMembershipRequests = function() {
      return _.filter(this.membershipRequests(), function(membershipRequest) {
        return !membershipRequest.isPending();
      });
    };

    GroupModel.prototype.hasPreviousMembershipRequests = function() {
      return _.some(this.previousMembershipRequests());
    };

    GroupModel.prototype.pendingInvitations = function() {
      return _.filter(this.invitations(), function(invitation) {
        return invitation.isPending() && invitation.singleUse;
      });
    };

    GroupModel.prototype.hasPendingInvitations = function() {
      return _.some(this.pendingInvitations());
    };

    GroupModel.prototype.organisationDiscussions = function() {
      return this.recordStore.discussions.find({
        groupId: {
          $in: this.organisationIds()
        },
        discussionReaderId: {
          $ne: null
        }
      });
    };

    GroupModel.prototype.organisationIds = function() {
      return _.pluck(this.subgroups(), 'id').concat(this.id);
    };

    GroupModel.prototype.organisationSubdomain = function() {
      if (this.isSubgroup()) {
        return this.parent().subdomain;
      } else {
        return this.subdomain;
      }
    };

    GroupModel.prototype.memberships = function() {
      return this.recordStore.memberships.find({
        groupId: this.id
      });
    };

    GroupModel.prototype.membershipFor = function(user) {
      return _.find(this.memberships(), function(membership) {
        return membership.userId === user.id;
      });
    };

    GroupModel.prototype.members = function() {
      return this.recordStore.users.find({
        id: {
          $in: this.memberIds()
        }
      });
    };

    GroupModel.prototype.adminMemberships = function() {
      return _.filter(this.memberships(), function(membership) {
        return membership.admin;
      });
    };

    GroupModel.prototype.admins = function() {
      var adminIds;
      adminIds = _.map(this.adminMemberships(), function(membership) {
        return membership.userId;
      });
      return this.recordStore.users.find({
        id: {
          $in: adminIds
        }
      });
    };

    GroupModel.prototype.coordinatorsIncludes = function(user) {
      return _.some(this.recordStore.memberships.where({
        groupId: this.id,
        userId: user.id
      }));
    };

    GroupModel.prototype.memberIds = function() {
      return _.pluck(this.memberships(), 'userId');
    };

    GroupModel.prototype.adminIds = function() {
      return _.pluck(this.adminMemberships(), 'userId');
    };

    GroupModel.prototype.parentName = function() {
      if (this.parent() != null) {
        return this.parent().name;
      }
    };

    GroupModel.prototype.privacyIsOpen = function() {
      return this.groupPrivacy === 'open';
    };

    GroupModel.prototype.privacyIsClosed = function() {
      return this.groupPrivacy === 'closed';
    };

    GroupModel.prototype.privacyIsSecret = function() {
      return this.groupPrivacy === 'secret';
    };

    GroupModel.prototype.isSubgroup = function() {
      return this.parentId != null;
    };

    GroupModel.prototype.isArchived = function() {
      return this.archivedAt != null;
    };

    GroupModel.prototype.isParent = function() {
      return this.parentId == null;
    };

    GroupModel.prototype.logoUrl = function() {
      if (this.logoUrlMedium) {
        return this.logoUrlMedium;
      } else if (this.isSubgroup()) {
        return this.parent().logoUrl();
      } else {
        return AppConfig.theme.default_group_logo_src;
      }
    };

    GroupModel.prototype.coverUrl = function(size) {
      if (this.isSubgroup() && !this.hasCustomCover) {
        return this.parent().coverUrl(size);
      } else {
        return this.coverUrls[size] || this.coverUrls.small;
      }
    };

    GroupModel.prototype.archive = function() {
      return this.remote.patchMember(this.key, 'archive').then((function(_this) {
        return function() {
          _this.remove();
          return _.each(_this.memberships(), function(m) {
            return m.remove();
          });
        };
      })(this));
    };

    GroupModel.prototype.uploadPhoto = function(file, kind) {
      return this.remote.upload(this.key + "/upload_photo/" + kind, file, {}, function() {});
    };

    GroupModel.prototype.hasSubscription = function() {
      return this.subscriptionKind != null;
    };

    GroupModel.prototype.isSubgroupOfSecretParent = function() {
      return this.isSubgroup() && this.parent().privacyIsSecret();
    };

    GroupModel.prototype.groupIdentityFor = function(type) {
      return _.find(this.groupIdentities(), function(gi) {
        return gi.userIdentity().identityType === type;
      });
    };

    return GroupModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('GroupRecordsInterface', function(BaseRecordsInterface, GroupModel) {
  var GroupRecordsInterface;
  return GroupRecordsInterface = (function(superClass) {
    extend(GroupRecordsInterface, superClass);

    function GroupRecordsInterface() {
      return GroupRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    GroupRecordsInterface.prototype.model = GroupModel;

    GroupRecordsInterface.prototype.fetchByParent = function(parentGroup) {
      return this.fetch({
        path: parentGroup.id + "/subgroups"
      });
    };

    GroupRecordsInterface.prototype.fetchExploreGroups = function(query, options) {
      if (options == null) {
        options = {};
      }
      options['q'] = query;
      return this.fetch({
        params: options
      });
    };

    GroupRecordsInterface.prototype.getExploreResultsCount = function(query, options) {
      if (options == null) {
        options = {};
      }
      options['q'] = query;
      return this.fetch({
        path: 'count_explore_results',
        params: options
      });
    };

    return GroupRecordsInterface;

  })(BaseRecordsInterface);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('IdentityModel', function(BaseModel) {
  var IdentityModel;
  return IdentityModel = (function(superClass) {
    extend(IdentityModel, superClass);

    function IdentityModel() {
      return IdentityModel.__super__.constructor.apply(this, arguments);
    }

    IdentityModel.singular = 'identity';

    IdentityModel.plural = 'identities';

    return IdentityModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('IdentityRecordsInterface', function(BaseRecordsInterface, IdentityModel) {
  var IdentityRecordsInterface;
  return IdentityRecordsInterface = (function(superClass) {
    extend(IdentityRecordsInterface, superClass);

    function IdentityRecordsInterface() {
      return IdentityRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    IdentityRecordsInterface.prototype.model = IdentityModel;

    IdentityRecordsInterface.prototype.performCommand = function(id, command) {
      return this.remote.getMember(id, command);
    };

    return IdentityRecordsInterface;

  })(BaseRecordsInterface);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('InvitationFormModel', function(BaseModel, AppConfig) {
  var InvitationFormModel;
  return InvitationFormModel = (function(superClass) {
    extend(InvitationFormModel, superClass);

    function InvitationFormModel() {
      return InvitationFormModel.__super__.constructor.apply(this, arguments);
    }

    InvitationFormModel.singular = 'invitationForm';

    InvitationFormModel.plural = 'invitationForms';

    InvitationFormModel.serializableFields = ['emails', 'message'];

    InvitationFormModel.prototype.defaultValues = function() {
      return {
        emails: "",
        message: ""
      };
    };

    InvitationFormModel.prototype.relationships = function() {
      return this.belongsTo('group');
    };

    InvitationFormModel.prototype.invitees = function() {
      return this.emails.match(/[^\s,;<>]+?@[^\s,;<>]+\.[^\s,;<>]+/g) || [];
    };

    InvitationFormModel.prototype.hasInvitees = function() {
      return this.invitees().length > 0;
    };

    InvitationFormModel.prototype.hasEmails = function() {
      return this.emails.length > 0;
    };

    return InvitationFormModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('InvitationFormRecordsInterface', function(BaseRecordsInterface, InvitationFormModel) {
  var InvitationFormRecordsInterface;
  return InvitationFormRecordsInterface = (function(superClass) {
    extend(InvitationFormRecordsInterface, superClass);

    function InvitationFormRecordsInterface() {
      return InvitationFormRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    InvitationFormRecordsInterface.prototype.model = InvitationFormModel;

    return InvitationFormRecordsInterface;

  })(BaseRecordsInterface);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('InvitationModel', function(BaseModel, AppConfig) {
  var InvitationModel;
  return InvitationModel = (function(superClass) {
    extend(InvitationModel, superClass);

    function InvitationModel() {
      return InvitationModel.__super__.constructor.apply(this, arguments);
    }

    InvitationModel.singular = 'invitation';

    InvitationModel.plural = 'invitations';

    InvitationModel.indices = ['groupId'];

    InvitationModel.serializableAttributes = AppConfig.permittedParams.invitation;

    InvitationModel.draftPayloadAttributes = ['emails', 'message'];

    InvitationModel.prototype.relationships = function() {
      return this.belongsTo('group');
    };

    InvitationModel.prototype.isPending = function() {
      return (this.cancelledAt == null) && (this.acceptedAt == null);
    };

    InvitationModel.prototype.resend = function() {
      return this.remote.postMember(this.id, 'resend').then((function(_this) {
        return function() {
          return _this.reminded = true;
        };
      })(this));
    };

    return InvitationModel;

  })(BaseModel);
});

var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('InvitationRecordsInterface', function(BaseRecordsInterface, InvitationModel) {
  var InvitationRecordsInterface;
  return InvitationRecordsInterface = (function(superClass) {
    extend(InvitationRecordsInterface, superClass);

    function InvitationRecordsInterface() {
      this.sendByEmail = bind(this.sendByEmail, this);
      return InvitationRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    InvitationRecordsInterface.prototype.model = InvitationModel;

    InvitationRecordsInterface.prototype.sendByEmail = function(invitationForm) {
      return this.remote.post('bulk_create', _.merge(invitationForm.serialize(), {
        group_id: invitationForm.groupId
      }));
    };

    InvitationRecordsInterface.prototype.fetchPendingByGroup = function(groupKey, options) {
      if (options == null) {
        options = {};
      }
      options['group_key'] = groupKey;
      return this.remote.get('/pending', options);
    };

    InvitationRecordsInterface.prototype.fetchShareableInvitationByGroupId = function(groupId, options) {
      if (options == null) {
        options = {};
      }
      if (!groupId) {
        return;
      }
      options['group_id'] = groupId;
      return this.remote.get('/shareable', options);
    };

    return InvitationRecordsInterface;

  })(BaseRecordsInterface);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('MembershipModel', function(BaseModel, AppConfig) {
  var MembershipModel;
  return MembershipModel = (function(superClass) {
    extend(MembershipModel, superClass);

    function MembershipModel() {
      return MembershipModel.__super__.constructor.apply(this, arguments);
    }

    MembershipModel.singular = 'membership';

    MembershipModel.plural = 'memberships';

    MembershipModel.indices = ['id', 'userId', 'groupId'];

    MembershipModel.searchableFields = ['userName', 'userUsername'];

    MembershipModel.serializableAttributes = AppConfig.permittedParams.membership;

    MembershipModel.prototype.relationships = function() {
      this.belongsTo('group');
      this.belongsTo('user');
      return this.belongsTo('inviter', {
        from: 'users'
      });
    };

    MembershipModel.prototype.userName = function() {
      return this.user().name;
    };

    MembershipModel.prototype.userUsername = function() {
      return this.user().username;
    };

    MembershipModel.prototype.groupName = function() {
      return this.group().name;
    };

    MembershipModel.prototype.saveVolume = function(volume, applyToAll) {
      if (applyToAll == null) {
        applyToAll = false;
      }
      return this.remote.patchMember(this.keyOrId(), 'set_volume', {
        volume: volume,
        apply_to_all: applyToAll,
        unsubscribe_token: this.user().unsubscribeToken
      }).then((function(_this) {
        return function() {
          if (applyToAll) {
            _.each(_this.user().allThreads(), function(thread) {
              return thread.update({
                discussionReaderVolume: null
              });
            });
            return _.each(_this.user().memberships(), function(membership) {
              return membership.update({
                volume: volume
              });
            });
          } else {
            return _.each(_this.group().discussions(), function(discussion) {
              return discussion.update({
                discussionReaderVolume: null
              });
            });
          }
        };
      })(this));
    };

    MembershipModel.prototype.isMuted = function() {
      return this.volume === 'mute';
    };

    MembershipModel.prototype.beforeRemove = function() {
      return _.invoke(this.recordStore.events.find({
        'eventable.type': 'membership',
        'eventable.id': this.id
      }), 'remove');
    };

    return MembershipModel;

  })(BaseModel);
});

var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('MembershipRecordsInterface', function(BaseRecordsInterface, MembershipModel) {
  var MembershipRecordsInterface;
  return MembershipRecordsInterface = (function(superClass) {
    extend(MembershipRecordsInterface, superClass);

    function MembershipRecordsInterface() {
      this.saveExperience = bind(this.saveExperience, this);
      return MembershipRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    MembershipRecordsInterface.prototype.model = MembershipModel;

    MembershipRecordsInterface.prototype.joinGroup = function(group) {
      return this.remote.post('join_group', {
        group_id: group.id
      });
    };

    MembershipRecordsInterface.prototype.fetchMyMemberships = function() {
      return this.fetch({
        path: 'my_memberships'
      });
    };

    MembershipRecordsInterface.prototype.fetchByNameFragment = function(fragment, groupKey, limit) {
      if (limit == null) {
        limit = 5;
      }
      return this.fetch({
        path: 'autocomplete',
        params: {
          q: fragment,
          group_key: groupKey,
          per: limit
        }
      });
    };

    MembershipRecordsInterface.prototype.fetchInvitables = function(fragment, groupKey, limit) {
      if (limit == null) {
        limit = 5;
      }
      return this.fetch({
        path: 'invitables',
        params: {
          q: fragment,
          group_key: groupKey,
          per: limit
        }
      });
    };

    MembershipRecordsInterface.prototype.fetchByGroup = function(groupKey, options) {
      if (options == null) {
        options = {};
      }
      return this.fetch({
        params: {
          group_key: groupKey,
          per: options['per'] || 30
        }
      });
    };

    MembershipRecordsInterface.prototype.fetchByUser = function(user, options) {
      if (options == null) {
        options = {};
      }
      return this.fetch({
        path: 'for_user',
        params: {
          user_id: user.id,
          per: options['per'] || 30
        }
      });
    };

    MembershipRecordsInterface.prototype.addUsersToSubgroup = function(arg) {
      var groupId, userIds;
      groupId = arg.groupId, userIds = arg.userIds;
      return this.remote.post('add_to_subgroup', {
        group_id: groupId,
        user_ids: userIds
      });
    };

    MembershipRecordsInterface.prototype.makeAdmin = function(membership) {
      return this.remote.postMember(membership.id, "make_admin");
    };

    MembershipRecordsInterface.prototype.removeAdmin = function(membership) {
      return this.remote.postMember(membership.id, "remove_admin");
    };

    MembershipRecordsInterface.prototype.saveExperience = function(experience, membership) {
      return this.remote.postMember(membership.id, "save_experience", {
        experience: experience
      });
    };

    return MembershipRecordsInterface;

  })(BaseRecordsInterface);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('MembershipRequestModel', function(BaseModel, AppConfig) {
  var MembershipRequestModel;
  return MembershipRequestModel = (function(superClass) {
    extend(MembershipRequestModel, superClass);

    function MembershipRequestModel() {
      return MembershipRequestModel.__super__.constructor.apply(this, arguments);
    }

    MembershipRequestModel.singular = 'membershipRequest';

    MembershipRequestModel.plural = 'membershipRequests';

    MembershipRequestModel.indices = ['id', 'groupId'];

    MembershipRequestModel.serializableAttributes = AppConfig.permittedParams.membership_request;

    MembershipRequestModel.prototype.relationships = function() {
      this.belongsTo('group');
      this.belongsTo('requestor', {
        from: 'users'
      });
      return this.belongsTo('responder', {
        from: 'users'
      });
    };

    MembershipRequestModel.prototype.afterConstruction = function() {
      return this.fakeUser = {
        name: this.name,
        email: this.email,
        avatarKind: 'initials',
        constructor: {
          singular: 'user'
        },
        avatarInitials: _.map(this.name.split(' '), function(t) {
          return t[0];
        }).join('')
      };
    };

    MembershipRequestModel.prototype.actor = function() {
      if (this.byExistingUser()) {
        return this.requestor();
      } else {
        return this.fakeUser;
      }
    };

    MembershipRequestModel.prototype.byExistingUser = function() {
      return this.requestorId != null;
    };

    MembershipRequestModel.prototype.isPending = function() {
      return this.respondedAt == null;
    };

    MembershipRequestModel.prototype.formattedResponse = function() {
      return _.capitalize(this.response);
    };

    MembershipRequestModel.prototype.charsLeft = function() {
      return 250 - (this.introduction || '').toString().length;
    };

    MembershipRequestModel.prototype.overCharLimit = function() {
      return this.charsLeft() < 0;
    };

    return MembershipRequestModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('MembershipRequestRecordsInterface', function(BaseRecordsInterface, MembershipRequestModel) {
  var MembershipRequestRecordsInterface;
  return MembershipRequestRecordsInterface = (function(superClass) {
    extend(MembershipRequestRecordsInterface, superClass);

    function MembershipRequestRecordsInterface() {
      return MembershipRequestRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    MembershipRequestRecordsInterface.prototype.model = MembershipRequestModel;

    MembershipRequestRecordsInterface.prototype.fetchMyPendingByGroup = function(groupKey, options) {
      if (options == null) {
        options = {};
      }
      options['group_key'] = groupKey;
      return this.remote.get('/my_pending', options);
    };

    MembershipRequestRecordsInterface.prototype.fetchPendingByGroup = function(groupKey, options) {
      if (options == null) {
        options = {};
      }
      options['group_key'] = groupKey;
      return this.remote.get('/pending', options);
    };

    MembershipRequestRecordsInterface.prototype.fetchPreviousByGroup = function(groupKey, options) {
      if (options == null) {
        options = {};
      }
      options['group_key'] = groupKey;
      return this.remote.get('/previous', options);
    };

    MembershipRequestRecordsInterface.prototype.approve = function(membershipRequest) {
      return this.remote.postMember(membershipRequest.id, 'approve', {
        group_key: membershipRequest.group().key
      });
    };

    MembershipRequestRecordsInterface.prototype.ignore = function(membershipRequest) {
      return this.remote.postMember(membershipRequest.id, 'ignore', {
        group_key: membershipRequest.group().key
      });
    };

    return MembershipRequestRecordsInterface;

  })(BaseRecordsInterface);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('NotificationModel', function(BaseModel, $translate) {
  var NotificationModel;
  return NotificationModel = (function(superClass) {
    extend(NotificationModel, superClass);

    function NotificationModel() {
      return NotificationModel.__super__.constructor.apply(this, arguments);
    }

    NotificationModel.singular = 'notification';

    NotificationModel.plural = 'notifications';

    NotificationModel.prototype.relationships = function() {
      this.belongsTo('event');
      this.belongsTo('user');
      return this.belongsTo('actor', {
        from: 'users'
      });
    };

    NotificationModel.prototype.content = function() {
      return $translate.instant("notifications." + this.kind, this.translationValues);
    };

    NotificationModel.prototype.actionPath = function() {
      switch (this.kind()) {
        case 'invitation_accepted':
          return this.actor().username;
      }
    };

    return NotificationModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('NotificationRecordsInterface', function(BaseRecordsInterface, NotificationModel) {
  var NotificationRecordsInterface;
  return NotificationRecordsInterface = (function(superClass) {
    extend(NotificationRecordsInterface, superClass);

    function NotificationRecordsInterface() {
      return NotificationRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    NotificationRecordsInterface.prototype.model = NotificationModel;

    NotificationRecordsInterface.prototype.viewed = function() {
      var any;
      any = false;
      _.each(this.collection.find({
        viewed: {
          $ne: true
        }
      }), (function(_this) {
        return function(n) {
          any = true;
          return n.update({
            viewed: true
          });
        };
      })(this));
      if (any) {
        return this.remote.post('viewed');
      }
    };

    return NotificationRecordsInterface;

  })(BaseRecordsInterface);
});

var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('OauthApplicationModel', function(BaseModel, AppConfig) {
  var OauthApplicationModel;
  return OauthApplicationModel = (function(superClass) {
    extend(OauthApplicationModel, superClass);

    function OauthApplicationModel() {
      this.uploadLogo = bind(this.uploadLogo, this);
      return OauthApplicationModel.__super__.constructor.apply(this, arguments);
    }

    OauthApplicationModel.singular = 'oauthApplication';

    OauthApplicationModel.plural = 'oauthApplications';

    OauthApplicationModel.serializationRoot = 'oauth_application';

    OauthApplicationModel.serializableAttributes = AppConfig.permittedParams.oauth_application;

    OauthApplicationModel.prototype.defaultValues = function() {
      return {
        logoUrl: AppConfig.theme.default_group_logo_src
      };
    };

    OauthApplicationModel.prototype.redirectUriArray = function() {
      return this.redirectUri.split("\n");
    };

    OauthApplicationModel.prototype.revokeAccess = function() {
      return this.remote.postMember(this.id, 'revoke_access');
    };

    OauthApplicationModel.prototype.uploadLogo = function(file) {
      return this.remote.upload(this.id + "/upload_logo", file);
    };

    return OauthApplicationModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('OauthApplicationRecordsInterface', function(BaseRecordsInterface, OauthApplicationModel) {
  var OauthApplicationRecordsInterface;
  return OauthApplicationRecordsInterface = (function(superClass) {
    extend(OauthApplicationRecordsInterface, superClass);

    function OauthApplicationRecordsInterface() {
      return OauthApplicationRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    OauthApplicationRecordsInterface.prototype.model = OauthApplicationModel;

    OauthApplicationRecordsInterface.prototype.fetchOwned = function(options) {
      if (options == null) {
        options = {};
      }
      return this.fetch({
        path: 'owned',
        params: options
      });
    };

    OauthApplicationRecordsInterface.prototype.fetchAuthorized = function(options) {
      if (options == null) {
        options = {};
      }
      return this.fetch({
        path: 'authorized',
        params: options
      });
    };

    return OauthApplicationRecordsInterface;

  })(BaseRecordsInterface);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('OutcomeModel', function(BaseModel, HasDrafts, HasDocuments, AppConfig, MentionLinkService) {
  var OutcomeModel;
  return OutcomeModel = (function(superClass) {
    extend(OutcomeModel, superClass);

    function OutcomeModel() {
      return OutcomeModel.__super__.constructor.apply(this, arguments);
    }

    OutcomeModel.singular = 'outcome';

    OutcomeModel.plural = 'outcomes';

    OutcomeModel.indices = ['pollId', 'authorId'];

    OutcomeModel.serializableAttributes = AppConfig.permittedParams.outcome;

    OutcomeModel.draftParent = 'poll';

    OutcomeModel.draftPayloadAttributes = ['statement'];

    OutcomeModel.prototype.defaultValues = function() {
      return {
        statement: '',
        customFields: {}
      };
    };

    OutcomeModel.prototype.afterConstruction = function() {
      HasDrafts.apply(this);
      return HasDocuments.apply(this);
    };

    OutcomeModel.prototype.relationships = function() {
      this.belongsTo('author', {
        from: 'users'
      });
      return this.belongsTo('poll');
    };

    OutcomeModel.prototype.group = function() {
      if (this.poll()) {
        return this.poll().group();
      }
    };

    OutcomeModel.prototype.announcementSize = function() {
      return this.poll().announcementSize(this.notifyAction());
    };

    OutcomeModel.prototype.notifyAction = function() {
      return 'publish';
    };

    return OutcomeModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('OutcomeRecordsInterface', function(BaseRecordsInterface, OutcomeModel) {
  var OutcomeRecordsInterface;
  return OutcomeRecordsInterface = (function(superClass) {
    extend(OutcomeRecordsInterface, superClass);

    function OutcomeRecordsInterface() {
      return OutcomeRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    OutcomeRecordsInterface.prototype.model = OutcomeModel;

    return OutcomeRecordsInterface;

  })(BaseRecordsInterface);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('PollDidNotVoteModel', function(AppConfig, BaseModel) {
  var PollDidNotVoteModel;
  return PollDidNotVoteModel = (function(superClass) {
    extend(PollDidNotVoteModel, superClass);

    function PollDidNotVoteModel() {
      return PollDidNotVoteModel.__super__.constructor.apply(this, arguments);
    }

    PollDidNotVoteModel.singular = 'poll_did_not_vote';

    PollDidNotVoteModel.plural = 'poll_did_not_votes';

    PollDidNotVoteModel.indices = ['pollId', 'userId'];

    PollDidNotVoteModel.serializableAttributes = AppConfig.permittedParams.pollDidNotVote;

    PollDidNotVoteModel.prototype.relationships = function() {
      this.belongsTo('user');
      return this.belongsTo('poll');
    };

    return PollDidNotVoteModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('PollDidNotVoteRecordsInterface', function(BaseRecordsInterface, PollDidNotVoteModel) {
  var PollDidNotVoteRecordsInterface;
  return PollDidNotVoteRecordsInterface = (function(superClass) {
    extend(PollDidNotVoteRecordsInterface, superClass);

    function PollDidNotVoteRecordsInterface() {
      return PollDidNotVoteRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    PollDidNotVoteRecordsInterface.prototype.model = PollDidNotVoteModel;

    return PollDidNotVoteRecordsInterface;

  })(BaseRecordsInterface);
});

var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('PollModel', function(BaseModel, HasDocuments, HasDrafts, AppConfig, MentionLinkService) {
  var PollModel;
  return PollModel = (function(superClass) {
    extend(PollModel, superClass);

    function PollModel() {
      this.toggleSubscription = bind(this.toggleSubscription, this);
      this.addOptions = bind(this.addOptions, this);
      this.close = bind(this.close, this);
      return PollModel.__super__.constructor.apply(this, arguments);
    }

    PollModel.singular = 'poll';

    PollModel.plural = 'polls';

    PollModel.indices = ['discussionId', 'authorId'];

    PollModel.serializableAttributes = AppConfig.permittedParams.poll;

    PollModel.draftParent = 'draftParent';

    PollModel.draftPayloadAttributes = ['title', 'details'];

    PollModel.prototype.afterConstruction = function() {
      HasDocuments.apply(this, {
        showTitle: true
      });
      return HasDrafts.apply(this);
    };

    PollModel.prototype.draftParent = function() {
      return this.discussion() || this.author();
    };

    PollModel.prototype.poll = function() {
      return this;
    };

    PollModel.prototype.importance = function(now) {
      if (this.closedAt != null) {
        return Math.abs(this.closedAt - now);
      } else {
        return 0.0001 * Math.abs(this.closingAt - now);
      }
    };

    PollModel.prototype.defaultValues = function() {
      return {
        discussionId: null,
        title: '',
        details: '',
        closingAt: moment().add(3, 'days').startOf('hour'),
        pollOptionNames: [],
        pollOptionIds: [],
        customFields: {}
      };
    };

    PollModel.prototype.relationships = function() {
      this.belongsTo('author', {
        from: 'users'
      });
      this.belongsTo('discussion');
      this.belongsTo('group');
      this.belongsTo('guestGroup', {
        from: 'groups'
      });
      this.hasMany('pollOptions');
      this.hasMany('stances', {
        sortBy: 'createdAt',
        sortDesc: true
      });
      return this.hasMany('pollDidNotVotes');
    };

    PollModel.prototype.reactions = function() {
      return this.recordStore.reactions.find({
        reactableId: this.id,
        reactableType: "Poll"
      });
    };

    PollModel.prototype.announcementSize = function(action) {
      if (this.group() && this.isNew()) {
        return this.group().announcementRecipientsCount;
      }
      switch (action || this.notifyAction()) {
        case 'publish':
          return this.stancesCount + this.undecidedUserCount;
        case 'edit':
          return this.stancesCount;
        default:
          return 0;
      }
    };

    PollModel.prototype.memberIds = function() {
      return _.uniq(this.isActive() ? this.formalMemberIds().concat(this.guestIds()) : this.participantIds().concat(this.undecidedIds()));
    };

    PollModel.prototype.formalMemberIds = function() {
      if (this.group()) {
        return this.group().memberIds();
      } else {
        return [];
      }
    };

    PollModel.prototype.guestIds = function() {
      if (this.guestGroup()) {
        return this.guestGroup().memberIds();
      } else {
        return [];
      }
    };

    PollModel.prototype.participantIds = function() {
      return _.pluck(this.latestStances(), 'participantId');
    };

    PollModel.prototype.undecidedIds = function() {
      return _.pluck(this.pollDidNotVotes(), 'userId');
    };

    PollModel.prototype.members = function() {
      return this.recordStore.users.find(this.memberIds());
    };

    PollModel.prototype.participants = function() {
      return this.recordStore.users.find(this.participantIds());
    };

    PollModel.prototype.undecided = function() {
      return _.difference(this.members(), this.participants());
    };

    PollModel.prototype.membersCount = function() {
      return this.stancesCount + this.undecidedCount;
    };

    PollModel.prototype.percentVoted = function() {
      if (this.membersCount() === 0) {
        return 0;
      }
      return (100 * this.stancesCount / (this.membersCount())).toFixed(0);
    };

    PollModel.prototype.outcome = function() {
      return this.recordStore.outcomes.find({
        pollId: this.id,
        latest: true
      })[0];
    };

    PollModel.prototype.clearStaleStances = function() {
      var existing;
      existing = [];
      return _.each(this.latestStances('-createdAt'), function(stance) {
        if (_.contains(existing, stance.participant())) {
          return stance.latest = false;
        } else {
          return existing.push(stance.participant());
        }
      });
    };

    PollModel.prototype.latestStances = function(order, limit) {
      return _.slice(_.sortBy(this.recordStore.stances.find({
        pollId: this.id,
        latest: true
      }), order), 0, limit);
    };

    PollModel.prototype.cookedDetails = function() {
      return MentionLinkService.cook(this.mentionedUsernames, this.details);
    };

    PollModel.prototype.cookedDescription = function() {
      return this.cookedDetails();
    };

    PollModel.prototype.hasDescription = function() {
      return !!this.details;
    };

    PollModel.prototype.isActive = function() {
      return this.closedAt == null;
    };

    PollModel.prototype.isClosed = function() {
      return this.closedAt != null;
    };

    PollModel.prototype.goal = function() {
      return this.customFields.goal || this.membersCount().length;
    };

    PollModel.prototype.close = function() {
      return this.remote.postMember(this.key, 'close');
    };

    PollModel.prototype.addOptions = function() {
      return this.remote.postMember(this.key, 'add_options', {
        poll_option_names: this.pollOptionNames
      });
    };

    PollModel.prototype.inviteGuests = function() {
      this.processing = true;
      return this.remote.postMember(this.key, 'invite_guests', {
        emails: this.customFields.pending_emails.join(',')
      })["finally"]((function(_this) {
        return function() {
          return _this.processing = false;
        };
      })(this));
    };

    PollModel.prototype.toggleSubscription = function() {
      return this.remote.postMember(this.key, 'toggle_subscription');
    };

    PollModel.prototype.notifyAction = function() {
      if (this.isNew()) {
        return 'publish';
      } else {
        return 'edit';
      }
    };

    PollModel.prototype.removeOrphanOptions = function() {
      return _.each(this.pollOptions(), (function(_this) {
        return function(option) {
          if (!_.includes(_this.pollOptionNames, option.name)) {
            return option.remove();
          }
        };
      })(this));
    };

    return PollModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('PollOptionModel', function(BaseModel) {
  var PollOptionModel;
  return PollOptionModel = (function(superClass) {
    extend(PollOptionModel, superClass);

    function PollOptionModel() {
      return PollOptionModel.__super__.constructor.apply(this, arguments);
    }

    PollOptionModel.singular = 'pollOption';

    PollOptionModel.plural = 'pollOptions';

    PollOptionModel.indices = ['pollId'];

    PollOptionModel.prototype.relationships = function() {
      this.belongsTo('poll');
      return this.hasMany('stanceChoices');
    };

    PollOptionModel.prototype.stances = function() {
      return _.chain(this.stanceChoices()).map(function(stanceChoice) {
        return stanceChoice.stance();
      }).filter(function(stance) {
        return stance.latest;
      }).compact().value();
    };

    PollOptionModel.prototype.beforeRemove = function() {
      return _.each(this.stances(), function(stance) {
        return stance.remove();
      });
    };

    return PollOptionModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('PollOptionRecordsInterface', function(BaseRecordsInterface, PollOptionModel) {
  var PollOptionRecordsInterface;
  return PollOptionRecordsInterface = (function(superClass) {
    extend(PollOptionRecordsInterface, superClass);

    function PollOptionRecordsInterface() {
      return PollOptionRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    PollOptionRecordsInterface.prototype.model = PollOptionModel;

    return PollOptionRecordsInterface;

  })(BaseRecordsInterface);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('PollRecordsInterface', function(BaseRecordsInterface, PollModel) {
  var PollRecordsInterface;
  return PollRecordsInterface = (function(superClass) {
    extend(PollRecordsInterface, superClass);

    function PollRecordsInterface() {
      return PollRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    PollRecordsInterface.prototype.model = PollModel;

    PollRecordsInterface.prototype.fetchFor = function(model, options) {
      if (options == null) {
        options = {};
      }
      options[model.constructor.singular + "_key"] = model.key;
      return this.search(options);
    };

    PollRecordsInterface.prototype.search = function(options) {
      if (options == null) {
        options = {};
      }
      return this.fetch({
        path: 'search',
        params: options
      });
    };

    PollRecordsInterface.prototype.searchResultsCount = function(options) {
      if (options == null) {
        options = {};
      }
      return this.fetch({
        path: 'search_results_count',
        params: options
      });
    };

    PollRecordsInterface.prototype.fetchByGroup = function(groupKey, options) {
      if (options == null) {
        options = {};
      }
      return this.search(_.merge(options, {
        group_key: groupKey
      }));
    };

    return PollRecordsInterface;

  })(BaseRecordsInterface);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('ReactionModel', function(BaseModel, AppConfig) {
  var ReactionModel;
  return ReactionModel = (function(superClass) {
    extend(ReactionModel, superClass);

    function ReactionModel() {
      return ReactionModel.__super__.constructor.apply(this, arguments);
    }

    ReactionModel.singular = 'reaction';

    ReactionModel.plural = 'reactions';

    ReactionModel.indices = ['userId', 'reactableId'];

    ReactionModel.serializableAttributes = AppConfig.permittedParams.reaction;

    ReactionModel.prototype.relationships = function() {
      return this.belongsTo('user');
    };

    ReactionModel.prototype.model = function() {
      return this.recordStore[(this.reactableType.toLowerCase()) + "s"].find(this.reactableId);
    };

    return ReactionModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('ReactionRecordsInterface', function(BaseRecordsInterface, ReactionModel) {
  var ReactionRecordsInterface;
  return ReactionRecordsInterface = (function(superClass) {
    extend(ReactionRecordsInterface, superClass);

    function ReactionRecordsInterface() {
      return ReactionRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    ReactionRecordsInterface.prototype.model = ReactionModel;

    return ReactionRecordsInterface;

  })(BaseRecordsInterface);
});

angular.module('loomioApp').factory('RecordStore', function() {
  return AngularRecordStore.RecordStoreFn();
});

angular.module('loomioApp').factory('Records', function(RecordStore, RecordStoreDatabaseName, CommentRecordsInterface, DiscussionRecordsInterface, EventRecordsInterface, GroupRecordsInterface, MembershipRecordsInterface, MembershipRequestRecordsInterface, NotificationRecordsInterface, UserRecordsInterface, SearchResultRecordsInterface, ContactRecordsInterface, InvitationRecordsInterface, InvitationFormRecordsInterface, VersionRecordsInterface, DraftRecordsInterface, TranslationRecordsInterface, OauthApplicationRecordsInterface, SessionRecordsInterface, RegistrationRecordsInterface, PollRecordsInterface, PollOptionRecordsInterface, StanceRecordsInterface, StanceChoiceRecordsInterface, OutcomeRecordsInterface, PollDidNotVoteRecordsInterface, IdentityRecordsInterface, ContactMessageRecordsInterface, GroupIdentityRecordsInterface, ReactionRecordsInterface, ContactRequestRecordsInterface, DocumentRecordsInterface) {
  var db, recordStore;
  db = new loki(RecordStoreDatabaseName);
  recordStore = new RecordStore(db);
  recordStore.addRecordsInterface(CommentRecordsInterface);
  recordStore.addRecordsInterface(DiscussionRecordsInterface);
  recordStore.addRecordsInterface(EventRecordsInterface);
  recordStore.addRecordsInterface(GroupRecordsInterface);
  recordStore.addRecordsInterface(MembershipRecordsInterface);
  recordStore.addRecordsInterface(MembershipRequestRecordsInterface);
  recordStore.addRecordsInterface(NotificationRecordsInterface);
  recordStore.addRecordsInterface(UserRecordsInterface);
  recordStore.addRecordsInterface(SearchResultRecordsInterface);
  recordStore.addRecordsInterface(ContactRecordsInterface);
  recordStore.addRecordsInterface(InvitationRecordsInterface);
  recordStore.addRecordsInterface(InvitationFormRecordsInterface);
  recordStore.addRecordsInterface(TranslationRecordsInterface);
  recordStore.addRecordsInterface(VersionRecordsInterface);
  recordStore.addRecordsInterface(DraftRecordsInterface);
  recordStore.addRecordsInterface(OauthApplicationRecordsInterface);
  recordStore.addRecordsInterface(SessionRecordsInterface);
  recordStore.addRecordsInterface(RegistrationRecordsInterface);
  recordStore.addRecordsInterface(PollRecordsInterface);
  recordStore.addRecordsInterface(PollOptionRecordsInterface);
  recordStore.addRecordsInterface(StanceRecordsInterface);
  recordStore.addRecordsInterface(StanceChoiceRecordsInterface);
  recordStore.addRecordsInterface(OutcomeRecordsInterface);
  recordStore.addRecordsInterface(PollDidNotVoteRecordsInterface);
  recordStore.addRecordsInterface(IdentityRecordsInterface);
  recordStore.addRecordsInterface(ContactMessageRecordsInterface);
  recordStore.addRecordsInterface(GroupIdentityRecordsInterface);
  recordStore.addRecordsInterface(ReactionRecordsInterface);
  recordStore.addRecordsInterface(ContactRequestRecordsInterface);
  recordStore.addRecordsInterface(DocumentRecordsInterface);
  return recordStore;
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('RegistrationModel', function(BaseModel) {
  var RegistrationModel;
  return RegistrationModel = (function(superClass) {
    extend(RegistrationModel, superClass);

    function RegistrationModel() {
      return RegistrationModel.__super__.constructor.apply(this, arguments);
    }

    RegistrationModel.singular = 'registration';

    RegistrationModel.plural = 'registrations';

    RegistrationModel.serializableAttributes = ['name', 'email', 'password', 'passwordConfirmation', 'recaptcha'];

    RegistrationModel.serializationRoot = 'user';

    return RegistrationModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('RegistrationRecordsInterface', function(BaseRecordsInterface, RegistrationModel) {
  var RegistrationRecordsInterface;
  return RegistrationRecordsInterface = (function(superClass) {
    extend(RegistrationRecordsInterface, superClass);

    function RegistrationRecordsInterface() {
      return RegistrationRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    RegistrationRecordsInterface.prototype.model = RegistrationModel;

    return RegistrationRecordsInterface;

  })(BaseRecordsInterface);
});

angular.module('loomioApp').factory('RestfulClient', function($http, $upload) {
  return AngularRecordStore.RestfulClientFn($http, $upload);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('SearchResultModel', function(BaseModel) {
  var SearchResultModel;
  return SearchResultModel = (function(superClass) {
    extend(SearchResultModel, superClass);

    function SearchResultModel() {
      return SearchResultModel.__super__.constructor.apply(this, arguments);
    }

    SearchResultModel.singular = 'searchResult';

    SearchResultModel.plural = 'searchResults';

    SearchResultModel.apiEndPoint = 'search';

    return SearchResultModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('SearchResultRecordsInterface', function(BaseRecordsInterface, SearchResultModel) {
  var SearchResultRecordsInterface;
  return SearchResultRecordsInterface = (function(superClass) {
    extend(SearchResultRecordsInterface, superClass);

    function SearchResultRecordsInterface() {
      return SearchResultRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    SearchResultRecordsInterface.prototype.model = SearchResultModel;

    SearchResultRecordsInterface.prototype.fetchByFragment = function(fragment) {
      return this.fetch({
        params: {
          q: fragment,
          per: 5
        }
      });
    };

    return SearchResultRecordsInterface;

  })(BaseRecordsInterface);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('SessionModel', function(BaseModel) {
  var SessionModel;
  return SessionModel = (function(superClass) {
    extend(SessionModel, superClass);

    function SessionModel() {
      return SessionModel.__super__.constructor.apply(this, arguments);
    }

    SessionModel.singular = 'session';

    SessionModel.plural = 'sessions';

    SessionModel.serializableAttributes = ['type', 'email', 'password', 'rememberMe'];

    SessionModel.serializationRoot = 'user';

    return SessionModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('SessionRecordsInterface', function(BaseRecordsInterface, SessionModel) {
  var SessionRecordsInterface;
  return SessionRecordsInterface = (function(superClass) {
    extend(SessionRecordsInterface, superClass);

    function SessionRecordsInterface() {
      return SessionRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    SessionRecordsInterface.prototype.model = SessionModel;

    return SessionRecordsInterface;

  })(BaseRecordsInterface);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('StanceChoiceModel', function(BaseModel, AppConfig) {
  var StanceChoiceModel;
  return StanceChoiceModel = (function(superClass) {
    extend(StanceChoiceModel, superClass);

    function StanceChoiceModel() {
      return StanceChoiceModel.__super__.constructor.apply(this, arguments);
    }

    StanceChoiceModel.singular = 'stanceChoice';

    StanceChoiceModel.plural = 'stanceChoices';

    StanceChoiceModel.indices = ['pollOptionId', 'stanceId'];

    StanceChoiceModel.serializableAttributes = AppConfig.permittedParams.stanceChoices;

    StanceChoiceModel.prototype.defaultValues = function() {
      return {
        score: 1
      };
    };

    StanceChoiceModel.prototype.relationships = function() {
      this.belongsTo('pollOption');
      return this.belongsTo('stance');
    };

    StanceChoiceModel.prototype.poll = function() {
      if (this.stance()) {
        return this.stance().poll();
      }
    };

    return StanceChoiceModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('StanceChoiceRecordsInterface', function(BaseRecordsInterface, StanceChoiceModel) {
  var StanceChoiceRecordsInterface;
  return StanceChoiceRecordsInterface = (function(superClass) {
    extend(StanceChoiceRecordsInterface, superClass);

    function StanceChoiceRecordsInterface() {
      return StanceChoiceRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    StanceChoiceRecordsInterface.prototype.model = StanceChoiceModel;

    return StanceChoiceRecordsInterface;

  })(BaseRecordsInterface);
});

var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('StanceModel', function(BaseModel, HasDrafts, AppConfig, MentionLinkService) {
  var StanceModel;
  return StanceModel = (function(superClass) {
    extend(StanceModel, superClass);

    function StanceModel() {
      this.verify = bind(this.verify, this);
      return StanceModel.__super__.constructor.apply(this, arguments);
    }

    StanceModel.singular = 'stance';

    StanceModel.plural = 'stances';

    StanceModel.indices = ['pollId'];

    StanceModel.serializableAttributes = AppConfig.permittedParams.stance;

    StanceModel.draftParent = 'poll';

    StanceModel.draftPayloadAttributes = ['reason'];

    StanceModel.prototype.afterConstruction = function() {
      return HasDrafts.apply(this);
    };

    StanceModel.prototype.defaultValues = function() {
      return {
        reason: '',
        visitorAttributes: {}
      };
    };

    StanceModel.prototype.relationships = function() {
      this.belongsTo('poll');
      this.hasMany('stanceChoices');
      return this.belongsTo('participant', {
        from: 'users'
      });
    };

    StanceModel.prototype.reactions = function() {
      return this.recordStore.reactions.find({
        reactableId: this.id,
        reactableType: "Stance"
      });
    };

    StanceModel.prototype.author = function() {
      return this.participant();
    };

    StanceModel.prototype.stanceChoice = function() {
      return _.first(this.stanceChoices());
    };

    StanceModel.prototype.pollOption = function() {
      if (this.stanceChoice()) {
        return this.stanceChoice().pollOption();
      }
    };

    StanceModel.prototype.pollOptionId = function() {
      return (this.pollOption() || {}).id;
    };

    StanceModel.prototype.pollOptions = function() {
      return this.recordStore.pollOptions.find(this.pollOptionIds());
    };

    StanceModel.prototype.stanceChoiceNames = function() {
      return _.pluck(this.pollOptions(), 'name');
    };

    StanceModel.prototype.pollOptionIds = function() {
      return _.pluck(this.stanceChoices(), 'pollOptionId');
    };

    StanceModel.prototype.choose = function(optionIds) {
      _.each(this.recordStore.stanceChoices.find({
        stanceId: this.id
      }), function(stanceChoice) {
        return stanceChoice.remove();
      });
      _.each(_.flatten([optionIds]), (function(_this) {
        return function(optionId) {
          return _this.recordStore.stanceChoices.create({
            pollOptionId: parseInt(optionId),
            stanceId: _this.id
          });
        };
      })(this));
      return this;
    };

    StanceModel.prototype.votedFor = function(option) {
      return _.contains(_.pluck(this.pollOptions(), 'id'), option.id);
    };

    StanceModel.prototype.verify = function() {
      return this.remote.postMember(this.id, 'verify').then((function(_this) {
        return function() {
          return _this.unverified = false;
        };
      })(this));
    };

    return StanceModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('StanceRecordsInterface', function(AppConfig, BaseRecordsInterface, StanceModel) {
  var StanceRecordsInterface;
  return StanceRecordsInterface = (function(superClass) {
    extend(StanceRecordsInterface, superClass);

    function StanceRecordsInterface() {
      return StanceRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    StanceRecordsInterface.prototype.model = StanceModel;

    StanceRecordsInterface.prototype.fetchMyStances = function(groupKey, options) {
      if (options == null) {
        options = {};
      }
      options['group_id'] = groupKey;
      return this.fetch({
        path: 'my_stances',
        params: options
      });
    };

    StanceRecordsInterface.prototype.fetchMyStancesByDiscussion = function(discussionKey, options) {
      if (options == null) {
        options = {};
      }
      options['discussion_id'] = discussionKey;
      return this.fetch({
        path: 'my_stances',
        params: options
      });
    };

    return StanceRecordsInterface;

  })(BaseRecordsInterface);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('TranslationModel', function(BaseModel) {
  var TranslationModel;
  return TranslationModel = (function(superClass) {
    extend(TranslationModel, superClass);

    function TranslationModel() {
      return TranslationModel.__super__.constructor.apply(this, arguments);
    }

    TranslationModel.singular = 'translation';

    TranslationModel.plural = 'translations';

    TranslationModel.indices = ['id'];

    return TranslationModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('TranslationRecordsInterface', function(BaseRecordsInterface, TranslationModel) {
  var TranslationRecordsInterface;
  return TranslationRecordsInterface = (function(superClass) {
    extend(TranslationRecordsInterface, superClass);

    function TranslationRecordsInterface() {
      return TranslationRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    TranslationRecordsInterface.prototype.model = TranslationModel;

    TranslationRecordsInterface.prototype.fetchTranslation = function(translatable, locale) {
      return this.fetch({
        path: 'inline',
        params: {
          model: translatable.constructor.singular,
          id: translatable.id,
          to: locale
        }
      });
    };

    return TranslationRecordsInterface;

  })(BaseRecordsInterface);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('UserModel', function(BaseModel, AppConfig) {
  var UserModel;
  return UserModel = (function(superClass) {
    extend(UserModel, superClass);

    function UserModel() {
      return UserModel.__super__.constructor.apply(this, arguments);
    }

    UserModel.singular = 'user';

    UserModel.plural = 'users';

    UserModel.apiEndPoint = 'profile';

    UserModel.serializableAttributes = AppConfig.permittedParams.user;

    UserModel.prototype.relationships = function() {
      this.hasMany('memberships');
      this.hasMany('notifications');
      this.hasMany('contacts');
      this.hasMany('versions');
      this.hasMany('identities');
      return this.hasMany('reactions');
    };

    UserModel.prototype.detectedLocation = function() {
      return _.compact([this.city, this.region, this.country]);
    };

    UserModel.prototype.localeName = function() {
      return (_.find(AppConfig.locales, (function(_this) {
        return function(h) {
          return h.key === _this.locale;
        };
      })(this)) || {}).name;
    };

    UserModel.prototype.identityFor = function(type) {
      return _.detect(this.identities(), function(i) {
        return i.identityType === type;
      });
    };

    UserModel.prototype.membershipFor = function(group) {
      return _.first(this.recordStore.memberships.find({
        groupId: group.id,
        userId: this.id
      }));
    };

    UserModel.prototype.adminMemberships = function() {
      return _.filter(this.memberships(), function(m) {
        return m.admin;
      });
    };

    UserModel.prototype.groupIds = function() {
      return _.map(this.memberships(), 'groupId');
    };

    UserModel.prototype.groups = function() {
      var groups;
      groups = _.filter(this.recordStore.groups.find({
        id: {
          $in: this.groupIds()
        }
      }), function(group) {
        return !group.isArchived();
      });
      return _.sortBy(groups, 'fullName');
    };

    UserModel.prototype.adminGroups = function() {
      return _.invoke(this.adminMemberships(), 'group');
    };

    UserModel.prototype.adminGroupIds = function() {
      return _.invoke(this.adminMemberships(), 'groupId');
    };

    UserModel.prototype.parentGroups = function() {
      return _.filter(this.groups(), function(group) {
        return group.isParent();
      });
    };

    UserModel.prototype.inboxGroups = function() {
      return _.flatten([this.parentGroups(), this.orphanSubgroups()]);
    };

    UserModel.prototype.hasAnyGroups = function() {
      return this.groups().length > 0;
    };

    UserModel.prototype.hasMultipleGroups = function() {
      return this.groups().length > 1;
    };

    UserModel.prototype.allThreads = function() {
      return _.flatten(_.map(this.groups(), function(group) {
        return group.discussions();
      }));
    };

    UserModel.prototype.orphanSubgroups = function() {
      return _.filter(this.groups(), (function(_this) {
        return function(group) {
          return group.isSubgroup() && !_this.isMemberOf(group.parent());
        };
      })(this));
    };

    UserModel.prototype.orphanParents = function() {
      return _.uniq(_.map(this.orphanSubgroups(), (function(_this) {
        return function(group) {
          return group.parent();
        };
      })(this)));
    };

    UserModel.prototype.isAuthorOf = function(object) {
      return this.id === object.authorId;
    };

    UserModel.prototype.isAdminOf = function(group) {
      return _.contains(group.adminIds(), this.id);
    };

    UserModel.prototype.isMemberOf = function(group) {
      return _.contains(group.memberIds(), this.id);
    };

    UserModel.prototype.firstName = function() {
      if (this.name) {
        return _.first(this.name.split(' '));
      }
    };

    UserModel.prototype.lastName = function() {
      return this.name.split(' ').slice(1).join(' ');
    };

    UserModel.prototype.saveVolume = function(volume, applyToAll) {
      return this.remote.post('set_volume', {
        volume: volume,
        apply_to_all: applyToAll,
        unsubscribe_token: this.unsubscribeToken
      }).then((function(_this) {
        return function() {
          if (!applyToAll) {
            return;
          }
          _.each(_this.allThreads(), function(thread) {
            return thread.update({
              discussionReaderVolume: null
            });
          });
          return _.each(_this.memberships(), function(membership) {
            return membership.update({
              volume: volume
            });
          });
        };
      })(this));
    };

    UserModel.prototype.remind = function(model) {
      var obj;
      return this.remote.postMember(this.id, 'remind', (
        obj = {},
        obj[model.constructor.singular + "_id"] = model.id,
        obj
      )).then((function(_this) {
        return function() {
          return _this.reminded = true;
        };
      })(this));
    };

    UserModel.prototype.hasExperienced = function(key, group) {
      if (group && this.isMemberOf(group)) {
        return this.membershipFor(group).experiences[key];
      } else {
        return this.experiences[key];
      }
    };

    UserModel.prototype.hasProfilePhoto = function() {
      return this.avatarKind !== 'initials';
    };

    UserModel.prototype.belongsToPayingGroup = function() {
      return _.any(this.groups(), function(group) {
        return group.subscriptionKind === 'paid';
      });
    };

    return UserModel;

  })(BaseModel);
});

var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('UserRecordsInterface', function(BaseRecordsInterface, UserModel, RestfulClient) {
  var UserRecordsInterface;
  return UserRecordsInterface = (function(superClass) {
    extend(UserRecordsInterface, superClass);

    function UserRecordsInterface() {
      this.saveExperience = bind(this.saveExperience, this);
      this.deactivate = bind(this.deactivate, this);
      this.changePassword = bind(this.changePassword, this);
      this.uploadAvatar = bind(this.uploadAvatar, this);
      this.updateProfile = bind(this.updateProfile, this);
      return UserRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    UserRecordsInterface.prototype.model = UserModel;

    UserRecordsInterface.prototype.updateProfile = function(user) {
      return this.remote.post('update_profile', _.merge(user.serialize(), {
        unsubscribe_token: user.unsubscribeToken
      }));
    };

    UserRecordsInterface.prototype.uploadAvatar = function(file) {
      return this.remote.upload('upload_avatar', file);
    };

    UserRecordsInterface.prototype.changePassword = function(user) {
      return this.remote.post('change_password', user.serialize());
    };

    UserRecordsInterface.prototype.deactivate = function(user) {
      return this.remote.post('deactivate', user.serialize());
    };

    UserRecordsInterface.prototype.saveExperience = function(experience) {
      return this.remote.post('save_experience', {
        experience: experience
      });
    };

    UserRecordsInterface.prototype.emailStatus = function(email) {
      return this.fetch({
        path: 'email_status',
        params: {
          email: email
        }
      });
    };

    return UserRecordsInterface;

  })(BaseRecordsInterface);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('VersionModel', function(BaseModel) {
  var VersionModel;
  return VersionModel = (function(superClass) {
    extend(VersionModel, superClass);

    function VersionModel() {
      return VersionModel.__super__.constructor.apply(this, arguments);
    }

    VersionModel.singular = 'version';

    VersionModel.plural = 'versions';

    VersionModel.indices = ['discussionId'];

    VersionModel.prototype.relationships = function() {
      this.belongsTo('discussion');
      this.belongsTo('comment');
      this.belongsTo('poll');
      return this.belongsTo('author', {
        from: 'users',
        by: 'whodunnit'
      });
    };

    VersionModel.prototype.editedAttributeNames = function() {
      return _.filter(_.keys(this.changes).sort(), function(key) {
        return _.include(['title', 'name', 'description', 'closing_at', 'private', 'document_ids'], key);
      });
    };

    VersionModel.prototype.attributeEdited = function(name) {
      return _.include(_.keys(this.changes), name);
    };

    VersionModel.prototype.model = function() {
      return this.recordStore[(this.itemType.toLowerCase()) + "s"].find(this.itemId);
    };

    VersionModel.prototype.isCurrent = function() {
      return this.id === _.last(this.model().versions())['id'];
    };

    VersionModel.prototype.isOriginal = function() {
      return this.id === _.first(this.model().versions())['id'];
    };

    VersionModel.prototype.authorOrEditorName = function() {
      if (this.isOriginal()) {
        return this.model().authorName();
      } else {
        return this.author().name;
      }
    };

    return VersionModel;

  })(BaseModel);
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('loomioApp').factory('VersionRecordsInterface', function(BaseRecordsInterface, VersionModel) {
  var VersionRecordsInterface;
  return VersionRecordsInterface = (function(superClass) {
    extend(VersionRecordsInterface, superClass);

    function VersionRecordsInterface() {
      return VersionRecordsInterface.__super__.constructor.apply(this, arguments);
    }

    VersionRecordsInterface.prototype.model = VersionModel;

    VersionRecordsInterface.prototype.fetchByDiscussion = function(discussionKey, options) {
      if (options == null) {
        options = {};
      }
      return this.fetch({
        params: {
          model: 'discussion',
          discussion_id: discussionKey
        }
      });
    };

    VersionRecordsInterface.prototype.fetchByComment = function(commentId, options) {
      if (options == null) {
        options = {};
      }
      return this.fetch({
        params: {
          model: 'comment',
          comment_id: commentId
        }
      });
    };

    return VersionRecordsInterface;

  })(BaseRecordsInterface);
});

angular.module('loomioApp').controller('DocumentsPageController', function($routeParams, $rootScope, Records, AbilityService, LoadingService, ModalService, DocumentModal, ConfirmModal) {
  $rootScope.$broadcast('currentComponent', {
    page: 'documentsPage'
  });
  this.fetchDocuments = (function(_this) {
    return function() {
      return Records.documents.fetchByGroup(_this.group, _this.fragment);
    };
  })(this);
  LoadingService.applyLoadingFunction(this, 'fetchDocuments');
  this.documents = function(filter) {
    return _.filter(this.group.allDocuments(), (function(_this) {
      return function(doc) {
        return _.isEmpty(_this.fragment) || doc.title.match(RegExp("" + _this.fragment, "i"));
      };
    })(this));
  };
  this.hasDocuments = function() {
    return _.any(this.documents());
  };
  this.addDocument = function() {
    return ModalService.open(DocumentModal, {
      doc: (function(_this) {
        return function() {
          return Records.documents.build({
            modelId: _this.group.id,
            modelType: 'Group'
          });
        };
      })(this)
    });
  };
  this.canAdministerGroup = function() {
    return AbilityService.canAdministerGroup(this.group);
  };
  Records.groups.findOrFetchById($routeParams.key).then((function(_this) {
    return function(group) {
      _this.group = group;
      return _this.fetchDocuments();
    };
  })(this), function(error) {
    return $rootScope.$broadcast('pageError', error);
  });
});

angular.module('loomioApp').controller('EmailSettingsPageController', function($rootScope, $translate, Records, AbilityService, FormService, Session, $location, ModalService, ChangeVolumeForm) {
  $rootScope.$broadcast('currentComponent', {
    titleKey: 'email_settings_page.header',
    page: 'emailSettingsPage'
  });
  this.init = (function(_this) {
    return function() {
      if (!(AbilityService.isLoggedIn() || (Session.user().restricted != null))) {
        return;
      }
      _this.user = Session.user().clone();
      return $translate.use(_this.user.locale);
    };
  })(this);
  this.init();
  this.groupVolume = function(group) {
    return group.membershipFor(Session.user()).volume;
  };
  this.defaultSettingsDescription = function() {
    return "email_settings_page.default_settings." + (Session.user().defaultMembershipVolume) + "_description";
  };
  this.changeDefaultMembershipVolume = function() {
    return ModalService.open(ChangeVolumeForm, {
      model: (function(_this) {
        return function() {
          return Session.user();
        };
      })(this)
    });
  };
  this.editSpecificGroupVolume = function(group) {
    return ModalService.open(ChangeVolumeForm, {
      model: (function(_this) {
        return function() {
          return group.membershipFor(Session.user());
        };
      })(this)
    });
  };
  this.submit = FormService.submit(this, this.user, {
    submitFn: Records.users.updateProfile,
    flashSuccess: 'email_settings_page.messages.updated',
    successCallback: function() {
      if (AbilityService.isLoggedIn()) {
        return $location.path('/dashboard');
      }
    }
  });
});

angular.module('loomioApp').directive('emojiPicker', function($translate, $timeout, EmojiService, KeyEventService) {
  return {
    scope: {
      reaction: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/emoji_picker/emoji_picker.html',
    controller: function($scope) {
      $scope.translate = EmojiService.translate;
      $scope.render = EmojiService.render;
      $scope.imgSrcFor = EmojiService.imgSrcFor;
      $scope.search = function(term) {
        $scope.hovered = {};
        return $scope.source = term ? _.take(_.filter(EmojiService.source, function(emoji) {
          return emoji.match(RegExp("^:" + term, "i"));
        }), 20) : EmojiService.defaults;
      };
      $scope.search();
      $scope.toggleMenu = function($mdMenu, $event) {
        $mdMenu.open($event);
        $scope.search();
        if (!$scope.reaction) {
          return $timeout(function() {
            return document.querySelector('.emoji-picker__search').focus();
          });
        }
      };
      $scope.select = function(emoji) {
        return $scope.$emit('emojiSelected', emoji);
      };
      return $scope.noEmojisFound = function() {
        return $scope.source.length === 0;
      };
    }
  };
});

angular.module('loomioApp').directive('errorPage', function() {
  return {
    scope: {
      error: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/error_page/error_page.html',
    replace: true
  };
});

angular.module('loomioApp').controller('ExplorePageController', function(Records, $rootScope, $timeout, AppConfig, LoadingService) {
  $rootScope.$broadcast('currentComponent', {
    titleKey: 'explore_page.header',
    page: 'explorePage'
  });
  this.groupIds = [];
  this.resultsCount = 0;
  this.perPage = AppConfig.pageSize.exploreGroups;
  this.canLoadMoreGroups = true;
  this.query = "";
  $timeout(function() {
    return document.querySelector('#search-field').focus();
  });
  this.groups = (function(_this) {
    return function() {
      return Records.groups.find(_this.groupIds);
    };
  })(this);
  this.handleSearchResults = (function(_this) {
    return function(response) {
      Records.groups.getExploreResultsCount(_this.query).then(function(data) {
        return _this.resultsCount = data.count;
      });
      _this.groupIds = _this.groupIds.concat(_.pluck(response.groups, 'id'));
      return _this.canLoadMoreGroups = (response.groups || []).length === _this.perPage;
    };
  })(this);
  this.search = (function(_this) {
    return function() {
      _this.groupIds = [];
      return Records.groups.fetchExploreGroups(_this.query, {
        per: _this.perPage
      }).then(_this.handleSearchResults);
    };
  })(this);
  this.loadMore = (function(_this) {
    return function() {
      return Records.groups.fetchExploreGroups(_this.query, {
        from: _this.groupIds.length,
        per: _this.perPage
      }).then(_this.handleSearchResults);
    };
  })(this);
  LoadingService.applyLoadingFunction(this, 'search');
  this.search();
  this.groupCover = function(group) {
    return {
      'background-image': "url(" + (group.coverUrl('small')) + ")"
    };
  };
  this.groupDescription = function(group) {
    if (group.description) {
      return _.trunc(group.description, 100);
    }
  };
  this.showMessage = function() {
    return !this.searching && this.query && this.groups().length > 0;
  };
  this.searchResultsMessage = function() {
    if (this.groups().length === 1) {
      return 'explore_page.single_search_result';
    } else {
      return 'explore_page.multiple_search_results';
    }
  };
  this.noResultsFound = function() {
    return !this.searching && (this.groups().length < this.perPage || !this.canLoadMoreGroups);
  };
});

angular.module('loomioApp').directive('flash', function(AppConfig) {
  return {
    restrict: 'E',
    templateUrl: 'generated/components/flash/flash.html',
    replace: true,
    controllerAs: 'flash',
    controller: function($scope, $interval, FlashService) {
      $scope.pendingDismiss = null;
      $scope.$on('flashMessage', (function(_this) {
        return function(event, flash) {
          $scope.flash = _.merge(flash, {
            visible: true
          });
          if ($scope.loading()) {
            $scope.flash.message = $scope.flash.message || 'common.action.loading';
          }
          if ($scope.pendingDismiss != null) {
            $interval.cancel($scope.pendingDismiss);
          }
          return $scope.pendingDismiss = $interval($scope.dismiss, flash.duration, 1);
        };
      })(this));
      $scope.$on('dismissFlash', $scope.dismiss);
      $scope.loading = function() {
        return $scope.flash.level === 'loading';
      };
      $scope.display = function() {
        return $scope.flash.visible;
      };
      $scope.dismiss = function() {
        return $scope.flash.visible = false;
      };
      $scope.ariaLive = function() {
        if ($scope.loading()) {
          return 'polite';
        } else {
          return 'assertive';
        }
      };
      if (AppConfig.flash.success != null) {
        FlashService.success(AppConfig.flash.success);
      }
      if (AppConfig.flash.notice != null) {
        FlashService.info(AppConfig.flash.notice);
      }
      if (AppConfig.flash.warning != null) {
        FlashService.warning(AppConfig.flash.warning);
      }
      if (AppConfig.flash.error != null) {
        FlashService.error(AppConfig.flash.error);
      }
    }
  };
});

angular.module('loomioApp').factory('FlashService', function($rootScope, AppConfig) {
  var FlashService;
  return new (FlashService = (function() {
    var createFlashLevel;

    function FlashService() {}

    createFlashLevel = function(level, duration) {
      return function(translateKey, translateValues, actionKey, actionFn) {
        return $rootScope.$broadcast('flashMessage', {
          level: level,
          duration: duration || AppConfig.flashTimeout.short,
          message: translateKey,
          options: translateValues,
          action: actionKey,
          actionFn: actionFn
        });
      };
    };

    FlashService.prototype.success = createFlashLevel('success');

    FlashService.prototype.info = createFlashLevel('info');

    FlashService.prototype.warning = createFlashLevel('warning');

    FlashService.prototype.error = createFlashLevel('error');

    FlashService.prototype.loading = createFlashLevel('loading', AppConfig.flashTimeout.long);

    FlashService.prototype.update = createFlashLevel('update', AppConfig.flashTimeout.long);

    FlashService.prototype.dismiss = createFlashLevel('loading', 1);

    return FlashService;

  })());
});

angular.module('loomioApp').directive('groupAvatar', function() {
  return {
    scope: {
      group: '=',
      size: '@?'
    },
    restrict: 'E',
    templateUrl: 'generated/components/group_avatar/group_avatar.html',
    replace: true,
    controller: function($scope) {
      var sizes;
      sizes = ['small', 'medium', 'large'];
      if (!_.contains(sizes, $scope.size)) {
        return $scope.size = 'small';
      }
    }
  };
});

angular.module('loomioApp').controller('GroupPageController', function($rootScope, $location, $routeParams, $scope, Records, Session, MessageChannelService, AbilityService, AppConfig, LmoUrlService, PaginationService, PollService, ModalService, InstallSlackModal) {
  $rootScope.$broadcast('currentComponent', {
    page: 'groupPage',
    key: $routeParams.key,
    skipScroll: true
  });
  this.launchers = [];
  this.addLauncher = (function(_this) {
    return function(action, condition, opts) {
      if (condition == null) {
        condition = (function() {
          return true;
        });
      }
      if (opts == null) {
        opts = {};
      }
      return _this.launchers.push({
        priority: opts.priority || 9999,
        action: action,
        condition: condition,
        allowContinue: opts.allowContinue
      });
    };
  })(this);
  this.addLauncher((function(_this) {
    return function() {
      return ModalService.open(InstallSlackModal, {
        group: function() {
          return _this.group;
        },
        requirePaidPlan: function() {
          return true;
        }
      });
    };
  })(this), function() {
    return $location.search().install_slack;
  });
  this.performLaunch = function() {
    return this.launchers.sort(function(a, b) {
      return a.priority - b.priority;
    }).map((function(_this) {
      return function(launcher) {
        if ((typeof launcher.action !== 'function') || _this.launched) {
          return;
        }
        if (launcher.condition()) {
          launcher.action();
          if (!launcher.allowContinue) {
            return _this.launched = true;
          }
        }
      };
    })(this));
  };
  $routeParams.key = $routeParams.key.split('-')[0];
  Records.groups.findOrFetchById($routeParams.key).then((function(_this) {
    return function(group) {
      return _this.init(group);
    };
  })(this), function(error) {
    return $rootScope.$broadcast('pageError', error);
  });
  this.init = (function(_this) {
    return function(group) {
      var maxDiscussions;
      _this.group = group;
      MessageChannelService.subscribeToGroup(_this.group);
      if (AbilityService.canCreateContentFor(_this.group)) {
        Records.drafts.fetchFor(_this.group);
      }
      maxDiscussions = AbilityService.canViewPrivateContent(_this.group) ? _this.group.discussionsCount : _this.group.publicDiscussionsCount;
      _this.pageWindow = PaginationService.windowFor({
        current: parseInt($location.search().from || 0),
        min: 0,
        max: maxDiscussions,
        pageType: 'groupThreads'
      });
      $rootScope.$broadcast('currentComponent', {
        title: _this.group.fullName,
        page: 'groupPage',
        group: _this.group,
        key: _this.group.key,
        links: {
          canonical: LmoUrlService.group(_this.group, {}, {
            absolute: true
          }),
          rss: !_this.group.privacyIsSecret() ? LmoUrlService.group(_this.group, {}, {
            absolute: true,
            ext: 'xml'
          }) : void 0,
          prev: _this.pageWindow.prev != null ? LmoUrlService.group(_this.group, {
            from: _this.pageWindow.prev
          }) : void 0,
          next: _this.pageWindow.next != null ? LmoUrlService.group(_this.group, {
            from: _this.pageWindow.next
          }) : void 0
        }
      });
      return _this.performLaunch();
    };
  })(this);
  this.canManageMembershipRequests = function() {
    return AbilityService.canManageMembershipRequests(this.group);
  };
  this.canUploadPhotos = function() {
    return AbilityService.canAdministerGroup(this.group);
  };
  this.openUploadCoverForm = function() {
    return this.openModal.open(CoverPhotoForm, {
      group: (function(_this) {
        return function() {
          return _this.group;
        };
      })(this)
    });
  };
  this.openUploadLogoForm = function() {
    return this.openModal(LogoPhotoForm, {
      group: (function(_this) {
        return function() {
          return _this.group;
        };
      })(this)
    });
  };
  this.openModal = function(modal, resolve) {
    return ModalService.open(modal, resolve);
  };
  this.showPreviousPolls = function() {
    return AbilityService.canViewPreviousPolls(this.group);
  };
});

angular.module('loomioApp').directive('h1', function() {
  return {
    restrict: 'E',
    link: function(scope, elem, attrs) {
      return elem.attr('tabindex', 0);
    }
  };
});

angular.module('loomioApp').directive('helpBubble', function() {
  return {
    scope: {
      helptext: '@'
    },
    restrict: 'E',
    templateUrl: 'generated/components/help_bubble/help_bubble.html',
    replace: true
  };
});

angular.module('loomioApp').directive('i', function() {
  return {
    restrict: 'E',
    link: function(scope, elem, attrs) {
      return elem.attr('aria-hidden', 'true');
    }
  };
});

angular.module('loomioApp').controller('InboxPageController', function($scope, $rootScope, Records, Session, AppConfig, LoadingService, InboxService, ModalService, GroupModal) {
  $rootScope.$broadcast('currentComponent', {
    titleKey: 'inbox_page.unread_threads',
    page: 'inboxPage'
  });
  $rootScope.$broadcast('setTitle', 'Inbox');
  $rootScope.$broadcast('analyticsClearGroup');
  InboxService.load();
  this.threadLimit = 50;
  this.views = InboxService.queryByGroup();
  this.groups = function() {
    return Records.groups.find(_.keys(this.views));
  };
  this.hasThreads = function() {
    return InboxService.unreadCount() > 0;
  };
  this.noGroups = function() {
    return !Session.user().hasAnyGroups();
  };
  this.startGroup = function() {
    return ModalService.open(GroupModal, {
      group: function() {
        return Records.groups.build();
      }
    });
  };
});

angular.module('loomioApp').controller('AuthorizedAppsPageController', function($scope, $rootScope, Records, ModalService, RevokeAppForm) {
  $rootScope.$broadcast('currentComponent', {
    page: 'authorizedAppsPage'
  });
  $rootScope.$broadcast('setTitle', 'Apps');
  this.loading = true;
  this.applications = function() {
    return Records.oauthApplications.find({
      authorized: true
    });
  };
  Records.oauthApplications.fetchAuthorized().then((function(_this) {
    return function() {
      return _this.loading = false;
    };
  })(this));
  this.openRevokeForm = function(application) {
    return ModalService.open(RevokeAppForm, {
      application: function() {
        return application;
      }
    });
  };
});

angular.module('loomioApp').factory('LeaveGroupForm', function() {
  return {
    templateUrl: 'generated/components/leave_group_form/leave_group_form.html',
    controller: function($scope, $location, $rootScope, group, FormService, Session, AbilityService) {
      $scope.group = group;
      $scope.membership = $scope.group.membershipFor(Session.user());
      $scope.submit = FormService.submit($scope, $scope.group, {
        submitFn: $scope.membership.destroy,
        flashSuccess: 'group_page.messages.leave_group_success',
        successCallback: function() {
          $rootScope.$broadcast('currentUserMembershipsLoaded');
          return $location.path('/dashboard');
        }
      });
      return $scope.canLeaveGroup = function() {
        return AbilityService.canRemoveMembership($scope.membership);
      };
    }
  };
});

angular.module('loomioApp').directive('lmoHref', function($window, $router) {
  return {
    restrict: 'A',
    scope: {
      route: '@lmoHref',
      target: '@target'
    },
    link: function(scope, elem, attrs) {
      return elem.bind('click', function($event) {
        if ($event.ctrlKey || $event.metaKey || scope.target === '_blank') {
          $event.stopImmediatePropagation();
          return $window.open(scope.route, '_blank');
        } else {
          return $router.navigate(scope.route);
        }
      });
    }
  };
});

angular.module('loomioApp').directive('lmoHrefFor', function(LmoUrlService) {
  return {
    restrict: 'A',
    scope: {
      model: '=lmoHrefFor',
      action: '@lmoHrefAction'
    },
    link: function(scope, elem, attrs) {
      elem.attr('href', LmoUrlService.route({
        model: scope.model,
        action: scope.action
      }));
      return elem.bind('click', function($event) {
        var attr_target;
        attr_target = $event.target.attributes.target;
        if ($event.ctrlKey || $event.metaKey || (attr_target && attr_target.value === '_blank')) {
          return $event.stopImmediatePropagation();
        }
      });
    }
  };
});

angular.module('loomioApp').directive('lmoStaticHref', function($window) {
  return {
    restrict: 'A',
    scope: {
      route: '@lmoStaticHref'
    },
    link: function(scope, elem, attrs) {
      scope.$watch('route', function() {
        return elem.attr('href', scope.route);
      });
      return elem.bind('click', function($event) {
        if ($event.trlKey || $event.metaKey) {
          return $window.open(scope.route);
        } else {
          return $window.location.href = scope.route;
        }
      });
    }
  };
});

angular.module('loomioApp').directive('lmoTextarea', function($compile, Records, EmojiService, ModalService, DocumentModal, DocumentService, MentionService) {
  return {
    scope: {
      model: '=',
      field: '@',
      noAttachments: '@',
      label: '=?',
      placeholder: '=?',
      helptext: '=?',
      maxlength: '=?'
    },
    restrict: 'E',
    templateUrl: 'generated/components/lmo_textarea/lmo_textarea.html',
    replace: true,
    controller: function($scope, $element) {
      $scope.init = function(model) {
        $scope.model = model;
        EmojiService.listen($scope, $scope.model, $scope.field, $element);
        MentionService.applyMentions($scope, $scope.model);
        return DocumentService.listenForPaste($scope);
      };
      $scope.init($scope.model);
      $scope.$on('reinitializeForm', function(_, model) {
        return $scope.init(model);
      });
      $scope.modelLength = function() {
        return $element.find('textarea').val().length;
      };
      $scope.addDocument = function($mdMenu) {
        return $scope.$broadcast('initializeDocument', Records.documents.buildFromModel($scope.model), $mdMenu);
      };
      $scope.$on('nextStep', function(_, doc) {
        return $scope.model.newDocumentIds.push(doc.id);
      });
      $scope.$on('documentAdded', function(_, doc) {
        return $scope.model.newDocumentIds.push(doc.id);
      });
      return $scope.$on('documentRemoved', function(_, doc) {
        return $scope.model.removedDocumentIds.push(doc.id);
      });
    }
  };
});

angular.module('loomioApp').directive('loading', function() {
  return {
    scope: {
      diameter: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/loading/loading.html',
    replace: true,
    controller: function($scope) {
      return $scope.diameter = $scope.diameter || 30;
    }
  };
});

angular.module('loomioApp').directive('loadingContent', function() {
  return {
    scope: {
      blockCount: '=?',
      lineCount: '=?'
    },
    restrict: 'E',
    templateUrl: 'generated/components/loading_content/loading_content.html',
    replace: true,
    controller: function($scope) {
      $scope.blocks = new Array($scope.blockCount || 1);
      return $scope.lines = new Array($scope.lineCount || 3);
    }
  };
});

angular.module('loomioApp').directive('materialModalHeaderCancelButton', function() {
  return {
    restrict: 'E',
    templateUrl: 'generated/components/material_modal_header_cancel_button/material_modal_header_cancel_button.html'
  };
});

angular.module('loomioApp').directive('matrixChart', function(AppConfig) {
  return {
    template: '<div class="matrix-chart"></div>',
    replace: true,
    scope: {
      matrixCounts: '=',
      size: '@'
    },
    restrict: 'E',
    controller: function($scope, $element) {
      var draw, drawPlaceholder, drawShape, shapes;
      draw = SVG($element[0]).size('100%', '100%');
      shapes = [];
      drawPlaceholder = function() {
        return _.each(_.times(5), function(row) {
          return _.each(_.times(5), function(col) {
            return drawShape(row, col, $scope.size / 5, false);
          });
        });
      };
      drawShape = function(row, col, width, value) {
        var color;
        color = value ? AppConfig.pollColors.meeting[0] : '#ebebeb';
        return shapes.push(draw.rect(width - 1, width - 1).fill(color).x(width * row).y(width * col));
      };
      return $scope.$watchCollection('matrixCounts', function() {
        var width;
        _.each(shapes, function(shape) {
          return shape.remove();
        });
        if (_.isEmpty($scope.matrixCounts)) {
          return drawPlaceholder();
        }
        width = $scope.size / _.max([$scope.matrixCounts.length, $scope.matrixCounts[0].length]);
        return _.each($scope.matrixCounts, function(values, row) {
          return _.each(values, function(value, col) {
            return drawShape(row, col, width, value);
          });
        });
      });
    }
  };
});

angular.module('loomioApp').controller('MembershipRequestsPageController', function($routeParams, $rootScope, Records, LoadingService, AbilityService, FlashService, AppConfig) {
  $rootScope.$broadcast('currentComponent', {
    page: 'membershipRequestsPage'
  });
  this.init = (function(_this) {
    return function() {
      return Records.groups.findOrFetchById($routeParams.key).then(function(group) {
        if (AbilityService.canManageMembershipRequests(group)) {
          _this.group = group;
          Records.membershipRequests.fetchPendingByGroup(group.key, {
            per: 100
          });
          return Records.membershipRequests.fetchPreviousByGroup(group.key, {
            per: 100
          });
        } else {
          return $rootScope.$broadcast('pageError', {
            status: 403
          });
        }
      }, function(error) {
        return $rootScope.$broadcast('pageError', {
          status: 403
        });
      });
    };
  })(this);
  this.init();
  this.pendingRequests = (function(_this) {
    return function() {
      return _this.group.pendingMembershipRequests();
    };
  })(this);
  this.previousRequests = (function(_this) {
    return function() {
      return _this.group.previousMembershipRequests();
    };
  })(this);
  this.approve = (function(_this) {
    return function(membershipRequest) {
      return Records.membershipRequests.approve(membershipRequest).then(function() {
        return FlashService.success("membership_requests_page.messages.request_approved_success");
      });
    };
  })(this);
  this.ignore = (function(_this) {
    return function(membershipRequest) {
      return Records.membershipRequests.ignore(membershipRequest).then(function() {
        return FlashService.success("membership_requests_page.messages.request_ignored_success");
      });
    };
  })(this);
  this.noPendingRequests = (function(_this) {
    return function() {
      return _this.pendingRequests.length === 0;
    };
  })(this);
});

angular.module('loomioApp').controller('MembershipsPageController', function($routeParams, $rootScope, Records, LoadingService, ModalService, InvitationModal, RemoveMembershipForm, AbilityService, FlashService, ScrollService) {
  var filteredMemberships;
  $rootScope.$broadcast('currentComponent', {
    page: 'membershipsPage'
  });
  this.init = (function(_this) {
    return function(group) {
      if ((_this.group != null) || (group == null)) {
        return;
      }
      if (AbilityService.canViewMemberships(group)) {
        _this.group = group;
        return Records.memberships.fetchByGroup(_this.group.key, {
          per: _this.group.membershipsCount
        }).then(function() {
          if ($routeParams.username != null) {
            return ScrollService.scrollTo("[data-username=" + $routeParams.username + "]");
          }
        });
      } else {
        return $rootScope.$broadcast('pageError', {
          status: 403
        }, group);
      }
    };
  })(this);
  this.fetchMemberships = (function(_this) {
    return function() {
      if (_this.fragment) {
        return Records.memberships.fetchByNameFragment(_this.fragment, _this.group.key);
      }
    };
  })(this);
  this.canAdministerGroup = function() {
    return AbilityService.canAdministerGroup(this.group);
  };
  this.canAddMembers = function() {
    return AbilityService.canAddMembers(this.group);
  };
  this.canRemoveMembership = function(membership) {
    return AbilityService.canRemoveMembership(membership);
  };
  this.canToggleAdmin = function(membership) {
    return this.canAdministerGroup(membership) && (!membership.admin || this.canRemoveMembership(membership));
  };
  this.toggleAdmin = function(membership) {
    var method;
    method = membership.admin ? 'makeAdmin' : 'removeAdmin';
    return Records.memberships[method](membership).then(function() {
      return FlashService.success("memberships_page.messages." + (_.snakeCase(method)) + "_success", {
        name: membership.userName()
      });
    });
  };
  this.openRemoveForm = function(membership) {
    return ModalService.open(RemoveMembershipForm, {
      membership: function() {
        return membership;
      }
    });
  };
  this.invitePeople = function() {
    return ModalService.open(InvitationModal, {
      group: (function(_this) {
        return function() {
          return _this.group;
        };
      })(this)
    });
  };
  filteredMemberships = (function(_this) {
    return function() {
      if (_this.fragment) {
        return _.filter(_this.group.memberships(), function(membership) {
          return _.contains(membership.userName().toLowerCase(), _this.fragment.toLowerCase());
        });
      } else {
        return _this.group.memberships();
      }
    };
  })(this);
  this.memberships = function() {
    return _.sortBy(filteredMemberships(), function(membership) {
      return membership.userName();
    });
  };
  this.name = function(membership) {
    return membership.userName();
  };
  Records.groups.findOrFetchById($routeParams.key).then(this.init, function(error) {
    return $rootScope.$broadcast('pageError', error);
  });
});

angular.module('loomioApp').controller('InstallSlackPageController', function($rootScope, Session, ModalService, InstallSlackModal) {
  $rootScope.$broadcast('currentComponent', {
    page: 'installSlackPage'
  });
  if (Session.user().identityFor('slack')) {
    ModalService.open(InstallSlackModal, {
      group: (function() {
        return null;
      }),
      preventClose: (function() {
        return true;
      })
    });
  }
});

angular.module('loomioApp').factory('HasDocuments', function() {
  var HasDocuments;
  return new (HasDocuments = (function() {
    function HasDocuments() {}

    HasDocuments.prototype.apply = function(model, opts) {
      if (opts == null) {
        opts = {};
      }
      model.newDocumentIds = model.newDocumentIds || [];
      model.removedDocumentIds = model.removedDocumentIds || [];
      model.documents = function() {
        return model.recordStore.documents.find({
          modelId: model.id,
          modelType: _.capitalize(model.constructor.singular)
        });
      };
      model.newDocuments = function() {
        return model.recordStore.documents.find(model.newDocumentIds);
      };
      model.newAndPersistedDocuments = function() {
        return _.uniq(_.filter(_.union(model.documents(), model.newDocuments()), function(doc) {
          return !_.contains(model.removedDocumentIds, doc.id);
        }));
      };
      model.hasDocuments = function() {
        return model.newAndPersistedDocuments().length > 0;
      };
      model.serialize = function() {
        var data, root;
        data = this.baseSerialize();
        root = model.constructor.serializationRoot || model.constructor.singular;
        data[root].document_ids = _.pluck(model.newAndPersistedDocuments(), 'id');
        return data;
      };
      model.showDocumentTitle = opts.showTitle;
      return model.documentsApplied = true;
    };

    return HasDocuments;

  })());
});

angular.module('loomioApp').factory('HasDrafts', function() {
  var HasDrafts;
  return new (HasDrafts = (function() {
    function HasDrafts() {}

    HasDrafts.prototype.apply = function(model) {
      model.draftParent = model.draftParent || function() {
        return model[model.constructor.draftParent]();
      };
      model.draft = function() {
        var parent;
        if (!(parent = model.draftParent())) {
          return;
        }
        return model.recordStore.drafts.findOrBuildFor(parent);
      };
      model.fetchDraft = function() {
        var parent;
        if (!(parent = model.draftParent())) {
          return;
        }
        return model.recordStore.drafts.fetchFor(parent);
      };
      model.restoreDraft = function() {
        var draft, payloadField;
        if (!(draft = model.draft())) {
          return;
        }
        payloadField = _.snakeCase(model.constructor.serializationRoot || model.constructor.singular);
        return model.update(_.omit(draft.payload[payloadField], _.isNull));
      };
      model.resetDraft = function() {
        var draft;
        if (!(draft = model.draft())) {
          return;
        }
        return draft.updateFrom(model.recordStore[model.constructor.plural].build());
      };
      return model.updateDraft = function() {
        var draft;
        if (!(draft = model.draft())) {
          return;
        }
        return draft.updateFrom(model);
      };
    };

    return HasDrafts;

  })());
});

angular.module('loomioApp').directive('mentionField', function($compile, LmoUrlService) {
  return {
    restrict: 'A',
    priority: 1000,
    terminal: true,
    compile: function(elem) {
      elem.attr('mentio', true);
      elem.attr({
        'mentio-trigger-char': "'@'"
      });
      elem.attr({
        'mentio-items': 'mentionables'
      });
      elem.attr({
        'mentio-template-url': 'generated/components/thread_page/comment_form/mentio_menu.html'
      });
      elem.attr({
        'mentio-search': 'fetchByNameFragment(term)'
      });
      elem.attr({
        'ng-model-options': "{debounce: " + (elem.attr('mention-debounce') || 150) + "}"
      });
      elem.removeAttr('mention-field');
      elem.removeAttr('data-mention-field');
      elem.removeAttr('mention-debounce');
      return function(scope) {
        return $compile(elem)(scope);
      };
    }
  };
});

angular.module('loomioApp').directive('notification', function() {
  return {
    scope: {
      notification: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/notification/notification.html',
    replace: true,
    controller: function($scope, Records) {
      $scope.actor = function() {
        return $scope.membershipRequestActor || $scope.notification.actor();
      };
      if ($scope.notification.kind === 'membership_requested') {
        $scope.membershipRequestActor = Records.users.build({
          name: $scope.notification.translationValues.name,
          avatarInitials: $scope.notification.translationValues.name.toString().split(' ').map(function(n) {
            return n[0];
          }).join(''),
          avatarKind: 'initials'
        });
      }
    }
  };
});

angular.module('loomioApp').directive('notifications', function() {
  return {
    scope: {},
    restrict: 'E',
    templateUrl: 'generated/components/notifications/notifications.html',
    replace: true,
    controller: function($scope, $rootScope, Records, AppConfig) {
      var notificationsView, unreadView;
      $scope.toggle = function(menu) {
        if (document.querySelector('.md-open-menu-container.md-active .notifications__menu-content')) {
          return $scope.close(menu);
        } else {
          return $scope.open(menu);
        }
      };
      $scope.open = function(menu) {
        menu.open();
        Records.notifications.viewed();
        return $rootScope.$broadcast('notificationsOpen');
      };
      $scope.close = function(menu) {
        menu.close();
        return $rootScope.$broadcast('notificationsClosed');
      };
      notificationsView = Records.notifications.collection.addDynamicView("notifications").applyFind({
        kind: {
          $in: AppConfig.notifications.kinds
        }
      });
      unreadView = Records.notifications.collection.addDynamicView("unread").applyFind({
        kind: {
          $in: AppConfig.notifications.kinds
        }
      }).applyFind({
        viewed: {
          $ne: true
        }
      });
      $scope.notifications = function() {
        return notificationsView.data();
      };
      $scope.unreadCount = (function(_this) {
        return function() {
          return unreadView.data().length;
        };
      })(this);
      $scope.hasUnread = (function(_this) {
        return function() {
          return $scope.unreadCount() > 0;
        };
      })(this);
    }
  };
});

angular.module('loomioApp').factory('OnlyCoordinatorModal', function() {
  return {
    templateUrl: 'generated/components/only_coordinator_modal/only_coordinator_modal.html',
    controller: function($scope, $location, Session, LmoUrlService) {
      $scope.groups = function() {
        return _.filter(Session.user().groups(), function(group) {
          return _.contains(group.adminIds(), Session.user().id) && !group.hasMultipleAdmins;
        });
      };
      return $scope.redirectToGroup = function(group) {
        $location.path(LmoUrlService.group(group));
        return $scope.$close();
      };
    }
  };
});

angular.module('loomioApp').directive('outlet', function($compile, AppConfig) {
  return {
    scope: {
      model: '=?'
    },
    restrict: 'E',
    replace: true,
    link: function(scope, elem, attrs) {
      var compileHtml, shouldCompile;
      shouldCompile = function(outlet) {
        var group;
        if ((scope.model == null) || (scope.model.group == null)) {
          return true;
        }
        if (!((outlet.experimental != null) || (outlet.plans != null))) {
          return true;
        }
        group = scope.model.group().parentOrSelf();
        if ((outlet.experimental != null) && group.enableExperiments) {
          return true;
        }
        if (_.include(outlet.plans, group.subscriptionPlan)) {
          return true;
        }
        return false;
      };
      compileHtml = function(model, component) {
        var modelDirective;
        if (model) {
          modelDirective = model.constructor.singular + "='model'";
        }
        return $compile("<" + (_.snakeCase(component)) + " " + modelDirective + " />");
      };
      return _.map(AppConfig.plugins.outlets[_.snakeCase(attrs.name)], function(outlet) {
        if (shouldCompile(outlet)) {
          return elem.append(compileHtml(scope.model, outlet.component)(scope));
        }
      });
    }
  };
});

angular.module('loomioApp').directive('pendingEmailForm', function($translate, KeyEventService) {
  return {
    scope: {
      emails: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/pending_email_form/pending_email_form.html',
    replace: true,
    controller: function($scope) {
      $scope.newEmail = '';
      $scope.addIfValid = function() {
        $scope.emailValidationError = null;
        $scope.checkEmailNotEmpty();
        $scope.checkEmailValid();
        $scope.checkEmailAvailable();
        if (!$scope.emailValidationError) {
          return $scope.add();
        }
      };
      $scope.add = function() {
        if (!($scope.newEmail.length > 0)) {
          return;
        }
        $scope.emails.push($scope.newEmail);
        $scope.newEmail = '';
        return $scope.emailValidationError = null;
      };
      $scope.submit = function() {
        $scope.emailValidationError = null;
        $scope.checkEmailValid();
        $scope.checkEmailAvailable();
        if (!$scope.emailValidationError) {
          $scope.add();
          return $scope.$emit('emailsSubmitted');
        }
      };
      $scope.checkEmailNotEmpty = function() {
        if ($scope.newEmail.length <= 0) {
          return $scope.emailValidationError = $translate.instant('pending_email_form.email_empty');
        }
      };
      $scope.checkEmailValid = function() {
        if ($scope.newEmail.length > 0 && !$scope.newEmail.match(/[^\s,;<>]+?@[^\s,;<>]+\.[^\s,;<>]+/g)) {
          return $scope.emailValidationError = $translate.instant('pending_email_form.email_invalid');
        }
      };
      $scope.checkEmailAvailable = function() {
        if (_.contains($scope.emails, $scope.newEmail)) {
          return $scope.emailValidationError = $translate.instant('pending_email_form.email_exists', {
            email: $scope.newEmail
          });
        }
      };
      $scope.remove = function(email) {
        return _.pull($scope.emails, email);
      };
      return KeyEventService.registerKeyEvent($scope, 'pressedEnter', $scope.add, function(active) {
        return active.classList.contains('poll-common-share-form__add-option-input');
      });
    }
  };
});

angular.module('loomioApp').factory('PinThreadModal', function(FormService) {
  return {
    templateUrl: 'generated/components/pin_thread_modal/pin_thread_modal.html',
    controller: function($scope, thread) {
      $scope.thread = thread;
      return $scope.submit = FormService.submit($scope, $scope.thread, {
        submitFn: $scope.thread.savePin,
        flashSuccess: "discussion.pin.pinned"
      });
    }
  };
});

angular.module('loomioApp').controller('PollPageController', function($scope, $rootScope, $routeParams, MessageChannelService, Records, $location, ModalService, PollService, PollCommonOutcomeModal, PollCommonEditVoteModal, PollCommonShareModal, Session) {
  this.init = (function(_this) {
    return function(poll) {
      if (poll && (_this.poll == null)) {
        _this.poll = poll;
        $rootScope.$broadcast('currentComponent', {
          group: _this.poll.group(),
          title: poll.title,
          page: 'pollPage',
          skipScroll: true
        });
        MessageChannelService.subscribeToPoll(_this.poll);
        if ($location.search().share) {
          ModalService.open(PollCommonShareModal, {
            poll: function() {
              return _this.poll;
            }
          });
        }
        if ($location.search().set_outcome) {
          ModalService.open(PollCommonOutcomeModal, {
            outcome: function() {
              return Records.outcomes.build({
                pollId: _this.poll.id
              });
            }
          });
        }
        if ($location.search().change_vote) {
          return ModalService.open(PollCommonEditVoteModal, {
            stance: function() {
              return PollService.lastStanceBy(Session.user(), _this.poll);
            }
          });
        }
      }
    };
  })(this);
  Records.polls.findOrFetchById($routeParams.key).then(this.init, function(error) {
    return $rootScope.$broadcast('pageError', error);
  });
});

angular.module('loomioApp').controller('PollsPageController', function($scope, $location, $q, $rootScope, AppConfig, Records, Session, AbilityService, LoadingService, ModalService, PollCommonStartModal, RecordLoader) {
  var now;
  $rootScope.$broadcast('currentComponent', {
    titleKey: 'polls_page.heading',
    page: 'pollsPage'
  });
  this.statusFilters = _.map(AppConfig.searchFilters.status, function(filter) {
    return {
      name: _.capitalize(filter),
      value: filter
    };
  });
  this.groupFilters = _.map(Session.user().groups(), function(group) {
    return {
      name: group.fullName,
      value: group.key
    };
  });
  this.statusFilter = $location.search().status;
  this.groupFilter = $location.search().group_key;
  now = moment();
  this.pollImportance = (function(_this) {
    return function(poll) {
      return poll.importance(now);
    };
  })(this);
  this.loadMore = (function(_this) {
    return function() {
      return _this.loader.loadMore().then(function(response) {
        return _this.pollIds = _this.pollIds.concat(_.pluck(response.polls, 'id'));
      });
    };
  })(this);
  LoadingService.applyLoadingFunction(this, 'loadMore');
  this.fetchRecords = (function(_this) {
    return function() {
      $location.search('group_key', _this.groupFilter);
      $location.search('status', _this.statusFilter);
      _this.pollIds = [];
      _this.loader = new RecordLoader({
        collection: 'polls',
        path: 'search',
        params: $location.search(),
        per: 25
      });
      Records.polls.searchResultsCount($location.search()).then(function(response) {
        return _this.pollsCount = response;
      });
      return _this.loader.fetchRecords().then(function(response) {
        _this.group = Records.groups.find($location.search().group_key);
        return _this.pollIds = _.pluck(response.polls, 'id');
      }, function(error) {
        return $rootScope.$broadcast('pageError', error);
      });
    };
  })(this);
  LoadingService.applyLoadingFunction(this, 'fetchRecords');
  this.fetchRecords();
  this.loadedCount = function() {
    return this.pollCollection.polls().length;
  };
  this.canLoadMore = function() {
    return !this.fragment && this.loadedCount() < this.pollsCount;
  };
  this.startNewPoll = function() {
    return ModalService.open(PollCommonStartModal, {
      poll: function() {
        return Records.polls.build({
          authorId: Session.user().id
        });
      }
    });
  };
  this.searchPolls = (function(_this) {
    return function() {
      if (_this.fragment) {
        return Records.polls.search({
          query: _this.fragment,
          per: 10
        });
      } else {
        return $q.when();
      }
    };
  })(this);
  LoadingService.applyLoadingFunction(this, 'searchPolls');
  this.fetching = function() {
    return this.fetchRecordsExecuting || this.loadMoreExecuting;
  };
  this.pollCollection = {
    polls: (function(_this) {
      return function() {
        return _.sortBy(_.filter(Records.polls.find(_this.pollIds), function(poll) {
          return _.isEmpty(_this.fragment) || poll.title.match(RegExp("" + _this.fragment, "i"));
        }), '-createdAt');
      };
    })(this)
  };
});

angular.module('loomioApp').controller('ProfilePageController', function($scope, $rootScope, Records, FormService, $location, AbilityService, ModalService, ChangePictureForm, ChangePasswordForm, DeactivateUserForm, Session, AppConfig, DeactivationModal) {
  $rootScope.$broadcast('currentComponent', {
    titleKey: 'profile_page.profile',
    page: 'profilePage'
  });
  this.showHelpTranslate = function() {
    return AppConfig.features.app.help_link;
  };
  this.init = (function(_this) {
    return function() {
      if (!AbilityService.isLoggedIn()) {
        return;
      }
      _this.user = Session.user().clone();
      Session.setLocale(_this.user.locale);
      return _this.submit = FormService.submit(_this, _this.user, {
        flashSuccess: 'profile_page.messages.updated',
        submitFn: Records.users.updateProfile,
        successCallback: _this.init
      });
    };
  })(this);
  this.init();
  $scope.$on('updateProfile', (function(_this) {
    return function() {
      return _this.init();
    };
  })(this));
  this.availableLocales = function() {
    return AppConfig.locales;
  };
  this.changePicture = function() {
    return ModalService.open(ChangePictureForm);
  };
  this.changePassword = function() {
    return ModalService.open(ChangePasswordForm);
  };
  this.deactivateUser = function() {
    return ModalService.open(DeactivationModal);
  };
});

angular.module('loomioApp').directive('progressChart', function(AppConfig) {
  return {
    template: '<div class="progress-chart"></div>',
    replace: true,
    scope: {
      stanceCounts: '=',
      goal: '=',
      size: '@'
    },
    restrict: 'E',
    controller: function($scope, $element) {
      var draw;
      draw = SVG($element[0]).size('100%', '100%');
      return $scope.$watchCollection('stanceCounts', function() {
        var y;
        y = 0;
        _.each($scope.stanceCounts, function(count, index) {
          var height;
          height = ($scope.size * _.max([parseInt(count), 0])) / $scope.goal;
          draw.rect($scope.size, height).fill(AppConfig.pollColors.count[index]).x(0).y($scope.size - height - y);
          return y += height;
        });
        draw.circle($scope.size / 2).fill("#fff").x($scope.size / 4).y($scope.size / 4);
        return draw.text(($scope.stanceCounts[0] || 0).toString()).font({
          size: 16,
          anchor: 'middle'
        }).x($scope.size / 2).y(($scope.size / 4) + 3);
      });
    }
  };
});

angular.module('loomioApp').factory('RegisteredAppForm', function() {
  return {
    templateUrl: 'generated/components/registered_app_form/registered_app_form.html',
    controller: function($scope, $location, application, Records, FormService, LmoUrlService, KeyEventService) {
      var actionName;
      $scope.application = application.clone();
      actionName = $scope.application.isNew() ? 'created' : 'updated';
      $scope.submit = FormService.submit($scope, $scope.application, {
        flashSuccess: "registered_app_form.messages." + actionName,
        flashOptions: {
          name: function() {
            return $scope.application.name;
          }
        },
        successCallback: function(response) {
          if ($scope.application.isNew()) {
            return $location.path(LmoUrlService.oauthApplication(response.oauth_applications[0]));
          }
        }
      });
      $scope.upload = FormService.upload($scope, $scope.application, {
        flashSuccess: 'registered_app_form.messages.logo_changed',
        submitFn: $scope.application.uploadLogo,
        loadingMessage: 'common.action.uploading',
        skipClose: true,
        successCallback: function(response) {
          return $scope.application.logoUrl = response.data.oauth_applications[0].logo_url;
        }
      });
      $scope.clickFileUpload = function() {
        return document.querySelector('.registered-app-form__logo-input').click();
      };
      return KeyEventService.submitOnEnter($scope);
    }
  };
});

angular.module('loomioApp').controller('RegisteredAppPageController', function($scope, $rootScope, $routeParams, Records, FlashService, ModalService, RegisteredAppForm, RemoveAppForm) {
  this.init = (function(_this) {
    return function(application) {
      if (application && (_this.application == null)) {
        _this.application = application;
        $rootScope.$broadcast('currentComponent', {
          page: 'oauthApplicationPage'
        });
        return $rootScope.$broadcast('setTitle', _this.application.name);
      }
    };
  })(this);
  this.init(Records.oauthApplications.find(parseInt($routeParams.id)));
  Records.oauthApplications.findOrFetchById(parseInt($routeParams.id)).then(this.init, function(error) {
    return $rootScope.$broadcast('pageError', error);
  });
  this.copied = function() {
    return FlashService.success('common.copied');
  };
  this.openRemoveForm = function() {
    return ModalService.open(RemoveAppForm, {
      application: (function(_this) {
        return function() {
          return _this.application;
        };
      })(this)
    });
  };
  this.openEditForm = function() {
    return ModalService.open(RegisteredAppForm, {
      application: (function(_this) {
        return function() {
          return _this.application;
        };
      })(this)
    });
  };
});

angular.module('loomioApp').controller('RegisteredAppsPageController', function($scope, $rootScope, Records, ModalService, RegisteredAppForm, RemoveAppForm) {
  $rootScope.$broadcast('currentComponent', {
    page: 'registeredAppsPage'
  });
  $rootScope.$broadcast('setTitle', 'OAuth Application Dashboard');
  this.loading = true;
  this.applications = function() {
    return Records.oauthApplications.collection.data;
  };
  Records.oauthApplications.fetchOwned().then((function(_this) {
    return function() {
      return _this.loading = false;
    };
  })(this));
  this.openApplicationForm = function(application) {
    return ModalService.open(RegisteredAppForm, {
      application: function() {
        return Records.oauthApplications.build();
      }
    });
  };
  this.openDestroyForm = function(application) {
    return ModalService.open(RemoveAppForm, {
      application: function() {
        return application;
      }
    });
  };
});

angular.module('loomioApp').factory('RemoveAppForm', function() {
  return {
    templateUrl: 'generated/components/remove_app_form/remove_app_form.html',
    controller: function($scope, $rootScope, application, FlashService) {
      $scope.application = application;
      return $scope.submit = function() {
        return $scope.application.destroy().then(function() {
          FlashService.success('remove_app_form.messages.success', {
            name: $scope.application.name
          });
          return $scope.$close();
        }, function() {
          $rootScope.$broadcast('pageError', 'cantDestroyApplication', $scope.application);
          return $scope.$close();
        });
      };
    }
  };
});

angular.module('loomioApp').factory('RemoveMembershipForm', function() {
  return {
    templateUrl: 'generated/components/remove_membership_form/remove_membership_form.html',
    controller: function($scope, $location, $rootScope, membership, FlashService, Session) {
      $scope.membership = membership;
      return $scope.submit = function() {
        return $scope.membership.destroy().then(function() {
          FlashService.success('memberships_page.messages.remove_member_success', {
            name: $scope.membership.userName()
          });
          $scope.$close();
          if ($scope.membership.user() === Session.user()) {
            return $location.path("/dashboard");
          }
        }, function() {
          $rootScope.$broadcast('pageError', 'cantDestroyMembership', $scope.membership);
          return $scope.$close();
        });
      };
    }
  };
});

angular.module('loomioApp').factory('RevokeAppForm', function() {
  return {
    templateUrl: 'generated/components/revoke_app_form/revoke_app_form.html',
    controller: function($scope, $rootScope, application, FlashService) {
      $scope.application = application;
      return $scope.submit = function() {
        return $scope.application.revokeAccess().then(function() {
          FlashService.success('revoke_app_form.messages.success', {
            name: $scope.application.name
          });
          return $scope.$close();
        }, function() {
          $rootScope.$broadcast('pageError', 'cantRevokeApplication', $scope.application);
          return $scope.$close();
        });
      };
    }
  };
});

angular.module('loomioApp').directive('sidebar', function($rootScope, $mdMedia, $mdSidenav, $window, Session, InboxService, RestfulClient, UserHelpService, AppConfig, IntercomService, LmoUrlService, Records, ModalService, GroupModal, DiscussionModal, AbilityService) {
  return {
    scope: false,
    restrict: 'E',
    templateUrl: 'generated/components/sidebar/sidebar.html',
    replace: true,
    controller: function($scope) {
      var availableGroups;
      $scope.currentState = "";
      $scope.showSidebar = true;
      InboxService.load();
      $scope.hasAnyGroups = function() {
        return Session.user().hasAnyGroups();
      };
      availableGroups = function() {
        return _.filter(Session.user().groups(), function(group) {
          return AbilityService.canAddMembers(group);
        });
      };
      $scope.currentGroup = function() {
        if (availableGroups().length === 1) {
          return _.first(availableGroups());
        }
        return _.find(availableGroups(), function(g) {
          return g.id === Session.currentGroupId();
        }) || Records.groups.build();
      };
      $scope.$on('toggleSidebar', function(event, show) {
        if (!_.isUndefined(show)) {
          return $scope.showSidebar = show;
        } else {
          return $scope.showSidebar = !$scope.showSidebar;
        }
      });
      $scope.$on('currentComponent', function(el, component) {
        return $scope.currentState = component;
      });
      $scope.onPage = function(page, key, filter) {
        switch (page) {
          case 'groupPage':
            return $scope.currentState.key === key;
          case 'dashboardPage':
            return $scope.currentState.page === page && $scope.currentState.filter === filter;
          default:
            return $scope.currentState.page === page;
        }
      };
      $scope.groupUrl = function(group) {
        return LmoUrlService.group(group);
      };
      $scope.unreadThreadCount = function() {
        return InboxService.unreadCount();
      };
      $scope.sidebarItemSelected = function() {
        if (!$mdMedia("gt-md")) {
          return $mdSidenav('left').close();
        }
      };
      $scope.groups = function() {
        return Session.user().groups().concat(Session.user().orphanParents());
      };
      $scope.currentUser = function() {
        return Session.user();
      };
      $scope.canStartGroup = function() {
        return AbilityService.canStartGroups();
      };
      $scope.canViewPublicGroups = function() {
        return AbilityService.canViewPublicGroups();
      };
      $scope.startGroup = function() {
        return ModalService.open(GroupModal, {
          group: function() {
            return Records.groups.build();
          }
        });
      };
      return $scope.startThread = function() {
        return ModalService.open(DiscussionModal, {
          discussion: function() {
            return Records.discussions.build({
              groupId: $scope.currentGroup().id
            });
          }
        });
      };
    }
  };
});

angular.module('loomioApp').factory('SignedOutModal', function() {
  return {
    templateUrl: 'generated/components/signed_out_modal/signed_out_modal.html',
    controller: function($scope, preventClose, Session) {
      $scope.preventClose = preventClose;
      return $scope.submit = Session.logout;
    }
  };
});

angular.module('loomioApp').factory('MoveThreadForm', function() {
  return {
    templateUrl: 'generated/components/move_thread_form/move_thread_form.html',
    controller: function($scope, $location, discussion, Session, FormService, Records, $translate) {
      $scope.discussion = discussion.clone();
      $scope.availableGroups = function() {
        return _.filter(Session.user().groups(), function(group) {
          return group.id !== discussion.groupId;
        });
      };
      $scope.submit = FormService.submit($scope, $scope.discussion, {
        submitFn: $scope.discussion.move,
        flashSuccess: 'move_thread_form.messages.success',
        flashOptions: {
          name: function() {
            return $scope.discussion.group().name;
          }
        }
      });
      $scope.updateTarget = function() {
        return $scope.targetGroup = Records.groups.find($scope.discussion.groupId);
      };
      $scope.updateTarget();
      return $scope.moveThread = function() {
        if ($scope.discussion["private"] && $scope.targetGroup.privacyIsOpen()) {
          if (confirm($translate.instant('move_thread_form.confirm_change_to_private_thread', {
            groupName: $scope.targetGroup.name
          }))) {
            return $scope.submit();
          }
        } else {
          return $scope.submit();
        }
      };
    }
  };
});

angular.module('loomioApp').directive('smartTime', function() {
  return {
    scope: {
      time: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/smart_time/smart_time.html',
    replace: true,
    controller: function($scope) {
      var format, now, sameDay, sameWeek, sameYear, time;
      time = moment($scope.time);
      now = moment();
      sameDay = function(time) {
        return time.year() === now.year() && time.month() === now.month() && time.date() === now.date();
      };
      sameWeek = function(time) {
        return time.year() === now.year() && time.month() === now.month() && time.week() === now.week();
      };
      sameYear = function(time) {
        return time.year() === now.year();
      };
      format = (function() {
        switch (false) {
          case !sameDay(time):
            return "h:mm a";
          case !sameWeek(time):
            return "ddd";
          case !sameYear(time):
            return "D MMM";
          default:
            return "MMM YYYY";
        }
      })();
      return $scope.value = time.format(format);
    }
  };
});

angular.module('loomioApp').controller('StartGroupPageController', function($scope, $location, $rootScope, Records, LmoUrlService, ModalService, InvitationModal) {
  $rootScope.$broadcast('currentComponent', {
    page: 'startGroupPage',
    skipScroll: true
  });
  this.group = Records.groups.build({
    name: $location.search().name,
    customFields: {
      pending_emails: _.compact(($location.search().pending_emails || "").split(','))
    }
  });
  $scope.$on('nextStep', function(_, group) {
    $location.path(LmoUrlService.group(group));
    return ModalService.open(InvitationModal, {
      group: function() {
        return group;
      }
    });
  });
});

angular.module('loomioApp').controller('StartPollPageController', function($scope, $location, $rootScope, $routeParams, Records, LoadingService, PollService, ModalService, PollCommonShareModal) {
  $rootScope.$broadcast('currentComponent', {
    page: 'startPollPage',
    skipScroll: true
  });
  this.poll = Records.polls.build({
    title: $location.search().title,
    pollType: $routeParams.poll_type,
    groupId: $location.search().group_id,
    customFields: {
      pending_emails: _.compact(($location.search().pending_emails || "").split(','))
    }
  });
  this.icon = function() {
    return PollService.iconFor(this.poll);
  };
  LoadingService.listenForLoading($scope);
  PollService.applyPollStartSequence(this, {
    emitter: $scope,
    afterSaveComplete: function(poll) {
      return ModalService.open(PollCommonShareModal, {
        poll: function() {
          return poll;
        }
      });
    }
  });
});

angular.module('loomioApp').directive('threadCard', function() {
  return {
    scope: {
      discussion: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/thread_card/thread_card.html'
  };
});

angular.module('loomioApp').directive('threadLintel', function() {
  return {
    restrict: 'E',
    templateUrl: 'generated/components/thread_lintel/thread_lintel.html',
    replace: true,
    controller: function($scope, ScrollService) {
      $scope.show = function() {
        return $scope.showLintel && $scope.discussion;
      };
      $scope.scrollToThread = function() {
        return ScrollService.scrollTo('h1');
      };
      $scope.$on('currentComponent', function(event, options) {
        $scope.currentComponent = options['page'];
        return $scope.discussion = options.discussion;
      });
      $scope.$on('showThreadLintel', function(event, bool) {
        return $scope.showLintel = bool;
      });
      return $scope.$on('threadPosition', function(event, discussion, position) {
        $scope.position = position;
        $scope.discussion = discussion;
        return $scope.positionPercent = (position / discussion.lastSequenceId) * 100;
      });
    }
  };
});

angular.module('loomioApp').controller('ThreadPageController', function($scope, $routeParams, $location, $rootScope, $window, $timeout, Records, KeyEventService, ModalService, ScrollService, AbilityService, Session, PaginationService, LmoUrlService, PollService) {
  var checkInView, chompRequestedSequenceId, requestedCommentId;
  $rootScope.$broadcast('currentComponent', {
    page: 'threadPage',
    skipScroll: true
  });
  requestedCommentId = function() {
    return parseInt($routeParams.comment || $location.search().comment);
  };
  if (requestedCommentId()) {
    Records.events.fetch({
      params: {
        discussion_id: $routeParams.key,
        comment_id: requestedCommentId(),
        per: 1
      }
    }).then((function(_this) {
      return function() {
        var comment;
        comment = Records.comments.find(requestedCommentId());
        _this.discussion = comment.discussion();
        _this.discussion.requestedSequenceId = comment.createdEvent().sequenceId;
        return $scope.$broadcast('initActivityCard');
      };
    })(this));
  }
  chompRequestedSequenceId = function() {
    var requestedSequenceId;
    requestedSequenceId = parseInt($location.search().from);
    $location.search('from', null);
    return requestedSequenceId;
  };
  this.init = (function(_this) {
    return function(discussion) {
      if (discussion && (_this.discussion == null)) {
        _this.discussion = discussion;
        _this.discussion.markAsSeen();
        _this.discussion.requestedSequenceId = chompRequestedSequenceId();
        _this.pageWindow = PaginationService.windowFor({
          current: _this.discussion.requestedSequenceId || _this.discussion.firstSequenceId(),
          min: _this.discussion.firstSequenceId(),
          max: _this.discussion.lastSequenceId(),
          pageType: 'activityItems'
        });
        return $rootScope.$broadcast('currentComponent', {
          title: _this.discussion.title,
          page: 'threadPage',
          group: _this.discussion.group(),
          discussion: _this.discussion,
          links: {
            canonical: LmoUrlService.discussion(_this.discussion, {}, {
              absolute: true
            }),
            rss: !_this.discussion["private"] ? LmoUrlService.discussion(_this.discussion) + '.xml' : void 0,
            prev: _this.pageWindow.prev != null ? LmoUrlService.discussion(_this.discussion, {
              from: _this.pageWindow.prev
            }) : void 0,
            next: _this.pageWindow.next != null ? LmoUrlService.discussion(_this.discussion, {
              from: _this.pageWindow.next
            }) : void 0
          },
          skipScroll: true
        });
      }
    };
  })(this);
  this.init(Records.discussions.find($routeParams.key));
  Records.discussions.findOrFetchById($routeParams.key).then(this.init, function(error) {
    return $rootScope.$broadcast('pageError', error);
  });
  $scope.$on('threadPageScrollToSelector', (function(_this) {
    return function(e, selector) {
      return ScrollService.scrollTo(selector, {
        offset: 150
      });
    };
  })(this));
  checkInView = function() {
    return angular.element(window).triggerHandler('checkInView');
  };
  KeyEventService.registerKeyEvent($scope, 'pressedUpArrow', checkInView);
  KeyEventService.registerKeyEvent($scope, 'pressedDownArrow', checkInView);
});

angular.module('loomioApp').directive('threadPreview', function() {
  return {
    scope: {
      thread: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/thread_preview/thread_preview.html',
    controller: function($scope, Records, Session, LmoUrlService, FlashService, ModalService, DismissExplanationModal, ThreadService, PollService) {
      $scope.dismiss = function() {
        if (!Session.user().hasExperienced("dismissThread")) {
          Records.users.saveExperience("dismissThread");
          return ModalService.open(DismissExplanationModal, {
            thread: function() {
              return $scope.thread;
            }
          });
        } else {
          $scope.thread.dismiss();
          return FlashService.success("dashboard_page.thread_dismissed");
        }
      };
      $scope.muteThread = function() {
        return ThreadService.mute($scope.thread);
      };
      $scope.unmuteThread = function() {
        return ThreadService.unmute($scope.thread);
      };
    }
  };
});

angular.module('loomioApp').directive('threadPreviewCollection', function() {
  return {
    scope: {
      query: '=',
      limit: '=?'
    },
    restrict: 'E',
    templateUrl: 'generated/components/thread_preview_collection/thread_preview_collection.html',
    replace: true
  };
});

angular.module('loomioApp').directive('timeZoneSelect', function($translate, AppConfig, TimeService) {
  return {
    scope: {
      zone: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/time_zone_select/time_zone_select.html',
    replace: true,
    controller: function($scope) {
      $scope.q = "";
      $scope.isOpen = false;
      $scope.zone = $scope.zone || AppConfig.timeZone;
      $scope.currentZone = function() {
        return TimeService.nameForZone($scope.zone);
      };
      $scope.zoneFromName = function(name) {
        return AppConfig.timeZones[name];
      };
      $scope.offsetFromName = function(name) {
        return moment().tz(zoneFromName(name)).format('Z');
      };
      $scope.open = function() {
        $scope.q = "";
        return $scope.isOpen = true;
      };
      $scope.close = function() {
        return $scope.isOpen = false;
      };
      $scope.names = function() {
        return _.filter(_.keys(AppConfig.timeZones), function(name) {
          return name.toLowerCase().includes($scope.q.toLowerCase());
        });
      };
      return $scope.change = function() {
        if (AppConfig.timeZones[$scope.q]) {
          $scope.zone = AppConfig.timeZones[$scope.q];
          $scope.$emit('timeZoneSelected', AppConfig.timeZones[$scope.q]);
          return $scope.close();
        }
      };
    }
  };
});

angular.module('loomioApp').directive('timeago', function() {
  return {
    scope: {
      timestamp: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/timeago/timeago.html',
    replace: true
  };
});

angular.module('loomioApp').directive('translateButton', function() {
  return {
    scope: {
      model: '=',
      showdot: '=?'
    },
    restrict: 'E',
    templateUrl: 'generated/components/translate_button/translate_button.html',
    replace: true,
    controller: function($scope, Records, AbilityService, Session, LoadingService) {
      $scope.canTranslate = function() {
        return AbilityService.canTranslate($scope.model) && !$scope.translateExecuting && !$scope.translated;
      };
      $scope.translate = function() {
        return Records.translations.fetchTranslation($scope.model, Session.user().locale).then(function(data) {
          $scope.translated = true;
          return $scope.$emit('translationComplete', data.translations[0].fields);
        });
      };
      return LoadingService.applyLoadingFunction($scope, 'translate');
    }
  };
});

angular.module('loomioApp').directive('translation', function() {
  return {
    scope: {
      translation: '=',
      field: '@'
    },
    restrict: 'E',
    templateUrl: 'generated/components/translation/translation.html',
    replace: true,
    controller: function($scope) {
      return $scope.translated = $scope.translation[$scope.field];
    }
  };
});

angular.module('loomioApp').directive('userAvatar', function($window) {
  return {
    scope: {
      user: '=',
      coordinator: '=?',
      size: '@?',
      noLink: '=?'
    },
    restrict: 'E',
    templateUrl: 'generated/components/user_avatar/user_avatar.html',
    replace: true,
    controller: function($scope) {
      var _2x;
      if (!_.contains(['small', 'medium', 'large', 'featured'], $scope.size)) {
        $scope.size = 'medium';
      }
      _2x = function() {
        return $window.devicePixelRatio >= 2;
      };
      $scope.gravatarSize = function() {
        var size;
        size = (function() {
          switch ($scope.size) {
            case 'small':
              return 30;
            case 'medium':
              return 50;
            case 'large':
              return 80;
            case 'featured':
              return 175;
          }
        })();
        if (_2x()) {
          return 2 * size;
        } else {
          return size;
        }
      };
      $scope.uploadedAvatarUrl = function() {
        var size;
        if ($scope.user.avatarKind !== 'uploaded') {
          return;
        }
        if (typeof $scope.user.avatarUrl === 'string') {
          return $scope.user.avatarUrl;
        }
        size = (function() {
          switch ($scope.size) {
            case 'small':
              if (_2x()) {
                return 'medium';
              } else {
                return 'small';
              }
              break;
            case 'medium':
              if (_2x()) {
                return 'large';
              } else {
                return 'medium';
              }
              break;
            case 'large':
            case 'featured':
              return 'large';
          }
        })();
        return $scope.user.avatarUrl[size];
      };
    }
  };
});

angular.module('loomioApp').directive('userDropdown', function(AppConfig, Session, UserHelpService, IntercomService) {
  return {
    restrict: 'E',
    templateUrl: 'generated/components/user_dropdown/user_dropdown.html',
    replace: true,
    controller: function($scope) {
      $scope.siteName = AppConfig.theme.site_name;
      $scope.user = Session.user();
      $scope.signOut = function() {
        return Session.logout();
      };
      $scope.helpLink = function() {
        return UserHelpService.helpLink();
      };
      $scope.showContactUs = function() {
        return IntercomService.available();
      };
      $scope.showHelp = function() {
        return AppConfig.features.app.help_link;
      };
      return $scope.contactUs = function() {
        return IntercomService.contactUs();
      };
    }
  };
});

angular.module('loomioApp').controller('UserPageController', function($rootScope, $routeParams, AbilityService, Records, LoadingService, ModalService, ContactRequestModal) {
  this.init = (function(_this) {
    return function() {
      if (_this.user) {
        return;
      }
      if (_this.user = (Records.users.find($routeParams.key) || Records.users.find({
        username: $routeParams.key
      }))[0]) {
        $rootScope.$broadcast('currentComponent', {
          title: _this.user.name,
          page: 'userPage'
        });
        return _this.loadGroupsFor(_this.user);
      }
    };
  })(this);
  this.location = (function(_this) {
    return function() {
      return _this.user.location || _this.user.detectedLocation().join(', ');
    };
  })(this);
  this.canContactUser = function() {
    return AbilityService.canContactUser(this.user);
  };
  this.contactUser = function() {
    return ModalService.open(ContactRequestModal, {
      user: (function(_this) {
        return function() {
          return _this.user;
        };
      })(this)
    });
  };
  this.loadGroupsFor = function(user) {
    return Records.memberships.fetchByUser(user);
  };
  LoadingService.applyLoadingFunction(this, 'loadGroupsFor');
  this.init();
  Records.users.findOrFetchById($routeParams.key).then(this.init, function(error) {
    return $rootScope.$broadcast('pageError', error);
  });
});

angular.module('loomioApp').directive('validationErrors', function() {
  return {
    scope: {
      subject: '=',
      field: '@'
    },
    restrict: 'E',
    templateUrl: 'generated/components/validation_errors/validation_errors.html',
    replace: true
  };
});

angular.module('loomioApp').directive('verifyEmailNotice', function() {
  return {
    scope: false,
    restrict: 'E',
    templateUrl: 'generated/components/verify_email_notice/verify_email_notice.html',
    controller: function($scope) {}
  };
});

angular.module('loomioApp').controller('VerifyStancesPageController', function($scope, $rootScope, Session, Records, LoadingService, RecordLoader, FlashService) {
  $rootScope.$broadcast('currentComponent', {
    page: 'verifyStancesPage',
    skipScroll: true
  });
  $scope.loader = new RecordLoader({
    collection: 'stances',
    path: 'unverified'
  });
  $scope.loader.fetchRecords().then((function(_this) {
    return function(data) {
      return Records.stances.find(_.pluck(data.stances, 'id')).map(function(stance) {
        return stance.unverified = true;
      });
    };
  })(this));
  $scope.stances = function() {
    return Records.stances.find({
      unverified: true
    });
  };
  $scope.verify = function(stance) {
    return stance.verify().then(function() {
      return FlashService.success('verify_stances.verify_success');
    });
  };
  $scope.remove = function(stance) {
    return stance.destroy().then(function() {
      return FlashService.success('verify_stances.remove_success');
    });
  };
  LoadingService.listenForLoading($scope);
});

angular.module('loomioApp').factory('MuteExplanationModal', function() {
  return {
    templateUrl: 'generated/components/mute_explanation_modal/mute_explanation_modal.html',
    controller: function($scope, thread, Records, FlashService, ThreadService) {
      $scope.thread = thread;
      $scope.previousVolume = $scope.thread.volume();
      return $scope.muteThread = function() {
        return ThreadService.mute($scope.thread).then(function() {
          return $scope.$close();
        });
      };
    }
  };
});

angular.module('loomioApp').factory('SlackAddedModal', function(Records, ModalService, PollCommonStartModal) {
  return {
    templateUrl: 'generated/components/slack_added_modal/slack_added_modal.html',
    controller: function($scope, group) {
      $scope.group = group;
      return $scope.submit = function() {
        return ModalService.open(PollCommonStartModal, {
          poll: function() {
            return Records.polls.build();
          }
        });
      };
    }
  };
});

angular.module('loomioApp').directive('navbar', function($rootScope, ModalService, AuthModal, AbilityService, AppConfig) {
  return {
    scope: {},
    restrict: 'E',
    templateUrl: 'generated/components/navbar/navbar.html',
    replace: true,
    controller: function($scope) {
      $scope.logo = function() {
        return AppConfig.theme.app_logo_src;
      };
      $scope.isLoggedIn = function() {
        return AbilityService.isLoggedIn();
      };
      $scope.toggleSidebar = function() {
        return $rootScope.$broadcast('toggleSidebar');
      };
      return $scope.signIn = function() {
        return ModalService.open(AuthModal);
      };
    }
  };
});

angular.module('loomioApp').directive('navbarSearch', function($timeout, $location, Records, LmoUrlService) {
  return {
    scope: {},
    restrict: 'E',
    templateUrl: 'generated/components/navbar/navbar_search.html',
    replace: true,
    controller: function($scope) {
      $scope.isOpen = false;
      $scope.$on('currentComponent', function() {
        return $scope.isOpen = false;
      });
      $scope.open = function() {
        $scope.isOpen = true;
        return $timeout(function() {
          return document.querySelector('.navbar-search input').focus();
        });
      };
      $scope.query = '';
      $scope.search = function(query) {
        if (!(query && query.length > 3)) {
          return;
        }
        return Records.searchResults.fetchByFragment(query).then(function() {
          return Records.searchResults.find({
            query: query
          });
        });
      };
      return $scope.goToItem = function(result) {
        if (!result) {
          return;
        }
        $location.path(LmoUrlService.searchResult(result));
        return $scope.query = '';
      };
    }
  };
});

angular.module('loomioApp').directive('searchResult', function() {
  return {
    scope: {
      result: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/navbar/search_result.html',
    replace: true,
    controller: function($scope, $rootScope, Records) {
      var escapeForRegex;
      escapeForRegex = function(str) {
        return str.replace(/\/|\?|\*|\.|\(|\)/g, '');
      };
      $scope.rawDiscussionBlurb = function() {
        return escapeForRegex($scope.result.blurb.replace(/\<\/?b\>/g, ''));
      };
      $scope.showBlurbLeader = function() {
        return !escapeForRegex($scope.result.description).match(RegExp("^" + ($scope.rawDiscussionBlurb())));
      };
      $scope.showBlurbTrailer = function() {
        return !escapeForRegex($scope.result.description).match(RegExp(($scope.rawDiscussionBlurb()) + "$"));
      };
    }
  };
});

angular.module('loomioApp').directive('authAvatar', function() {
  return {
    scope: {
      user: '=?'
    },
    templateUrl: 'generated/components/auth/avatar/auth_avatar.html',
    controller: function($scope) {
      $scope.user = $scope.user || {
        avatarKind: 'initials'
      };
      if (!$scope.user.id && $scope.user.avatarKind === 'initials') {
        return $scope.avatarUser = {
          constructor: {
            singular: 'user'
          },
          avatarKind: 'uploaded',
          avatarUrl: {
            small: '/img/mascot.png',
            medium: '/img/mascot.png',
            large: '/img/mascot.png'
          }
        };
      } else {
        return $scope.avatarUser = $scope.user;
      }
    }
  };
});

angular.module('loomioApp').directive('authComplete', function() {
  return {
    scope: {
      user: '='
    },
    templateUrl: 'generated/components/auth/complete/auth_complete.html'
  };
});

angular.module('loomioApp').directive('authEmailForm', function($translate, AppConfig, KeyEventService, AuthService) {
  return {
    scope: {
      user: '='
    },
    templateUrl: 'generated/components/auth/email_form/auth_email_form.html',
    controller: function($scope) {
      $scope.email = $scope.user.email;
      $scope.submit = function() {
        if (!$scope.validateEmail()) {
          return;
        }
        $scope.$emit('processing');
        $scope.user.email = $scope.email;
        return AuthService.emailStatus($scope.user)["finally"](function() {
          return $scope.$emit('doneProcessing');
        });
      };
      $scope.validateEmail = function() {
        $scope.user.errors = {};
        if (!$scope.email) {
          $scope.user.errors.email = [$translate.instant('auth_form.email_not_present')];
        } else if (!$scope.email.match(/[^\s,;<>]+?@[^\s,;<>]+\.[^\s,;<>]+/g)) {
          $scope.user.errors.email = [$translate.instant('auth_form.invalid_email')];
        }
        return $scope.user.errors.email == null;
      };
      KeyEventService.submitOnEnter($scope, {
        anyEnter: true
      });
      return $scope.$emit('focus');
    }
  };
});

angular.module('loomioApp').directive('authForm', function(AppConfig, LoadingService) {
  return {
    scope: {
      preventClose: '=',
      user: '='
    },
    templateUrl: 'generated/components/auth/form/auth_form.html',
    controller: function($scope) {
      $scope.loginComplete = function() {
        return $scope.user.sentLoginLink || $scope.user.sentPasswordLink;
      };
      if (_.contains(_.pluck(AppConfig.identityProviders, 'name'), (AppConfig.pendingIdentity || {}).identity_type)) {
        $scope.pendingProviderIdentity = AppConfig.pendingIdentity;
      }
      return LoadingService.listenForLoading($scope);
    }
  };
});

angular.module('loomioApp').directive('authIdentityForm', function($translate, AppConfig) {
  return {
    scope: {
      user: '=',
      identity: '='
    },
    templateUrl: 'generated/components/auth/identity_form/auth_identity_form.html',
    controller: function($scope, AuthService, KeyEventService) {
      $scope.siteName = AppConfig.theme.site_name;
      $scope.createAccount = function() {
        $scope.$emit('processing');
        return AuthService.confirmOauth().then((function() {}), function() {
          return $scope.$emit('doneProcessing');
        });
      };
      $scope.submit = function() {
        $scope.$emit('processing');
        $scope.user.email = $scope.email;
        return AuthService.sendLoginLink($scope.user).then((function() {}), function() {
          return $scope.user.errors = {
            email: [$translate.instant('auth_form.email_not_found')]
          };
        })["finally"](function() {
          return $scope.$emit('doneProcessing');
        });
      };
      return KeyEventService.submitOnEnter($scope, {
        anyEnter: true
      });
    }
  };
});

angular.module('loomioApp').directive('authInactiveForm', function(IntercomService) {
  return {
    scope: {
      user: '='
    },
    templateUrl: 'generated/components/auth/inactive_form/auth_inactive_form.html',
    controller: function($scope) {
      return $scope.contactUs = function() {
        return IntercomService.contactUs();
      };
    }
  };
});

angular.module('loomioApp').factory('AuthModal', function(AuthService, Records, AppConfig) {
  return {
    templateUrl: 'generated/components/auth/modal/auth_modal.html',
    controller: function($scope, preventClose) {
      $scope.siteName = AppConfig.theme.site_name;
      $scope.user = AuthService.applyEmailStatus(Records.users.build(), AppConfig.pendingIdentity);
      $scope.preventClose = preventClose;
      $scope.$on('signedIn', $scope.$close);
      $scope.back = function() {
        return $scope.user.emailStatus = null;
      };
      return $scope.showBackButton = function() {
        return $scope.user.emailStatus && !$scope.user.sentLoginLink && !$scope.user.sentPasswordLink;
      };
    }
  };
});

angular.module('loomioApp').directive('authProviderForm', function() {
  return {
    scope: {
      user: '='
    },
    templateUrl: 'generated/components/auth/provider_form/auth_provider_form.html',
    controller: function($scope, $window, AppConfig) {
      $scope.providers = AppConfig.identityProviders;
      return $scope.select = function(provider) {
        $scope.$emit('processing');
        return $window.location = provider.href + "?back_to=" + $window.location.href;
      };
    }
  };
});

angular.module('loomioApp').directive('authSigninForm', function($translate, $window, Session, AuthService, FlashService, KeyEventService) {
  return {
    scope: {
      user: '='
    },
    templateUrl: 'generated/components/auth/signin_form/auth_signin_form.html',
    controller: function($scope) {
      $scope.signIn = function() {
        $scope.$emit('processing');
        return AuthService.signIn($scope.user).then((function() {}), function() {
          $scope.user.errors = $scope.user.hasToken ? {
            token: [$translate.instant('auth_form.invalid_token')]
          } : {
            password: [$translate.instant('auth_form.invalid_password')]
          };
          return $scope.$emit('doneProcessing');
        });
      };
      $scope.sendLoginLink = function() {
        $scope.$emit('processing');
        return AuthService.sendLoginLink($scope.user)["finally"](function() {
          return $scope.$emit('doneProcessing');
        });
      };
      $scope.submit = function() {
        if ($scope.user.hasPassword || $scope.user.hasToken) {
          return $scope.signIn();
        } else {
          return $scope.sendLoginLink();
        }
      };
      KeyEventService.submitOnEnter($scope, {
        anyEnter: true
      });
      return $scope.$emit('focus');
    }
  };
});

angular.module('loomioApp').directive('authSignupForm', function($translate, AppConfig, AuthService, KeyEventService) {
  return {
    scope: {
      user: '='
    },
    templateUrl: 'generated/components/auth/signup_form/auth_signup_form.html',
    controller: function($scope) {
      $scope.vars = {};
      $scope.recaptchaKey = AppConfig.recaptchaKey;
      $scope.name = $scope.user.name;
      $scope.allow = function() {
        return AppConfig.features.app.create_user || AppConfig.pendingIdentity;
      };
      $scope.submit = function() {
        if ($scope.vars.name) {
          $scope.user.errors = {};
          $scope.$emit('processing');
          $scope.user.name = $scope.vars.name;
          return AuthService.signUp($scope.user)["finally"](function() {
            return $scope.$emit('doneProcessing');
          });
        } else {
          return $scope.user.errors = {
            name: [$translate.instant('auth_form.name_required')]
          };
        }
      };
      KeyEventService.submitOnEnter($scope, {
        anyEnter: true
      });
      return $scope.$emit('focus');
    }
  };
});

angular.module('loomioApp').directive('contactForm', function(Session, Records, AbilityService, FormService) {
  return {
    templateUrl: 'generated/components/contact/form/contact_form.html',
    controller: function($scope) {
      $scope.isLoggedIn = function() {
        return AbilityService.isLoggedIn();
      };
      $scope.message = Records.contactMessages.build();
      if ($scope.isLoggedIn()) {
        $scope.message.name = Session.user().name;
        $scope.message.email = Session.user().email;
      }
      return $scope.submit = FormService.submit($scope, $scope.message, {
        flashSuccess: "contact_message_form.new_contact_message"
      });
    }
  };
});

angular.module('loomioApp').factory('ContactModal', function() {
  return {
    templateUrl: 'generated/components/contact/modal/contact_modal.html'
  };
});

angular.module('loomioApp').directive('contactRequestForm', function(Records, FormService, KeyEventService) {
  return {
    scope: {
      user: '='
    },
    templateUrl: 'generated/components/contact_request/form/contact_request_form.html',
    controller: function($scope) {
      $scope.contactRequest = Records.contactRequests.build({
        recipientId: $scope.user.id
      });
      $scope.submit = FormService.submit($scope, $scope.contactRequest, {
        flashSuccess: "contact_request_form.email_sent",
        flashOptions: {
          name: $scope.user.name
        },
        successCallback: function() {
          return $scope.$emit('$close');
        }
      });
      return KeyEventService.submitOnEnter($scope);
    }
  };
});

angular.module('loomioApp').factory('ContactRequestModal', function() {
  return {
    templateUrl: 'generated/components/contact_request/modal/contact_request_modal.html',
    controller: function($scope, user) {
      $scope.user = user;
      return $scope.$on('$close', $scope.$close);
    }
  };
});

angular.module('loomioApp').directive('discussionForm', function() {
  return {
    scope: {
      discussion: '=',
      modal: '=?'
    },
    templateUrl: 'generated/components/discussion/form/discussion_form.html',
    controller: function($scope, $location, Session, AbilityService, PrivacyString) {
      if ($scope.discussion.isNew()) {
        $scope.showGroupSelect = true;
        $scope.discussion.makeAnnouncement = true;
      }
      $scope.availableGroups = function() {
        return _.filter(Session.user().groups(), function(group) {
          return AbilityService.canStartThread(group);
        });
      };
      $scope.restoreDraft = function() {
        if (!(($scope.discussion.group() != null) && $scope.discussion.isNew())) {
          return;
        }
        $scope.discussion.restoreDraft();
        return $scope.updatePrivacy();
      };
      $scope.privacyPrivateDescription = function() {
        return PrivacyString.discussion($scope.discussion, true);
      };
      $scope.updatePrivacy = function() {
        return $scope.discussion["private"] = $scope.discussion.privateDefaultValue();
      };
      return $scope.showPrivacyForm = function() {
        if (!$scope.discussion.group()) {
          return;
        }
        return $scope.discussion.group().discussionPrivacyOptions === 'public_or_private';
      };
    }
  };
});

angular.module('loomioApp').directive('discussionFormActions', function() {
  return {
    scope: {
      discussion: '='
    },
    replace: true,
    templateUrl: 'generated/components/discussion/form_actions/discussion_form_actions.html',
    controller: function($scope, $location, Records, FormService, LmoUrlService, KeyEventService) {
      var actionName;
      actionName = $scope.discussion.isNew() ? 'created' : 'updated';
      $scope.submit = FormService.submit($scope, $scope.discussion, {
        flashSuccess: "discussion_form.messages." + actionName,
        drafts: true,
        successCallback: (function(_this) {
          return function(response) {
            var discussion;
            $scope.$emit('$close');
            _.invoke(Records.documents.find($scope.discussion.removedDocumentIds), 'remove');
            discussion = Records.discussions.find(response.discussions[0].id);
            if (actionName === 'created') {
              return $location.path(LmoUrlService.discussion(discussion));
            }
          };
        })(this)
      });
      return KeyEventService.submitOnEnter($scope);
    }
  };
});

angular.module('loomioApp').factory('DiscussionModal', function() {
  return {
    templateUrl: 'generated/components/discussion/modal/discussion_modal.html',
    controller: function($scope, discussion) {
      return $scope.discussion = discussion.clone();
    }
  };
});

angular.module('loomioApp').directive('discussionPrivacyIcon', function(PrivacyString) {
  return {
    scope: {
      discussion: '=',
      "private": '=?'
    },
    templateUrl: 'generated/components/discussion/privacy_icon/discussion_privacy_icon.html',
    controller: function($scope) {
      if (typeof $scope["private"] === 'undefined') {
        $scope["private"] = $scope.discussion["private"];
      }
      $scope.translateKey = function() {
        if ($scope["private"]) {
          return 'private';
        } else {
          return 'public';
        }
      };
      return $scope.privacyDescription = function() {
        return PrivacyString.discussion($scope.discussion, $scope["private"]);
      };
    }
  };
});

angular.module('loomioApp').directive('groupForm', function(AppConfig, PrivacyString, AbilityService) {
  return {
    scope: {
      group: '=',
      modal: '=?'
    },
    templateUrl: 'generated/components/group/form/group_form.html',
    controller: function($scope) {
      $scope.titleLabel = function() {
        if ($scope.group.isParent()) {
          return "group_form.group_name";
        } else {
          return "group_form.subgroup_name";
        }
      };
      $scope.privacyOptions = function() {
        if ($scope.group.isSubgroup() && $scope.group.parent().groupPrivacy === 'secret') {
          return ['closed', 'secret'];
        } else {
          return ['open', 'closed', 'secret'];
        }
      };
      $scope.privacyStatement = function() {
        return PrivacyString.groupPrivacyStatement($scope.group);
      };
      $scope.privacyStringFor = function(privacy) {
        return PrivacyString.group($scope.group, privacy);
      };
      $scope.showGroupFeatures = function() {
        return AbilityService.isSiteAdmin() && _.any($scope.featureNames);
      };
      return $scope.featureNames = AppConfig.features.group;
    }
  };
});

angular.module('loomioApp').directive('groupFormActions', function() {
  return {
    scope: {
      group: '='
    },
    replace: true,
    templateUrl: 'generated/components/group/form_actions/group_form_actions.html',
    controller: function($scope, Records, FormService, ScrollService, PrivacyString, KeyEventService) {
      var actionName;
      actionName = $scope.group.isNew() ? 'created' : 'updated';
      $scope.submit = FormService.submit($scope, $scope.group, {
        drafts: true,
        skipClose: true,
        prepareFn: function() {
          var allowPublic;
          allowPublic = $scope.group.allowPublicThreads;
          $scope.group.discussionPrivacyOptions = (function() {
            switch ($scope.group.groupPrivacy) {
              case 'open':
                return 'public_only';
              case 'closed':
                if (allowPublic) {
                  return 'public_or_private';
                } else {
                  return 'private_only';
                }
              case 'secret':
                return 'private_only';
            }
          })();
          return $scope.group.parentMembersCanSeeDiscussions = (function() {
            switch ($scope.group.groupPrivacy) {
              case 'open':
                return true;
              case 'closed':
                return $scope.group.parentMembersCanSeeDiscussions;
              case 'secret':
                return false;
            }
          })();
        },
        confirmFn: function(model) {
          return PrivacyString.confirmGroupPrivacyChange(model);
        },
        flashSuccess: function() {
          return "group_form.messages.group_" + actionName;
        },
        successCallback: function(response) {
          var group;
          group = Records.groups.find(response.groups[0].key);
          return $scope.$emit('nextStep', group);
        }
      });
      $scope.expandForm = function() {
        $scope.group.expanded = true;
        return ScrollService.scrollTo('.group-form__permissions', {
          container: '.group-modal md-dialog-content'
        });
      };
      return KeyEventService.submitOnEnter($scope);
    }
  };
});

angular.module('loomioApp').factory('GroupModal', function($location, Records, SequenceService, LmoUrlService) {
  return {
    templateUrl: 'generated/components/group/modal/group_modal.html',
    controller: function($scope, group) {
      $scope.group = group.clone();
      return SequenceService.applySequence($scope, {
        steps: function() {
          if ($scope.group.isNew() || $scope.group.parentId) {
            return ['create', 'invite'];
          } else {
            return ['create'];
          }
        },
        createComplete: function(_, g) {
          $scope.invitationForm = Records.invitationForms.build({
            groupId: g.id
          });
          return $location.path(LmoUrlService.group(g));
        }
      });
    }
  };
});

angular.module('loomioApp').directive('groupSettingCheckbox', function() {
  return {
    scope: {
      group: '=',
      setting: '@',
      translateValues: '=?'
    },
    templateUrl: 'generated/components/group/setting_checkbox/group_setting_checkbox.html',
    controller: function($scope) {
      return $scope.translateKey = function() {
        return "group_form." + (_.snakeCase($scope.setting));
      };
    }
  };
});

angular.module('loomioApp').factory('CoverPhotoForm', function() {
  return {
    templateUrl: 'generated/components/group_page/cover_photo_form/cover_photo_form.html',
    controller: function($scope, $timeout, $rootScope, group, Records, FormService) {
      $scope.selectFile = function() {
        return $timeout(function() {
          return document.querySelector('.cover-photo-form__file-input').click();
        });
      };
      return $scope.upload = FormService.upload($scope, group, {
        uploadKind: 'cover_photo',
        submitFn: group.uploadPhoto,
        loadingMessage: 'common.action.uploading',
        successCallback: function(data) {
          return $rootScope.$broadcast('setBackgroundImageUrl', group);
        },
        flashSuccess: 'cover_photo_form.upload_success'
      });
    }
  };
});

angular.module('loomioApp').directive('descriptionCard', function(Records, ModalService, FormService, AbilityService, DocumentModal) {
  return {
    scope: {
      group: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/group_page/description_card/description_card.html',
    replace: true,
    controller: function($scope) {
      $scope.disableEditor = function() {
        return $scope.editorEnabled = false;
      };
      $scope.canAdministerGroup = function() {
        return AbilityService.canAdministerGroup($scope.group);
      };
      $scope.save = FormService.submit($scope, $scope.group, {
        drafts: true,
        prepareFn: function() {
          return $scope.group.description = $scope.buh.editableDescription;
        },
        flashSuccess: 'description_card.messages.description_updated',
        successCallback: $scope.disableEditor
      });
      return $scope.actions = [
        {
          name: 'edit_group',
          icon: 'mdi-pencil',
          canPerform: function() {
            return AbilityService.canEditGroup($scope.group);
          },
          perform: function() {
            $scope.editorEnabled = true;
            return $scope.buh = {
              editableDescription: $scope.group.description
            };
          }
        }, {
          name: 'add_resource',
          icon: 'mdi-attachment',
          canPerform: function() {
            return AbilityService.canAdministerGroup($scope.group);
          },
          perform: function() {
            return ModalService.open(DocumentModal, {
              doc: function() {
                return Records.documents.build({
                  modelId: $scope.group.id,
                  modelType: 'Group'
                });
              }
            });
          }
        }
      ];
    }
  };
});

angular.module('loomioApp').directive('discussionsCard', function($q, $location, $timeout, Records, RecordLoader, ModalService, DiscussionModal, ThreadQueryService, KeyEventService, LoadingService, AbilityService) {
  return {
    scope: {
      group: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/group_page/discussions_card/discussions_card.html',
    replace: true,
    controller: function($scope) {
      $scope.init = function(filter) {
        $scope.filter = filter || 'show_opened';
        $scope.pinned = ThreadQueryService.queryFor({
          name: "group_" + $scope.group.key + "_pinned",
          group: $scope.group,
          filters: ['show_pinned', $scope.filter],
          overwrite: true
        });
        $scope.discussions = ThreadQueryService.queryFor({
          name: "group_" + $scope.group.key + "_unpinned",
          group: $scope.group,
          filters: ['hide_pinned', $scope.filter],
          overwrite: true
        });
        $scope.loader = new RecordLoader({
          collection: 'discussions',
          params: {
            group_id: $scope.group.id,
            filter: $scope.filter
          }
        });
        return $scope.loader.fetchRecords();
      };
      $scope.init($location.search().filter);
      $scope.$on('subgroupsLoaded', function() {
        return $scope.init($scope.filter);
      });
      $scope.searchThreads = function() {
        if (!$scope.fragment) {
          return $q.when();
        }
        return Records.discussions.search($scope.group.key, $scope.fragment, {
          per: 10
        }).then(function(data) {
          return $scope.searched = ThreadQueryService.queryFor({
            name: "group_" + $scope.group.key + "_searched",
            group: $scope.group,
            ids: _.pluck(data.discussions, 'id'),
            overwrite: true
          });
        });
      };
      LoadingService.applyLoadingFunction($scope, 'searchThreads');
      $scope.openDiscussionModal = function() {
        return ModalService.open(DiscussionModal, {
          discussion: function() {
            return Records.discussions.build({
              groupId: $scope.group.id
            });
          }
        });
      };
      $scope.loading = function() {
        return $scope.loader.loadingFirst || $scope.searchThreadsExecuting;
      };
      $scope.isEmpty = function() {
        if ($scope.loading()) {
          return;
        }
        if ($scope.fragment) {
          return !$scope.searched || !$scope.searched.any();
        } else {
          return !$scope.discussions.any() && !$scope.pinned.any();
        }
      };
      $scope.canViewPrivateContent = function() {
        return AbilityService.canViewPrivateContent($scope.group);
      };
      $scope.openSearch = function() {
        $scope.searchOpen = true;
        return $timeout(function() {
          return document.querySelector('.discussions-card__search input').focus();
        });
      };
      $scope.closeSearch = function() {
        $scope.fragment = null;
        return $scope.searchOpen = false;
      };
      return $scope.canStartThread = function() {
        return AbilityService.canStartThread($scope.group);
      };
    }
  };
});

angular.module('loomioApp').directive('groupActionsDropdown', function() {
  return {
    scope: {
      group: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/group_page/group_actions_dropdown/group_actions_dropdown.html',
    replace: true,
    controller: function($scope, $window, AppConfig, AbilityService, Session, ChangeVolumeForm, ModalService, GroupModal, LeaveGroupForm, ArchiveGroupForm, Records) {
      $scope.canAdministerGroup = function() {
        return AbilityService.canAdministerGroup($scope.group);
      };
      $scope.canEditGroup = (function(_this) {
        return function() {
          return AbilityService.canEditGroup($scope.group);
        };
      })(this);
      $scope.canAddSubgroup = function() {
        return AbilityService.canCreateSubgroups($scope.group);
      };
      $scope.canArchiveGroup = (function(_this) {
        return function() {
          return AbilityService.canArchiveGroup($scope.group);
        };
      })(this);
      $scope.canLeaveGroup = (function(_this) {
        return function() {
          return AbilityService.canLeaveGroup($scope.group);
        };
      })(this);
      $scope.canChangeVolume = function() {
        return AbilityService.canChangeGroupVolume($scope.group);
      };
      $scope.openChangeVolumeForm = function() {
        return ModalService.open(ChangeVolumeForm, {
          model: function() {
            return $scope.group.membershipFor(Session.user());
          }
        });
      };
      $scope.editGroup = function() {
        return ModalService.open(GroupModal, {
          group: function() {
            return $scope.group;
          }
        });
      };
      $scope.addSubgroup = function() {
        return ModalService.open(GroupModal, {
          group: function() {
            return Records.groups.build({
              parentId: $scope.group.id
            });
          }
        });
      };
      $scope.leaveGroup = function() {
        return ModalService.open(LeaveGroupForm, {
          group: function() {
            return $scope.group;
          }
        });
      };
      $scope.archiveGroup = function() {
        return ModalService.open(ArchiveGroupForm, {
          group: function() {
            return $scope.group;
          }
        });
      };
    }
  };
});

angular.module('loomioApp').directive('groupPrivacyButton', function() {
  return {
    restrict: 'E',
    templateUrl: 'generated/components/group_page/group_privacy_button/group_privacy_button.html',
    replace: true,
    scope: {
      group: '='
    },
    controller: function($scope, PrivacyString) {
      $scope.iconClass = function() {
        switch ($scope.group.groupPrivacy) {
          case 'open':
            return 'mdi-earth';
          case 'closed':
            return 'mdi-lock-outline';
          case 'secret':
            return 'mdi-lock-outline';
        }
      };
      return $scope.privacyDescription = function() {
        return PrivacyString.group($scope.group);
      };
    }
  };
});

angular.module('loomioApp').directive('groupTheme', function() {
  return {
    scope: {
      group: '=',
      homePage: '=',
      compact: '=',
      discussion: '=?'
    },
    restrict: 'E',
    templateUrl: 'generated/components/group_page/group_theme/group_theme.html',
    replace: true,
    controller: function($scope, $rootScope, Session, AbilityService, ModalService, CoverPhotoForm, LogoPhotoForm) {
      $rootScope.$broadcast('setBackgroundImageUrl', $scope.group);
      $scope.logoStyle = function() {
        return {
          'background-image': "url(" + ($scope.group.logoUrl()) + ")"
        };
      };
      $scope.canPerformActions = function() {
        return AbilityService.isSiteAdmin() || AbilityService.canLeaveGroup($scope.group);
      };
      $scope.canUploadPhotos = function() {
        return $scope.homePage && AbilityService.canAdministerGroup($scope.group);
      };
      $scope.openUploadCoverForm = function() {
        return ModalService.open(CoverPhotoForm, {
          group: (function(_this) {
            return function() {
              return $scope.group;
            };
          })(this)
        });
      };
      return $scope.openUploadLogoForm = function() {
        return ModalService.open(LogoPhotoForm, {
          group: (function(_this) {
            return function() {
              return $scope.group;
            };
          })(this)
        });
      };
    }
  };
});

angular.module('loomioApp').directive('joinGroupButton', function() {
  return {
    scope: {
      group: '=',
      block: '=?'
    },
    restrict: 'E',
    templateUrl: 'generated/components/group_page/join_group_button/join_group_button.html',
    replace: true,
    controller: function($rootScope, $scope, AbilityService, ModalService, AuthModal, Session, Records, FlashService, MembershipRequestForm) {
      Records.membershipRequests.fetchMyPendingByGroup($scope.group.key);
      $scope.isMember = function() {
        return Session.user().membershipFor($scope.group) != null;
      };
      $scope.canJoinGroup = function() {
        return AbilityService.canJoinGroup($scope.group);
      };
      $scope.canRequestMembership = function() {
        return AbilityService.canRequestMembership($scope.group);
      };
      $scope.hasRequestedMembership = function() {
        return $scope.group.hasPendingMembershipRequestFrom(Session.user());
      };
      $scope.askToJoinText = function() {
        if ($scope.hasRequestedMembership()) {
          return 'join_group_button.membership_requested';
        } else {
          return 'join_group_button.ask_to_join_group';
        }
      };
      $scope.joinGroup = function() {
        if (AbilityService.isLoggedIn()) {
          return Records.memberships.joinGroup($scope.group).then(function() {
            $rootScope.$broadcast('joinedGroup');
            return FlashService.success('join_group_button.messages.joined_group', {
              group: $scope.group.fullName
            });
          });
        } else {
          return ModalService.open(AuthModal);
        }
      };
      $scope.requestToJoinGroup = function() {
        if (AbilityService.isLoggedIn()) {
          return ModalService.open(MembershipRequestForm, {
            group: function() {
              return $scope.group;
            }
          });
        } else {
          return ModalService.open(AuthModal);
        }
      };
      return $scope.isLoggedIn = function() {
        return AbilityService.isLoggedIn();
      };
    }
  };
});

angular.module('loomioApp').factory('LogoPhotoForm', function() {
  return {
    scope: {
      group: '='
    },
    templateUrl: 'generated/components/group_page/logo_photo_form/logo_photo_form.html',
    controller: function($scope, $timeout, group, Records, FormService) {
      $scope.selectFile = function() {
        return $timeout(function() {
          return document.querySelector('.logo-photo-form__file-input').click();
        });
      };
      return $scope.upload = FormService.upload($scope, group, {
        uploadKind: 'logo',
        submitFn: group.uploadPhoto,
        loadingMessage: 'common.action.uploading',
        flashSuccess: 'logo_photo_form.upload_success'
      });
    }
  };
});

angular.module('loomioApp').directive('membersCard', function() {
  return {
    scope: {
      group: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/group_page/members_card/members_card.html',
    controller: function($scope, Records, AbilityService, ModalService, InvitationModal) {
      $scope.canViewMemberships = function() {
        return AbilityService.canViewMemberships($scope.group);
      };
      $scope.canAddMembers = function() {
        return AbilityService.canAddMembers($scope.group);
      };
      $scope.isAdmin = function() {
        return AbilityService.canAdministerGroup($scope.group);
      };
      $scope.memberIsAdmin = function(member) {
        return $scope.group.membershipFor(member).admin;
      };
      $scope.showMembersPlaceholder = function() {
        return AbilityService.canAdministerGroup($scope.group) && $scope.group.memberships().length <= 1;
      };
      $scope.invitePeople = function() {
        return ModalService.open(InvitationModal, {
          group: function() {
            return $scope.group;
          }
        });
      };
      if ($scope.canViewMemberships()) {
        return Records.memberships.fetchByGroup($scope.group.key, {
          per: 10
        });
      }
    }
  };
});

angular.module('loomioApp').factory('MembershipRequestForm', function() {
  return {
    templateUrl: 'generated/components/group_page/membership_request_form/membership_request_form.html',
    controller: function($scope, FormService, Records, group, AbilityService, Session) {
      $scope.membershipRequest = Records.membershipRequests.build({
        groupId: group.id,
        name: Session.user().name,
        email: Session.user().email
      });
      $scope.submit = FormService.submit($scope, $scope.membershipRequest, {
        flashSuccess: 'membership_request_form.messages.membership_requested',
        flashOptions: {
          group: group.fullName
        }
      });
      $scope.isLoggedIn = function() {
        return AbilityService.isLoggedIn();
      };
    }
  };
});

angular.module('loomioApp').directive('membershipRequestsCard', function() {
  return {
    scope: {
      group: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/group_page/membership_requests_card/membership_requests_card.html',
    replace: true,
    controller: function($scope, Records, AbilityService) {
      $scope.canManageMembershipRequests = function() {
        return AbilityService.canManageMembershipRequests($scope.group);
      };
      if ($scope.canManageMembershipRequests()) {
        return Records.membershipRequests.fetchPendingByGroup($scope.group.key);
      }
    }
  };
});

angular.module('loomioApp').directive('subgroupsCard', function($rootScope, Records, AbilityService, ModalService, GroupModal) {
  return {
    scope: {
      group: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/group_page/subgroups_card/subgroups_card.html',
    replace: true,
    controller: function($scope) {
      $scope.show = function() {
        return $scope.group.isParent();
      };
      Records.groups.fetchByParent($scope.group).then(function() {
        return $rootScope.$broadcast('subgroupsLoaded', $scope.group);
      });
      $scope.canCreateSubgroups = function() {
        return AbilityService.canCreateSubgroups($scope.group);
      };
      return $scope.startSubgroup = function() {
        return ModalService.open(GroupModal, {
          group: function() {
            return Records.groups.build({
              parentId: $scope.group.id
            });
          }
        });
      };
    }
  };
});

angular.module('loomioApp').directive('installSlackCard', function(ModalService, AbilityService, InstallSlackModal, ConfirmModal, AppConfig) {
  return {
    scope: {
      group: '='
    },
    templateUrl: 'generated/components/install_slack/card/install_slack_card.html',
    controller: function($scope) {
      $scope.show = function() {
        return AppConfig.providerFor('slack') && AbilityService.canAdministerGroup($scope.group);
      };
      $scope.groupIdentity = function() {
        return $scope.group.groupIdentityFor('slack');
      };
      $scope.install = function() {
        return ModalService.open(InstallSlackModal, {
          group: function() {
            return $scope.group;
          }
        });
      };
      $scope.canRemoveIdentity = function() {
        return AbilityService.canAdministerGroup($scope.group);
      };
      return $scope.remove = function() {
        return ModalService.open(ConfirmModal, {
          forceSubmit: function() {
            return false;
          },
          submit: function() {
            return $scope.groupIdentity().destroy;
          },
          text: function() {
            return {
              title: 'install_slack.card.confirm_remove_title',
              helptext: 'install_slack.card.confirm_remove_helptext',
              flash: 'install_slack.card.identity_removed'
            };
          }
        });
      };
    }
  };
});

angular.module('loomioApp').directive('installSlackDecideForm', function(Session, Records, PollService) {
  return {
    templateUrl: 'generated/components/install_slack/decide_form/install_slack_decide_form.html',
    controller: function($scope) {
      $scope.poll = Records.polls.build({
        groupId: Session.currentGroupId()
      });
      return PollService.applyPollStartSequence($scope);
    }
  };
});

angular.module('loomioApp').directive('installSlackForm', function(FormService, SequenceService, Session, Records, LoadingService, LmoUrlService) {
  return {
    scope: {
      group: '='
    },
    templateUrl: 'generated/components/install_slack/form/install_slack_form.html',
    controller: function($scope) {
      SequenceService.applySequence($scope, {
        steps: ['install', 'invite', 'decide'],
        initialStep: $scope.group ? 'invite' : 'install',
        installComplete: function(_, group) {
          return $scope.group = group;
        }
      });
      return LoadingService.listenForLoading($scope);
    }
  };
});

angular.module('loomioApp').directive('installSlackInstallForm', function($location, KeyEventService, FormService, Session, Records, LmoUrlService) {
  return {
    templateUrl: 'generated/components/install_slack/install_form/install_slack_install_form.html',
    controller: function($scope) {
      var newGroup;
      $scope.groups = function() {
        return _.filter(_.sortBy(Session.user().adminGroups(), 'fullName'));
      };
      newGroup = Records.groups.build({
        name: Session.user().identityFor('slack').customFields.slack_team_name
      });
      $scope.toggleExistingGroup = function() {
        return $scope.setSubmit($scope.group.id ? newGroup : _.first($scope.groups()));
      };
      $scope.setSubmit = function(group) {
        $scope.group = group;
        return $scope.submit = FormService.submit($scope, $scope.group, {
          prepareFn: function() {
            $scope.$emit('processing');
            return $scope.group.identityId = Session.user().identityFor('slack').id;
          },
          flashSuccess: 'install_slack.install.slack_installed',
          skipClose: true,
          successCallback: function(response) {
            var g;
            g = Records.groups.find(response.groups[0].key);
            $location.path(LmoUrlService.group(g));
            return $scope.$emit('nextStep', g);
          }
        });
      };
      $scope.setSubmit(_.first($scope.groups()) || newGroup);
      KeyEventService.submitOnEnter($scope, {
        anyEnter: true
      });
      $scope.$on('focus', $scope.focus);
    }
  };
});

angular.module('loomioApp').directive('installSlackInviteForm', function($timeout, Session, FormService, KeyEventService, Records) {
  return {
    scope: {
      group: '='
    },
    templateUrl: 'generated/components/install_slack/invite_form/install_slack_invite_form.html',
    controller: function($scope) {
      $scope.groupIdentity = Records.groupIdentities.build({
        groupId: $scope.group.id,
        identityType: 'slack',
        makeAnnouncement: true
      });
      $scope.fetchChannels = function() {
        if ($scope.channels) {
          return;
        }
        return Records.identities.performCommand(Session.user().identityFor('slack').id, 'channels').then(function(response) {
          return $scope.channels = response;
        }, function(response) {
          return $scope.error = response.data.error;
        });
      };
      $scope.submit = FormService.submit($scope, $scope.groupIdentity, {
        prepareFn: function() {
          $scope.$emit('processing');
          return $scope.groupIdentity.customFields.slack_channel_name = '#' + _.find($scope.channels, function(c) {
            return c.id === $scope.groupIdentity.customFields.slack_channel_id;
          }).name;
        },
        successCallback: function() {
          return $scope.$emit('nextStep');
        },
        cleanupFn: function() {
          return $scope.$emit('doneProcessing');
        }
      });
      KeyEventService.submitOnEnter($scope, {
        anyEnter: true
      });
      return $scope.$emit('focus');
    }
  };
});

angular.module('loomioApp').directive('installSlackInvitePreview', function(Session, $timeout) {
  return {
    templateUrl: 'generated/components/install_slack/invite_preview/install_slack_invite_preview.html',
    controller: function($scope) {
      return $timeout(function() {
        $scope.group = Session.currentGroup;
        $scope.userName = Session.user().name;
        return $scope.timestamp = function() {
          return moment().format('h:ma');
        };
      });
    }
  };
});

angular.module('loomioApp').factory('InstallSlackModal', function($location, $timeout, $window, Session) {
  return {
    templateUrl: 'generated/components/install_slack/modal/install_slack_modal.html',
    controller: function($scope, group, preventClose) {
      $scope.hasIdentity = Session.user().identityFor('slack');
      $scope.redirect = function() {
        $location.search('install_slack', true);
        return $window.location.href = '/slack/oauth';
      };
      if (!$scope.hasIdentity) {
        $timeout($scope.redirect, 500);
      }
      $scope.$on('$close', $scope.$close);
      $scope.group = group;
      return $scope.preventClose = preventClose;
    }
  };
});

angular.module('loomioApp').directive('installSlackProgress', function(Session) {
  return {
    scope: {
      slackProgress: '='
    },
    templateUrl: 'generated/components/install_slack/progress/install_slack_progress.html',
    controller: function($scope) {
      return $scope.progressPercent = function() {
        return $scope.slackProgress + "%";
      };
    }
  };
});

angular.module('loomioApp').factory('AddMembersModal', function() {
  return {
    templateUrl: 'generated/components/invitation/add_members_modal/add_members_modal.html',
    controller: function($scope, Records, LoadingService, group, AppConfig, FlashService, ModalService, InvitationModal) {
      $scope.isDisabled = false;
      $scope.group = group;
      $scope.loading = true;
      $scope.selectedIds = [];
      $scope.load = function() {
        return Records.memberships.fetchByGroup(group.parent().key, {
          per: group.parent().membershipsCount
        });
      };
      $scope.members = function() {
        return _.filter(group.parent().members(), function(user) {
          return !user.isMemberOf(group);
        });
      };
      $scope.select = function(member) {
        if ($scope.isSelected(member)) {
          return _.pull($scope.selectedIds, member.id);
        } else {
          return $scope.selectedIds.push(member.id);
        }
      };
      $scope.isSelected = function(member) {
        return _.contains($scope.selectedIds, member.id);
      };
      $scope.canAddMembers = function() {
        return $scope.members().length > 0;
      };
      LoadingService.applyLoadingFunction($scope, 'load');
      $scope.load();
      $scope.reopenInvitationsForm = function() {
        return ModalService.open(InvitationModal, {
          group: function() {
            return $scope.group;
          }
        });
      };
      return $scope.submit = function() {
        $scope.isDisabled = true;
        return Records.memberships.addUsersToSubgroup({
          groupId: $scope.group.id,
          userIds: $scope.selectedIds
        }).then(function(data) {
          var user;
          if (data.memberships.length === 1) {
            user = Records.users.find(_.first($scope.selectedIds));
            FlashService.success('add_members_modal.user_added_to_subgroup', {
              name: user.name
            });
          } else {
            FlashService.success('add_members_modal.users_added_to_subgroup', {
              count: data.memberships.length
            });
          }
          return $scope.$close();
        })["finally"](function() {
          return $scope.isDisabled = false;
        });
      };
    }
  };
});

angular.module('loomioApp').directive('invitationForm', function() {
  return {
    scope: {
      invitationForm: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/invitation/form/invitation_form.html',
    controller: function($scope, Records, Session, AbilityService, FlashService, ModalService, AddMembersModal) {
      $scope.selectGroup = _.isNumber($scope.invitationForm.groupId);
      $scope.availableGroups = function() {
        return _.filter(Session.user().groups(), function(g) {
          return AbilityService.canAddMembers(g);
        });
      };
      $scope.fetchShareableInvitation = function() {
        return Records.invitations.fetchShareableInvitationByGroupId($scope.invitationForm.groupId);
      };
      $scope.fetchShareableInvitation();
      $scope.addMembers = function() {
        return ModalService.open(AddMembersModal, {
          group: function() {
            return $scope.group();
          }
        });
      };
      $scope.maxInvitations = function() {
        return $scope.invitationForm.invitees().length > 100;
      };
      $scope.invalidEmail = function() {
        return $scope.invitationForm.hasEmails() && !$scope.invitationForm.hasInvitees();
      };
      $scope.group = function() {
        return Records.groups.find($scope.invitationForm.groupId);
      };
      $scope.copied = function() {
        return FlashService.success('common.copied');
      };
      $scope.invitationLink = function() {
        if (!($scope.group() && $scope.group().shareableInvitation())) {
          return;
        }
        return $scope.group().shareableInvitation().url;
      };
    }
  };
});

angular.module('loomioApp').directive('invitationFormActions', function() {
  return {
    scope: {
      invitationForm: '='
    },
    templateUrl: 'generated/components/invitation/form_actions/invitation_form_actions.html',
    controller: function($scope, Records, LoadingService, FormService, FlashService) {
      var submitForm;
      $scope.submit = function() {
        if ($scope.invitationForm.hasInvitees()) {
          return submitForm();
        } else {
          return $scope.$emit('nextStep');
        }
      };
      submitForm = FormService.submit($scope, $scope.invitationForm, {
        submitFn: Records.invitations.sendByEmail,
        successCallback: (function(_this) {
          return function(response) {
            var invitationCount;
            $scope.$emit('nextStep');
            invitationCount = response.invitations.length;
            switch (invitationCount) {
              case 0:
                return $scope.noInvitations = true;
              case 1:
                return FlashService.success('invitation_form.messages.invitation_sent');
              default:
                return FlashService.success('invitation_form.messages.invitations_sent', {
                  count: invitationCount
                });
            }
          };
        })(this)
      });
      $scope.submitText = function() {
        if ($scope.invitationForm.hasEmails()) {
          return 'common.action.send';
        } else {
          return 'invitation_form.done';
        }
      };
      return $scope.canSubmit = function() {
        if (!$scope.invitationForm.hasEmails()) {
          return true;
        }
        return !$scope.isDisabled && $scope.invitationForm.invitees().length > 0 && $scope.invitationForm.invitees().length < 100;
      };
    }
  };
});

angular.module('loomioApp').factory('InvitationModal', function() {
  return {
    templateUrl: 'generated/components/invitation/modal/invitation_modal.html',
    controller: function($scope, group, Records, LoadingService, FormService) {
      $scope.$on('nextStep', $scope.$close);
      $scope.invitationForm = Records.invitationForms.build({
        groupId: (group || {}).id
      });
      return $scope.groupName = function() {
        return (Records.groups.find($scope.invitationForm.groupId) || {}).name;
      };
    }
  };
});

angular.module('loomioApp').factory('CancelInvitationForm', function() {
  return {
    templateUrl: 'generated/components/memberships_page/cancel_invitation_form/cancel_invitation_form.html',
    controller: function($scope, invitation, FlashService, Records, FormService) {
      $scope.invitation = invitation;
      return $scope.submit = FormService.submit($scope, $scope.invitation, {
        submitFn: $scope.invitation.destroy,
        flashSuccess: 'cancel_invitation_form.messages.success'
      });
    }
  };
});

angular.module('loomioApp').directive('membershipsPanel', function($translate, Session, AbilityService, ModalService, Records, FlashService, RemoveMembershipForm, InvitationModal) {
  return {
    scope: {
      memberships: '=',
      group: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/memberships_page/memberships_panel/memberships_panel.html',
    replace: true,
    controller: function($scope) {
      $scope.canAdministerGroup = function() {
        return AbilityService.canAdministerGroup($scope.group);
      };
      $scope.canRemoveMembership = function(membership) {
        return AbilityService.canRemoveMembership(membership);
      };
      $scope.canToggleAdmin = function(membership) {
        return AbilityService.canAdministerGroup($scope.group) && (!membership.admin || $scope.canRemoveMembership(membership));
      };
      $scope.toggleAdmin = function(membership) {
        var method;
        method = membership.admin ? 'removeAdmin' : 'makeAdmin';
        if (membership.admin && membership.user() === Session.user() && !confirm($translate.instant('memberships_page.remove_admin_from_self.question'))) {
          return;
        }
        return Records.memberships[method](membership).then(function() {
          return FlashService.success("memberships_page.messages." + (_.snakeCase(method)) + "_success", {
            name: membership.userName()
          });
        });
      };
      $scope.openRemoveForm = function(membership) {
        return ModalService.open(RemoveMembershipForm, {
          membership: function() {
            return membership;
          }
        });
      };
      $scope.canAddMembers = function() {
        return AbilityService.canAddMembers($scope.group);
      };
      return $scope.invitePeople = function() {
        return ModalService.open(InvitationModal, {
          group: (function(_this) {
            return function() {
              return $scope.group;
            };
          })(this)
        });
      };
    }
  };
});

angular.module('loomioApp').directive('pendingInvitationsCard', function(FlashService, Session, Records, ModalService, LoadingService, CancelInvitationForm, AppConfig) {
  return {
    scope: {
      group: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/memberships_page/pending_invitations_card/pending_invitations_card.html',
    replace: true,
    controller: function($scope) {
      $scope.canSeeInvitations = function() {
        return Session.user().isAdminOf($scope.group);
      };
      if ($scope.canSeeInvitations()) {
        Records.invitations.fetchPendingByGroup($scope.group.key, {
          per: 1000
        });
      }
      $scope.openCancelForm = function(invitation) {
        return ModalService.open(CancelInvitationForm, {
          invitation: function() {
            return invitation;
          }
        });
      };
      $scope.invitationCreatedAt = function(invitation) {
        return moment(invitation.createdAt).format('DD MMM YY');
      };
      $scope.resend = function(invitation) {
        invitation.resending = true;
        return invitation.resend().then(function() {
          return FlashService.success('common.action.resent');
        })["finally"](function() {
          return invitation.resending = false;
        });
      };
      return $scope.copied = function() {
        return FlashService.success('common.copied');
      };
    }
  };
});

angular.module('loomioApp').directive('documentCard', function(Records, LoadingService, ModalService, DocumentModal) {
  return {
    scope: {
      group: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/document/card/document_card.html',
    controller: function($scope) {
      $scope.init = function() {
        return Records.documents.fetchByGroup($scope.group, null, {
          per: 3
        }).then(function(data) {
          var documents;
          documents = Records.documents.find(_.pluck(data.documents, 'id'));
          return $scope.model = {
            isNew: function() {
              return true;
            },
            hasDocuments: function() {
              return _.any(documents);
            },
            newAndPersistedDocuments: function() {
              return documents;
            }
          };
        });
      };
      $scope.init();
      return $scope.addDocument = function() {
        return ModalService.open(DocumentModal, {
          doc: (function(_this) {
            return function() {
              return Records.documents.build({
                modelId: $scope.group.id,
                modelType: 'Group'
              });
            };
          })(this)
        });
      };
    }
  };
});

angular.module('loomioApp').directive('documentForm', function($timeout, Records, SequenceService) {
  return {
    templateUrl: 'generated/components/document/form/document_form.html',
    controller: function($scope) {
      return $scope.$on('initializeDocument', function(_, doc, $mdMenu) {
        $timeout(function() {
          if ($mdMenu) {
            return $mdMenu.open();
          }
        });
        $scope.document = doc.clone();
        return SequenceService.applySequence($scope, {
          steps: ['method', 'url', 'title'],
          skipClose: $mdMenu != null,
          initialStep: $scope.document.isNew() ? 'method' : 'title',
          methodComplete: function(_, method) {
            return $scope.document.method = method;
          },
          urlComplete: function(_, doc) {
            $scope.document.id = doc.id;
            $scope.document.url = doc.url;
            return $scope.document.title = doc.title;
          },
          titleComplete: function(event, doc) {
            if (!$mdMenu) {
              return;
            }
            event.stopPropagation();
            $mdMenu.close();
            return $scope.$emit('documentAdded', doc);
          }
        });
      });
    }
  };
});

angular.module('loomioApp').directive('documentList', function(Records, AbilityService, ModalService, DocumentModal, ConfirmModal) {
  return {
    scope: {
      model: '=',
      showEdit: '=?',
      hidePreview: '=?'
    },
    replace: true,
    templateUrl: 'generated/components/document/list/document_list.html',
    controller: function($scope) {
      if (!$scope.model.isNew()) {
        Records.documents.fetchByModel($scope.model);
      }
      $scope.showTitle = function() {
        return ($scope.model.showDocumentTitle || $scope.showEdit) && ($scope.model.hasDocuments() || $scope.placeholder);
      };
      return $scope.edit = function(doc, $mdMenu) {
        return $scope.$broadcast('initializeDocument', doc, $mdMenu);
      };
    }
  };
});

angular.module('loomioApp').directive('documentListEdit', function() {
  return {
    scope: {
      document: '='
    },
    replace: true,
    templateUrl: 'generated/components/document/list_edit/document_list_edit.html'
  };
});

angular.module('loomioApp').directive('documentManagement', function(AbilityService, ModalService, ConfirmModal, DocumentModal) {
  return {
    scope: {
      group: '=',
      fragment: '=',
      filter: '@',
      header: '@'
    },
    templateUrl: 'generated/components/document/management/document_management.html',
    controller: function($scope) {
      $scope.documents = function() {
        return _.filter($scope.group.allDocuments(), function(doc) {
          if ($scope.filter === 'group' && doc.model() !== $scope.group) {
            return false;
          }
          if ($scope.filter === 'content' && doc.model() === $scope.group) {
            return false;
          }
          return _.isEmpty($scope.fragment) || doc.title.match(RegExp("" + $scope.fragment, "i"));
        });
      };
      $scope.hasDocuments = function() {
        return _.any($scope.documents());
      };
      $scope.canAdministerGroup = function() {
        return AbilityService.canAdministerGroup(this.group);
      };
      $scope.edit = function(doc) {
        return ModalService.open(DocumentModal, {
          doc: function() {
            return doc;
          }
        });
      };
      return $scope.remove = function(doc) {
        return ModalService.open(ConfirmModal, {
          forceSubmit: function() {
            return false;
          },
          submit: function() {
            return doc.destroy;
          },
          text: function() {
            return {
              title: 'documents_page.confirm_remove_title',
              helptext: 'documents_page.confirm_remove_helptext',
              flash: 'documents_page.document_removed'
            };
          }
        });
      };
    }
  };
});

angular.module('loomioApp').directive('documentMethodForm', function() {
  return {
    scope: {
      document: '='
    },
    templateUrl: 'generated/components/document/method_form/document_method_form.html'
  };
});

angular.module('loomioApp').factory('DocumentModal', function($timeout, LoadingService) {
  return {
    templateUrl: 'generated/components/document/modal/document_modal.html',
    controller: function($scope, doc) {
      $scope.document = doc.clone();
      LoadingService.listenForLoading($scope);
      return $timeout(function() {
        return $scope.$emit('initializeDocument', $scope.document);
      });
    }
  };
});

angular.module('loomioApp').directive('documentTitleForm', function(Records, FormService, ModalService, KeyEventService, ConfirmModal) {
  return {
    scope: {
      document: '='
    },
    templateUrl: 'generated/components/document/title_form/document_title_form.html',
    controller: function($scope) {
      $scope.submit = FormService.submit($scope, $scope.document, {
        flashSuccess: "document.flash.success",
        successCallback: function(data) {
          return $scope.$emit('nextStep', Records.documents.find(data.documents[0].id));
        }
      });
      return KeyEventService.submitOnEnter($scope, {
        anyEnter: true
      });
    }
  };
});

angular.module('loomioApp').directive('documentUploadForm', function(Records) {
  return {
    scope: {
      model: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/document/upload_form/document_upload_form.html',
    replace: true,
    controller: function($scope, $element) {
      $scope.$on('filesPasted', function(_, files) {
        return $scope.files = files;
      });
      $scope.$watch('files', function() {
        return $scope.upload($scope.files);
      });
      $scope.upload = function() {
        var file, i, len, ref, results;
        if (!$scope.files) {
          return;
        }
        $scope.model.setErrors({});
        $scope.$emit('processing');
        ref = $scope.files;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          file = ref[i];
          $scope.currentUpload = Records.documents.upload(file, $scope.progress);
          results.push($scope.currentUpload.then($scope.success, $scope.failure)["finally"]($scope.reset));
        }
        return results;
      };
      $scope.selectFile = function() {
        return $element.find('input')[0].click();
      };
      $scope.progress = function(progress) {
        return $scope.percentComplete = Math.floor(100 * progress.loaded / progress.total);
      };
      $scope.abort = function() {
        if ($scope.currentUpload) {
          return $scope.currentUpload.abort();
        }
      };
      $scope.success = function(response) {
        return $scope.$emit('documentAdded', Records.documents.find((response.data || response).documents[0].id));
      };
      $scope.failure = function(response) {
        return $scope.model.setErrors(response.data.errors);
      };
      $scope.reset = function() {
        $scope.$emit('doneProcessing');
        $scope.files = $scope.currentUpload = null;
        return $scope.percentComplete = 0;
      };
      return $scope.reset();
    }
  };
});

angular.module('loomioApp').directive('documentUrlForm', function($translate, AppConfig, Records, DocumentService, KeyEventService) {
  return {
    scope: {
      document: '='
    },
    templateUrl: 'generated/components/document/url_form/document_url_form.html',
    controller: function($scope) {
      $scope.model = Records.discussions.build();
      $scope.submit = function() {
        $scope.model.setErrors({});
        if ($scope.model.url.toString().match(AppConfig.regex.url.source)) {
          $scope.document.url = $scope.model.url;
          return $scope.$emit('nextStep', $scope.document);
        } else {
          return $scope.model.setErrors({
            url: [$translate.instant('document.error.invalid_format')]
          });
        }
      };
      $scope.$on('documentAdded', function(event, doc) {
        event.stopPropagation();
        return $scope.$emit('nextStep', doc);
      });
      KeyEventService.submitOnEnter($scope, {
        anyEnter: true
      });
      return DocumentService.listenForPaste($scope);
    }
  };
});

angular.module('loomioApp').directive('reactionsDisplay', function(Session, Records, EmojiService) {
  return {
    scope: {
      model: '=',
      load: '@'
    },
    restrict: 'E',
    templateUrl: 'generated/components/reactions/display/reactions_display.html',
    replace: true,
    controller: function($scope) {
      var reactionParams;
      $scope.diameter = 16;
      reactionParams = function() {
        return {
          reactableType: _.capitalize($scope.model.constructor.singular),
          reactableId: $scope.model.id
        };
      };
      $scope.removeMine = function(reaction) {
        var mine;
        mine = Records.reactions.find(_.merge(reactionParams(), {
          userId: Session.user().id,
          reaction: reaction
        }))[0];
        if (mine) {
          return mine.destroy();
        }
      };
      $scope.myReaction = function() {
        return Records.reactions.find(_.merge(reactionParams(), {
          userId: Session.user().id
        }))[0];
      };
      $scope.otherReaction = function() {
        return Records.reactions.find(_.merge(reactionParams(), {
          userId: {
            '$ne': Session.user().id
          }
        }))[0];
      };
      $scope.reactionTypes = function() {
        return _.difference(_.keys($scope.reactionHash()), ['all']);
      };
      $scope.reactionHash = _.throttle(function() {
        return Records.reactions.find(reactionParams()).reduce(function(hash, reaction) {
          var name;
          name = reaction.user().name;
          hash[reaction.reaction] = hash[reaction.reaction] || [];
          hash[reaction.reaction].push(name);
          hash.all.push(name);
          return hash;
        }, {
          all: []
        });
      }, 250, {
        leading: true
      });
      $scope.translate = function(reaction) {
        return EmojiService.translate(reaction);
      };
      $scope.reactionTypes = function() {
        return _.difference(_.keys($scope.reactionHash()), ['all']);
      };
      $scope.maxNamesCount = 10;
      $scope.countFor = function(reaction) {
        return $scope.reactionHash()[reaction].length - $scope.maxNamesCount;
      };
      if ($scope.load) {
        return Records.reactions.fetch({
          params: {
            reactable_type: _.capitalize($scope.model.constructor.singular),
            reactable_id: $scope.model.id
          }
        })["finally"](function() {
          return $scope.loaded = true;
        });
      } else {
        return $scope.loaded = true;
      }
    }
  };
});

angular.module('loomioApp').directive('reactionsInput', function() {
  return {
    scope: {
      model: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/reactions/input/reactions_input.html',
    replace: true
  };
});

angular.module('loomioApp').directive('activityCard', function($mdDialog, ChronologicalEventWindow, NestedEventWindow, RecordLoader, $window, AppConfig, ModalService, PrintModal) {
  return {
    scope: {
      discussion: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/thread_page/activity_card/activity_card.html',
    controller: function($scope) {
      $scope.debug = function() {
        return window.Loomio.debug;
      };
      $scope.setDefaults = function() {
        $scope.per = AppConfig.pageSize.threadItems;
        $scope.renderMode = 'nested';
        return $scope.position = $scope.positionForSelect();
      };
      $scope.positionForSelect = function() {
        if (_.include(['requested', 'context'], $scope.initialPosition())) {
          return "beginning";
        } else {
          return $scope.initialPosition();
        }
      };
      $scope.initialPosition = function() {
        switch (false) {
          case !$scope.discussion.requestedSequenceId:
            return "requested";
          case !((!$scope.discussion.lastReadAt) || $scope.discussion.itemsCount === 0):
            return 'context';
          case $scope.discussion.readItemsCount() !== 0:
            return 'beginning';
          case !$scope.discussion.isUnread():
            return 'unread';
          default:
            return 'latest';
        }
      };
      $scope.initialSequenceId = function(position) {
        switch (position) {
          case "requested":
            return $scope.discussion.requestedSequenceId;
          case "beginning":
          case "context":
            return $scope.discussion.firstSequenceId();
          case "unread":
            return $scope.discussion.firstUnreadSequenceId();
          case "latest":
            return $scope.discussion.lastSequenceId() - $scope.per + 2;
        }
      };
      $scope.elementToFocus = function(position) {
        switch (position) {
          case "context":
            return ".context-panel h1";
          case "requested":
            return "#sequence-" + $scope.discussion.requestedSequenceId;
          case "beginning":
            return "#sequence-" + ($scope.discussion.firstSequenceId());
          case "unread":
            return "#sequence-" + ($scope.discussion.firstUnreadSequenceId());
          case "latest":
            return "#sequence-" + ($scope.discussion.lastSequenceId());
        }
      };
      $scope.$on('fetchRecordsForPrint', function() {
        if ($scope.discussion.allEventsLoaded()) {
          return $window.print();
        } else {
          ModalService.open(PrintModal, {
            preventClose: function() {
              return true;
            }
          });
          return $scope.eventWindow.showAll().then(function() {
            $mdDialog.cancel();
            return $window.print();
          });
        }
      });
      $scope.init = function(position) {
        if (position == null) {
          position = $scope.initialPosition();
        }
        $scope.loader = new RecordLoader({
          collection: 'events',
          params: {
            discussion_id: $scope.discussion.id,
            order: 'sequence_id',
            from: $scope.initialSequenceId(position),
            per: $scope.per
          }
        });
        return $scope.loader.loadMore().then(function() {
          if ($scope.renderMode === "chronological") {
            $scope.eventWindow = new ChronologicalEventWindow({
              discussion: $scope.discussion,
              initialSequenceId: $scope.initialSequenceId(position),
              per: $scope.per
            });
          } else {
            $scope.eventWindow = new NestedEventWindow({
              discussion: $scope.discussion,
              parentEvent: $scope.discussion.createdEvent(),
              initialSequenceId: $scope.initialSequenceId(position),
              per: $scope.per
            });
          }
          return $scope.$emit('threadPageScrollToSelector', $scope.elementToFocus(position));
        });
      };
      $scope.setDefaults();
      $scope.init();
      $scope.$on('initActivityCard', function() {
        return $scope.init();
      });
    }
  };
});

angular.module('loomioApp').directive('addCommentPanel', function(AbilityService, ModalService, AuthModal, Session, ScrollService, $timeout) {
  return {
    scope: {
      eventWindow: '=',
      parentEvent: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/thread_page/add_comment_panel/add_comment_panel.html',
    controller: function($scope) {
      $scope.discussion = $scope.eventWindow.discussion;
      $scope.actor = Session.user();
      $scope.isLoggedIn = function() {
        return AbilityService.isLoggedIn();
      };
      $scope.signIn = function() {
        return ModalService.open(AuthModal);
      };
      $scope.canAddComment = function() {
        return AbilityService.canAddComment($scope.discussion);
      };
      $scope.show = $scope.parentEvent === $scope.discussion.createdEvent();
      $scope.close = function() {
        return $scope.show = false;
      };
      $scope.isReply = false;
      $scope.indent = function() {
        return $scope.eventWindow.useNesting && $scope.isReply;
      };
      $scope.$on('replyToEvent', function(e, event) {
        if ((!$scope.eventWindow.useNesting) || ($scope.parentEvent.id === event.id)) {
          $scope.show = true;
          $timeout(function() {
            $scope.isReply = true;
            return $scope.$broadcast('setParentComment', event.model());
          });
        }
        return ScrollService.scrollTo('.add-comment-panel textarea', {
          bottom: true,
          offset: 200
        });
      });
      return $scope.$on('commentSaved', function() {
        if ($scope.parentEvent === $scope.discussion.createdEvent()) {
          return $scope.parentComment = null;
        } else {
          return $scope.close();
        }
      });
    }
  };
});

angular.module('loomioApp').directive('commentForm', function($translate, FormService, Records, Session, KeyEventService, AbilityService, ScrollService, EmojiService) {
  return {
    scope: {
      eventWindow: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/thread_page/comment_form/comment_form.html',
    replace: true,
    controller: function($scope, $rootScope) {
      $scope.discussion = $scope.eventWindow.discussion;
      $scope.commentHelptext = function() {
        var helptext;
        helptext = $scope.discussion["private"] ? $translate.instant('comment_form.private_privacy_notice', {
          groupName: $scope.comment.group().fullName
        }) : $translate.instant('comment_form.public_privacy_notice');
        return helptext.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>');
      };
      $scope.commentPlaceholder = function() {
        if ($scope.comment.parentId) {
          return $translate.instant('comment_form.in_reply_to', {
            name: $scope.comment.parent().author().name
          });
        } else {
          return $translate.instant('comment_form.aria_label');
        }
      };
      $scope.$on('setParentComment', function(e, parentComment) {
        return $scope.comment.parentId = parentComment.id;
      });
      $scope.init = function() {
        $scope.comment = Records.comments.build({
          discussionId: $scope.discussion.id,
          authorId: Session.user().id
        });
        $scope.submit = FormService.submit($scope, $scope.comment, {
          drafts: true,
          submitFn: $scope.comment.save,
          flashSuccess: function() {
            $scope.$emit('commentSaved');
            if ($scope.comment.isReply()) {
              return 'comment_form.messages.replied';
            } else {
              return 'comment_form.messages.created';
            }
          },
          flashOptions: {
            name: function() {
              if ($scope.comment.isReply()) {
                return $scope.comment.parent().authorName();
              }
            }
          },
          successCallback: $scope.init
        });
        KeyEventService.submitOnEnter($scope);
        return $scope.$broadcast('reinitializeForm', $scope.comment);
      };
      $scope.init();
      $scope.isLoggedIn = function() {
        return AbilityService.isLoggedIn();
      };
      return $scope.signIn = function() {
        return ModalService.open(AuthModal);
      };
    }
  };
});

angular.module('loomioApp').factory('DeleteCommentForm', function() {
  return {
    templateUrl: 'generated/components/thread_page/comment_form/delete_comment_form.html',
    controller: function($scope, $rootScope, Records, comment) {
      $scope.comment = comment;
      return $scope.submit = function() {
        return $scope.comment.destroy().then(function() {
          return $scope.$close();
        }, function() {
          return $rootScope.$broadcast('pageError', 'cantDeleteComment');
        });
      };
    }
  };
});

angular.module('loomioApp').factory('EditCommentForm', function() {
  return {
    templateUrl: 'generated/components/thread_page/comment_form/edit_comment_form.html',
    controller: function($scope, comment, Records, FormService) {
      $scope.comment = comment.clone();
      return $scope.submit = FormService.submit($scope, $scope.comment, {
        flashSuccess: 'comment_form.messages.updated',
        successCallback: function() {
          return _.invoke(Records.documents.find($scope.comment.removedDocumentIds), 'remove');
        }
      });
    }
  };
});

angular.module('loomioApp').directive('commentFormActions', function(KeyEventService) {
  return {
    scope: {
      comment: '=',
      submit: '='
    },
    replace: true,
    templateUrl: 'generated/components/thread_page/comment_form_actions/comment_form_actions.html',
    controller: function($scope) {
      return KeyEventService.submitOnEnter($scope);
    }
  };
});

angular.module('loomioApp').directive('contextPanel', function($rootScope, $translate, Records, AbilityService, ReactionService, ModalService, DocumentModal, DiscussionModal, ThreadService, RevisionHistoryModal, TranslationService, ScrollService) {
  return {
    scope: {
      discussion: '='
    },
    restrict: 'E',
    replace: true,
    templateUrl: 'generated/components/thread_page/context_panel/context_panel.html',
    controller: function($scope) {
      $scope.status = function() {
        if ($scope.discussion.pinned) {
          return 'pinned';
        }
      };
      $scope.statusTitle = function() {
        return $translate.instant("context_panel.thread_status." + ($scope.status()));
      };
      $scope.showLintel = function(bool) {
        return $rootScope.$broadcast('showThreadLintel', bool);
      };
      $scope.showRevisionHistory = function() {
        return ModalService.open(RevisionHistoryModal, {
          model: (function(_this) {
            return function() {
              return $scope.discussion;
            };
          })(this)
        });
      };
      $scope.actions = [
        {
          name: 'react',
          canPerform: function() {
            return AbilityService.canAddComment($scope.discussion);
          }
        }, {
          name: 'edit_thread',
          icon: 'mdi-pencil',
          canPerform: function() {
            return AbilityService.canEditThread($scope.discussion);
          },
          perform: function() {
            return ModalService.open(DiscussionModal, {
              discussion: function() {
                return $scope.discussion;
              }
            });
          }
        }, {
          name: 'add_resource',
          icon: 'mdi-attachment',
          canPerform: function() {
            return AbilityService.canAdministerDiscussion($scope.discussion);
          },
          perform: function() {
            return ModalService.open(DocumentModal, {
              doc: function() {
                return Records.documents.build({
                  modelId: $scope.discussion.id,
                  modelType: 'Discussion'
                });
              }
            });
          }
        }, {
          name: 'translate_thread',
          icon: 'mdi-translate',
          canPerform: function() {
            return AbilityService.canTranslate($scope.discussion) && !$scope.translation;
          },
          perform: function() {
            return TranslationService.inline($scope, $scope.discussion);
          }
        }, {
          name: 'add_comment',
          icon: 'mdi-reply',
          canPerform: function() {
            return AbilityService.canAddComment($scope.discussion);
          },
          perform: function() {
            return ScrollService.scrollTo('.comment-form textarea');
          }
        }, {
          name: 'pin_thread',
          icon: 'mdi-pin',
          canPerform: function() {
            return AbilityService.canPinThread($scope.discussion);
          },
          perform: function() {
            return ThreadService.pin($scope.discussion);
          }
        }, {
          name: 'unpin_thread',
          icon: 'mdi-pin-off',
          canPerform: function() {
            return AbilityService.canUnpinThread($scope.discussion);
          },
          perform: function() {
            return ThreadService.unpin($scope.discussion);
          }
        }
      ];
      TranslationService.listenForTranslations($scope);
      return ReactionService.listenForReactions($scope, $scope.discussion);
    }
  };
});

angular.module('loomioApp').directive('contextPanelDropdown', function($rootScope, AbilityService, ModalService, DiscussionModal, ChangeVolumeForm, ThreadService, MoveThreadForm, DeleteThreadForm, RevisionHistoryModal) {
  return {
    scope: {
      discussion: '='
    },
    restrict: 'E',
    replace: true,
    templateUrl: 'generated/components/thread_page/context_panel_dropdown/context_panel_dropdown.html',
    controller: function($scope) {
      $scope.canChangeVolume = function() {
        return AbilityService.canChangeVolume($scope.discussion);
      };
      $scope.openChangeVolumeForm = function() {
        return ModalService.open(ChangeVolumeForm, {
          model: (function(_this) {
            return function() {
              return $scope.discussion;
            };
          })(this)
        });
      };
      $scope.canEditThread = function() {
        return AbilityService.canEditThread($scope.discussion);
      };
      $scope.editThread = function() {
        return ModalService.open(DiscussionModal, {
          discussion: (function(_this) {
            return function() {
              return $scope.discussion;
            };
          })(this)
        });
      };
      $scope.canPinThread = function() {
        return AbilityService.canPinThread($scope.discussion);
      };
      $scope.closeThread = function() {
        return ThreadService.close($scope.discussion);
      };
      $scope.reopenThread = function() {
        return ThreadService.reopen($scope.discussion);
      };
      $scope.pinThread = function() {
        return ThreadService.pin($scope.discussion);
      };
      $scope.unpinThread = function() {
        return ThreadService.unpin($scope.discussion);
      };
      $scope.muteThread = function() {
        return ThreadService.mute($scope.discussion);
      };
      $scope.unmuteThread = function() {
        return ThreadService.unmute($scope.discussion);
      };
      $scope.canMoveThread = function() {
        return AbilityService.canMoveThread($scope.discussion);
      };
      $scope.canCloseThread = function() {
        return AbilityService.canCloseThread($scope.discussion);
      };
      $scope.moveThread = function() {
        return ModalService.open(MoveThreadForm, {
          discussion: (function(_this) {
            return function() {
              return $scope.discussion;
            };
          })(this)
        });
      };
      $scope.requestPagePrinted = function() {
        $rootScope.$broadcast('toggleSidebar', false);
        return $rootScope.$broadcast('fetchRecordsForPrint');
      };
      $scope.canDeleteThread = function() {
        return AbilityService.canDeleteThread($scope.discussion);
      };
      return $scope.deleteThread = function() {
        return ModalService.open(DeleteThreadForm, {
          discussion: (function(_this) {
            return function() {
              return $scope.discussion;
            };
          })(this)
        });
      };
    }
  };
});

angular.module('loomioApp').directive('decisionToolsCard', function(AbilityService) {
  return {
    scope: {
      discussion: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/thread_page/decision_tools_card/decision_tools_card.html',
    replace: true,
    controller: function($scope) {
      return $scope.canStartPoll = function() {
        return AbilityService.canStartPoll(this.discussion.group());
      };
    }
  };
});

angular.module('loomioApp').directive('eventChildren', function(NestedEventWindow) {
  return {
    scope: {
      parentEvent: '=',
      parentEventWindow: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/thread_page/event_children/event_children.html',
    replace: true,
    controller: function($scope) {
      $scope.debug = function() {
        return window.Loomio.debug;
      };
      $scope.eventWindow = new NestedEventWindow({
        parentEvent: $scope.parentEvent,
        discussion: $scope.parentEventWindow.discussion,
        initialSequenceId: $scope.parentEventWindow.initialSequenceId,
        per: $scope.parentEventWindow.per
      });
      return $scope.$on('replyToEvent', function(e, event) {
        if (event.id === $scope.parentEvent.id) {
          return $scope.eventWindow.max = false;
        }
      });
    }
  };
});

angular.module('loomioApp').factory('PrintModal', function() {
  return {
    templateUrl: 'generated/components/thread_page/print_modal/print_modal.html',
    controller: function($scope) {}
  };
});

angular.module('loomioApp').factory('RevisionHistoryModal', function() {
  return {
    templateUrl: 'generated/components/thread_page/revision_history_modal/revision_history_modal.html',
    controller: function($scope, model, Records, LoadingService) {
      $scope.model = model;
      $scope.loading = true;
      $scope.load = function() {
        switch ($scope.model.constructor.singular) {
          case 'discussion':
            return Records.versions.fetchByDiscussion($scope.model.key);
          case 'comment':
            return Records.versions.fetchByComment($scope.model.id);
        }
      };
      $scope.header = (function() {
        switch ($scope.model.constructor.singular) {
          case 'discussion':
            return 'revision_history_modal.thread_header';
          case 'comment':
            return 'revision_history_modal.comment_header';
        }
      })();
      $scope.discussionRevision = function() {
        return $scope.model.constructor.singular === 'discussion';
      };
      $scope.commentRevision = function() {
        return $scope.model.constructor.singular === 'comment';
      };
      $scope.threadTitle = function(version) {
        return $scope.model.attributeForVersion('title', version);
      };
      $scope.revisionBody = function(version) {
        switch ($scope.model.constructor.singular) {
          case 'discussion':
            return $scope.model.attributeForVersion('description', version);
          case 'comment':
            return $scope.model.attributeForVersion('body', version);
        }
      };
      $scope.threadDetails = function(version) {
        if (version.isOriginal()) {
          return 'revision_history_modal.started_by';
        } else {
          return 'revision_history_modal.edited_by';
        }
      };
      $scope.versionCreatedAt = function(version) {
        return moment(version).format('Do MMMM YYYY, h:mma');
      };
      LoadingService.applyLoadingFunction($scope, 'load');
      $scope.load();
    }
  };
});

angular.module('loomioApp').directive('newComment', function($rootScope, clipboard, AbilityService, ReactionService, LmoUrlService, FlashService, TranslationService, ModalService, DeleteCommentForm, EditCommentForm, RevisionHistoryModal) {
  return {
    scope: {
      event: '=',
      eventable: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/thread_page/thread_item/new_comment.html',
    replace: true,
    controller: function($scope) {
      $scope.actions = [
        {
          name: 'react',
          canPerform: function() {
            return AbilityService.canAddComment($scope.eventable.discussion());
          }
        }, {
          name: 'reply_to_comment',
          icon: 'mdi-reply',
          canPerform: function() {
            return AbilityService.canRespondToComment($scope.eventable);
          },
          perform: function() {
            return $rootScope.$broadcast('replyToEvent', $scope.event.surfaceOrSelf());
          }
        }, {
          name: 'edit_comment',
          icon: 'mdi-pencil',
          canPerform: function() {
            return AbilityService.canEditComment($scope.eventable);
          },
          perform: function() {
            return ModalService.open(EditCommentForm, {
              comment: function() {
                return $scope.eventable;
              }
            });
          }
        }, {
          name: 'translate_comment',
          icon: 'mdi-translate',
          canPerform: function() {
            return $scope.eventable.body && AbilityService.canTranslate($scope.eventable) && !$scope.translation;
          },
          perform: function() {
            return TranslationService.inline($scope, $scope.eventable);
          }
        }, {
          name: 'copy_url_comment',
          icon: 'mdi-link',
          canPerform: function() {
            return clipboard.supported;
          },
          perform: function() {
            clipboard.copyText(LmoUrlService.comment($scope.eventable, {}, {
              absolute: true
            }));
            return FlashService.success("action_dock.comment_copied");
          }
        }, {
          name: 'show_history',
          icon: 'mdi-history',
          canPerform: function() {
            return $scope.eventable.edited();
          },
          perform: function() {
            return ModalService.open(RevisionHistoryModal, {
              model: function() {
                return $scope.eventable;
              }
            });
          }
        }, {
          name: 'delete_comment',
          icon: 'mdi-delete',
          canPerform: function() {
            return AbilityService.canDeleteComment($scope.eventable);
          },
          perform: function() {
            return ModalService.open(DeleteCommentForm, {
              comment: function() {
                return $scope.eventable;
              }
            });
          }
        }
      ];
      ReactionService.listenForReactions($scope, $scope.eventable);
      return TranslationService.listenForTranslations($scope);
    }
  };
});

angular.module('loomioApp').directive('outcomeCreated', function(TranslationService, ReactionService, AbilityService, ModalService, PollCommonOutcomeModal) {
  return {
    scope: {
      eventable: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/thread_page/thread_item/outcome_created.html',
    replace: true,
    controller: function($scope) {
      $scope.actions = [
        {
          name: 'react',
          canPerform: function() {
            return AbilityService.canReactToPoll($scope.eventable.poll());
          }
        }, {
          name: 'edit_outcome',
          icon: 'mdi-pencil',
          canPerform: function() {
            return AbilityService.canSetPollOutcome($scope.eventable.poll());
          },
          perform: function() {
            return ModalService.open(PollCommonOutcomeModal, {
              outcome: function() {
                return $scope.eventable;
              }
            });
          }
        }, {
          name: 'translate_outcome',
          icon: 'mdi-translate',
          canPerform: function() {
            return AbilityService.canTranslate($scope.eventable);
          },
          perform: function() {
            return TranslationService.inline($scope, $scope.eventable);
          }
        }
      ];
      ReactionService.listenForReactions($scope, $scope.eventable);
      return TranslationService.listenForTranslations($scope);
    }
  };
});

angular.module('loomioApp').directive('pollCreated', function(TranslationService, ReactionService, AbilityService, ModalService, PollCommonEditModal) {
  return {
    scope: {
      eventable: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/thread_page/thread_item/outcome_created.html',
    replace: true,
    controller: function($scope) {
      $scope.actions = [
        {
          name: 'react',
          canPerform: function() {
            return AbilityService.canReactToPoll($scope.eventable.poll());
          }
        }, {
          name: 'edit_poll',
          icon: 'mdi-pencil',
          canPerform: function() {
            return AbilityService.canEditPoll($scope.eventable);
          },
          perform: function() {
            return ModalService.open(PollCommonEditModal, {
              poll: function() {
                return $scope.eventable;
              }
            });
          }
        }, {
          name: 'translate_outcome',
          icon: 'mdi-translate',
          canPerform: function() {
            return AbilityService.canTranslate($scope.eventable);
          },
          perform: function() {
            return TranslationService.inline($scope, $scope.eventable);
          }
        }
      ];
      ReactionService.listenForReactions($scope, $scope.eventable);
      return TranslationService.listenForTranslations($scope);
    }
  };
});

angular.module('loomioApp').directive('stanceCreated', function(ModalService, TranslationService, PollCommonEditVoteModal, AbilityService) {
  return {
    scope: {
      eventable: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/thread_page/thread_item/stance_created.html',
    replace: true,
    controller: function($scope) {
      $scope.actions = [
        {
          name: 'translate_stance',
          icon: 'mdi-translate',
          canPerform: function() {
            return $scope.eventable.reason && AbilityService.canTranslate($scope.eventable) && !$scope.translation;
          },
          perform: function() {
            return TranslationService.inline($scope, $scope.eventable);
          }
        }, {
          name: 'edit_stance',
          icon: 'mdi-pencil',
          canPerform: function() {
            return AbilityService.canEditStance($scope.eventable);
          },
          perform: function() {
            return ModalService.open(PollCommonEditVoteModal, {
              stance: function() {
                return $scope.eventable;
              }
            });
          }
        }
      ];
      return TranslationService.listenForTranslations($scope);
    }
  };
});

angular.module('loomioApp').directive('threadItem', function($compile, $timeout, $translate, FormService, LmoUrlService, EventHeadlineService, Session, AbilityService, Records) {
  return {
    scope: {
      event: '=',
      eventWindow: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/thread_page/thread_item/thread_item.html',
    link: function(scope, element, attrs) {
      if (scope.event.isSurface() && scope.eventWindow.useNesting) {
        return $compile("<event-children discussion=\"eventWindow.discussion\" parent_event=\"event\" parent_event_window=\"eventWindow\"></event-children><add-comment-panel parent_event=\"event\" event_window=\"eventWindow\"></add-comment-panel>")(scope, function(cloned, scope) {
          return element.append(cloned);
        });
      }
    },
    controller: function($scope) {
      $scope.debug = function() {
        return window.Loomio.debug;
      };
      if ($scope.event.isSurface() && $scope.eventWindow.useNesting) {
        $scope.$on('replyButtonClicked', function(e, parentEvent, comment) {
          if ($scope.event.id === parentEvent.id) {
            $scope.eventWindow.max = false;
            return $scope.$broadcast('showReplyForm', comment);
          }
        });
      }
      $scope.canRemoveEvent = function() {
        return AbilityService.canRemoveEventFromThread($scope.event);
      };
      $scope.removeEvent = FormService.submit($scope, $scope.event, {
        submitFn: $scope.event.removeFromThread,
        flashSuccess: 'thread_item.event_removed'
      });
      $scope.mdColors = function() {
        var obj;
        obj = {
          'border-color': 'primary-500'
        };
        if ($scope.isFocused) {
          obj['background-color'] = 'accent-50';
        }
        return obj;
      };
      $scope.isFocused = $scope.eventWindow.discussion.requestedSequenceId === $scope.event.sequenceId;
      $scope.indent = function() {
        return $scope.event.isNested() && $scope.eventWindow.useNesting;
      };
      $scope.isUnread = function() {
        return (Session.user().id !== $scope.event.actorId) && $scope.eventWindow.isUnread($scope.event);
      };
      $scope.headline = function() {
        return EventHeadlineService.headlineFor($scope.event, $scope.eventWindow.useNesting);
      };
      return $scope.link = function() {
        return LmoUrlService.discussion($scope.eventWindow.discussion, {
          from: $scope.event.sequenceId
        });
      };
    }
  };
});

angular.module('loomioApp').directive('threadItemDirective', function($compile, $injector) {
  return {
    scope: {
      event: '='
    },
    link: function($scope, element) {
      var kind;
      kind = $scope.event.kind;
      if ($injector.has((_.camelCase(kind)) + "Directive")) {
        return $compile("<" + kind + " event='event' eventable='event.model()' />")($scope, function(cloned, scope) {
          return element.append(cloned);
        });
      }
    }
  };
});

angular.module('loomioApp').directive('pollCommonActionPanel', function($location, AppConfig, ModalService, AbilityService, PollService, Session, Records, PollCommonEditVoteModal) {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/common/action_panel/poll_common_action_panel.html',
    controller: function($scope, Records, Session) {
      $scope.init = function() {
        var invitation, token;
        token = $location.search().invitation_token;
        if (!$scope.poll.example) {
          invitation = _.first(Records.invitations.find({
            token: token
          }));
        }
        return $scope.stance = PollService.lastStanceBy(Session.user(), $scope.poll) || Records.stances.build({
          pollId: $scope.poll.id,
          userId: AppConfig.currentUserId,
          token: token,
          visitorAttributes: {
            email: (invitation || {}).recipientEmail
          }
        }).choose($location.search().poll_option_id);
      };
      $scope.$on('refreshStance', $scope.init);
      $scope.init();
      $scope.userHasVoted = function() {
        return PollService.hasVoted(Session.user(), $scope.poll);
      };
      $scope.userCanParticipate = function() {
        return AbilityService.canParticipateInPoll($scope.poll);
      };
      return $scope.openStanceForm = function() {
        return ModalService.open(PollCommonEditVoteModal, {
          stance: function() {
            return $scope.init();
          }
        });
      };
    }
  };
});

angular.module('loomioApp').directive('pollCommonActionsDropdown', function() {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/common/actions_dropdown/poll_common_actions_dropdown.html',
    controller: function($scope, AbilityService, ModalService, PollCommonShareModal, PollCommonEditModal, PollCommonCloseForm, PollCommonDeleteModal, PollCommonUnsubscribeModal) {
      $scope.canSharePoll = function() {
        return AbilityService.canSharePoll($scope.poll);
      };
      $scope.canEditPoll = function() {
        return AbilityService.canEditPoll($scope.poll);
      };
      $scope.canClosePoll = function() {
        return AbilityService.canClosePoll($scope.poll);
      };
      $scope.canDeletePoll = function() {
        return AbilityService.canDeletePoll($scope.poll);
      };
      $scope.sharePoll = function() {
        return ModalService.open(PollCommonShareModal, {
          poll: function() {
            return $scope.poll;
          }
        });
      };
      $scope.editPoll = function() {
        return ModalService.open(PollCommonEditModal, {
          poll: function() {
            return $scope.poll;
          }
        });
      };
      $scope.closePoll = function() {
        return ModalService.open(PollCommonCloseForm, {
          poll: function() {
            return $scope.poll;
          }
        });
      };
      $scope.deletePoll = function() {
        return ModalService.open(PollCommonDeleteModal, {
          poll: function() {
            return $scope.poll;
          }
        });
      };
      return $scope.toggleSubscription = function() {
        return ModalService.open(PollCommonUnsubscribeModal, {
          poll: function() {
            return $scope.poll;
          }
        });
      };
    }
  };
});

angular.module('loomioApp').directive('pollCommonAnonymous', function() {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/common/anonymous/poll_common_anonymous.html'
  };
});

angular.module('loomioApp').directive('pollCommonBarChart', function(AppConfig, Records) {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/common/bar_chart/poll_common_bar_chart.html',
    controller: function($scope) {
      var backgroundImageFor, percentageFor;
      $scope.countFor = function(option) {
        return $scope.poll.stanceData[option.name] || 0;
      };
      $scope.barTextFor = function(option) {
        return (($scope.countFor(option)) + " - " + option.name).replace(/\s/g, '\u00a0');
      };
      percentageFor = function(option) {
        var max;
        max = _.max(_.values($scope.poll.stanceData));
        if (!(max > 0)) {
          return;
        }
        return (100 * $scope.countFor(option) / max) + "%";
      };
      backgroundImageFor = function(option) {
        return "url(/img/poll_backgrounds/" + (option.color.replace('#', '')) + ".png)";
      };
      return $scope.styleData = function(option) {
        return {
          'background-image': backgroundImageFor(option),
          'background-size': percentageFor(option)
        };
      };
    }
  };
});

angular.module('loomioApp').directive('pollCommonBarChartPanel', function(AppConfig, Records) {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/common/bar_chart_panel/poll_common_bar_chart_panel.html'
  };
});

angular.module('loomioApp').directive('pollCommonCalendarInvite', function(Records, PollService, TimeService) {
  return {
    scope: {
      outcome: '='
    },
    templateUrl: 'generated/components/poll/common/calendar_invite/poll_common_calendar_invite.html',
    controller: function($scope) {
      var bestOption;
      $scope.options = _.map($scope.outcome.poll().pollOptions(), function(option) {
        return {
          id: option.id,
          value: TimeService.displayDate(moment(option.name)),
          attendees: option.stances().length
        };
      });
      bestOption = _.first(_.sortBy($scope.options, function(option) {
        return -1 * option.attendees;
      }));
      $scope.outcome.calendarInvite = true;
      $scope.outcome.pollOptionId = $scope.outcome.pollOptionId || bestOption.id;
      return $scope.outcome.customFields.event_summary = $scope.outcome.customFields.event_summary || $scope.outcome.poll().title;
    }
  };
});

angular.module('loomioApp').directive('pollCommonCard', function(Session, Records, LoadingService, PollService) {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/common/card/poll_common_card.html',
    replace: true,
    controller: function($scope) {
      if (!$scope.poll.complete) {
        Records.polls.findOrFetchById($scope.poll.key);
      }
      $scope.buttonPressed = false;
      $scope.$on('showResults', function() {
        return $scope.buttonPressed = true;
      });
      LoadingService.listenForLoading($scope);
      $scope.showResults = function() {
        return $scope.buttonPressed || PollService.hasVoted(Session.user(), $scope.poll) || $scope.poll.isClosed();
      };
      return $scope.$on('stanceSaved', function() {
        return $scope.$broadcast('refreshStance');
      });
    }
  };
});

angular.module('loomioApp').directive('pollCommonCardHeader', function() {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/common/card_header/poll_common_card_header.html',
    controller: function($scope, AbilityService, PollService) {
      $scope.pollHasActions = function() {
        return AbilityService.canSharePoll($scope.poll) || AbilityService.canEditPoll($scope.poll) || AbilityService.canClosePoll($scope.poll) || AbilityService.canDeletePoll($scope.poll);
      };
      return $scope.icon = function() {
        return PollService.iconFor($scope.poll);
      };
    }
  };
});

angular.module('loomioApp').directive('pollCommonChartPreview', function(PollService, Session) {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/common/chart_preview/poll_common_chart_preview.html',
    controller: function($scope) {
      $scope.chartType = function() {
        return PollService.fieldFromTemplate($scope.poll.pollType, 'chart_type');
      };
      return $scope.myStance = function() {
        return PollService.lastStanceBy(Session.user(), $scope.poll);
      };
    }
  };
});

angular.module('loomioApp').directive('pollCommonChooseType', function(PollService, AppConfig) {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/common/choose_type/poll_common_choose_type.html',
    controller: function($scope) {
      $scope.choose = function(type) {
        return $scope.$emit('nextStep', type);
      };
      $scope.pollTypes = function() {
        return AppConfig.pollTypes;
      };
      return $scope.iconFor = function(pollType) {
        return PollService.fieldFromTemplate(pollType, 'material_icon');
      };
    }
  };
});

angular.module('loomioApp').factory('PollCommonCloseForm', function() {
  return {
    templateUrl: 'generated/components/poll/common/close_form/poll_common_close_form.html',
    controller: function($scope, poll, FormService) {
      $scope.poll = poll;
      return $scope.submit = FormService.submit($scope, poll, {
        submitFn: $scope.poll.close,
        flashSuccess: "poll_common_close_form." + $scope.poll.pollType + "_closed"
      });
    }
  };
});

angular.module('loomioApp').directive('pollCommonClosingAt', function() {
  return {
    scope: {
      poll: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/poll/common/closing_at/poll_common_closing_at.html',
    replace: true,
    controller: function($scope, $filter) {
      $scope.time = function() {
        var key;
        key = $scope.poll.isActive() ? 'closingAt' : 'closedAt';
        return $scope.poll[key];
      };
      return $scope.translationKey = function() {
        if ($scope.poll.isActive()) {
          return 'common.closing_in';
        } else {
          return 'common.closed_ago';
        }
      };
    }
  };
});

angular.module('loomioApp').directive('pollCommonClosingAtField', function(AppConfig) {
  return {
    scope: {
      poll: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/poll/common/closing_at_field/poll_common_closing_at_field.html',
    replace: true,
    controller: function($scope) {
      var j, results, updateClosingAt;
      $scope.hours = (function() {
        results = [];
        for (j = 1; j <= 24; j++){ results.push(j); }
        return results;
      }).apply(this);
      $scope.closingHour = $scope.poll.closingAt.format('H');
      $scope.closingDate = $scope.poll.closingAt.toDate();
      $scope.minDate = new Date();
      updateClosingAt = function() {
        return $scope.poll.closingAt = moment($scope.closingDate).startOf('day').add($scope.closingHour, 'hours');
      };
      $scope.$watch('closingDate', updateClosingAt);
      $scope.$watch('closingHour', updateClosingAt);
      $scope.hours = _.times(24, function(i) {
        return i;
      });
      $scope.times = _.times(24, function(i) {
        if (i < 10) {
          i = "0" + i;
        }
        return moment("2015-01-01 " + i + ":00").format('h a');
      });
      $scope.dateToday = moment().format('YYYY-MM-DD');
      return $scope.timeZone = AppConfig.timeZone;
    }
  };
});

angular.module('loomioApp').directive('pollCommonCollapsed', function() {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/common/collapsed/poll_common_collapsed.html',
    controller: function($scope) {
      return $scope.formattedPollType = function(type) {
        return _.capitalize(type.replace('_', '-'));
      };
    }
  };
});

angular.module('loomioApp').factory('PollCommonDeleteModal', function($location, LmoUrlService, FormService) {
  return {
    templateUrl: 'generated/components/poll/common/delete_modal/poll_common_delete_modal.html',
    controller: function($scope, poll) {
      $scope.poll = poll;
      return $scope.submit = FormService.submit($scope, $scope.poll, {
        submitFn: $scope.poll.destroy,
        flashSuccess: 'poll_common_delete_modal.success',
        successCallback: function() {
          var path;
          path = $scope.poll.discussion() ? LmoUrlService.discussion($scope.poll.discussion()) : $scope.poll.group() ? LmoUrlService.group($scope.poll.group()) : '/dashboard';
          return $location.path(path);
        }
      });
    }
  };
});

angular.module('loomioApp').directive('pollCommonDetailsPanel', function(Records, AbilityService, DocumentModal, ModalService, PollCommonEditModal, TranslationService, ReactionService) {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/common/details_panel/poll_common_details_panel.html',
    controller: function($scope) {
      $scope.actions = [
        {
          name: 'react',
          canPerform: function() {
            return AbilityService.canReactToPoll($scope.poll);
          }
        }, {
          name: 'translate_poll',
          icon: 'mdi-translate',
          canPerform: function() {
            return AbilityService.canTranslate($scope.poll) && !$scope.translation;
          },
          perform: function() {
            return TranslationService.inline($scope, $scope.poll);
          }
        }, {
          name: 'add_resource',
          icon: 'mdi-attachment',
          canPerform: function() {
            return AbilityService.canAdministerPoll($scope.poll);
          },
          perform: function() {
            return ModalService.open(DocumentModal, {
              doc: function() {
                return Records.documents.build({
                  modelId: $scope.poll.id,
                  modelType: 'Poll'
                });
              }
            });
          }
        }, {
          name: 'edit_poll',
          icon: 'mdi-pencil',
          canPerform: function() {
            return AbilityService.canEditPoll($scope.poll);
          },
          perform: function() {
            return ModalService.open(PollCommonEditModal, {
              poll: function() {
                return $scope.poll;
              }
            });
          }
        }
      ];
      TranslationService.listenForTranslations($scope);
      return ReactionService.listenForReactions($scope, $scope.poll);
    }
  };
});

angular.module('loomioApp').directive('pollCommonDirective', function($compile, $injector) {
  return {
    scope: {
      poll: '=?',
      stance: '=?',
      outcome: '=?',
      stanceChoice: '=?',
      back: '=?',
      name: '@'
    },
    link: function($scope, element) {
      var directiveName, model;
      model = $scope.stance || $scope.outcome || $scope.stanceChoice || {
        poll: function() {}
      };
      $scope.poll = $scope.poll || model.poll();
      directiveName = $injector.has(_.camelCase("poll_" + $scope.poll.pollType + "_" + $scope.name + "_directive")) ? "poll_" + $scope.poll.pollType + "_" + $scope.name : "poll_common_" + $scope.name;
      return $compile("<" + directiveName + " poll='poll' stance='stance' stance-choice='stanceChoice', outcome='outcome' back='back' />")($scope, function(cloned) {
        return element.append(cloned);
      });
    }
  };
});

angular.module('loomioApp').factory('PollCommonEditModal', function(PollService, LoadingService) {
  return {
    templateUrl: 'generated/components/poll/common/edit_modal/poll_common_edit_modal.html',
    controller: function($scope, poll) {
      $scope.poll = poll.clone();
      $scope.poll.makeAnnouncement = $scope.poll.isNew();
      $scope.icon = function() {
        return PollService.iconFor($scope.poll);
      };
      return $scope.$on('nextStep', $scope.$close);
    }
  };
});

angular.module('loomioApp').factory('PollCommonEditVoteModal', function($rootScope, PollService, LoadingService) {
  return {
    templateUrl: 'generated/components/poll/common/edit_vote_modal/poll_common_edit_vote_modal.html',
    controller: function($scope, stance) {
      $scope.stance = stance.clone();
      $scope.$on('stanceSaved', function() {
        $scope.$close();
        return $rootScope.$broadcast('refreshStance');
      });
      LoadingService.listenForLoading($scope);
      return $scope.icon = function() {
        return PollService.iconFor($scope.stance.poll());
      };
    }
  };
});

angular.module('loomioApp').directive('pollCommonExampleCard', function($translate) {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/common/example_card/poll_common_example_card.html',
    replace: true,
    controller: function($scope) {
      return $scope.type = function() {
        return $translate.instant("poll_types." + $scope.poll.pollType).toLowerCase();
      };
    }
  };
});

angular.module('loomioApp').directive('pollCommonFormActions', function(PollService, KeyEventService) {
  return {
    scope: {
      poll: '='
    },
    replace: true,
    templateUrl: 'generated/components/poll/common/form_actions/poll_common_form_actions.html',
    controller: function($scope) {
      $scope.submit = PollService.submitPoll($scope, $scope.poll);
      return KeyEventService.submitOnEnter($scope);
    }
  };
});

angular.module('loomioApp').directive('pollCommonFormFields', function($translate) {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/common/form_fields/poll_common_form_fields.html',
    controller: function($scope) {
      $scope.titlePlaceholder = function() {
        return $translate.instant("poll_" + $scope.poll.pollType + "_form.title_placeholder");
      };
      return $scope.detailsPlaceholder = function() {
        return $translate.instant("poll_" + $scope.poll.pollType + "_form.details_placeholder");
      };
    }
  };
});

angular.module('loomioApp').directive('pollCommonFormOptions', function(PollService, AbilityService, Session, TimeService) {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/common/form_options/poll_common_form_options.html',
    controller: function($scope, KeyEventService) {
      $scope.currentZone = function() {
        return Session.user().timeZone;
      };
      $scope.existingOptions = _.clone($scope.poll.pollOptionNames);
      $scope.addOption = function() {
        if (!($scope.poll.newOptionName && !_.contains($scope.poll.pollOptionNames, $scope.poll.newOptionName))) {
          return;
        }
        $scope.poll.pollOptionNames.push($scope.poll.newOptionName);
        if (!$scope.poll.isNew()) {
          $scope.poll.makeAnnouncement = true;
        }
        $scope.$emit('pollOptionsChanged', $scope.poll.newOptionName);
        return $scope.poll.newOptionName = '';
      };
      $scope.datesAsOptions = PollService.fieldFromTemplate($scope.poll.pollType, 'dates_as_options');
      $scope.$on('addPollOption', function() {
        return $scope.addOption();
      });
      $scope.removeOption = function(name) {
        _.pull($scope.poll.pollOptionNames, name);
        return $scope.$emit('pollOptionsChanged');
      };
      $scope.canRemoveOption = function(name) {
        return _.contains($scope.existingOptions, name) || AbilityService.canRemovePollOptions($scope.poll);
      };
      return KeyEventService.registerKeyEvent($scope, 'pressedEnter', $scope.addOption, function(active) {
        return active.classList.contains('poll-poll-form__add-option-input');
      });
    }
  };
});

angular.module('loomioApp').directive('pollCommonIndexCard', function($location, Records, LoadingService, LmoUrlService) {
  return {
    scope: {
      model: '=',
      limit: '@?',
      viewMoreLink: '=?'
    },
    templateUrl: 'generated/components/poll/common/index_card/poll_common_index_card.html',
    replace: true,
    controller: function($scope) {
      $scope.fetchRecords = function() {
        return Records.polls.fetchFor($scope.model, {
          limit: $scope.limit,
          status: 'closed'
        });
      };
      LoadingService.applyLoadingFunction($scope, 'fetchRecords');
      $scope.fetchRecords();
      $scope.displayViewMore = function() {
        return $scope.viewMoreLink && $scope.model.closedPollsCount > $scope.polls().length;
      };
      $scope.viewMore = function() {
        var opts;
        opts = {};
        opts[$scope.model.constructor.singular + "_key"] = $scope.model.key;
        opts["status"] = "closed";
        return $location.path('polls').search(opts);
      };
      return $scope.polls = function() {
        return _.take($scope.model.closedPolls(), $scope.limit || 50);
      };
    }
  };
});

angular.module('loomioApp').directive('pollCommonNotifyGroup', function() {
  return {
    scope: {
      model: '=',
      notifyAction: '@'
    },
    templateUrl: 'generated/components/poll/common/notify_group/poll_common_notify_group.html'
  };
});

angular.module('loomioApp').directive('pollCommonNotifyOnParticipate', function() {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/common/notify_on_participate/poll_common_notify_on_participate.html'
  };
});

angular.module('loomioApp').directive('pollCommonOutcomeForm', function() {
  return {
    scope: {
      outcome: '='
    },
    templateUrl: 'generated/components/poll/common/outcome_form/poll_common_outcome_form.html',
    controller: function($scope, $translate, PollService, LoadingService, KeyEventService) {
      $scope.outcome.makeAnnouncement = $scope.outcome.isNew();
      $scope.submit = PollService.submitOutcome($scope, $scope.outcome);
      $scope.datesAsOptions = function() {
        return PollService.fieldFromTemplate($scope.outcome.poll().pollType, 'dates_as_options');
      };
      KeyEventService.submitOnEnter($scope);
      return LoadingService.listenForLoading($scope);
    }
  };
});

angular.module('loomioApp').factory('PollCommonOutcomeModal', function() {
  return {
    templateUrl: 'generated/components/poll/common/outcome_modal/poll_common_outcome_modal.html',
    controller: function($scope, outcome) {
      $scope.outcome = outcome.clone();
      return $scope.$on('outcomeSaved', $scope.$close);
    }
  };
});

angular.module('loomioApp').directive('pollCommonOutcomePanel', function(AbilityService, TranslationService, ReactionService, ModalService, PollCommonOutcomeModal) {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/common/outcome_panel/poll_common_outcome_panel.html',
    controller: function($scope) {
      $scope.actions = [
        {
          name: 'react',
          canPerform: function() {
            return AbilityService.canReactToPoll($scope.poll);
          }
        }, {
          name: 'edit_outcome',
          icon: 'mdi-pencil',
          canPerform: function() {
            return AbilityService.canSetPollOutcome($scope.poll);
          },
          perform: function() {
            return ModalService.open(PollCommonOutcomeModal, {
              outcome: function() {
                return $scope.poll.outcome();
              }
            });
          }
        }, {
          name: 'translate_outcome',
          icon: 'mdi-translate',
          canPerform: function() {
            return AbilityService.canTranslate($scope.poll.outcome());
          },
          perform: function() {
            return TranslationService.inline($scope, $scope.poll.outcome());
          }
        }
      ];
      TranslationService.listenForTranslations($scope);
      return ReactionService.listenForReactions($scope, $scope.poll.outcome());
    }
  };
});

angular.module('loomioApp').directive('pollCommonParticipantForm', function() {
  return {
    scope: {
      stance: '='
    },
    templateUrl: 'generated/components/poll/common/participant_form/poll_common_participant_form.html',
    controller: function($scope, $location, AbilityService) {
      return $scope.showParticipantForm = function() {
        return !AbilityService.isLoggedIn() && $scope.stance.isNew();
      };
    }
  };
});

angular.module('loomioApp').directive('pollCommonPercentVoted', function() {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/common/percent_voted/poll_common_percent_voted.html'
  };
});

angular.module('loomioApp').directive('pollCommonPreview', function(PollService, Session) {
  return {
    scope: {
      poll: '=',
      displayGroupName: '=?'
    },
    templateUrl: 'generated/components/poll/common/preview/poll_common_preview.html',
    controller: function($scope) {
      return $scope.showGroupName = function() {
        return $scope.displayGroupName && $scope.poll.group();
      };
    }
  };
});

angular.module('loomioApp').directive('pollCommonRankedChoiceChart', function(AppConfig, Records) {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/common/ranked_choice_chart/poll_common_ranked_choice_chart.html',
    controller: function($scope) {
      var backgroundImageFor, percentageFor;
      $scope.countFor = function(option) {
        return ($scope.poll.stanceData || {})[option.name] || 0;
      };
      $scope.rankFor = function(score) {
        return $scope.poll.customFields.minimum_stance_choices - score + 1;
      };
      $scope.votesFor = function(option, score) {
        return _.sum(option.stanceChoices(), function(choice) {
          if (choice.stance().latest && choice.score === score) {
            return 1;
          }
        });
      };
      $scope.scores = function() {
        var i, ref, results;
        return (function() {
          results = [];
          for (var i = ref = $scope.poll.customFields.minimum_stance_choices; ref <= 1 ? i <= 1 : i >= 1; ref <= 1 ? i++ : i--){ results.push(i); }
          return results;
        }).apply(this);
      };
      $scope.pollOptions = function() {
        return _.sortBy($scope.poll.pollOptions(), function(option) {
          return -$scope.countFor(option);
        });
      };
      $scope.barTextFor = function(option) {
        return option.name;
      };
      percentageFor = function(option) {
        var max;
        max = _.max(_.values($scope.poll.stanceData));
        if (!(max > 0)) {
          return;
        }
        return (100 * $scope.countFor(option) / max) + "%";
      };
      backgroundImageFor = function(option) {
        return "url(/img/poll_backgrounds/" + (option.color.replace('#', '')) + ".png)";
      };
      return $scope.styleData = function(option) {
        return {
          'background-image': backgroundImageFor(option),
          'background-size': percentageFor(option)
        };
      };
    }
  };
});

angular.module('loomioApp').directive('pollCommonSchoolLink', function() {
  return {
    scope: {
      translation: '@',
      href: '@'
    },
    templateUrl: 'generated/components/poll/common/school_link/poll_common_school_link.html'
  };
});

angular.module('loomioApp').directive('pollCommonSetOutcomePanel', function(Records, ModalService, PollCommonOutcomeModal, AbilityService) {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/common/set_outcome_panel/poll_common_set_outcome_panel.html',
    controller: function($scope) {
      $scope.showPanel = function() {
        return !$scope.poll.outcome() && AbilityService.canSetPollOutcome($scope.poll);
      };
      return $scope.openOutcomeForm = function() {
        return ModalService.open(PollCommonOutcomeModal, {
          outcome: function() {
            return $scope.poll.outcome() || Records.outcomes.build({
              pollId: $scope.poll.id
            });
          }
        });
      };
    }
  };
});

angular.module('loomioApp').factory('PollCommonShareModal', function(PollService) {
  return {
    templateUrl: 'generated/components/poll/common/share_modal/poll_common_share_modal.html',
    controller: function($scope, poll) {
      $scope.poll = poll.clone();
      $scope.icon = function() {
        return PollService.iconFor($scope.poll);
      };
      return $scope.$on('$close', $scope.$close);
    }
  };
});

angular.module('loomioApp').directive('showResultsButton', function() {
  return {
    templateUrl: 'generated/components/poll/common/show_results_button/show_results_button.html',
    controller: function($scope) {
      $scope.clicked = false;
      return $scope.press = function() {
        $scope.$emit('showResults');
        return $scope.clicked = true;
      };
    }
  };
});

angular.module('loomioApp').directive('pollCommonStanceChoice', function(PollService) {
  return {
    scope: {
      stanceChoice: '='
    },
    templateUrl: 'generated/components/poll/common/stance_choice/poll_common_stance_choice.html',
    controller: function($scope) {
      $scope.translateOptionName = function() {
        if (!$scope.stanceChoice.poll()) {
          return;
        }
        return PollService.fieldFromTemplate($scope.stanceChoice.poll().pollType, 'translate_option_name');
      };
      $scope.hasVariableScore = function() {
        if (!$scope.stanceChoice.poll()) {
          return;
        }
        return PollService.fieldFromTemplate($scope.stanceChoice.poll().pollType, 'has_variable_score');
      };
      return $scope.datesAsOptions = function() {
        if (!$scope.stanceChoice.poll()) {
          return;
        }
        return PollService.fieldFromTemplate($scope.stanceChoice.poll().pollType, 'dates_as_options');
      };
    }
  };
});

angular.module('loomioApp').directive('pollCommonStanceIcon', function(PollService) {
  return {
    scope: {
      stanceChoice: '='
    },
    templateUrl: 'generated/components/poll/common/stance_icon/poll_common_stance_icon.html',
    controller: function($scope) {
      return $scope.useOptionIcon = function() {
        return PollService.fieldFromTemplate($scope.stanceChoice.poll().pollType, 'has_option_icons');
      };
    }
  };
});

angular.module('loomioApp').directive('pollCommonStanceReason', function() {
  return {
    scope: {
      stance: '='
    },
    templateUrl: 'generated/components/poll/common/stance_reason/poll_common_stance_reason.html'
  };
});

angular.module('loomioApp').directive('pollCommonStartForm', function(AppConfig, Records, ModalService, PollCommonStartModal, PollService) {
  return {
    scope: {
      discussion: '=?',
      group: '=?'
    },
    restrict: 'E',
    templateUrl: 'generated/components/poll/common/start_form/poll_common_start_form.html',
    replace: true,
    controller: function($scope) {
      $scope.discussion = $scope.discussion || {};
      $scope.group = $scope.group || {};
      $scope.pollTypes = function() {
        return AppConfig.pollTypes;
      };
      $scope.startPoll = function(pollType) {
        return ModalService.open(PollCommonStartModal, {
          poll: function() {
            return Records.polls.build({
              pollType: pollType,
              discussionId: $scope.discussion.id,
              groupId: $scope.discussion.groupId || $scope.group.id,
              pollOptionNames: _.pluck($scope.fieldFromTemplate(pollType, 'poll_options_attributes'), 'name')
            });
          }
        });
      };
      return $scope.fieldFromTemplate = function(pollType, field) {
        return PollService.fieldFromTemplate(pollType, field);
      };
    }
  };
});

angular.module('loomioApp').factory('PollCommonStartModal', function($location, PollService) {
  return {
    templateUrl: 'generated/components/poll/common/start_modal/poll_common_start_modal.html',
    controller: function($scope, poll) {
      $scope.poll = poll.clone();
      $scope.icon = function() {
        return PollService.iconFor($scope.poll);
      };
      return PollService.applyPollStartSequence($scope);
    }
  };
});

angular.module('loomioApp').directive('pollCommonStartPoll', function($window, Records, SequenceService, PollService, LmoUrlService) {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/common/start_poll/poll_common_start_poll.html',
    controller: function($scope) {
      $scope.poll.makeAnnouncement = $scope.poll.isNew();
      return PollService.applyPollStartSequence($scope);
    }
  };
});

angular.module('loomioApp').directive('pollCommonToolTip', function(Session, AppConfig, Records) {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/common/tool_tip/poll_common_tool_tip.html',
    controller: function($scope) {
      var experienceKey;
      $scope.showHelpLink = AppConfig.features.app.help_link;
      experienceKey = $scope.poll.pollType + "_tool_tip";
      $scope.collapsed = Session.user().hasExperienced(experienceKey);
      if (!Session.user().hasExperienced(experienceKey)) {
        Records.users.saveExperience(experienceKey);
      }
      $scope.hide = function() {
        return $scope.collapsed = true;
      };
      return $scope.show = function() {
        return $scope.collapsed = false;
      };
    }
  };
});

angular.module('loomioApp').directive('pollCommonVoterAddOptions', function(PollService) {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/common/voter_add_options/poll_common_voter_add_options.html',
    controller: function($scope) {
      return $scope.validPollType = function() {
        return PollService.fieldFromTemplate($scope.poll.pollType, 'can_add_options');
      };
    }
  };
});

angular.module('loomioApp').directive('pollCommonVotesPanel', function(PollService, RecordLoader) {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/common/votes_panel/poll_common_votes_panel.html',
    controller: function($scope) {
      var sortFn;
      $scope.fix = {};
      $scope.sortOptions = PollService.fieldFromTemplate($scope.poll.pollType, 'sort_options');
      $scope.fix.votesOrder = $scope.sortOptions[0];
      $scope.loader = new RecordLoader({
        collection: 'stances',
        params: {
          poll_id: $scope.poll.key,
          order: $scope.fix.votesOrder
        }
      });
      $scope.hasSomeVotes = function() {
        return $scope.poll.stancesCount > 0;
      };
      $scope.moreToLoad = function() {
        return $scope.loader.numLoaded < $scope.poll.stancesCount;
      };
      sortFn = {
        newest_first: function(stance) {
          return -stance.createdAt;
        },
        oldest_first: function(stance) {
          return stance.createdAt;
        },
        priority_first: function(stance) {
          return stance.pollOption().priority;
        },
        priority_last: function(stance) {
          return -(stance.pollOption().priority);
        }
      };
      $scope.stances = function() {
        return $scope.poll.latestStances(sortFn[$scope.fix.votesOrder], $scope.loader.numLoaded);
      };
      $scope.changeOrder = function() {
        $scope.loader.reset();
        $scope.loader.params.order = $scope.fix.votesOrder;
        return $scope.loader.fetchRecords();
      };
      $scope.loader.fetchRecords();
      return $scope.$on('refreshStance', function() {
        return $scope.loader.fetchRecords();
      });
    }
  };
});

angular.module('loomioApp').directive('pollCommonVotesPanelStance', function($translate, TranslationService) {
  return {
    scope: {
      stance: '='
    },
    templateUrl: 'generated/components/poll/common/votes_panel_stance/poll_common_votes_panel_stance.html',
    controller: function($scope) {
      TranslationService.listenForTranslations($scope);
      return $scope.participantName = function() {
        if ($scope.stance.participant()) {
          return $scope.stance.participant().name;
        } else {
          return $translate.instant('common.anonymous');
        }
      };
    }
  };
});

angular.module('loomioApp').directive('pollCountChartPanel', function(AppConfig, Records) {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/count/chart_panel/poll_count_chart_panel.html',
    controller: function($scope) {
      $scope.percentComplete = function(index) {
        return (100 * $scope.poll.stanceCounts[index] / $scope.poll.goal()) + "%";
      };
      return $scope.colors = AppConfig.pollColors.count;
    }
  };
});

angular.module('loomioApp').directive('pollCountForm', function() {
  return {
    scope: {
      poll: '=',
      back: '=?'
    },
    templateUrl: 'generated/components/poll/count/form/poll_count_form.html'
  };
});

angular.module('loomioApp').directive('pollCountStanceChoice', function() {
  return {
    scope: {
      stanceChoice: '='
    },
    templateUrl: 'generated/components/poll/count/stance_choice/poll_count_stance_choice.html'
  };
});

angular.module('loomioApp').directive('pollCountVoteForm', function(AppConfig, Records, PollService, KeyEventService) {
  return {
    scope: {
      stance: '='
    },
    templateUrl: 'generated/components/poll/count/vote_form/poll_count_vote_form.html',
    controller: function($scope) {
      $scope.submit = PollService.submitStance($scope, $scope.stance, {
        prepareFn: function(optionName) {
          var option;
          option = PollService.optionByName($scope.stance.poll(), optionName);
          $scope.$emit('processing');
          return $scope.stance.stanceChoicesAttributes = [
            {
              poll_option_id: option.id
            }
          ];
        }
      });
      $scope.yesColor = AppConfig.pollColors.count[0];
      $scope.noColor = AppConfig.pollColors.count[1];
      return KeyEventService.submitOnEnter($scope);
    }
  };
});

angular.module('loomioApp').directive('pollDotVoteChartPanel', function() {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/dot_vote/chart_panel/poll_dot_vote_chart_panel.html'
  };
});

angular.module('loomioApp').directive('pollDotVoteForm', function() {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/dot_vote/form/poll_dot_vote_form.html',
    controller: function($scope) {
      return $scope.poll.customFields.dots_per_person = $scope.poll.customFields.dots_per_person || 8;
    }
  };
});

angular.module('loomioApp').directive('pollDotVoteStanceChoice', function() {
  return {
    scope: {
      stanceChoice: '='
    },
    templateUrl: 'generated/components/poll/dot_vote/stance_choice/poll_dot_vote_stance_choice.html'
  };
});

angular.module('loomioApp').directive('pollDotVoteVoteForm', function() {
  return {
    scope: {
      stance: '='
    },
    templateUrl: 'generated/components/poll/dot_vote/vote_form/poll_dot_vote_vote_form.html',
    controller: function($scope, Records, PollService, KeyEventService) {
      var backgroundImageFor, percentageFor;
      $scope.vars = {};
      percentageFor = function(choice) {
        var max;
        max = $scope.stance.poll().customFields.dots_per_person;
        if (!(max > 0)) {
          return;
        }
        return (100 * choice.score / max) + "%";
      };
      backgroundImageFor = function(option) {
        return "url(/img/poll_backgrounds/" + (option.color.replace('#', '')) + ".png)";
      };
      $scope.styleData = function(choice) {
        var option;
        option = $scope.optionFor(choice);
        return {
          'border-color': option.color,
          'background-image': backgroundImageFor(option),
          'background-size': percentageFor(choice)
        };
      };
      $scope.stanceChoiceFor = function(option) {
        return _.first(_.filter($scope.stance.stanceChoices(), function(choice) {
          return choice.pollOptionId === option.id;
        }).concat({
          score: 0
        }));
      };
      $scope.adjust = function(choice, amount) {
        return choice.score += amount;
      };
      $scope.optionFor = function(choice) {
        return Records.pollOptions.find(choice.poll_option_id);
      };
      $scope.dotsRemaining = function() {
        return $scope.stance.poll().customFields.dots_per_person - _.sum(_.pluck($scope.stanceChoices, 'score'));
      };
      $scope.tooManyDots = function() {
        return $scope.dotsRemaining() < 0;
      };
      $scope.setStanceChoices = function() {
        return $scope.stanceChoices = _.map($scope.stance.poll().pollOptions(), function(option) {
          return {
            poll_option_id: option.id,
            score: $scope.stanceChoiceFor(option).score
          };
        });
      };
      $scope.setStanceChoices();
      $scope.$on('pollOptionsAdded', $scope.setStanceChoices);
      $scope.submit = PollService.submitStance($scope, $scope.stance, {
        prepareFn: function() {
          $scope.$emit('processing');
          if (!(_.sum(_.pluck($scope.stanceChoices, 'score')) > 0)) {
            return;
          }
          return $scope.stance.stanceChoicesAttributes = $scope.stanceChoices;
        }
      });
      return KeyEventService.submitOnEnter($scope);
    }
  };
});

angular.module('loomioApp').directive('pollDotVoteVotesPanelStance', function($translate, PollService, RecordLoader) {
  return {
    scope: {
      stance: '='
    },
    templateUrl: 'generated/components/poll/dot_vote/votes_panel_stance/poll_dot_vote_votes_panel_stance.html',
    controller: function($scope) {
      var backgroundImageFor, percentageFor;
      $scope.barTextFor = function(choice) {
        return (choice.score + " - " + (choice.pollOption().name)).replace(/\s/g, '\u00a0');
      };
      $scope.participantName = function() {
        if ($scope.stance.participant()) {
          return $scope.stance.participant().name;
        } else {
          return $translate.instant('common.anonymous');
        }
      };
      percentageFor = function(choice) {
        var max;
        max = $scope.stance.poll().customFields.dots_per_person;
        if (!(max > 0)) {
          return;
        }
        return (100 * choice.score / max) + "%";
      };
      backgroundImageFor = function(choice) {
        return "url(/img/poll_backgrounds/" + (choice.pollOption().color.replace('#', '')) + ".png)";
      };
      $scope.styleData = function(choice) {
        return {
          'background-image': backgroundImageFor(choice),
          'background-size': percentageFor(choice)
        };
      };
      return $scope.stanceChoices = function() {
        return _.sortBy($scope.stance.stanceChoices(), 'score').reverse();
      };
    }
  };
});

angular.module('loomioApp').directive('pollMeetingChartPanel', function() {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/meeting/chart_panel/poll_meeting_chart_panel.html',
    controller: function($scope) {
      return $scope.$on('timeZoneSelected', function(e, zone) {
        return $scope.zone = zone;
      });
    }
  };
});

angular.module('loomioApp').directive('pollMeetingForm', function() {
  return {
    scope: {
      poll: '=',
      back: '=?'
    },
    templateUrl: 'generated/components/poll/meeting/form/poll_meeting_form.html',
    controller: function($scope, AppConfig) {
      $scope.removeOption = function(name) {
        return _.pull($scope.poll.pollOptionNames, name);
      };
      $scope.durations = AppConfig.durations;
      $scope.poll.customFields.meeting_duration = $scope.poll.customFields.meeting_duration || 60;
      if ($scope.poll.isNew()) {
        $scope.poll.closingAt = moment().add(2, 'day');
        $scope.poll.notifyOnParticipate = true;
        if ($scope.poll.group()) {
          $scope.poll.makeAnnouncement = true;
        }
      }
      return $scope.$on('timeZoneSelected', function(e, zone) {
        return $scope.poll.customFields.time_zone = zone;
      });
    }
  };
});

angular.module('loomioApp').directive('pollMeetingStanceChoice', function() {
  return {
    scope: {
      stanceChoice: '='
    },
    templateUrl: 'generated/components/poll/meeting/stance_choice/poll_meeting_stance_choice.html'
  };
});

angular.module('loomioApp').directive('pollMeetingTime', function(TimeService) {
  return {
    scope: {
      name: '=',
      zone: '='
    },
    template: "<span>{{displayDate(date, zone)}}</span>",
    controller: function($scope) {
      $scope.date = moment($scope.name);
      return $scope.displayDate = TimeService.displayDate;
    }
  };
});

angular.module('loomioApp').directive('pollMeetingTimeField', function(TimeService) {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/meeting/time_field/poll_meeting_time_field.html',
    controller: function($scope) {
      var determineOptionName;
      $scope.dateToday = moment().format('YYYY-MM-DD');
      $scope.option = {};
      $scope.times = TimeService.timesOfDay();
      $scope.minDate = new Date();
      $scope.addOption = function() {
        var optionName;
        optionName = determineOptionName();
        if (!($scope.option.date && !_.contains($scope.poll.pollOptionNames, optionName))) {
          return;
        }
        return $scope.poll.pollOptionNames.push(optionName);
      };
      $scope.$on('addPollOption', $scope.addOption);
      $scope.hasTime = function() {
        return ($scope.option.time || "").length > 0;
      };
      return determineOptionName = function() {
        var optionName;
        optionName = moment($scope.option.date).format('YYYY-MM-DD');
        if ($scope.hasTime()) {
          optionName = moment(optionName + " " + $scope.option.time, 'YYYY-MM-DD h:mma').toISOString();
        }
        return optionName;
      };
    }
  };
});

angular.module('loomioApp').directive('pollMeetingVoteForm', function() {
  return {
    scope: {
      stance: '='
    },
    templateUrl: 'generated/components/poll/meeting/vote_form/poll_meeting_vote_form.html',
    controller: function($scope, PollService, KeyEventService) {
      var initForm;
      $scope.vars = {};
      initForm = (function() {
        return $scope.pollOptionIdsChecked = _.fromPairs(_.map($scope.stance.stanceChoices(), function(choice) {
          return [choice.pollOptionId, true];
        }));
      })();
      $scope.submit = PollService.submitStance($scope, $scope.stance, {
        prepareFn: function() {
          var attrs;
          $scope.$emit('processing');
          attrs = _.map(_.compact(_.map($scope.pollOptionIdsChecked, function(v, k) {
            if (v) {
              return parseInt(k);
            }
          })), function(id) {
            return {
              poll_option_id: id
            };
          });
          if (_.any(attrs)) {
            return $scope.stance.stanceChoicesAttributes = attrs;
          }
        }
      });
      $scope.$on('timeZoneSelected', function(e, zone) {
        return $scope.zone = zone;
      });
      return KeyEventService.submitOnEnter($scope);
    }
  };
});

angular.module('loomioApp').directive('pollMeetingVotesPanelStance', function($translate, TranslationService) {
  return {
    scope: {
      stance: '='
    },
    templateUrl: 'generated/components/poll/meeting/votes_panel_stance/poll_meeting_votes_panel_stance.html',
    controller: function($scope) {
      TranslationService.listenForTranslations($scope);
      return $scope.participantName = function() {
        if ($scope.stance.participant()) {
          return $scope.stance.participant().name;
        } else {
          return $translate.instant('common.anonymous');
        }
      };
    }
  };
});

angular.module('loomioApp').directive('pollPollChartPanel', function() {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/poll/chart_panel/poll_poll_chart_panel.html'
  };
});

angular.module('loomioApp').directive('pollPollForm', function() {
  return {
    scope: {
      poll: '=',
      back: '=?'
    },
    templateUrl: 'generated/components/poll/poll/form/poll_poll_form.html'
  };
});

angular.module('loomioApp').directive('pollPollStanceChoice', function() {
  return {
    scope: {
      stanceChoice: '='
    },
    templateUrl: 'generated/components/poll/poll/stance_choice/poll_poll_stance_choice.html'
  };
});

angular.module('loomioApp').directive('pollPollVoteForm', function() {
  return {
    scope: {
      stance: '='
    },
    templateUrl: 'generated/components/poll/poll/vote_form/poll_poll_vote_form.html',
    controller: function($scope, PollService, KeyEventService) {
      var initForm;
      $scope.vars = {};
      $scope.pollOptionIdsChecked = {};
      initForm = (function() {
        if ($scope.stance.poll().multipleChoice) {
          return $scope.pollOptionIdsChecked = _.fromPairs(_.map($scope.stance.stanceChoices(), function(choice) {
            return [choice.pollOptionId, true];
          }));
        } else {
          return $scope.vars.pollOptionId = $scope.stance.pollOptionId();
        }
      })();
      $scope.submit = PollService.submitStance($scope, $scope.stance, {
        prepareFn: function() {
          var selectedOptionIds;
          $scope.$emit('processing');
          selectedOptionIds = $scope.stance.poll().multipleChoice ? _.compact(_.map($scope.pollOptionIdsChecked, function(v, k) {
            if (v) {
              return parseInt(k);
            }
          })) : [$scope.vars.pollOptionId];
          if (_.any(selectedOptionIds)) {
            return $scope.stance.stanceChoicesAttributes = _.map(selectedOptionIds, function(id) {
              return {
                poll_option_id: id
              };
            });
          }
        }
      });
      return KeyEventService.submitOnEnter($scope);
    }
  };
});

angular.module('loomioApp').directive('pollProposalChart', function(AppConfig) {
  return {
    template: '<div class="poll-proposal-chart"></div>',
    replace: true,
    scope: {
      stanceCounts: '=',
      diameter: '@'
    },
    restrict: 'E',
    controller: function($scope, $element) {
      var arcPath, draw, half, radius, shapes, uniquePositionsCount;
      draw = SVG($element[0]).size('100%', '100%');
      half = $scope.diameter / 2.0;
      radius = half;
      shapes = [];
      arcPath = function(startAngle, endAngle) {
        var rad, x1, x2, y1, y2;
        rad = Math.PI / 180;
        x1 = half + radius * Math.cos(-startAngle * rad);
        x2 = half + radius * Math.cos(-endAngle * rad);
        y1 = half + radius * Math.sin(-startAngle * rad);
        y2 = half + radius * Math.sin(-endAngle * rad);
        return ["M", half, half, "L", x1, y1, "A", radius, radius, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"].join(' ');
      };
      uniquePositionsCount = function() {
        return _.compact($scope.stanceCounts).length;
      };
      return $scope.$watchCollection('stanceCounts', function() {
        var start;
        _.each(shapes, function(shape) {
          return shape.remove();
        });
        start = 90;
        switch (uniquePositionsCount()) {
          case 0:
            return shapes.push(draw.circle($scope.diameter).attr({
              'stroke-width': 0,
              fill: '#aaa'
            }));
          case 1:
            return shapes.push(draw.circle($scope.diameter).attr({
              'stroke-width': 0,
              fill: AppConfig.pollColors.proposal[_.findIndex($scope.stanceCounts, function(count) {
                return count > 0;
              })]
            }));
          default:
            return _.each($scope.stanceCounts, function(count, index) {
              var angle;
              if (!(count > 0)) {
                return;
              }
              angle = 360 / _.sum($scope.stanceCounts) * count;
              shapes.push(draw.path(arcPath(start, start + angle)).attr({
                'stroke-width': 0,
                fill: AppConfig.pollColors.proposal[index]
              }));
              return start += angle;
            });
        }
      });
    }
  };
});

angular.module('loomioApp').directive('pollProposalChartPanel', function(Records) {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/proposal/chart_panel/poll_proposal_chart_panel.html',
    controller: function($scope, $translate) {
      $scope.pollOptionNames = function() {
        return ['agree', 'abstain', 'disagree', 'block'];
      };
      $scope.countFor = function(name) {
        return $scope.poll.stanceData[name] || 0;
      };
      return $scope.translationFor = function(name) {
        return $translate.instant("poll_proposal_options." + name);
      };
    }
  };
});

angular.module('loomioApp').directive('pollProposalChartPreview', function() {
  return {
    scope: {
      myStance: '=',
      stanceCounts: '='
    },
    templateUrl: 'generated/components/poll/proposal/chart_preview/poll_proposal_chart_preview.html'
  };
});

angular.module('loomioApp').directive('pollProposalForm', function() {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/proposal/form/poll_proposal_form.html'
  };
});

angular.module('loomioApp').directive('pollProposalStanceChoice', function() {
  return {
    scope: {
      stanceChoice: '='
    },
    templateUrl: 'generated/components/poll/proposal/stance_choice/poll_proposal_stance_choice.html'
  };
});

angular.module('loomioApp').directive('pollProposalVoteForm', function() {
  return {
    scope: {
      stance: '='
    },
    templateUrl: 'generated/components/poll/proposal/vote_form/poll_proposal_vote_form.html',
    controller: function($scope, PollService, KeyEventService) {
      $scope.stance.selectedOption = $scope.stance.pollOption();
      $scope.submit = PollService.submitStance($scope, $scope.stance, {
        prepareFn: function() {
          $scope.$emit('processing');
          if (!$scope.stance.selectedOption) {
            return;
          }
          return $scope.stance.stanceChoicesAttributes = [
            {
              poll_option_id: $scope.stance.selectedOption.id
            }
          ];
        }
      });
      $scope.cancelOption = function() {
        return $scope.stance.selected = null;
      };
      $scope.reasonPlaceholder = function() {
        var pollOptionName;
        pollOptionName = ($scope.stance.selectedOption || {
          name: 'default'
        }).name;
        return "poll_proposal_vote_form." + pollOptionName + "_reason_placeholder";
      };
      return KeyEventService.submitOnEnter($scope);
    }
  };
});

angular.module('loomioApp').directive('pollRankedChoiceChartPanel', function() {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/ranked_choice/chart_panel/poll_ranked_choice_chart_panel.html'
  };
});

angular.module('loomioApp').directive('pollRankedChoiceForm', function() {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/ranked_choice/form/poll_ranked_choice_form.html',
    controller: function($scope) {
      var setMinimumStanceChoices;
      setMinimumStanceChoices = function() {
        if (!$scope.poll.isNew()) {
          return;
        }
        return $scope.poll.customFields.minimum_stance_choices = _.max([$scope.poll.pollOptionNames.length, 1]);
      };
      setMinimumStanceChoices();
      return $scope.$on('pollOptionsChanged', setMinimumStanceChoices);
    }
  };
});

angular.module('loomioApp').directive('pollRankedChoiceStanceChoice', function() {
  return {
    scope: {
      stanceChoice: '='
    },
    templateUrl: 'generated/components/poll/ranked_choice/stance_choice/poll_ranked_choice_stance_choice.html'
  };
});

angular.module('loomioApp').directive('pollRankedChoiceVoteForm', function() {
  return {
    scope: {
      stance: '='
    },
    templateUrl: 'generated/components/poll/ranked_choice/vote_form/poll_ranked_choice_vote_form.html',
    controller: function($scope, PollService, KeyEventService) {
      var initForm, swap;
      initForm = (function() {
        $scope.numChoices = $scope.stance.poll().customFields.minimum_stance_choices;
        return $scope.pollOptions = _.sortBy($scope.stance.poll().pollOptions(), function(option) {
          var choice;
          choice = _.find($scope.stance.stanceChoices(), _.matchesProperty('pollOptionId', option.id));
          return -(choice || {}).score;
        });
      })();
      $scope.submit = PollService.submitStance($scope, $scope.stance, {
        prepareFn: function() {
          var selected;
          $scope.$emit('processing');
          selected = _.take($scope.pollOptions, $scope.numChoices);
          return $scope.stance.stanceChoicesAttributes = _.map(selected, function(option, index) {
            return {
              poll_option_id: option.id,
              score: $scope.numChoices - index
            };
          });
        }
      });
      $scope.setSelected = function(option) {
        return $scope.selectedOption = option;
      };
      $scope.selectedOptionIndex = function() {
        return _.findIndex($scope.pollOptions, $scope.selectedOption);
      };
      $scope.isSelected = function(option) {
        return $scope.selectedOption === option;
      };
      KeyEventService.submitOnEnter($scope);
      KeyEventService.registerKeyEvent($scope, 'pressedUpArrow', function() {
        return swap($scope.selectedOptionIndex(), $scope.selectedOptionIndex() - 1);
      });
      KeyEventService.registerKeyEvent($scope, 'pressedDownArrow', function() {
        return swap($scope.selectedOptionIndex(), $scope.selectedOptionIndex() + 1);
      });
      KeyEventService.registerKeyEvent($scope, 'pressedEsc', function() {
        return $scope.selectedOption = null;
      });
      return swap = function(fromIndex, toIndex) {
        if (!(fromIndex >= 0 && fromIndex < $scope.pollOptions.length && toIndex >= 0 && toIndex < $scope.pollOptions.length)) {
          return;
        }
        $scope.pollOptions[fromIndex] = $scope.pollOptions[toIndex];
        return $scope.pollOptions[toIndex] = $scope.selectedOption;
      };
    }
  };
});

angular.module('loomioApp').directive('pollCommonAddOptionButton', function(ModalService, PollCommonAddOptionModal) {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/common/add_option/button/poll_common_add_option_button.html',
    replace: true,
    controller: function($scope) {
      return $scope.open = function() {
        return ModalService.open(PollCommonAddOptionModal, {
          poll: function() {
            return $scope.poll;
          }
        });
      };
    }
  };
});

angular.module('loomioApp').directive('pollCommonAddOptionForm', function(PollService) {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/common/add_option/form/poll_common_add_option_form.html',
    replace: true,
    controller: function($scope, $rootScope) {
      return $scope.submit = PollService.submitPoll($scope, $scope.poll, {
        submitFn: $scope.poll.addOptions,
        prepareFn: function() {
          $scope.$broadcast('addPollOption');
          return $scope.$emit('processing');
        },
        successCallback: function() {
          $scope.$emit('$close');
          return $rootScope.$broadcast('pollOptionsAdded', $scope.poll);
        },
        flashSuccess: "poll_common_add_option.form.options_added"
      });
    }
  };
});

angular.module('loomioApp').factory('PollCommonAddOptionModal', function(LoadingService) {
  return {
    templateUrl: 'generated/components/poll/common/add_option/modal/poll_common_add_option_modal.html',
    controller: function($scope, poll) {
      $scope.poll = poll.clone();
      $scope.$on('$close', $scope.$close);
      return LoadingService.listenForLoading($scope);
    }
  };
});

angular.module('loomioApp').directive('pollCommonPublishFacebookPreview', function() {
  return {
    scope: {
      community: '=',
      poll: '=',
      message: '='
    },
    templateUrl: 'generated/components/poll/common/publish/facebook_preview/poll_common_publish_facebook_preview.html',
    controller: function($scope, $location) {
      return $scope.host = function() {
        return $location.host();
      };
    }
  };
});

angular.module('loomioApp').directive('pollCommonPublishSlackPreview', function(AppConfig, $translate, Session) {
  return {
    scope: {
      community: '=',
      poll: '=',
      message: '='
    },
    templateUrl: 'generated/components/poll/common/publish/slack_preview/poll_common_publish_slack_preview.html',
    controller: function($scope) {
      $scope.siteName = AppConfig.theme.site_name;
      $scope.userName = Session.user().name;
      return $scope.timestamp = function() {
        return moment().format('h:ma');
      };
    }
  };
});

angular.module('loomioApp').directive('pollCommonShareEmailForm', function($translate, Records, FlashService, KeyEventService) {
  return {
    scope: {
      poll: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/poll/common/share/email_form/poll_common_share_email_form.html',
    controller: function($scope) {
      $scope.newEmail = '';
      $scope.addIfValid = function() {
        $scope.emailValidationError = null;
        $scope.checkEmailNotEmpty();
        $scope.checkEmailValid();
        $scope.checkEmailAvailable();
        if (!$scope.emailValidationError) {
          return $scope.add();
        }
      };
      $scope.add = function() {
        if (!($scope.newEmail.length > 0)) {
          return;
        }
        $scope.poll.customFields.pending_emails.push($scope.newEmail);
        $scope.newEmail = '';
        return $scope.emailValidationError = null;
      };
      $scope.submit = function() {
        $scope.emailValidationError = null;
        $scope.checkEmailValid();
        $scope.checkEmailAvailable();
        if (!$scope.emailValidationError) {
          $scope.add();
          return $scope.poll.inviteGuests().then(function() {
            FlashService.success('poll_common_share_form.guests_invited', {
              count: $scope.poll.customFields.pending_emails.length
            });
            return $scope.$emit('$close');
          });
        }
      };
      $scope.checkEmailNotEmpty = function() {
        if ($scope.newEmail.length <= 0) {
          return $scope.emailValidationError = $translate.instant('poll_common_share_form.email_empty');
        }
      };
      $scope.checkEmailValid = function() {
        if ($scope.newEmail.length > 0 && !$scope.newEmail.match(/[^\s,;<>]+?@[^\s,;<>]+\.[^\s,;<>]+/g)) {
          return $scope.emailValidationError = $translate.instant('poll_common_share_form.email_invalid');
        }
      };
      $scope.checkEmailAvailable = function() {
        if (_.contains($scope.poll.customFields.pending_emails, $scope.newEmail)) {
          return $scope.emailValidationError = $translate.instant('poll_common_share_form.email_exists', {
            email: $scope.newEmail
          });
        }
      };
      $scope.remove = function(email) {
        return _.pull($scope.poll.customFields.pending_emails, email);
      };
      return KeyEventService.registerKeyEvent($scope, 'pressedEnter', $scope.add, function(active) {
        return active.classList.contains('poll-common-share-form__add-option-input');
      });
    }
  };
});

angular.module('loomioApp').directive('pollCommonShareForm', function(Session, Records, AbilityService) {
  return {
    scope: {
      poll: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/poll/common/share/form/poll_common_share_form.html',
    controller: function($scope) {
      $scope.hasGroups = function() {
        return _.any(_.filter(Session.user().groups(), function(group) {
          return AbilityService.canStartPoll(group);
        }));
      };
      return $scope.hasPendingEmails = function() {
        return _.has($scope.poll, 'customFields.pending_emails.length') && $scope.poll.customFields.pending_emails.length > 0;
      };
    }
  };
});

angular.module('loomioApp').directive('pollCommonShareFormActions', function() {
  return {
    scope: {
      poll: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/poll/common/share/form_actions/poll_common_share_form_actions.html'
  };
});

angular.module('loomioApp').directive('pollCommonShareGroupForm', function(Session, AbilityService, PollService) {
  return {
    scope: {
      poll: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/poll/common/share/group_form/poll_common_share_group_form.html',
    controller: function($scope) {
      $scope.groupId = $scope.poll.groupId;
      $scope.submit = PollService.submitPoll($scope, $scope.poll, {
        flashSuccess: 'poll_common_share_form.group_set',
        successCallback: function() {
          return $scope.groupId = $scope.poll.groupId;
        }
      });
      return $scope.groups = function() {
        return _.filter(Session.user().groups(), function(group) {
          return AbilityService.canStartPoll(group);
        });
      };
    }
  };
});

angular.module('loomioApp').directive('pollCommonShareLinkForm', function(LmoUrlService, FlashService) {
  return {
    scope: {
      poll: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/poll/common/share/link_form/poll_common_share_link_form.html',
    controller: function($scope) {
      $scope.shareableLink = LmoUrlService.poll($scope.poll, {}, {
        absolute: true
      });
      $scope.setAnyoneCanParticipate = function() {
        $scope.settingAnyoneCanParticipate = true;
        return $scope.poll.save().then(function() {
          return FlashService.success("poll_common_share_form.anyone_can_participate_" + $scope.poll.anyoneCanParticipate);
        })["finally"](function() {
          return $scope.settingAnyoneCanParticipate = false;
        });
      };
      return $scope.copied = function() {
        return FlashService.success('common.copied');
      };
    }
  };
});

angular.module('loomioApp').directive('pollCommonShareVisitorForm', function($translate, Records, KeyEventService, FlashService) {
  return {
    scope: {
      poll: '='
    },
    restrict: 'E',
    templateUrl: 'generated/components/poll/common/share/visitor_form/poll_common_share_visitor_form.html',
    controller: function($scope) {
      $scope.invitations = function() {
        return Records.invitations.find({
          groupId: $scope.poll.guestGroupId
        });
      };
      $scope.init = function() {
        Records.invitations.fetch({
          params: {
            group_id: $scope.poll.guestGroupId
          }
        });
        return $scope.newInvitation = Records.invitations.build({
          recipientEmail: '',
          groupId: $scope.poll.guestGroupId,
          intent: 'join_poll'
        });
      };
      $scope.init();
      $scope.submit = function() {
        if ($scope.newInvitation.recipientEmail.length <= 0) {
          return $scope.emailValidationError = $translate.instant('poll_common_share_form.email_empty');
        } else if (_.contains(_.pluck($scope.invitations(), 'recipientEmail'), $scope.newInvitation.recipientEmail)) {
          return $scope.emailValidationError = $translate.instant('poll_common_share_form.email_exists', {
            email: $scope.newInvitation.recipientEmail
          });
        } else if (!$scope.newInvitation.recipientEmail.match(/[^\s,;<>]+?@[^\s,;<>]+\.[^\s,;<>]+/g)) {
          return $scope.emailValidationError = $translate.instant('poll_common_share_form.email_invalid');
        } else {
          $scope.emailValidationError = null;
          return $scope.newInvitation.save().then(function() {
            FlashService.success('poll_common_share_form.email_invited', {
              email: $scope.newInvitation.recipientEmail
            });
            $scope.init();
            return document.querySelector('.poll-common-share-form__add-option-input').focus();
          });
        }
      };
      $scope.revoke = function(visitor) {
        return visitor.destroy().then(function() {
          visitor.revoked = true;
          return FlashService.success("poll_common_share_form.guest_revoked", {
            email: visitor.email
          });
        });
      };
      $scope.remind = function(visitor) {
        return visitor.remind($scope.poll).then(function() {
          visitor.reminded = true;
          return FlashService.success('poll_common_share_form.email_invited', {
            email: visitor.email
          });
        });
      };
      return KeyEventService.registerKeyEvent($scope, 'pressedEnter', $scope.submit, function(active) {
        return active.classList.contains('poll-common-share-form__add-option-input');
      });
    }
  };
});

angular.module('loomioApp').directive('pollCommonUndecidedPanel', function($location, Records, RecordLoader, AbilityService, PollService) {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/common/undecided/panel/poll_common_undecided_panel.html',
    controller: function($scope) {
      var params;
      $scope.canShowUndecided = function() {
        return !$scope.showingUndecided && !$scope.poll.anonymous && ($scope.poll.undecidedUserCount > 0 || ($scope.poll.guestGroup() || {}).pendingInvitationsCount > 0);
      };
      params = {
        poll_id: $scope.poll.key,
        invitation_token: $location.search().invitation_token
      };
      $scope.loaders = {
        memberships: new RecordLoader({
          collection: $scope.poll.isActive() ? 'memberships' : 'poll_did_not_votes',
          path: $scope.poll.isActive() ? 'undecided' : '',
          params: params
        }),
        invitations: new RecordLoader({
          collection: 'invitations',
          path: 'pending',
          params: params
        })
      };
      $scope.canSharePoll = function() {
        return AbilityService.canSharePoll($scope.poll);
      };
      $scope.showUndecided = function() {
        $scope.showingUndecided = true;
        if ($scope.moreMembershipsToLoad()) {
          return $scope.loaders.memberships.fetchRecords();
        } else {
          return $scope.loaders.invitations.fetchRecords();
        }
      };
      $scope.moreMembershipsToLoad = function() {
        return $scope.loaders.memberships.numLoaded < $scope.poll.undecidedUserCount;
      };
      $scope.moreInvitationsToLoad = function() {
        return $scope.canSharePoll() && $scope.loaders.invitations.numLoaded < $scope.poll.guestGroup().pendingInvitationsCount;
      };
      $scope.loadMemberships = function() {
        return $scope.loaders.memberships.loadMore();
      };
      return $scope.loadInvitations = function() {
        return $scope.loaders.invitations.loadMore();
      };
    }
  };
});

angular.module('loomioApp').directive('pollCommonUndecidedUser', function(FlashService, LoadingService) {
  return {
    scope: {
      user: '=',
      poll: '='
    },
    templateUrl: 'generated/components/poll/common/undecided/user/poll_common_undecided_user.html',
    controller: function($scope) {
      $scope.resend = function() {
        return $scope.user.resend().then(function() {
          return FlashService.success('common.action.resent');
        });
      };
      LoadingService.applyLoadingFunction($scope, 'resend');
      $scope.remind = function() {
        return $scope.user.remind($scope.poll).then(function() {
          return FlashService.success('poll_common_undecided_user.reminder_sent');
        });
      };
      return LoadingService.applyLoadingFunction($scope, 'remind');
    }
  };
});

angular.module('loomioApp').directive('pollCommonUnsubscribeForm', function(FormService) {
  return {
    scope: {
      poll: '='
    },
    templateUrl: 'generated/components/poll/common/unsubscribe/form/poll_common_unsubscribe_form.html',
    controller: function($scope) {
      return $scope.toggle = FormService.submit($scope, $scope.poll, {
        submitFn: $scope.poll.toggleSubscription,
        flashSuccess: function() {
          if ($scope.poll.subscribed) {
            return 'poll_common_unsubscribe_form.subscribed';
          } else {
            return 'poll_common_unsubscribe_form.unsubscribed';
          }
        }
      });
    }
  };
});

angular.module('loomioApp').factory('PollCommonUnsubscribeModal', function(PollService) {
  return {
    templateUrl: 'generated/components/poll/common/unsubscribe/modal/poll_common_unsubscribe_modal.html',
    controller: function($scope, poll) {
      return $scope.poll = poll;
    }
  };
});

angular.module('loomioApp').controller('RootController', function($scope, $timeout, $translate, $location, $router, $mdMedia, AuthModal, KeyEventService, MessageChannelService, IntercomService, ScrollService, Session, AppConfig, Records, ModalService, GroupModal, AbilityService, AhoyService, ViewportService, HotkeyService) {
  var setTitle;
  $scope.isLoggedIn = function() {
    return AbilityService.isLoggedIn();
  };
  $scope.isEmailVerified = function() {
    return AbilityService.isEmailVerified();
  };
  $scope.currentComponent = 'nothing yet';
  $translate.onReady(function() {
    return $scope.translationsLoaded = true;
  });
  $scope.refresh = function() {
    $scope.pageError = null;
    $scope.refreshing = true;
    return $timeout(function() {
      return $scope.refreshing = false;
    });
  };
  $scope.renderSidebar = $mdMedia('gt-md');
  $scope.$on('toggleSidebar', function(event, show) {
    if (show === false) {
      return;
    }
    return $scope.renderSidebar = true;
  });
  $scope.$on('loggedIn', function(event, user) {
    $scope.refresh();
    if ($location.search().start_group != null) {
      ModalService.open(GroupModal, {
        group: function() {
          return Records.groups.build({
            customFields: {
              pending_emails: $location.search().pending_emails
            }
          });
        }
      });
    }
    IntercomService.boot();
    return MessageChannelService.subscribe();
  });
  setTitle = function(title) {
    document.querySelector('title').text = _.trunc(title, 300) + (" | " + AppConfig.theme.site_name);
    return Session.pageTitle = title;
  };
  $scope.$on('currentComponent', function(event, options) {
    if (options == null) {
      options = {};
    }
    setTitle(options.title || $translate.instant(options.titleKey));
    Session.currentGroup = options.group;
    IntercomService.updateWithGroup(Session.currentGroup);
    $scope.pageError = null;
    $scope.$broadcast('clearBackgroundImageUrl');
    if (!options.skipScroll) {
      ScrollService.scrollTo(options.scrollTo || 'h1');
    }
    $scope.links = options.links || {};
    if (AbilityService.requireLoginFor(options.page) || (AppConfig.pendingIdentity != null)) {
      return $scope.forceSignIn();
    }
  });
  $scope.$on('pageError', function(event, error) {
    $scope.pageError = error;
    if (!AbilityService.isLoggedIn() && error.status === 403) {
      return $scope.forceSignIn();
    }
  });
  $scope.$on('setBackgroundImageUrl', function(event, group) {
    var url;
    url = group.coverUrl(ViewportService.viewportSize());
    return angular.element(document.querySelector('.lmo-main-background')).attr('style', "background-image: url(" + url + ")");
  });
  $scope.$on('clearBackgroundImageUrl', function(event) {
    return angular.element(document.querySelector('.lmo-main-background')).removeAttr('style');
  });
  $scope.forceSignIn = function() {
    if ($scope.forcedSignIn) {
      return;
    }
    $scope.forcedSignIn = true;
    return ModalService.open(AuthModal, {
      preventClose: function() {
        return true;
      }
    });
  };
  $scope.keyDown = function(event) {
    return KeyEventService.broadcast(event);
  };
  $router.config(AppConfig.routes.concat(AppConfig.plugins.routes));
  AppConfig.records = Records;
  AhoyService.init();
  Session.login(AppConfig.bootData);
  if (AbilityService.isLoggedIn()) {
    HotkeyService.init($scope);
  }
});

angular.module("loomioApp").run(["$templateCache", function($templateCache) {$templateCache.put("generated/components/archive_group_form/archive_group_form.html","<md-dialog class=\"deactivation-modal\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"archive_group_form.title\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content\"><p translate=\"archive_group_form.question\"></p><div class=\"lmo-md-actions\"><md-button ng-click=\"$close()\" type=\"button\" translate=\"common.action.cancel\"></md-button><md-button ng-click=\"submit()\" translate=\"archive_group_form.submit\" class=\"md-primary md-raised archive-group-form__submit\"></md-button></div></div></md-dialog>");
$templateCache.put("generated/components/action_dock/action_dock.html","<div layout=\"row\" class=\"action-dock lmo-flex lmo-no-print\"><div ng-repeat=\"action in actions\" ng-if=\"action.canPerform()\" class=\"action-dock__action\"><reactions_input class=\"action-dock__button--react\" model=\"model\" ng-if=\"action.name == \'react\'\"></reactions_input><md-button class=\"md-button--tiny action-dock__button--{{action.name}}\" ng-if=\"action.name != \'react\'\" ng-click=\"action.perform()\"><i class=\"mdi {{ action.icon }}\"></i><md-tooltip md-delay=\"500\"><span translate=\"action_dock.{{ action.name }}\"></span></md-tooltip></md-button></div></div>");
$templateCache.put("generated/components/change_password_form/change_password_form.html","<md-dialog class=\"change-password-form lmo-modal__narrow\"><div ng-show=\"processing\" class=\"lmo-disabled-form\"></div><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><div></div><h1 ng-if=\"user.hasPassword\" translate=\"change_password_form.change_password_title\" class=\"lmo-h1\"></h1><h1 ng-if=\"!user.hasPassword\" translate=\"change_password_form.set_password_title\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content\"><p ng-if=\"user.hasPassword\" translate=\"change_password_form.change_password_helptext\" class=\"lmo-hint-text\"></p><p ng-if=\"!user.hasPassword\" translate=\"change_password_form.set_password_helptext\" class=\"lmo-hint-text\"></p><md-input-container class=\"md-block\"><label translate=\"sign_up_form.password_label\"></label><input required=\"true\" type=\"password\" ng-model=\"user.password\" class=\"change-password-form__password\"><validation_errors subject=\"user\" field=\"password\"></validation_errors></md-input-container><md-input-container class=\"md-block\"><label translate=\"sign_up_form.password_confirmation_label\"></label><input required=\"true\" type=\"password\" ng-model=\"user.passwordConfirmation\" class=\"change-password-form__password-confirmation\"><validation_errors subject=\"user\" field=\"passwordConfirmation\"></validation_errors></md-input-container><div class=\"lmo-md-actions\"><md-button ng-click=\"$close()\" translate=\"common.action.cancel\"></md-button><md-button ng-click=\"submit()\" class=\"md-primary md-raised change-password-form__submit\"><span ng-if=\"user.hasPassword\" translate=\"change_password_form.change_password\"></span><span ng-if=\"!user.hasPassword\" translate=\"change_password_form.set_password\"></span></md-button></div></div></md-dialog>");
$templateCache.put("generated/components/change_picture_form/change_picture_form.html","<md-dialog class=\"change-picture-form lmo-modal__narrow\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><div></div><h1 translate=\"change_picture_form.title\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content md-body-1\"><p translate=\"change_picture_form.helptext\" class=\"lmo-hint-text\"></p><ul class=\"change-picture-form__options-list\"><li class=\"change-picture-form__option\"><md-button ng-click=\"submit(\'initials\')\" class=\"lmo-flex\"><div class=\"user-avatar lmo-box--small lmo-margin-right\"><div class=\"user-avatar__initials--small\">{{user.avatarInitials}}</div></div><span translate=\"change_picture_form.use_initials\"></span></md-button></li><li class=\"change-picture-form__option\"><md-button ng-click=\"submit(\'gravatar\')\" class=\"lmo-flex\"><div class=\"user-avatar lmo-box--small lmo-margin-right\"><img gravatar-src-once=\"user.gravatarMd5\" alt=\"{{::user.name}}\" class=\"user-avatar__image--small\"></div><span translate=\"change_picture_form.use_gravatar\"></span></md-button></li><li class=\"change-picture-form__option\"><md-button ng-click=\"selectFile()\" class=\"lmo-flex change-picture-form__upload-button\"><div class=\"user-avatar lmo-box--small lmo-margin-right\"><div class=\"user-avatar__initials--small\"><i class=\"mdi mdi-camera mdi-24px\"></i></div></div><span translate=\"change_picture_form.use_uploaded\"></span></md-button><input type=\"file\" ng-model=\"files\" ng-file-select=\"upload(files)\" class=\"hidden change-picture-form__file-input\"></li></ul></div></md-dialog>");
$templateCache.put("generated/components/change_volume_form/change_volume_form.html","<md-dialog class=\"change-volume-form\"><form ng-submit=\"submit()\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"{{translateKey()}}.title\" translate-value-title=\"{{model.title || model.groupName()}}\" class=\"lmo-h1 change-volume-form__title\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content\"><md-radio-group ng-model=\"buh.volume\" class=\"md-body-1\"><md-radio-button ng-repeat=\"level in volumeLevels\" ng-value=\"level\" id=\"volume-{{level}}\" class=\"md-checkbox--with-summary\"><strong translate=\"change_volume_form.{{level}}_label\"></strong><div translate=\"{{translateKey()}}.{{level}}_description\" class=\"change-volume-form__description\"></div></md-radio-button><md-checkbox ng-model=\"applyToAll\" class=\"change-volume-form__apply-to-all\" id=\"apply-to-all\"><label for=\"apply-to-all\" translate=\"{{translateKey()}}.apply_to_all\" class=\"change-volume-form__apply-to-all-label\"></label></md-checkbox></md-radio-group><div class=\"lmo-md-actions\"><md-button type=\"button\" translate=\"common.action.cancel\" ng-click=\"$close()\" class=\"change-volume-form__cancel\"></md-button><md-button type=\"submit\" ng-disabled=\"isDisabled\" translate=\"common.action.update\" class=\"md-raised md-primary change-volume-form__submit\"></md-button></div></div></form></md-dialog>");
$templateCache.put("generated/components/close_explanation_modal/close_explanation_modal.html","<div class=\"close-explanation-modal lmo-modal__narrow\"><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"close_explanation_modal.close_thread\" class=\"lmo-h1 close-explanation-modal__title\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content md-body-1\"><div translate=\"close_explanation_modal.body_header\" class=\"close-explanation-modal__explanation lmo-hint-text\"></div><div class=\"close-explanation-modal__image\"><img src=\"/img/closing-threads.png\" alt=\"{{ \'close_explanation_modal.image_alt\' | translate }}\"></div><div translate=\"close_explanation_modal.body_footer\" class=\"close-explanation-modal__explanation lmo-hint-text\"></div><div class=\"lmo-md-actions\"><md-button type=\"button\" ng-click=\"$close()\" translate=\"common.action.cancel\" class=\"close-explanation-modal__cancel\"></md-button><md-button type=\"button\" ng-click=\"closeThread()\" translate=\"close_explanation_modal.close_thread\" class=\"md-raised md-primary close-explanation-modal__close-thread\"></md-button></div></div></div>");
$templateCache.put("generated/components/confirm_modal/confirm_modal.html","<md-dialog class=\"lmo-modal__narrow\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"{{text.title}}\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button ng-if=\"!forceSubmit\"></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content\"><p translate=\"{{text.helptext}}\" class=\"lmo-hint-text\"></p><div class=\"lmo-md-actions\"><div ng-if=\"forceSubmit\"></div><md-button ng-if=\"!forceSubmit\" ng-click=\"$close()\" type=\"button\" translate=\"common.action.cancel\"></md-button><md-button ng-click=\"submit()\" translate=\"{{text.submit}}\" class=\"md-primary md-raised\"></md-button></div></div></md-dialog>");
$templateCache.put("generated/components/contact_page/contact_page.html","<div class=\"lmo-one-column-layout\"><main class=\"contact-page lmo-card\"><contact_form></contact_form></main></div>");
$templateCache.put("generated/components/current_polls_card/current_polls_card.html","<div class=\"current-polls-card lmo-card\"><div class=\"lmo-flex lmo-flex__space-between\"><h2 translate=\"current_polls_card.title\" class=\"lmo-card-heading lmo-truncate-text\"></h2></div><loading ng-if=\"fetchRecordsExecuting\"></loading><div ng-if=\"!fetchRecordsExecuting\" class=\"current-polls-card__polls\"><div ng-if=\"!polls().length\" translate=\"current_polls_card.no_polls\" class=\"current-polls-card__no-polls lmo-hint-text\"></div><poll_common_preview poll=\"poll\" ng-repeat=\"poll in polls() track by poll.id\"></poll_common_preview></div><div class=\"lmo-md-actions\"><div class=\"buh\"></div><md-button ng-click=\"startPoll()\" ng-if=\"canStartPoll()\" translate=\"current_polls_card.start_poll\" class=\"md-primary md-raised current-polls-card__start-poll\"></md-button></div></div>");
$templateCache.put("generated/components/dashboard_page/dashboard_page.html","<div class=\"lmo-one-column-layout\"><main class=\"dashboard-page lmo-row\"><h1 translate=\"dashboard_page.filtering.all\" ng-show=\"dashboardPage.filter == \'hide_muted\'\" class=\"lmo-h1-medium dashboard-page__heading\"></h1><h1 translate=\"dashboard_page.filtering.muted\" ng-show=\"dashboardPage.filter == \'show_muted\'\" class=\"lmo-h1-medium dashboard-page__heading\"></h1><section ng-if=\"!dashboardPage.dashboardLoaded()\" ng-repeat=\"viewName in dashboardPage.loadingViewNames track by $index\" class=\"dashboard-page__loading dashboard-page__{{viewName}}\" aria-hidden=\"true\"><h2 translate=\"dashboard_page.threads_from.{{viewName}}\" class=\"dashboard-page__date-range\"></h2><div class=\"thread-previews-container\"><loading_content line-count=\"2\" ng-repeat=\"i in [1,2] track by $index\" class=\"thread-preview\"></loading_content></div></section><section ng-if=\"dashboardPage.dashboardLoaded()\" class=\"dashboard-page__loaded\"><div ng-if=\"dashboardPage.noThreads()\" class=\"dashboard-page__empty\"><div ng-if=\"dashboardPage.noGroups()\" class=\"dashboard-page__no-groups\"> <p translate=\"dashboard_page.no_groups.show_all\"></p>  <button translate=\"dashboard_page.no_groups.start\" ng-click=\"dashboardPage.startGroup()\" class=\"lmo-btn-link--blue\"></button>  <span translate=\"dashboard_page.no_groups.or\"></span>  <span translate=\"dashboard_page.no_groups.join_group\"></span> </div><div ng-if=\"!dashboardPage.noGroups()\" class=\"dashboard-page__no-threads\"> <span ng-show=\"dashboardPage.filter == \'show_all\'\" translate=\"dashboard_page.no_threads.show_all\"></span>  <span ng-show=\"dashboardPage.filter == \'show_muted\' &amp;&amp; dashboardPage.userHasMuted()\" translate=\"dashboard_page.no_threads.show_muted\"></span> <a lmo-href=\"/dashboard\" ng-show=\"dashboardPage.filter != \'show_all\' &amp;&amp; dashboardPage.userHasMuted()\"> <span translate=\"dashboard_page.view_recent\"></span> </a></div><div ng-if=\"dashboardPage.filter == \'show_muted\' &amp;&amp; !dashboardPage.userHasMuted()\" class=\"dashboard-page__explain-mute\"><p><strong translate=\"dashboard_page.explain_mute.title\"></strong></p><p translate=\"dashboard_page.explain_mute.explanation_html\"></p><p translate=\"dashboard_page.explain_mute.instructions\"></p><div ng-if=\"dashboardPage.showLargeImage()\" class=\"dashboard-page__mute-image--large\"><img src=\"/img/mute.png\"></div><div ng-if=\"!dashboardPage.showLargeImage()\" class=\"dashboard-page__mute-image--small\"><img src=\"/img/mute-small.png\"></div><p translate=\"dashboard_page.explain_mute.see_muted_html\"></p></div></div><div ng-if=\"!dashboardPage.noThreads()\" class=\"dashboard-page__collections\"><section ng-if=\"dashboardPage.views[viewName].any()\" class=\"thread-preview-collection__container dashboard-page__{{viewName}}\" ng-repeat=\"viewName in dashboardPage.viewNames\"><h2 translate=\"dashboard_page.threads_from.{{viewName}}\" class=\"dashboard-page__date-range\"></h2><thread_preview_collection query=\"dashboardPage.views[viewName]\" class=\"thread-previews-container\"></thread_preview_collection></section><div ng-if=\"!dashboardPage.loader.exhausted\" in-view=\"$inview &amp;&amp; dashboardPage.loader.loadMore()\" in-view-options=\"{debounce: 200}\" class=\"dashboard-page__footer\">.</div><loading ng-show=\"dashboardPage.loader.loading\"></loading></div></section></main></div>");
$templateCache.put("generated/components/deactivate_user_form/deactivate_user_form.html","<md-dialog class=\"deactivate-user-form\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"deactivate_user_form.title\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button ng-if=\"!preventClose\"></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content\"><md-input-container class=\"md-block\"><label translate=\"deactivate_user_form.question\"></label><textarea ng-model=\"user.deactivationResponse\" placeholder=\"{{ \'deactivate_user_form.placeholder\' | translate }}\" class=\"lmo-textarea\"></textarea></md-input-container><div class=\"lmo-md-actions\"><md-button ng-click=\"$close()\" type=\"button\" translate=\"common.action.cancel\"></md-button><md-button ng-click=\"submit()\" translate=\"deactivate_user_form.submit\" class=\"md-raised md-warn deactivate-user-form__submit\"></md-button></div></div></md-dialog>");
$templateCache.put("generated/components/deactivation_modal/deactivation_modal.html","<md-dialog class=\"deactivation-modal lmo-modal__narrow\"><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"deactivate_user_form.title\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content\"><p translate=\"deactivation_modal.introduction\"></p><ul><li translate=\"deactivation_modal.no_longer_group_member\"></li><li translate=\"deactivation_modal.name_removed\"></li><li translate=\"deactivation_modal.no_emails\"></li><li translate=\"deactivation_modal.contact_for_reactivation\"></li></ul><div class=\"lmo-md-actions\"><md-button ng-click=\"$close()\" type=\"button\" translate=\"common.action.cancel\"></md-button><md-button ng-click=\"submit()\" translate=\"deactivation_modal.submit\" class=\"md-primary md-raised deactivation-modal__confirm\"></md-button></div></div></md-dialog>");
$templateCache.put("generated/components/delete_thread_form/delete_thread_form.html","<form ng-submit=\"submit()\" class=\"delete-thread-form\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"delete_thread_form.title\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content md-body-1\"><p translate=\"delete_thread_form.body\"></p><div class=\"lmo-md-actions\"><md-button ng-click=\"$close()\" type=\"button\" translate=\"common.action.cancel\"></md-button><md-button type=\"submit\" translate=\"delete_thread_form.confirm\" class=\"md-primary md-raised delete-thread-form__submit\"></md-button></div></div></form>");
$templateCache.put("generated/components/dialog_scroll_indicator/dialog_scroll_indicator.html","<div class=\"dialog-scroll-indicator\"><div in-view=\"visible = !$inview\" class=\"dialog-scroll-sensor\"></div><div ng-show=\"visible\" class=\"dialog-scroll-indicator__indicator\"><i class=\"mdi mdi-chevron-double-down mdi-24px\"></i></div></div>");
$templateCache.put("generated/components/dismiss_explanation_modal/dismiss_explanation_modal.html","<md-dialog class=\"dismiss-explanation-modal lmo-modal__narrow\"><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"dismiss_explanation_modal.dismiss_thread\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content\"><div translate=\"dismiss_explanation_modal.body_html\" class=\"dismiss-explanation-modal__dismiss-explanation\"></div><div class=\"lmo-md-actions\"><md-button type=\"button\" ng-click=\"$close()\" translate=\"common.action.cancel\"></md-button><md-button ng-click=\"dismiss()\" translate=\"dismiss_explanation_modal.dismiss_thread\" class=\"md-primary md-raised\"></md-button></div></div></md-dialog>");
$templateCache.put("generated/components/documents_page/documents_page.html","<div class=\"loading-wrapper lmo-one-column-layout\"><loading ng-if=\"!documentsPage.group\"></loading><main ng-if=\"documentsPage.group\" class=\"documents-page\"><div class=\"lmo-group-theme-padding\"></div><group_theme group=\"documentsPage.group\"></group_theme><div class=\"lmo-card\"><div class=\"documents-page__top-bar lmo-flex lmo-flex__space-between lmo-flex__baseline\"><h2 translate=\"documents_page.title\" class=\"lmo-h2 md-title\"></h2><md-button ng-click=\"documentsPage.addDocument()\" ng-if=\"documentsPage.canAdministerGroup()\" class=\"md-primary md-raised documents-page__invite\"><span translate=\"documents_page.add_document\"></span></md-button></div><p ng-if=\"!documentsPage.group.hasDocuments(true)\" translate=\"documents_page.no_documents\" class=\"lmo-hint-text\"></p><div ng-if=\"documentsPage.group.hasRelatedDocuments()\" class=\"documents-page__documents\"><md-input-container md-no-float=\"true\" class=\"md-block documents-page__search-filter\"><input ng-model=\"documentsPage.fragment\" ng-model-options=\"{debounce: 300}\" ng-change=\"documentsPage.fetchDocuments()\" placeholder=\"{{\'documents_page.fragment_placeholder\' | translate}}\" class=\"membership-page__search-filter\"><i class=\"mdi mdi-magnify mdi-24px\"></i></md-input-container><p ng-if=\"!documentsPage.hasDocuments()\" translate=\"documents_page.no_documents_from_fragment\" translate-value-fragment=\"{{documentsPage.fragment}}\" class=\"lmo-hint-text\"></p><document_management group=\"documentsPage.group\" fragment=\"documentsPage.fragment\"></document_management></div></div><loading ng-if=\"fetchDocumentsExecuting\"></loading></main></div>");
$templateCache.put("generated/components/email_settings_page/email_settings_page.html","<div class=\"lmo-one-column-layout\"><main ng-if=\"emailSettingsPage.user\" class=\"email-settings-page\"><div class=\"lmo-page-heading\"><h1 translate=\"email_settings_page.header\" class=\"lmo-h1-medium\"></h1></div><div class=\"email-settings-page__email-settings\"><div class=\"email-settings-page__global-settings\"><h3 translate=\"email_settings_page.all_groups\" class=\"lmo-h3\"></h3><form ng-submit=\"emailSettingsPage.submit()\"><div class=\"email-settings-page__global-email-settings-options\"><md-checkbox ng-model=\"emailSettingsPage.user.emailMissedYesterday\" class=\"md-checkbox--with-summary email-settings-page__daily-summary\" id=\"daily-summary-email\"><strong for=\"daily-summary-email\" translate=\"email_settings_page.daily_summary_label\"></strong><div translate=\"email_settings_page.daily_summary_description\" class=\"email-settings-page__input-description\"></div></md-checkbox><md-checkbox ng-model=\"emailSettingsPage.user.emailOnParticipation\" class=\"md-checkbox--with-summary email-settings-page__on-participation\" id=\"on-participation-email\"><strong for=\"on-participation-email\" translate=\"email_settings_page.on_participation_label\"></strong><div translate=\"email_settings_page.on_participation_description\" class=\"email-settings-page__input-description\"></div></md-checkbox><md-checkbox ng-model=\"emailSettingsPage.user.emailWhenMentioned\" class=\"md-checkbox--with-summary email-settings-page__mentioned\" id=\"mentioned-email\"><strong for=\"mentioned-email\" translate=\"email_settings_page.mentioned_label\"></strong><div translate=\"email_settings_page.mentioned_description\" class=\"email-settings-page__input-description\"></div></md-checkbox></div><md-button type=\"submit\" ng-disabled=\"isDisabled\" translate=\"email_settings_page.update_settings\" class=\"md-primary md-raised email-settings-page__update-button\"></md-button></form></div><div class=\"email-settings-page__specific-group-settings\"><h3 translate=\"email_settings_page.specific_groups\" class=\"lmo-h3\"></h3><md-list class=\"email-settings-page__groups\"><md-list-item class=\"email-settings-page__group lmo-flex lmo-flex__space-between\"><div class=\"lmo-box--medium lmo-margin-right lmo-flex lmo-flex__center lmo-flex__horizontal-center\"><i class=\"mdi mdi-account-multiple-plus\"></i></div><div translate=\"{{emailSettingsPage.defaultSettingsDescription()}}\" class=\"email-settings-page__default-description\"></div><md-button ng-click=\"emailSettingsPage.changeDefaultMembershipVolume()\" translate=\"common.action.edit\" class=\"md-accent email-settings-page__change-default-link\"></md-button></md-list-item><md-list-item ng-repeat=\"group in emailSettingsPage.user.groups() track by group.id\" class=\"email-settings-page__group lmo-flex lmo-flex__space-between\"><group_avatar group=\"group\" size=\"medium\" class=\"lmo-margin-right\"></group_avatar><div class=\"email-settings-page__group-details lmo-flex__grow\"><strong class=\"email-settings-page__group-name\"> <span ng-if=\"group.isSubgroup()\">{{group.parentName()}} -</span> <span>{{group.name}}</span></strong><div translate=\"change_volume_form.{{emailSettingsPage.groupVolume(group)}}_label\" class=\"email-settings-page__membership-volume\"></div></div><div class=\"email-settings-page__edit\"><md-button ng-click=\"emailSettingsPage.editSpecificGroupVolume(group)\" translate=\"email_settings_page.edit\" class=\"md-accent email-settings-page__edit-membership-volume-link\"></md-button></div></md-list-item></md-list><a href=\"https://loomio.gitbooks.io/manual/content/en/keeping_up_to_date.html\" target=\"_blank\" translate=\"email_settings_page.learn_more\" class=\"email-settings-page__learn-more-link\"></a></div></div></main></div>");
$templateCache.put("generated/components/emoji_picker/emoji_picker.html","<md-menu ng-class=\"{\'emoji-picker--reaction\': reaction}\" class=\"emoji-picker\"><button type=\"button\" tabindex=\"-1\" ng-click=\"toggleMenu($mdMenu, $event)\" class=\"md-button--nude emoji-picker__toggle lmo-flex\"><i class=\"mdi mdi-face\"></i><i ng-if=\"reaction\" class=\"mdi mdi-plus lmo-helper-icon\"></i></button><md-menu-content class=\"emoji-picker__menu\"><md-input-container ng-if=\"!reaction\" class=\"md-block md-no-errors emoji-picker__search\"><label></label><input ng-model=\"term\" ng-change=\"search(term)\" placeholder=\"{{\'emoji_picker.search\' | translate}}\"></md-input-container><md-menu-item ng-repeat=\"emoji in source\" class=\"emoji-picker__selector\"><md-button ng-click=\"select(emoji)\" title=\"{{::translate(emoji)}}\" class=\"md-button--tiny emoji-picker__link\"><div class=\"emoji-picker__icon\"><img alt=\"{{::translate(emoji)}}\" ng-src=\"{{::imgSrcFor(emoji)}}\" class=\"emojione\"></div></md-button></md-menu-item></md-menu-content></md-menu>");
$templateCache.put("generated/components/error_page/error_page.html","<div class=\"error-page\"><div translate=\"error_page.forbidden\" ng-if=\"error.status == 403\" class=\"error-page__forbidden\"></div><div translate=\"error_page.page_not_found\" ng-if=\"error.status == 404\" class=\"error-page__page-not-found\"></div><div translate=\"error_page.internal_server_error\" ng-if=\"error.status == 500\" class=\"error-page__internal-server-error\"></div></div>");
$templateCache.put("generated/components/explore_page/explore_page.html","<div class=\"lmo-one-column-layout\"><main class=\"explore-page\"><h1 translate=\"explore_page.header\" class=\"lmo-h1-medium\"></h1><md-input-container class=\"explore-page__search-field\"><input ng-model=\"explorePage.query\" ng-model-options=\"{debounce: 600}\" ng-change=\"explorePage.search()\" placeholder=\"{{ \'explore_page.search_placeholder\' | translate }}\" id=\"search-field\"><i aria-hidden=\"true\" class=\"mdi mdi-magnify\"></i><loading ng-show=\"searchExecuting\"></loading></md-input-container><div ng-show=\"explorePage.showMessage()\" translate=\"{{explorePage.searchResultsMessage()}}\" translate-values=\"{resultCount: explorePage.resultsCount, searchTerm: explorePage.query}\" class=\"explore-page__search-results\"></div><div class=\"explore-page__groups\"><a ng-repeat=\"group in explorePage.groups() | orderBy: \'-recentActivityCount\' track by group.id\" lmo-href-for=\"group\" class=\"explore-page__group\"><div ng-style=\"explorePage.groupCover(group)\" class=\"explore-page__group-cover\"></div><div class=\"explore-page__group-details\"><h2 class=\"lmo-h2\">{{group.name}}</h2><div class=\"explore-page__group-description\">{{explorePage.groupDescription(group)}}</div><div class=\"explore-page__group-stats lmo-flex lmo-flex__start lmo-flex__center\"><i class=\"mdi mdi-account-multiple lmo-margin-right\"></i><span class=\"lmo-margin-right\">{{group.membershipsCount}}</span><i class=\"mdi mdi-comment-text-outline lmo-margin-right\"></i><span class=\"lmo-margin-right\">{{group.discussionsCount}}</span><i class=\"mdi mdi-thumbs-up-down lmo-margin-right\"></i><span class=\"lmo-margin-right\">{{group.pollsCount}}</span><i></i><span></span></div></div></a></div><div ng-show=\"explorePage.canLoadMoreGroups\" class=\"lmo-show-more\"><button ng-hide=\"searchExecuting\" ng-click=\"explorePage.loadMore()\" translate=\"common.action.show_more\" class=\"explore-page__show-more\"></button></div><loading ng-show=\"searchExecuting\"></loading><div ng-show=\"explorePage.noResultsFound()\" translate=\"explore_page.no_results_found\" class=\"explore-page__no-results-found\"></div></main></div>");
$templateCache.put("generated/components/flash/flash.html","<div aria-live=\"{{ariaLive()}}\" role=\"alert\" class=\"flash-root\"><div ng-if=\"display()\" ng-animate=\"\'enter\'\" class=\"flash-root__container animated alert-{{flash.level}}\"><div class=\"flash-root__message lmo-flex lmo-flex__center\"><loading ng-if=\"loading()\" class=\"flash-root__loading lmo-margin-right\"></loading>{{ flash.message | translate:flash.options }}</div><div ng-if=\"flash.actionFn\" class=\"flash-root__action\"><a ng-click=\"flash.actionFn()\" translate=\"{{flash.action}}\"></a></div></div></div>");
$templateCache.put("generated/components/group_avatar/group_avatar.html","<div class=\"group-avatar lmo-box--{{size}}\" aria-hidden=\"true\"><img class=\"lmo-box--{{size}}\" alt=\"{{group.name}}\" ng-src=\"{{::group.logoUrl()}}\"></div>");
$templateCache.put("generated/components/group_page/group_page.html","<div class=\"loading-wrapper lmo-two-column-layout\"><loading ng-if=\"!groupPage.group\"></loading><main ng-if=\"groupPage.group\" class=\"group-page lmo-row\"><outlet name=\"before-group-page\" model=\"groupPage.group\"></outlet><group_theme group=\"groupPage.group\" home-page=\"true\"></group_theme><div class=\"lmo-row\"><div class=\"lmo-group-column-left\"><description_card group=\"groupPage.group\"></description_card><discussions_card group=\"groupPage.group\" page_window=\"groupPage.pageWindow\"></discussions_card></div><div class=\"lmo-group-column-right\"><outlet name=\"before-group-page-column-right\" model=\"groupPage.group\"></outlet><current_polls_card model=\"groupPage.group\"></current_polls_card><membership_requests_card group=\"groupPage.group\"></membership_requests_card><members_card group=\"groupPage.group\"></members_card><subgroups_card group=\"groupPage.group\"></subgroups_card><document_card group=\"groupPage.group\"></document_card><poll_common_index_card model=\"groupPage.group\" limit=\"5\" view-more-link=\"true\"></poll_common_index_card><outlet name=\"after-slack-card\" model=\"groupPage.group\"></outlet><install_slack_card group=\"groupPage.group\"></install_slack_card></div></div></main></div>");
$templateCache.put("generated/components/help_bubble/help_bubble.html","<div class=\"help-bubble\"><i class=\"mdi mdi-help-circle-outline\"></i><md-tooltip class=\"help-bubble__tooltip\"><span translate=\"{{helptext | translate}}\"></span></md-tooltip></div>");
$templateCache.put("generated/components/inbox_page/inbox_page.html","<div class=\"lmo-one-column-layout\"><main class=\"inbox-page\"><div class=\"thread-preview-collection__container\"><h1 translate=\"inbox_page.unread_threads\" class=\"lmo-h1-medium inbox-page__heading\"></h1><div class=\"inbox-page__threads\"><div ng-show=\"!inboxPage.hasThreads() &amp;&amp; !inboxPage.noGroups()\" class=\"inbox-page__no-threads\"> <span translate=\"inbox_page.no_threads\"></span> <span></span> 🙌</div><div ng-show=\"inboxPage.noGroups()\" class=\"inbox-page__no-groups\"> <p translate=\"inbox_page.no_groups.explanation\"></p>  <button translate=\"inbox_page.no_groups.start\" ng-click=\"inboxPage.startGroup()\" class=\"lmo-btn-link--blue\"></button>  <span translate=\"inbox_page.no_groups.or\"></span>  <span translate=\"inbox_page.no_groups.join_group\"></span> </div><div ng-repeat=\"group in inboxPage.groups() | orderBy: \'name\' track by group.id\" class=\"inbox-page__group\"><section ng-if=\"inboxPage.views[group.key].any()\" role=\"region\" aria-label=\"{{ \'inbox_page.threads_from.group\' | translate }} {{group.name}}\"><div class=\"inbox-page__group-name-container lmo-flex\"> <img ng-src=\"{{group.logoUrl()}}\" aria-hidden=\"true\" class=\"lmo-box--small pull-left\"> <h2 class=\"inbox-page__group-name\"><a href=\"/g/{{group.key}}\">{{group.name}}</a></h2></div><div class=\"inbox-page__groups thread-previews-container\"><thread_preview_collection query=\"inboxPage.views[group.key]\" limit=\"inboxPage.threadLimit\"></thread_preview_collection></div></section></div></div></div></main></div>");
$templateCache.put("generated/components/authorized_apps_page/authorized_apps_page.html","<div class=\"lmo-one-column-layout\"><loading ng-show=\"authorizedAppsPage.loading\"></loading><main ng-if=\"!authorizedAppsPage.loading\" class=\"authorized-apps-page\"><h1 translate=\"authorized_apps_page.title\" class=\"lmo-h1\"></h1><hr><div ng-if=\"authorizedAppsPage.applications().length == 0\" translate=\"authorized_apps_page.no_applications\" class=\"lmo-placeholder\"></div><div layout=\"column\" ng-if=\"authorizedAppsPage.applications().length &gt; 0\" class=\"lmo-flex lmo-flex__space-between\"><div translate=\"authorized_apps_page.notice\" class=\"lmo-placeholder\"></div><div layout=\"row\" ng-repeat=\"application in authorizedAppsPage.applications() | orderBy: \'name\' track by application.id\" class=\"lmo-flex lmo-flex__center\"> <img ng-src=\"{{application.logoUrl}}\" class=\"lmo-box--small\"> <strong class=\"lmo-flex__grow\">{{ application.name }}</strong><md-button ng-click=\"authorizedAppsPage.openRevokeForm(application)\" translate=\"authorized_apps_page.revoke\" class=\"md-raised md-warn\"></md-button></div></div></main></div>");
$templateCache.put("generated/components/leave_group_form/leave_group_form.html","<md-dialog class=\"leave-group-form lmo-modal__narrow\"><form ng-submit=\"submit()\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"leave_group_form.title\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content\"><p ng-if=\"canLeaveGroup()\" translate=\"leave_group_form.question\"></p><p ng-if=\"!canLeaveGroup()\" translate=\"leave_group_form.cannot_leave_group\"></p><div class=\"lmo-md-actions\"><md-button ng-click=\"$close()\" type=\"button\" translate=\"common.action.cancel\"></md-button><md-button ng-if=\"canLeaveGroup()\" type=\"submit\" class=\"md-primary md-raised leave-group-form__submit\"><span translate=\"leave_group_form.submit\"></span></md-button></div></div></form></md-dialog>");
$templateCache.put("generated/components/lmo_textarea/lmo_textarea.html","<div class=\"lmo-textarea\"><div class=\"lmo-relative lmo-textarea-wrapper\"><md-input-container md-no-float=\"true\" class=\"md-block md-no-errors\"><label ng-if=\"label\">{{label}}</label><outlet name=\"before-lmo-textarea\" model=\"model\"></outlet><textarea ng-disabled=\"isDisabled\" ng-paste=\"handlePaste($event)\" name=\"body\" placeholder=\"{{placeholder}}\" ng-model=\"model[field]\" md-maxlength=\"{{maxlength}}\" maxlength=\"{{maxlength}}\" mentio=\"mentio\" mentio-trigger-char=\"\'@\'\" mentio_items=\"mentionables\" mentio-template-url=\"generated/components/thread_page/comment_form/mentio_menu.html\" mentio-search=\"fetchByNameFragment(term)\" ng-model-options=\"{ updateOn: \'default blur\', debounce: {\'default\': 150, \'blur\': 0} }\" class=\"lmo-textarea lmo-primary-form-input\"></textarea></md-input-container><div class=\"lmo-md-actions\"><div class=\"lmo-flex\"><validation_errors ng-if=\"model.errors[field]\" subject=\"model\" field=\"{{field}}\"></validation_errors><validation_errors ng-if=\"model.errors.file\" subject=\"model\" field=\"file\"></validation_errors><div ng-if=\"!(model.errors[field] || model.errors.file)\" class=\"lmo-textarea__helptext\">{{helptext}}</div></div><div class=\"lmo-flex lmo-flex__center\"><document_upload_form model=\"model\" class=\"lmo-hidden\"></document_upload_form><md-menu ng-if=\"model.documentsApplied\" class=\"lmo-pointer\"><md-button md-menu-origin=\"true\" ng-click=\"addDocument($mdMenu)\" md-prevent-menu-close=\"true\" class=\"md-button--tiny\"><i class=\"mdi mdi-attachment\"></i></md-button><md-menu-content><document_form class=\"lmo-textarea__document-form\"></document_form></md-menu-content></md-menu><emoji_picker></emoji_picker><div ng-if=\"maxlength\" class=\"md-char-counter\">{{ modelLength() }} / {{ maxlength }}</div></div></div></div><outlet name=\"after-lmo-textarea\" model=\"model\"></outlet><document_list model=\"model\" show-edit=\"true\" ng-if=\"model.documentsApplied\"></document_list><div class=\"lmo-textarea__footer\"></div></div>");
$templateCache.put("generated/components/loading/loading.html","<div class=\"page-loading\"><md-progress-circular md-diameter=\"{{diameter}}\" class=\"md-accent\"></md-progress-circular></div>");
$templateCache.put("generated/components/loading_content/loading_content.html","<div class=\"loading-content\"><div ng-repeat=\"block in blocks track by $index\" class=\"loading-content__background-wrapper\"><div ng-repeat=\"line in lines track by $index\" class=\"loading-content__background\"></div></div></div>");
$templateCache.put("generated/components/material_modal_header_cancel_button/material_modal_header_cancel_button.html","<md-button aria-label=\"close\" ng-click=\"$close()\" class=\"md-icon-button material-modal-header-cancel-button modal-cancel\"><span translate=\"common.action.cancel\" class=\"sr-only\"></span><i class=\"mdi mdi-24px mdi-window-close\"></i></md-button>");
$templateCache.put("generated/components/membership_requests_page/membership_requests_page.html","<div class=\"loading-wrapper lmo-one-column-layout\"><loading ng-if=\"!membershipRequestsPage.group\"></loading><main ng-if=\"membershipRequestsPage.group\" class=\"membership-requests-page\"><div class=\"lmo-group-theme-padding\"></div><group_theme group=\"membershipRequestsPage.group\"></group_theme><div class=\"membership-requests-page__pending-requests\"><h2 translate=\"membership_requests_page.heading\" class=\"lmo-h2\"></h2><ul ng-if=\"membershipRequestsPage.group.hasPendingMembershipRequests()\"><li layout=\"row\" ng-repeat=\"request in membershipRequestsPage.pendingRequests() track by request.id\" class=\"lmo-flex membership-requests-page__pending-request\"><user_avatar user=\"request.actor()\" size=\"medium\" class=\"lmo-margin-right\"></user_avatar><div layout=\"column\" class=\"lmo-flex\"><span class=\"membership-requests-page__pending-request-name\"><strong>{{request.actor().name}}</strong></span><div class=\"membership-requests-page__pending-request-email\">{{request.email}}</div><div class=\"membership-requests-page__pending-request-date\"><timeago timestamp=\"request.createdAt\"></timeago></div><div class=\"membership-requests-page__pending-request-introduction\">{{request.introduction}}</div><div class=\"membership-requests-page__actions\"><md-button ng-click=\"membershipRequestsPage.ignore(request)\" translate=\"membership_requests_page.ignore\" class=\"membership-requests-page__ignore\"></md-button><md-button ng-click=\"membershipRequestsPage.approve(request)\" translate=\"membership_requests_page.approve\" class=\"md-primary md-raised membership-requests-page__approve\"></md-button></div></div></li></ul><div ng-if=\"!membershipRequestsPage.group.hasPendingMembershipRequests()\" translate=\"membership_requests_page.no_pending_requests\" class=\"membership-requests-page__no-pending-requests\"></div></div><div class=\"membership-requests-page__previous-requests\"><h3 translate=\"membership_requests_page.previous_requests\" class=\"lmo-card-heading\"></h3><ul ng-if=\"membershipRequestsPage.group.hasPreviousMembershipRequests()\"><li layout=\"row\" ng-repeat=\"request in membershipRequestsPage.previousRequests() track by request.id\" class=\"lmo-flex membership-requests-page__previous-request\"><user_avatar user=\"request.actor()\" size=\"medium\" class=\"lmo-margin-right\"></user_avatar><div layout=\"column\" class=\"lmo-flex\"><span class=\"membership-requests-page__previous-request-name\"><strong>{{request.actor().name}}</strong></span><div class=\"membership-requests-page__previous-request-email\">{{request.email}}</div><div class=\"membership-requests-page__previous-request-response\"><span translate=\"membership_requests_page.previous_request_response\" translate-value-response=\"{{request.formattedResponse()}}\" translate-value-responder=\"{{request.responder().name}}\"></span><timeago timestamp=\"request.respondedAt\"></timeago></div><div class=\"membership-requests-page__previous-request-introduction\">{{request.introduction}}</div></div></li></ul><div ng-if=\"!membershipRequestsPage.group.hasPreviousMembershipRequests()\" translate=\"membership_requests_page.no_previous_requests\" class=\"membership-requests-page__no-previous-requests\"></div></div></main></div>");
$templateCache.put("generated/components/memberships_page/memberships_page.html","<div class=\"loading-wrapper lmo-one-column-layout\"><loading ng-if=\"!membershipsPage.group\"></loading><main ng-if=\"membershipsPage.group\" class=\"memberships-page\"><div class=\"lmo-group-theme-padding\"></div><group_theme group=\"membershipsPage.group\"></group_theme><div class=\"lmo-card\"><div class=\"memberships-page__top-bar lmo-flex lmo-flex__space-between lmo-flex__baseline\"><h2 translate=\"memberships_page.members\" class=\"md-title\"></h2><md-button ng-click=\"membershipsPage.invitePeople()\" ng-if=\"membershipsPage.canAddMembers()\" class=\"md-primary md-raised memberships-page__invite\"><span translate=\"group_page.invite_people\"></span></md-button></div><md-input-container md-no-float=\"true\" class=\"md-block memberships-page__search-filter\"><input ng-model=\"membershipsPage.fragment\" ng-model-options=\"{debounce: 300}\" ng-change=\"membershipsPage.fetchMemberships()\" placeholder=\"{{\'memberships_page.fragment_placeholder\' | translate}}\" class=\"membership-page__search-filter\"><i class=\"mdi mdi-magnify\"></i></md-input-container><memberships_panel memberships=\"membershipsPage.memberships\" group=\"membershipsPage.group\"></memberships_panel><div class=\"lmo-flex lmo-flex__space-between\"><outlet layout=\"row\" name=\"after-memberships-panel\" model=\"membershipsPage.group\" class=\"lmo-flex\"></outlet><div ng-if=\"membershipsPage.group.membershipsCount &lt;= 25\"></div><div ng-if=\"membershipsPage.group.membershipsCount &gt; 25\"><md-button ng-click=\"membershipsPage.invitePeople()\" ng-if=\"membershipsPage.canAddMembers()\" class=\"md-primary md-raised\"><span translate=\"group_page.invite_people\"></span></md-button></div></div></div><pending_invitations_card group=\"membershipsPage.group\"></pending_invitations_card></main></div>");
$templateCache.put("generated/components/install_slack_page/install_slack_page.html","<div class=\"install-slack-page\"></div>");
$templateCache.put("generated/components/notification/notification.html","<li ng-class=\"{\'lmo-active\': !notification.viewed}\"><a class=\"notification navbar-notifications__{{notification.kind}}\" href=\"{{notification.url}}\" ng-click=\"broadcastThreadEvent(notification)\"><div class=\"notification__avatar\"><user_avatar ng-if=\"actor()\" user=\"actor()\" size=\"small\"></user_avatar><div ng-if=\"!actor()\" class=\"thread-item__proposal-icon\"></div></div><div class=\"notification__content\"> <span ng-bind-html=\"notification.content()\"></span>  <timeago timestamp=\"notification.createdAt\"></timeago> <div ng-if=\"notification.translationValues.publish_outcome\" translate=\"notifications.publish_outcome\" class=\"notifications__publish-outcome\"></div></div></a></li>");
$templateCache.put("generated/components/notifications/notifications.html","<div class=\"notifications\"><md-menu id=\"notifications\" md-position-mode=\"target target\" md-offset=\"0 48\"><md-button ng-click=\"toggle($mdMenu)\" tabindex=\"4\" class=\"notifications__button lmo-flex\"><div translate=\"navbar.notifications\" class=\"sr-only\"></div><i ng-if=\"hasUnread()\" class=\"mdi mdi-bell\"></i><i ng-if=\"!hasUnread()\" class=\"mdi mdi-bell-outline\"></i><span ng-if=\"hasUnread()\" class=\"badge notifications__activity\">{{unreadCount()}}</span></md-button><md-menu-content class=\"notifications__menu-content notifications__dropdown\"><notification notification=\"notification\" ng-repeat=\"notification in notifications() | orderBy: \'-createdAt\' track by notification.id\"></notification><li ng-if=\"notifications().length == 0\"><span translate=\"notifications.no_notifications\" class=\"notification\"></span></li></md-menu-content></md-menu></div>");
$templateCache.put("generated/components/only_coordinator_modal/only_coordinator_modal.html","<md-dialog class=\"only-coordinator-modal lmo-modal__narrow\"><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"deactivate_user_form.title\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button ng-if=\"!preventClose\"></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content\"><p translate=\"only_coordinator_modal.explanation\"></p><ul class=\"only-coordinator-modal__list\"><li ng-repeat=\"group in groups()\" class=\"only-coordinator-modal__list-item\"><a ng-click=\"redirectToGroup(group)\" class=\"lmo-link\">{{group.fullName}}</a></li></ul><p translate=\"only_coordinator_modal.instructions\"></p></div></md-dialog>");
$templateCache.put("generated/components/pending_email_form/pending_email_form.html","<md-list class=\"md-block pending-email-form\"><md-list-item ng-if=\"emails.length\" layout=\"column\" class=\"pending-email-form__emails\"><div ng-repeat=\"email in emails track by $index\" class=\"pending-email-form__email lmo-flex lmo-flex__space-between lmo-flex__center\"><div class=\"pending-email-form__email-row lmo-flex__grow\">{{email}}</div><md-button ng-click=\"remove(email)\" class=\"lmo-inline-action\"><i class=\"mdi mdi-close\"></i></md-button></div></md-list-item><md-list-item flex=\"true\" layout=\"row\" class=\"pending-email-form__add-option lmo-flex__align-top\"><md-input-container md-no-float=\"true\" class=\"lmo-flex__grow\"><input type=\"text\" placeholder=\"{{ \'pending_email_form.enter_email\' | translate }}\" ng-model=\"newEmail\" class=\"pending-email-form__add-option-input\"></md-input-container><md-button ng-click=\"addIfValid()\" ng-disabled=\"emails.length == 0\" aria-label=\"{{ \'pending_email_form.enter_email\' | translate }}\" class=\"pending-email-form__option-button pending-email-form__add-button\"><i class=\"mdi mdi-plus\"></i></md-button></md-list-item><div class=\"lmo-validation-error\">{{ emailValidationError }}</div><div class=\"lmo-flex lmo-flex__space-between\"><div></div><md-button ng-disabled=\"emails.length == 0\" ng-click=\"submit()\" aria-label=\"{{ \'pending_email_form.send_email\' | translate }}\" class=\"md-primary md-raised poll-common-share-form__button poll-common-share-form__option-button\"><span translate=\"pending_email_form.send_email\"></span></md-button></div></md-list>");
$templateCache.put("generated/components/pin_thread_modal/pin_thread_modal.html","<md-dialog class=\"pin-thread-modal poll common-modal lmo-modal__narrow\"><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><i class=\"mdi mdi-pin\"></i><h1 translate=\"pin_thread_modal.title\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content\"><div ng-if=\"isDisabled\" class=\"lmo-disabled-form\"></div><p translate=\"pin_thread_modal.helptext\" class=\"lmo-hint-text\"></p><img src=\"img/pinning.png\" class=\"pin-thread-modal__image\"><p translate=\"pin_thread_modal.helptext_two\" class=\"lmo-hint-text\"></p><div class=\"lmo-md-actions\"><div></div><md-button translate=\"common.ok_got_it\" ng-click=\"submit()\" class=\"md-primary md-raised pin-thread-modal__submit\"></md-button></div></div></md-dialog>");
$templateCache.put("generated/components/poll_page/poll_page.html","<div class=\"lmo-one-column-layout\"><loading ng-if=\"!pollPage.poll\"></loading><main ng-if=\"pollPage.poll\" class=\"poll-page lmo-row\"><group_theme ng-if=\"pollPage.poll.group()\" group=\"pollPage.poll.group()\" discussion=\"pollPage.poll.discussion()\" compact=\"true\"></group_theme><div layout=\"column\" class=\"poll-page__main-content lmo-flex\"><poll_common_example_card ng-if=\"pollPage.poll.example\" poll=\"pollPage.poll\"></poll_common_example_card><poll_common_card poll=\"pollPage.poll\" class=\"lmo-card--no-padding\"></poll_common_card></div></main></div>");
$templateCache.put("generated/components/polls_page/polls_page.html","<div class=\"loading-wrapper lmo-one-column-layout\"><main class=\"polls-page\"><div class=\"lmo-flex lmo-flex__space-between lmo-flex__baseline\"><h1 ng-if=\"pollsPage.group\" class=\"lmo-h1 dashboard-page__heading polls-page__heading\"><a lmo-href-for=\"pollsPage.group\"><span translate=\"polls_page.heading_with_group\" translate-value-name=\"{{pollsPage.group.fullName}}\"></span></a></h1><h1 ng-if=\"!pollsPage.group\" translate=\"polls_page.heading\" class=\"lmo-h1 dashboard-page__heading polls-page__heading\"></h1><div class=\"buh\"><md-button ng-click=\"pollsPage.startNewPoll()\" class=\"md-primary md-raised\"><span translate=\"polls_page.start_new_poll\"></span></md-button></div></div><div class=\"lmo-card\"><div class=\"polls-page__filters lmo-flex\"><md-input-container md-no-float=\"true\" class=\"polls-page__search md-block\"><i class=\"mdi mdi-magnify\"></i><input ng-model=\"pollsPage.fragment\" placeholder=\"{{\'polls_page.search_placeholder\' | translate}}\" ng-change=\"pollsPage.searchPolls()\" ng-model-options=\"{debounce: 250}\"></md-input-container><md-select ng-model=\"pollsPage.statusFilter\" placeholder=\"{{ \'polls_page.filter_placeholder\' | translate }}\" ng-change=\"pollsPage.fetchRecords()\" class=\"polls-page__status-filter\"><md-option ng-value=\"null\">{{ \'polls_page.filter_placeholder\' | translate }}</md-option><md-option ng-repeat=\"filter in pollsPage.statusFilters track by filter.value\" ng-value=\"filter.value\">{{filter.name}}</md-option></md-select><md-select ng-model=\"pollsPage.groupFilter\" placeholder=\"{{ \'polls_page.groups_placeholder\' | translate }}\" ng-change=\"pollsPage.fetchRecords()\" class=\"polls-page__group-filter\"><md-option ng-value=\"null\">{{ \'polls_page.groups_placeholder\' | translate }}</md-option><md-option ng-repeat=\"filter in pollsPage.groupFilters track by filter.value\" ng-value=\"filter.value\">{{filter.name}}</md-option></md-select></div><loading ng-if=\"pollsPage.fetchRecordsExecuting\"></loading><div ng-if=\"!pollsPage.fetchRecordsExecuting\" class=\"polls-page__polls\"><poll_common_preview ng-repeat=\"poll in pollsPage.pollCollection.polls() | orderBy:pollsPage.pollImportance track by poll.id\" poll=\"poll\" display-group-name=\"!pollsPage.group\"></poll_common_preview><loading ng-if=\"pollsPage.loadMoreExecuting\"></loading><div translate=\"polls_page.polls_count\" translate-value-count=\"{{pollsPage.loadedCount()}}\" translate-value-total=\"{{pollsPage.pollsCount}}\" class=\"polls-page__count\"></div><div ng-if=\"pollsPage.canLoadMore()\" class=\"polls-page__load-more\"><md-button translate=\"poll_common.load_more\" ng-click=\"pollsPage.loadMore()\" class=\"md-primary\"></md-button></div></div></div></main></div>");
$templateCache.put("generated/components/profile_page/profile_page.html","<div class=\"loading-wrapper lmo-one-column-layout\"><loading ng-if=\"!profilePage.user\"></loading><main ng-if=\"profilePage.user\" class=\"profile-page\"><div class=\"lmo-page-heading\"><h1 translate=\"profile_page.profile\" class=\"lmo-h1-medium\"></h1></div><div class=\"profile-page-card\"><div ng-show=\"profilePage.isDisabled\" class=\"lmo-disabled-form\"></div><h3 translate=\"profile_page.edit_profile\" class=\"lmo-h3\"></h3><div class=\"profile-page__profile-fieldset\"><user_avatar user=\"profilePage.user\" size=\"featured\"></user_avatar><md-button ng-click=\"profilePage.changePicture()\" translate=\"profile_page.change_picture_link\" class=\"md-accent md-button--no-h-margin profile-page__change-picture\"></md-button></div><div class=\"profile-page__profile-fieldset\"><md-input-container class=\"md-block\"><label for=\"user-name-field\" translate=\"profile_page.name_label\"></label><input ng-required=\"ng-required\" ng-model=\"profilePage.user.name\" class=\"profile-page__name-input\" id=\"user-name-field\"><validation_errors subject=\"profilePage.user\" field=\"name\"></validation_errors></md-input-container><md-input-container class=\"md-block\"><label for=\"user-username-field\" translate=\"profile_page.username_label\"></label><input ng-required=\"ng-required\" ng-model=\"profilePage.user.username\" class=\"profile-page__username-input\" id=\"user-username-field\"><validation_errors subject=\"profilePage.user\" field=\"username\"></validation_errors></md-input-container><md-input-container class=\"md-block\"><label for=\"user-email-field\" translate=\"profile_page.email_label\"></label><input ng-required=\"ng-required\" ng-model=\"profilePage.user.email\" class=\"profile-page__email-input\" id=\"user-email-field\"><validation_errors subject=\"profilePage.user\" field=\"email\"></validation_errors></md-input-container><md-input-container class=\"md-block\"><label for=\"user-short-bio-field\" translate=\"profile_page.short_bio_label\"></label><textarea ng-model=\"profilePage.user.shortBio\" placeholder=\"{{\'profile_page.short_bio_placeholder\' | translate}}\" class=\"profile-page__short-bio-input\" id=\"user-short-bio-field\"></textarea><validation_errors subject=\"profilePage.user\" field=\"shortBio\"></validation_errors></md-input-container><md-input-container class=\"md-block\"><label for=\"user-location-field\" translate=\"profile_page.location_label\"></label><input ng-model=\"profilePage.user.location\" placeholder=\"{{\'profile_page.location_placeholder\' | translate}}\" class=\"profile-page__location-input\" id=\"user-location-field\"></md-input-container><md-input-container class=\"md-block\"><label for=\"user-locale-field\" translate=\"profile_page.locale_label\"></label><md-select ng-model=\"profilePage.user.selectedLocale\" ng-required=\"true\" class=\"profile-page__language-input\" id=\"user-locale-field\"><md-option ng-repeat=\"locale in profilePage.availableLocales()\" ng-value=\"locale.key\">{{locale.name}}</md-option></md-select><validation_errors subject=\"profilePage.user\" field=\"selectedLocale\"></validation_errors></md-input-container><p ng-if=\"profilePage.showHelpTranslate()\"><a translate=\"profile_page.help_translate\" href=\"https://www.loomio.org/g/cpaM3Hsv/loomio-community-translation\" target=\"_blank\" class=\"md-caption\"></a></p></div><div class=\"profile-page__update-account lmo-flex lmo-flex__space-between\"><md-button ng-click=\"profilePage.changePassword()\" translate=\"profile_page.change_password_link\" class=\"md-accent profile-page__change-password\"></md-button><md-button ng-click=\"profilePage.submit()\" ng-disabled=\"isDisabled\" translate=\"profile_page.update_profile\" class=\"md-primary md-raised profile-page__update-button\"></md-button></div></div><div class=\"profile-page-card\"><h3 translate=\"profile_page.deactivate_account\" class=\"lmo-h3\"></h3><md-button ng-click=\"profilePage.deactivateUser()\" translate=\"profile_page.deactivate_user_link\" class=\"md-warn md-button--no-h-margin profile-page__deactivate\"></md-button></div></main></div>");
$templateCache.put("generated/components/registered_app_form/registered_app_form.html","<md-dialog class=\"poll-common-modal\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"registered_app_form.new_application_title\" ng-show=\"application.isNew()\" class=\"lmo-h1\"></h1><h1 translate=\"registered_app_form.edit_application_title\" ng-hide=\"application.isNew()\" class=\"lmo-h1\"></h1><modal_header_cancel_button aria-hidden=\"true\"></modal_header_cancel_button></div></md-toolbar><md-dialog-content><form class=\"md-dialog-content registered-app-form\"><div layout=\"row\" class=\"lmo-flex\"><div layout=\"column\" class=\"lmo-flex lmo-margin-right\"><img ng-src=\"{{application.logoUrl}}\" class=\"lmo-box--large\"> <md-button ng-if=\"!application.isNew()\" type=\"button\" ng-click=\"clickFileUpload()\" class=\"md-accent registered-app-form__upload-button\"> <span translate=\"common.action.upload\"></span> </md-button> <input type=\"file\" ng-model=\"file\" ng-file-select=\"upload(file)\" class=\"hidden registered-app-form__logo-input\"></div><div layout=\"column\" class=\"lmo-flex\"><md-input-container class=\"md-block\"><label for=\"application-name\" translate=\"registered_app_form.name_label\"></label><input placeholder=\"{{ \'registered_app_form.name_placeholder\' | translate }}\" ng-model=\"application.name\" ng-required=\"true\" maxlength=\"255\" class=\"lmo-primary-form-input\"><validation_errors subject=\"application\" field=\"name\"></validation_errors></md-input-container><md-input-container class=\"md-block\"><label for=\"application-redirect-uri\" translate=\"registered_app_form.redirect_uri_label\"></label><textarea ng-model=\"application.redirectUri\" ng-required=\"true\" placeholder=\"{{ \'registered_app_form.redirect_uri_placeholder\' | translate }}\" class=\"lmo-textarea\"></textarea><div translate=\"registered_app_form.redirect_uri_note\" class=\"lmo-hint-text\"></div><validation_errors subject=\"application\" field=\"redirectUri\"></validation_errors></md-input-container></div></div><div class=\"lmo-flex lmo-flex__space-between registered-app-form__actions\"><md-button type=\"button\" ng-click=\"$close()\" translate=\"common.action.cancel\"></md-button><md-button ng-click=\"submit()\" translate=\"registered_app_form.new_application_submit\" ng-show=\"application.isNew()\" class=\"md-primary md-raised\"></md-button><md-button ng-click=\"submit()\" translate=\"registered_app_form.edit_application_submit\" ng-hide=\"application.isNew()\" class=\"md-primary md-raised\"></md-button></div></form></md-dialog-content></md-dialog>");
$templateCache.put("generated/components/registered_app_page/registered_app_page.html","<div class=\"lmo-one-column-layout\"><loading ng-if=\"!registeredAppPage.application\"></loading><main ng-if=\"registeredAppPage.application\" class=\"registered-app-page\"><div layout=\"column\" class=\"lmo-flex registered-app-page__app\"><div layout=\"row\" class=\"lmo-flex lmo-flex__center registered-app-page__title\"><img ng-src=\"{{registeredAppPage.application.logoUrl}}\" class=\"lmo-box--small lmo-margin-right\"><h1 class=\"lmo-h1\">{{ registeredAppPage.application.name }}</h1></div><h3 translate=\"registered_app_page.uid\" class=\"lmo-h3\"></h3><div layout=\"row\" class=\"registered-app-page__field lmo-flex lmo-flex__center\"><code class=\"registered-app-page__code lmo-flex__grow\">{{ registeredAppPage.application.uid }}</code><md-button title=\"{{ \'common.copy\' | translate }}\" clipboard=\"true\" text=\"registeredAppPage.application.uid\" on-copied=\"registeredAppPage.copied()\"><span translate=\"common.copy\"></span></md-button></div><h3 translate=\"registered_app_page.secret\" class=\"lmo-h3\"></h3><div layout=\"row\" class=\"registered-app-page__field lmo-flex lmo-flex__center\"><code class=\"registered-app-page__code lmo-flex__grow\">{{ registeredAppPage.application.secret }}</code><md-button title=\"{{ \'common.copy\' | translate }}\" clipboard=\"true\" text=\"registeredAppPage.application.secret\" on-copied=\"registeredAppPage.copied()\"><span translate=\"common.copy\"></span></md-button></div><h3 translate=\"registered_apps_page.redirect_uris\" class=\"lmo-h3\"></h3><div layout=\"row\" ng-repeat=\"uri in registeredAppPage.application.redirectUriArray()\" class=\"registered-app-page__field lmo-flex lmo-flex__center\"><code class=\"registered-app-page__code lmo-flex__grow\">{{ uri }}</code><md-button title=\"{{ \'common.copy\' | translate }}\" clipboard=\"true\" text=\"uri\" on-copied=\"registeredAppPage.copied()\"><span translate=\"common.copy\"></span></md-button></div></div><div class=\"lmo-flex lmo-flex__space-between\"><div><a lmo-href=\"/apps/registered\" class=\"md-button\"><span translate=\"common.action.back\"></span></a></div><div> <md-button type=\"button\" translate=\"common.action.remove\" ng-click=\"registeredAppPage.openRemoveForm()\" class=\"md-warn md-raised\"></md-button>  <md-button type=\"button\" translate=\"common.action.edit\" ng-click=\"registeredAppPage.openEditForm()\" class=\"md-primary md-raised\"></md-button> </div></div></main></div>");
$templateCache.put("generated/components/registered_apps_page/registered_apps_page.html","<div class=\"lmo-one-column-layout\"><loading ng-show=\"registeredAppsPage.loading\"></loading><main ng-if=\"!registeredAppsPage.loading\" class=\"registered-apps-page\"><div class=\"lmo-flex lmo-flex__space-between\"><h1 translate=\"registered_apps_page.title\" class=\"lmo-h1\"></h1><md-button ng-click=\"registeredAppsPage.openApplicationForm()\" class=\"md-primary md-raised\"><span translate=\"registered_apps_page.create_new_application\"></span></md-button></div><div ng-if=\"registeredAppsPage.applications().length == 0\" translate=\"registered_apps_page.no_applications\" class=\"lmo-placeholder\"></div><div layout=\"column\" ng-if=\"registeredAppsPage.applications().length &gt; 0\" class=\"lmo-flex\"><div layout=\"row\" ng-repeat=\"application in registeredAppsPage.applications() | orderBy: \'name\' track by application.id\" class=\"registered-apps-page__apps lmo-flex lmo-flex__center\"> <img ng-src=\"{{application.logoUrl}}\" class=\"lmo-box--medium lmo-margin-right\"> <div class=\"lmo-flex__grow\"><strong><a lmo-href-for=\"application\" class=\"nowrap\">{{ application.name }}</a></strong></div><code ng-repeat=\"uri in application.redirectUriArray()\" class=\"registered-apps-page__code lmo-flex__grow\">{{uri}}</code><md-button ng-click=\"registeredAppsPage.openDestroyForm(application)\" class=\"registered-apps-page__clear lmo-flex lmo-flex__center lmo-flex__horizontal-center\"><div class=\"mdi mdi-close\"></div></md-button></div></div></main></div>");
$templateCache.put("generated/components/remove_app_form/remove_app_form.html","<md-dialog class=\"remove-app-form lmo-modal__narrow\"><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"remove_app_form.title\" translate-value-name=\"{{application.name}}\" class=\"lmo-h1\"></h1><modal_header_cancel_button aria-hidden=\"true\"></modal_header_cancel_button></div></md-toolbar><md-dialog-content class=\"md-dialog-content\"><p translate=\"remove_app_form.question\" translate-value-name=\"{{application.name}}\" class=\"lmo-hint-text\"></p><div class=\"lmo-flex lmo-flex__space-between\"><md-button ng-click=\"$close()\" type=\"button\" translate=\"common.action.cancel\"></md-button><md-button ng-click=\"submit()\" translate=\"remove_app_form.submit\" class=\"md-warn md-raised\"></md-button></div></md-dialog-content></md-dialog>");
$templateCache.put("generated/components/remove_membership_form/remove_membership_form.html","<md-dialog class=\"remove-membership-form\"><form><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"remove_membership_form.title\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content\"><p translate=\"remove_membership_form.question\" translate-value-name=\"{{membership.userName()}}\" translate-value-group=\"{{membership.group().name}}\"></p><div class=\"lmo-md-actions\"><md-button ng-click=\"$close()\" translate=\"common.action.cancel\"></md-button><md-button ng-click=\"submit()\" translate=\"remove_membership_form.submit\" class=\"md-primary md-raised memberships-page__remove-membership-confirm\"></md-button></div></div></form></md-dialog>");
$templateCache.put("generated/components/revoke_app_form/revoke_app_form.html","<md-dialog class=\"revoke-app-form lmo-modal__narrow\"><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"revoke_app_form.title\" translate-value-name=\"{{application.name}}\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button ng-if=\"!preventClose\"></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content\"><p translate=\"revoke_app_form.question\" translate-value-name=\"{{application.name}}\"></p><div class=\"lmo-md-actions\"><md-button ng-click=\"$close()\" translate=\"common.action.cancel\"></md-button><md-button ng-click=\"submit()\" translate=\"revoke_app_form.submit\" class=\"md-raised md-warn\"></md-button></div></div></md-dialog>");
$templateCache.put("generated/components/sidebar/sidebar.html","<md-sidenav role=\"navigation\" md-component-id=\"left\" md-is-open=\"showSidebar\" md-is-locked-open=\"$mdMedia(\'gt-md\') &amp;&amp; showSidebar\" md-whiteframe=\"4\" aria-label=\"{{ \'sidebar.aria_labels.heading\' | translate }}\" aria-hidden=\"{{!showSidebar}}\" class=\"md-sidenav-left lmo-no-print\"><md_content layout=\"column\" ng-click=\"sidebarItemSelected()\" role=\"navigation\" class=\"sidebar__content lmo-no-print\"><div class=\"sidebar__divider\"></div><md_list layout=\"column\" aria-label=\"{{ \'sidebar.aria_labels.threads_list\' | translate }}\" class=\"sidebar__list sidebar__threads\"><md_list_item><md_button lmo-href=\"/polls\" ng-click=\"isActive()\" aria-label=\"{{ \'sidebar.my_decisions\' | translate }}\" ng-class=\"{\'sidebar__list-item--selected\': onPage(\'pollsPage\')}\" class=\"sidebar__list-item-button sidebar__list-item-button--decisions\"><md_avatar_icon class=\"sidebar__list-item-icon mdi mdi-thumbs-up-down\"></md_avatar_icon><span translate=\"common.decisions\"></span></md_button></md_list_item><md_list_item><md_button lmo-href=\"/dashboard\" ng-click=\"isActive()\" aria-label=\"{{ \'sidebar.recent\' | translate }}\" ng-class=\"{\'sidebar__list-item--selected\': onPage(\'dashboardPage\')}\" class=\"sidebar__list-item-button sidebar__list-item-button--recent\"><i class=\"sidebar__list-item-icon mdi mdi-forum\"></i><span translate=\"sidebar.recent_threads\"></span></md_button></md_list_item><md_list_item><md_button lmo-href=\"/inbox\" ng-click=\"isActive()\" aria-label=\"{{ \'sidebar.unread\' | translate }}\" ng-class=\"{\'sidebar__list-item--selected\': onPage(\'inboxPage\')}\" class=\"sidebar__list-item-button sidebar__list-item-button--unread\"><i class=\"sidebar__list-item-icon mdi mdi-inbox\"></i><span translate=\"sidebar.unread_threads\" translate-value-count=\"{{unreadThreadCount()}}\"></span></md_button></md_list_item><md_list_item><md_button lmo-href=\"/dashboard/show_muted\" ng-click=\"isActive()\" aria-label=\"{{ \'sidebar.muted\' | translate }}\" ng-class=\"{\'sidebar__list-item--selected\': onPage(\'dashboardPage\', nil, \'show_muted\')}\" class=\"sidebar__list-item-button sidebar__list-item-button--muted\"><i class=\"sidebar__list-item-icon mdi mdi-volume-mute\"></i><span translate=\"sidebar.muted_threads\"></span></md_button></md_list_item><md_list_item ng-show=\"hasAnyGroups()\"><md_button ng-click=\"startThread()\" aria-label=\"{{ \'sidebar.start_thread\' | translate }}\" class=\"sidebar__list-item-button sidebar__list-item-button--start-thread\"><i class=\"sidebar__list-item-icon mdi mdi-plus\"></i><span translate=\"sidebar.start_thread\"></span></md_button></md_list_item></md_list><div class=\"sidebar__divider\"></div><md_list_item translate=\"common.groups\" class=\"sidebar__list-subhead\"></md_list_item><md_list ng-class=\"{\'sidebar__no-groups\': groups().length &lt; 1}\" aria-label=\"{{ \'sidebar.aria_labels.groups_list\' | translate }}\" class=\"sidebar__list sidebar__groups\"><md_list_item ng_repeat=\"group in groups() | orderBy: \'fullName\' track by group.id\"><md_button lmo-href=\"{{groupUrl(group)}}\" aria-label=\"{{group.name}}\" ng-if=\"group.isParent()\" ng-class=\"{\'sidebar__list-item--selected\': onPage(\'groupPage\', group.key)}\" class=\"sidebar__list-item-button sidebar__list-item-button--group\"><img ng_src=\"{{group.logoUrl()}}\" class=\"md-avatar lmo-box--tiny sidebar__list-item-group-logo\"><span>{{group.name}}</span></md_button><md_button lmo-href=\"{{groupUrl(group)}}\" ng-if=\"!group.isParent()\" ng-class=\"{\'sidebar__list-item--selected\': onPage(\'groupPage\', group.key)}\" class=\"sidebar__list-item-button--subgroup\">{{group.name}}</md_button><div class=\"sidebar__list-item-padding\"></div></md_list_item><md_list_item ng-if=\"canViewPublicGroups()\"><md_button lmo-href=\"/explore\" aria-label=\"{{ \'sidebar.explore\' | translate }}\" ng-class=\"{\'sidebar__list-item--selected\': onPage(\'explorePage\')}\" class=\"sidebar__list-item-button sidebar__list-item-button--explore\"><i class=\"sidebar__list-item-icon mdi mdi-earth\"></i><span translate=\"sidebar.explore\"></span></md_button></md_list_item><md_list_item ng-if=\"canStartGroup()\"><md_button ng-click=\"startGroup()\" aria-label=\"{{ \'sidebar.start_group\' | translate }}\" class=\"sidebar__list-item-button sidebar__list-item-button--start-group\"><i class=\"sidebar__list-item-icon mdi mdi-plus\"></i><span translate=\"sidebar.start_group\"></span></md_button></md_list_item></md_list></md_content></md-sidenav>");
$templateCache.put("generated/components/signed_out_modal/signed_out_modal.html","<md-dialog class=\"signed-out-modal lmo-modal__narrow\"><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"signed_out_modal.title\" class=\"lmo-h1\"></h1></div></md-toolbar><div class=\"md-dialog-content\"><span translate=\"signed_out_modal.message\"></span><div class=\"lmo-md-actions\"><div></div><md-button ng-click=\"submit()\" translate=\"signed_out_modal.ok\" class=\"md-primary md-raised\"></md-button></div></div></md-dialog>");
$templateCache.put("generated/components/move_thread_form/move_thread_form.html","<md-dialog class=\"move-thread-form\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"move_thread_form.title\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content\"><label for=\"group-dropdown\" translate=\"move_thread_form.body\"></label><md-select ng-model=\"discussion.groupId\" ng-required=\"ng-required\" ng-change=\"updateTarget()\" class=\"move-thread-form__group-dropdown\" id=\"group-dropdown\"><md-option ng-value=\"group.id\" ng-repeat=\"group in availableGroups() | orderBy: \'fullName\' track by group.id\">{{group.fullName}}</md-option></md-select><div class=\"lmo-md-actions\"><md-button ng-click=\"$close()\" type=\"button\" translate=\"common.action.cancel\"></md-button><md-button type=\"button\" translate=\"move_thread_form.confirm\" ng-click=\"moveThread()\" class=\"md-raised md-primary move-thread-form__submit\"></md-button></div></div></md-dialog>");
$templateCache.put("generated/components/smart_time/smart_time.html"," <abbr class=\"smart-time\"><span data-toggle=\"tooltip\" ng-attr-title=\"{{time | exactDateWithTime}}\">{{value}}</span></abbr> ");
$templateCache.put("generated/components/start_group_page/start_group_page.html","<div class=\"lmo-one-column-layout\"><main class=\"start-group-page lmo-row\"><loading ng-if=\"!startGroupPage.group\"></loading><div ng-if=\"startGroupPage.group\" layout=\"column\" class=\"start-group-page__main-content lmo-flex lmo-card\"><h1 translate=\"group_form.start_group_heading\" class=\"lmo-card-heading\"></h1><group_form group=\"startGroupPage.group\"></group_form></div></main></div>");
$templateCache.put("generated/components/start_poll_page/start_poll_page.html","<div class=\"lmo-one-column-layout\"><main class=\"start-poll-page lmo-row\"><div layout=\"column\" class=\"start-poll-page__main-content lmo-flex lmo-card lmo-relative\"><div ng-if=\"isDisabled\" class=\"lmo-disabled-form\"></div><div ng-if=\"!startPollPage.poll.pollType\" class=\"poll-common-start-poll__header lmo-flex\"><h2 translate=\"poll_common.start_poll\" class=\"lmo-card-heading\"></h2></div><div ng-if=\"startPollPage.poll.pollType\" class=\"poll-common-start-poll__header lmo-flex\"><i class=\"mdi {{ startPollPage.icon() }}\"></i><h2 translate=\"poll_types.{{startPollPage.poll.pollType}}\" class=\"lmo-card-heading poll-common-card-header__poll-type\"></h2></div><div ng-switch=\"startPollPage.currentStep\" class=\"poll-common-start-poll\"><poll_common_choose_type ng-switch-when=\"choose\" poll=\"startPollPage.poll\" class=\"animated\"></poll_common_choose_type><poll_common_directive ng-switch-when=\"save\" poll=\"startPollPage.poll\" name=\"form\" class=\"animated\"></poll_common_directive><poll_common_form_actions ng-switch-when=\"save\" poll=\"startPollPage.poll\"></poll_common_form_actions></div></div></main></div>");
$templateCache.put("generated/components/thread_card/thread_card.html","<div class=\"thread-card lmo-card--no-padding\"><context_panel discussion=\"discussion\"></context_panel><activity_card discussion=\"discussion\" ng-if=\"discussion.createdEvent()\"></activity_card></div>");
$templateCache.put("generated/components/thread_lintel/thread_lintel.html","<div ng-if=\"show()\" class=\"thread-lintel__wrapper lmo-no-print\"><div class=\"thread-lintel__content\"><div ng-class=\"{\'lmo-width-75\': !proposalButtonInView}\" class=\"thread-lintel__left\"><div ng-click=\"scrollToThread()\" class=\"lmo-truncate thread-lintel__title\">{{ discussion.title }}</div></div><div class=\"thread-lintel__progress-wrap thread-lintel__progress\"><div style=\"width: {{positionPercent}}%\" class=\"thread-lintel__progress-bar thread-lintel__progress\"></div></div></div></div>");
$templateCache.put("generated/components/thread_page/thread_page.html","<div class=\"loading-wrapper lmo-two-column-layout\"><loading ng-if=\"!threadPage.discussion\"></loading><main ng-if=\"threadPage.discussion\" class=\"thread-page lmo-row\"><group_theme group=\"threadPage.discussion.group()\" compact=\"true\"></group_theme><div class=\"thread-page__main-content\"><outlet name=\"before-thread-page-column-right\" ng-if=\"threadPage.eventsLoaded\" model=\"threadPage.discussion\" class=\"before-column-right lmo-column-right\"></outlet><poll_common_card poll=\"poll\" ng-repeat=\"poll in threadPage.discussion.activePolls() track by poll.id\" class=\"lmo-card--no-padding lmo-column-right\"></poll_common_card><decision_tools_card discussion=\"threadPage.discussion\" class=\"lmo-column-right\"></decision_tools_card><poll_common_index_card model=\"threadPage.discussion\" class=\"lmo-column-right\"></poll_common_index_card><members_card group=\"threadPage.discussion.group()\" class=\"lmo-column-right\"></members_card><outlet name=\"thread-page-column-right\" class=\"after-column-right lmo-column-right\"></outlet><thread_card discussion=\"threadPage.discussion\" class=\"lmo-column-left\"></thread_card></div><thread_lintel></thread_lintel></main></div>");
$templateCache.put("generated/components/thread_preview/thread_preview.html","<div class=\"thread-preview\"><a lmo-href-for=\"thread\" md-colors=\"{\'border-color\': \'primary-500\'}\" ng-class=\"{\'thread-preview__link--unread\': thread.isUnread()}\" class=\"thread-preview__link\"><div class=\"sr-only\"><span>{{thread.authorName()}}: {{thread.title}}.</span><span ng-if=\"thread.hasUnreadActivity()\" translate=\"dashboard_page.aria_thread.unread\" translate-value-count=\"{{ thread.unreadItemsCount() }}\"></span></div><div class=\"thread-preview__icon\"><user_avatar ng-if=\"!thread.activePoll()\" user=\"thread.author()\" size=\"medium\"></user_avatar><poll_common_chart_preview ng-if=\"thread.activePoll()\" poll=\"thread.activePoll()\"></poll_common_chart_preview></div><div class=\"thread-preview__details\"><div class=\"thread-preview__text-container\"><div ng-class=\"{\'thread-preview--unread\': thread.isUnread() }\" class=\"thread-preview__title\">{{thread.title}}</div><div ng-if=\"thread.hasUnreadActivity()\" class=\"thread-preview__unread-count\">({{thread.unreadItemsCount()}})</div></div><div class=\"thread-preview__text-container\"><div class=\"thread-preview__group-name\">{{ thread.group().fullName }} · <smart_time time=\"thread.lastActivityAt\"></smart_time> </div><div ng-if=\"thread.closedAt\" md-colors=\"{color: \'warn-600\', \'border-color\': \'warn-600\'}\" translate=\"common.privacy.closed\" class=\"lmo-badge lmo-pointer\"></div><outlet name=\"after-thread-preview\" model=\"thread\"></outlet></div></div><div ng-if=\"thread.pinned\" title=\"{{\'context_panel.thread_status.pinned\' | translate}}\" class=\"thread-preview__pin thread-preview__status-icon\"><i class=\"mdi mdi-pin\"></i></div></a><div ng-if=\"thread.discussionReaderId\" class=\"thread-preview__actions lmo-hide-on-xs\"> <md-button ng-click=\"dismiss()\" ng-disabled=\"!thread.isUnread()\" ng-class=\"{disabled: !thread.isUnread()}\" title=\"{{\'dashboard_page.dismiss\' | translate }}\" class=\"md-raised thread-preview__dismiss\"><div class=\"mdi mdi-check\"></div></md-button>  <md-button ng-click=\"muteThread()\" ng-show=\"!thread.isMuted()\" title=\"{{ \'volume_levels.mute\' | translate }}\" aria-label=\"{{ \'volume_levels.mute\' | translate }}\" class=\"md-raised thread-preview__mute\"><div class=\"mdi mdi-volume-mute\"></div></md-button>  <md-button ng-click=\"unmuteThread()\" ng-show=\"thread.isMuted()\" title=\"{{ \'volume_levels.unmute\' | translate }}\" aria-label=\"{{ \'volume_levels.unmute\' | translate }}\" class=\"md-raised thread-preview__unmute\"><div class=\"mdi mdi-volume-plus\"></div></md-button> </div></div>");
$templateCache.put("generated/components/thread_preview_collection/thread_preview_collection.html","<div class=\"thread-previews\"><outlet name=\"before-thread-previews\" model=\"query\"></outlet><div ng-repeat=\"thread in query.threads() | orderBy: \'-lastActivityAt\' | limitTo: limit track by thread.key\" class=\"blank\"><thread_preview thread=\"thread\"></thread_preview></div></div>");
$templateCache.put("generated/components/time_zone_select/time_zone_select.html","<div class=\"time-zone-select\"><div ng-show=\"!isOpen\" class=\"time-zone-select__selected\"><md-button ng-click=\"open()\" aria-label=\"Change time zone\" class=\"time-zone-select__change-button\">{{currentZone()}}</md-button></div><div ng-show=\"isOpen\" class=\"time-zone-select__change\"><md-autocomplete md-search-text=\"q\" md-selected-item=\"name\" md-selected-item-change=\"change()\" md-items=\"name in names()\" placeholder=\"Enter time zone\"><md-item-template><span>{{name}}</span></md-item-template></md-autocomplete></div></div>");
$templateCache.put("generated/components/timeago/timeago.html"," <abbr class=\"timeago\"><span am-time-ago=\"timestamp\" data-toggle=\"tooltip\" ng-attr-title=\"{{timestamp | exactDateWithTime}}\"></span></abbr> ");
$templateCache.put("generated/components/translate_button/translate_button.html","<div class=\"translate-button\"> <span ng-if=\"showdot &amp;&amp; (canTranslate() || translateExecuting || translated)\" aria-hidden=\"true\">·</span>  <button ng-if=\"canTranslate()\" ng-click=\"translate()\" translate=\"common.action.translate\" class=\"thread-item__translate\"></button> <loading ng-show=\"translateExecuting\" class=\"translate-button__loading\"></loading> <span ng-if=\"translated\" translate=\"common.action.translated\" class=\"thread-item__translation\"></span> </div>");
$templateCache.put("generated/components/translation/translation.html","<div class=\"translation\"><div marked=\"translated\" class=\"translation__body\"></div></div>");
$templateCache.put("generated/components/user_avatar/user_avatar.html","<div class=\"user-avatar lmo-box--{{size}}\" aria-hidden=\"true\" ng-class=\"{\'user-avatar--coordinator\': coordinator}\" title=\"{{user.name}}\"><a lmo-href-for=\"user\" ng-if=\"!noLink\" class=\"user-avatar__profile-link\"><div class=\"lmo-box--{{size}} user-avatar__initials user-avatar__initials--{{size}}\" aria-hidden=\"true\" ng-if=\"user.avatarKind == \'initials\'\">{{user.avatarInitials}}</div><img class=\"lmo-box--{{size}}\" ng-if=\"user.avatarKind == \'gravatar\'\" gravatar-src-once=\"user.gravatarMd5\" gravatar-size=\"{{gravatarSize()}}\" alt=\"{{::user.name}}\"><img class=\"lmo-box--{{size}}\" ng-if=\"user.avatarKind == \'uploaded\'\" alt=\"{{user.name}}\" ng-src=\"{{uploadedAvatarUrl()}}\"></a><div ng-if=\"noLink\" class=\"user-avatar__profile-link\"><div class=\"lmo-box--{{size}} user-avatar__initials user-avatar__initials--{{size}}\" aria-hidden=\"true\" ng-if=\"user.avatarKind == \'initials\'\">{{user.avatarInitials}}</div><img class=\"lmo-box--{{size}}\" ng-if=\"user.avatarKind == \'gravatar\'\" gravatar-src-once=\"user.gravatarMd5\" gravatar-size=\"{{gravatarSize()}}\" alt=\"{{::user.name}}\"><img class=\"lmo-box--{{size}}\" ng-if=\"user.avatarKind == \'uploaded\'\" alt=\"{{user.name}}\" ng-src=\"{{uploadedAvatarUrl()}}\"></div></div>");
$templateCache.put("generated/components/user_dropdown/user_dropdown.html","<md-menu md-position-mode=\"target-right target\" class=\"lmo-dropdown-menu\"><md-button ng-click=\"$mdMenu.open()\" class=\"user-dropdown__dropdown-button\"><user_avatar user=\"user\" no-link=\"true\" size=\"small\"></user_avatar></md-button><md-menu-content><md-menu-item class=\"user-dropdown__user-details\"><div class=\"lmo-flex lmo-flex__center lmo-flex__space-between\"><div class=\"user-dropdown__name\"><div class=\"user-dropdown__user-name lmo-truncate\">{{user.name}}</div><div class=\"user-dropdown__user-username lmo-truncate\">@{{user.username}}</div></div><user_avatar user=\"user\" size=\"medium\"></user_avatar></div></md-menu-item><md-menu-item><md_button lmo-href=\"/profile\" aria-label=\"{{ \'user_dropdown.edit_profile\' | translate }}\" ng-class=\"{\'user_dropdown__list-item--selected\': onPage(\'profilePage\')}\" class=\"user-dropdown__list-item-button user-dropdown__list-item-button--profile\"><i class=\"mdi mdi-18px lmo-margin-right mdi-account\"></i><span translate=\"user_dropdown.edit_profile\"></span></md_button></md-menu-item><md-menu-item><md_button lmo-href=\"/email_preferences\" aria-label=\"{{ \'user_dropdown.email_settings\' | translate }}\" ng-class=\"{\'user_dropdown__list-item--selected\': onPage(\'emailSettingsPage\')}\" class=\"user-dropdown__list-item-button user-dropdown__list-item-button--email-settings\"><i class=\"mdi mdi-18px lmo-margin-right mdi-email-outline\"></i><span translate=\"user_dropdown.email_settings\"></span></md_button></md-menu-item><md-menu-item ng-if=\"showHelp()\"><md_button href=\"{{helpLink()}}\" target=\"_blank\" aria-label=\"{{ \'user_dropdown.help\' | translate }}\" class=\"user-dropdown__list-item-button\"><i class=\"mdi mdi-18px lmo-margin-right mdi-help-circle-outline\"></i><span translate=\"user_dropdown.help\"></span></md_button></md-menu-item><md-menu-item><md_button ng-click=\"contactUs()\" aria-label=\"{{ \'user_dropdown.contact\' | translate }}\" class=\"user-dropdown__list-item-button\"><i class=\"mdi mdi-18px lmo-margin-right mdi-face\"></i><span translate=\"user_dropdown.contact_site_name\" translate-values=\"{site_name: siteName}\"></span></md_button></md-menu-item><md-menu-item><md_button ng-click=\"signOut()\" aria-label=\"{{ \'user_dropdown.sign_out\' | translate }}\" class=\"user-dropdown__list-item-button\"><i class=\"mdi mdi-18px lmo-margin-right mdi-exit-to-app\"></i><span translate=\"user_dropdown.sign_out\"></span></md_button></md-menu-item></md-menu-content></md-menu>");
$templateCache.put("generated/components/user_page/user_page.html","<div class=\"loading-wrapper container main-container lmo-one-column-layout\"><loading ng-if=\"!userPage.user\"></loading><main ng-if=\"userPage.user\" class=\"user-page main-container lmo-row\"><div class=\"lmo-card user-page__profile\"><div layout=\"row\" class=\"user-page__content lmo-flex\"><div class=\"user-page__avatar lmo-margin-right\"><user_avatar user=\"userPage.user\" size=\"featured\"></user_avatar><md-button ng-if=\"userPage.canContactUser()\" ng-click=\"userPage.contactUser()\" translate=\"user_page.contact_user\" translate-value-name=\"{{userPage.user.firstName()}}\" class=\"md-block md-primary md-raised user-page__contact-user\"></md-button></div><div class=\"user-page__info\"><h1 class=\"lmo-h1\">{{userPage.user.name}}</h1><div class=\"lmo-hint-text\">@{{userPage.user.username}}</div><p>{{userPage.user.shortBio}}</p><div translate=\"user_page.locale_field\" translate-value-value=\"{{userPage.user.localeName()}}\" ng-if=\"userPage.user.localeName()\"></div><div translate=\"user_page.location_field\" translate-value-value=\"{{userPage.location()}}\" ng-if=\"userPage.location()\"></div><div translate=\"user_page.online_field\" translate-value-value=\"{{userPage.user.lastSeenAt | timeFromNowInWords}}\" ng-if=\"userPage.user.lastSeenAt\"></div><div class=\"user-page__groups\"><h3 translate=\"common.groups\" class=\"lmo-h3 user-page__groups-title\"></h3><md-list><md-list-item ng-repeat=\"group in userPage.user.groups() | orderBy: \'fullName\' track by group.id\" class=\"user-page__group lmo-flex lmo-flex__center\"><img ng-src=\"{{group.logoUrl()}}\" class=\"md-avatar lmo-box--small lmo-margin-right\"><a lmo-href-for=\"group\">{{group.fullName}}</a></md-list-item></md-list><loading ng-if=\"userPage.loadGroupsForExecuting\"></loading></div></div></div></div></main></div>");
$templateCache.put("generated/components/validation_errors/validation_errors.html","<div class=\"lmo-validation-error\"><label for=\"{{field}}-error\" ng-repeat=\"error in subject.errors[field] track by $index\" class=\"md-container-ignore md-no-float lmo-validation-error__message\"><span>{{error}}</span></label></div>");
$templateCache.put("generated/components/verify_email_notice/verify_email_notice.html","<div translate=\"verify_email_notice.please_verify\" class=\"verify-email-notice lmo-card\"></div>");
$templateCache.put("generated/components/verify_stances_page/verify_stances_page.html","<div class=\"lmo-one-column-layout\"><main class=\"verify-stances-page lmo-row\"><div layout=\"column\" class=\"verify-stances-page__main-content lmo-flex lmo-card lmo-relative\"><div ng-if=\"stances().length &gt; 0\" class=\"lmo-blank\"><h1 translate=\"verify_stances.title\" class=\"lmo-h1-medium\"></h1><p translate=\"verify_stances.description\" class=\"lmo-hint-text\"></p><div ng-repeat=\"stance in stances() track by stance.id\" class=\"verify-stances-page__stance\">{{stance.poll().title}}<poll_common_directive name=\"stance_choice\" stance_choice=\"choice\" ng-if=\"choice.score &gt; 0\" ng-repeat=\"choice in stance.stanceChoices() | orderBy: \'rank\'\"></poll_common_directive><p>{{stance.reason}}</p><md-button ng-click=\"verify(stance)\" translate=\"verify_stances.verify\" class=\"verify-stances-page__verify\"></md-button><md-button ng-click=\"remove(stance)\" translate=\"verify_stances.remove\" class=\"verify-stances-page__remove\"></md-button></div></div><p translate=\"verify_stances.all_done\" ng-if=\"stances().length == 0\"></p></div></main></div>");
$templateCache.put("generated/components/mute_explanation_modal/mute_explanation_modal.html","<div class=\"mute-explanation-modal\"><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"mute_explanation_modal.mute_thread\" class=\"lmo-h1 mute-explanation-modal__title\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content md-body-1\"><div translate=\"mute_explanation_modal.body_html\" class=\"mute-explanation-modal__mute-explanation\"></div><div class=\"mute-explanation-modal__muted-threads-image\"><img src=\"/img/muted-threads-sidebar.png\" alt=\"{{ \'mute_explanation_modal.image_alt\' | translate }}\"></div><div class=\"lmo-md-actions\"><md-button type=\"button\" ng-click=\"$close()\" translate=\"common.action.cancel\" class=\"mute-explanation-modal__cancel\"></md-button><md-button type=\"button\" ng-click=\"muteThread()\" translate=\"mute_explanation_modal.mute_thread\" class=\"md-raised md-primary mute-explanation-modal__mute-thread\"></md-button></div></div></div>");
$templateCache.put("generated/components/slack_added_modal/slack_added_modal.html","<md-dialog class=\"leave-group-form\"><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"slack_added_modal.title\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content\"><slack_tableau group=\"group\"></slack_tableau><p translate=\"slack_added_modal.helptext\" translate-value-name=\"{{group.name}}\"></p><div class=\"lmo-md-actions\"><md-button ng-click=\"$close()\" type=\"button\" translate=\"common.ok_got_it\"></md-button><md-button translate=\"slack_added_modal.start_poll_now\" ng-click=\"submit()\" class=\"md-primary md-raised\"></md-button></div></div></md-dialog>");
$templateCache.put("generated/components/navbar/navbar.html","<header class=\"lmo-navbar\"><md_toolbar><div class=\"md-toolbar-tools\"><div class=\"navbar__left\"><md_icon_button aria-hidden=\"true\" ng-show=\"isLoggedIn()\" ng-click=\"toggleSidebar()\" aria-label=\"{{ \'navbar.toggle_sidebar\' | translate }}\" class=\"navbar__sidenav-toggle\"><i class=\"mdi mdi-menu\"></i></md_icon_button></div><div class=\"navbar__middle lmo-flex lmo-flex__horizontal-center\"><a lmo-href=\"/dashboard\" class=\"lmo-pointer\"><img ng-src=\"{{logo()}}\"></a></div><div class=\"navbar__right\"><navbar_search ng-show=\"isLoggedIn()\"></navbar_search><notifications ng-show=\"isLoggedIn()\"></notifications><user_dropdown ng-show=\"isLoggedIn()\"></user_dropdown> <md-button ng-if=\"!isLoggedIn()\" ng-click=\"signIn()\" class=\"md-primary md-raised navbar__sign-in\"><span translate=\"navbar.sign_in\"></span></md-button> </div></div></md_toolbar></header>");
$templateCache.put("generated/components/navbar/navbar_search.html","<div class=\"navbar-search\"><md-button ng-if=\"!isOpen\" ng-click=\"open()\" tabindex=\"4\" class=\"navbar-search__button lmo-flex\"><div translate=\"navbar.search.placeholder\" class=\"sr-only\"></div><i class=\"mdi mdi-magnify mdi-24px\"></i></md-button><md-autocomplete ng-if=\"isOpen\" md-min-length=\"3\" md-delay=\"300\" md-menu-class=\"navbar-search__results\" md-selected-item=\"selectedResult\" md-search-text=\"query\" md-selected-item-change=\"goToItem(result)\" md-items=\"result in search(query) | orderBy: [\'-rank\', \'-lastActivityAt\']\" placeholder=\"{{ \'navbar.search.placeholder\' | translate }}\" class=\"navbar-search__input\"><md-item-template><search_result result=\"result\"></search_result></md-item-template><md-not-found><span translate=\"navbar.search.no_results\"></span></md-not-found></md-autocomplete></div>");
$templateCache.put("generated/components/navbar/search_result.html","<div class=\"search-result lmo-flex lmo-flex__space-between\"><div class=\"search-result-item\"><div class=\"search-result-title\">{{ result.title }}</div><div class=\"search-result-group-name\">{{ result.resultGroupName }}</div></div> <smart_time time=\"result.lastActivityAt\"></smart_time> </div>");
$templateCache.put("generated/components/auth/avatar/auth_avatar.html","<div class=\"auth-avatar\"><user_avatar user=\"avatarUser\" size=\"large\" class=\"auth-avatar__avatar\"></user_avatar></div>");
$templateCache.put("generated/components/auth/complete/auth_complete.html","<div class=\"auth-complete\"><auth_avatar user=\"user\"></auth_avatar><h2 translate=\"auth_form.check_your_email\" class=\"lmo-h2\"></h2><p ng-if=\"user.sentLoginLink\" translate=\"auth_form.login_link_sent\" translate-value-email=\"{{user.email}}\" class=\"lmo-hint-text\"></p><p ng-if=\"user.sentPasswordLink\" translate=\"auth_form.password_link_sent\" translate-value-email=\"{{user.email}}\" class=\"lmo-hint-text\"></p></div>");
$templateCache.put("generated/components/auth/email_form/auth_email_form.html","<div class=\"auth-email-form\"><md-input-container class=\"md-block auth-email-form__email\"><label translate=\"auth_form.email\"></label><input name=\"email\" type=\"email\" md-autofocus=\"true\" placeholder=\"{{ \'auth_form.email_placeholder\' | translate}}\" ng-model=\"email\" class=\"lmo-primary-form-input\" id=\"email\"><validation_errors subject=\"user\" field=\"email\"></validation_errors></md-input-container><div class=\"lmo-md-actions\"><div></div><md-button ng-click=\"submit()\" ng-disabled=\"!email\" translate=\"auth_form.sign_in\" aria-label=\"{{ \'auth_form.sign_in\' | translate }}\" class=\"md-primary md-raised auth-email-form__submit\"></md-button></div></div>");
$templateCache.put("generated/components/auth/form/auth_form.html","<div class=\"auth-form lmo-slide-animation\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><div ng-if=\"!loginComplete()\" class=\"auth-form__logging-in animated\"><div ng-if=\"!user.emailStatus\" class=\"auth-form__email-not-set animated\"><auth_provider_form user=\"user\"></auth_provider_form><auth_email_form user=\"user\"></auth_email_form></div><div ng-if=\"user.emailStatus\" class=\"auth-form__email-set animated\"><auth_identity_form ng-if=\"pendingProviderIdentity\" user=\"user\" identity=\"pendingProviderIdentity\" class=\"animated\"></auth_identity_form><div ng-if=\"!pendingProviderIdentity\" class=\"auth-form__no-pending-identity animated\"><auth_signin_form ng-if=\"user.emailStatus == \'active\'\" user=\"user\" class=\"animated\"></auth_signin_form><auth_signup_form ng-if=\"user.emailStatus == \'unused\'\" user=\"user\" class=\"animated\"></auth_signup_form><auth_inactive_form ng-if=\"user.emailStatus == \'inactive\'\" user=\"user\" class=\"animated\"></auth_inactive_form></div></div></div><auth_complete ng-if=\"loginComplete()\" user=\"user\" class=\"animated\"></auth_complete></div>");
$templateCache.put("generated/components/auth/identity_form/auth_identity_form.html","<div class=\"auth-identity-form\"><h2 translate=\"auth_form.hello\" translate-value-name=\"{{user.name || user.email}}\" class=\"lmo-h2\"></h2><auth_avatar user=\"user\"></auth_avatar><div class=\"auth-identity-form__options\"><div class=\"auth-identity-form__new-account\"><p translate=\"auth_form.new_to_loomio\" translate-values=\"{site_name: siteName}\" class=\"lmo-hint-text\"></p><md-button ng-click=\"createAccount()\" translate=\"auth_form.create_account\" class=\"md-primary md-raised\"></md-button></div><div class=\"auth-identity-form__existing-account\"><p translate=\"auth_form.already_a_user\" translate-values=\"{site_name: siteName}\" class=\"lmo-hint-text\"></p><md-input-container class=\"md-block auth-email-form__email\"><label translate=\"auth_form.email\"></label><input name=\"email\" type=\"text\" md-autofocus=\"true\" placeholder=\"{{ \'auth_form.email_placeholder\' | translate}}\" ng-model=\"email\" class=\"lmo-primary-form-input\" id=\"email\"><validation_errors subject=\"user\" field=\"email\"></validation_errors></md-input-container><md-button ng-click=\"submit()\" translate=\"auth_form.link_accounts\"></md-button></div></div></div>");
$templateCache.put("generated/components/auth/inactive_form/auth_inactive_form.html","<div class=\"auth-inactive-form\"><p translate=\"auth_form.account_inactive\" translate-value-email=\"{{user.email}}\" class=\"lmo-hint-text\"></p><md-button ng-click=\"contactUs()\" translate=\"contact_message_form.contact_us\" class=\"md-raised md-primary auth-inactive-form__submit\"></md-button></div>");
$templateCache.put("generated/components/auth/modal/auth_modal.html","<md-dialog class=\"auth-modal lmo-modal__narrow\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><i ng-if=\"!showBackButton()\" class=\"mdi mdi-lock-open\"></i><a ng-click=\"back()\" ng-if=\"showBackButton()\" class=\"auth-modal__back\"><i class=\"mdi mdi-keyboard-backspace\"></i></a><h1 translate=\"auth_form.sign_in_to_loomio\" translate-values=\"{site_name: siteName}\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button ng-if=\"!preventClose\"></material_modal_header_cancel_button><div ng-if=\"preventClose\"></div></div></md-toolbar><div class=\"md-dialog-content\"><auth_form user=\"user\"></auth_form></div></md-dialog>");
$templateCache.put("generated/components/auth/provider_form/auth_provider_form.html","<div class=\"auth-provider-form\"><div translate=\"auth_form.choose_an_account\" ng-if=\"providers.length &gt; 0\" class=\"lmo-hint-text\"></div><div layout=\"row\" class=\"auth-provider-form__providers lmo-flex\"><div ng-repeat=\"provider in providers\" class=\"auth-provider-form__provider\"><button type=\"button\" class=\"md-button md-raised {{provider.name}}\" ng-click=\"select(provider)\"> <span>{{provider.name}}</span> </button></div></div></div>");
$templateCache.put("generated/components/auth/signin_form/auth_signin_form.html","<div class=\"auth-signin-form\"><auth_avatar user=\"user\"></auth_avatar><md-input-container class=\"md-block auth-signin-form__magic-link\"><h2 translate=\"auth_form.welcome_back\" translate-value-name=\"{{user.firstName() || user.email}}\" class=\"lmo-h2 text-center\"></h2></md-input-container><div ng-if=\"user.hasToken\" class=\"auth-signin-form__token text-center\"><p translate=\"auth_form.login_with_token\" ng-if=\"!user.errors.token\" class=\"lmo-hint-text\"></p><validation_errors subject=\"user\" field=\"token\"></validation_errors><md-button ng-click=\"submit()\" ng-if=\"!user.errors.token\" class=\"md-primary md-raised auth-signin-form__submit\"><span translate=\"auth_form.sign_in_as\" translate-value-name=\"{{user.name || user.email}}\"></span></md-button><md-button ng-click=\"sendLoginLink()\" ng-if=\"user.errors.token\" class=\"md-primary md-raised auth-signin-form__submit\"><span translate=\"auth_form.login_link\"></span></md-button></div><div ng-if=\"!user.hasToken\" class=\"auth-signin-form__no-token\"><p class=\"lmo-hint-text\"> <span translate=\"auth_form.login_link_helptext\" ng-if=\"!user.hasPassword\"></span>  <span translate=\"auth_form.login_link_helptext_with_password\" ng-if=\"user.hasPassword\"></span> </p><div ng-if=\"user.hasPassword\" class=\"auth-signin-form__password\"><md-input-container class=\"md-block\"><label translate=\"auth_form.password\"></label><input name=\"password\" type=\"password\" md-autofocus=\"true\" ng-required=\"ng-required\" ng-model=\"user.password\" class=\"lmo-primary-form-input\" id=\"password\"><validation_errors subject=\"user\" field=\"password\"></validation_errors></md-input-container><div class=\"lmo-md-actions\"><md-button ng-click=\"sendLoginLink()\" ng-class=\"{\'md-primary\': !user.password}\" class=\"auth-signin-form__login-link\"><span translate=\"auth_form.login_link\"></span></md-button><md-button ng-click=\"submit()\" ng-disabled=\"!user.password\" ng-if=\"user.hasPassword\" class=\"md-primary md-raised auth-signin-form__submit\"><span translate=\"auth_form.sign_in\"></span></md-button></div></div><div ng-if=\"!user.hasPassword\" class=\"auth-signin-form__no-password\"><div class=\"lmo-md-actions\"><div></div><md-button ng-click=\"sendLoginLink()\" class=\"md-primary md-raised auth-signin-form__submit\"><span translate=\"auth_form.login_link\"></span></md-button></div></div></div></div>");
$templateCache.put("generated/components/auth/signup_form/auth_signup_form.html","<div ng-if=\"!allow()\" class=\"auth-signup-form\"><h2 translate=\"auth_form.invitation_required\" class=\"lmo-h2\"></h2></div><div ng-if=\"allow()\" class=\"auth-signup-form\"><div class=\"auth-signup-form__welcome\"><auth_avatar user=\"user\"></auth_avatar><h2 translate=\"auth_form.welcome\" translate-value-email=\"{{user.name || user.email}}\" class=\"lmo-h2\"></h2><p translate=\"auth_form.sign_up_helptext\" class=\"lmo-hint-text\"></p></div><md-input-container class=\"md-block auth-signup-form__name\"><label translate=\"auth_form.name\"></label><input type=\"text\" md-autofocus=\"true\" placeholder=\"{{auth_form.name_placeholder | translate}}\" ng-model=\"vars.name\" ng-required=\"true\" class=\"lmo-primary-form-input\"><validation_errors subject=\"user\" field=\"name\"></validation_errors></md-input-container><div vc-recaptcha=\"true\" key=\"recaptchaKey\" ng-if=\"recaptchaKey\" ng-model=\"user.recaptcha\"></div><div class=\"lmo-md-actions\"><div></div><md-button ng-click=\"submit()\" translate=\"auth_form.login_link\" aria-label=\"{{ \'auth_form.login_link\' | translate }}\" class=\"md-primary md-raised auth-signup-form__submit\"></md-button></div></div>");
$templateCache.put("generated/components/contact/form/contact_form.html","<div class=\"contact-form\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><p translate=\"contact_message_form.helptext\" class=\"lmo-hint-text contact-form__helptext\"></p><md-input-container ng-if=\"!isLoggedIn()\" class=\"md-block\"><label translate=\"contact_message_form.name_label\"></label><input type=\"text\" placeholder=\"{{\'contact_message_form.name_placeholder\' | translate}}\" ng-model=\"message.name\"><validation_errors subject=\"message\" field=\"name\"></validation_errors></md-input-container><md-input-container ng-if=\"!isLoggedIn()\" class=\"md-block\"><label translate=\"contact_message_form.email_label\"></label><input type=\"text\" placeholder=\"{{\'contact_message_form.email_placeholder\' | translate}}\" ng-model=\"message.email\"><validation_errors subject=\"message\" field=\"email\"></validation_errors></md-input-container><md-input-container class=\"md-block\"><label translate=\"contact_message_form.message_label\"></label><textarea ng-model=\"message.message\" placeholder=\"{{\'contact_message_form.message_placeholder\' | translate}}\"></textarea><validation_errors subject=\"message\" field=\"message\"></validation_errors></md-input-container><p translate=\"contact_message_form.contact_us_email\" class=\"lmo-hint-text\"></p><div class=\"lmo-md-actions\"><div></div><md-button ng-click=\"submit()\" translate=\"contact_message_form.send_message\" class=\"md-primary md-raised\"></md-button></div></div>");
$templateCache.put("generated/components/contact/modal/contact_modal.html","<md-dialog class=\"auth-modal\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><div></div><h1 translate=\"contact_message_form.contact_us\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content\"><contact_form></contact_form></div></md-dialog>");
$templateCache.put("generated/components/contact_request/form/contact_request_form.html","<div class=\"contact-user-form\"><div ng-if=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-input-container class=\"md-block\"><label translate=\"contact_request_form.message_placeholder\"></label><textarea ng-model=\"contactRequest.message\" md-maxlength=\"500\" class=\"contact-request-form__message lmo-primary-form-input\"></textarea><validation_errors subject=\"contactRequest\" field=\"message\"></validation_errors></md-input-container><div class=\"lmo-md-actions\"><p translate=\"contact_request_form.helptext\" translate-value-name=\"{{user.firstName()}}\" class=\"lmo-textarea__helptext lmo-flex__grow\"></p><md-button ng-click=\"submit()\" translate=\"common.action.send\" class=\"md-primary md-raised contact-request-form__submit\"></md-button></div></div>");
$templateCache.put("generated/components/contact_request/modal/contact_request_modal.html","<md-dialog class=\"contact-user-modal\"><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><div></div><h1 translate=\"contact_request_form.modal_title\" translate-value-name=\"{{user.name}}\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content\"><contact_request_form user=\"user\"></contact_request_form></div></md-dialog>");
$templateCache.put("generated/components/discussion/form/discussion_form.html","<div class=\"discussion-form\"><div translate=\"group_page.discussions_placeholder\" ng-show=\"discussion.isNew()\" class=\"lmo-hint-text\"></div><md-input-container ng-show=\"showGroupSelect\" class=\"md-block\"><label for=\"discussion-group-field\" translate=\"discussion_form.group_label\"></label><md-select ng-model=\"discussion.groupId\" placeholder=\"{{\'discussion_form.group_placeholder\' | translate}}\" ng-required=\"true\" ng-change=\"restoreRemoteDraft(); updatePrivacy()\" class=\"discussion-form__group-select\" id=\"discussion-group-field\"><md-option ng-value=\"group.id\" ng-repeat=\"group in availableGroups() | orderBy: \'fullName\' track by group.id\">{{group.fullName}}</md-option></md-select><div class=\"md-errors-spacer\"></div></md-input-container><div ng-if=\"discussion.groupId\" class=\"discussion-form__group-selected\"><md-input-container class=\"md-block\"><label for=\"discussion-title\" translate=\"discussion_form.title_label\"></label><div class=\"lmo-relative\"><input placeholder=\"{{ \'discussion_form.title_placeholder\' | translate }}\" ng-model=\"discussion.title\" ng-required=\"true\" maxlength=\"255\" class=\"discussion-form__title-input lmo-primary-form-input\" id=\"discussion-title\"></div><validation_errors subject=\"discussion\" field=\"title\"></validation_errors></md-input-container><lmo_textarea model=\"discussion\" field=\"description\" placeholder=\"\'discussion_form.context_placeholder\' | translate\" label=\"\'discussion_form.context_label\' | translate\"></lmo_textarea><md-list class=\"discussion-form__options\"><md-list-item ng-if=\"showPrivacyForm()\" class=\"discussion-form__privacy-form\"><md-radio-group ng-model=\"discussion.private\"><md-radio-button ng-model=\"discussion.private\" ng-value=\"false\" class=\"md-checkbox--with-summary discussion-form__public\"><discussion_privacy_icon discussion=\"discussion\" private=\"false\"></discussion_privacy_icon></md-radio-button><md-radio-button ng-model=\"discussion.private\" ng-value=\"true\" class=\"md-checkbox--with-summary discussion-form__private\"><discussion_privacy_icon discussion=\"discussion\" private=\"true\"></discussion_privacy_icon></md-radio-button></md-radio-group></md-list-item><md-list-item ng-if=\"!showPrivacyForm()\" class=\"discussion-form__privacy-notice\"><label layout=\"row\" class=\"discussion-form__privacy-notice lmo-flex\"><i ng-if=\"discussion.private\" class=\"mdi mdi-24px mdi-lock-outline lmo-margin-right\"></i><i ng-if=\"!discussion.private\" class=\"mdi mdi-24px mdi-earth lmo-margin-right\"></i><discussion_privacy_icon discussion=\"discussion\"></discussion_privacy_icon></label></md-list-item><md-list-item ng-if=\"discussion.isNew()\" class=\"discussion-form__announcement-size\"><md-checkbox ng-model=\"discussion.makeAnnouncement\" class=\"md-checkbox--with-summary discussion-form__make-announcement\"><div class=\"discussion-form__make-announcement-title\"> <strong translate=\"discussion_form.make_announcement\"></strong> </div><div translate=\"discussion_form.notified_count\" ng-if=\"discussion.makeAnnouncement\" translate-values=\"{count: discussion.group().announcementRecipientsCount}\" class=\"discussion-form__make-announcement-subtitle\"></div></md-checkbox></md-list-item></md-list><discussion_form_actions ng-if=\"!modal\" discussion=\"discussion\"></discussion_form_actions></div></div>");
$templateCache.put("generated/components/discussion/form_actions/discussion_form_actions.html","<div class=\"discussion-form-actions lmo-md-actions\"><outlet name=\"before-discussion-submit\" model=\"discussion\"></outlet><md-button ng-click=\"submit()\" ng-disabled=\"submitIsDisabled || !discussion.groupId\" translate=\"common.action.start\" ng-if=\"discussion.isNew()\" class=\"md-primary md-raised discussion-form__submit\"></md-button><md-button ng-click=\"submit()\" ng-disabled=\"submitIsDisabled\" translate=\"common.action.save\" ng-if=\"!discussion.isNew()\" class=\"md-primary md-raised discussion-form__update\"></md-button></div>");
$templateCache.put("generated/components/discussion/modal/discussion_modal.html","<md-dialog class=\"lmo-modal__narrow\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-toolbar><div class=\"md-toolbar-tools lmo-flex lmo-flex__space-between\"><i class=\"mdi mdi-forum\"></i><h1 translate=\"discussion_form.new_discussion_title\" ng-if=\"discussion.isNew()\" class=\"lmo-h1 modal-title\"></h1><h1 translate=\"discussion_form.edit_discussion_title\" ng-if=\"!discussion.isNew()\" class=\"lmo-h1 modal-title\"></h1><material_modal_header_cancel_button aria-hidden=\"true\"></material_modal_header_cancel_button></div></md-toolbar><md-dialog-content class=\"md-body-1\"><discussion_form discussion=\"discussion\" modal=\"true\"></discussion_form><dialog_scroll_indicator></dialog_scroll_indicator></md-dialog-content><md-dialog-actions><discussion_form_actions discussion=\"discussion\"></discussion_form_actions></md-dialog-actions></md-dialog>");
$templateCache.put("generated/components/discussion/privacy_icon/discussion_privacy_icon.html","<span class=\"discussion-privacy-icon\"><div class=\"discussion-privacy-icon__title\"><strong translate=\"common.privacy.{{translateKey()}}\"></strong></div><div ng-bind-html=\"privacyDescription()\" class=\"discussion-privacy-icon__subtitle\"></div></span>");
$templateCache.put("generated/components/group/form/group_form.html","<div class=\"group-form\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-input-container class=\"md-block\"><label translate=\"{{titleLabel()}}\"></label><input type=\"text\" placeholder=\"{{\'group_form.group_name_placeholder\' | translate}}\" ng-required=\"ng-required\" ng-model=\"group.name\" md-maxlength=\"255\" class=\"lmo-primary-form-input\" id=\"group-name\"><validation_errors subject=\"group\" field=\"name\"></validation_errors></md-input-container><lmo_textarea model=\"group\" field=\"description\" placeholder=\"\'group_form.description_placeholder\' | translate\" label=\"\'group_form.description\' | translate\"></lmo_textarea><div class=\"group-form__privacy-statement lmo-hint-text\">{{privacyStatement()}}</div><section class=\"group-form__section group-form__privacy\"><h3 translate=\"group_form.privacy\" class=\"lmo-h3\"></h3><md-radio-group ng-model=\"group.groupPrivacy\"><md-radio-button ng-repeat=\"privacy in privacyOptions()\" class=\"md-checkbox--with-summary group-form__privacy-{{privacy}}\" ng-value=\"privacy\" aria-label=\"{{privacy}}\"><div class=\"group-form__privacy-title\"><strong translate=\"common.privacy.{{privacy}}\"></strong></div><div class=\"group-form__privacy-subtitle\">{{ privacyStringFor(privacy) }}</div></md-radio-button></md-radio-group></section><div ng-show=\"group.expanded\" class=\"group-form__advanced\"><section ng-if=\"group.privacyIsOpen()\" class=\"group-form__section group-form__joining lmo-form-group\"><h3 translate=\"group_form.how_do_people_join\" class=\"lmo-h3\"></h3><md-radio-group ng-model=\"group.membershipGrantedUpon\"><md-radio-button ng-repeat=\"granted in [\'request\', \'approval\']\" class=\"group-form__membership-granted-upon-{{granted}}\" ng-value=\"granted\"><span translate=\"group_form.membership_granted_upon_{{granted}}\"></span></md-radio-button></md-radio-group></section><section class=\"group-form__section group-form__permissions\"><h3 translate=\"group_form.permissions\" class=\"lmo-h3\"></h3><group_setting_checkbox group=\"group\" setting=\"allowPublicThreads\" ng-if=\"group.privacyIsClosed() &amp;&amp; !group.isSubgroupOfSecretParent()\" class=\"group-form__allow-public-threads\"></group_setting_checkbox><group_setting_checkbox group=\"group\" setting=\"parentMembersCanSeeDiscussions\" translate-values=\"{parent: group.parent().name}\" ng-if=\"group.isSubgroup() &amp;&amp; group.privacyIsClosed()\" class=\"group-form__parent-members-can-see-discussions\"></group_setting_checkbox><group_setting_checkbox group=\"group\" setting=\"membersCanAddMembers\" class=\"group-form__members-can-add-members\"></group_setting_checkbox><group_setting_checkbox group=\"group\" setting=\"membersCanCreateSubgroups\" class=\"group-form__members-can-create-subgroups\"></group_setting_checkbox><group_setting_checkbox group=\"group\" setting=\"membersCanStartDiscussions\" class=\"group-form__members-can-start-discussions\"></group_setting_checkbox><group_setting_checkbox group=\"group\" setting=\"membersCanEditDiscussions\" class=\"group-form__members-can-edit-discussions\"></group_setting_checkbox><group_setting_checkbox group=\"group\" setting=\"membersCanEditComments\" class=\"group-form__members-can-edit-comments\"></group_setting_checkbox><group_setting_checkbox group=\"group\" setting=\"membersCanRaiseMotions\" class=\"group-form__members-can-raise-motions\"></group_setting_checkbox><group_setting_checkbox group=\"group\" setting=\"membersCanVote\" class=\"group-form__members-can-vote\"></group_setting_checkbox></section><section ng-if=\"showGroupFeatures()\" class=\"group-form__section group-form__features\"><h3 translate=\"group_form.features\" class=\"lmo-h3\"></h3><div ng-repeat=\"name in featureNames\" class=\"group-form__feature\"><md-checkbox id=\"{{name}}\" ng-model=\"group.features[name]\" class=\"md-checkbox--with-summary\"><span for=\"{{name}}\" translate=\"group_features.{{name}}\"></span></md-checkbox></div></section></div><group_form_actions group=\"group\" ng-if=\"!modal\"></group_form_actions></div>");
$templateCache.put("generated/components/group/form_actions/group_form_actions.html","<div class=\"lmo-md-actions\"><div ng-if=\"group.expanded\"></div><md-button type=\"button\" ng-if=\"!group.expanded\" ng-click=\"expandForm()\" translate=\"group_form.advanced_settings\" class=\"md-accent group-form__advanced-link\"></md-button><md-button ng-click=\"submit()\" class=\"md-primary md-raised group-form__submit-button\"><span ng-if=\"group.isNew() &amp;&amp; group.isParent()\" translate=\"group_form.submit_start_group\"></span><span ng-if=\"group.isNew() &amp;&amp; !group.isParent()\" translate=\"group_form.submit_start_subgroup\"></span><span ng-if=\"!group.isNew()\" translate=\"common.action.update_settings\"></span></md-button></div>");
$templateCache.put("generated/components/group/modal/group_modal.html","<md-dialog class=\"group-modal lmo-modal__narrow\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><i class=\"mdi mdi-account-multiple\"></i><div ng-switch=\"currentStep\" class=\"group-form__title\"><div ng-switch-when=\"create\" class=\"group-form__group-title\"><h1 ng-if=\"group.isNew() &amp;&amp; group.parentId\" translate=\"group_form.start_subgroup_heading\" class=\"lmo-h1\"></h1><h1 ng-if=\"group.isNew() &amp;&amp; !group.parentId\" translate=\"group_form.start_group_heading\" class=\"lmo-h1\"></h1><h1 ng-if=\"!group.isNew()\" translate=\"group_form.edit_group_heading\" class=\"lmo-h1\"></h1></div><div ng-switch-when=\"invite\" class=\"group-form__invitation-title\"><h1 translate=\"invitation_form.invite_people\" class=\"lmo-h1\"></h1></div></div><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><md-dialog-content ng-switch=\"currentStep\" class=\"md-body-1 lmo-slide-animation\"><group_form ng-switch-when=\"create\" group=\"group\" modal=\"true\" class=\"animated\"></group_form><invitation_form ng-switch-when=\"invite\" invitation-form=\"invitationForm\" class=\"animated\"></invitation_form><dialog_scroll_indicator></dialog_scroll_indicator></md-dialog-content><md-dialog-actions ng-switch=\"currentStep\"><group_form_actions ng-switch-when=\"create\" group=\"group\"></group_form_actions><invitation_form_actions ng-switch-when=\"invite\" invitation-form=\"invitationForm\"></invitation_form_actions></md-dialog-actions></md-dialog>");
$templateCache.put("generated/components/group/setting_checkbox/group_setting_checkbox.html","<div class=\"group-setting-checkbox\"><md-checkbox ng-model=\"group[setting]\"><span translate=\"{{translateKey()}}\" translate-values=\"translateValues\"></span></md-checkbox></div>");
$templateCache.put("generated/components/group_page/cover_photo_form/cover_photo_form.html","<div class=\"cover-photo-form\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><div></div><h1 translate=\"cover_photo_form.heading\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content md-body-1\"><md-button ng-click=\"selectFile()\" class=\"lmo-flex\"><div class=\"user-avatar lmo-box--small lmo-margin-right\"><div class=\"user-avatar__initials--small\"><i class=\"mdi mdi-camera mdi-24px\"></i></div></div><span translate=\"cover_photo_form.upload_link\"></span></md-button><input type=\"file\" ng-model=\"files\" ng-file-select=\"upload(files)\" class=\"hidden cover-photo-form__file-input\"><p translate=\"cover_photo_form.image_size_helptext\" class=\"lmo-hint-text\"></p></div></div>");
$templateCache.put("generated/components/group_page/description_card/description_card.html","<section aria-labelledby=\"description-card-title\" class=\"description-card lmo-card\"><h2 translate=\"description_card.title\" class=\"lmo-card-heading\" id=\"description-card-title\"></h2><div ng-if=\"!editorEnabled\"><div translate=\"description_card.placeholder\" ng-if=\"!group.description\" class=\"description-card__placeholder lmo-hint-text\"></div><div marked=\"group.description\" class=\"description-card__text lmo-markdown-wrapper\"></div><document_list model=\"group\" placeholder=\"document.list.no_group_documents\"></document_list><div class=\"lmo-md-action\"><action_dock model=\"group\" actions=\"actions\"></action_dock></div></div><md-input-container ng-if=\"editorEnabled\" class=\"md-block\"><textarea ng-model=\"buh.editableDescription\" ng-model-options=\"{debounce: 150}\" class=\"lmo-textarea description-card__textarea lmo-primary-form-input\"></textarea><div class=\"lmo-md-actions\"><md-button ng-click=\"disableEditor()\" translate=\"common.action.cancel\" class=\"md-button--no-h-margin description-card__cancel\"></md-button><md-button ng-click=\"save()\" translate=\"common.action.save\" class=\"md-button--no-h-margin md-primary md-raised description-card__save\"></md-button></div></md-input-container></section>");
$templateCache.put("generated/components/group_page/discussions_card/discussions_card.html","<section aria-labelledby=\"threads-card-title\" class=\"discussions-card lmo-card--no-padding\"><div class=\"discussions-card__header\"><h3 ng-if=\"!searchOpen\" class=\"discussions-card__title lmo-card-heading\" id=\"threads-card-title\"><span ng-if=\"filter == \'show_opened\'\" translate=\"group_page.open_discussions\"></span><span ng-if=\"filter == \'show_closed\'\" translate=\"group_page.closed_discussions\"></span></h3><md-input-container ng-class=\"{\'discussions-card__search--open\': searchOpen}\" md-no-float=\"true\" class=\"discussions-card__search md-block md-no-errors\"><i ng-click=\"closeSearch()\" ng-if=\"searchOpen\" class=\"mdi mdi-close md-button--tiny lmo-pointer\"></i><input ng-model=\"fragment\" placeholder=\"{{\'group_page.search_threads\' | translate}}\" ng-change=\"searchThreads()\" ng-model-options=\"{debounce: 250}\"></md-input-container><md-button ng-if=\"!searchOpen\" ng-click=\"openSearch()\" class=\"md-button--tiny\"><i class=\"mdi mdi-magnify\"></i></md-button><div class=\"lmo-flex__grow\"></div><div ng-if=\"!searchOpen &amp;&amp; filter == \'show_closed\'\" ng-click=\"init(\'show_opened\')\" translate=\"group_page.show_opened\" translate-value-count=\"{{group.openDiscussionsCount}}\" class=\"discussions-card__filter discussions-card__filter--open lmo-link lmo-pointer\"></div><div ng-if=\"!searchOpen &amp;&amp; filter == \'show_opened\' &amp;&amp; group.closedDiscussionsCount &gt; 0\" ng-click=\"init(\'show_closed\')\" translate=\"group_page.show_closed\" translate-value-count=\"{{group.closedDiscussionsCount}}\" class=\"discussions-card__filter discussions-card__filter--closed lmo-link lmo-pointer\"></div><md-button ng-if=\"canStartThread()\" ng_click=\"openDiscussionModal()\" title=\"{{ \'navbar.start_thread\' | translate }}\" class=\"md-primary md-raised discussions-card__new-thread-button\"><span translate=\"navbar.start_thread\"></span></md-button></div><loading ng-show=\"loading()\"></loading><div ng-if=\"!loading()\" class=\"discussions-card__content\"><div ng-if=\"isEmpty()\" class=\"discussions-card__list--empty\"><p translate=\"group_page.no_threads_here\" class=\"lmo-hint-text\"></p><p ng-if=\"!canViewPrivateContent()\" translate=\"group_page.private_threads\" class=\"lmo-hint-text\"></p></div><div ng-if=\"!fragment\" class=\"discussions-card__list\"><section ng-if=\"discussions.any() || pinned.any()\" class=\"thread-preview-collection__container\"><thread_preview_collection ng-if=\"pinned.any()\" query=\"pinned\" limit=\"loader.numLoaded\" class=\"thread-previews-container--pinned\"></thread_preview_collection><thread_preview_collection ng-if=\"discussions.any()\" query=\"discussions\" limit=\"loader.numLoaded\" class=\"thread-previews-container--unpinned\"></thread_preview_collection></section><div ng-if=\"!loader.exhausted &amp;&amp; !loader.loadingMore\" class=\"lmo-show-more\"><button ng-hide=\"loading()\" ng-click=\"loader.loadMore()\" translate=\"common.action.show_more\" class=\"discussions-card__show-more\"></button></div><div translate=\"group_page.no_more_threads\" ng-if=\"loader.exhausted\" class=\"lmo-hint-text discussions-card__no-more-threads\"></div><loading ng-if=\"loader.loadingMore\"></loading></div><div ng-if=\"fragment\" class=\"discussions-card__list\"><section ng-if=\"searched.any()\" class=\"thread-preview-collection__container\"><thread_preview_collection query=\"searched\" class=\"thread-previews-container--searched\"></thread_preview_collection></section></div></div></section>");
$templateCache.put("generated/components/group_page/group_actions_dropdown/group_actions_dropdown.html","<div class=\"group-page-actions lmo-no-print\"><md-menu md-position-mode=\"target-right target\" class=\"lmo-dropdown-menu\"><md-button ng-click=\"$mdMenu.open()\" class=\"group-page-actions__button\"> <span translate=\"group_page.options.label\"></span> <i class=\"mdi mdi-chevron-down\"></i></md-button><md-menu-content class=\"group-actions-dropdown__menu-content\"><md-menu-item ng-if=\"canEditGroup()\" class=\"group-page-actions__edit-group-link\"><md-button ng-click=\"editGroup()\"><span translate=\"group_page.options.edit_group\"></span></md-button></md-menu-item><md-menu-item ng-if=\"canAdministerGroup()\"><a lmo-href-for=\"group\" lmo-href-action=\"memberships\" class=\"md-button\"><span translate=\"group_page.options.manage_members\"></span></a></md-menu-item><md-menu-item ng-if=\"canChangeVolume()\" class=\"group-page-actions__change-volume-link\"><md-button ng-click=\"openChangeVolumeForm()\"><span translate=\"group_page.options.email_settings\"></span></md-button></md-menu-item><outlet name=\"after-group-actions-manage-memberships\" model=\"group\"></outlet><outlet name=\"after-group-actions-manage-memberships-2\" model=\"group\"></outlet><md-menu-item ng-if=\"canLeaveGroup()\" class=\"group-page-actions__leave-group\"><md-button ng-click=\"leaveGroup()\"><span translate=\"group_page.options.leave_group\"></span></md-button></md-menu-item><md-menu-item ng-if=\"canArchiveGroup()\" class=\"group-page-actions__archive-group\"><md-button ng-click=\"archiveGroup()\"><span translate=\"group_page.options.deactivate_group\"></span></md-button></md-menu-item></md-menu-content></md-menu></div>");
$templateCache.put("generated/components/group_page/group_privacy_button/group_privacy_button.html","<button aria-label=\"{{privacyDescription()}}\" class=\"group-privacy-button md-button\"><md-tooltip class=\"group-privacy-button__tooltip\">{{privacyDescription()}}</md-tooltip><div translate=\"group_page.privacy.aria_label\" translate-value-privacy=\"{{group.groupPrivacy}}\" class=\"sr-only\"></div><div aria-hidden=\"true\" class=\"screen-only lmo-flex lmo-flex__center\"><i class=\"mdi {{iconClass()}}\"></i><span translate=\"common.privacy.{{group.groupPrivacy}}\"></span></div></button>");
$templateCache.put("generated/components/group_page/group_theme/group_theme.html","<div class=\"group-theme\"><div class=\"group-theme__cover lmo-no-print\"><div ng-if=\"canUploadPhotos()\" class=\"group-theme__upload-photo\"><button ng-click=\"openUploadCoverForm()\" title=\"{{ \'group_page.new_cover_photo\' | translate }}\" class=\"lmo-flex lmo-flex__center\"><i class=\"mdi mdi-camera mdi-24px\"></i><span translate=\"group_page.new_photo\" class=\"group-theme__upload-help-text\"></span></button></div></div><div ng-if=\"compact\" class=\"group-theme__header--compact\"><div aria-hidden=\"true\" class=\"group-theme__logo--compact\"><a lmo-href-for=\"group\"><img ng-src=\"{{group.logoUrl()}}\"></a></div><div aria-label=\"breadcrumb\" role=\"navigation\" class=\"group-theme__name--compact\"> <a ng-if=\"group.isSubgroup()\" lmo-href-for=\"group.parent()\" aria-level=\"1\">{{group.parentName()}}</a>  <span ng-if=\"group.isSubgroup()\">-</span>  <a lmo-href-for=\"group\" aria-level=\"2\">{{group.name}}</a>  <span ng-if=\"discussion\">-</span> <a ng-if=\"discussion\" lmo-href-for=\"discussion\" aria-level=\"3\">{{discussion.title}}</a></div></div><div ng-if=\"!compact\" class=\"group-theme__header\"><div ng-style=\"logoStyle()\" alt=\"{{ \'group_page.group_logo\' | translate }}\" class=\"group-theme__logo\"><div ng-if=\"canUploadPhotos()\" class=\"group-theme__upload-photo\"><button ng-click=\"openUploadLogoForm()\" title=\"{{ \'group_page.new_group_logo\' | translate }}\" class=\"lmo-flex lmo-flex__center\"><i class=\"mdi mdi-camera mdi-24px\"></i><span translate=\"group_page.new_photo\" class=\"group-theme__upload-help-text\"></span></button></div></div><div class=\"group-theme__name-and-actions\"><h1 aria-label=\"breadcrumb\" role=\"navigation\" class=\"lmo-h1 group-theme__name\"><a ng-if=\"group.isSubgroup()\" lmo-href-for=\"group.parent()\" aria-level=\"1\">{{group.parentName()}}</a> <span ng-if=\"group.isSubgroup()\">-</span> <a lmo-href-for=\"group\" aria-level=\"2\">{{group.name}}</a></h1><div ng-if=\"homePage\" class=\"group-theme__actions\"><join_group_button group=\"group\"></join_group_button><outlet name=\"group-theme-actions\" model=\"group\"></outlet><div ng-if=\"canPerformActions()\" class=\"group-theme__member-actions\"><outlet name=\"group-theme-member-actions\" model=\"group\"></outlet><group_privacy_button group=\"group\"></group_privacy_button><group_actions_dropdown group=\"group\"></group_actions_dropdown></div></div></div></div></div>");
$templateCache.put("generated/components/group_page/join_group_button/join_group_button.html","<div class=\"blank\"><div ng-if=\"!isMember()\" class=\"join-group-button\"><div ng-if=\"canJoinGroup()\" class=\"blank\"><md-button ng-class=\"{\'btn-block\': block}\" translate=\"join_group_button.join_group\" ng-click=\"joinGroup()\" class=\"md-raised md-primary join-group-button__join-group\"></md-button></div><div ng-if=\"canRequestMembership()\" class=\"blank\"><md-button ng-class=\"{\'btn-block\': block}\" ng-disabled=\"hasRequestedMembership()\" translate=\"join_group_button.join_group\" ng-click=\"requestToJoinGroup()\" class=\"md-raised md-primary join-group-button__ask-to-join-group\"></md-button></div></div></div>");
$templateCache.put("generated/components/group_page/logo_photo_form/logo_photo_form.html","<div class=\"logo-photo-form\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><div></div><h1 translate=\"logo_photo_form.heading\" class=\"lmo-h1 modal-title\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content md-body-1\"><md-button ng-click=\"selectFile()\" class=\"lmo-flex\"><div class=\"user-avatar lmo-box--small lmo-margin-right\"><div class=\"user-avatar__initials--small\"><i class=\"mdi mdi-camera mdi-24px\"></i></div></div><span translate=\"logo_photo_form.upload_link\"></span></md-button><input type=\"file\" ng-model=\"files\" ng-file-select=\"upload(files)\" class=\"hidden logo-photo-form__file-input\"><p translate=\"logo_photo_form.image_size_helptext\" class=\"lmo-hint-text\"></p></div></div>");
$templateCache.put("generated/components/group_page/members_card/members_card.html","<section aria-labelledby=\"members-card-title\" ng-if=\"canViewMemberships()\" class=\"members-card lmo-no-print\"><h2 translate=\"group_page.members\" class=\"lmo-card-heading\" id=\"members-card-title\"></h2><div class=\"members-card__list\"><div ng-if=\"group.memberships().length &gt; 0\" ng-repeat=\"membership in group.memberships() | orderBy: \'-admin\' | limitTo:10\" class=\"members-card__avatar\"><a lmo-href-for=\"membership.user()\" class=\"members-card__avatar-link\"><user_avatar user=\"membership.user()\" coordinator=\"membership.admin\" size=\"medium\"></user_avatar></a></div><div translate=\"group_page.members_placeholder\" ng-if=\"showMembersPlaceholder()\" class=\"lmo-placeholder\"></div></div><div class=\"lmo-md-actions\"><a lmo-href-for=\"group\" lmo-href-action=\"memberships\" class=\"members-card__manage-members\"> <span translate=\"group_page.see_all_members\" translate-value-count=\"{{group.membershipsCount}}\"></span> <span ng-if=\"group.pendingInvitationsCount\" translate=\"group_page.pending_invitations\" translate-value-count=\"{{group.pendingInvitationsCount}}\"></span></a><div ng-if=\"canAddMembers()\" class=\"members-card__invite-members\"><md-button ng_click=\"invitePeople()\" class=\"md-primary md-raised members-card__invite-members-btn\"><span translate=\"group_page.invite_people\"></span></md-button></div></div></section>");
$templateCache.put("generated/components/group_page/membership_request_form/membership_request_form.html","<md-dialog class=\"membership-request-form\"><form ng-submit=\"submit()\" ng-disabled=\"membership_request.processing\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"membership_request_form.heading\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content\"><md-input-container class=\"md-block\"><label for=\"membership-request-name\" translate=\"membership_request_form.name_label\"></label><input ng-model=\"membershipRequest.name\" ng-required=\"true\" ng-disabled=\"isLoggedIn()\" class=\"membership-request-form__name\" id=\"membership-request-name\"></md-input-container><md-input-container class=\"md-block\"><label for=\"membership-request-email\" translate=\"membership_request_form.email_label\"></label><input ng-model=\"membershipRequest.email\" ng-required=\"true\" ng-disabled=\"isLoggedIn()\" class=\"membership-request-form__email\" id=\"membership-request-email\"><validation_errors subject=\"membershipRequest\" field=\"email\"></validation_errors></md-input-container><md-input-container class=\"md-block\"><label for=\"membership-request-introduction\" translate=\"membership_request_form.introduction_label\"></label><textarea ng-model=\"membershipRequest.introduction\" ng-required=\"false\" class=\"lmo-textarea membership-request-form__introduction\" id=\"membership-request-introduction\"></textarea> <div ng-class=\"{ overlimit: membershipRequest.overCharLimit() }\" class=\"membership-request-form__chars-left\"></div> {{ membershipRequest.charsLeft() }}<div ng-if=\"membershipRequest.overCharLimit()\" translate=\"membership_request_form.introduction_over_limit\" class=\"membership-request-form__over-limit lmo-validation-error\"></div></md-input-container><div class=\"lmo-md-actions\"><md-button ng-click=\"$close()\" type=\"button\" translate=\"common.action.cancel\" class=\"membership-request-form__cancel-btn\"></md-button><md-button type=\"submit\" translate=\"membership_request_form.submit_button\" class=\"md-raised md-primary membership-request-form__submit-btn\"></md-button></div></div></form></md-dialog>");
$templateCache.put("generated/components/group_page/membership_requests_card/membership_requests_card.html","<div class=\"blank\"><section ng-if=\"canManageMembershipRequests() &amp;&amp; group.hasPendingMembershipRequests()\" class=\"membership-requests-card\"><h2 translate=\"membership_requests_card.heading\" class=\"lmo-card-heading\"></h2><md-list><md-list-item ng-repeat=\"request in group.pendingMembershipRequests() | orderBy: \'-createdAt\' | limitTo: 5 track by request.id\" class=\"membership-requests-card__request\"><a layout=\"row\" lmo-href-for=\"group\" lmo-href-action=\"membership_requests\" title=\"{{ \'membership_requests_card.manage_requests\' | translate }}\" class=\"md-button membership-requests-card__request-link lmo-flex\"><user_avatar user=\"request.actor()\" size=\"medium\" class=\"lmo-margin-right\"></user_avatar><div layout=\"column\" class=\"lmo-flex\"><div class=\"lmo-truncate membership-requests-card__requestor-name\">{{request.actor().name || request.actor().email}}</div><div class=\"lmo-truncate membership-requests-card__requestor-introduction\">{{request.introduction}}</div></div></a></md-list-item></md-list><a lmo-href-for=\"group\" lmo-href-action=\"membership_requests\" class=\"membership-requests-card__link lmo-card-minor-action\"><span translate=\"membership_requests_card.manage_requests_with_count\" translate-value-count=\"{{group.pendingMembershipRequests().length}}\"></span></a></section></div>");
$templateCache.put("generated/components/group_page/subgroups_card/subgroups_card.html","<div class=\"blank\"><section aria-labelledby=\"subgroups-card__title\" ng-if=\"show()\" class=\"subgroups-card\"><h2 translate=\"group_page.subgroups\" class=\"lmo-card-heading\" id=\"subgroups-card__title\"></h2><p translate=\"group_page.subgroups_placeholder\" ng-if=\"group.subgroups().length == 0\" class=\"lmo-hint-text\"></p><ul class=\"subgroups-card__list\"><li ng-repeat=\"subgroup in group.subgroups() | orderBy: \'name\' track by subgroup.id\" class=\"subgroups-card__list-item\"><div class=\"subgroups-card__list-item-logo\"><group_avatar group=\"subgroup\" size=\"medium\"></group_avatar></div><div class=\"subgroups-card__list-item-name\"><a lmo-href-for=\"subgroup\">{{ subgroup.name }}</a></div><div class=\"subgroups-card__list-item-description\">{{ subgroup.description | truncate }}</div></li></ul><div class=\"lmo-flex lmo-flex__space-between\"></div><div class=\"lmo-md-actions\"><outlet name=\"subgroup-card-footer\"></outlet><md-button ng-click=\"startSubgroup()\" ng-if=\"canCreateSubgroups()\" class=\"md-primary md-raised subgroups-card__start\"><span translate=\"common.action.add_subgroup\"></span></md-button></div></section></div>");
$templateCache.put("generated/components/install_slack/card/install_slack_card.html","<div ng-if=\"show()\" class=\"install-slack-card lmo-card\"><h2 ng-if=\"groupIdentity()\" translate=\"install_slack.card.installed_title\" class=\"lmo-card-heading\"></h2><h2 ng-if=\"!groupIdentity()\" translate=\"install_slack.card.install_title\" class=\"lmo-card-heading\"></h2><div class=\"lmo-flex\"><img src=\"/img/slack-icon-color.svg\" class=\"install-slack-card__logo\"><div ng-if=\"groupIdentity()\"><p translate=\"install_slack.card.installed_helptext\" translate-value-channel=\"{{groupIdentity().slackChannelName()}}\" translate-value-team=\"{{groupIdentity().slackTeamName()}}\" class=\"install-slack-card__helptext lmo-hint-text\"></p><a ng-if=\"canRemoveIdentity()\" ng-click=\"remove()\" translate=\"install_slack.card.remove_identity\" class=\"lmo-pointer\"></a></div><p ng-if=\"!groupIdentity()\" translate=\"install_slack.card.install_helptext\" class=\"install-slack-card__helptext lmo-hint-text\"></p></div><div class=\"lmo-md-actions\"><outlet name=\"install-slack-card-footer\"></outlet><md-button translate=\"install_slack.card.install_slack\" ng-click=\"install()\" ng-if=\"!groupIdentity()\" class=\"md-primary md-raised\"></md-button></div></div>");
$templateCache.put("generated/components/install_slack/decide_form/install_slack_decide_form.html","<div class=\"install-slack-decide-form\"><h2 translate=\"install_slack.decide.heading\" class=\"lmo-h2\"></h2><p translate=\"install_slack.decide.helptext\" ng-if=\"!poll.pollType\" class=\"lmo-hint-text\"></p><div ng-switch=\"currentStep\" class=\"poll-common-start-poll\"><poll_common_choose_type ng-switch-when=\"choose\" poll=\"poll\" class=\"animated\"></poll_common_choose_type><poll_common_directive ng-switch-when=\"save\" poll=\"poll\" name=\"form\" class=\"animated\"></poll_common_directive><poll_common_form_actions ng-switch-when=\"save\" poll=\"poll\" class=\"animated\"></poll_common_form_actions><poll_common_share_form ng-switch-when=\"share\" poll=\"poll\" class=\"animated\"></poll_common_share_form></div><div class=\"lmo-flex install-slack-form__actions\"><md-button ng-if=\"!poll.pollType\" ng-click=\"$emit(\'$close\')\" translate=\"install_slack.common.do_it_later\"></md-button></div></div>");
$templateCache.put("generated/components/install_slack/form/install_slack_form.html","<div class=\"install-slack-form\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><install_slack_progress slack-progress=\"progress()\"></install_slack_progress><div ng-switch=\"currentStep\" class=\"install-slack-form__form lmo-slide-animation\"><install_slack_install_form group=\"group\" ng-switch-when=\"install\"></install_slack_install_form><install_slack_invite_form group=\"group\" ng-switch-when=\"invite\" class=\"animated\"></install_slack_invite_form><install_slack_decide_form group=\"group\" ng-switch-when=\"decide\" class=\"animated\"></install_slack_decide_form></div></div>");
$templateCache.put("generated/components/install_slack/install_form/install_slack_install_form.html","<div class=\"install-slack-install-form\"><h2 translate=\"install_slack.install.heading\" class=\"lmo-h2\"></h2><div ng-if=\"group.id\" class=\"install-slack-install-form__add-to-group\"><p translate=\"install_slack.install.add_to_group_helptext\" class=\"lmo-hint-text\"></p><md-select md-autofocus=\"true\" ng-model=\"group\" ng-change=\"setSubmit(group)\" aria-label=\"{{ \'install_slack.install.group_id\' | translate }}\"><md-option ng-repeat=\"g in groups() | orderBy:\'fullName\'\" ng-value=\"g\">{{ g.fullName }}</md-option></md-select><div layout=\"column\" class=\"lmo-flex install-slack-form__actions\"><md-button translate=\"install_slack.install.install_slack\" ng-click=\"submit()\" class=\"md-primary md-raised\"></md-button><md-button translate=\"install_slack.install.start_new_group\" ng-click=\"toggleExistingGroup()\"></md-button></div></div><div ng-if=\"!group.id\" class=\"install-slack-install-form__create-new-group\"><p translate=\"install_slack.install.create_new_group_helptext\" class=\"lmo-hint-text\"></p><md-input-container class=\"md-block install-slack-install-form__group\"><label translate=\"install_slack.install.group_name\"></label><input md-autofocus=\"true\" type=\"text\" placeholder=\"{{ \'install_slack.install.group_name_placeholder\' | translate }}\" ng-model=\"group.name\" class=\"lmo-primary-form-input\"></md-input-container><div layout=\"column\" class=\"lmo-flex install-slack-form__actions\"><md-button translate=\"install_slack.install.install_slack\" ng-click=\"submit()\" class=\"md-primary md-raised install-slack-install-form__submit\"></md-button><md-button ng-if=\"groups().length\" translate=\"install_slack.install.use_existing_group\" ng-click=\"toggleExistingGroup()\"></md-button></div></div></div>");
$templateCache.put("generated/components/install_slack/invite_form/install_slack_invite_form.html","<div class=\"install-slack-invite-form\"><h2 translate=\"install_slack.invite.heading\" class=\"lmo-h2\"></h2><p translate=\"install_slack.invite.helptext\" class=\"lmo-hint-text\"></p><md-select md-autofocus=\"true\" ng-model=\"groupIdentity.customFields.slack_channel_id\" placeholder=\"{{\'install_slack.invite.select_a_channel\' | translate}}\" md-on-open=\"fetchChannels()\"><md-option ng-value=\"channel.id\" ng-repeat=\"channel in channels\"><span>&#35;{{ channel.name }}</span></md-option></md-select><div class=\"md-list-item-text lmo-flex lmo-flex__space-between\"><div class=\"poll-common-checkbox-option__text\"><h3 translate=\"install_slack.invite.publish_group\" class=\"lmo-h3\"></h3><p translate=\"install_slack.invite.publish_group_helptext_on\" ng-if=\"groupIdentity.makeAnnouncement\" class=\"md-caption\"></p><p translate=\"install_slack.invite.publish_group_helptext_off\" ng-if=\"!groupIdentity.makeAnnouncement\" class=\"md-caption\"></p></div><md-checkbox ng-model=\"groupIdentity.makeAnnouncement\"></md-checkbox></div><div layout=\"column\" class=\"lmo-flex install-slack-form__actions\"><md-button ng-disabled=\"!groupIdentity.customFields.slack_channel_id\" translate=\"install_slack.invite.set_channel\" ng-click=\"submit()\" class=\"md-primary md-raised\"></md-button></div></div>");
$templateCache.put("generated/components/install_slack/invite_preview/install_slack_invite_preview.html","<div layout=\"row\" class=\"install-slack-invite-preview lmo-flex\"><div class=\"install-slack-invite-preview__avatar\"><img ng-src=\"https://s3-us-west-2.amazonaws.com/slack-files2/bot_icons/2017-03-29/161925077303_48.png\"></div><div class=\"install-slack-invite-preview__content\"><div class=\"install-slack-invite-preview__title\"> <strong class=\"install-slack-invite-preview__loomio-bot\">Loomio Bot</strong>  <span class=\"install-slack-invite-preview__app\">APP</span>  <span class=\"install-slack-invite-preview__title-timestamp\">{{ timestamp() }}</span> </div><div class=\"install-slack-invite-preview__published\"></div><div translate=\"install_slack.invite.group_published_preview\" translate-value-author=\"{{ userName }}\" translate-value-name=\"{{group.name}}\" class=\"install-slack-invite-preview__message\"></div><div layout=\"row\" class=\"install-slack-invite-preview__attachment lmo-flex\"><div class=\"install-slack-invite-preview__bar\"></div><div class=\"install-slack-invite-preview__poll\"><div class=\"install-slack-invite-preview__author\">{{ userName }}</div><div class=\"install-slack-invite-preview__poll-title\">{{ group.name }}</div><div ng-if=\"poll.details\" class=\"install-slack-invite-preview__poll-details\">{{ group.description | truncate }}</div><div translate=\"poll_common_publish_slack_preview.view_it_on_loomio\" class=\"install-slack-invite-preview__view-it\"></div><div translate=\"poll_common_publish_slack_preview.timestamp\" translate-value-timestamp=\"{{timestamp()}}\" class=\"install-slack-invite-preview__timestamp\"></div></div></div></div></div>");
$templateCache.put("generated/components/install_slack/modal/install_slack_modal.html","<md-dialog class=\"install-slack-modal lmo-modal__narrow\"><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"install_slack.modal_title\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button ng-if=\"!preventClose\"></material_modal_header_cancel_button></div></md-toolbar><md-dialog-content><install_slack_form ng-if=\"hasIdentity\" group=\"group\"></install_slack_form><div ng-click=\"redirect()\" ng-if=\"!hasIdentity\" class=\"install-slack-form__redirect\"><auth_avatar></auth_avatar><p translate=\"install_slack.modal_helptext\" class=\"lmo-hint-text\"></p><div class=\"lmo-md-action\"><md-button ng-click=\"redirect()\" translate=\"install_slack.login_to_slack\" class=\"md-primary md-raised\"></md-button></div></div></md-dialog-content></md-dialog>");
$templateCache.put("generated/components/install_slack/progress/install_slack_progress.html","<div class=\"install-slack-progress\"><div class=\"install-slack-progress__bar\"></div><div ng-style=\"{\'width\': progressPercent()}\" class=\"install-slack-progress__bar active\"></div><div ng-class=\"{\'active\': slackProgress == 0, \'complete\': slackProgress &gt;= 0}\" class=\"install-slack-progress__dot\"><label translate=\"install_slack.progress.install\"></label></div><div ng-class=\"{\'active\': slackProgress == 50, \'complete\': slackProgress &gt;= 50}\" class=\"install-slack-progress__dot\"><label translate=\"install_slack.progress.invite\"></label></div><div ng-class=\"{\'active\': slackProgress == 100, \'complete\': slackProgress &gt;= 100}\" class=\"install-slack-progress__dot\"><label translate=\"install_slack.progress.decide\"></label></div></div>");
$templateCache.put("generated/components/invitation/add_members_modal/add_members_modal.html","<md-dialog class=\"lmo-blank\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"add_members_modal.heading\" translate-values=\"{name: group.parentName()}\" class=\"lmo-h1 modal-title\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><md-dialog-content><loading ng-if=\"loadExecuting\"></loading><div ng-if=\"!loadExecuting\" class=\"add-members-modal__content\"><div ng-if=\"!canAddMembers()\" class=\"add-members-modal__empty-list\"><p translate=\"add_members_modal.no_members_to_add\" translate-value-parent=\"{{group.parentName()}}\"></p></div><md-list layout=\"column\" ng-if=\"canAddMembers()\" class=\"add-members-modal__list lmo-flex\"><md-list-item ng-repeat=\"member in members() | orderBy: \'username\' track by member.id\" class=\"add-members-modal__list-item\"><md-checkbox ng-checked=\"isSelected(member)\" ng-click=\"select(member)\"><div layout=\"row\" class=\"lmo-flex lmo-flex__center\"><user_avatar user=\"member\" size=\"small\" class=\"lmo-margin-right\"></user_avatar><strong>{{member.name}}</strong>&nbsp;(@{{member.username}})</div></md-checkbox></md-list-item></md-list></div><dialog_scroll_indicator></dialog_scroll_indicator></md-dialog-content><md-dialog-actions class=\"lmo-md-actions\"><md-button type=\"button\" ng-click=\"reopenInvitationsForm()\" translate=\"common.action.back\"></md-button><md-button type=\"button\" ng-click=\"submit()\" translate=\"add_members_modal.add_members\" ng-if=\"canAddMembers()\" class=\"md-primary md-raised add-members-modal__submit\"></md-button></md-dialog-actions></md-dialog>");
$templateCache.put("generated/components/invitation/form/invitation_form.html","<div class=\"invitation-form\"><md-input-container ng-if=\"!invitationForm.groupId\" class=\"md-block\"><label for=\"group-select\" translate=\"invitation_form.group\"></label><md-select ng-model=\"invitationForm.groupId\" ng-required=\"ng-required\" ng-change=\"restoreRemoteDraft(); fetchShareableInvitation()\" id=\"group-select\"><md-option value=\"undefined\" translate=\"invitation_form.group_placeholder\"></md-option><md-option ng-repeat=\"group in availableGroups() | orderBy: \'fullName\' track by group.id\" ng-value=\"group.id\">{{group.fullName}}</md-option></md-select></md-input-container><div ng-if=\"invitationForm.groupId\" class=\"invitation-form__fields\"><div class=\"lmo-flex\"><label translate=\"invitation_form.shareable_link\"></label><help_bubble helptext=\"invitation_form.shareable_link_explanation\"></help_bubble></div><md-input-container class=\"lmo-flex lmo-flex__baseline\"><input value=\"{{invitationLink()}}\" ng-disabled=\"true\" class=\"invitation-form__shareable-link\"><md-button type=\"button\" clipboard=\"true\" text=\"invitationLink()\" on-copied=\"copied()\" class=\"md-raised md-primary\">{{ \'invitation_form.copy_link\' | translate}}</md-button></md-input-container><div class=\"lmo-flex\"><label for=\"email-addresses\" translate=\"invitation_form.email_addresses\"></label><help_bubble helptext=\"invitation_form.email_explanation\"></help_bubble></div><md-input-container md-no-float=\"true\" class=\"md-block\"><textarea ng-model=\"invitationForm.emails\" ng-required=\"ng-required\" rows=\"1\" placeholder=\"{{ \'invitation_form.email_addresses_placeholder\' | translate }}\" class=\"invitation-form__email-addresses\" id=\"email-addresses\"></textarea><validation_errors subject=\"invitationForm\" field=\"emails\" class=\"invitation-form__validation-errors\"></validation_errors><div ng-if=\"noInvitations\" translate=\"invitation_form.messages.no_invitations\" class=\"invitation-form__no-invitations lmo-validation-error\"></div><div ng-if=\"maxInvitations()\" translate=\"invitation_form.messages.max_invitations\" class=\"invitation-form__max-invitations lmo-validation-error\"></div></md-input-container><p ng-if=\"invitationForm.group().isSubgroup()\"> <button translate=\"invitation_form.add_members\" ng-click=\"addMembers()\" class=\"invitation-form__add-members lmo-btn-link--blue\"></button> <span translate=\"invitation_form.from_parent_group\" translate-values=\"{name: invitationForm.group().parentName()}\"></span></p></div></div>");
$templateCache.put("generated/components/invitation/form_actions/invitation_form_actions.html","<div class=\"lmo-md-action\"><md-button ng-click=\"submit()\" translate=\"{{submitText()}}\" ng-disabled=\"!canSubmit()\" class=\"invitation-form__submit md-raised md-primary\"></md-button></div>");
$templateCache.put("generated/components/invitation/modal/invitation_modal.html","<md-dialog><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"invitation_form.invite_people\" ng-if=\"!groupName()\" class=\"lmo-h1 modal-title\"></h1><h1 translate=\"invitation_form.invite_people_to_group\" translate-value-name=\"{{groupName()}}\" ng-if=\"groupName()\" class=\"lmo-h1 modal-title lmo-truncate\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><md-dialog-content class=\"md-body-1\"><invitation_form invitation-form=\"invitationForm\"></invitation_form><dialog_scroll_indicator></dialog_scroll_indicator></md-dialog-content><md-dialog-actions ng-if=\"invitationForm.groupId\"><invitation_form_actions invitation-form=\"invitationForm\"></invitation_form_actions></md-dialog-actions></md-dialog>");
$templateCache.put("generated/components/memberships_page/cancel_invitation_form/cancel_invitation_form.html","<md-dialog class=\"remove-membership-form\"><form><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"cancel_invitation_form.heading\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content\"><p translate=\"cancel_invitation_form.question\"></p><div class=\"lmo-md-actions\"><md-button ng-click=\"$close()\" translate=\"common.action.cancel\"></md-button><md-button ng-click=\"submit()\" translate=\"cancel_invitation_form.submit\" class=\"md-primary md-raised memberships-page__remove-membership-confirm\"></md-button></div></div></form></md-dialog>");
$templateCache.put("generated/components/memberships_page/memberships_panel/memberships_panel.html","<div class=\"memberships-panel\"><div ng-repeat=\"membership in memberships() | orderBy: \'-admin\' track by membership.id\" data-username=\"{{membership.user().username}}\" class=\"memberships-panel__membership lmo-flex lmo-flex__center\"><user_avatar user=\"membership.user()\" size=\"medium\" coordinator=\"membership.admin\"></user_avatar><div layout=\"column\" class=\"memberships-panel__user lmo-flex lmo-flex__grow\"><a lmo-href-for=\"membership.user()\">{{::membership.user().name}}</a><outlet name=\"after-membership-user\" model=\"membership\"></outlet><div class=\"md-caption\"><i>@{{::membership.user().username}}</i></div></div><div ng-if=\"canAdministerGroup()\" layout=\"row\" class=\"memberships-page__actions\"><md-button translate=\"memberships_panel.remove_coordinator\" ng-if=\"membership.admin\" ng-click=\"toggleAdmin(membership)\" ng-disabled=\"!canToggleAdmin(membership)\" class=\"memberships-panel__toggle-coordinator\"></md-button><md-button translate=\"memberships_panel.add_coordinator\" ng-if=\"!membership.admin\" ng-click=\"toggleAdmin(membership)\" class=\"md-primary memberships-panel__toggle-coordinator\"></md-button><md-button translate=\"common.action.remove\" ng-disabled=\"!canRemoveMembership(membership)\" ng-click=\"openRemoveForm(membership)\" class=\"md-warn memberships-panel__remove\"></md-button></div></div></div>");
$templateCache.put("generated/components/memberships_page/pending_invitations_card/pending_invitations_card.html","<div class=\"blank\"><section ng-if=\"canSeeInvitations() &amp;&amp; group.hasPendingInvitations()\" class=\"lmo-card pending-invitations-card\"><h3 translate=\"pending_invitations_card.heading\" class=\"lmo-card-heading\"></h3><div class=\"pending-invitations-card__pending-invitations\"><div layout=\"row\" ng-repeat=\"invitation in group.pendingInvitations() track by invitation.id\" class=\"lmo-flex lmo-flex__center pending-invitations-card__invitation\"><div layout=\"column\" class=\"lmo-flex__grow lmo-flex\"><strong>{{invitation.recipientEmail}}</strong><div translate=\"pending_invitations_card.sent_at\" translate-value-date=\"{{invitationCreatedAt(invitation)}}\" class=\"lmo-hint-text\"></div></div><div class=\"memberships-page__actions\"><loading ng-if=\"invitation.resending\"></loading><md-button ng-if=\"!invitation.resending\" ng-click=\"resend(invitation)\" translate=\"common.action.resend\" class=\"md-accent\"></md-button><md-button type=\"button\" clipboard=\"true\" text=\"invitation.url\" on-copied=\"copied()\" class=\"md-accent\"><span translate=\"pending_invitations_card.copy_url\"></span></md-button><md-button ng-click=\"openCancelForm(invitation)\" translate=\"pending_invitations_card.revoke_invitation\" class=\"md-warn\"></md-button></div></div></div></section></div>");
$templateCache.put("generated/components/document/card/document_card.html","<section class=\"document-card lmo-card lmo-no-print\"><h2 translate=\"document.list.title\" class=\"lmo-card-heading\" id=\"document-card-title\"></h2><loading ng-if=\"!model\"></loading><div ng-if=\"model\" class=\"document-card__content\"><div translate=\"document.card.no_documents\" ng-if=\"!model.hasDocuments()\" class=\"lmo-hint-text\"></div><document_list model=\"model\" hide-preview=\"true\"></document_list></div><div class=\"lmo-md-actions\"><a lmo-href-for=\"group\" lmo-href-action=\"documents\" class=\"lmo-card-minor-action\"><span translate=\"document.card.view_documents\"></span></a><md-button ng-click=\"addDocument()\" class=\"md-primary md-raised\"><span translate=\"documents_page.add_document\"></span></md-button></div></section>");
$templateCache.put("generated/components/document/form/document_form.html","<div ng-switch=\"currentStep\" class=\"document-form lmo-slide-animation\"><document_method_form ng-switch-when=\"method\" document=\"document\" class=\"animated\"></document_method_form><document_url_form ng-switch-when=\"url\" document=\"document\" class=\"animated\"></document_url_form><document_title_form ng-switch-when=\"title\" document=\"document\" class=\"animated\"></document_title_form></div>");
$templateCache.put("generated/components/document/list/document_list.html","<section class=\"document-list\"><h3 ng-if=\"showTitle()\" translate=\"document.list.title\" class=\"document-list__heading lmo-card-heading\"></h3><p ng-if=\"!model.hasDocuments() &amp;&amp; placeholder\" translate=\"{{placeholder}}\" class=\"lmo-hint-text md-caption\"></p><div layout=\"column\" class=\"document-list__documents md-block lmo-flex\"><div layout=\"column\" ng-class=\"{\'document-list__document--image\': document.isAnImage()}\" ng-repeat=\"document in model.newAndPersistedDocuments() | orderBy: \'createdAt\' track by document.id\" class=\"document-list__document lmo-flex\"><div ng-if=\"document.isAnImage() &amp;&amp; !hidePreview\" class=\"document-list__image\"><img ng-src=\"{{document.webUrl}}\" alt=\"{{document.title}}\"></div><div layout=\"row\" class=\"document-list__entry lmo-flex lmo-flex__center\"> <i class=\"mdi lmo-margin-right mdi-{{document.icon}}\" ng-style=\"{color: document.color}\"></i> <a href=\"{{document.url}}\" target=\"_blank\" class=\"lmo-pointer lmo-relative lmo-truncate lmo-flex lmo-flex__grow\"><div class=\"document-list__title lmo-truncate lmo-flex__grow\">{{ document.title }}</div></a><document_list_edit document=\"document\" ng-if=\"showEdit\"></document_list_edit><md-button ng-if=\"showEdit\" ng-click=\"$emit(\'documentRemoved\', document)\" md-prevent-menu-close=\"true\" class=\"md-button--tiny\"><i class=\"mdi mdi-close\"></i></md-button></div></div></div></section>");
$templateCache.put("generated/components/document/list_edit/document_list_edit.html","<div class=\"document-list-edit\"><md-menu md-prevent-menu-close=\"true\" class=\"lmo-pointer\"><md-button md-menu-origin=\"true\" ng-click=\"$broadcast(\'initializeDocument\', document, $mdMenu)\" md-prevent-menu-close=\"true\" class=\"md-button--tiny\"><i class=\"mdi mdi-pencil\"></i></md-button><md-menu-content><document_form class=\"lmo-textarea__document-form\"></document_form></md-menu-content></md-menu></div>");
$templateCache.put("generated/components/document/management/document_management.html","<div ng-if=\"hasDocuments()\" class=\"document-management\"><h3 translate=\"document.management.{{filter}}_header\" ng-if=\"filter\" class=\"lmo-h3\"></h3><div ng-repeat=\"document in documents() | orderBy: \'-createdAt\' track by document.id\" layout=\"row\" class=\"document-management__document lmo-flex lmo-flex__space-between\"><div class=\"document-management__column-row\"><i class=\"mdi lmo-margin-right document-management__icon mdi-{{document.icon}}\" ng-style=\"{color: document.color}\"></i></div><div layout=\"column\" class=\"document-management__column-row lmo-flex lmo-flex__grow\"><strong class=\"lmo-truncate\"><a ng-href=\"{{document.url}}\" target=\"_blank\">{{ document.title | truncate:50 }}</a></strong><div class=\"document-management__caption md-caption\"> <a lmo-href-for=\"document.model()\" class=\"lmo-truncate\">{{ document.modelTitle() | truncate:50 }}</a> </div><div class=\"document-management__caption md-caption\"><span>{{document.authorName()}}</span> <span>·</span>  <timeago timestamp=\"document.createdAt\"></timeago> </div></div><div ng-if=\"canAdministerGroup()\" class=\"document-management__column-row\"><md-button ng-click=\"edit(document)\" translate=\"common.action.edit\" class=\"md-accent\"></md-button></div><div ng-if=\"canAdministerGroup()\" class=\"document-management__column-row\"><md-button ng-click=\"remove(document)\" translate=\"common.action.remove\" class=\"md-warn\"></md-button></div></div></div>");
$templateCache.put("generated/components/document/method_form/document_method_form.html","<div class=\"document-method-form\"><p translate=\"document.method_form.helptext\" class=\"lmo-hint-text\"></p><div layout=\"row\" class=\"document-method-form__buttons lmo-flex\"><md-button ng-click=\"$emit(\'nextStep\', \'url\')\" md-prevent-menu-close=\"true\" class=\"document-method-form__button\"><i class=\"mdi mdi-link mdi-24px\"></i><p translate=\"document.method_form.url_helptext\" class=\"lmo-hint-text\"></p></md-button><md-button ng-click=\"$emit(\'nextStep\', \'file\')\" md-prevent-menu-close=\"true\" class=\"document-method-form__button\"><i class=\"mdi mdi-file mdi-24px\"></i><p translate=\"document.method_form.file_helptext\" class=\"lmo-hint-text\"></p></md-button></div></div>");
$templateCache.put("generated/components/document/modal/document_modal.html","<md-dialog class=\"document-modal lmo-modal__narrow\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><i class=\"mdi mdi-file-document\"></i><h1 translate=\"document.modal.title\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content\"><document_form></document_form></div></md-dialog>");
$templateCache.put("generated/components/document/title_form/document_title_form.html","<div class=\"document-title-form lmo-relative\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-input-container ng-if=\"!document.isNew() &amp;&amp; document.manualUrl\" class=\"md-block md-no-errors\"><label translate=\"document.form.url_label\"></label><input ng-model=\"document.url\" placeholder=\"{{\'document.form.url_placeholder\' | translate }}\" class=\"lmo-primary-form-input\" id=\"document_title\"><validation_errors subject=\"document\" field=\"url\"></validation_errors></md-input-container><div ng-if=\"document.isNew()\" translate=\"document.form.title_helptext\" class=\"document-form__helptext lmo-hint-text\"></div><md-input-container class=\"md-block md-no-errors\"><label translate=\"document.form.title_label\"></label><input ng-model=\"document.title\" placeholder=\"{{\'document.form.title_placeholder\' | translate }}\" class=\"lmo-primary-form-input\" id=\"document_title\"><validation_errors subject=\"document\" field=\"title\"></validation_errors></md-input-container><div class=\"lmo-md-actions\"><div ng-if=\"!document.isNew()\"></div><md-button ng-if=\"document.isNew()\" ng-click=\"$emit(\'previousStep\')\" translate=\"common.action.back\" md-prevent-menu-close=\"true\" class=\"md-accent\"></md-button><md-button ng-click=\"submit()\" translate=\"common.action.save\" md-prevent-menu-close=\"true\" class=\"md-primary md-raised\"></md-button></div></div>");
$templateCache.put("generated/components/document/upload_form/document_upload_form.html","<div class=\"md-attachment-form\"><button type=\"button\" md-prevent-menu-close=\"true\" ng-file-drop=\"true\" ng-model=\"files\" ng-click=\"selectFile()\" ng-hide=\"files\" aria-label=\"{{ \'comment_form.attachments.add_attachment\' | translate }}\" class=\"md-button--nude md-attachment-form__button\"><i class=\"mdi mdi-attachment md-attachment-form__icon\"></i><span translate=\"comment_form.attachments.add_attachment\" ng-if=\"showLabel\"></span></button><input type=\"file\" ng-model=\"files\" ng-file-select=\"true\" class=\"md-attachment-form__file-input hidden\"><div ng-repeat=\"file in files\" class=\"lmo-flex lmo-flex__start\"><div class=\"progress active md-attachment-form-progress-field\"><strong class=\"md-attachment-form-progress-text\">{{ percentComplete }} %</strong><md-progress-linear md-mode=\"determinate\" value=\"{{percentComplete}}\"></md-progress-linear></div><button type=\"button\" ng-click=\"abort()\" class=\"close md-attachment-form-cancel cancel-upload md-attachment-form__cancel\"><i class=\"mdi mdi-close\"></i></button></div></div>");
$templateCache.put("generated/components/document/url_form/document_url_form.html","<div ng-switch=\"document.method\" class=\"document-url-form\"><div ng-switch-when=\"file\" md-autofocus=\"true\" ng-paste=\"handlePaste($event)\" class=\"document-url-form__attachment\"><div layout=\"column\" class=\"lmo-flex lmo-flex__center lmo-relative document-form__attachment-form\"><i class=\"mdi mdi-cloud-upload mdi-36px\"></i><div translate=\"document.form.helptext\" class=\"lmo-hint-text document-form__helptext\"></div><validation_errors subject=\"model\" field=\"file\"></validation_errors><document_upload_form model=\"model\"></document_upload_form></div></div><div ng-switch-when=\"url\" class=\"document-url-form__url\"><div layout=\"row\" class=\"lmo-flex lmo-flex__center\"><md-input-container class=\"md-block lmo-flex__grow md-no-errors\"><label translate=\"document.form.url_label\"></label><input ng-model=\"model.url\" ng-disabled=\"disabled\" placeholder=\"{{\'document.form.url_placeholder\' | translate }}\" class=\"lmo-primary-form-input lmo-flex__grow\"><validation_errors subject=\"model\" field=\"url\"></validation_errors></md-input-container></div><div class=\"lmo-md-action\"><md-button ng-click=\"submit()\" translate=\"common.action.next\" md-prevent-menu-close=\"true\" class=\"md-primary md-raised\"></md-button></div></div></div>");
$templateCache.put("generated/components/reactions/display/reactions_display.html","<div layout=\"row\" class=\"reactions-display lmo-flex lmo-flex__center\"><loading ng-if=\"!loaded\" diameter=\"diameter\"></loading><div ng-if=\"loaded\" layout=\"row\" class=\"lmo-flex lmo-flex__center\"><div class=\"reactions-display__emojis\"><div ng-if=\"loaded\" ng-click=\"removeMine(reaction)\" ng-repeat=\"reaction in reactionTypes() track by $index\" class=\"reaction lmo-pointer\"><div marked=\"reaction\" class=\"reaction__emoji\"></div><md-tooltip><strong>{{::translate(reaction) }}</strong><div ng-repeat=\"name in reactionHash()[reaction] | limitTo: maxNamesCount track by $index\" class=\"reactions-display__name\">{{ name }}</div><div ng-if=\"countFor(reaction) &gt; 0\" class=\"reactions-display__name eactions-display__more\"><span translate=\"reactions_display.more_reactions\" translate-value-count=\"{{countFor(reaction)}}\"></span></div></md-tooltip></div></div><div ng-if=\"myReaction()\" class=\"reactions-display__names\"><span ng-if=\"reactionHash().all.length == 1\" translate=\"reactions_display.you\"></span><span ng-if=\"reactionHash().all.length == 2\" translate=\"reactions_display.you_and_name\" translate-values=\"{name: otherReaction().user().name}\"></span><span ng-if=\"reactionHash().all.length &gt; 2\" translate=\"reactions_display.you_and_name_and_count_more\" translate-values=\"{name: otherReaction().user().name, count: reactionHash().all.length - 2}\"></span></div><div ng-if=\"!myReaction()\" class=\"reactions-display__names\"><span ng-if=\"reactionHash().all.length == 1\">{{reactionHash().all[0]}}</span><span ng-if=\"reactionHash().all.length &gt; 1\" translate=\"reactions_display.name_and_count_more\" translate-values=\"{name: reactionHash().all[0], count: reactionHash().all.length - 1}\"></span></div></div></div>");
$templateCache.put("generated/components/reactions/input/reactions_input.html","<div class=\"reactions-input\"><emoji_picker model=\"discussion\" reaction=\"true\" class=\"lmo-relative md-button md-button--tiny\"></emoji_picker><md-tooltip md-delay=\"500\"><span translate=\"reactions_input.add_your_reaction\"></span></md-tooltip></div>");
$templateCache.put("generated/components/thread_page/activity_card/activity_card.html","<section aria-labelledby=\"activity-card-title\" class=\"activity-card\"><div ng-show=\"eventWindow.anyLoaded()\" class=\"activity-card__settings\"><md-select ng-model=\"position\" ng-change=\"init(position)\" class=\"md-no-underline\"><md-option value=\"beginning\" translate=\"activity_card.beginning\"></md-option><md-option value=\"unread\" translate=\"activity_card.unread\" ng-disabled=\"!eventWindow.anyUnread()\"></md-option><md-option value=\"latest\" translate=\"activity_card.latest\"></md-option></md-select><md-select ng-model=\"renderMode\" ng-change=\"init()\" class=\"md-no-underline\"><md-option value=\"chronological\" translate=\"activity_card.chronological\"></md-option><md-option value=\"nested\" translate=\"activity_card.nested\"></md-option></md-select></div><div ng-if=\"debug()\">first: {{eventWindow.firstInSequence()}}last:  {{eventWindow.lastInSequence()}}total: {{eventWindow.numTotal()}}min: {{eventWindow.min}}max: {{eventWindow.max}}per: {{per}}firstLoaded: {{eventWindow.firstLoaded()}}lastLoaded:  {{eventWindow.lastLoaded()}}loadedCount: {{eventWindow.numLoaded()}}</div><loading_content ng-if=\"loader.loading\" block-count=\"2\" class=\"lmo-card-left-right-padding\"></loading_content><div ng-if=\"!loader.loading\" class=\"activity-card__content\"><a ng-show=\"eventWindow.anyPrevious() &amp;&amp; !eventWindow.loader.loadingPrevious\" ng-click=\"eventWindow.showPrevious()\" tabindex=\"0\" class=\"activity-card__load-more lmo-flex lmo-flex__center lmo-no-print\"> <i class=\"mdi mdi-autorenew\"></i> <span translate=\"discussion.load_previous\" translate-value-count=\"{{eventWindow.numPrevious()}}\"></span></a><loading ng-show=\"eventWindow.loader.loadingPrevious\" class=\"activity-card__loading page-loading\"></loading><ul class=\"activity-card__activity-list\"><li ng_repeat=\"event in eventWindow.windowedEvents() track by event.id\" class=\"activity-card__activity-list-item\"><thread_item event=\"event\" event_window=\"eventWindow\"></thread_item></li></ul><div in-view=\"$inview &amp;&amp; !eventWindow.loader.loadingMore &amp;&amp; eventWindow.anyNext() &amp;&amp; eventWindow.showNext()\" in-view-options=\"{throttle: 200}\" class=\"activity-card__load-more-sensor lmo-no-print\"></div><loading ng-show=\"eventWindow.loader.loadingMore\" class=\"activity-card__loading page-loading\"></loading></div><add_comment_panel ng-if=\"eventWindow\" event_window=\"eventWindow\" parent_event=\"discussion.createdEvent()\"></add_comment_panel></section>");
$templateCache.put("generated/components/thread_page/add_comment_panel/add_comment_panel.html","<div ng-if=\"show\" ng-class=\"{\'thread-item--indent\': indent()}\" class=\"add-comment-panel lmo-card-padding\"><div ng-if=\"canAddComment()\" class=\"lmo-flex--row\"><div class=\"thread-item__avatar lmo-margin-right\"><user_avatar user=\"actor\" size=\"small\"></user_avatar></div><div class=\"thread-item__body lmo-flex--column lmo-flex__horizontal-center\"><comment_form event-window=\"eventWindow\"></comment_form></div></div><div ng-if=\"!canAddComment()\" class=\"add-comment-panel__join-actions\"><join_group_button group=\"discussion.group()\" ng-if=\"isLoggedIn()\" block=\"true\"></join_group_button><md-button translate=\"comment_form.sign_in\" ng-click=\"signIn()\" ng-if=\"!isLoggedIn()\" class=\"md-primary md-raised add-comment-panel__sign-in-btn\"></md-button></div></div>");
$templateCache.put("generated/components/thread_page/comment_form/comment_form.html","<div class=\"comment-form lmo-relative\"><form ng_submit=\"submit()\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><lmo_textarea model=\"comment\" field=\"body\" placeholder=\"commentPlaceholder()\" helptext=\"commentHelptext()\"></lmo_textarea><comment_form_actions comment=\"comment\" submit=\"submit\"></comment_form_actions><validation_errors subject=\"comment\" field=\"file\"></validation_errors></form></div>");
$templateCache.put("generated/components/thread_page/comment_form/delete_comment_form.html","<form ng-submit=\"submit()\" ng-disabled=\"comment.processing\" name=\"deleteCommentForm\" class=\"delete-comment-form\"><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"delete_comment_dialog.title\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content md-body-1\"><p translate=\"delete_comment_dialog.question\" class=\"comment-form-delete-message\"></p><div class=\"lmo-md-actions\"><md-button ng-click=\"$close()\" translate=\"common.action.cancel\"></md-button><md-button type=\"submit\" translate=\"delete_comment_dialog.confirm\" class=\"md-raised md-primary delete-comment-form__delete-button\"></md-button></div></div></form>");
$templateCache.put("generated/components/thread_page/comment_form/edit_comment_form.html","<md-dialog class=\"edit-comment-form\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><form ng-submit=\"submit()\" ng-disabled=\"comment.processing\" name=\"commentForm\"><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"comment_form.edit_comment\" class=\"lmo-h1 modal-title\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><md-dialog-content><lmo_textarea model=\"comment\" field=\"body\" placeholder=\"\'comment_form.say_something\' | translate\"></lmo_textarea></md-dialog-content><md-dialog-actions><comment_form_actions comment=\"comment\" submit=\"submit\"></comment_form_actions></md-dialog-actions></form></md-dialog>");
$templateCache.put("generated/components/thread_page/comment_form/mentio_menu.html","<md-menu-content class=\"mentio-menu\"><ul><md-menu-item mentio-menu-item=\"user\" layout=\"row\" ng-repeat=\"user in items track by user.id\" class=\"mentio-menu__item\"><user_avatar user=\"user\" size=\"small\" class=\"mentio-menu__avatar\"></user_avatar><div layout=\"column\" class=\"lmo-flex\"><strong class=\"mentionable-name\">{{user.name}}</strong><div class=\"mentionable-username\">{{user.username}}</div></div></md-menu-item></ul></md-menu-content>");
$templateCache.put("generated/components/thread_page/comment_form_actions/comment_form_actions.html","<div class=\"lmo-md-actions\"><div ng-if=\"!comment.isNew() || submitIsDisabled\"></div><div layout=\"row\" ng-if=\"comment.isNew() &amp;&amp; !submitIsDisabled\" class=\"comment-form__actions--left lmo-flex\"><md-button translate=\"comment_form.cancel_reply\" ng-show=\"comment.parentId &amp;&amp; !eventWindow.useNesting\" ng-click=\"comment.parentId = null\" tabindex=\"-1\" class=\"comment-form-button\"></md-button><md-button translate=\"common.action.cancel\" ng-click=\"cancel($event)\" ng-if=\"!comment.isNew()\" id=\"post-comment-cancel\"></md-button><a lmo-href=\"/markdown\" ng-if=\"!comment.parentId\" target=\"_blank\" title=\"{{ \'common.formatting_help.title\' | translate }}\" class=\"comment-form__formatting md-button md-accent lmo-hide-on-xs\"><span translate=\"common.formatting_help.label\"></span></a></div><div layout=\"row\" class=\"comment-form__actions--right lmo-flex\"><outlet name=\"before-comment-submit\" model=\"comment\"></outlet><md-button ng-if=\"comment.isNew()\" ng-click=\"submit()\" ng-disabled=\"submitIsDisabled\" translate=\"comment_form.submit_button.label\" class=\"md-primary md-raised comment-form__submit-button\"></md-button><md-button ng-if=\"!comment.isNew()\" ng-click=\"submit()\" ng-disabled=\"submitIsDisabled\" translate=\"common.action.save_changes\" class=\"md-primary md-raised comment-form__submit-button\"></md-button></div></div>");
$templateCache.put("generated/components/thread_page/context_panel/context_panel.html","<section aria-label=\"{{ \'thread_context.aria_label\' | translate }}\" class=\"context-panel lmo-card-padding lmo-action-dock-wrapper\"><div class=\"context-panel__top\"><div ng-if=\"status()\" ng-attr-title=\"{{statusTitle()}}\" ng-switch=\"status()\" class=\"context-panel__status\"><i ng-switch-when=\"pinned\" class=\"mdi mdi-pin\"></i></div><div in-view=\"showLintel(!$inview)\" class=\"context-panel__h1 lmo-flex__grow\"><h1 ng-if=\"!translation\" class=\"lmo-h1 context-panel__heading\">{{discussion.title}}</h1><h1 ng-if=\"translation\" class=\"lmo-h1\"><translation translation=\"translation\" field=\"title\"></translation></h1></div><context_panel_dropdown discussion=\"discussion\"></context_panel_dropdown></div><div class=\"context-panel__details md-body-1 lmo-flex--row\"><user_avatar user=\"discussion.author()\" size=\"small\" class=\"lmo-margin-right\"></user_avatar><span> <strong>{{::discussion.authorName()}}</strong> <span aria-hidden=\"true\">·</span> <timeago timestamp=\"::discussion.createdAt\" class=\"nowrap\"></timeago> <span aria-hidden=\"true\">·</span> <span ng-show=\"discussion.private\" class=\"nowrap context-panel__discussion-privacy context-panel__discussion-privacy--private\"> <i class=\"mdi mdi-lock-outline\"></i>  <span translate=\"common.privacy.private\"></span> </span>  <span ng-show=\"!discussion.private\" class=\"nowrap context-panel__discussion-privacy context-panel__discussion-privacy--public\"> <i class=\"mdi mdi-earth\"></i>  <span translate=\"common.privacy.public\"></span> </span>  <span ng-show=\"discussion.seenByCount &gt; 0\"> <span aria-hidden=\"true\">·</span> <span translate=\"thread_context.seen_by_count\" translate-value-count=\"{{discussion.seenByCount}}\" class=\"context-panel__seen_by_count\"></span></span> </span><div translate=\"common.privacy.closed\" ng-if=\"discussion.closedAt\" md-colors=\"{color: \'warn-600\', \'border-color\': \'warn-600\'}\" class=\"lmo-badge lmo-pointer\"><md-tooltip>{{ discussion.closedAt | exactDateWithTime }}</md-tooltip></div><outlet name=\"after-thread-title\" model=\"discussion\" class=\"lmo-flex\"></outlet></div><div ng-if=\"!translation\" marked=\"discussion.cookedDescription()\" aria-label=\"{{ \'thread_context.aria_label\' | translate }}\" class=\"context-panel__description lmo-markdown-wrapper\"></div><translation ng-if=\"translation\" translation=\"translation\" field=\"description\" class=\"lmo-markdown-wrapper\"></translation><document_list model=\"discussion\"></document_list><div class=\"lmo-md-actions\"><reactions_display model=\"discussion\" load=\"true\" class=\"context-panel__actions-left\"></reactions_display><action_dock model=\"discussion\" actions=\"actions\"></action_dock></div></section>");
$templateCache.put("generated/components/thread_page/context_panel_dropdown/context_panel_dropdown.html","<div class=\"context-panel-dropdown pull-right lmo-no-print\"><outlet name=\"before-thread-actions\" model=\"discussion\" class=\"context-panel__before-thread-actions\"></outlet><md-menu md-position-mode=\"target-right target\" class=\"lmo-dropdown-menu\"><md-button ng-click=\"$mdMenu.open()\" class=\"context-panel-dropdown__button\"><div translate=\"thread_context.thread_options\" class=\"sr-only\"></div><i class=\"mdi mdi-24px mdi-chevron-down\"></i></md-button><md-menu-content><md-menu-item ng-if=\"canChangeVolume()\" class=\"context-panel-dropdown__option--email-settings\"><md-button ng-click=\"openChangeVolumeForm()\" translate=\"thread_context.email_settings\"></md-button></md-menu-item><md-menu-item ng-if=\"canEditThread()\" class=\"context-panel-dropdown__option--edit\"><md-button ng-click=\"editThread()\" translate=\"thread_context.edit\"></md-button></md-menu-item><md-menu-item ng-show=\"!discussion.pinned &amp;&amp; canPinThread()\" class=\"context-panel-dropdown__option--pin\"><md-button ng-click=\"pinThread()\" translate=\"thread_context.pin_thread\"></md-button></md-menu-item><md-menu-item ng-show=\"discussion.pinned &amp;&amp; canPinThread()\" class=\"context-panel-dropdown__option--pin\"><md-button ng-click=\"unpinThread()\" translate=\"thread_context.unpin_thread\"></md-button></md-menu-item><md-menu-item ng-show=\"!discussion.closedAt &amp;&amp; canCloseThread()\" class=\"context-panel-dropdown__option--close\"><md-button ng-click=\"closeThread()\" translate=\"thread_context.close_thread\"></md-button></md-menu-item><md-menu-item ng-show=\"discussion.closedAt &amp;&amp; canCloseThread()\" class=\"context-panel-dropdown__option--reopen\"><md-button ng-click=\"reopenThread()\" translate=\"thread_context.reopen_thread\"></md-button></md-menu-item><md-menu-item ng-show=\"!discussion.isMuted()\" class=\"context-panel-dropdown__option--mute\"><md-button ng-click=\"muteThread()\" translate=\"volume_levels.mute\"></md-button></md-menu-item><md-menu-item ng-show=\"discussion.isMuted()\" class=\"context-panel-dropdown__option--unmute\"><md-button ng-click=\"unmuteThread()\" translate=\"volume_levels.unmute\"></md-button></md-menu-item><md-menu-item ng-if=\"canMoveThread()\" class=\"context-panel-dropdown__option--move\"><md-button ng-click=\"moveThread()\" translate=\"thread_context.move_thread\"></md-button></md-menu-item><md-menu-item class=\"context-panel-dropdown__option--print\"><md-button ng-click=\"requestPagePrinted()\" translate=\"thread_context.print_thread\"></md-button></md-menu-item><md-menu-item ng-if=\"canDeleteThread()\" class=\"context-panel-dropdown__option--delete\"><md-button ng-click=\"deleteThread()\" translate=\"thread_context.delete_thread\"></md-button></md-menu-item></md-menu-content></md-menu></div>");
$templateCache.put("generated/components/thread_page/decision_tools_card/decision_tools_card.html","<div class=\"decision-tools-card lmo-card lmo-no-print\"><div class=\"lmo-flex lmo-flex__space-between\"><h2 translate=\"decision_tools_card.title\" class=\"lmo-card-heading decision-tools-card__title\"></h2><div translate=\"decision_tools_card.help_text\" class=\"lmo-hint-text\"></div></div><poll_common_start_form discussion=\"discussion\"></poll_common_start_form></div>");
$templateCache.put("generated/components/thread_page/event_children/event_children.html","<div class=\"event-children\"><div ng-if=\"debug()\">event-childrenparentId: {{eventWindow.parentEvent.id}}cc: {{eventWindow.parentEvent.childCount}}min: {{eventWindow.min}}max: {{eventWindow.max}}first: {{eventWindow.firstLoaded()}}last: {{eventWindow.lastLoaded()}}anyPrevious: {{eventWindow.anyPrevious()}}anyNext: {{eventWindow.anyNext()}}</div><a ng-show=\"eventWindow.anyPrevious() &amp;&amp; !eventWindow.loader.loadingPrevious\" ng-click=\"eventWindow.showPrevious()\" class=\"activity-card__load-more lmo-no-print thread-item--indent-margin\"> <i class=\"mdi mdi-autorenew\"></i> <span translate=\"activity_card.n_previous\" translate-value-count=\"{{eventWindow.numPrevious()}}\"></span></a><loading ng-show=\"eventWindow.loader.loadingPrevious\" class=\"activity-card__loading page-loading\"></loading><thread-item ng-repeat=\"event in eventWindow.windowedEvents() | orderBy: threadWindow.orderBy track by event.id\" event-window=\"eventWindow\" event=\"event\"></thread-item><a ng-show=\"eventWindow.anyNext() &amp;&amp; !eventWindow.loader.loadingMore\" ng-click=\"eventWindow.showNext()\" class=\"activity-card__load-more lmo-no-print thread-item--indent-margin\"> <i class=\"mdi mdi-autorenew\"></i> <span translate=\"activity_card.n_more\" translate-value-count=\"{{eventWindow.numNext()}}\"></span></a><loading ng-show=\"eventWindow.loader.loadingMore\" class=\"activity-card__loading page-loading\"></loading></div>");
$templateCache.put("generated/components/thread_page/print_modal/print_modal.html","<md-dialog class=\"lmo-modal__narrow lmo-no-print\"><md-toolbar class=\"lmo-flex lmo-flex__center lmo-flex__horizontal-center\"><h1 translate=\"print_modal.load_discussion\" class=\"lmo-h1\"></h1></md-toolbar><div class=\"md-dialog-content\"><p translate=\"print_modal.helptext\" class=\"lmo-hint-text\"></p><loading></loading></div></md-dialog>");
$templateCache.put("generated/components/thread_page/revision_history_modal/revision_history_modal.html","<div class=\"revision-history-modal\"><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"{{header}}\" class=\"lmo-h1 modal-title lmo-flex__grow\"></h1><material_modal_header_cancel_button aria-hidden=\"true\"></material_modal_header_cancel_button></div></md-toolbar><div ng-if=\"!loadExecuting\" class=\"md-dialog-content revision-history-modal__body\"><loading ng-if=\"loadExecuting\"></loading><h2 ng-if=\"commentRevision()\" class=\"lmo-h2\">{{model.authorName()}}</h2><div ng-repeat=\"version in model.versions() | orderBy: \'-createdAt\' track by version.id\" id=\"version-{{version.id}}\" class=\"lmo-wrap\"><div class=\"revision-history-modal__revision\"><h2 ng-if=\"discussionRevision()\" translate=\"{{threadTitle(version)}}\" class=\"lmo-h2\"></h2><div class=\"revision-history-modal__thread-details\"><span ng-if=\"commentRevision()\" translate=\"revision_history_modal.posted\"></span><span ng-if=\"discussionRevision()\" translate=\"{{threadDetails(version)}}\" translate-value-name=\"{{version.authorOrEditorName()}}\"></span> <span>{{versionCreatedAt(version.createdAt)}}</span>  <span ng-if=\"version.isCurrent(version)\">(current)</span> </div><div marked=\"revisionBody(version)\" class=\"revision-history-modal__revision-body lmo-markdown-wrapper\"></div></div></div></div></div>");
$templateCache.put("generated/components/thread_page/thread_item/new_comment.html","<div id=\"comment-{{eventable.id}}\" class=\"new-comment\"><div ng-if=\"!translation\" marked=\"eventable.cookedBody()\" class=\"thread-item__body new-comment__body lmo-markdown-wrapper\"></div><translation ng-if=\"translation\" translation=\"translation\" field=\"body\" class=\"thread-item__body\"></translation><outlet name=\"after-comment-body\" model=\"eventable\"></outlet><document_list model=\"eventable\"></document_list><div class=\"lmo-md-actions\"><reactions_display model=\"eventable\"></reactions_display><action_dock model=\"eventable\" actions=\"actions\"></action_dock></div><outlet name=\"after-comment-event\" model=\"eventable\"></outlet></div>");
$templateCache.put("generated/components/thread_page/thread_item/outcome_created.html","<div class=\"outcome-created\"><p ng-if=\"!translation\" marked=\"eventable.statement\" class=\"thread-item__body lmo-markdown-wrapper\"></p><translation ng-if=\"translation\" translation=\"translation\" field=\"statement\" class=\"thread-item__body\"></translation><document_list model=\"eventable\"></document_list><div class=\"lmo-md-actions\"><reactions_display model=\"eventable\"></reactions_display><action_dock model=\"eventable\" actions=\"actions\"></action_dock></div></div>");
$templateCache.put("generated/components/thread_page/thread_item/poll_created.html","<div class=\"poll-created\"><div class=\"lmo-md-actions\"><reactions_display model=\"eventable\"></reactions_display><action_dock model=\"eventable\" actions=\"actions\"></action_dock></div></div>");
$templateCache.put("generated/components/thread_page/thread_item/stance_created.html","<div class=\"stance-created\"><poll_common_directive name=\"stance_choice\" ng-repeat=\"choice in eventable.stanceChoices() | orderBy: \'rank\'\" ng-if=\"choice.score &gt; 0\" stance_choice=\"choice\"></poll_common_directive><div ng-if=\"eventable.stanceChoices().length == 0\" translate=\"poll_common_votes_panel.none_of_the_above\" class=\"lmo-hint-text\"></div><div marked=\"eventable.reason\" ng-if=\"eventable.reason &amp;&amp; !translation\" class=\"lmo-markdown-wrapper\"></div><translation ng-if=\"translation\" translation=\"translation\" field=\"reason\" class=\"thread-item__body\"></translation><div class=\"lmo-md-actions\"><reactions_display model=\"eventable\"></reactions_display><action_dock model=\"eventable\" actions=\"actions\"></action_dock></div></div>");
$templateCache.put("generated/components/thread_page/thread_item/thread_item.html","<div md-colors=\"mdColors()\" ng-class=\"{\'thread-item--indent\': indent(), \'thread-item--unread\': isUnread()}\" in-view=\"$inview&amp;&amp;event.markAsRead()\" in-view-options=\"{throttle: 200}\" class=\"thread-item\"><div layout=\"row\" id=\"sequence-{{event.sequenceId}}\" class=\"lmo-flex lmo-relative lmo-action-dock-wrapper\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><div class=\"thread-item__avatar lmo-margin-right\"><user_avatar user=\"event.actor()\" size=\"small\" ng-if=\"event.actor()\"></user_avatar></div><div layout=\"column\" class=\"thread-item__body lmo-flex lmo-flex__horizontal-center\"><div class=\"thread-item__headline lmo-flex lmo-flex--row lmo-flex__center lmo-flex__grow lmo-flex__space-between\"><h3 id=\"event-{{event.id}}\" class=\"thread-item__title\"><div ng-if=\"debug()\">id: {{event.id}}cpid: {{event.comment().parentId}}pid: {{event.parentId}}sid: {{event.sequenceId}}position: {{event.position}}depth: {{event.depth}}unread: {{isUnread()}}cc: {{event.childCount}}</div><span ng-bind-html=\"::headline()\"></span> <span aria-hidden=\"true\">·</span> <a href=\"{{::link()}}\" class=\"thread-item__link lmo-pointer\"><timeago timestamp=\"event.createdAt\" class=\"timeago--inline\"></timeago></a></h3><md-button ng-if=\"canRemoveEvent()\" ng-click=\"removeEvent()\" class=\"md-button--tiny\"><i class=\"mdi mdi-delete\"></i></md-button></div><thread_item_directive event=\"event\" class=\"thread-item__directive\"></thread_item_directive></div></div></div>");
$templateCache.put("generated/components/poll/common/action_panel/poll_common_action_panel.html","<div class=\"poll-common-action-panel\"><section ng-if=\"!poll.closedAt\"><div ng-if=\"userHasVoted()\" class=\"md-block\"><div class=\"poll-common-action-panel__change-your-vote\"><h3 translate=\"poll_common.your_response\" class=\"lmo-card-subheading\"></h3><poll_common_directive stance_choice=\"choice\" name=\"stance_choice\" ng-if=\"choice.id &amp;&amp; choice.score &gt; 0\" ng-repeat=\"choice in stance.stanceChoices() | orderBy: \'rank\'\"></poll_common_directive><div class=\"md-actions lmo-md-actions\"><md-button ng-click=\"openStanceForm()\" translate=\"poll_common.change_your_stance\" aria-label=\"{{ \'poll_common.change_your_stance\' | translate }}\" class=\"md-accent\"></md-button></div></div></div><div ng-if=\"!userHasVoted()\" class=\"md-block\"><poll_common_directive ng-if=\"userCanParticipate()\" stance=\"stance\" name=\"vote_form\"></poll_common_directive><div ng-if=\"!userCanParticipate()\" class=\"poll-common-unable-to-vote\"><p translate=\"poll_common_action_panel.unable_to_vote\" class=\"lmo-hint-text\"></p><div class=\"lmo-md-actions\"><show_results_button></show_results_button><div></div></div></div></div></section></div>");
$templateCache.put("generated/components/poll/common/actions_dropdown/poll_common_actions_dropdown.html","<md-menu md-position-mode=\"target-right target\" class=\"lmo-dropdown-menu poll-actions-dropdown pull-right lmo-no-print\"><md-button ng-click=\"$mdMenu.open()\" class=\"poll-actions-dropdown__button\"><i class=\"mdi mdi-24px mdi-chevron-down\"></i></md-button><md-menu-content><md-menu-item class=\"poll-actions-dropdown__subscribe\"><md-button ng-click=\"toggleSubscription()\"><span translate=\"common.action.unsubscribe\" ng-if=\"poll.subscribed\"></span><span translate=\"common.action.subscribe\" ng-if=\"!poll.subscribed\"></span></md-button></md-menu-item><md-menu-item ng-if=\"canSharePoll()\" class=\"poll-actions-dropdown__share\"><md-button ng-click=\"sharePoll()\" translate=\"common.action.share\"></md-button></md-menu-item><md-menu-item ng-if=\"canEditPoll()\" class=\"poll-actions-dropdown__edit\"><md-button ng-click=\"editPoll()\" translate=\"common.action.edit\"></md-button></md-menu-item><md-menu-item ng-if=\"canClosePoll()\" class=\"poll-actions-dropdown__close\"><md-button ng-click=\"closePoll()\" translate=\"common.action.close\"></md-button></md-menu-item><md-menu-item ng-if=\"canDeletePoll()\" class=\"poll-actions-dropdown__delete\"><md-button ng-click=\"deletePoll()\" translate=\"common.action.delete\"></md-button></md-menu-item></md-menu-content></md-menu>");
$templateCache.put("generated/components/poll/common/anonymous/poll_common_anonymous.html","<div class=\"md-block poll-common-anonymous poll-common-checkbox-option\"><div class=\"poll-common-checkbox-option__text md-list-item-text\"><h3 translate=\"poll_common_anonymous.anonymous\"></h3><p ng-if=\"poll.anonymous\" translate=\"poll_common_anonymous.helptext_on\" class=\"md-caption\"></p><p ng-if=\"!poll.anonymous\" translate=\"poll_common_anonymous.helptext_off\" class=\"md-caption\"></p></div><md-checkbox ng-model=\"poll.anonymous\"></md-checkbox></div>");
$templateCache.put("generated/components/poll/common/bar_chart/poll_common_bar_chart.html","<div class=\"poll-common-bar-chart\"><div ng-repeat=\"option in poll.pollOptions() | orderBy: \'priority\' track by option.id\" ng-style=\"styleData(option)\" class=\"poll-common-bar-chart__bar\">{{barTextFor(option)}}</div></div>");
$templateCache.put("generated/components/poll/common/bar_chart_panel/poll_common_bar_chart_panel.html","<div class=\"poll-common-bar-chart-panel\"><h3 translate=\"poll_common.results\" class=\"lmo-card-subheading\"></h3><poll_common_bar_chart poll=\"poll\"></poll_common_bar_chart></div>");
$templateCache.put("generated/components/poll/common/calendar_invite/poll_common_calendar_invite.html","<div class=\"poll-common-calendar-invite lmo-drop-animation\"><div class=\"md-block poll-common-calendar-invite__checkbox poll-common-checkbox-option\"><div class=\"poll-common-checkbox-option__text md-list-item-text\"><h3 translate=\"poll_common_calendar_invite.calendar_invite\" class=\"lmo-h3\"></h3><p ng-if=\"outcome.calendarInvite\" translate=\"poll_common_calendar_invite.helptext_on\" class=\"md-caption\"></p><p ng-if=\"!outcome.calendarInvite\" translate=\"poll_common_calendar_invite.helptext_off\" class=\"md-caption\"></p></div><md-checkbox ng-model=\"outcome.calendarInvite\"></md-checkbox></div><div ng-show=\"outcome.calendarInvite\" class=\"poll-common-calendar-invite__form animated\"><md-input-container class=\"md-block poll-common-calendar-invite--pad-top\"><label translate=\"poll_common_calendar_invite.poll_option_id\"></label><md-select ng-model=\"outcome.pollOptionId\" aria-label=\"{{ \'poll_common_calendar_invite.poll_option_id\' | translate }}\" class=\"lmo-flex__grow\"><md-option ng-repeat=\"option in options\" ng-value=\"option.id\">{{option.value}}</md-option></md-select></md-input-container><md-input-container class=\"md-block poll-common-calendar-invite--pad-top\"><label translate=\"poll_common_calendar_invite.event_summary\"></label><input type=\"text\" placeholder=\"{{\'poll_common_calendar_invite.event_summary_placeholder\' | translate}}\" ng-model=\"outcome.customFields.event_summary\" class=\"poll-common-calendar-invite__summary\"><validation_errors subject=\"outcome\" field=\"event_summary\"></validation_errors></md-input-container><md-input-container class=\"md-block\"><label translate=\"poll_common_calendar_invite.location\"></label><input type=\"text\" placeholder=\"{{\'poll_common_calendar_invite.location_placeholder\' | translate}}\" ng-model=\"outcome.customFields.event_location\" class=\"poll-common-calendar-invite__location\"></md-input-container><md-input-container class=\"md-block\"><label translate=\"poll_common_calendar_invite.event_description\"></label><textarea type=\"text\" placeholder=\"{{\'poll_common_calendar_invite.event_description_placeholder\' | translate}}\" ng-model=\"outcome.customFields.event_description\" class=\"md-input lmo-primary-form-input poll-common-calendar-invite__description\"></textarea></md-input-container></div></div>");
$templateCache.put("generated/components/poll/common/card/poll_common_card.html","<section class=\"poll-common-card lmo-card-padding lmo-flex__grow lmo-relative\"><div ng-if=\"isDisabled\" class=\"lmo-disabled-form\"></div><loading ng-if=\"!poll.complete\"></loading><div ng-if=\"poll.complete\" class=\"lmo-blank\"><poll_common_card_header poll=\"poll\"></poll_common_card_header><poll_common_set_outcome_panel poll=\"poll\"></poll_common_set_outcome_panel><h1 ng-if=\"!translation\" class=\"poll-common-card__title\">{{poll.title}}</h1><h3 ng-if=\"translation\" class=\"lmo-h1 poll-common-card__title\"><translation translation=\"translation\" field=\"title\"></translation></h3><poll_common_outcome_panel poll=\"poll\" ng-if=\"poll.outcome()\"></poll_common_outcome_panel><poll_common_details_panel poll=\"poll\"></poll_common_details_panel><div ng-if=\"showResults()\" class=\"poll-common-card__results-shown\"><poll_common_directive poll=\"poll\" name=\"chart_panel\"></poll_common_directive><poll_common_percent_voted poll=\"poll\"></poll_common_percent_voted></div><poll_common_action_panel poll=\"poll\"></poll_common_action_panel><div ng-if=\"showResults()\" class=\"poll-common-card__results-shown\"><poll_common_votes_panel poll=\"poll\"></poll_common_votes_panel></div></div></section>");
$templateCache.put("generated/components/poll/common/card_header/poll_common_card_header.html","<div class=\"poll-common-card-header lmo-flex lmo-flex__space-between\"><div class=\"poll-common-card-header lmo-flex\"><i class=\"mdi mdi-24px {{icon()}}\"></i><h2 translate=\"poll_types.{{poll.pollType}}\" class=\"lmo-card-heading poll-common-card-header__poll-type\"></h2></div><poll_common_actions_dropdown poll=\"poll\" ng-if=\"pollHasActions()\" class=\"pull-right\"></poll_common_actions_dropdown></div>");
$templateCache.put("generated/components/poll/common/chart_preview/poll_common_chart_preview.html","<div class=\"poll-common-chart-preview\"><bar_chart ng-if=\"chartType() == \'bar\'\" stance_counts=\"poll.stanceCounts\" size=\"50\"></bar_chart><progress_chart ng-if=\"chartType() == \'progress\'\" stance_counts=\"poll.stanceCounts\" goal=\"poll.goal()\" size=\"50\"></progress_chart><poll_proposal_chart_preview ng-if=\"chartType() == \'pie\'\" stance_counts=\"poll.stanceCounts\" my_stance=\"myStance()\"></poll_proposal_chart_preview><matrix_chart ng-if=\"chartType() == \'matrix\'\" matrix_counts=\"poll.matrixCounts\" size=\"50\"></matrix_chart></div>");
$templateCache.put("generated/components/poll/common/choose_type/poll_common_choose_type.html","<div class=\"poll-common-choose-type__select-poll-type\"><div class=\"poll-common-choose-type__poll-type--{{pollType}}\" ng-repeat=\"pollType in pollTypes() track by $index\"><md-list-item ng-click=\"choose(pollType)\" class=\"poll-common-choose-type__poll-type\"><i class=\"mdi mdi-24px poll-common-choose-type__icon {{iconFor(pollType)}}\"></i><div class=\"poll-common-choose-type__content poll-common-choose-type__start-poll--{{pollType}}\"><div translate=\"decision_tools_card.{{pollType}}_title\" class=\"poll-common-choose-type__poll-type-title md-subhead\"></div><div translate=\"poll_{{pollType}}_form.tool_tip_collapsed\" class=\"poll-common-choose-type__poll-type-subtitle md-caption\"></div></div></md-list-item></div></div>");
$templateCache.put("generated/components/poll/common/close_form/poll_common_close_form.html","<form ng-submit=\"submit()\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"poll_common_close_form.close_{{poll.pollType}}\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><md-dialog-content><span translate=\"poll_common_close_form.helptext\"></span><dialog_scroll_indicator></dialog_scroll_indicator></md-dialog-content><md-dialog-actions><md-button ng-click=\"submit()\" translate=\"poll_common_close_form.close_{{poll.pollType}}\" class=\"md-raised md-primary poll-common-close-form__submit\"></md-button></md-dialog-actions></form>");
$templateCache.put("generated/components/poll/common/closing_at/poll_common_closing_at.html"," <abbr class=\"closing-in timeago--inline\"><span translate=\"{{translationKey()}}\" translate-value-time=\"{{time() | timeFromNowInWords}}\" ng-attr-title=\"{{time() | exactDateWithTime}}\"></span></abbr> ");
$templateCache.put("generated/components/poll/common/closing_at_field/poll_common_closing_at_field.html","<div class=\"poll-common-closing-at-field\"><div class=\"poll-common-closing-at-field__inputs\"><md-input-container class=\"poll-common-closing-at-field-give-margin-right\"><label class=\"poll-common-closing-at-field__label\"><poll_common_closing_at poll=\"poll\"></poll_common_closing_at></label> <md-datepicker ng-model=\"closingDate\" md-min-date=\"minDate\" md-hide-icons=\"calendar\"></md-datepicker> </md-input-container><md-input-container><md-select ng-model=\"closingHour\" aria-label=\"{{ \'poll_common_closing_at_field.closing_hour\' | translate }}\"><md-option ng-repeat=\"hour in hours\" ng-value=\"hour\" ng-selected=\"hour == closingHour\">{{ times[hour] }}</md-option></md-select></md-input-container></div><validation_errors subject=\"poll\" field=\"closingAt\"></validation_errors></div>");
$templateCache.put("generated/components/poll/common/collapsed/poll_common_collapsed.html","<div class=\"poll-common-collapsed lmo-card-padding\"><poll_common_chart_preview poll=\"poll\"></poll_common_chart_preview><div class=\"poll-common-collapsed__content\"><div class=\"md-subhead md-primary\"> <strong>{{formattedPollType(poll.pollType)}}:</strong>  <span>{{poll.title}}</span> </div><div class=\"md-caption lmo-grey-on-white\"> <span translate=\"poll_common_collapsed.by_who\" translate-value-name=\"{{poll.author().name}}\"></span>  <span>·</span> <poll_common_closing_at poll=\"poll\"></poll_common_closing_at></div></div></div>");
$templateCache.put("generated/components/poll/common/delete_modal/poll_common_delete_modal.html","<md-dialog class=\"poll-common-delete-modal\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><h1 translate=\"poll_common_delete_modal.title\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><md-dialog-content class=\"md-dialog-content\"><p translate=\"poll_common_delete_modal.question\"></p></md-dialog-content><md-dialog-actions class=\"lmo-md-actions\"><md-button ng-click=\"$close()\" translate=\"common.action.cancel\"></md-button><md-button ng-click=\"submit()\" translate=\"common.action.delete\" class=\"md-warn md-raised\"></md-button></md-dialog-actions></md-dialog>");
$templateCache.put("generated/components/poll/common/details_panel/poll_common_details_panel.html","<div class=\"poll-common-details-panel lmo-action-dock-wrapper\"><h3 translate=\"poll_common.details\" ng-if=\"poll.outcome()\" class=\"lmo-card-subheading\"></h3><div class=\"poll-common-details-panel__started-by\"><span translate=\"poll_card.started_by\" translate-value-name=\"{{poll.author().name}}\"></span> <span aria-hidden=\"true\">·</span> <poll_common_closing_at poll=\"poll\"></poll_common_closing_at></div><div ng-if=\"!translation\" marked=\"poll.cookedDetails()\" class=\"poll-common-details-panel__details lmo-markdown-wrapper\"></div><div ng-if=\"translation\" class=\"poll-common-details-panel__details\"><translation translation=\"translation\" field=\"details\" class=\"lmo-markdown-wrapper\"></translation></div><document_list model=\"poll\"></document_list><div class=\"lmo-md-actions\"><reactions_display model=\"poll\" load=\"true\"></reactions_display><action_dock model=\"poll\" actions=\"actions\"></action_dock></div></div>");
$templateCache.put("generated/components/poll/common/edit_modal/poll_common_edit_modal.html","<md-dialog class=\"poll-common-modal\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><i class=\"mdi {{icon()}}\"></i><h1 translate=\"poll_{{poll.pollType}}_form.edit_header\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><md-dialog-content><poll_common_directive poll=\"poll\" name=\"form\"></poll_common_directive><dialog_scroll_indicator></dialog_scroll_indicator></md-dialog-content><md-dialog-actions><poll_common_form_actions poll=\"poll\"></poll_common_form_actions></md-dialog-actions></md-dialog>");
$templateCache.put("generated/components/poll/common/edit_vote_modal/poll_common_edit_vote_modal.html","<md-dialog class=\"poll-common-modal\"><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><i class=\"mdi {{icon()}}\"></i><h1 ng-if=\"stance.isNew()\" translate=\"poll_common.your_response\" class=\"lmo-h1\"></h1><h1 ng-if=\"!stance.isNew()\" translate=\"poll_common.change_your_response\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><md-dialog-content><div class=\"md-dialog-content\"><div ng-if=\"isDisabled\" class=\"lmo-disabled-form\"></div><poll_common_directive name=\"vote_form\" stance=\"stance\"></poll_common_directive></div></md-dialog-content></md-dialog>");
$templateCache.put("generated/components/poll/common/example_card/poll_common_example_card.html","<div class=\"poll-common-example-card lmo-card lmo-flex\"><div class=\"lmo-hint-text\"> <span translate=\"poll_common_example_card.what_is_this\" translate-value-type=\"{{type()}}\"></span> <span translate=\"poll_common_example_card.helptext_before\"></span> <a lmo-href=\"/p/new/{{poll.pollType}}\" class=\"lmo-pointer\"><span translate=\"poll_common_example_card.helptext_link\" translate-value-type=\"{{type()}}\"></span></a> <span translate=\"poll_common_example_card.helptext_after\"></span></div></div>");
$templateCache.put("generated/components/poll/common/form_actions/poll_common_form_actions.html","<div class=\"poll-common-form-actions lmo-md-actions\"><span ng-if=\"!poll.isNew()\"></span><md-button ng-if=\"poll.isNew()\" ng-click=\"$emit(\'previousStep\')\" translate=\"common.action.back\" aria-label=\"{{ \'common.action.back\' | translate }}\" class=\"md-accent\"></md-button><div class=\"lmo-md-actions\"><outlet name=\"before-poll-submit\" model=\"poll\"></outlet><md-button ng-click=\"submit()\" ng-if=\"!poll.isNew()\" translate=\"poll_common_form.update\" aria-label=\"{{ \'poll_common_form.update\' | translate }}\" class=\"md-primary md-raised poll-common-form__submit\"></md-button><md-button ng-click=\"submit()\" ng-if=\"poll.isNew() &amp;&amp; poll.groupId\" translate=\"poll_common_form.start\" aria-label=\"{{ \'poll_common_form.start\' | translate }}\" class=\"md-primary md-raised poll-common-form__submit\"></md-button><md-button ng-click=\"submit()\" ng-if=\"poll.isNew() &amp;&amp; !poll.groupId\" translate=\"common.action.next\" aria-label=\"{{ \'common.action.next\' | translate }}\" class=\"md-primary md-raised poll-common-form__submit\"></md-button></div></div>");
$templateCache.put("generated/components/poll/common/form_fields/poll_common_form_fields.html","<div class=\"poll-common-form-fields\"><poll_common_tool_tip poll=\"poll\"></poll_common_tool_tip><md-input-container class=\"md-block\"><label translate=\"poll_common_form.title\"></label><input type=\"text\" placeholder=\"{{titlePlaceholder()}}\" ng-model=\"poll.title\" md-maxlength=\"250\" class=\"lmo-primary-form-input poll-common-form-fields__title\"><validation_errors subject=\"poll\" field=\"title\"></validation_errors></md-input-container><lmo_textarea model=\"poll\" field=\"details\" label=\"\'poll_common_form.details\' | translate\" placeholder=\"detailsPlaceholder()\"></lmo_textarea><outlet name=\"after-poll-form-textarea\" model=\"poll\"></outlet></div>");
$templateCache.put("generated/components/poll/common/form_options/poll_common_form_options.html","<md-block class=\"poll-common-form-options\"><label ng-if=\"!datesAsOptions\" translate=\"poll_common_form.options\" class=\"poll-common-form__options-label md-caption\"></label><div ng-if=\"datesAsOptions\" class=\"poll-meeting-form__label-and-timezone\"><label translate=\"poll_meeting_form.timeslots\" class=\"nowrap poll-common-form__options-label md-caption lmo-flex__grow\"></label></div><md-list class=\"md-block poll-common-form__options\"><validation_errors subject=\"poll\" field=\"pollOptions\"></validation_errors><md-list-item ng-if=\"!poll.pollOptionNames.length\"><p ng-if=\"datesAsOptions\" translate=\"poll_meeting_form.no_options\" translate-values=\"{zone: currentZone()}\" class=\"lmo-hint-text\"></p><p ng-if=\"!datesAsOptions\" translate=\"poll_common_form.no_options\" class=\"lmo-hint-text\"></p></md-list-item><md-list-item ng-repeat=\"name in poll.pollOptionNames\" class=\"poll-common-form__list-item\"><span ng-if=\"!datesAsOptions\" class=\"poll-poll-form__option-text\">{{name}}</span><poll_meeting_time ng-if=\"datesAsOptions\" name=\"name\" zone=\"zone\" class=\"poll-meeting-form__option-text lmo-flex__grow\"></poll_meeting_time><md-button ng-if=\"canRemoveOption(name)\" ng-click=\"removeOption(name)\" aria-label=\"{{ \'poll_poll_form.remove_option\' | translate }}\" class=\"poll-poll-form__option-button\"><i class=\"mdi mdi-close mdi-24px poll-poll-form__option-icon\"></i></md-button></md-list-item><poll_meeting_time_field ng-if=\"datesAsOptions\" poll=\"poll\"></poll_meeting_time_field><md-list-item ng-if=\"!datesAsOptions\" flex=\"true\" layout=\"row\" class=\"poll-common-form__add-option\"><md-input-container md-no-float=\"true\" class=\"poll-poll-form__add-option-field\"><input ng-model=\"poll.newOptionName\" type=\"text\" placeholder=\"{{ \'poll_common_form.options_placeholder\' | translate }}\" class=\"poll-poll-form__add-option-input\"></md-input-container><div><md-button ng-click=\"addOption()\" aria-label=\"{{ \'poll_poll_form.add_option_placeholder\' | translate }}\" class=\"poll-poll-form__option-button\"><i class=\"mdi mdi-plus mdi-24px poll-poll-form__option-icon poll-poll-form__option-icon--add\"></i></md-button></div></md-list-item></md-list></md-block>");
$templateCache.put("generated/components/poll/common/index_card/poll_common_index_card.html","<div class=\"poll-common-index-card lmo-card\"><h2 translate=\"poll_common_index_card.title\" class=\"lmo-card-heading\"></h2><loading ng-if=\"fetchRecordsExecuting\"></loading><div ng-if=\"!fetchRecordsExecuting\" class=\"poll-common-index-card__polls\"><div ng-if=\"!polls().length\" translate=\"poll_common_index_card.no_polls\" class=\"lmo-hint-text\"></div><div ng-if=\"polls().length\" class=\"poll-common-index-card__has-polls\"><poll_common_preview poll=\"poll\" ng-repeat=\"poll in polls() track by poll.id\"></poll_common_preview><a ng-click=\"viewMore()\" ng-if=\"displayViewMore()\" class=\"poll-common-index-card__view-more\"><span translate=\"poll_common_index_card.count\" translate-value-count=\"{{model.closedPollsCount}}\"></span></a></div></div></div>");
$templateCache.put("generated/components/poll/common/notify_group/poll_common_notify_group.html","<div ng-if=\"model.announcementSize(notifyAction) &gt; 1\" class=\"md-block poll-common-notify-group poll-common-checkbox-option\"><div class=\"poll-common-checkbox-option__text md-list-item-text\"><h3 translate=\"poll_common_notify_group.notify_group\"></h3><p ng-if=\"model.makeAnnouncement\" class=\"md-caption\"><span ng-if=\"notifyAction == \'publish\'\" translate=\"poll_common_notify_group.members_count\" translate-value-count=\"{{model.announcementSize(\'publish\')}}\"></span><span ng-if=\"notifyAction == \'edit\'\" translate=\"poll_common_notify_group.participants_count\" translate-value-count=\"{{model.announcementSize(\'edit\')}}\"></span></p><p ng-if=\"!model.makeAnnouncement\" translate=\"poll_common_notify_group.members_helptext\" class=\"md-caption\"></p></div><md-checkbox ng-model=\"model.makeAnnouncement\"></md-checkbox></div>");
$templateCache.put("generated/components/poll/common/notify_on_participate/poll_common_notify_on_participate.html","<div class=\"md-block poll-common-notify-on-participate poll-common-checkbox-option\"><div class=\"poll-common-checkbox-option__text md-list-item-text\"><h3 translate=\"poll_common_notify_on_participate.notify_on_participate\"></h3><p ng-if=\"poll.notifyOnParticipate\" translate=\"poll_common_notify_on_participate.helptext_on\" class=\"md-caption\"></p><p ng-if=\"!poll.notifyOnParticipate\" translate=\"poll_common_notify_on_participate.helptext_off\" class=\"md-caption\"></p></div><md-checkbox ng-model=\"poll.notifyOnParticipate\"></md-checkbox></div>");
$templateCache.put("generated/components/poll/common/outcome_form/poll_common_outcome_form.html","<div class=\"poll-common-outcome-form\"><div ng-if=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-input-container class=\"md-block\"><label translate=\"poll_common.statement\"></label><lmo_textarea model=\"outcome\" field=\"statement\" placeholder=\"\'poll_common_outcome_form.statement_placeholder\' | translate\" class=\"poll-common-outcome-form__statement\"></lmo_textarea><validation_errors subject=\"outcome\" field=\"statement\"></validation_errors></md-input-container><poll_common_notify_group model=\"outcome\" notify-action=\"publish\"></poll_common_notify_group><poll_common_calendar_invite outcome=\"outcome\" ng-if=\"datesAsOptions()\"></poll_common_calendar_invite><div class=\"lmo-flex lmo-flex__space-between\"><div></div><md-button ng-click=\"submit()\" translate=\"poll_common_outcome_form.submit\" aria-label=\"{{poll_common_outcome_form.submit | translate}}\" class=\"md-raised md-primary poll-common-outcome-form__submit\"></md-button></div></div>");
$templateCache.put("generated/components/poll/common/outcome_modal/poll_common_outcome_modal.html","<md-dialog class=\"poll-common-modal\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><i class=\"mdi mdi-thumbs-up-down\"></i><h1 ng-if=\"outcome.isNew()\" translate=\"poll_common_outcome_form.new_title\" class=\"lmo-h1\"></h1><h1 ng-if=\"!outcome.isNew()\" translate=\"poll_common_outcome_form.update_title\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><md-dialog-content><poll_common_directive name=\"outcome_form\" outcome=\"outcome\"></poll_common_directive></md-dialog-content></md-dialog>");
$templateCache.put("generated/components/poll/common/outcome_panel/poll_common_outcome_panel.html","<div ng-if=\"poll.outcome()\" class=\"poll-common-outcome-panel lmo-action-dock-wrapper\"><h3 translate=\"poll_common.outcome\" class=\"lmo-card-subheading\"></h3><div class=\"poll-common-outcome-panel__authored-by\"><span translate=\"poll_common_outcome_panel.authored_by\" translate-value-name=\"{{poll.outcome().author().name}}\"></span> <timeago timestamp=\"::poll.outcome().createdAt\"></timeago> </div><p marked=\"poll.outcome().statement\" ng-if=\"!translation\" class=\"lmo-markdown-wrapper\"></p><translation translation=\"translation\" field=\"statement\" ng-if=\"translation\"></translation><document_list model=\"poll.outcome()\"></document_list><div class=\"lmo-md-actions\"><reactions_display model=\"poll.outcome()\" load=\"true\"></reactions_display><action_dock model=\"poll.outcome()\" actions=\"actions\"></action_dock></div></div>");
$templateCache.put("generated/components/poll/common/participant_form/poll_common_participant_form.html","<div ng-if=\"showParticipantForm()\" class=\"poll-common-participant-form\"><md-input-container class=\"md-block\"><label translate=\"poll_common.participant_name\"></label><input type=\"text\" required=\"required\" placeholder=\"{{poll_common_participant_form.participant_name_placeholder}}\" ng-model=\"stance.visitorAttributes.name\" class=\"lmo-primary-form-input poll-common-participant-form__name\"><validation_errors subject=\"stance\" field=\"participantName\"></validation_errors></md-input-container><md-input-container ng-if=\"!invitation.recipientEmail\" class=\"md-block\"><label translate=\"poll_common.participant_email\"></label><input type=\"email\" required=\"required\" placeholder=\"{{poll_common_participant_form.participant_email_placeholder}}\" ng-model=\"stance.visitorAttributes.email\" class=\"lmo-primary-form-input poll-common-participant-form__email\"><validation_errors subject=\"stance\" field=\"participantEmail\"></validation_errors></md-input-container></div>");
$templateCache.put("generated/components/poll/common/percent_voted/poll_common_percent_voted.html","<div ng-if=\"poll.membersCount() &gt; 0\" class=\"poll-common-percent-voted lmo-hint-text\"><span translate=\"poll_common_percent_voted.sentence\" translate-value-numerator=\"{{poll.stancesCount}}\" translate-value-denominator=\"{{poll.membersCount()}}\" translate-value-percent=\"{{poll.percentVoted()}}\"></span></div>");
$templateCache.put("generated/components/poll/common/preview/poll_common_preview.html","<a lmo-href-for=\"poll\" class=\"poll-common-preview\"><poll_common_chart_preview poll=\"poll\"></poll_common_chart_preview><div class=\"poll-common-preview__body\"><div class=\"md-subhead lmo-truncate-text\"> <span>{{poll.title}}</span> </div><div class=\"md-caption lmo-grey-on-white lmo-truncate-text\"><span ng-if=\"showGroupName()\">{{ poll.group().fullName }}</span> <span ng-if=\"!showGroupName()\" translate=\"poll_common_collapsed.by_who\" translate-value-name=\"{{poll.author().name}}\"></span>  <span>·</span> <poll_common_closing_at poll=\"poll\"></poll_common_closing_at></div></div></a>");
$templateCache.put("generated/components/poll/common/ranked_choice_chart/poll_common_ranked_choice_chart.html","<div layout=\"row\" class=\"poll-common-ranked-choice-chart lmo-flex\"><div layout=\"column\" class=\"lmo-flex lmo-flex__grow\"><div class=\"poll-common-ranked-choice-chart__cell\"></div><div ng-repeat=\"option in pollOptions() track by option.id\" ng-style=\"styleData(option)\" class=\"poll-common-ranked-choice-chart__cell poll-common-ranked-choice-chart__cell--name\">{{option.name}}</div></div><div layout=\"row\" class=\"poll-common-ranked-choice-chart__table\"><div layout=\"column\" ng-repeat=\"score in scores() track by $index\" class=\"poll-common-ranked-choice-chart__cell poll-common-ranked-choice-chart__cell-column\"><div layout=\"column\" class=\"poll-common-ranked-choice-chart__cell lmo-flex__horizontal-center\"> <strong translate=\"ordinal._{{rankFor(score)}}\"></strong> <md-tooltip><span translate=\"common.points_abbrev\" translate-value-score=\"{{score}}\"></span></md-tooltip></div><div ng-repeat=\"option in pollOptions() track by option.id\" class=\"poll-common-ranked-choice-chart__cell\">{{votesFor(option, score)}}</div></div><div layout=\"column\" class=\"lmo-flex\"><div class=\"poll-common-ranked-choice-chart__cell\"><strong translate=\"common.total\"></strong></div><div ng-repeat=\"option in pollOptions() track by option.id\" class=\"poll-common-ranked-choice-chart__cell\">{{countFor(option)}}</div></div></div></div>");
$templateCache.put("generated/components/poll/common/school_link/poll_common_school_link.html","<div class=\"poll-common-school-link\"><i class=\"mdi\">import_contacts</i><p> <span translate=\"poll_common_school_link.learn_about\"></span> <a lmo-href=\"{{href}}\" target=\"_blank\"><span translate=\"{{translation}}\"></span></a></p></div>");
$templateCache.put("generated/components/poll/common/set_outcome_panel/poll_common_set_outcome_panel.html","<div ng-if=\"showPanel()\" class=\"poll-common-set-outcome-panel\"><p translate=\"poll_common_set_outcome_panel.{{poll.pollType}}\" class=\"lmo-hint-text\"></p><md-dialog-actions><md-button ng-click=\"openOutcomeForm()\" translate=\"poll_common_set_outcome_panel.share_outcome\" aria-label=\"{{poll_common.set_outcome | translate}}\" class=\"md-primary md-raised poll-common-set-outcome-panel__submit\"></md-button></md-dialog-actions></div>");
$templateCache.put("generated/components/poll/common/share_modal/poll_common_share_modal.html","<md-dialog class=\"poll-common-modal lmo-modal__narrow\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><i class=\"mdi {{icon()}}\"></i><h1 translate=\"poll_common.share_poll\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><md-dialog-content><poll_common_share_form poll=\"poll\"></poll_common_share_form><dialog_scroll_indicator></dialog_scroll_indicator></md-dialog-content><md-dialog-actions><poll_common_share_form_actions poll=\"poll\"></poll_common_share_form_actions></md-dialog-actions></md-dialog>");
$templateCache.put("generated/components/poll/common/show_results_button/show_results_button.html","<md-button ng-if=\"!clicked\" ng-click=\"press()\" translate=\"poll_common_card.show_results\" class=\"md-accent show-results-button\"></md-button>");
$templateCache.put("generated/components/poll/common/stance_choice/poll_common_stance_choice.html","<div ng-class=\"poll-common-stance-choice--{{stanceChoice.poll().pollType}}\" class=\"poll-common-stance-choice\"><poll_common_stance_icon stance_choice=\"stanceChoice\"></poll_common_stance_icon> <span ng-if=\"hasVariableScore()\">{{stanceChoice.score}} -</span> <span ng-if=\"translateOptionName()\" translate=\"poll_{{stanceChoice.poll().pollType}}_options.{{stanceChoice.pollOption().name}}\" class=\"poll-common-stance-choice__option-name\"></span><poll_meeting_time ng-if=\"!translateOptionName() &amp;&amp; datesAsOptions()\" name=\"stanceChoice.pollOption().name\"></poll_meeting_time><span ng-if=\"!translateOptionName() &amp;&amp; !datesAsOptions()\">{{stanceChoice.pollOption().name}}</span></div>");
$templateCache.put("generated/components/poll/common/stance_icon/poll_common_stance_icon.html","<div class=\"poll-common-stance-icon\"><img ng-if=\"useOptionIcon()\" ng-src=\"/img/{{stanceChoice.pollOption().name}}.svg\" alt=\"{{stanceChoice.pollOption().name}}\" class=\"lmo-box--tiny poll-common-stance-icon__svg\"><div ng-if=\"!useOptionIcon()\" ng-style=\"{\'border-color\': \'{{stanceChoice.pollOption().color}}\'}\" class=\"poll-common-stance-icon__chip\"></div></div>");
$templateCache.put("generated/components/poll/common/stance_reason/poll_common_stance_reason.html","<div class=\"poll-common-stance-reason\"><lmo_textarea model=\"stance\" field=\"reason\" label=\"\'poll_common.reason\' | translate\" placeholder=\"\'poll_common.reason_placeholder\' | translate\" maxlength=\"250\" class=\"poll-common-vote-form__reason\"></lmo_textarea></div>");
$templateCache.put("generated/components/poll/common/start_form/poll_common_start_form.html","<md-list class=\"decision-tools-card__poll-types\"><md-list-item ng-click=\"startPoll(pollType)\" ng-repeat=\"pollType in pollTypes() track by $index\" aria-label=\"{{\'poll_types.\'+pollType | translate}}\" class=\"decision-tools-card__poll-type\"><i class=\"mdi mdi-24px decision-tools-card__icon {{fieldFromTemplate(pollType, \'material_icon\')}}\"></i><div class=\"decision-tools-card__content decision-tools-card__poll-type--{{pollType}}\"><div translate=\"poll_types.{{pollType}}\" class=\"decision-tools-card__poll-type-title md-body-1\"></div><div translate=\"poll_{{pollType}}_form.tool_tip_collapsed\" class=\"decision-tools-card__poll-type-subtitle md-caption\"></div></div></md-list-item></md-list>");
$templateCache.put("generated/components/poll/common/start_modal/poll_common_start_modal.html","<md-dialog class=\"poll-common-modal\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><i class=\"mdi {{icon()}}\"></i><h1 translate=\"poll_common.start_poll\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><md-dialog-content ng-switch=\"currentStep\" class=\"lmo-slide-animation\"><poll_common_choose_type ng-switch-when=\"choose\" poll=\"poll\" class=\"animated\"></poll_common_choose_type><poll_common_directive ng-switch-when=\"save\" poll=\"poll\" name=\"form\" modal=\"true\" class=\"animated\"></poll_common_directive><poll_common_share_form ng-switch-when=\"share\" poll=\"poll\" modal=\"true\" class=\"animated\"></poll_common_share_form><dialog_scroll_indicator></dialog_scroll_indicator></md-dialog-content><md-dialog-actions ng-if=\"currentStep != \'choose\'\" ng-switch=\"currentStep\"><poll_common_form_actions ng-switch-when=\"save\" poll=\"poll\" class=\"animated\"></poll_common_form_actions><poll_common_share_form_actions ng-switch-when=\"share\" poll=\"poll\" class=\"animated\"></poll_common_share_form_actions></md-dialog-actions></md-dialog>");
$templateCache.put("generated/components/poll/common/start_poll/poll_common_start_poll.html","<div ng-switch=\"currentStep\" class=\"poll-common-start-poll\"><poll_common_choose_type ng-switch-when=\"choose\" poll=\"poll\" class=\"animated\"></poll_common_choose_type><poll_common_directive ng-switch-when=\"save\" poll=\"poll\" name=\"form\" class=\"animated\"></poll_common_directive><poll_common_share_form ng-switch-when=\"share\" poll=\"poll\" class=\"animated\"></poll_common_share_form></div>");
$templateCache.put("generated/components/poll/common/tool_tip/poll_common_tool_tip.html","<div class=\"poll-common-tool-tip\"><div ng-if=\"!collapsed\" class=\"poll-common-tool-tip__expanded\"><div translate=\"poll_{{poll.pollType}}_form.tool_tip_expanded\" class=\"poll-common-tool-tip__expanded-body md-body-1\"></div><div ng-if=\"showHelpLink\" translate=\"poll_common_form.loomio_school_link\" class=\"poll-common-tool-tip__learn-more-link md-body-1\"></div><div class=\"lmo-flex lmo-flex__space-around\"><md-button translate=\"common.ok_got_it\" ng-click=\"hide()\" class=\"md-accent poll-common-tool-tip__collapse\"></md-button></div></div><div ng-if=\"collapsed\" class=\"poll-common-tool-tip__collapsed md-caption\"><span translate=\"poll_{{poll.pollType}}_form.tool_tip_collapsed\" class=\"poll-common-tool-tip__collapsed-body\"></span><span translate=\"common.expand\" ng-click=\"show()\" class=\"poll-common-tool-tip__learn-more\"></span></div></div>");
$templateCache.put("generated/components/poll/common/voter_add_options/poll_common_voter_add_options.html","<div ng-if=\"validPollType()\" class=\"md-block poll-common-notify-group poll-common-checkbox-option\"><div class=\"poll-common-checkbox-option__text md-list-item-text\"><h3 translate=\"poll_common_voter_add_options.add_options\"></h3><p ng-if=\"poll.voterCanAddOptions\" translate=\"poll_common_voter_add_options.helptext_on\" class=\"md-caption\"></p><p ng-if=\"!poll.voterCanAddOptions\" translate=\"poll_common_voter_add_options.helptext_off\" class=\"md-caption\"></p></div><md-checkbox ng-model=\"poll.voterCanAddOptions\"></md-checkbox></div>");
$templateCache.put("generated/components/poll/common/votes_panel/poll_common_votes_panel.html","<div class=\"poll-common-votes-panel\"><div class=\"poll-common-votes-panel__header\"><h3 translate=\"poll_common.votes\" class=\"lmo-card-subheading\"></h3><md-select ng-model=\"fix.votesOrder\" ng-change=\"changeOrder()\" aria-label=\"{{ \'poll_common_votes_panel.change_results_order\' | translate }}\" class=\"md-no-underline\"><md-option ng-repeat=\"opt in sortOptions\" ng-value=\"opt\" translate=\"poll_common_votes_panel.{{opt}}\"></md-option></md-select></div><div ng-if=\"!hasSomeVotes()\" translate=\"poll_common_votes_panel.no_votes_yet\" class=\"poll-common-votes-panel__no-votes\"></div><div ng-if=\"hasSomeVotes()\" class=\"poll-common-votes-panel__has-votes\"><poll_common_directive stance=\"stance\" name=\"votes_panel_stance\" ng-repeat=\"stance in stances() track by stance.id\"></poll_common_directive><md-button ng-if=\"moreToLoad()\" translate=\"common.action.load_more\" ng-click=\"loader.loadMore()\"></md-button></div><poll_common_undecided_panel poll=\"poll\"></poll_common_undecided_panel></div>");
$templateCache.put("generated/components/poll/common/votes_panel_stance/poll_common_votes_panel_stance.html","<div class=\"poll-common-votes-panel__stance\"><user_avatar user=\"stance.participant()\" size=\"small\" class=\"lmo-flex__no-shrink\"></user_avatar><div class=\"poll-common-votes-panel__stance-content\"><div class=\"poll-common-votes-panel__stance-name-and-option\"> <strong>{{ participantName() }}</strong>  <span translate=\"poll_common_votes_panel.none_of_the_above\" ng-if=\"!stance.stanceChoices().length\" class=\"lmo-hint-text\"></span> <poll_common_directive name=\"stance_choice\" stance_choice=\"choice\" ng-if=\"choice.score &gt; 0\" ng-repeat=\"choice in stance.stanceChoices() | orderBy: \'rank\'\"></poll_common_directive> <translate_button ng-if=\"stance.reason\" model=\"stance\" showdot=\"true\" class=\"lmo-card-minor-action\"></translate_button> </div><div ng-if=\"stance.reason\" class=\"poll-common-votes-panel__stance-reason\"><span ng-if=\"!translation\" marked=\"stance.reason\" class=\"lmo-markdown-wrapper\"></span><translation ng-if=\"translation\" translation=\"translation\" field=\"reason\"></translation></div></div></div>");
$templateCache.put("generated/components/poll/count/chart_panel/poll_count_chart_panel.html","<div class=\"poll-count-chart-panel\"><h3 translate=\"poll_common.results\" class=\"lmo-card-subheading\"></h3><div class=\"poll-count-chart-panel__chart-container\"><div class=\"poll-count-chart-panel__progress\"><div class=\"poll-count-chart-panel__incomplete\"></div><div ng-style=\"{\'flex-basis\': percentComplete(1), \'background-color\': colors[1]}\" class=\"poll-count-chart-panel__no\"></div><div ng-style=\"{\'flex-basis\': percentComplete(0), \'background-color\': colors[0]}\" class=\"poll-count-chart-panel__yes\"></div></div><div class=\"poll-count-chart-panel__data\"><div class=\"poll-count-chart-panel__numerator\">{{poll.stanceCounts[0]}}</div><div translate=\"poll_count_chart_panel.out_of\" translate-value-goal=\"{{poll.goal()}}\" class=\"poll-count-chart-panel__denominator\"></div></div></div></div>");
$templateCache.put("generated/components/poll/count/form/poll_count_form.html","<div class=\"poll-count-form\"><poll_common_form_fields poll=\"poll\"></poll_common_form_fields><poll_common_closing_at_field poll=\"poll\"></poll_common_closing_at_field><div class=\"md-input-compensate\"><poll_common_notify_group model=\"poll\" notify-action=\"{{poll.notifyAction()}}\"></poll_common_notify_group><poll_common_notify_on_participate poll=\"poll\"></poll_common_notify_on_participate><poll_common_anonymous poll=\"poll\"></poll_common_anonymous></div></div>");
$templateCache.put("generated/components/poll/count/stance_choice/poll_count_stance_choice.html","<div class=\"poll-common-stance-choice poll-common-stance-choice--count\"><poll_common_stance_icon stance_choice=\"stanceChoice\"></poll_common_stance_icon><span translate=\"poll_count_options.{{stanceChoice.pollOption().name}}\" class=\"poll-common-stance-choice__option-name\"></span></div>");
$templateCache.put("generated/components/poll/count/vote_form/poll_count_vote_form.html","<form class=\"poll-count-vote-form\"><poll_common_participant_form stance=\"stance\"></poll_common_participant_form><poll_common_stance_reason stance=\"stance\"></poll_common_stance_reason><div class=\"poll-count-vote-form__options\"><md-button ng-click=\"submit(\'yes\')\" ng-style=\"{background: yesColor}\" class=\"poll-count-vote-form__option poll-count-vote-form__option--yes\"><md-tooltip md-delay=\"750\" md-direction=\"left\" class=\"poll-common-vote-form__tooltip\"><span translate=\"poll_count_options.yes_meaning\"></span></md-tooltip><i class=\"mdi mdi-check\"></i></md-button><md-button ng-click=\"submit(\'no\')\" ng-style=\"{\'border-color\': noColor}\" class=\"poll-count-vote-form__option poll-count-vote-form__option--no\"><md-tooltip md-delay=\"750\" md-direction=\"left\" class=\"poll-common-vote-form__tooltip\"><span translate=\"poll_count_options.no_meaning\"></span></md-tooltip><i ng-style=\"{color: noColor}\" class=\"mdi mdi-close\"></i></md-button></div><div class=\"poll-common-form-actions lmo-flex lmo-flex__space-between\"><show_results_button ng-if=\"stance.isNew()\"></show_results_button></div></form>");
$templateCache.put("generated/components/poll/dot_vote/chart_panel/poll_dot_vote_chart_panel.html","<div class=\"poll-dot-vote-chart-panel\"><poll_common_bar_chart_panel poll=\"poll\"></poll_common_bar_chart_panel></div>");
$templateCache.put("generated/components/poll/dot_vote/form/poll_dot_vote_form.html","<div class=\"poll-dot-vote-form\"><poll_common_form_fields poll=\"poll\"></poll_common_form_fields><poll_common_form_options poll=\"poll\"></poll_common_form_options><poll_common_closing_at_field poll=\"poll\" class=\"md-input-compensate md-block\"></poll_common_closing_at_field><div class=\"md-input-compensate\"><md-input-container><label translate=\"poll_dot_vote_form.dots_per_person\"></label><input type=\"number\" min=\"0\" ng-model=\"poll.customFields.dots_per_person\"><validation_errors subject=\"poll\" field=\"dotsPerPerson\"></validation_errors></md-input-container></div><div class=\"md-input-compensate\"><poll_common_notify_group model=\"poll\" notify-action=\"{{poll.notifyAction()}}\"></poll_common_notify_group><poll_common_voter_add_options poll=\"poll\"></poll_common_voter_add_options><poll_common_notify_on_participate poll=\"poll\"></poll_common_notify_on_participate><poll_common_anonymous poll=\"poll\"></poll_common_anonymous></div></div>");
$templateCache.put("generated/components/poll/dot_vote/stance_choice/poll_dot_vote_stance_choice.html","<div class=\"poll-common-stance-choice poll-common-stance-choice--dot-vote\"><poll_common_stance_icon stance_choice=\"stanceChoice\"></poll_common_stance_icon><span>{{stanceChoice.score}} - {{stanceChoice.pollOption().name}}</span></div>");
$templateCache.put("generated/components/poll/dot_vote/vote_form/poll_dot_vote_vote_form.html","<form ng-submit=\"submit()\" class=\"poll-dot-vote-vote-form\"><poll_common_participant_form stance=\"stance\"></poll_common_participant_form><h3 translate=\"poll_common.your_response\" class=\"lmo-card-subheading\"></h3><div class=\"lmo-hint-text\"><div ng-if=\"tooManyDots()\" translate=\"poll_dot_vote_vote_form.too_many_dots\" class=\"poll-dot-vote-vote-form__too-many-dots\"></div><div ng-if=\"!tooManyDots()\" translate=\"poll_dot_vote_vote_form.dots_remaining\" translate-value-count=\"{{dotsRemaining()}}\" class=\"poll-dot-vote-vote-form__dots-remaining\"></div></div><md-list class=\"poll-common-vote-form__options\"><md-list-item ng-repeat=\"choice in stanceChoices\" class=\"poll-dot-vote-vote-form__option poll-common-vote-form__option\"><md-input-container class=\"poll-dot-vote-vote-form__input-container\"><p ng-style=\"styleData(choice)\" class=\"poll-dot-vote-vote-form__chosen-option--name poll-common-vote-form__border-chip poll-common-bar-chart__bar\">{{ optionFor(choice).name }}</p><div class=\"poll-dot-vote-vote-form__dot-input-field\"><button type=\"button\" ng-click=\"adjust(choice, -1)\" ng-disabled=\"choice.score == 0\" class=\"poll-dot-vote-vote-form__dot-button\"><div class=\"mdi mdi-24px mdi-minus-circle-outline\"></div></button><input type=\"number\" ng-model=\"choice.score\" min=\"0\" step=\"1\" class=\"poll-dot-vote-vote-form__dot-input\"><button type=\"button\" ng-click=\"adjust(choice, 1)\" ng-disabled=\"dotsRemaining() == 0\" class=\"poll-dot-vote-vote-form__dot-button\"><div class=\"mdi mdi-24px mdi-plus-circle-outline\"></div></button></div></md-input-container></md-list-item></md-list><validation_errors subject=\"stance\" field=\"stanceChoices\"></validation_errors><poll_common_add_option_button ng-if=\"stance.isNew() &amp;&amp; stance.poll().voterCanAddOptions\" poll=\"stance.poll()\"></poll_common_add_option_button><poll_common_stance_reason stance=\"stance\"></poll_common_stance_reason><div class=\"poll-common-form-actions lmo-flex lmo-flex__space-between\"><show_results_button ng-if=\"stance.isNew()\"></show_results_button><div ng-if=\"!stance.isNew()\"></div><md-button type=\"submit\" ng-disabled=\"tooManyDots()\" translate=\"poll_common.vote\" aria-label=\"{{ \'poll_poll_vote_form.vote\' | translate }}\" class=\"md-primary md-raised poll-common-vote-form__submit\"></md-button></div></form>");
$templateCache.put("generated/components/poll/dot_vote/votes_panel_stance/poll_dot_vote_votes_panel_stance.html","<div class=\"poll-dot-vote-votes-panel-stance\"><div class=\"poll-dot-vote-votes-panel-stance__head\"><user_avatar user=\"stance.participant()\" size=\"small\" class=\"lmo-flex__no-shrink\"></user_avatar><div class=\"poll-dot-vote-votes-panel-stance__name\"> <strong>{{ participantName() }}</strong>  <span translate=\"poll_common_votes_panel.none_of_the_above\" ng-if=\"!stance.stanceChoices().length\" class=\"lmo-hint-text\"></span> </div></div><div class=\"poll-dot-vote-votes-panel-stance__body\"><div ng-if=\"stance.reason\" marked=\"stance.reason\" class=\"poll-common-votes-panel__stance-reason lmo-markdown-wrapper\"></div><div ng-if=\"choice.score &gt; 0\" ng-repeat=\"choice in stanceChoices()\" ng-style=\"styleData(choice)\" class=\"poll-dot-vote-votes-panel__stance-choice\">{{barTextFor(choice)}}</div></div></div>");
$templateCache.put("generated/components/poll/meeting/chart_panel/poll_meeting_chart_panel.html","<div class=\"poll-meeting-chart-panel\"><table><thead><tr><td><time_zone_select></time_zone_select></td><td ng-repeat=\"option in poll.pollOptions() | orderBy:\'name\' track by option.id\" class=\"poll-meeting-chart-panel__cell\"><poll_meeting_time name=\"option.name\" zone=\"zone\"></poll_meeting_time></td></tr></thead><tbody><tr ng-repeat=\"stance in poll.latestStances() track by stance.id\"><td class=\"poll-meeting-chart-panel__participant-name\">{{ stance.participant().name }}</td><td ng-class=\"{\'poll-meeting-chart-panel--active\': stance.votedFor(option), \'poll-meeting-chart-panel--inactive\': !stance.votedFor(option)}\" ng-repeat=\"option in poll.pollOptions() | orderBy: \'name\' track by option.id\" class=\"poll-meeting-chart-panel__cell\"><i ng-if=\"stance.votedFor(option)\" class=\"mdi mdi-check\"></i></td></tr><tr class=\"poll-meeting-chart-panel__bold\"><td translate=\"poll_meeting_chart_panel.total\"></td><td ng-repeat=\"stanceCount in poll.stanceCounts track by $index\" class=\"poll-meeting-chart-panel__cell\">{{ stanceCount }}</td></tr></tbody></table></div>");
$templateCache.put("generated/components/poll/meeting/form/poll_meeting_form.html","<div class=\"poll-meeting-form\"><poll_common_form_fields poll=\"poll\"></poll_common_form_fields><md-input-container class=\"md-block\"><label translate=\"poll_meeting_form.meeting_duration\"></label><md-select ng-model=\"poll.customFields.meeting_duration\"><md-option ng-repeat=\"duration in durations\" ng-value=\"duration.minutes\">{{duration.label}}</md-option></md-select></md-input-container><poll_common_form_options poll=\"poll\"></poll_common_form_options><poll_common_closing_at_field poll=\"poll\" class=\"md-block\"></poll_common_closing_at_field><poll_common_notify_group model=\"poll\" notify-action=\"{{poll.notifyAction()}}\"></poll_common_notify_group><poll_common_voter_add_options poll=\"poll\"></poll_common_voter_add_options><poll_common_notify_on_participate poll=\"poll\"></poll_common_notify_on_participate></div>");
$templateCache.put("generated/components/poll/meeting/stance_choice/poll_meeting_stance_choice.html","<div ng-class=\"poll-common-stance-choice--meeting\" class=\"poll-common-stance-choice\"><poll_common_stance_icon stance_choice=\"stanceChoice\"></poll_common_stance_icon><poll_meeting_time name=\"stanceChoice.pollOption().name\"></poll_meeting_time></div>");
$templateCache.put("generated/components/poll/meeting/time_field/poll_meeting_time_field.html","<md-list-item flex=\"true\" layout=\"row\" class=\"poll-meeting-time-field\"><md-input-container class=\"poll-meeting-time-field__datepicker-container\"><label translate=\"poll_meeting_time_field.new_time_slot\" class=\"poll-common-closing-at-field__label\"></label> <md-datepicker ng-model=\"option.date\" md-min-date=\"minDate\" md-placeholder=\"{{ \'poll_meeting_form.add_option_placeholder\' | translate }}\" ng-min-date=\"dateToday\" md-hide-icons=\"calendar\" class=\"lmo-flex lmo-flex__baseline poll-meeting-time-field__datepicker\"></md-datepicker> </md-input-container><md-input-container ng-if=\"poll.customFields.meeting_duration\" class=\"poll-meeting-time-field__timepicker-container\"><md-select ng-model=\"option.time\" aria-label=\"{{ \'poll_meeting_time_field.closing_hour\' | translate }}\"><md-option ng-repeat=\"time in times track by $index\" ng-value=\"time\">{{ time }}</md-option></md-select></md-input-container><div class=\"lmo-flex__grow\"></div><div class=\"poll-meeting-time-field__add\"><md-button ng-click=\"addOption()\" aria-label=\"{{ \'poll_meeting_form.add_option_placeholder\' | translate }}\" class=\"poll-meeting-form__option-button lmo-inline-action\"><i class=\"mdi mdi-plus poll-meeting-form__option-icon\"></i></md-button></div></md-list-item>");
$templateCache.put("generated/components/poll/meeting/vote_form/poll_meeting_vote_form.html","<form ng-submit=\"submit()\" class=\"poll-meeting-vote-form\"><poll_common_participant_form stance=\"stance\"></poll_common_participant_form><h3 translate=\"poll_meeting_vote_form.your_response\" class=\"lmo-card-subheading\"></h3><div class=\"lmo-flex lmo-flex__flex-end\"><time_zone_select></time_zone_select></div><md-list class=\"poll-common-vote-form__options\"><md-list-item ng-repeat=\"option in stance.poll().pollOptions() | orderBy:\'name\' track by option.id\" class=\"poll-common-vote-form__option\"><p ng-style=\"{\'border-color\': option.color}\" class=\"poll-poll-vote-form__option--name poll-common-vote-form__border-chip\"><poll_meeting_time name=\"option.name\" zone=\"zone\"></poll_meeting_time></p><md-checkbox ng-model=\"pollOptionIdsChecked[option.id]\" class=\"md-block poll-poll-vote-form__checkbox\"></md-checkbox></md-list-item></md-list><validation_errors subject=\"stance\" field=\"stanceChoices\"></validation_errors><poll_common_add_option_button ng-if=\"stance.isNew() &amp;&amp; stance.poll().voterCanAddOptions\" poll=\"stance.poll()\"></poll_common_add_option_button><poll_common_stance_reason stance=\"stance\"></poll_common_stance_reason><div class=\"poll-common-form-actions lmo-flex lmo-flex__space-between\"><show_results_button ng-if=\"stance.isNew()\"></show_results_button><div ng-if=\"!stance.isNew()\"></div><md-button type=\"submit\" translate=\"poll_common.vote\" aria-label=\"{{ \'poll_meeting_vote_form.vote\' | translate }}\" class=\"md-primary md-raised poll-common-vote-form__submit\"></md-button></div></form>");
$templateCache.put("generated/components/poll/meeting/votes_panel_stance/poll_meeting_votes_panel_stance.html","<div ng-if=\"stance.reason\" class=\"poll-common-votes-panel__stance\"><user_avatar user=\"stance.participant()\" size=\"small\" class=\"lmo-flex__no-shrink\"></user_avatar><div class=\"poll-common-votes-panel__stance-content\"><div class=\"poll-common-votes-panel__stance-name-and-option\"> <strong>{{ participantName() }}</strong>  <translate_button ng-if=\"stance.reason\" model=\"stance\" showdot=\"true\" class=\"lmo-card-minor-action\"></translate_button> </div><div ng-if=\"stance.reason\" class=\"poll-common-votes-panel__stance-reason\"><span ng-if=\"!translation\" marked=\"stance.reason\" class=\"lmo-markdown-wrapper\"></span><translation ng-if=\"translation\" translation=\"translation\" field=\"reason\"></translation></div></div></div>");
$templateCache.put("generated/components/poll/poll/chart_panel/poll_poll_chart_panel.html","<div class=\"poll-poll-chart-panel\"><poll_common_bar_chart_panel poll=\"poll\"></poll_common_bar_chart_panel></div>");
$templateCache.put("generated/components/poll/poll/form/poll_poll_form.html","<div class=\"poll-poll-form\"><poll_common_form_fields poll=\"poll\"></poll_common_form_fields><poll_common_form_options poll=\"poll\"></poll_common_form_options><poll_common_closing_at_field poll=\"poll\" class=\"md-input-compensate md-block\"></poll_common_closing_at_field><div class=\"md-input-compensate\"><div class=\"md-block poll-poll-form__multiple-choice poll-common-checkbox-option\"><div class=\"poll-common-checkbox-option__text md-list-item-text\"><h3 translate=\"poll_poll_form.multiple_choice\"></h3><p translate=\"poll_poll_form.multiple_choice_explained\" class=\"md-caption\"></p></div><md-checkbox ng-model=\"poll.multipleChoice\" aria-label=\"{{ \'poll_poll_form.multiple_choice\' | translate }}\"></md-checkbox></div></div><poll_common_notify_group model=\"poll\" notify-action=\"{{poll.notifyAction()}}\"></poll_common_notify_group><poll_common_voter_add_options poll=\"poll\"></poll_common_voter_add_options><poll_common_notify_on_participate poll=\"poll\"></poll_common_notify_on_participate><poll_common_anonymous poll=\"poll\"></poll_common_anonymous></div>");
$templateCache.put("generated/components/poll/poll/stance_choice/poll_poll_stance_choice.html","<div class=\"poll-common-stance-choice poll-common-stance-choice--poll\"><poll_common_stance_icon stance_choice=\"stanceChoice\"></poll_common_stance_icon> <span ng-if=\"hasVariableScore()\">{{stanceChoice.score}} -</span> <span>{{stanceChoice.pollOption().name}}</span></div>");
$templateCache.put("generated/components/poll/poll/vote_form/poll_poll_vote_form.html","<form ng-submit=\"submit()\" class=\"poll-poll-vote-form\"><poll_common_participant_form stance=\"stance\"></poll_common_participant_form><h3 translate=\"poll_common.your_response\" class=\"lmo-card-subheading\"></h3><div class=\"poll-common-vote-form__options\"><div ng-if=\"!stance.poll().multipleChoice\" class=\"poll-poll-vote-form__options\"><md-radio-group ng-model=\"vars.pollOptionId\"><md-radio-button ng-repeat=\"option in stance.poll().pollOptions() | orderBy: \'priority\' track by option.id\" ng-style=\"{\'border-color\': option.color}\" ng-value=\"option.id\" class=\"poll-common-vote-form__option poll-common-vote-form__radio-button poll-common-vote-form__border-chip\"><span class=\"poll-common-vote-form__option-name\">{{option.name}}</span></md-radio-button></md-radio-group></div><md-list ng-if=\"stance.poll().multipleChoice\" class=\"poll-poll-vote-form__options\"><md-list-item ng-repeat=\"option in stance.poll().pollOptions() | orderBy: \'priority\' track by option.id\" class=\"poll-common-vote-form__option\"><p ng-style=\"{\'border-color\': option.color}\" class=\"poll-common-vote-form__option-name poll-common-vote-form__border-chip\">{{option.name}}</p><md-checkbox ng-model=\"pollOptionIdsChecked[option.id]\" class=\"md-block poll-common-vote-form__checkbox\"></md-checkbox></md-list-item></md-list></div><validation_errors subject=\"stance\" field=\"stanceChoices\"></validation_errors><poll_common_add_option_button ng-if=\"stance.isNew() &amp;&amp; stance.poll().voterCanAddOptions\" poll=\"stance.poll()\"></poll_common_add_option_button><poll_common_stance_reason stance=\"stance\"></poll_common_stance_reason><div class=\"poll-common-form-actions lmo-flex lmo-flex__space-between\"><show_results_button ng-if=\"stance.isNew()\"></show_results_button><div ng-if=\"!stance.isNew()\"></div><md-button type=\"submit\" translate=\"poll_common.vote\" aria-label=\"{{ \'poll_poll_vote_form.vote\' | translate }}\" class=\"md-primary md-raised poll-common-vote-form__submit\"></md-button></div></form>");
$templateCache.put("generated/components/poll/proposal/chart_panel/poll_proposal_chart_panel.html","<div class=\"poll-proposal-chart-panel\"><h3 translate=\"poll_common.results\" class=\"lmo-card-subheading\"></h3><div class=\"poll-proposal-chart-panel__chart-container\"><poll_proposal_chart stance_counts=\"poll.stanceCounts\" diameter=\"200\" class=\"poll-proposal-chart-panel__chart\"></poll_proposal_chart><table role=\"presentation\" class=\"poll-proposal-chart-panel__legend\"><tbody><tr ng-repeat=\"name in pollOptionNames() track by $index\"><td><div class=\"poll-proposal-chart-panel__label poll-proposal-chart-panel__label--{{name}}\">{{ countFor(name) }} {{ translationFor(name) }}</div></td></tr></tbody></table></div></div>");
$templateCache.put("generated/components/poll/proposal/chart_preview/poll_proposal_chart_preview.html","<div class=\"poll-proposal-chart-preview\"><poll_proposal_chart stance_counts=\"stanceCounts\" diameter=\"50\" class=\"poll-common-collapsed__pie-chart\"></poll_proposal_chart><div class=\"poll-proposal-chart-preview__stance-container\"><div ng-if=\"myStance\" class=\"poll-proposal-chart-preview__stance poll-proposal-chart-preview__stance--{{myStance.pollOption().name}}\"></div><div ng-if=\"!myStance\" class=\"poll-proposal-chart-preview__stance poll-proposal-chart-preview__stance--undecided\">?</div></div></div>");
$templateCache.put("generated/components/poll/proposal/form/poll_proposal_form.html","<div class=\"poll-proposal-form\"><poll_common_form_fields poll=\"poll\"></poll_common_form_fields><poll_common_closing_at_field poll=\"poll\" class=\"md-block\"></poll_common_closing_at_field><div class=\"md-input-compensate\"><poll_common_notify_group model=\"poll\" notify-action=\"{{poll.notifyAction()}}\"></poll_common_notify_group><poll_common_notify_on_participate poll=\"poll\"></poll_common_notify_on_participate><poll_common_anonymous poll=\"poll\"></poll_common_anonymous></div></div>");
$templateCache.put("generated/components/poll/proposal/stance_choice/poll_proposal_stance_choice.html","<div class=\"poll-common-stance-choice poll-common-stance-choice--proposal\"><poll_common_stance_icon stance_choice=\"stanceChoice\"></poll_common_stance_icon><span translate=\"poll_{{stanceChoice.poll().pollType}}_options.{{stanceChoice.pollOption().name}}\" class=\"poll-common-stance-choice__option-name\"></span></div>");
$templateCache.put("generated/components/poll/proposal/vote_form/poll_proposal_vote_form.html","<form ng-submit=\"submit()\" class=\"poll-proposal-vote-form\"><poll_common_participant_form stance=\"stance\"></poll_common_participant_form><h3 translate=\"poll_common.your_response\" class=\"lmo-card-subheading\"></h3><div class=\"poll-common-vote-form__options\"><md-radio-group ng-model=\"stance.selectedOption\"><md-radio-button class=\"poll-common-vote-form__radio-button poll-common-vote-form__radio-button--{{option.name}}\" ng-repeat=\"option in stance.poll().pollOptions() | orderBy: \'priority\' track by option.id\" ng-value=\"option\" aria-label=\"{{option.name}}\"><md-tooltip md-delay=\"750\" md-direction=\"left\" class=\"poll-common-vote-form__tooltip\"><span translate=\"poll_proposal_options.{{option.name}}_meaning\"></span></md-tooltip><img ng-src=\"/img/{{option.name}}.svg\" class=\"poll-proposal-form__icon\"><span translate=\"poll_proposal_options.{{option.name}}\" class=\"poll-proposal-vote-form__chosen-option--name\"></span></md-radio-button></md-radio-group></div><validation_errors subject=\"stance\" field=\"stanceChoices\"></validation_errors><poll_common_stance_reason stance=\"stance\"></poll_common_stance_reason><div class=\"poll-common-form-actions lmo-flex lmo-flex__space-between\"><show_results_button ng-if=\"stance.isNew()\"></show_results_button><div ng-if=\"!stance.isNew()\"></div><md-button type=\"submit\" translate=\"poll_common.vote\" class=\"md-primary md-raised poll-common-vote-form__submit\"></md-button></div></form>");
$templateCache.put("generated/components/poll/ranked_choice/chart_panel/poll_ranked_choice_chart_panel.html","<div class=\"poll-ranked-choice-chart-panel\"><poll_common_ranked_choice_chart poll=\"poll\"></poll_common_ranked_choice_chart></div>");
$templateCache.put("generated/components/poll/ranked_choice/form/poll_ranked_choice_form.html","<div class=\"poll-ranked-choice-form\"><poll_common_form_fields poll=\"poll\"></poll_common_form_fields><poll_common_form_options poll=\"poll\"></poll_common_form_options><poll_common_closing_at_field poll=\"poll\" class=\"md-input-compensate md-block\"></poll_common_closing_at_field><div class=\"md-input-compensate\"><md-input-container layout=\"row\" class=\"lmo-flex lmo-flex__center\"><div class=\"poll-common-checkbox-option__text md-list-item-text lmo-flex__grow\"><h3 translate=\"poll_ranked_choice_form.minimum_stance_choices\"></h3><p translate=\"poll_ranked_choice_form.minimum_stance_choices_helptext\" class=\"md-caption\"></p><validation_errors subject=\"poll\" field=\"minimumStanceChoices\"></validation_errors></div><input type=\"number\" min=\"1\" ng-model=\"poll.customFields.minimum_stance_choices\" class=\"lmo-number-input\"></md-input-container></div><poll_common_notify_group model=\"poll\" notify-action=\"{{poll.notifyAction()}}\"></poll_common_notify_group><poll_common_voter_add_options poll=\"poll\"></poll_common_voter_add_options><poll_common_notify_on_participate poll=\"poll\"></poll_common_notify_on_participate><poll_common_anonymous poll=\"poll\"></poll_common_anonymous></div>");
$templateCache.put("generated/components/poll/ranked_choice/stance_choice/poll_ranked_choice_stance_choice.html","<div class=\"poll-common-stance-choice poll-common-stance-choice--ranked-choice\"><poll_common_stance_icon stance_choice=\"stanceChoice\"></poll_common_stance_icon> <span>{{stanceChoice.rank}} - {{stanceChoice.pollOption().name}}</span> </div>");
$templateCache.put("generated/components/poll/ranked_choice/vote_form/poll_ranked_choice_vote_form.html","<div class=\"poll-ranked-choice-vote-form lmo-relative\"><poll_common_participant_form stance=\"stance\"></poll_common_participant_form><h3 translate=\"poll_common.your_response\" class=\"lmo-card-subheading\"></h3><p translate=\"poll_ranked_choice_vote_form.helptext\" translate-value-count=\"{{numChoices}}\" class=\"lmo-hint-text\"></p><div sv-root=\"true\" layout=\"row\" class=\"lmo-flex\"><md-list layout=\"column\" class=\"lmo-flex\"><md-list-item ng-repeat=\"option in pollOptions | orderBy: \'priority\' track by option.id\" class=\"poll-ranked-choice-vote-form__ordinal\"><span ng-if=\"$index &lt; numChoices\">{{$index+1}}</span></md-list-item></md-list><md-list layout=\"column\" sv-part=\"pollOptions\" class=\"lmo-flex lmo-flex__grow\"><md-list-item ng-click=\"setSelected(option)\" sv-element=\"true\" layout=\"row\" ng-class=\"{\'poll-common-vote-form__option--selected\': isSelected(option)}\" ng-repeat=\"option in pollOptions track by option.id\" class=\"poll-common-vote-form__option lmo-flex lmo-pointer lmo-flex__space-between\"><div ng-style=\"{\'border-color\': option.color}\" class=\"poll-common-vote-form__option-name poll-common-vote-form__border-chip lmo-flex__grow\">{{option.name}}</div><i class=\"mdi mdi-drag poll-ranked-choice-vote-form__drag-handle\"></i></md-list-item></md-list></div><validation_errors subject=\"stance\" field=\"stanceChoices\"></validation_errors><poll_common_add_option_button ng-if=\"stance.isNew() &amp;&amp; stance.poll().voterCanAddOptions\" poll=\"stance.poll()\"></poll_common_add_option_button><poll_common_stance_reason stance=\"stance\"></poll_common_stance_reason><div class=\"poll-common-form-actions lmo-flex lmo-flex__space-between\"><show_results_button ng-if=\"stance.isNew()\"></show_results_button><div ng-if=\"!stance.isNew()\"></div><md-button ng-click=\"submit()\" translate=\"poll_common.vote\" aria-label=\"{{ \'poll_poll_vote_form.vote\' | translate }}\" class=\"md-primary md-raised poll-common-vote-form__submit\"></md-button></div></div>");
$templateCache.put("generated/components/poll/common/add_option/button/poll_common_add_option_button.html","<div class=\"poll-common-add-option-button lmo-flex lmo-flex__space-between\"><div></div><md-button ng-click=\"open()\" translate=\"poll_common_add_option.button.add_option\"></md-button></div>");
$templateCache.put("generated/components/poll/common/add_option/form/poll_common_add_option_form.html","<div class=\"poll-common-add-option-form\"><poll_common_form_options poll=\"poll\"></poll_common_form_options><div class=\"lmo-flex lmo-flex__space-between md-input-compensate\"><div></div><md-button ng-click=\"submit()\" translate=\"poll_common_add_option.form.add_options\" class=\"md-raised md-primary\"></md-button></div></div>");
$templateCache.put("generated/components/poll/common/add_option/modal/poll_common_add_option_modal.html","<md-dialog class=\"poll-common-modal\"><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><i class=\"mdi mdi-lightbulb-on-outline\"></i><h1 translate=\"poll_common_add_option.modal.title\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content\"><div ng-show=\"isDisabled\" class=\"lmo-disabled-form\"></div><poll_common_add_option_form poll=\"poll\"></poll_common_add_option_form></div></md-dialog>");
$templateCache.put("generated/components/poll/common/publish/facebook_preview/poll_common_publish_facebook_preview.html","<div class=\"poll-common-publish-facebook-preview\"><div layout=\"row\" class=\"poll-common-publish-facebook-preview__title lmo-flex\"><img ng-src=\"{{community.identity().logo}}\" class=\"poll-common-publish-facebook-preview__image\"><div layout=\"column\" class=\"lmo-flex\"><div> <span class=\"poll-common-publish-facebook-preview__link\">{{community.identity().name}}</span>  <span translate=\"poll_common_publish_facebook_preview.shared_a\"></span>  <span translate=\"poll_common_publish_facebook_preview.link\" class=\"poll-common-publish-facebook-preview__link\"></span> </div><div> <abbr translate=\"poll_common_publish_facebook_preview.just_now\" class=\"poll-common-publish-facebook-preview__abbr\"></abbr> <abbr class=\"poll-common-publish-facebook-preview__abbr\">· Loomio</abbr></div></div></div><div class=\"poll-common-publish-facebook-preview__message\">{{ message }}</div><div class=\"poll-common-publish-facebook-preview__preview\"><div class=\"poll-common-publish-facebook-preview__poll-title\">{{ poll.title }}</div><div class=\"poll-common-publish-facebook-preview__poll-details\">{{ poll.details }}</div><div class=\"poll-common-publish-facebook-preview__host\">{{ host() }}</div></div></div>");
$templateCache.put("generated/components/poll/common/publish/slack_preview/poll_common_publish_slack_preview.html","<div layout=\"row\" class=\"poll-common-publish-slack-preview lmo-flex\"><div class=\"poll-common-publish-slack-preview__avatar\"><img ng-src=\"https://s3-us-west-2.amazonaws.com/slack-files2/bot_icons/2017-03-29/161925077303_48.png\"></div><div class=\"poll-common-publish-slack-preview__content\"><div class=\"poll-common-publish-slack-preview__title\"> <strong class=\"poll-common-publish-slack-preview__loomio-bot\">Loomio Bot</strong>  <span class=\"poll-common-publish-slack-preview__app\">APP</span>  <span class=\"poll-common-publish-slack-preview__title-timestamp\">{{ timestamp() }}</span> </div><div class=\"poll-common-publish-slack-preview__published\"></div><div class=\"poll-common-publish-slack-preview__message\">{{ message }}</div><div layout=\"row\" class=\"poll-common-publish-slack-preview__attachment lmo-flex\"><div class=\"poll-common-publish-slack-preview__bar\"></div><div class=\"poll-common-publish-slack-preview__poll\"><div class=\"poll-common-publish-slack-preview__author\">{{ userName }}</div><div class=\"poll-common-publish-slack-preview__poll-title\">{{ poll.title }}</div><div ng-if=\"poll.details\" class=\"poll-common-publish-slack-preview__poll-details\">{{ poll.details | truncate }}</div><div translate=\"poll_common_publish_slack_preview.view_it_on_loomio\" translate-values=\"{site_name: siteName}\" class=\"poll-common-publish-slack-preview__view-it\"></div><div translate=\"poll_common_publish_slack_preview.timestamp\" translate-value-timestamp=\"{{timestamp()}}\" class=\"poll-common-publish-slack-preview__timestamp\"></div><div layout=\"row\" class=\"poll-common-publish-slack-preview__options lmo-flex\"><div ng-repeat=\"option in poll.pollOptions()\" class=\"poll-common-publish-slack-preview__option\">{{ option.displayName }}</div></div></div></div></div></div>");
$templateCache.put("generated/components/poll/common/share/email_form/poll_common_share_email_form.html","<section><div class=\"lmo-flex\"><h3 translate=\"poll_common_share_form.invite_visitor\" class=\"lmo-h3\"></h3><help_bubble helptext=\"poll_common_share_form.invite_visitor_helptext\"></help_bubble></div><md-list class=\"md-block\"><md-list-item ng-if=\"poll.customFields.pending_emails.length\" layout=\"column\" class=\"poll-common-share-form__emails\"><div ng-repeat=\"email in poll.customFields.pending_emails track by $index\" class=\"poll-common-share-form__visitor lmo-flex\"><div class=\"poll-common-share-form__email lmo-flex__grow\">{{email}}</div><md-button ng-click=\"remove(email)\" class=\"lmo-inline-action\"><i class=\"mdi mdi-close\"></i></md-button></div></md-list-item><md-list-item flex=\"true\" layout=\"row\" class=\"poll-common-share-form__add-option\"><md-input-container md-no-float=\"true\" class=\"lmo-flex__grow\"><input type=\"text\" placeholder=\"{{ \'poll_common_share_form.enter_email\' | translate }}\" ng-model=\"newEmail\" class=\"poll-common-share-form__add-option-input\"></md-input-container><md-button ng-click=\"addIfValid()\" ng-disabled=\"poll.customFields.pending_emails.length == 0\" aria-label=\"{{ \'poll_common_share_form.enter_email\' | translate }}\" class=\"poll-common-share-form__option-button poll-common-share-form__add-button\"><i class=\"mdi mdi-plus\"></i></md-button></md-list-item><div class=\"lmo-validation-error\">{{ emailValidationError }}</div></md-list><div class=\"lmo-flex lmo-flex__space-between\"><div></div><md-button ng-disabled=\"poll.processing || poll.customFields.pending_emails.length == 0\" ng-click=\"submit()\" aria-label=\"{{ \'poll_common_share_form.send_email\' | translate }}\" class=\"md-primary md-raised poll-common-share-form__button poll-common-share-form__option-button\"><span translate=\"poll_common_share_form.send_email\"></span></md-button></div></section>");
$templateCache.put("generated/components/poll/common/share/form/poll_common_share_form.html","<div class=\"poll-common-share-form\"><poll_common_share_group_form poll=\"poll\" ng-if=\"hasGroups()\" class=\"poll-common-share-form__form\"></poll_common_share_group_form><poll_common_share_link_form poll=\"poll\" class=\"poll-common-share-form__form\"></poll_common_share_link_form><poll_common_share_email_form poll=\"poll\" ng-if=\"hasPendingEmails()\" class=\"poll-common-share-form__form\"></poll_common_share_email_form><poll_common_share_visitor_form poll=\"poll\" ng-if=\"!hasPendingEmails()\" class=\"poll-common-share-form__form\"></poll_common_share_visitor_form></div>");
$templateCache.put("generated/components/poll/common/share/form_actions/poll_common_share_form_actions.html","<div class=\"lmo-md-action\"><md-button ng-click=\"$emit(\'$close\')\" translate=\"common.action.done\" class=\"invitation-form__submit md-raised md-primary\"></md-button></div>");
$templateCache.put("generated/components/poll/common/share/group_form/poll_common_share_group_form.html","<section><div class=\"lmo-flex\"><h3 translate=\"poll_common_share_form.share_group\" class=\"lmo-h3\"></h3><help_bubble helptext=\"poll_common_share_form.share_group_helptext\"></help_bubble></div><div class=\"lmo-flex\"><md-input-container class=\"md-block lmo-flex__grow poll-common-share-form__group-select\"><md-select ng-model=\"poll.groupId\" ng-disabled=\"poll.discussionId\" aria-label=\"{{ \'poll_common_share_group_form.loomio_group\' | translate }}\"><md-option ng-value=\"null\">{{ \'poll_common_select_group.loomio_group_placeholder\' | translate }}</md-option><md-option ng-repeat=\"group in groups() | orderBy:\'fullName\'\" ng-value=\"group.id\">{{ group.fullName }}</md-option></md-select></md-input-container><md-button ng-disabled=\"poll.groupId == groupId\" ng-click=\"submit()\" aria-label=\"{{ \'poll_common_share_form.set_group\' | translate }}\" class=\"md-primary md-raised poll-common-share-form__button poll-common-share-form__option-button\"><span translate=\"poll_common_share_form.set_group\"></span></md-button></div><poll_common_notify_group model=\"poll\" notify-action=\"publish\" ng-if=\"poll.groupId != groupId\"></poll_common_notify_group><p ng-if=\"groupId &amp;&amp; groupId != poll.groupId\" translate=\"poll_common_share_form.move_group_helptext\" class=\"lmo-hint-text\"></p><p ng-if=\"poll.discussionId\" translate=\"poll_common_share_form.cannot_move_poll_helptext\" translate-value-discussion=\"{{poll.discussion().title}}\" translate-value-group=\"{{poll.group().name}}\" class=\"lmo-hint-text\"></p></section>");
$templateCache.put("generated/components/poll/common/share/link_form/poll_common_share_link_form.html","<section><div class=\"lmo-flex\"><h3 translate=\"poll_common_share_form.share_a_link\" class=\"lmo-h3\"></h3><help_bubble helptext=\"poll_common_share_form.share_a_link_helptext\"></help_bubble></div><md-list class=\"md-block\"><div class=\"lmo-flex\"><md-list-item class=\"lmo-flex__grow lmo-flex lmo-flex__center\"><md-checkbox ng-model=\"poll.anyoneCanParticipate\" ng-change=\"setAnyoneCanParticipate()\"></md-checkbox><p translate=\"poll_common_share_form.anyone_can_participate\"></p></md-list-item><md-button type=\"button\" title=\"{{ \'common.copy\' | translate }}\" clipboard=\"true\" text=\"shareableLink\" on-copied=\"copied()\" ng-disabled=\"!poll.anyoneCanParticipate\" class=\"md-primary md-raised poll-common-share-form__button\"><span translate=\"poll_common_share_form.get_link\"></span></md-button></div></md-list></section>");
$templateCache.put("generated/components/poll/common/share/visitor_form/poll_common_share_visitor_form.html","<section><div class=\"lmo-flex\"><h3 translate=\"poll_common_share_form.invite_visitor\" class=\"lmo-h3\"></h3><help_bubble helptext=\"poll_common_share_form.invite_visitor_helptext\"></help_bubble></div><md-list class=\"md-block\"><md-list-item ng-if=\"invitations().length\" layout=\"column\" class=\"poll-common-share-form__emails\"><div ng-repeat=\"invitation in invitations() | orderBy: \'updatedAt\'\" class=\"poll-common-share-form__visitor lmo-flex\"><div class=\"poll-common-share-form__email lmo-flex__grow\">{{invitation.recipientEmail}}</div><md-button ng-click=\"remind(visitor)\" ng-if=\"!invitation.reminded &amp;&amp; !invitation.processing\" class=\"lmo-inline-action\"><i class=\"mdi mdi-redo\"></i></md-button><loading ng-if=\"invitation.processing\"></loading><span ng-if=\"invitation.reminded\" translate=\"poll_common_share_form.reminded\" class=\"poll-common-share-form__reminded\"></span><md-button ng-if=\"!poll.anyoneCanParticipate\" ng-click=\"revoke(invitation)\" class=\"lmo-inline-action\"><i class=\"mdi mdi-clear\"></i></md-button></div></md-list-item><md-list-item flex=\"true\" layout=\"row\" class=\"poll-common-share-form__add-option\"><md-input-container md-no-float=\"true\" class=\"lmo-flex__grow\"><input type=\"text\" ng-disabled=\"newInvitation.processing\" placeholder=\"{{ \'poll_common_share_form.enter_email\' | translate }}\" ng-model=\"newInvitation.recipientEmail\" class=\"poll-common-share-form__add-option-input\"></md-input-container><div><loading ng-if=\"newInvitation.processing\" class=\"lmo-inline-action\"></loading><md-button ng-if=\"!newInvitation.processing\" ng-disabled=\"!newInvitation.recipientEmail\" ng-click=\"submit()\" aria-label=\"{{ \'poll_common_share_form.add_email_placeholder\' | translate }}\" class=\"md-primary md-raised poll-common-share-form__button poll-common-share-form__option-button\"><span translate=\"poll_common_share_form.send_email\"></span></md-button></div></md-list-item><div class=\"lmo-validation-error\">{{ emailValidationError }}</div></md-list></section>");
$templateCache.put("generated/components/poll/common/undecided/panel/poll_common_undecided_panel.html","<div class=\"poll-common-undecided-panel\"><md-button ng-if=\"canShowUndecided()\" ng-click=\"showUndecided()\" translate=\"poll_common_undecided_panel.show_undecided\" translate-value-count=\"{{poll.undecidedCount}}\" class=\"md-accent poll-common-undecided-panel__button\"></md-button><div ng-if=\"showingUndecided\" class=\"poll-common-undecided-panel__panel poll-common-undecided-panel__users\"><h3 translate=\"poll_common_undecided_panel.undecided_users\" translate-value-count=\"{{poll.undecidedCount}}\" class=\"lmo-card-subheading\"></h3><poll_common_undecided_user user=\"user\" poll=\"poll\" ng-repeat=\"user in poll.undecided()\"></poll_common_undecided_user><poll_common_undecided_user ng-if=\"canSharePoll()\" user=\"user\" ng-repeat=\"user in poll.guestGroup().pendingInvitations()\"></poll_common_undecided_user><p ng-if=\"!canSharePoll()\"><span ng-if=\"poll.guestGroup().pendingInvitationsCount == 1\" translate=\"poll_common_undecided_panel.invitation_count_singular\" class=\"lmo-hint-text\"></span><span ng-if=\"poll.guestGroup().pendingInvitationsCount &gt; 1\" translate=\"poll_common_undecided_panel.invitation_count_plural\" translate-value-count=\"{{poll.guestGroup().pendingInvitationsCount}}\" class=\"lmo-hint-text\"></span></p><div ng-if=\"moreMembershipsToLoad()\"><md-button translate=\"common.action.load_more\" aria-label=\"common.action.load_more\" ng-click=\"loadMemberships()\" class=\"md-accent\"></md-button></div><div ng-if=\"!moreMembershipsToLoad() &amp;&amp; moreInvitationsToLoad() &amp;&amp; canSharePoll()\"><md-button translate=\"poll_common_undecided_panel.show_invitations\" aria-label=\"common.action.load_more\" ng-click=\"showUndecided()\" class=\"md-accent poll-common-undecided-panel__show-invitations\"></md-button><md-button ng-if=\"loaders.invitations.numLoaded &gt; 0\" translate=\"common.action.load_more\" aria-label=\"common.action.load_more\" ng-click=\"loadInvitations()\" class=\"md-accent\"></md-button></div></div></div>");
$templateCache.put("generated/components/poll/common/undecided/user/poll_common_undecided_user.html","<div layout=\"row\" class=\"poll-common-undecided-user lmo-flex lmo-flex__center\"><user_avatar user=\"user\" size=\"small\"></user_avatar><span class=\"poll-common-undecided-user__name lmo-flex__grow\">{{ user.name || user.email }}</span><div ng-if=\"!resendExecuting &amp;&amp; !remindExecuting\" class=\"poll-common-undecided-user__action\"><div ng-if=\"user.reminded\" class=\"poll-common-undecided-user--reminded\"><p translate=\"poll_common_undecided_user.reminded\" class=\"lmo-hint-text\"></p></div><div ng-if=\"!user.reminded\" class=\"poll-common-undecided-user--unreminded\"><md-button ng-click=\"resend()\" ng-if=\"user.constructor.singular == \'invitation\'\" translate=\"common.action.resend\" class=\"md-accent poll-common-undecided-user__resend\"></md-button><md-button ng-click=\"remind()\" ng-if=\"user.constructor.singular == \'user\'\" translate=\"common.action.remind\" class=\"md-accent poll-common-undecided-user__remind\"></md-button></div></div><loading ng-if=\"resendExecuting || remindExecuting\"></loading></div>");
$templateCache.put("generated/components/poll/common/unsubscribe/form/poll_common_unsubscribe_form.html","<div class=\"poll-common-unsubscribe-form\"><div class=\"md-list-item-text lmo-flex lmo-flex__space-between\"><div class=\"poll-common-checkbox-option__text\"><h3 class=\"lmo-h3\"><span translate=\"poll_common_unsubscribe_form.label\"></span></h3><p translate=\"poll_common_unsubscribe_form.helptext_on\" ng-if=\"poll.subscribed\" class=\"md-caption\"></p><p translate=\"poll_common_unsubscribe_form.helptext_off\" ng-if=\"!poll.subscribed\" class=\"md-caption\"></p></div><md-checkbox ng-model=\"poll.subscribed\" ng-change=\"toggle()\"></md-checkbox></div></div>");
$templateCache.put("generated/components/poll/common/unsubscribe/modal/poll_common_unsubscribe_modal.html","<md-dialog class=\"poll-common-modal\"><md-toolbar><div class=\"md-toolbar-tools lmo-flex__space-between\"><i class=\"mdi mdi-email-outline\"></i><h1 translate=\"poll_common_unsubscribe_form.title\" class=\"lmo-h1\"></h1><material_modal_header_cancel_button></material_modal_header_cancel_button></div></md-toolbar><div class=\"md-dialog-content\"><poll_common_unsubscribe_form poll=\"poll\"></poll_common_unsubscribe_form></div></md-dialog>");}]);