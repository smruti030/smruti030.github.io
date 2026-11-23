const $ = id => document.getElementById(id);
const root = document.documentElement;
const EMAIL = "smrutiranjanbehera834@gmail.com";

/* Mobile navigation */
const nav = $("nav");
if (nav) {
    const toggle = nav.querySelector(".nav__toggle");
    const setMenu = open => {
        nav.classList.toggle("open", open);
        toggle?.setAttribute("aria-expanded", String(open));
    };

    toggle?.addEventListener("click", () => {
        setMenu(!nav.classList.contains("open"));
    });

    nav.querySelectorAll(".nav__links a").forEach(link => {
        link.addEventListener("click", () => setMenu(false));
    });

    addEventListener("keydown", event => {
        if (event.key === "Escape" && nav.classList.contains("open")) {
            setMenu(false);
            toggle?.focus();
        }
    });

    matchMedia("(min-width: 1024px)").addEventListener("change", event => {
        if (event.matches) setMenu(false);
    });
}

/* Reveal elements as they enter the viewport */
if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll(".rv").forEach(element => observer.observe(element));
} else {
    document.querySelectorAll(".rv").forEach(element => element.classList.add("in"));
}

/* Scroll progress */
const progress = $("progress");
let scrollFrame = 0;

if (progress) {
    addEventListener("scroll", () => {
        if (scrollFrame) return;

        scrollFrame = requestAnimationFrame(() => {
            scrollFrame = 0;
            const scrollableHeight = root.scrollHeight - innerHeight;
            const percentage = scrollableHeight > 0 ? scrollY / scrollableHeight : 0;
            progress.style.transform = `scaleX(${percentage})`;
        });
    }, { passive: true });
}

/* Pointer glow for mouse-like pointers only */
if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const trackPointer = (element, xProperty, yProperty) => {
        if (!element) return;

        let frame = 0;
        let latestEvent;

        element.addEventListener("pointermove", event => {
            latestEvent = event;
            if (frame) return;

            frame = requestAnimationFrame(() => {
                frame = 0;
                const bounds = element.getBoundingClientRect();
                element.style.setProperty(xProperty, `${latestEvent.clientX - bounds.left}px`);
                element.style.setProperty(yProperty, `${latestEvent.clientY - bounds.top}px`);
            });
        }, { passive: true });
    };

    trackPointer($("hero"), "--gx", "--gy");
    document.querySelectorAll(".card").forEach(card => {
        trackPointer(card, "--mx", "--my");
    });
}

/* India local clock */
const clock = $("clock2");
const updateClock = () => {
    if (!clock) return;
    clock.textContent = new Date().toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
    }) + " IST";
};
updateClock();
if (clock) setInterval(updateClock, 15000);

/* Copy contact email */
const copyButton = $("copy");
if (copyButton) {
    copyButton.addEventListener("click", async () => {
        const status = $("status");
        let copied = false;

        try {
            await navigator.clipboard.writeText(EMAIL);
            copied = true;
        } catch {
            const temporaryInput = document.createElement("textarea");
            temporaryInput.value = EMAIL;
            temporaryInput.setAttribute("readonly", "");
            temporaryInput.style.cssText = "position:fixed;top:0;left:0;opacity:0";
            document.body.appendChild(temporaryInput);
            temporaryInput.select();
            temporaryInput.setSelectionRange(0, EMAIL.length);

            try {
                copied = document.execCommand("copy");
            } catch {
                copied = false;
            }
            temporaryInput.remove();
        }

        if (status) {
            status.textContent = copied
                ? "Email copied"
                : "Copy failed. Select the email address above.";
            setTimeout(() => { status.textContent = ""; }, copied ? 2500 : 5000);
        }
    });
}

/* Prepare a quote request in the visitor's email app */
const quoteForm = $("quote");
if (quoteForm) {
    quoteForm.addEventListener("submit", event => {
        event.preventDefault();

        const formData = new FormData(quoteForm);
        const name = formData.get("name") || "";
        const body = [
            `Name: ${name}`,
            `Email: ${formData.get("email") || ""}`,
            `Business type: ${formData.get("type") || ""}`,
            `Needed by: ${formData.get("when") || "Not sure yet"}`,
            "",
            "What I need built:",
            formData.get("brief") || ""
        ].join("\n");

        const subject = `Project enquiry from ${name}`;
        window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
}


/* More Systems carousel: pause for pointer, keyboard focus and hidden tabs */
const moreCarousel = document.querySelector(".more-carousel");
if (moreCarousel) {
    moreCarousel.addEventListener("pointerenter", () => moreCarousel.classList.add("is-paused"));
    moreCarousel.addEventListener("pointerleave", () => moreCarousel.classList.remove("is-paused"));
    moreCarousel.addEventListener("focusin", () => moreCarousel.classList.add("is-paused"));
    moreCarousel.addEventListener("focusout", event => {
        if (!moreCarousel.contains(event.relatedTarget)) {
            moreCarousel.classList.remove("is-paused");
        }
    });
    document.addEventListener("visibilitychange", () => {
        moreCarousel.classList.toggle("is-paused", document.hidden);
    });
}
