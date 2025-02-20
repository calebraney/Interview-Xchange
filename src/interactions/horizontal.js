import { attr, checkBreakpoints } from '../utilities';
export const horizontal = function (gsapContext, lenis) {
  //animation ID
  const ANIMATION_ID = 'horizontal';
  //selectors
  const WRAP_SELECTOR = '[data-ix-horizontal="wrap"]';
  const INNER_SELECTOR = '[data-ix-horizontal="inner"]';
  const TRACK_SELECTOR = '[data-ix-horizontal="track"]';

  //options
  const OPTION_MATCH_HEIGHT = 'data-ix-horizontal-dynamic-height';

  //elements
  const sections = document.querySelectorAll(WRAP_SELECTOR);
  sections.forEach((section) => {
    //get elements
    let wrap = section;
    let inner = wrap.querySelector(INNER_SELECTOR);
    let track = wrap.querySelector(TRACK_SELECTOR);
    if (!wrap || !inner || !track) return;

    //check breakpoints and quit function if set on specific breakpoints
    let runOnBreakpoint = checkBreakpoints(wrap, ANIMATION_ID, gsapContext);
    if (runOnBreakpoint === false) return;

    // function to set section height
    const setScrollDistance = function () {
      wrap.style.height = 'calc(' + track.offsetWidth + 'px + 100vh)';
      ScrollTrigger.refresh();
      if (lenis) lenis.resize();
    };
    //get option to see if height is matched
    let matchHeight = attr(true, wrap.getAttribute(OPTION_MATCH_HEIGHT));
    if (matchHeight) {
      setScrollDistance();
      window.addEventListener('resize', setScrollDistance);
    }

    // create main horizontal scroll timeline
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
      defaults: { ease: 'none' },
    });
    tl.to(track, { xPercent: -100 });

    // get container left position
    function containerLeft() {
      return inner.offsetLeft + 'px';
    }
    // get container right position
    function containerRight() {
      return inner.offsetLeft + inner.offsetWidth + 'px';
    }

    //DEMO INNER TIMELINES
    //   let tl2 = gsap.timeline({
    //     scrollTrigger: {
    //       trigger: wrap.querySelector(".scroll_horizontal_hero_wrap"),
    //       containerAnimation: tl,
    //       // start when the left side of the element hits the left side of the container
    //       start: "left " + containerLeft(),
    //       end: "right " + containerLeft(),
    //       scrub: true,
    //       // markers: true,
    //     },
    //     defaults: { ease: "none" },
    //   });
    //   tl2.to(wrap.querySelector(".scroll_horizontal_hero_title"), { opacity: 0, filter: "blur(60px)" });

    //   //
    //   let tl3 = gsap.timeline({
    //     scrollTrigger: {
    //       trigger: wrap.querySelector(".scroll_horizontal_pin_wrap"),
    //       containerAnimation: tl,
    //       start: "left " + containerLeft(),
    //       end: "right " + containerRight(),
    //       scrub: true,
    //       // markers: true,
    //     },
    //     defaults: { ease: "none" },
    //   });
    //   tl3.to(wrap.querySelector(".scroll_horizontal_pin_element"), { xPercent: 100 });
    //   tl3.from(wrap.querySelector(".scroll_horizontal_img"), { scale: 0.5 }, "<");
  });
};
