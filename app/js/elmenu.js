/*
 * elmenu.js
 *
 * A lightweight jQuery script to auto-generate a responsive, mobile menu system.
 * This project is licensed under the terms of the MIT license.
 *
 * Current Version: v1.1.0
 * Release notes:
 *
 * v1.1.0
 * Fixes a bug where multiple toggle icons where spinning on a single icon click,
 * so individual elements needed to be targeted specifically.
 *
 */

/*
Quick description (see comments below for more info)
1. The Base elmenu function
   a) Takes all menus in the header and clones them into the mobile nav
   b) Calls mobileClasses() function
2. mobileClasses() function
   a) Drops desktop classes and adds mobile classes
   b) Calls addSubTriggers() function
3. addSubTriggers() function
   a) Adds open/close functionality to mobile nav sub-menus
   b) Calls swapMobileMenus() function
4. swapMobileMenus() function
   a) Rearranges the mobile menus based on user setting (see index.html doc ready)
5. Click events
*/

(function( $ ){
   $.fn.elmenu = function( menuOrder ) {

      // ----------- Variables

      var theCanvas    = $( '#canvas' );
      var mainNav      = $( '#elmain' );
      var mobileNav    = $( '#elmobile' );
      var toggleOpen   = $( '#elmtoggle' );
      var toggleClose  = $( '#elmobiletoggle' );

      // ----------- Sub-functions


      /*
      Replace all the desktop classes with mobile classes:
      We could use the parent container IDs ( #elmenu and #elmobile ),
      and restyle the same classes based on nesting inside the IDs,
      but that kind of dominant specificity is bad practice. We're just
      removing all the desktop classes, and replacing them with mobile classes,
      AFTER all the nodes have been thrown into the #elmobile holder.
      */
      function mobileClasses(e){

         $( '#elmobile .elm__list' ).addClass( 'm-elm__list' ).removeClass( 'elm__list' );
         $( '#elmobile .elm__item' ).addClass( 'm-elm__item' ).removeClass( 'elm__item' );
         $( '#elmobile .elm__link' ).addClass( 'm-elm__link' ).removeClass( 'elm__link' );
         $( '#elmobile .elm__list--sub' ).addClass( 'm-elm__list--sub' ).removeClass( 'elm__list--sub' );
         $( '#elmobile .elm__item--sub' ).addClass( 'm-elm__item--sub' ).removeClass( 'elm__item--sub' );
         $( '#elmobile .elm__link--sub' ).addClass( 'm-elm__link--sub' ).removeClass( 'elm__link--sub' );
         $( '#elmobile .elm__list--subsub' ).addClass( 'm-elm__list--subsub' ).removeClass( 'elm__list--subsub' );
         $( '#elmobile .elm__item--subsub' ).addClass( 'm-elm__item--subsub' ).removeClass( 'elm__item--subsub' );
         $( '#elmobile .elm__link--subsub' ).addClass( 'm-elm__link--subsub' ).removeClass( 'elm__link--subsub' );

         // call the next function
         addSubTriggers();

      }


      /*
      Find any nav elements that have sub-navs, by looking for the .hassub class.
      This will give us the location to inject the accordion triggers
      */
      function addSubTriggers() {

         // The Level 2 menus

         // Find each instance of a child menu, and target the link
         // Now we have a position to inject the spans (the sub-menu toggle triggers)
         var elmtarget = $( '#elmobile .hassub > .m-elm__link' );

         // Create a unique node (a span element containing a chevron image) for each one that exists
         $( elmtarget ).each(function( i ) {
            var addTrigger = '<span class="elmtriggerchild-' + i + '"><img src="img/arrow-down.svg" alt="Open Sub Menu"></span>';
            $( this ).after( addTrigger );
         });

         // The Level 3 menus

         // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
         // THESE ARE NOT ACCOUNTED FOR YET //
         // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //

         // Find each instance of a grandchild menu, and target the link
         // Now we have a position to inject the spans (the sub-menu toggle triggers)
         var elmtargetSub = $( '#elmobile .hassubsub > .m-elm__link--sub' );

         // Create a unique node (a span element containing a down chevron) for each one that exists
         $( elmtargetSub ).each(function( i ) {
            var addSubTrigger = '<span class="elmtriggergrandchild-' + i + '"><img src="img/arrow-down.svg" alt="Open Sub Menu"></span>';
            $( this ).after( addSubTrigger );
         });

         // call the next function
         swapMobileMenus();

      }


      /*
      Rearrange the ULs in the mobile nav, based on the init setting in the footer
      */
      function swapMobileMenus() {

         // Create a new object for the mobile nav elements
         var $modules = $( '#elmobile > ul' );

         // The array passed from the doc ready gets used here:
         // Give the user the option to rearrange individual ULs when they get appended to the mobile nav.
         // ex: var menuOrder = [2, 0, 1];

         for ( var i = 0, l = menuOrder.length; i < l; i++ ) {
            $( $modules.get(menuOrder[i]) ).appendTo( mobileNav );
         }

         // call the next function
         findTriggers();

      }


      /*
      Now we need to grab the spans we already attached (for our toggle triggers),
      and attach unique click events to each one (no matter how many there are).
      */
      function findTriggers() {

         // The child toggle triggers
         var elmChildTriggers = $( '*[class^="elmtriggerchild-"]' );
         $( elmChildTriggers ).each(function( i ) {
            // Add a click event for each one
            $( elmChildTriggers[i] ).click(function(e) {
               // Call the function to toggle the sub-menu
               toggleSubs( this );
               // Call the function to toggle the sub-menu arrow
               toggleArrow( this );
            });
         });

         // The grandchild toggle triggers
         var elmGrandchildTriggers = $( '*[class^="elmtriggergrandchild-"]' );
         $( elmGrandchildTriggers ).each(function( i ) {
            // Add a click event for each one
            $( elmGrandchildTriggers[i] ).click(function(e) {
               // Call the function to toggle the sub-menu
               toggleSubs( this );
               // Call the function to toggle the sub-menu arrow
               // REMOVE THE SPIN
               toggleArrow( this );
            });
         });

      }

      /*
      BOOM
      Now we're just waiting for click events.
      */


      // Show / Hide the mobile nav
      function toggleNav() {
         $( 'body' ).toggleClass( 'show-nav' );

         /*
         To do anything specific on open/close, use the conditional method (below).
         Otherwise, just toggle it. We could apply the toggle class more specifically,
         on the #page element, for instance, but applying it to the body lets us
         affect much more of the DOM, if we want, when we toggle.

         if ($( 'body' ).hasClass( 'show-nav' )) {
           // Do things on Nav Close
           $( 'body' ).removeClass( 'show-nav' );
         } else {
           // Do things on Nav Open
           $( 'body' ).addClass( 'show-nav' );
         }
         */
      }//toggleNav

      // Slide down the mobile sub-navs
      function toggleSubs(e) {
         if( !$(e).hasClass( 'open' ) ) {
            $(e).addClass( 'open' );
            $(e).next( 'ul' ).slideDown( 250 );
         } else {
            $(e).removeClass( 'open' );
            $(e).next( 'ul' ).slideUp( 250 );
         }
      }//toggleSubs

      // Spin the chevron on the mobile sub-nav trigger
      function toggleArrow(e) {

         // Target the img inside the span object we're passing
         var theicon = $( e ).children();

         // Add / Remove the rotate class (to achieve the spin effect)
         if( $(e).hasClass( 'open' ) ) {
            $( theicon ).addClass( 'rotate' );
         } else {
            $( theicon ).removeClass( 'rotate' );
         }

      }//toggleArrow

      // Spin the chevron on the mobile sub-nav trigger
      function toggleArrowSub(e) {

         /*
         var theicon = $( '.elmtrigger--sub img' );
         if( $(e).hasClass( 'open' ) ) {
            $( theicon ).addClass( 'rotate' );
         } else {
            $( theicon ).removeClass( 'rotate' );
         }
         */

      }//toggleArrow

      // ----------- 1) The Base elmenu function

      /*
      * Create an array of all nav modules in the header menu (inside #elmain) by targeting the .nav--* class.
      * They MUST all have this .nav--* class, whether it's a <nav> tag or a <div>.
      * We're going to return their child ULs, and place & re-style them in the mobile nav module.
      * Note: We're using this .nav--* class, and not targeting the <nav> tags directly,
      * because some links may or may not semantically belong in <nav> tags.
      * We just want to get the ULs that contain the links.
      */
      var hdnav = []
      hdnav = mainNav.find( '*[class^="nav--"]' );

      // Clone & append them to the #elmobile nav element.
      for ( var i = 0, l = hdnav.length; i < l; i++ ) {
         $( hdnav[i] ).clone().appendTo( mobileNav );
         mobileClasses();
      }

      // ----------- Click events

      // Open the menu
      toggleOpen.click(function(e) {
         toggleNav();

         // hide the hamburger icon
         // $( this ).fadeTo( 'fast', 0 );

      });

      // Close the menu
      toggleClose.click(function(e) {
         toggleNav();

         // show the hamburger icon
         // toggleOpen.fadeTo( 'fast', 1 );

      });



      /*
      2) Renamed elmtrigger classes
      */

      /*
      // Click event for all Level 1 mobile nav items with Level 2 subs
      // var goClick = $( '*[class^="elmtrigger-"]' );

      var theSpans = $( '*[class^="elmtriggerchild-"]' ).each(function( i ) {
      console.log(theSpans);

      $( theSpans[i] ).click(function(e) {

         // Call the function to toggle the sub-menu
         toggleSubs( this );

         // Call the function to toggle the sub-menu arrow
         // toggleArrow( this );

         if( $( this + ' img' ).hasClass( 'open' ) ) {
            $( this + ' img' ).addClass( 'rotate' );
         } else {
            $( this + ' img' ).removeClass( 'rotate' );
         }

      });
      */

      /*
      //$( goClick ).click(function(e) {
         // Call the function to toggle the sub-menu
         toggleSubs( this );
         // Call the function to toggle the sub-menu arrow

         // REMOVE THE SPIN
         // toggleArrow( this );

         if( $( '.elmtrigger-0 img' ).hasClass( 'open' ) ) {
            $( '.elmtrigger-0 img' ).addClass( 'rotate' );
         } else {
            $( '.elmtrigger-0 img' ).removeClass( 'rotate' );
         }

      });
      */



      /*
      $( '.elmtriggerchild-1' ).click(function(e) {
         // Call the function to toggle the sub-menu
         toggleSubs( this );
         // Call the function to toggle the sub-menu arrow
         // REMOVE THE SPIN
         toggleArrow( this );
      });
      */

      /*
      // Click event for all Level 2 mobile nav items with Level 3 subs
      $( '.elmtrigger--sub' ).click(function(e) {
         // Call the function to toggle the sub-menu
         toggleSubs( this );
         // Call the function to toggle the sub-menu arrow
         // REMOVE THE SPIN
         toggleArrowSub( this );
      });
      */

      return this;

   };
})( jQuery );
