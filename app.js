const form = document.querySelector('form');
const activitiesTableBody = document.querySelector("section.activities tbody");

form.onsubmit = function(e) {
  e.preventDefault();

  const descriptionInput = document.querySelector("#description-input");
  const timeInput = document.querySelector("#time-input");
  const intensityInput = document.querySelector("#intensity-input");
  activityTracker.addActivity(descriptionInput.value, parseInt(timeInput.value), parseInt(intensityInput.value));
  
  descriptionInput.value = "";
  timeInput.value = "";
  intensityInput.value = "";

  e.preventDefault();
}

activitiesTableBody.onclick = function (e) {
  if (e.target.classList.contains("la-times")) {
    const activityID = e.target.closest(".activity").dataset.id;
    activityTracker.removeActivity(activityID);
  }
};

function formatTime(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hrs > 0) {
    return `${hrs}hrs. ${mins}mins.`;
  } else if (mins > 0) {
    return `${mins}mins.`; 
  } else {
    return 0;
  }  
}


class Activity {
  constructor(description, time, intensity, person, id) {
    this.description = description;
    this.time = time;
    this.intensity = intensity;
    this.id = id;
    this.person = person;
    this.date = new Date();
  }

  formattedTime() {
    return formatTime(this.time);
  }

  formattedDate() {
    return `${this.date.toLocaleDateString('en-us', {month: "long", day: "numeric", year: "numeric"})}`
  }

  calories() {
    return ((this.intensity * this.person.weight) / 60) * this.time;
  }
}

class ActivityTracker {
  constructor(person) {
    this.person = person;
    this.activities = [];
    this.id = 0;
  }

  addActivity(description, time, intensity) {
    this.activities.push(
      new Activity(
        description,
        time,
        intensity,
        this.person,
        this.id++,
      )
    );
    this.redraw();
  }

  removeActivity(id) {
    const activityIndex = this.activities.findIndex((activity) => id == activity.id);
    this.activities.splice(activityIndex, 1);
    this.redraw();
  }

  averageCalories() {
    return Math.floor(this.totalCalories() / this.activities.length) || 0;
  }

  totalFormattedTime() {
    const totalTime = this.activities.reduce((acc, activity) => {
      return acc += activity.time;
    }, 0);

    return formatTime(totalTime);
  }

  totalCalories() {
    return Math.floor(this.activities.reduce((acc, activity) => {
      return (acc += activity.calories());
    }, 0));
  }

  redraw() {
    this.updateheader();
    this.redrawTable();
  }

  updateheader() {
    const activitiesTotal = document.querySelector("#activities-total h3");
    const timeTotal = document.querySelector("#time-total h3");
    const averageCaloriesTotal = document.querySelector("#average-calories-total h3");
    const caloriesTotal = document.querySelector("#calories-total h3");

    activitiesTotal.textContent = this.activities.length;
    timeTotal.textContent = this.totalFormattedTime();
    averageCaloriesTotal.textContent = this.averageCalories();
    caloriesTotal.textContent = this.totalCalories();
  }

  redrawTable() {    
    activitiesTableBody.textContent = "";

    for(const activity of this.activities) {
      activitiesTableBody.insertAdjacentHTML("beforeEnd",`
        <tr class="activity" data-id="${activity.id}">
          <td class="description">${activity.description}</td>
          <td class="calories">${Math.round(activity.calories())}</td>
          <td class="time">${activity.formattedTime()}</td>
          <td class="date">${activity.formattedDate()}</td>
          <td class="close"><i class="las la-times"></i></i></td>
        </tr>
      `);
    }  
  }
}

class Person {
  constructor(name, weight, height, age) {
    this.weight = weight;
    this.height = height;
    this.age = age;
    this.name = name;
  }
}

const john = new Person("John", 86, 190, 40);
const activityTracker = new ActivityTracker(john);
