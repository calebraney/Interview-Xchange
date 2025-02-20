import { attr } from './utilities';
import { hoverActive } from './interactions/hover-active';
import { horizontal } from './interactions/horizontal';
import { cursor } from './interactions/cursor';
import { load } from './interactions/load';
import { initLenis } from './interactions/lenis';
import { scrollIn } from './interactions/scroll-in';
import { scrolling } from './interactions/scrolling';

document.addEventListener('DOMContentLoaded', function () {
  // Comment out for production
  console.log('Local Script');
  // register gsap plugins if available
  if (gsap.ScrollTrigger !== undefined) {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (gsap.TextPlugin !== undefined) {
    gsap.registerPlugin(TextPlugin);
  }

  //////////////////////////////
  //Global Variables
  let lenis;

  const ctaScroll = function () {
    const cta = document.querySelector('.section_cta');
    if (!cta) return;
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: cta,
        start: 'bottom bottom',
        end: 'bottom center',
        scrub: 1,
      },
    });
    tl.from(cta, {
      borderRadius: '0rem',
      duration: 1,
    });
  };

  ////////////////////////////
  // Page Load
  // function homeLoad() {
  //   let headerItems = document.querySelector('.home-header_content').childNodes;
  //   let tl = gsap.timeline({ delay: 0.5 });
  //   tl.set('.section_home-header', {
  //     opacity: 1,
  //   });
  //   tl.from(headerItems, {
  //     y: '50%',
  //     opacity: 0,
  //     ease: 'power2.out',
  //     stagger: { each: 0.2, from: 'left' },
  //     duration: 0.6,
  //   });
  //   tl.from(
  //     '.home-header_image',
  //     {
  //       scale: 0.75,
  //       opacity: 0,
  //       ease: 'power2.out',
  //       duration: 1,
  //     },
  //     '-=.4'
  //   );
  //   tl.from(
  //     '.home-header_background-shape',
  //     {
  //       opacity: 0,
  //       ease: 'power2.out',
  //       duration: 1,
  //     },
  //     '-=.6'
  //   );
  // }
  // homeLoad();

  ////////////////////////////
  // TEXT TYPING
  /*
gsap.to("#cursor", {
  opacity: 0,
  repeat: -1,
  yoyo: true,
  duration: 0.5,
  ease: "power2.inOut"
});
*/

  const homeHeroText = function () {
    const words = gsap.utils.toArray('.asset-type-text');
    if (words.length === 0) return;
    let tlHomeText = gsap.timeline({ repeat: -1, delay: 3 });
    tlHomeText.set('#type-text', {
      text: '',
      duration: 0,
    });

    words.forEach((word, i) => {
      if (i != 0) {
        let tlText = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 3 });
        tlText.to('#type-text', { duration: 1, text: word.outerText });
        tlHomeText.add(tlText);
      }
    });

    let tlLastText = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 3 });
    tlLastText.to('#type-text', { duration: 1, text: words[0].outerText });
    tlHomeText.add(tlLastText);
  };

  ////////////////////////////

  // Splide Slider
  function slider() {
    let splides = document.querySelectorAll('.splide');
    if (splides.length === 0) return;
    for (let i = 0, splideLength = splides.length; i < splideLength; i++) {
      new Splide(splides[i], {
        // Desktop on down
        perPage: 3,
        perMove: 1,
        focus: 'center', // 0 = left and 'center' = center
        type: 'loop', // 'loop' or 'slide'
        drag: 'true',
        snap: true,
        flickPower: 400,
        flickMaxPages: 1,
        gap: '1.5rem', // space between slides
        arrows: 'slider', // 'slider' or false
        pagination: false, // 'slider' or false
        speed: 550, // transition speed in miliseconds
        autoWidth: false, // for cards with differing widths
        rewind: false, // go back to beginning when reach end
        waitForTransition: false,
        updateOnMove: true,
        trimSpace: false,
        breakpoints: {
          991: {
            // Tablet
            perPage: 2,
            gap: '1.5rem',
          },
          767: {
            // Mobile Landscape
            perPage: 1,
            gap: '1.5rem',
          },
          479: {
            // Mobile Portrait
            perPage: 1,
            gap: '1.5rem',
          },
        },
      }).mount();
    }
  }
  //////////////////////////////
  //Control Functions on page load
  const gsapInit = function () {
    let mm = gsap.matchMedia();
    mm.add(
      {
        //This is the conditions object
        isMobile: '(max-width: 767px)',
        isTablet: '(min-width: 768px)  and (max-width: 991px)',
        isDesktop: '(min-width: 992px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (gsapContext) => {
        let { isMobile, isTablet, isDesktop, reduceMotion } = gsapContext.conditions;
        //functional interactions
        lenis = initLenis();
        hoverActive(gsapContext);
        horizontal(gsapContext, lenis);
        cursor(gsapContext);
        load(gsapContext);
        //conditional interactions
        if (!reduceMotion) {
          scrollIn(gsapContext);
          scrolling(gsapContext);
        }
        // specific interactions
        slider();
        ctaScroll();
        homeHeroText();
      }
    );
  };
  gsapInit();

  //reset gsap on click of reset triggers
  const scrollReset = function () {
    //selector
    const RESET_EL = '[data-ix-reset]';
    //time option
    const RESET_TIME = 'data-ix-reset-time';
    const resetScrollTriggers = document.querySelectorAll(RESET_EL);
    resetScrollTriggers.forEach(function (item) {
      item.addEventListener('click', function (e) {
        //reset scrolltrigger
        ScrollTrigger.refresh();
        //if item has reset timer reset scrolltriggers after timer as well.
        if (item.hasAttribute(RESET_TIME)) {
          let time = attr(1000, item.getAttribute(RESET_TIME));
          //get potential timer reset
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, time);
        }
      });
    });
  };
  scrollReset();
});
