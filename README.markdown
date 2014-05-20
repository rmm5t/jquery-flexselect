# flexselect: a jQuery plugin

FlexSelect is a jQuery plugin that turns select boxes into flex-matching
incremental-finding controls.

Flex matching a few keystrokes against longer strings is a boon in
productivity for typists. Applications like Quicksilver, LaunchBar, and
Launchy have made this method of keyboard entry a popular one. It's time to
bring this same functionality to web controls. FlexSelect does that for select
boxes.

## How You Can Help

**If you like this project, please help. [Donate via Gittip][gittip] or [buy me a coffee with Bitcoin][bitcoin].**<br>
[![Gittip](http://img.shields.io/gittip/rmm5t.svg)][gittip]
[![Bitcoin](http://img.shields.io/badge/bitcoin-buy%20me%20a%20coffee-brightgreen.svg)][bitcoin]

**[Bitcoin][bitcoin]**: `1rmm5tv6f997JK5bLcGbRCZyVjZUPkQ2m`<br>
[![Bitcoin Donation][bitcoin-qr-small]][bitcoin-qr-big]

## Need Help?

**You can [book a session with me on Codementor][codementor].**<br>
[![Book a Codementor session](http://img.shields.io/badge/codementor-book%20a%20session-orange.svg)][codementor]

[gittip]: https://www.gittip.com/rmm5t/ "Donate to rmm5t for open source!"
[bitcoin]: https://blockchain.info/address/1rmm5tv6f997JK5bLcGbRCZyVjZUPkQ2m "Buy rmm5t a coffee for open source!"
[bitcoin-scheme]: bitcoin:1rmm5tv6f997JK5bLcGbRCZyVjZUPkQ2m?amount=0.01&label=Coffee%20to%20rmm5t%20for%20Open%20Source "Buy rmm5t a coffee for open source!"
[bitcoin-qr-small]: http://chart.apis.google.com/chart?cht=qr&chs=150x150&chl=bitcoin%3A1rmm5tv6f997JK5bLcGbRCZyVjZUPkQ2m%3Famount%3D0.01%26label%3DCoffee%2520to%2520rmm5t%2520for%2520Open%2520Source
[bitcoin-qr-big]: http://chart.apis.google.com/chart?cht=qr&chs=500x500&chl=bitcoin%3A1rmm5tv6f997JK5bLcGbRCZyVjZUPkQ2m%3Famount%3D0.01%26label%3DCoffee%2520to%2520rmm5t%2520for%2520Open%2520Source
[codementor]: https://www.codementor.io/rmm5t?utm_campaign=profile&utm_source=button-rmm5t&utm_medium=shields "Book a session with rmm5t on Codementor!"

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

**For more usage and examples**: [http://rmm5t.github.io/jquery-flexselect/](http://rmm5t.github.io/jquery-flexselect/)

## Inspired by:

* [jQuery.quickselect](http://jonmagic.com/2008/11/12/jquery-quickselect-js) by Daniel Parker
* [MooTools Select Autocompleter](http://warpspire.com/tipsresources/interface-scripting/select-autocompleter/) by Kyle Neath
* [Live Search with QuickSilver Style (for jQuery)](http://orderedlist.com/articles/live-search-with-quicksilver-style-for-jquery) by John Nunemaker
* [jQuery LiveSearch](http://ejohn.org/blog/jquery-livesearch/) by John Resig

## Todo

* Review the "picked" logic
* Add templating support for matched list output.
* Add highlighting of matched characters in the results.
* Consider support for optgroup tags

## Author

[Ryan McGeary](http://ryan.mcgeary.org) ([@rmm5t](http://twitter.com/rmm5t))

## Other

[MIT License](http://www.opensource.org/licenses/mit-license.php)

Copyright (c) 2009-2013, Ryan McGeary (ryan -[at]- mcgeary [*dot*] org)
