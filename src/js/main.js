import "@/scss/main.scss";

// Modal: open/close, overlay click, ESC, focus trap
(function () {
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
        // shift + tab
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // tab
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

    // 모든 모달 숨기기
    var allModals = overlay.querySelectorAll(".modal");
    allModals.forEach(function(m) {
      m.style.display = "none";
    });

    // 선택한 모달만 표시
    modal.style.display = "block";
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

  // open buttons
  openButtons.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var target = this.getAttribute("data-target");
      if (target) {
        openModal(target);
      }
    });
  });

  // close buttons
  var closeButtons = document.querySelectorAll("[data-modal-close]");
  closeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      closeModal();
    });
  });

  // overlay click
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeModal();
  });

  // prevent focus leaving modal on click
  overlay.addEventListener("click", function (e) {
    if (e.target.closest(".modal")) {
      e.stopPropagation();
    }
  });
})();


// 강사진: 모바일/PC에 따라 옵션 분기
(function () {
  var sliderEl = document.querySelector(".teachers-slider");
  if (!sliderEl) return;
  new Swiper(sliderEl, {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 20,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    breakpoints: {
      768: {
        slidesPerView: 3,
        slidesPerGroup: 3,
      },
      1024: {
        slidesPerView: 4,
        slidesPerGroup: 4,
      },
    },
    navigation: {
      nextEl: ".section-teachers .btn-next",
      prevEl: ".section-teachers .btn-prev",
    },
  });
})();

// 헤더: 드로어 토글
(function () {
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
  btnMenu.addEventListener("click", function () {
    if (body.classList.contains("drawer-open")) close();
    else open();
  });
  if (btnClose) btnClose.addEventListener("click", close);
  drawer.addEventListener("click", function (e) {
    if (e.target === drawer) close();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });

  // 모바일에서 데스크탑으로 전환 시 드로어 자동 닫기
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

// 메뉴 네비게이션: 스크롤 이동 및 모바일 메뉴 닫기
(function () {
  var menuLinks = document.querySelectorAll('.gnb a[href^="#"]');
  var logoLink = document.querySelector('.logo a[href^="#"]');
  var drawer = document.getElementById("global-drawer");
  var body = document.body;
  var btnMenu = document.querySelector(".btn-menu");
  var linkBlank = document.querySelectorAll(".link-blank");

  linkBlank.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      scrollToSection(link.getAttribute("href"));
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

    // GSAP ScrollToPlugin이 있으면 사용, 없으면 기본 스크롤
    if (window.gsap && window.ScrollToPlugin) {
      gsap.to(window, {
        duration: 0.8,
        scrollTo: { y: targetPosition, offsetY: headerHeight },
        ease: "power2.inOut",
      });
    } else {
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  }

  function handleLinkClick(e, link) {
    var hash = link.getAttribute("href");

    e.preventDefault();

    // href가 "#"이거나 없는 경우 준비중 alert
    if (!hash || hash === "#") {
      alert("준비중입니다");
      // 모바일에서 메뉴 닫기
      var isMobile = window.innerWidth < 1024;
      if (isMobile) {
        closeDrawer();
      }
      return;
    }

    // 모바일에서 메뉴 닫기
    var isMobile = window.innerWidth < 1024;
    if (isMobile) {
      closeDrawer();
      // 메뉴 닫힌 후 스크롤 이동 (약간의 딜레이)
      setTimeout(function () {
        scrollToSection(hash);
      }, 300);
    } else {
      scrollToSection(hash);
    }
  }

  // 메뉴 링크들
  menuLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      handleLinkClick(e, this);
    });
  });

  // 로고 링크
  if (logoLink) {
    logoLink.addEventListener("click", function (e) {
      handleLinkClick(e, this);
    });
  }
})();

// 비주얼 슬라이더
(function () {
  if (!window.Swiper) return;
  var visualText = document.querySelector(".visual-text p");
  if (!visualText) return;

  var textContents = [
    "우리 조직 맞춤형 AI 교육 설계를 원한다면?",
    "AI를 도입하고 싶은데 어떤 것부터 해야 할지 고민된다면?",
  ];

  function updateVisualText(index) {
    if (!textContents[index]) return;

    // GSAP가 있으면 페이드 효과 사용
    if (window.gsap) {
      gsap.to(visualText, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: function () {
          visualText.innerHTML = textContents[index];
          gsap.to(visualText, {
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
          });
        },
      });
    } else {
      // GSAP가 없으면 바로 변경
      visualText.innerHTML = textContents[index];
    }
  }

  var swiper = new Swiper(".visual-slider", {
    loop: true,
    effect: "slide",
    speed: 700,
    autoplay: { delay: 3000, disableOnInteraction: false },
    pagination: {
      el: ".visual-slider .swiper-pagination",
      clickable: true,
    },
    on: {
      slideChange: function () {
        updateVisualText(this.realIndex);
      },
      init: function () {
        // 초기화 시에는 페이드 없이 바로 표시
        if (textContents[this.realIndex]) {
          visualText.innerHTML = textContents[this.realIndex];
        }
      },
    },
    // navigation: {
    // 	nextEl: '.visual-slider .swiper-button-next',
    // 	prevEl: '.visual-slider .swiper-button-prev'
    // }
  });

  // 마우스 호버 시 오토플레이 일시정지
  var sliderEl = document.querySelector(".visual-slider");
  if (sliderEl && swiper.autoplay) {
    sliderEl.addEventListener("mouseenter", function () {
      if (swiper.autoplay.running) {
        swiper.autoplay.pause();
      }
    });
    sliderEl.addEventListener("mouseleave", function () {
      if (!swiper.autoplay.running) {
        swiper.autoplay.resume();
      }
    });
  }
})();

// 헤더: 비주얼 영역 기준으로 scroll 상태 토글
(function () {
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

// 로드맵 섹션 페이드인업 애니메이션
(function () {
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
        once: true,
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    });
  }

  var roadmapTitle = document.querySelector(".section-roadmap .section-title");
  if (roadmapTitle) {
    gsap.from(roadmapTitle, {
      scrollTrigger: {
        trigger: roadmapTitle,
        start: "top 80%",
        once: true,
      },
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    });
  }
})();

// 구독 섹션 애니메이션
(function () {
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
        once: true,
      },
      y: 40,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.2,
    });
  }
})();

// AI 교육 섹션 애니메이션
(function () {
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
        once: true,
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.15,
    });
  }
})();

// MTD 5단계 프로세스 섹션 애니메이션
(function () {
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
        once: true,
      },
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      stagger: 0.1,
    });
  }

  var solutionTitle = document.querySelector(".section-solution h2");
  if (solutionTitle) {
    gsap.from(solutionTitle, {
      scrollTrigger: {
        trigger: solutionTitle,
        start: "top 80%",
        once: true,
      },
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    });
  }
})();

// 진단 섹션 애니메이션
(function () {
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
        once: true,
      },
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
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
        once: true,
      },
      x: -30,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      stagger: 0.15,
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
        once: true,
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    });
  }

  // 화살표 애니메이션
  // var arrows = document.querySelectorAll(".section-diagnosis .arrow-down");
  // if (arrows.length > 0) {
  //   arrows.forEach(function (arrow, index) {
  //     gsap.from(arrow, {
  //       scrollTrigger: {
  //         trigger: arrow,
  //         start: "top 85%",
  //         once: true,
  //       },
  //       y: 20,
  //       opacity: 0,
  //       duration: 0.6,
  //       ease: "power2.out",
  //       delay: index * 0.2,
  //     });

  //     // 화살표 위아래 흐르는 애니메이션
  //     gsap.to(arrow, {
  //       y: 10,
  //       duration: 1.5,
  //       ease: "power1.inOut",
  //       repeat: -1,
  //       yoyo: true,
  //       delay: 0.5 + index * 0.2,
  //     });
  //   });
  // }
})();

// AXPERT LAB 섹션 애니메이션
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  var teamCards = document.querySelectorAll(".section-insight .team-card");
  if (teamCards.length > 0) {
    gsap.from(teamCards, {
      scrollTrigger: {
        trigger: ".section-insight .insight-top",
        start: "top 80%",
        once: true,
      },
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      stagger: 0.15,
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
        once: true,
      },
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      stagger: 0.1,
    });
  }
})();

// AI 교육 슬라이드
(function () {
  var trainingContents = document.querySelectorAll(".training-content");
  if (!trainingContents || trainingContents.length === 0) return;

  trainingContents.forEach(function (content) {
    var swiperEl = content.querySelector(".training-swiper");
    var prevBtn = content.querySelector(".btn-prev");
    var nextBtn = content.querySelector(".btn-next");
    var sortButtons = content.querySelectorAll(".sort-toggle");

    if (!swiperEl) return;

    var swiper = new Swiper(swiperEl, {
      slidesPerView: 2,
      spaceBetween: 8,
      breakpoints: {
        768: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
        1240: {
          slidesPerView: 5,
          spaceBetween: 20,
        },
      },
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn,
      },
    });

    // 소트 버튼 클릭 시 해당 슬라이드로 이동
    sortButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var sortValue = this.getAttribute("data-sort");
        if (!sortValue) return;

        // 해당 data-sort를 가진 슬라이드 찾기
        var slides = swiperEl.querySelectorAll(".swiper-slide");
        var targetIndex = -1;

        console.log(slides);
        console.log(sortValue);

        for (var i = 0; i < slides.length; i++) {
          if (slides[i].getAttribute("data-sort") === sortValue) {
            targetIndex = i;
            break;
          }
        }

        // 슬라이드 찾았으면 이동
        if (targetIndex !== -1) {
          swiper.slideTo(targetIndex);
        }
      });
    });
  });
})();
