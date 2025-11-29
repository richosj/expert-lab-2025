(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
(function() {
  var openButtons = document.querySelectorAll("[data-open-modal], .open-modal");
  var overlay = document.querySelector("[data-modal-overlay]");
  var lastFocused = null;
  var currentModal = null;
  if (!overlay) return;
  function trapTabKey(e, modal) {
    var focusable = modal.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable || focusable.length === 0) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.key === "Tab") {
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }
  function openModal(modalId) {
    var modal = document.getElementById(modalId);
    if (!modal) return;
    var allModals = overlay.querySelectorAll(".modal");
    allModals.forEach(function(m) {
      m.style.display = "none";
    });
    modal.style.display = "flex";
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`);
    currentModal = modal;
    lastFocused = document.activeElement;
    overlay.removeAttribute("hidden");
    document.body.classList.add("modal-open");
    modal.focus();
    document.addEventListener("keydown", onKeyDown);
  }
  function closeModal() {
    if (currentModal) {
      currentModal.style.display = "none";
      document.documentElement.style.removeProperty("--scrollbar-width");
    }
    overlay.setAttribute("hidden", "");
    document.body.classList.remove("modal-open");
    if (lastFocused && typeof lastFocused.focus === "function")
      lastFocused.focus();
    document.removeEventListener("keydown", onKeyDown);
    currentModal = null;
  }
  function onKeyDown(e) {
    if (e.key === "Escape") {
      closeModal();
      return;
    }
    if (currentModal) {
      trapTabKey(e, currentModal);
    }
  }
  openButtons.forEach(function(btn) {
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      var target = this.getAttribute("data-target");
      if (target) {
        openModal(target);
      }
    });
  });
  var closeButtons = document.querySelectorAll("[data-modal-close]");
  closeButtons.forEach(function(btn) {
    btn.addEventListener("click", function() {
      closeModal();
    });
  });
  overlay.addEventListener("click", function(e) {
    if (e.target === overlay) closeModal();
  });
  overlay.addEventListener("click", function(e) {
    if (e.target.closest(".modal")) {
      e.stopPropagation();
    }
  });
})();
(function() {
  var sliderEl = document.querySelector(".teachers-slider");
  if (!sliderEl) return;
  new Swiper(sliderEl, {
    slidesPerView: 1.2,
    slidesPerGroup: 1,
    spaceBetween: 11,
    autoplay: {
      delay: 5e3,
      disableOnInteraction: false
    },
    breakpoints: {
      768: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 20
      },
      1024: {
        slidesPerView: 4,
        slidesPerGroup: 4
      }
    },
    navigation: {
      nextEl: ".section-teachers .btn-next",
      prevEl: ".section-teachers .btn-prev"
    }
  });
})();
(function() {
  var btnMenu = document.querySelector(".btn-menu");
  var btnClose = document.querySelector(".drawer .btn-close");
  var drawer = document.getElementById("global-drawer");
  var body = document.body;
  if (!btnMenu || !drawer) return;
  function open() {
    body.classList.add("drawer-open");
    drawer.setAttribute("aria-hidden", "false");
    btnMenu.setAttribute("aria-expanded", "true");
  }
  function close() {
    body.classList.remove("drawer-open");
    drawer.setAttribute("aria-hidden", "true");
    btnMenu.setAttribute("aria-expanded", "false");
  }
  btnMenu.addEventListener("click", function() {
    if (body.classList.contains("drawer-open")) close();
    else open();
  });
  if (btnClose) btnClose.addEventListener("click", close);
  drawer.addEventListener("click", function(e) {
    if (e.target === drawer) close();
  });
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") close();
  });
  var mq = window.matchMedia("(min-width: 1024px)");
  function handleResize() {
    if (mq.matches && body.classList.contains("drawer-open")) {
      close();
    }
  }
  if (mq.addEventListener) {
    mq.addEventListener("change", handleResize);
  } else if (mq.addListener) {
    mq.addListener(handleResize);
  }
  window.addEventListener("resize", handleResize);
})();
(function() {
  var menuLinks = document.querySelectorAll('.gnb a[href^="#"]');
  var logoLink = document.querySelector('.logo a[href^="#"]');
  var drawer = document.getElementById("global-drawer");
  var body = document.body;
  var btnMenu = document.querySelector(".btn-menu");
  var linkBlank = document.querySelectorAll(".link-blank");
  linkBlank.forEach(function(link) {
    link.addEventListener("click", function(e) {
      var href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        var isMobile = window.innerWidth < 1024;
        if (isMobile) {
          closeDrawer();
          setTimeout(function() {
            scrollToSection(href);
          }, 300);
        } else {
          scrollToSection(href);
        }
      } else {
        var isMobile = window.innerWidth < 1024;
        if (isMobile) {
          closeDrawer();
        }
      }
    });
  });
  function closeDrawer() {
    if (body.classList.contains("drawer-open")) {
      body.classList.remove("drawer-open");
      if (drawer) drawer.setAttribute("aria-hidden", "true");
      if (btnMenu) btnMenu.setAttribute("aria-expanded", "false");
    }
  }
  function scrollToSection(hash) {
    var target = document.querySelector(hash);
    if (!target) return;
    var header = document.querySelector(".header");
    var headerHeight = header ? header.offsetHeight : 0;
    var targetPosition = target.offsetTop - headerHeight;
    if (window.gsap && window.ScrollToPlugin) {
      gsap.to(window, {
        duration: 0.8,
        scrollTo: { y: targetPosition, offsetY: headerHeight },
        ease: "power2.inOut"
      });
    } else {
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    }
  }
  function handleLinkClick(e, link) {
    var hash = link.getAttribute("href");
    e.preventDefault();
    if (!hash || hash === "#") {
      alert("준비중입니다");
      var isMobile = window.innerWidth < 1024;
      if (isMobile) {
        closeDrawer();
      }
      return;
    }
    var isMobile = window.innerWidth < 1024;
    if (isMobile) {
      closeDrawer();
      setTimeout(function() {
        scrollToSection(hash);
      }, 300);
    } else {
      scrollToSection(hash);
    }
  }
  menuLinks.forEach(function(link) {
    link.addEventListener("click", function(e) {
      handleLinkClick(e, this);
    });
  });
  if (logoLink) {
    logoLink.addEventListener("click", function(e) {
      handleLinkClick(e, this);
    });
  }
})();
(function() {
  if (!window.Swiper) return;
  var visualText = document.querySelector(".visual-text p");
  if (!visualText) return;
  var textContents = [
    "우리 조직 맞춤형 AI 교육 설계를 원한다면?",
    "AI를 도입하고 싶은데 어떤 것부터 해야 할지 고민된다면?"
  ];
  function updateVisualText(index) {
    if (!textContents[index]) return;
    if (window.gsap) {
      gsap.to(visualText, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: function() {
          visualText.innerHTML = textContents[index];
          gsap.to(visualText, {
            opacity: 1,
            duration: 0.4,
            ease: "power2.out"
          });
        }
      });
    } else {
      visualText.innerHTML = textContents[index];
    }
  }
  var swiper = new Swiper(".visual-slider", {
    loop: true,
    effect: "slide",
    speed: 700,
    autoplay: { delay: 3e3, disableOnInteraction: false },
    pagination: {
      el: ".visual-slider .swiper-pagination",
      clickable: true
    },
    on: {
      slideChange: function() {
        updateVisualText(this.realIndex);
      },
      init: function() {
        if (textContents[this.realIndex]) {
          visualText.innerHTML = textContents[this.realIndex];
        }
      }
    }
    // navigation: {
    // 	nextEl: '.visual-slider .swiper-button-next',
    // 	prevEl: '.visual-slider .swiper-button-prev'
    // }
  });
  var sliderEl = document.querySelector(".visual-slider");
  if (sliderEl && swiper.autoplay) {
    sliderEl.addEventListener("mouseenter", function() {
      if (swiper.autoplay.running) {
        swiper.autoplay.pause();
      }
    });
    sliderEl.addEventListener("mouseleave", function() {
      if (!swiper.autoplay.running) {
        swiper.autoplay.resume();
      }
    });
  }
})();
(function() {
  var header = document.querySelector(".header");
  var visual = document.querySelector(".visual");
  if (!header || !visual) return;
  function update() {
    var threshold = visual.offsetHeight - header.offsetHeight;
    if (window.scrollY > threshold) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  window.addEventListener("load", update);
})();
(function() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  var roadmapContent = document.querySelector(
    ".section-roadmap .roadmap-content"
  );
  if (roadmapContent) {
    gsap.from(roadmapContent, {
      scrollTrigger: {
        trigger: roadmapContent,
        start: "top 80%",
        once: true
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });
  }
  var roadmapTitle = document.querySelector(".section-roadmap .section-title");
  if (roadmapTitle) {
    gsap.from(roadmapTitle, {
      scrollTrigger: {
        trigger: roadmapTitle,
        start: "top 80%",
        once: true
      },
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    });
  }
})();
(function() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  var subscriptionItems = document.querySelectorAll(
    ".section-subscription .newletter, .section-subscription .contact"
  );
  if (subscriptionItems.length > 0) {
    gsap.from(subscriptionItems, {
      scrollTrigger: {
        trigger: ".section-subscription",
        start: "top 80%",
        once: true
      },
      y: 40,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.2
    });
  }
})();
(function() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  var trainingContents = document.querySelectorAll(
    ".section-training .training-content"
  );
  if (trainingContents.length > 0) {
    gsap.from(trainingContents, {
      scrollTrigger: {
        trigger: ".section-training",
        start: "top 80%",
        once: true
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.15
    });
  }
})();
(function() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  var processCards = document.querySelectorAll(
    ".section-solution .process-card"
  );
  if (processCards.length > 0) {
    gsap.from(processCards, {
      scrollTrigger: {
        trigger: ".section-solution",
        start: "top 80%",
        once: true
      },
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      stagger: 0.1
    });
  }
  var solutionTitle = document.querySelector(".section-solution h2");
  if (solutionTitle) {
    gsap.from(solutionTitle, {
      scrollTrigger: {
        trigger: solutionTitle,
        start: "top 80%",
        once: true
      },
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    });
  }
})();
(function() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  var diagnosisTop = document.querySelector(
    ".section-diagnosis .diagnosis-top"
  );
  if (diagnosisTop) {
    gsap.from(diagnosisTop, {
      scrollTrigger: {
        trigger: diagnosisTop,
        start: "top 80%",
        once: true
      },
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });
  }
  var processSteps = document.querySelectorAll(
    ".section-diagnosis .process-step"
  );
  if (processSteps.length > 0) {
    gsap.from(processSteps, {
      scrollTrigger: {
        trigger: ".section-diagnosis .process-steps",
        start: "top 80%",
        once: true
      },
      x: -30,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      stagger: 0.15
    });
  }
  var diagnosisBottom = document.querySelector(
    ".section-diagnosis .diagnosis-bottom"
  );
  if (diagnosisBottom) {
    gsap.from(diagnosisBottom, {
      scrollTrigger: {
        trigger: diagnosisBottom,
        start: "top 80%",
        once: true
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });
  }
})();
(function() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  var teamCards = document.querySelectorAll(".section-insight .team-card");
  if (teamCards.length > 0) {
    gsap.from(teamCards, {
      scrollTrigger: {
        trigger: ".section-insight .insight-top",
        start: "top 80%",
        once: true
      },
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      stagger: 0.15
    });
  }
  var serviceCards = document.querySelectorAll(
    ".section-insight .service-card"
  );
  if (serviceCards.length > 0) {
    gsap.from(serviceCards, {
      scrollTrigger: {
        trigger: ".section-insight .insight-bottom",
        start: "top 80%",
        once: true
      },
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      stagger: 0.1
    });
  }
})();
(function() {
  var trainingContents = document.querySelectorAll(".training-content");
  if (!trainingContents || trainingContents.length === 0) return;
  trainingContents.forEach(function(content) {
    var swiperEl = content.querySelector(".training-swiper");
    var prevBtn = content.querySelector(".btn-prev");
    var nextBtn = content.querySelector(".btn-next");
    var sortButtons = content.querySelectorAll(".sort-toggle");
    if (!swiperEl) return;
    var swiper = new Swiper(swiperEl, {
      slidesPerView: 2.4,
      spaceBetween: 8,
      loop: true,
      loopAdditionalSlides: 2,
      loopedSlides: 5,
      breakpoints: {
        768: {
          slidesPerView: 3,
          spaceBetween: 20
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 18
        },
        1240: {
          slidesPerView: 5,
          spaceBetween: 18
        }
      },
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn
      },
      on: {
        init: function() {
          var sortIndexMap = {};
          var slideIndex = 0;
          for (var i = 0; i < this.slides.length; i++) {
            var slide = this.slides[i];
            if (!slide.classList.contains("swiper-slide-duplicate") && !slide.classList.contains("swiper-slide-duplicate-prev") && !slide.classList.contains("swiper-slide-duplicate-next")) {
              var sortValue = slide.getAttribute("data-sort");
              if (sortValue) {
                sortIndexMap[sortValue] = slideIndex;
              }
              slideIndex++;
            }
          }
          this.sortIndexMap = sortIndexMap;
        }
      }
    });
    sortButtons.forEach(function(btn) {
      btn.addEventListener("click", function() {
        var sortValue = this.getAttribute("data-sort");
        if (!sortValue) return;
        var targetIndex = swiper.sortIndexMap && swiper.sortIndexMap[sortValue];
        if (targetIndex !== void 0 && targetIndex !== null) {
          swiper.slideToLoop(targetIndex, 600);
        }
      });
    });
  });
})();
