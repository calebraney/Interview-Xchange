import { attr, checkBreakpoints } from '../utilities';

/*
CSS to include
can also use pointer to check for non fine pointers
@media not all and (pointer: fine) {

@media (hover: none) {
 .cursor {
    pointer-events: none;
    display: none;
  }
}
*/

export const cursor = function (gsapContext) {
  //animation ID
  const ANIMATION_ID = 'cursor';
  //elements
  const WRAP = '[data-ix-cursor="wrap"]';
  const INNER = '[data-ix-cursor="inner"]'; //inner cursor point that stays with the actual cursor
  const OUTER = '[data-ix-cursor="outer"]'; //outer cursor circle that has a delay
  const DOT = '[data-ix-cursor="dot"]'; // visual element within the inner cursor
  const HOVER = '[data-ix-cursor="hover"]';
  const NO_HOVER = '[data-ix-cursor="no-hover"]';
  //options
  const INNER_DELAY = 0.01; //cannot be 0
  const OUTER_DELAY = 0.4;
  //classes
  const HOVER_CLASS = 'is-hover';
  // select the items
  const cursorWrap = document.querySelector(WRAP);
  const cursorInner = document.querySelector(INNER);
  const cursorOuter = document.querySelector(OUTER);
  // const cursorDot = document.querySelector(DOT);

  // return if items are null
  if (!cursorWrap || !cursorInner) return;
  //check if the device has a touch screen
  if ('ontouchstart' in window || navigator.maxTouchPoints) return;

  //check breakpoints and quit function if set on specific breakpoints
  let runOnBreakpoint = checkBreakpoints(cursorWrap, ANIMATION_ID, gsapContext);
  if (runOnBreakpoint === false) return;

  const cursorHover = function () {
    // get all links without a no-hover attribute and any other elements with a hover attribute into an array
    const hoverElements = gsap.utils.toArray(`${HOVER}, :is(a, button):not(${NO_HOVER})`);
    hoverElements.forEach((item) => {
      if (!item || !cursorInner) return;
      item.addEventListener('mouseover', function (e) {
        cursorInner.classList.add(HOVER_CLASS);
        // cursorOuter.classList.add(HOVER_CLASS);

        //optional add on if you want text in the cursor
        // gsap.to('.cursor_text', {
        //   scrambleText: {
        //     text: text,
        //     chars: 'lowercase',
        //     speed: 2,
        //   },
        //   duration: 0.8,
        // });
      });
      item.addEventListener('mouseleave', function (e) {
        cursorInner.classList.remove(HOVER_CLASS);
        // cursorOuter.classList.remove(HOVER_CLASS);
      });
    });
  };
  cursorHover();
  const cursorClick = function () {
    // if (!cursorDot) return;
    // document.addEventListener('click', function (e) {
    //   let tl = gsap.timeline({});
    //   tl.fromTo(cursorDot, { rotateZ: -45 }, { rotateZ: 45, ease: 'power1.out', duration: 0.3 });
    // });
  };
  cursorClick();

  //handle cursor movement
  const cursorMove = function () {
    //center elements
    gsap.set(cursorInner, { xPercent: -50, yPercent: -50 });
    gsap.set(cursorOuter, { xPercent: -50, yPercent: -50 });
    //innner timelines
    let innerX = gsap.quickTo(cursorInner, 'x', { duration: INNER_DELAY, ease: 'non' });
    let innerY = gsap.quickTo(cursorInner, 'y', { duration: INNER_DELAY, ease: 'non' });
    //outer timelines
    let outerX = gsap.quickTo(cursorOuter, 'x', { duration: OUTER_DELAY, ease: 'power3' });
    let outerY = gsap.quickTo(cursorOuter, 'y', { duration: OUTER_DELAY, ease: 'power3' });
    //animate on mouse mouve
    window.addEventListener('mousemove', (e) => {
      innerX(e.clientX);
      innerY(e.clientY);
      outerX(e.clientX);
      outerY(e.clientY);
    });
  };
  cursorMove();
};
