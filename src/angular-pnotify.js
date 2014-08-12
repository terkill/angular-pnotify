angular.module('jlareau.pnotify', [])

    .provider('notificationService', [ function() {

        var settings = {
            styling: 'bootstrap3'
        };

        var stacks = {};
        var defaultStack = false;

        var initHash = function(stackName) {
            var hash = angular.copy(settings);

            if ((stackName || (stackName = defaultStack)) && stackName in stacks) {
                hash.stack = stacks[stackName].stack;

                if (stacks[stackName].addclass) {
                    hash.addclass = 'addclass' in hash ? hash.addclass + ' ' + stacks[stackName].addclass : stacks[stackName].addclass;
                }
            }

            return hash;
        }

        this.setDefaults = function(defaults) {
            settings = defaults
        };

        this.setStack = function(name, addclass, stack) {
            if (angular.isObject(addclass)) {
                stack = addclass;
                addclass = false;
            }

            stacks[name] = {
                stack: stack,
                addclass: addclass
            };
        };

        this.setDefaultStack = function(name) {
            defaultStack = name;
        };

        this.$get = ['$templateCache', '$scope', '$q', function($templateCache, $scope) {

            return {

                /* ========== SETTINGS RELATED METHODS =============*/

                getSettings: function() {
                    return settings;
                },

                /* ============== NOTIFICATION METHODS ==============*/

                notice: function(content, stack) {
                    var hash = initHash(stack);
                    hash.type = 'notice';
                    hash.text = content;
                    return this.notify(hash);
                },

                info: function(content, stack) {
                    var hash = initHash(stack);
                    hash.type = 'info';
                    hash.text = content;
                    return this.notify(hash);
                },

                success: function(content, stack) {
                    var hash = initHash(stack);
                    hash.type = 'success';
                    hash.text = content;
                    return this.notify(hash);
                },

                error: function(content, stack) {
                    var hash = initHash(stack);
                    hash.type = 'error';
                    hash.text = content;
                    return this.notify(hash);
                },

                notifyWithDefaults: function(options, stack) {
                    var defaults = initHash(stack);
                    var combined = angular.extend(defaults, options);
                    return this.notify(combined);
                },

                notify: function(hash) {
                    if(hash.templateUrl) {
                        return
                            $http.get(url, { cache: $templateCache })
                                .then(function(response) {
                                    hash.text = response.data;
                                    var pnotify = new PNotify(hash);
                                    $compile(pnotify.get())(hash.scope || {});
                                    return pnotify;
                                });
                    }
                    else
                        return $q.when(new PNotify(hash));
                }

            };

        }];

    }]);
