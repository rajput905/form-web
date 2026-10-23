(() => {
  "use strict";

  const form = document.getElementById("contactForm");
  const submitBtn = form.querySelector(".submit-btn");
  const statusEl = document.getElementById("formStatus");
  const messageInput = document.getElementById("message");
  const messageCount = document.getElementById("message-count");

  const MAX_MESSAGE = 500;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Validation rules ----------
  const rules = {
    name: (value) => {
      if (!value) return "Please enter your name.";
      if (value.length < 2) return "Name should be at least 2 characters.";
      if (!/^[A-Za-z\u00C0-\u024F][A-Za-z\u00C0-\u024F' .-]*$/.test(value)) {
        return "Name can only contain letters, spaces, apostrophes and dashes.";
      }
      return "";
    },

    email: (value) => {
      if (!value) return "Please enter your email address.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        return "Please enter a valid email, for example name@example.com.";
      }
      return "";
    },

    phone: (value) => {
      if (!value) return ""; // optional field
      const digits = value.replace(/[\s\-()]/g, "");
      if (!/^\+?\d{10,15}$/.test(digits)) {
        return "Enter 10 to 15 digits, with an optional + and country code.";
      }
      return "";
    },

    message: (value) => {
      if (!value) return "Please write a short message.";
      if (value.length < 20) return "Message should be at least 20 characters.";
      if (value.length > MAX_MESSAGE) return `Message must be ${MAX_MESSAGE} characters or fewer.`;
      return "";
    }
  };

  // ---------- Helpers ----------
  function getWrapper(input) {
    return input.closest(".field");
  }

  function setFieldState(input, message) {
    const wrapper = getWrapper(input);
    const errorEl = wrapper.querySelector(".error");
    const hasValue = input.value.trim().length > 0;

    errorEl.textContent = message;
    wrapper.classList.toggle("invalid", Boolean(message));
    wrapper.classList.toggle("valid", !message && hasValue);
    input.setAttribute("aria-invalid", String(Boolean(message)));
  }

  function validateField(input) {
    const value = input.value.trim();
    const message = rules[input.name](value);
    setFieldState(input, message);
    return message === "";
  }

  function shakeField(input) {
    if (prefersReduced) return;
    const wrapper = getWrapper(input);
    wrapper.classList.remove("shake");
    void wrapper.offsetWidth; // restart animation if repeated
    wrapper.classList.add("shake");
    wrapper.addEventListener("animationend", () => wrapper.classList.remove("shake"), { once: true });
  }

  function updateCount() {
    const length = messageInput.value.length;
    messageCount.textContent = `${length} / ${MAX_MESSAGE}`;
    messageCount.classList.toggle("near-limit", length >= MAX_MESSAGE * 0.9 && length <= MAX_MESSAGE);
    messageCount.classList.toggle("over-limit", length > MAX_MESSAGE);
  }

  // ---------- Live feedback ----------
  const fields = Array.from(form.querySelectorAll("input, textarea"));

  fields.forEach((input) => {
    // Validate when the user leaves a field, but only if they typed something
    input.addEventListener("blur", () => {
      if (input.value.trim() || getWrapper(input).classList.contains("invalid")) {
        validateField(input);
      }
    });

    // Once a field shows an error, update it live as the user fixes it
    input.addEventListener("input", () => {
      if (getWrapper(input).classList.contains("invalid")) {
        validateField(input);
      }
    });
  });

  messageInput.addEventListener("input", updateCount);
  updateCount();

  // ---------- Submit ----------
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let firstInvalid = null;

    fields.forEach((input) => {
      const valid = validateField(input);
      if (!valid && !firstInvalid) firstInvalid = input;
      if (!valid) shakeField(input);
    });

    if (firstInvalid) {
      firstInvalid.focus();
      statusEl.textContent = "Please fix the highlighted fields.";
      statusEl.className = "status error";
      return;
    }

    sendForm();
  });

  // Replace this function with a real request to your backend or a service such as Formspree.
  function sendForm() {
    submitBtn.disabled = true;
    submitBtn.classList.add("loading");
    statusEl.textContent = "";
    statusEl.className = "status";

    const data = Object.fromEntries(new FormData(form).entries());

    setTimeout(() => {
      console.log("Form data ready to send:", data);

      submitBtn.classList.remove("loading");
      submitBtn.classList.add("success");
      submitBtn.querySelector(".btn-label").textContent = "Message sent";

      statusEl.textContent = "Thanks, your message is received. I will reply within two working days.";
      statusEl.className = "status success";

      form.reset();
      fields.forEach((input) => {
        const wrapper = getWrapper(input);
        wrapper.classList.remove("valid", "invalid");
        wrapper.querySelector(".error").textContent = "";
        input.removeAttribute("aria-invalid");
      });
      updateCount();

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.classList.remove("success");
        submitBtn.querySelector(".btn-label").textContent = "Send message";
      }, 3000);
    }, 1200);
  }
})();