/* =========================================================
   OTO CAR WASH
   MAIN JAVASCRIPT
   Booking FormSubmit Integration
========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       1. MOBILE MENU
    ===================================================== */

    const menuButton = document.getElementById("menuButton");
    const mobileMenu = document.getElementById("mobileMenu");

    if (menuButton && mobileMenu) {

        function closeMobileMenu() {
            mobileMenu.classList.remove("active");
            menuButton.classList.remove("active");

            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open menu");
        }

        menuButton.addEventListener("click", function () {

            const isOpen = mobileMenu.classList.toggle("active");

            menuButton.classList.toggle("active", isOpen);

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuButton.setAttribute(
                "aria-label",
                isOpen ? "Close menu" : "Open menu"
            );

        });

        mobileMenu.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", closeMobileMenu);

        });

        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {
                closeMobileMenu();
            }

        });

    }



    /* =====================================================
       2. SCROLL REVEAL ANIMATIONS
    ===================================================== */

    const revealElements = document.querySelectorAll(".reveal");

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {

        revealElements.forEach(function (element) {

            element.classList.add("visible");

        });

    } else {

        const revealObserver = new IntersectionObserver(

            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);

                    }

                });

            },

            {
                threshold: 0.05,
                rootMargin: "0px 0px 40px 0px"
            }

        );

        revealElements.forEach(function (element) {

            revealObserver.observe(element);

        });

    }



    /* =====================================================
       3. FOOTER CURRENT YEAR
    ===================================================== */

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {

        currentYear.textContent = new Date().getFullYear();

    }



    /* =====================================================
       4. BOOKING DATE VALIDATION
       Prevent selecting past dates
    ===================================================== */

    const appointmentDate = document.getElementById(
        "appointmentDate"
    );

    if (appointmentDate) {

        function updateMinimumDate() {

            const today = new Date();

            const year = today.getFullYear();

            const month = String(
                today.getMonth() + 1
            ).padStart(2, "0");

            const day = String(
                today.getDate()
            ).padStart(2, "0");

            appointmentDate.min = `${year}-${month}-${day}`;

        }

        updateMinimumDate();

        appointmentDate.addEventListener(
            "focus",
            updateMinimumDate
        );

    }



    /* =====================================================
       5. BOOKING FORM
       REAL FORMSUBMIT SUBMISSION
    ===================================================== */

    const bookingForm = document.getElementById("bookingForm");

    if (bookingForm) {

        const submitButton = bookingForm.querySelector(
            'button[type="submit"]'
        );

        const bookingEmail = document.getElementById(
            "bookingEmail"
        );

        const serviceChoices = bookingForm.querySelectorAll(
            'input[name="Service"]'
        );

        /* ---------------------------------------------
           Service selection appearance
        --------------------------------------------- */

        function updateServiceSelection() {

            serviceChoices.forEach(function (radio) {

                const card = radio.closest(".booking-choice");

                if (card) {

                    card.classList.toggle(
                        "selected",
                        radio.checked
                    );

                }

            });

        }

        serviceChoices.forEach(function (radio) {

            radio.addEventListener(
                "change",
                updateServiceSelection
            );

        });

        updateServiceSelection();


        /* ---------------------------------------------
           Optional service selection from URL
           Example: booking.html?service=interior
        --------------------------------------------- */

        const urlParams = new URLSearchParams(
            window.location.search
        );

        const requestedService = urlParams.get("service");

        const serviceMap = {
            interior: "Interior Detailing",
            exterior: "Exterior Detailing",
            oil: "Oil Change"
        };

        if (requestedService && serviceMap[requestedService]) {

            serviceChoices.forEach(function (radio) {

                if (radio.value === serviceMap[requestedService]) {

                    radio.checked = true;

                }

            });

            updateServiceSelection();

        }


        /* ---------------------------------------------
           Validate submission and let FormSubmit handle it

           IMPORTANT:
           No event.preventDefault() here.
        --------------------------------------------- */

        bookingForm.addEventListener("submit", function (event) {

            if (!bookingForm.checkValidity()) {
                return;
            }

            const destination = new URL(
                bookingForm.action,
                window.location.href
            );

            if (
                destination.hostname !== "formsubmit.co" ||
                destination.pathname !==
                    "/zakareyamohammad2@gmail.com"
            ) {

                event.preventDefault();

                alert(
                    "Booking is not configured correctly. " +
                    "Please contact OTO Car Wash."
                );

                return;
            }

            if (bookingEmail) {

                bookingEmail.value = bookingEmail.value.trim();

            }

            if (appointmentDate && appointmentDate.value) {

                const selectedDate = new Date(
                    appointmentDate.value + "T12:00:00"
                );

                const today = new Date();

                today.setHours(0, 0, 0, 0);

                if (selectedDate < today) {

                    event.preventDefault();

                    alert(
                        "Please select today or a future date."
                    );

                    appointmentDate.focus();

                    return;
                }

            }

            /* -----------------------------------------
               Do not show a fake success message.

               The browser submits the form directly
               to FormSubmit.

               FormSubmit handles email delivery and
               displays its submission response.
            ----------------------------------------- */

            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent = "Sending Request...";

            }

        });

    }



    /* =====================================================
       6. CONTACT FORM
       Still a demo until connected separately
    ===================================================== */

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {

        contactForm.addEventListener("submit", function (event) {

            event.preventDefault();

            alert(
                "The contact form is not connected yet. " +
                "Please use the booking page for appointment requests."
            );

        });

    }



    /* =====================================================
       7. HEADER SCROLL EFFECT
    ===================================================== */

    const header = document.querySelector(".main-header");

    function updateHeader() {

        if (!header) {
            return;
        }

        if (window.scrollY > 30) {

            header.style.background = "rgba(5, 6, 8, 0.96)";

        } else {

            header.style.background = "rgba(5, 6, 8, 0.82)";

        }

    }

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    updateHeader();



    /* =====================================================
       8. SMOOTH INTERNAL LINKS
    ===================================================== */

    const internalLinks = document.querySelectorAll(
        'a[href^="#"]'
    );

    internalLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetID = this.getAttribute("href");

            if (!targetID || targetID === "#") {
                return;
            }

            const target = document.getElementById(
                targetID.substring(1)
            );

            if (target) {

                event.preventDefault();

                target.scrollIntoView({

                    behavior: reducedMotion ? "auto" : "smooth",

                    block: "start"

                });

            }

        });

    });


});
/* Open appointment calendar */

const openCalendarBtn = document.getElementById("openCalendarBtn");
const calendarDateInput = document.getElementById("appointmentDate");

if (openCalendarBtn && calendarDateInput) {
    openCalendarBtn.addEventListener("click", function () {
        if (typeof calendarDateInput.showPicker === "function") {
            try {
                calendarDateInput.showPicker();
            } catch (error) {
                calendarDateInput.focus();
                calendarDateInput.click();
            }
        } else {
            calendarDateInput.focus();
            calendarDateInput.click();
        }
    });
}
