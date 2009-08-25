# flexselect: a jQuery plugin

FlexSelect is a jQuery plugin that turns select boxes into flex-matching
incremental-finding controls.

Flex matching a few keystrokes against longer strings is a boon in productivity
for typists.  Applications like Quicksilver, LaunchBar, and Launchy have made
this method of keyboard entry a popular one.  It's time to bring this same
functionality to web controls.  FlexSelect does that for select boxes.

## Usage

First, load [jQuery](http://jquery.com/), the
[LiquidMetal](http://github.com/rmm5t/liquidmetal/) scoring algorithm, and the
plugin:

    <script src="jquery.min.js" type="text/javascript"></script>
    <script src="liquidmetal.js" type="text/javascript"></script>
    <script src="jquery.flexselect.js" type="text/javascript"></script>

Now, let's attach it to your select boxes on DOM ready:

    <pre>
      jQuery(document).ready(function() {
        jQuery("select.flexselect).flexselect();
      });
    </pre>

This will turn all select elements with a `class` of `flexselect`:

    <select class="flexselect" id="president name="president">
      <option value="1">George Washington</option>
      <option value="2">John Adams</option>
      <option value="3">Thomas Jefferson</option>
      ...
    </select>

into a bad-ass autocompleting text box with flex matching support.

**For more usage and examples**: [http://rmm5t.github.com/jquery-flexselect/](http://rmm5t.github.com/jquery-flexselect/)

## Inspired by:

* [jQuery.quickselect](http://jonmagic.com/2008/11/12/jquery-quickselect-js) by Daniel Parker
* [MooTools Select Autocompleter](http://warpspire.com/tipsresources/interface-scripting/select-autocompleter/) by Kyle Neath
* [Live Search with QuickSilver Style (for jQuery)](http://orderedlist.com/articles/live-search-with-quicksilver-style-for-jquery) by John Nunemaker
* [jQuery LiveSearch](http://ejohn.org/blog/jquery-livesearch/) by John Resig

## Todo

* Review the "picked" logic
* Fix selectedIndex when mouse happens to sit over dropdown during incremental
  find (perhaps unbind mouseover during filtering until a mousemove).
* Add templating support for matched list output.
* Add highlighting of matched characters in the results.
* Consider support for optgroup tags

## Author

[Ryan McGeary](http://ryan.mcgeary.org) ([@rmm5t](http://twitter.com/rmm5t))

## Other

[MIT License](http://www.opensource.org/licenses/mit-license.php)

Copyright (c) 2009, Ryan McGeary (ryanonjavascript -[at]- mcgeary [*dot*] org)
