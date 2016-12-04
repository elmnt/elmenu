/*
 * elmenu.js v1.0.0
 *
 * A lightweight script to auto-generate a responsive, mobile menu system.
 * This project is licensed under the terms of the MIT license.
 *
 * This is an early release. It's functional, but has much room for improvement.
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
*/

(function( $ ){
   $.fn.elmenu = function( menuOrder ) {

      // ----------- Variables

      var theCanvas    = $( '#canvas' );
      var mainNav      = $( '#elmain' );
      var mobileNav    = $( '#elmobile' );
      var toggleOpen   = $( '#elmtoggle' );
      var toggleClose  = $( '#elmobiletoggle' );
      var subToggle    = $( '<span class="elmtrigger"><img src="img/arrow-down.svg" alt="Open Sub Menu"></span>' );
      var subsubToggle = $( '<span class="elmtrigger--sub"><img src="img/arrow-down.svg" alt="Open Sub Menu"></span>' );
      
      // ----------- Sub-functions

      // 2) mobileClasses()

      /*
      Replace all the desktop classes with mobile classes:
      We could use the parent container IDs ( #elmenu and #elmobile ),
      and restyle the same classes based on nesting inside the IDs, 
      but that kind of dominant specificity is bad practice. We're just 
      removing all the desktop classes, and replacing them with mobile classes.
      NOTE: This can be DRY with an array-loop approach.
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
         addSubTriggers();
      }

      // 3) addSubTriggers()

      /*
      Find any nav elements that have sub-navs, by looking for the .hassub class.
      This will give us the location to inject the accordion triggers
      */
      function addSubTriggers() {

         // The Level 2 menus
         var elmtarget = $( '#elmobile .hassub > .m-elm__link' );
         subToggle.insertAfter( elmtarget );

         // The Level 3 menus
         var elmtargetSub = $( '#elmobile .hassubsub > .m-elm__link--sub' );
         subsubToggle.insertAfter( elmtargetSub );

         swapMobileMenus();
      }

      // 4) swapMobileMenus()

      // Rearrange the ULs in the mobile nav
      function swapMobileMenus() {
         var $modules = $( '#elmobile > ul' );
         /*
         The array passed from the doc ready gets used here:
         Give the user the option to rearrange individual ULs when they get appended to the mobile nav.
         You can, of course, just set it right here, if you're not using the minified script.
         */
         // ex: var menuOrder = [2, 0, 1];
         for ( var i = 0, l = menuOrder.length; i < l; i++ ) {
            $( $modules.get(menuOrder[i]) ).appendTo( mobileNav );
         }
      }

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
         var theicon = $( '.elmtrigger img' );
         if( $(e).hasClass( 'open' ) ) {
            $( theicon ).addClass( 'rotate' );
         } else {
            $( theicon ).removeClass( 'rotate' );
         }
      }//toggleArrow

      // Spin the chevron on the mobile sub-nav trigger
      function toggleArrowSub(e) {
         var theicon = $( '.elmtrigger--sub img' );
         if( $(e).hasClass( 'open' ) ) {
            $( theicon ).addClass( 'rotate' );
         } else {
            $( theicon ).removeClass( 'rotate' );
         }
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
         $( this ).fadeTo( 'fast', 0 );
      });

      // Close the menu
      toggleClose.click(function(e) {
         toggleNav();
         // show the hamburger icon
         toggleOpen.fadeTo( 'fast', 1 );
      });

      // Click event for all Level 1 mobile nav items with Level 2 subs
      $( '.elmtrigger' ).click(function(e) {
         // Call the function to toggle the sub-menu
         toggleSubs( this );
         // Call the function to toggle the sub-menu arrow
         toggleArrow( this );
      });

      // Click event for all Level 2 mobile nav items with Level 3 subs
      $( '.elmtrigger--sub' ).click(function(e) {
         // Call the function to toggle the sub-menu
         toggleSubs( this );
         // Call the function to toggle the sub-menu arrow
         toggleArrowSub( this );
      });

      return this;
      
   }; 
})( jQuery );
