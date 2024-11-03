const bill_value_el = document.querySelector(".bill_input_box");
const tip_value_el = document.querySelectorAll(".tip_input_box");
const custom_tip_value_el = document.querySelector(".custom_tip_input_box");
const number_of_people_el = document.querySelector(
  ".number_of_people_input_box"
);
const errorLabel = document.querySelector(".error_message");
const tip_amount_per_person_el = document.querySelector(
  ".tip_amount_box__amount_box"
);
const total_amount_per_person_el = document.querySelector(
  ".total_amount_box__amount_box"
);
const reset_btn = document.querySelector(
  ".main__calculator__final_container_box__reset_button"
);

let bill_value = 0;
let tip_value = 0;
let custom_tip_value = 0;
let number_of_people = 1;

// Function to check if any values are set to enable/disable reset button
function updateResetButtonState() {
  const hasValues =
    bill_value > 0 ||
    tip_value > 0 ||
    custom_tip_value > 0 ||
    number_of_people !== 1;
  reset_btn.disabled = !hasValues;
}

function updateTipButtonStates(selectedButton) {
  const tipButtons = document.querySelectorAll('.tip_input_box[role="radio"]');
  tipButtons.forEach((button) => {
    button.setAttribute(
      "aria-checked",
      button === selectedButton ? "true" : "false"
    );
  });
}

function handleChange(e) {
  if (e.target.classList.contains("bill_input_box")) {
    bill_value = Number(e.target.value);
  }

  if (e.target.classList.contains("tip_input_box")) {
    tip_value = Number(e.target.innerText.slice(0, -1));
    custom_tip_value = 0;
    custom_tip_value_el.value = ""; // Clear custom tip input
  }

  if (e.target.classList.contains("custom_tip_input_box")) {
    custom_tip_value = Number(e.target.value);
    tip_value = 0;
    // Remove active state from preset tip buttons
    tip_value_el.forEach((btn) => (btn.style.backgroundColor = ""));
  }

  if (e.target.classList.contains("number_of_people_input_box")) {
    const value = Number(e.target.value);

    // Handle zero value
    if (value === 0) {
      errorLabel.style.display = "block";
      e.target.style.border = "2px solid orangered";
      number_of_people = 0;
    } else {
      errorLabel.style.display = "none";
      e.target.style.border = "";
      number_of_people = value || 1;
    }
  }

  // Calculate tips only if we have valid inputs
  if (
    bill_value > 0 &&
    (tip_value > 0 || custom_tip_value > 0) &&
    number_of_people > 0
  ) {
    const tip_percent = custom_tip_value || tip_value;
    const tip_amount_per_person =
      ((tip_percent / 100) * bill_value) / number_of_people;
    const total_amount_per_person =
      bill_value / number_of_people + tip_amount_per_person;

    tip_amount_per_person_el.innerText = `$${tip_amount_per_person.toFixed(2)}`;
    total_amount_per_person_el.innerText = `$${total_amount_per_person.toFixed(
      2
    )}`;
  }

  updateResetButtonState();
}

function handleReset() {
  bill_value = 0;
  tip_value = 0;
  custom_tip_value = 0;
  number_of_people = 1;

  // Reset all input fields
  bill_value_el.value = "";
  custom_tip_value_el.value = "";
  number_of_people_el.value = "";

  // Reset error states
  errorLabel.style.display = "none";
  number_of_people_el.style.border = "";

  // Reset tip buttons
  tip_value_el.forEach((btn) => (btn.style.backgroundColor = ""));

  // Reset displayed amounts
  tip_amount_per_person_el.innerText = "$0.00";
  total_amount_per_person_el.innerText = "$0.00";

  // Disable reset button
  reset_btn.disabled = true;
}

// Event Listeners
bill_value_el.addEventListener("input", handleChange);
tip_value_el.forEach((item) =>
  item.addEventListener("click", (e) => {
    handleChange(e);
    updateTipButtonStates(e.target);
  })
);
custom_tip_value_el.addEventListener("input", handleChange);
number_of_people_el.addEventListener("input", handleChange);
reset_btn.addEventListener("click", handleReset);

// Initialize reset button state
updateResetButtonState();
