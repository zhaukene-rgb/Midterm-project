document.addEventListener("DOMContentLoaded", () => {
  const pickupForm = document.getElementById("pickupForm");
  if (!pickupForm) return;

  pickupForm.addEventListener("submit", (e) => {
    console.log("Pickup request form handler active.");
  });
});