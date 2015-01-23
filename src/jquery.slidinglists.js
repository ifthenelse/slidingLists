// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;
(function($, window, document, undefined) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "slidingLists",
        defaults = {
            wrapper: "list-wrapper",
            container: "list-container",
            body_container: "list-body-container",
            back: "back-link",
            links: "list-link",
            parentList: "parent-list",
            activeList: "active-list",
            activeLink: "active-link"
        };
    var _s = null;

    // The actual plugin constructor
    function Plugin(element, options) {
        _s = this;
        this.$element = $(element);
        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.$wrapper = null;
        this.$back = null;
        this.$lists = null;
        this.$links = null;
        this.$listPath = null;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        onBackClick: function(e) {
            e.preventDefault();
            e.stopPropagation();

            if ($listPath.length < 2) {
                return false;
            }

            var $cl = $listPath.pop();

            $cl.removeClass("active-list");
            $listPath.last().removeClass("parent-list");
            $cl.siblings(".list-link").removeClass("active-link");

            window.setTimeout(function() {
                $cl.addClass("hidden");
            }, 310);
        },
        onLinkClick: function(e) {
            e.preventDefault();
            e.stopPropagation();

            var $link = $(this);
            var $list = $($link.attr("href"));

            if (!$list.length) {
                return false;
            }

            $link.addClass("active-link");
            $list.removeClass("hidden");

            window.setTimeout(function() {
                $list.addClass("active-list");
            }, 10);

            $listPath.last().addClass("parent-list");
            $listPath.push($list);
        },
        createMarkup: function() {
            if (!this.$element.length) {
                return false;
            }

            this.$element.wrap('<div class="' + this.settings.wrapper + '"><div class="' + this.settings.container + '"><div class="' + this.settings.body_container + '">');

            this.$element.trigger("slidingLists.createMarkup");
        },
        create: function(e) {
            // cache variables
            try {
                _s.$wrapper = _s.$element.parent(".list-wrapper");
                _s.$back = _s.$wrapper.find("a.back-link");
                _s.$lists = _s.$wrapper.find(".list-body-container ul")
                _s.$links = _s.$lists.find("a.list-link");
                _s.$listPath = [_s.$lists.filter(".active-list").eq(0)];
            } catch (err) {
                $.error(err.message);
                return false;
            }
            // click on back button
            _s.$back.on("click", _s.onBackClick);

            // click on list links
            _s.$links.on("click", _s.onLinkClick);

            _s.$element.trigger("slidingLists.complete");

            console.log("create");
        },
        init: function() {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.settings
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.settings).

            // Extend Array methods
            if (!Array.prototype.last) {
                Array.prototype.last = function() {
                    return this[this.length - 1];
                };
            };

            this.$doc = $(document);
            this.$win = $(window);
            this.$html = $("html");
            this.$body = $("body");

            this.$element.one("slidingLists.createMarkup", this.create);

            this.createMarkup();
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
