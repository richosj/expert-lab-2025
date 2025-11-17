document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, ScrollSmoother);

    ScrollSmoother.create({
        smooth: 1,
        effects: true,
    });

    // ✅ 비디오 로딩 처리
    const video = document.querySelector(".visual__video video");
    video.addEventListener("loadeddata", () => {
        video.classList.add("loaded");
    });

    ScrollTrigger.matchMedia({
        "(min-width: 1024px)": function () {
            // ✅ s1 애니메이션
            const year = document.querySelector('.s1-title-1 .l');
            const fair = document.querySelector('.s1-title-1 .r');
            const date = document.querySelector('.s1-title-2 span');
            const s2title = document.querySelector('.s2-title .fir');
            const s2title2 = document.querySelector('.s2-title .sec');
            const hex1 = document.querySelector('.hexagon-1');
            const hex2 = document.querySelector('.hexagon-2');
            const hex1Text = gsap.utils.toArray('.hexagon-1 .box span');
            const hex2Text = gsap.utils.toArray('.hexagon-2 .box span');

            const shape1 = document.querySelector('.shape-1');
            const shape2 = document.querySelector('.shape-2');
            const shape3 = document.querySelector('.shape-3');
            const shape4 = document.querySelector('.shape-4');
            const shape5 = document.querySelector('.shape-5');

            // 초기 상태
            gsap.set(year, { y: 100, x: '50%', opacity: 0 });
            gsap.set(fair, { x: '-50%', opacity: 0 });
            gsap.set(date, { opacity: 0 });
            gsap.set(shape1, { opacity: 0 });
            gsap.set(shape2, { opacity: 0 });
            gsap.set(shape3, { opacity: 0 });
            gsap.set(shape4, { opacity: 0 });
            gsap.set(shape5, { opacity: 0 });
            gsap.set(s2title, { opacity: 0, y: '50%' });
            gsap.set(s2title2, { opacity: 0, y: '50%' });

            gsap.set(hex1, { scale: 1.2, opacity: 0 });
            gsap.set(hex2, { scale: 1.2, y: 50, opacity: 0 });
            gsap.set(hex1Text, { y: 20, opacity: 0 });
            gsap.set(hex2Text, { y: 20, opacity: 0 });

            // 통합 타임라인
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.s1-title',
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                }
            });

            tl.to(shape1, { opacity: 1, duration: .5, ease: 'power3.out' }, '+=0.1')
            .to(shape2, { opacity: 1, duration: .5, ease: 'power3.out' }, '>')

            tl.to(year, { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }) // 아래 → 센터
            .to([year, fair], {
                x: '0%',
                opacity: 1,
                duration: 1.0,
                ease: 'power3.out',
            }, '>')
            .to(date, { opacity: 1, duration: 1.0, ease: 'power2.out' }, '>')

            tl.to(s2title, { opacity: 1, y: 0, duration: .8, ease: 'power3.out' }, '>')
            .to(s2title2, { opacity: 1, y: 0, duration: .9, ease: 'power3.out' }, '>')
            tl.to(hex1, {
                opacity: 1,
                scale: 1.15,
                duration: 0.3,
                ease: 'sine.inOut',
            })
            .to(hex1, {
                scale: 1.0,
                duration: 0.3,
                ease: 'sine.inOut',
            })
            .to(hex1, {
                scale: 1.15,
                duration: 0.4,
                ease: 'sine.inOut',
            })
            .to(hex1, {
                scale: 1.0,
                duration: 0.4,
                ease: 'sine.inOut',
            })
            .to(hex1Text, {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                ease: 'power2.out',
                duration: 0.8,
            }, '+=0.3')
            .to(hex2, {
                y: 0,
                opacity: 1,
                scale: 1.2,
                duration: 0.3,
                ease: 'sine.inOut',
            }, '-=0.1')
            .to(hex2, {
                scale: 1.0,
                duration: 0.3,
                ease: 'sine.inOut',
            })
            .to(hex2, {
                scale: 1.15,
                duration: 0.4,
                ease: 'sine.inOut',
            })
            .to(hex2, {
                scale: 1.0,
                duration: 0.4,
                ease: 'sine.inOut',
            })
            // hex2 텍스트
            .to(hex2Text, {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                ease: 'power2.out',
                duration: 0.8,
            }, '>')
            .to(shape5, { opacity: 1, duration: 1.2, ease: 'power3.out' }, '>')
            .to(shape3, { opacity: 1, duration: 1.2, ease: 'power3.out' }, '>')
            .to(shape4, { opacity: 1, duration: 1.2, ease: 'power3.out' }, '>')

            // ✅ s3 타이틀 + 카드
            gsap.set('.s3-title span', { y: 40, opacity: 0 });
            gsap.set('.square-flip', { opacity: 0, scale: 1.1 });

            gsap.timeline({
                scrollTrigger: {
                    trigger: '.s3-title',
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                }
            })
            .to('.s3-title span', { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' });

            

            gsap.timeline({
                scrollTrigger: {
                    trigger: '.s3-content',
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                }
            })
                .to('.square-flip', {
                    opacity: 1,
                    scale: 1,
                    stagger: 0.2,
                    duration: 1,
                    ease: 'power3.out',
                });

        },
    });

    // ✅ 비디오 소스 스위칭
    function handleVideoSource() {
        const video = document.getElementById("heroVideo");
        if (!video) return;

        const isMobile = window.innerWidth <= 1024;
        const targetSrc = isMobile ? "./randing-mobile.mp4" : "./randing.mp4";

        if (!video.src.includes(targetSrc.split("/").pop())) {
            const currentTime = video.currentTime;
            const wasPlaying = !video.paused;
            video.src = targetSrc;
            video.load();
            video.addEventListener(
                "loadeddata",
                function onLoad() {
                    video.currentTime = currentTime;
                    if (wasPlaying) video.play();
                    video.removeEventListener("loadeddata", onLoad);
                },
                { once: true }
            );
        }
    }

    // ✅ 리사이즈 처리
    let resizeTimer = null;
    let isDesktop = window.innerWidth >= 1024;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newIsDesktop = window.innerWidth >= 1024;
            handleVideoSource();
            if (newIsDesktop !== isDesktop) {
                isDesktop = newIsDesktop;
                ScrollTrigger.refresh();
            } else {
                ScrollTrigger.refresh();
            }
        }, 250);
    });
});
