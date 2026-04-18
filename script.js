"use strict";

(function () {
    // ===========================
    // Terminal Typing Animation
    // ===========================
    const commands = [
        "npm run build",
        "deploying to production...",
        "python train_model.py",
        "arduino upload --port COM3",
        "git push origin main",
        "expo start --tunnel",
        "firebase deploy --only hosting",
    ];

    let cmdIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    var typedCmd = document.getElementById("typedCmd");

    function typeTerminal() {
        if (!typedCmd) return;
        var current = commands[cmdIndex];

        if (isDeleting) {
            typedCmd.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedCmd.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        var delay = isDeleting ? 30 : 60;

        if (!isDeleting && charIndex === current.length) {
            delay = 2200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            cmdIndex = (cmdIndex + 1) % commands.length;
            delay = 500;
        }

        setTimeout(typeTerminal, delay);
    }

    typeTerminal();

    // ===========================
    // Mobile Menu
    // ===========================
    var burger = document.getElementById("navBurger");
    var mobileMenu = document.getElementById("mobileMenu");

    function toggleMenu() {
        var isActive = burger.classList.toggle("active");
        mobileMenu.classList.toggle("active");
        burger.setAttribute("aria-expanded", String(isActive));
        mobileMenu.setAttribute("aria-hidden", String(!isActive));
        document.body.style.overflow = isActive ? "hidden" : "";
    }

    function closeMenu() {
        burger.classList.remove("active");
        mobileMenu.classList.remove("active");
        burger.setAttribute("aria-expanded", "false");
        mobileMenu.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    burger.addEventListener("click", toggleMenu);

    // Close on link click
    var mobileLinks = mobileMenu.querySelectorAll("a");
    for (var i = 0; i < mobileLinks.length; i++) {
        mobileLinks[i].addEventListener("click", closeMenu);
    }

    // Close on Escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
            closeMenu();
            burger.focus();
        }
    });

    // ===========================
    // Smooth Scroll
    // ===========================
    var anchors = document.querySelectorAll('a[href^="#"]');
    for (var j = 0; j < anchors.length; j++) {
        anchors[j].addEventListener("click", function (e) {
            e.preventDefault();
            var href = this.getAttribute("href");
            var target = document.querySelector(href);
            if (target) {
                var offset = 80;
                var top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: "smooth" });
            }
        });
    }

    // ===========================
    // Scroll Reveal
    // ===========================
    var reveals = document.querySelectorAll(".reveal");

    var revealObserver = new IntersectionObserver(
        function (entries) {
            for (var k = 0; k < entries.length; k++) {
                if (entries[k].isIntersecting) {
                    entries[k].target.classList.add("visible");
                }
            }
        },
        { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    for (var m = 0; m < reveals.length; m++) {
        revealObserver.observe(reveals[m]);
    }

    // ===========================
    // Active Nav Link
    // ===========================
    var sections = document.querySelectorAll("section[id]");
    var navLinks = document.querySelectorAll(".nav-links a");

    var navObserver = new IntersectionObserver(
        function (entries) {
            for (var n = 0; n < entries.length; n++) {
                if (entries[n].isIntersecting) {
                    var id = entries[n].target.getAttribute("id");
                    for (var p = 0; p < navLinks.length; p++) {
                        if (navLinks[p].getAttribute("href") === "#" + id) {
                            navLinks[p].classList.add("active");
                        } else {
                            navLinks[p].classList.remove("active");
                        }
                    }
                }
            }
        },
        { threshold: 0.3 }
    );

    for (var q = 0; q < sections.length; q++) {
        navObserver.observe(sections[q]);
    }

    // ===========================
    // Duplicate skills for infinite marquee
    // ===========================
    var skillsRow = document.getElementById("skillsRow");
    if (skillsRow) {
        skillsRow.innerHTML += skillsRow.innerHTML;
    }

    // ===========================
    // Back to Top
    // ===========================
    var backToTop = document.querySelector(".back-to-top");
    if (backToTop) {
        backToTop.addEventListener("click", function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // ===========================
    // Parallax on hero elements
    // ===========================
    var codeWindow = document.querySelector(".code-window");

    window.addEventListener("scroll", function () {
        var scrollY = window.scrollY;
        if (scrollY < window.innerHeight && codeWindow) {
            codeWindow.style.transform = "translateY(" + scrollY * 0.04 + "px)";
        }
    }, { passive: true });

    // ===========================
    // Card tilt effect on hover
    // ===========================
    var tiltCards = document.querySelectorAll(".folder-icon, .edu-card");

    for (var r = 0; r < tiltCards.length; r++) {
        (function (card) {
            card.addEventListener("mousemove", function (e) {
                var rect = card.getBoundingClientRect();
                var x = (e.clientX - rect.left) / rect.width - 0.5;
                var y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform =
                    "perspective(600px) rotateY(" + x * 6 + "deg) rotateX(" + -y * 6 + "deg) translateY(-8px)";
            });

            card.addEventListener("mouseleave", function () {
                card.style.transform = "";
            });
        })(tiltCards[r]);
    }

    // ===========================
    // Prevent console tampering info
    // ===========================
    if (typeof console !== "undefined") {
        console.log(
            "%cDebjyoti Sarkar Portfolio",
            "color: #8b5e3c; font-size: 20px; font-weight: bold; font-family: 'Syne', sans-serif;"
        );
        console.log(
            "%cBuilt with care. No frameworks, just clean HTML/CSS/JS.",
            "color: #5a5a5a; font-size: 12px;"
        );
    }
})();
