/*
 * flexselect: a jQuery plugin, version: 0.1 (02/03/2009)
 * @requires jQuery v1.3 or later
 *
 * FlexSelect is a jQuery plugin that makes it easy to convert a select box into
 * a Quicksilver-style, autocompleting, flex matching selection tool.
 *
 * For usage and examples, visit:
 * http://rmm5t.github.com/jquery-flexselect/
 *
 * Licensed under the MIT:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2009, Ryan McGeary (ryanonjavascript -[at]- mcgeary [*dot*] org)
 */
(function($) {
  $.flexselect = function(select, options) { this.init(select, options); };

  $.extend($.flexselect.prototype, {
    settings: {
      selectedClass: "flexselect_selected",
      dropdownClass: "flexselect_dropdown",
      inputIdTransform:    function(id) { return id + "_flexselect"; },
      dropdownIdTransform: function(id) { return id + "_flexselect_dropdown"; }
    },
    select: null,
    input: null,
    hidden: null,
    dropdown: null,
    cache: [],
    results: [],
    lastAbbreviation: null,
    abbreviationBeforeFocus: null,
    selectedIndex: 0,

    init: function(select, options) {
      $.extend(this.settings, options);
      this.select = $(select);
      this.preloadCache();
      this.renderControls();
      this.wire();
    },

    preloadCache: function() {
      this.cache = this.select.children("option").map(function() {
        return { name: $.trim($(this).text()), value: $(this).val(), score: 0.0 };
      });
    },

    renderControls: function() {
      var selected = this.select.children("option:selected");

      this.hidden = $("<input type='hidden'/>").attr({
        id: this.select.attr("id"),
        name: this.select.attr("name")
      }).val(selected.val());

      this.input = $("<input type='text' autocomplete='off' />").attr({
        id: this.settings.inputIdTransform(this.select.attr("id")),
        accesskey: this.select.attr("accesskey"),
        tabindex: this.select.attr("tabindex"),
        style: this.select.attr("style")
      }).addClass(this.select.className).val($.trim(selected.text()));

      this.dropdown = $("<div><ul></ul></div>").attr({
        id: this.settings.dropdownIdTransform(this.select.attr("id"))
      }).addClass(this.settings.dropdownClass);

      this.select.after(this.dropdown).after(this.input).after(this.hidden).remove();
    },

    wire: function() {
      var self = this;

      this.input.focus(function() {
        self.abbreviationBeforeFocus = self.input.val();
        self.filterResults();
      });

      this.input.blur(function() {
        self.dropdown.hide();
        self.lastAbbreviation = null;
      });

      this.input.keyup(function(event) {
        switch (event.keyCode) {
    			case 13: // return
  			    event.preventDefault();
            self.pickSelected();
            self.input.focus().select();
            self.dropdown.hide();
            break;
    			case 27: // esc
            // reset the result back to the original
            self.input.val(self.abbreviationBeforeFocus);
            self.input.focus().select();
            self.dropdown.hide();
            break;
    		  default:
            self.filterResults();
            break;
        }
      });

      this.input.keydown(function(event) {
        switch (event.keyCode) {
    		  case 9:  // tab
            if (self.input.val().length > 0) self.pickSelected();
            break;
    			case 33: // pgup
            event.preventDefault();
            self.markFirst();
            break;
          case 34: // pgedown
            event.preventDefault();
            self.markLast();
            break;
    			case 38: // up
            event.preventDefault();
            self.moveSelected(-1);
            break;
    			case 40: // down
            event.preventDefault();
            self.moveSelected(1);
            break;
        }
      });
    },

    filterResults: function() {
      var abbreviation = this.input.val();
      if (abbreviation == this.lastAbbreviation) return;

      var results = [];
      $.each(this.cache, function() {
        this.score = this.name.toLowerCase().score(abbreviation.toLowerCase());
        if (this.score > 0.0) results.push(this);
      });
      this.results = results;

      this.sortResults();
      this.renderDropdown();
      this.markFirst();
      this.lastAbbreviation = abbreviation;
    },

    sortResults: function() {
      this.results.sort(function(a, b) { return b.score - a.score; });
    },

    renderDropdown: function() {
      var dropdownBorderWidth = this.dropdown.outerWidth() - this.dropdown.innerWidth();
      this.dropdown.css({
        width: (this.input.outerWidth() - dropdownBorderWidth) + "px",
    		top: (this.input.offset().top + this.input.outerHeight()) + "px",
    		left: this.input.offset().left + "px"
      });

      var list = this.dropdown.children("ul").html("");
      $.each(this.results, function() {
        list.append($("<li/>").html(this.name + " <small>[" + Math.round(this.score*100)/100 + "]</small>"));
      });
      this.dropdown.show();
    },

    markSelected: function(n) {
      if (n < 0 || n > this.results.length) return;

      var rows = this.dropdown.find("li");
      rows.removeClass(this.settings.selectedClass);
      $(rows[n]).addClass(this.settings.selectedClass);
      this.selectedIndex = n;
    },

    pickSelected: function() {
      var selected = this.results[this.selectedIndex];
      if (selected) {
        this.input.val(selected.name);
        this.hidden.val(selected.value);
      }
    },

    markFirst:    function(n) { this.markSelected(0); },
    markLast:     function(n) { this.markSelected(this.results.length - 1); },
    moveSelected: function(n) { this.markSelected(this.selectedIndex+n); }
  });

  $.fn.flexselect = function(options) {
    this.each(function() {
      if (this.tagName == "SELECT") new $.flexselect(this, options);
    });
    return this;
  };
})(jQuery);
