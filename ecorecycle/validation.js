document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pickupForm");
  if (!form) return;

  form.noValidate = true;

  const nameInput = document.getElementById("nm");
  const phoneInput = document.getElementById("ph");
  const emailInput = document.getElementById("em");
  const wasteSelect = document.getElementById("wt");
  const addressInput = document.getElementById("ad");
  const dateInput = document.getElementById("dt");
  const termsCheckbox = document.getElementById("ok");

  function setFieldError(input, isValid, message) {
    let errorSpan = input.parentElement.querySelector(".error-message");
    if (!errorSpan) {
      errorSpan = document.createElement("div");
      errorSpan.className = "error-message text-danger small mt-1";
      input.parentElement.appendChild(errorSpan);
    }

    if (!isValid) {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
      errorSpan.textContent = message;
      input.setAttribute("aria-invalid", "true");
      return false;
    } else {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
      errorSpan.textContent = "";
      input.setAttribute("aria-invalid", "false");
      return true;
    }
  }

  function validateName() {
    const val = nameInput.value.trim();
    return setFieldError(nameInput, val.length >= 2, "Full name must be at least 2 characters long.");
  }

  function validatePhone() {
    const val = phoneInput.value.trim();
    const phoneRegex = /^\+?[0-9\s\-\(\)]{10,18}$/;
    return setFieldError(phoneInput, phoneRegex.test(val), "Please enter a valid phone number.");
  }

  function validateEmail() {
    const val = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return setFieldError(emailInput, emailRegex.test(val), "Please enter a valid email address.");
  }

  function validateWasteType() {
    return setFieldError(wasteSelect, wasteSelect.value !== "", "Please select a waste type.");
  }

  function validateAddress() {
    const val = addressInput.value.trim();
    return setFieldError(addressInput, val.length >= 5, "Address must be at least 5 characters long.");
  }

  function validateDate() {
    return setFieldError(dateInput, dateInput.value !== "", "Please select a preferred date.");
  }

  if (nameInput) {
    nameInput.addEventListener("input", validateName);
    nameInput.addEventListener("blur", validateName);
  }
  if (phoneInput) {
    phoneInput.addEventListener("input", validatePhone);
    phoneInput.addEventListener("blur", validatePhone);
  }
  if (emailInput) {
    emailInput.addEventListener("input", validateEmail);
    emailInput.addEventListener("blur", validateEmail);
  }
  if (wasteSelect) {
    wasteSelect.addEventListener("change", validateWasteType);
    wasteSelect.addEventListener("blur", validateWasteType);
  }
  if (addressInput) {
    addressInput.addEventListener("input", validateAddress);
    addressInput.addEventListener("blur", validateAddress);
  }
  if (dateInput) {
    dateInput.addEventListener("input", validateDate);
    dateInput.addEventListener("blur", validateDate);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const isNameValid = validateName();
    const isPhoneValid = validatePhone();
    const isEmailValid = validateEmail();
    const isWasteValid = validateWasteType();
    const isAddressValid = validateAddress();
    const isDateValid = validateDate();
    const isTermsValid = termsCheckbox ? termsCheckbox.checked : true;

    if (!isTermsValid) {
      alert("You must agree to the pickup rules and terms.");
      return;
    }

    if (isNameValid && isPhoneValid && isEmailValid && isWasteValid && isAddressValid && isDateValid && isTermsValid) {
      alert("Success! Your pickup request has been submitted.");
      form.reset();
      document.querySelectorAll(".is-valid, .is-invalid").forEach(el => el.classList.remove("is-valid", "is-invalid"));
      document.querySelectorAll(".error-message").forEach(el => el.textContent = "");
    } else {
      alert("Please fix the errors in the form before submitting.");
      const firstInvalid = form.querySelector(".is-invalid");
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }
  });
});