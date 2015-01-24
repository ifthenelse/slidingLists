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
            title: "List title",
            wrapper: "list-wrapper",
            container: "list-container",
            header_container: "list-header-container",
            body_container: "list-body-container",
            back: "back-link",
            links: "list-link",
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
        this._defaults = defaults,
            this._name = pluginName,
            this.$parent = null,
            this.$wrapper = null,
            this.$container = null,
            this.$header_container = null,
            this.$body_container = null,
            this.$back = null,
            this.$lists = null,
            this.$links = null,
            this.$listPath = null;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        onBackClick: function(el) {
            if (this.$listPath.length < 2) {
                return false;
            }

            var $cl = this.$listPath.pop();

            $cl.removeClass(this.settings.activeList);
            this.$listPath.last().removeClass(this.settings.parentList);
            $cl.siblings(this.settings.links).removeClass(this.settings.activeLink);

            window.setTimeout(function() {
                $cl.addClass("hidden");
            }, 310);
        },
        onLinkClick: function(el) {
            var $link = $(el);
            var $list = $((!$link.attr("href").length) ? $link.attr("href") : $link.siblings("ul").eq(0));
            var _this = this;

            if (!$list.length) {
                return false;
            }

            $link.addClass(this.settings.activeLink);
            $list.removeClass("hidden");

            window.setTimeout(function() {
                $list.addClass(_this.settings.activeList);
            }, 10);

            this.$listPath.last().addClass(this.settings.parentList);
            this.$listPath.push($list);
        },
        createListMarkup: function() {
            // remove this element from the DOM
            this.$element.detach();

            //  add main structure
            this.$element.addClass(this.settings.activeList).wrap('<div class="' + this.settings.wrapper + '"><div class="' + this.settings.container + '"><div class="' + this.settings.body_container + '">').end().addClass(this.settings.activeList);
            var $tmp_wrap = this.$element.parents('.' + this.settings.wrapper).eq(0);
            $tmp_wrap.prepend('<div class="' + this.settings.header_container + '"><a href="" class="' + this.settings.back + '">&lt;</a><h3>' + this.settings.title + '</h3></div>');

            this.$parent.append($tmp_wrap);
        },
        eventsInit: function() {
            var _this = this;
            // click on back button
            this.$back.on("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                _this.onBackClick(this);
                console.log("< ", _this.$listPath);
            });

            // click on list links
            this.$links.on("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                _this.onLinkClick(this);
                console.log("> ", _this.$listPath);
            });
        },
        init: function() {
            if (!this.$element.length) {
                return false;
            }

            // add last() method to Array objects
            if (!Array.prototype.last) {
                Array.prototype.last = function() {
                    return this[this.length - 1];
                };
            };

            this.$doc = $(document);
            this.$win = $(window);
            this.$html = $("html");
            this.$body = $("body");
            this.$parent = this.$element.parent();

            this.createListMarkup();

            this.$wrapper = this.$element.parents("." + this.settings.wrapper).eq(0);
            this.$container = this.$wrapper.find("." + this.settings.container);
            this.$header_container = this.$wrapper.find("." + this.settings.header_container);
            this.$body_container = this.$wrapper.find("." + this.settings.body_container);
            this.$back = this.$header_container.find("." + this.settings.back);
            this.$lists = this.$body_container.find('ul');
            this.$links = this.$lists.find('a');
            this.$links.addClass(this.settings.links);
            this.$listPath = [this.$lists.filter('.' + this.settings.activeList).eq(0)];

            this.eventsInit();
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
