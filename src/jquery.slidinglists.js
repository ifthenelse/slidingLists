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
            wrapper: ".list-wrapper",
            container: ".list-body-container ul",
            back: "a.back-link",
            links: "a.list-link",
            parentList: "parent-list",
            activeList: "active-list",
            activeLink: "active-link"
        };

    // The actual plugin constructor
    function Plugin(element, options) {
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
        createMarkup: function () {
            console.log("createMarkup");
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

            this.createMarkup();

            this.$wrapper = this.$element.parent(".list-wrapper");
            this.$back = this.$wrapper.find("a.back-link");
            this.$lists = this.$wrapper.find(".list-body-container ul")
            this.$links = this.$lists.find("a.list-link");
            this.$listPath = [this.$lists.filter(".active-list").eq(0)];

            // click on back button
            this.$back.on("click", this.onBackClick);

            // click on list links
            this.$links.on("click", this.onLinkClick);

            console.log("init");
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
