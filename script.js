const wrapper = document.querySelector(".section2"),
  form = wrapper.querySelectorAll(".form"),
  submitInput = form[0].querySelector('input[type="submit"]');

var gender, activity;
var gender_text, activity_text;

// access all the different sections;
// var section2 = document.getElementById("section2"); // no need to hide this
var subsection = document.getElementById("subsection");
var section3 = document.getElementById("section3");
var section4 = document.getElementById("section4");
var meals;

subsection.style.visibility = "hidden";
section3.style.visibility = "hidden";
section4.style.visibility = "hidden";

function getDataForm(e) {
  e.preventDefault();
  var formData = new FormData(form[0]);
  var height = formData.get("heightField");
  var weight = formData.get("weightField");
  var age = formData.get("ageField");
  var g = document.getElementById("formGenderSelect");
  var a = document.getElementById("formActivitySelect");
  gender = g.value;
  gender_text = g.options[g.selectedIndex].text;
  activity = a.value;
  activity_text = a.options[a.selectedIndex].text;

  var BMR;
  if (gender == 2) {
    // women
    BMR = 655.1 + 9.563 * weight + 1.85 * height - 4.676 * age;
  } else {
    BMR = 66.47 + 13.75 * weight + 5.003 * height - 6.755 * age;
  }

  var calories;
  if (activity == 1) {
    calories = BMR * 1.375;
  } else if (activity == 2) {
    calories = BMR * 1.55;
  } else {
    calories = BMR * 1.725;
  }
  //   alert("BMR = " + BMR + "  " + "Calories = " + calories);
  getMealPlan(calories, BMR);
}
document.addEventListener(
  "DOMContentLoaded",
  function () {
    submitInput.addEventListener("click", getDataForm, false);
  },
  false
);

async function getMealPlan(calories, BMR) {
  console.log("calories " + calories + " BMR " + BMR);
  const response = await fetch(
    "https://api.spoonacular.com/mealplanner/generate?apiKey=e200d620255547a8984041e7b4d0a742&timeFrame=day&targetCalories=" +
      Math.floor(calories)
  );
  if (!response.ok) {
    console.log("Error");
    // throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();

  meals = data.meals;
  var nutrients = data.nutrients;
  //   console.log(meals);
  // Fill the nutrients para
  document.getElementById("calories").innerText =
    "Calories: " + nutrients.calories;
  document.getElementById("protein").innerText =
    "Protein: " + nutrients.protein;
  document.getElementById("fat").innerText = "Fat: " + nutrients.fat;
  document.getElementById("carbohydrates").innerText =
    "Carbohydrates: " + nutrients.carbohydrates;
  // Show the nutrients para

  subsection.style.visibility = "visible";

  //fill the cards 1
  document.getElementById("meal_1_title").innerHTML = meals[0].title;
  document.getElementById("meal_1_para").innerText =
    "ready in " + meals[0].readyInMinutes + " minutes";
  //fill card 2
  document.getElementById("meal_2_title").innerHTML = meals[1].title;
  document.getElementById("meal_2_para").innerText =
    "ready in " + meals[1].readyInMinutes + " minutes";
  //fill card 3
  document.getElementById("meal_3_title").innerHTML = meals[2].title;
  document.getElementById("meal_3_para").innerText =
    "ready in " + meals[2].readyInMinutes + " minutes";

  for (var i = 0; i <= 2; i++) {
    const response = await fetch(
      "https://api.spoonacular.com/recipes/" +
        meals[i].id +
        "/information?apiKey=e200d620255547a8984041e7b4d0a742&includeNutrition=false"
    );
    if (!response.ok) {
      console.log("Error");
    }
    const data = await response.json();

    if (i == 0) document.getElementById("breakfast_img").src = data.image;
    if (i == 1) document.getElementById("lunch_img").src = data.image;
    if (i == 2) document.getElementById("dinner_img").src = data.image;
  }
  // show the section 3
  section3.style.visibility = "visible";
}

async function fillTable(idx) {
  let table = document.getElementById("myTable");
  // delete all but the first row of the table
  for (var i = 1; i < table.rows.length; ) {
    table.deleteRow(i);
  }
  var meal_id = meals[idx].id;
  console.log(meal_id);
  const response = await fetch(
    "https://api.spoonacular.com/recipes/" +
      meal_id +
      "/information?apiKey=e200d620255547a8984041e7b4d0a742&includeNutrition=false"
  );
  if (!response.ok) {
    console.log("Error");
  }
  const data = await response.json();

  var ingredients = data.extendedIngredients;
  //   console.log(ingredients);
  for (var i = 0; i < ingredients.length; i++) {
    var nm = ingredients[i].name;
    var measure_amt = ingredients[i].measures.us.amount;
    var measure_unit = ingredients[i].measures.us.unitShort;

    let row = table.insertRow(-1); // We are adding at the end
    let c1 = row.insertCell(0);
    let c2 = row.insertCell(1);
    let c3 = row.insertCell(2);
    c1.innerText = i + 1;
    c2.innerText = nm;
    c3.innerText = measure_amt + " " + measure_unit;

    // console.log(nm + " " + measure_amt + " " + measure_unit);
  }
  section4.style.visibility = "visible";
}

function handleClick(e) {
  var btn = e.target.id;
  if (btn == "breakfast") {
    fillTable(0);
  } else if (btn == "lunch") fillTable(1);
  else fillTable(2);
}

document.getElementById("breakfast").addEventListener("click", handleClick);
document.getElementById("lunch").addEventListener("click", handleClick);
document.getElementById("dinner").addEventListener("click", handleClick);
