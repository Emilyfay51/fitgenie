const planForm = document.getElementById("planForm");
const regenerateButton = document.getElementById("regenerateButton");
const saveButton = document.getElementById("saveButton");
const clearProgressButton = document.getElementById("clearProgressButton");
const themeToggle = document.getElementById("themeToggle");
const emptyState = document.getElementById("emptyState");
const planMeta = document.getElementById("planMeta");
const planContainer = document.getElementById("planContainer");
const coachCopy = document.getElementById("coachCopy");
const fastingPanel = document.getElementById("fastingPanel");
const fastingWindow = document.getElementById("fastingWindow");
const fastingSummary = document.getElementById("fastingSummary");
const fastingTips = document.getElementById("fastingTips");
const dashboardGrid = document.getElementById("dashboardGrid");
const savedPlansList = document.getElementById("savedPlansList");

const dayCardTemplate = document.getElementById("dayCardTemplate");
const exerciseItemTemplate = document.getElementById("exerciseItemTemplate");

const STORAGE_KEYS = {
  theme: "fitgenie-theme",
  currentPlan: "fitgenie-current-plan",
  savedPlans: "fitgenie-saved-plans",
  progress: "fitgenie-progress"
};

let currentRenderedPlan = null;
let currentFormValues = null;

const routineLibrary = {
  upper: [
    { name: "Push-ups", beginner: "3x10", intermediate: "4x12", advanced: "5x15", description: "Build chest, shoulders, and triceps with a controlled tempo.", equipment: ["home", "gym"] },
    { name: "Dumbbell Bench Press", beginner: "3x10", intermediate: "4x10", advanced: "5x8", description: "Press smoothly and pause at the bottom for stability.", equipment: ["home", "gym"] },
    { name: "Single-Arm Dumbbell Rows", beginner: "3x12", intermediate: "4x10", advanced: "4x12", description: "Drive elbows back to train lats and upper back.", equipment: ["home", "gym"] },
    { name: "Lat Pulldowns", beginner: "3x12", intermediate: "4x10", advanced: "4x8", description: "Control the lowering phase and keep ribs down.", equipment: ["gym"] },
    { name: "Shoulder Press", beginner: "3x10", intermediate: "4x8", advanced: "5x6", description: "Press overhead while bracing your core.", equipment: ["home", "gym"] },
    { name: "Lateral Raises", beginner: "2x15", intermediate: "3x15", advanced: "4x12", description: "Light weight, clean form, no shrugging.", equipment: ["home", "gym"] },
    { name: "Biceps Curls", beginner: "2x12", intermediate: "3x12", advanced: "3x10", description: "Keep elbows still and squeeze at the top.", equipment: ["home", "gym"] },
    { name: "Triceps Pressdowns", beginner: "2x12", intermediate: "3x12", advanced: "3x10", description: "Lock out fully without swinging the cable.", equipment: ["gym"] },
    { name: "Band Chest Press", beginner: "3x12", intermediate: "4x12", advanced: "4x15", description: "A home-friendly chest press that keeps constant tension on the muscles.", equipment: ["home"] },
    { name: "Pike Push-ups", beginner: "3x8", intermediate: "4x10", advanced: "4x12", description: "Shift bodyweight overhead to build shoulders without equipment.", equipment: ["home"] }
  ],
  lower: [
    { name: "Goblet Squats", beginner: "3x12", intermediate: "4x10", advanced: "4x8", description: "Sit down between your hips and keep your chest tall.", equipment: ["home", "gym"] },
    { name: "Back Squats", beginner: "3x8", intermediate: "4x8", advanced: "5x5", description: "Brace before each rep and drive through the floor.", equipment: ["gym"] },
    { name: "Romanian Deadlifts", beginner: "3x10", intermediate: "4x8", advanced: "5x6", description: "Push hips back to load hamstrings and glutes.", equipment: ["home", "gym"] },
    { name: "Walking Lunges", beginner: "3x10 each leg", intermediate: "3x12 each leg", advanced: "4x12 each leg", description: "Stay balanced and keep knees tracking over toes.", equipment: ["home", "gym"] },
    { name: "Leg Press", beginner: "3x12", intermediate: "4x10", advanced: "4x8", description: "Control depth and avoid bouncing at the bottom.", equipment: ["gym"] },
    { name: "Hip Thrusts", beginner: "3x12", intermediate: "4x10", advanced: "4x8", description: "Pause at the top and keep your ribs stacked.", equipment: ["home", "gym"] },
    { name: "Calf Raises", beginner: "3x15", intermediate: "4x15", advanced: "4x20", description: "Full stretch at the bottom, squeeze hard at the top.", equipment: ["home", "gym"] },
    { name: "Bodyweight Split Squats", beginner: "3x10 each leg", intermediate: "4x10 each leg", advanced: "4x12 each leg", description: "A home option that builds balance and leg endurance.", equipment: ["home"] },
    { name: "Glute Bridges", beginner: "3x15", intermediate: "4x15", advanced: "4x20", description: "Drive through your heels and squeeze glutes hard at the top.", equipment: ["home"] }
  ],
  cardio: [
    { name: "Incline Walk", beginner: "20 min", intermediate: "25 min", advanced: "30 min", description: "Steady effort that keeps your heart rate elevated.", equipment: ["home", "gym"] },
    { name: "Bike Intervals", beginner: "6 rounds", intermediate: "8 rounds", advanced: "10 rounds", description: "Push for 30 seconds, recover for 60 seconds.", equipment: ["home", "gym"] },
    { name: "Rowing Machine", beginner: "12 min", intermediate: "15 min", advanced: "20 min", description: "Smooth, strong strokes with consistent pace.", equipment: ["gym"] },
    { name: "Jump Rope", beginner: "8 min", intermediate: "10 min", advanced: "12 min", description: "Short bursts to boost conditioning and coordination.", equipment: ["home", "gym"] },
    { name: "Low-Impact March Circuit", beginner: "10 min", intermediate: "14 min", advanced: "18 min", description: "A joint-friendly cardio block for home training days.", equipment: ["home"] }
  ],
  core: [
    { name: "Front Plank", beginner: "3x30 sec", intermediate: "3x45 sec", advanced: "4x60 sec", description: "Keep glutes tight and avoid arching your back.", equipment: ["home", "gym"] },
    { name: "Dead Bugs", beginner: "3x10 each side", intermediate: "3x12 each side", advanced: "4x12 each side", description: "Move slowly to train core control.", equipment: ["home", "gym"] },
    { name: "Hanging Knee Raises", beginner: "3x8", intermediate: "3x12", advanced: "4x12", description: "Lift with abs, not momentum.", equipment: ["gym"] },
    { name: "Russian Twists", beginner: "3x12 each side", intermediate: "3x16 each side", advanced: "4x16 each side", description: "Rotate through your torso without collapsing.", equipment: ["home", "gym"] },
    { name: "Bird Dogs", beginner: "3x10 each side", intermediate: "3x12 each side", advanced: "4x12 each side", description: "Build trunk stability with slow, controlled reps.", equipment: ["home"] }
  ]
};

const splitTemplates = {
  3: [
    { title: "Full Body A", focus: "Strength Base", groups: ["upper", "lower", "core"] },
    { title: "Full Body B", focus: "Balanced Volume", groups: ["lower", "upper", "core"] },
    { title: "Conditioning + Core", focus: "Engine Builder", groups: ["cardio", "lower", "core"] }
  ],
  4: [
    { title: "Upper Body", focus: "Push + Pull", groups: ["upper"] },
    { title: "Lower Body", focus: "Leg Strength", groups: ["lower", "core"] },
    { title: "Upper Body 2", focus: "Shoulders + Back", groups: ["upper", "core"] },
    { title: "Lower Body 2", focus: "Glutes + Conditioning", groups: ["lower", "cardio"] }
  ],
  5: [
    { title: "Push Day", focus: "Chest + Shoulders", groups: ["upper"] },
    { title: "Lower Body", focus: "Squat Pattern", groups: ["lower"] },
    { title: "Pull Day", focus: "Back + Arms", groups: ["upper"] },
    { title: "Conditioning", focus: "Work Capacity", groups: ["cardio", "core"] },
    { title: "Lower Body 2", focus: "Hinge + Glutes", groups: ["lower", "core"] }
  ]
};

const fastingLibrary = {
  none: {
    label: "Open schedule",
    summary: "You are not using intermittent fasting, so keep meals consistent around workouts and focus on protein, hydration, and a repeatable calorie target.",
    tips: [
      { title: "Pre-workout", body: "Eat a light meal with protein and carbs 60 to 120 minutes before training when possible." },
      { title: "Recovery", body: "Aim for a protein-rich meal after training to support recovery and muscle retention." },
      { title: "Consistency", body: "Keep meal timing steady enough that workouts feel predictable week to week." }
    ]
  },
  "12:12": {
    label: "12 hours fast / 12 hours eat",
    summary: "This beginner-friendly fasting window keeps structure high without making training feel under-fueled. It pairs well with general fitness and fat-loss goals.",
    tips: [
      { title: "Training timing", body: "Schedule workouts near the start or middle of your eating window for easier energy management." },
      { title: "First meal", body: "Break the fast with protein, fiber, and slow carbs instead of a huge snack-heavy meal." },
      { title: "Hydration", body: "Use water, black coffee, or unsweetened tea during the fasting window." }
    ]
  },
  "14:10": {
    label: "14 hours fast / 10 hours eat",
    summary: "This balanced fasting split is a strong middle ground if you want appetite control and a clearer routine while still leaving room for solid workout nutrition.",
    tips: [
      { title: "Lift fed if possible", body: "For harder lifting days, train after your first meal or shortly before your eating window opens." },
      { title: "Protein target", body: "Spread protein across 2 to 3 meals so you do not cram everything into one sitting." },
      { title: "Recovery days", body: "Keep the fasting schedule the same on rest days to make the habit easier to sustain." }
    ]
  },
  "16:8": {
    label: "16 hours fast / 8 hours eat",
    summary: "The classic 16:8 approach can work well for fat loss, but training quality matters. Your routine should stay intense enough that you preserve strength and muscle.",
    tips: [
      { title: "Protect performance", body: "Place demanding workouts inside your eating window whenever you can." },
      { title: "Break fast smart", body: "Open with protein plus easy-to-digest carbs before larger meals later in the window." },
      { title: "Do not under-eat", body: "A short eating window still needs enough total calories and protein to match your goal." }
    ]
  }
};

const restDayTemplates = {
  muscle: "On rest days, keep movement easy: a 20-minute walk, light stretching, and a protein-forward meal rhythm to support recovery and growth.",
  "fat-loss": "Rest days should still feel active. Use easy walks, hydration, and a consistent eating window so the plan stays sustainable.",
  strength: "Treat rest days as performance prep. Keep stress low, eat enough protein, and avoid turning your off day into a surprise hard cardio day.",
  general: "Your off days are for mobility, energy, and consistency. Aim for light movement and enough sleep to keep momentum high."
};

const warmupTemplates = {
  beginner: ["2 minutes of brisk walking or marching", "bodyweight squats x10", "arm circles x20", "hip openers x8 each side"],
  intermediate: ["3 minutes of easy cardio", "glute bridges x12", "band pull-aparts x15", "world's greatest stretch x5 each side"],
  advanced: ["5 minutes of easy cardio", "dynamic lunges x10 each side", "scap push-ups x12", "hinge pattern drill x10"]
};

function getSavedPlans() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.savedPlans) || "[]");
}

function setSavedPlans(plans) {
  localStorage.setItem(STORAGE_KEYS.savedPlans, JSON.stringify(plans));
}

function getProgressState() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.progress) || "{}");
}

function setProgressState(state) {
  localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(state));
}

function getDurationModifier(duration) {
  if (duration <= 30) return -1;
  if (duration >= 60) return 1;
  return 0;
}

function getExerciseCount(goal, group, duration) {
  const map = {
    muscle: { upper: 4, lower: 4, cardio: 1, core: 2 },
    "fat-loss": { upper: 3, lower: 3, cardio: 2, core: 2 },
    strength: { upper: 4, lower: 4, cardio: 1, core: 1 },
    general: { upper: 3, lower: 3, cardio: 1, core: 2 }
  };
  return Math.max(1, (map[goal][group] ?? 2) + getDurationModifier(duration));
}

function normalizeEquipment(location) {
  return location === "both" ? ["home", "gym"] : [location];
}

function sampleExercises(group, formValues, usedNames, count) {
  const allowedEquipment = normalizeEquipment(formValues.location);
  const preferred = routineLibrary[group].filter(
    (exercise) =>
      !usedNames.has(exercise.name) &&
      exercise.equipment.some((equipment) => allowedEquipment.includes(equipment))
  );
  const fallback = routineLibrary[group].filter((exercise) => !usedNames.has(exercise.name));
  const pool = [...(preferred.length >= count ? preferred : fallback)];
  const selected = [];

  while (selected.length < count && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length);
    const [exercise] = pool.splice(index, 1);
    usedNames.add(exercise.name);
    selected.push({
      name: exercise.name,
      sets: exercise[formValues.experience],
      description: exercise.description
    });
  }

  return selected;
}

function generatePlan(formValues) {
  const template = splitTemplates[formValues.days];
  const usedNames = new Set();

  return template.map((day, index) => ({
    id: `day-${index + 1}`,
    dayLabel: `Day ${index + 1}`,
    title: day.title,
    focus: day.focus,
    exercises: day.groups.flatMap((group) =>
      sampleExercises(group, formValues, usedNames, getExerciseCount(formValues.goal, group, formValues.duration))
    )
  }));
}

function calculateHydration(formValues) {
  const activityBonus = { low: 8, moderate: 16, high: 24 }[formValues.activity];
  const fastingBonus = formValues.fasting === "16:8" ? 12 : formValues.fasting === "14:10" ? 8 : formValues.fasting === "12:12" ? 4 : 0;
  const durationBonus = formValues.duration >= 60 ? 12 : formValues.duration >= 45 ? 8 : 4;
  const ounces = Math.round(formValues.weight * 0.5 + activityBonus + fastingBonus + durationBonus);

  return {
    ounces,
    liters: (ounces * 0.0295735).toFixed(1),
    note: "Aim to front-load some hydration early in the day, then add another 16 to 24 oz around training."
  };
}

function calculateMetrics(formValues) {
  const bmi = (formValues.weight / (formValues.height * formValues.height)) * 703;
  const activityMultiplier = { low: 1.35, moderate: 1.5, high: 1.7 }[formValues.activity];
  const maintenanceCalories = Math.round(formValues.weight * 14 * activityMultiplier);

  return {
    bmi: bmi.toFixed(1),
    maintenanceCalories,
    calorieRange:
      formValues.goal === "fat-loss"
        ? `${maintenanceCalories - 350} to ${maintenanceCalories - 200}`
        : formValues.goal === "muscle"
          ? `${maintenanceCalories + 200} to ${maintenanceCalories + 300}`
          : `${maintenanceCalories - 100} to ${maintenanceCalories + 100}`
  };
}

function getMealTimingTips(formValues) {
  if (formValues.fasting === "none") {
    return [
      "Have a balanced meal 60 to 120 minutes before lifting when possible.",
      "Get protein and carbs in after training to support recovery."
    ];
  }

  const tips = [
    "Train inside your eating window for the hardest sessions whenever possible.",
    "Open your eating window with protein plus easy carbs instead of a huge snack dump."
  ];

  if (formValues.goal === "fat-loss") tips.push("Use high-volume foods in the first meal so the fasting window feels easier to maintain.");
  if (formValues.goal === "muscle") tips.push("Do not let a shorter eating window crowd out total protein and calories across the day.");

  return tips;
}

function buildCoachExplanation(formValues, plan) {
  const goalLabel = {
    muscle: "muscle growth",
    "fat-loss": "fat loss",
    strength: "strength gains",
    general: "general fitness"
  }[formValues.goal];

  const locationLabel = {
    home: "at home",
    gym: "in the gym",
    both: "in either space"
  }[formValues.location];

  const emphasis = {
    muscle: "Volume is slightly higher so you get enough quality sets across the week.",
    "fat-loss": "Conditioning is blended in so the plan feels energetic without becoming random cardio.",
    strength: "Main lifts stay more focused so you can push load and recover properly.",
    general: "The split stays balanced so it is easy to sustain and repeat."
  }[formValues.goal];

  coachCopy.innerHTML = `
    <h3>${formValues.experience[0].toUpperCase() + formValues.experience.slice(1)} routine for ${goalLabel}</h3>
    <p>
      This ${formValues.days}-day split is designed for ${formValues.duration}-minute sessions ${locationLabel}.
      ${emphasis} Your weekly plan includes ${plan.reduce((total, day) => total + day.exercises.length, 0)} exercise slots.
    </p>
    <p>
      The coaching add-ons line up your hydration, fasting rhythm, recovery, and meal timing so the routine feels like one system instead of separate tips.
    </p>
  `;
}

function renderFastingGuide(fastingMode) {
  const guide = fastingLibrary[fastingMode];

  if (!guide) {
    fastingPanel.hidden = true;
    return;
  }

  fastingPanel.hidden = false;
  fastingWindow.textContent = guide.label;
  fastingSummary.textContent = guide.summary;
  fastingTips.innerHTML = "";

  guide.tips.forEach((tip) => {
    const card = document.createElement("article");
    card.className = "tip-card";
    card.innerHTML = `<strong>${tip.title}</strong><p>${tip.body}</p>`;
    fastingTips.appendChild(card);
  });
}

function renderMeta(formValues) {
  planMeta.hidden = false;
  planMeta.innerHTML = "";

  [
    `Goal: ${formValues.goal.replace("-", " ")}`,
    `Level: ${formValues.experience}`,
    `Schedule: ${formValues.days} days`,
    `Fasting: ${formValues.fasting}`,
    `Location: ${formValues.location}`,
    `Duration: ${formValues.duration} min`
  ].forEach((label) => {
    const pill = document.createElement("span");
    pill.className = "meta-pill";
    pill.textContent = label;
    planMeta.appendChild(pill);
  });
}

function getPlanProgress(plan) {
  const progressState = getProgressState();
  const keys = plan.flatMap((day) => day.exercises.map((exercise) => `${day.id}-${exercise.name}`));
  const completed = keys.filter((key) => progressState[key]).length;
  return {
    completed,
    total: keys.length,
    percent: keys.length ? Math.round((completed / keys.length) * 100) : 0
  };
}

function createDashboardCard(title, value, body) {
  return `<article class="dashboard-card"><span>${title}</span><strong>${value}</strong><p>${body}</p></article>`;
}

function renderDashboard(formValues, plan) {
  const hydration = calculateHydration(formValues);
  const metrics = calculateMetrics(formValues);
  const progress = getPlanProgress(plan);
  const mealTips = getMealTimingTips(formValues);
  const warmup = warmupTemplates[formValues.experience].join(", ");

  dashboardGrid.innerHTML = [
    createDashboardCard("Water intake", `${hydration.ounces} oz / ${hydration.liters} L`, hydration.note),
    createDashboardCard("Estimated BMI", metrics.bmi, `Maintenance calories land around ${metrics.maintenanceCalories}/day.`),
    createDashboardCard("Goal calories", metrics.calorieRange, "A practical daily target band based on your current goal."),
    createDashboardCard("Weekly progress", `${progress.completed}/${progress.total}`, `${progress.percent}% of your current plan checked off.`),
    createDashboardCard("Warm-up flow", `${formValues.duration < 45 ? "5" : "8"} min`, warmup),
    createDashboardCard("Rest day focus", "Recovery", restDayTemplates[formValues.goal])
  ].join("");

  const mealCard = document.createElement("article");
  mealCard.className = "dashboard-card dashboard-card-wide";
  mealCard.innerHTML = `
    <span>Meal timing</span>
    <strong>${formValues.fasting === "none" ? "Fuel around training" : "Fasting-aware fueling"}</strong>
    <p>${mealTips.join(" ")}</p>
  `;
  dashboardGrid.appendChild(mealCard);
}

function renderPlan(plan, formValues) {
  currentRenderedPlan = plan;
  currentFormValues = formValues;
  emptyState.hidden = true;
  renderMeta(formValues);
  buildCoachExplanation(formValues, plan);
  renderFastingGuide(formValues.fasting);
  renderDashboard(formValues, plan);
  planContainer.innerHTML = "";

  const progressState = getProgressState();

  plan.forEach((day) => {
    const dayNode = dayCardTemplate.content.firstElementChild.cloneNode(true);
    dayNode.querySelector(".day-label").textContent = day.dayLabel;
    dayNode.querySelector(".day-title").textContent = day.title;
    dayNode.querySelector(".focus-chip").textContent = day.focus;

    const exerciseList = dayNode.querySelector(".exercise-list");

    day.exercises.forEach((exercise) => {
      const exerciseNode = exerciseItemTemplate.content.firstElementChild.cloneNode(true);
      const checkbox = exerciseNode.querySelector("input");
      const exerciseKey = `${day.id}-${exercise.name}`;

      exerciseNode.querySelector(".exercise-name").textContent = exercise.name;
      exerciseNode.querySelector(".exercise-sets").textContent = exercise.sets;
      exerciseNode.querySelector(".exercise-description").textContent = exercise.description;

      checkbox.checked = Boolean(progressState[exerciseKey]);
      checkbox.addEventListener("change", () => {
        const nextProgress = getProgressState();
        nextProgress[exerciseKey] = checkbox.checked;
        setProgressState(nextProgress);
        renderDashboard(formValues, plan);
      });

      exerciseList.appendChild(exerciseNode);
    });

    planContainer.appendChild(dayNode);
  });
}

function getFormValues() {
  const formData = new FormData(planForm);
  return {
    goal: formData.get("goal"),
    experience: formData.get("experience"),
    days: Number(formData.get("days")),
    fasting: formData.get("fasting"),
    location: formData.get("location"),
    duration: Number(formData.get("duration")),
    weight: Number(formData.get("weight")),
    height: Number(formData.get("height")),
    activity: formData.get("activity")
  };
}

function persistCurrentPlan(plan, formValues) {
  localStorage.setItem(STORAGE_KEYS.currentPlan, JSON.stringify({ formValues, plan }));
}

function generateAndRender(formValues) {
  const plan = generatePlan(formValues);
  persistCurrentPlan(plan, formValues);
  renderPlan(plan, formValues);
}

function saveCurrentPlan() {
  if (!currentRenderedPlan || !currentFormValues) return;

  const entry = {
    id: Date.now(),
    name: `${currentFormValues.goal.replace("-", " ")} / ${currentFormValues.days} days / ${currentFormValues.location}`,
    formValues: currentFormValues,
    plan: currentRenderedPlan,
    savedAt: new Date().toLocaleDateString()
  };

  setSavedPlans([entry, ...getSavedPlans()].slice(0, 6));
  renderSavedPlans();
}

function loadSavedPlanById(planId) {
  const match = getSavedPlans().find((entry) => entry.id === planId);
  if (!match) return;

  planForm.goal.value = match.formValues.goal;
  planForm.experience.value = match.formValues.experience;
  planForm.days.value = String(match.formValues.days);
  planForm.fasting.value = match.formValues.fasting;
  planForm.location.value = match.formValues.location;
  planForm.duration.value = String(match.formValues.duration);
  planForm.weight.value = String(match.formValues.weight);
  planForm.height.value = String(match.formValues.height);
  planForm.activity.value = match.formValues.activity;
  persistCurrentPlan(match.plan, match.formValues);
  renderPlan(match.plan, match.formValues);
}

function deleteSavedPlanById(planId) {
  setSavedPlans(getSavedPlans().filter((entry) => entry.id !== planId));
  renderSavedPlans();
}

function renderSavedPlans() {
  const savedPlans = getSavedPlans();

  if (savedPlans.length === 0) {
    savedPlansList.innerHTML = `<p class="saved-empty">Save a plan to keep a few favorite versions handy.</p>`;
    return;
  }

  savedPlansList.innerHTML = "";

  savedPlans.forEach((entry) => {
    const item = document.createElement("article");
    item.className = "saved-plan-card";
    item.innerHTML = `
      <div>
        <strong>${entry.name}</strong>
        <p>Saved ${entry.savedAt}</p>
      </div>
      <div class="saved-plan-actions">
        <button class="ghost-button" type="button" data-load="${entry.id}">Load</button>
        <button class="ghost-button" type="button" data-delete="${entry.id}">Delete</button>
      </div>
    `;
    savedPlansList.appendChild(item);
  });
}

function loadCurrentPlan() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.currentPlan) || "null");
  if (!saved) return;

  planForm.goal.value = saved.formValues.goal;
  planForm.experience.value = saved.formValues.experience;
  planForm.days.value = String(saved.formValues.days);
  planForm.fasting.value = saved.formValues.fasting;
  planForm.location.value = saved.formValues.location;
  planForm.duration.value = String(saved.formValues.duration);
  planForm.weight.value = String(saved.formValues.weight);
  planForm.height.value = String(saved.formValues.height);
  planForm.activity.value = saved.formValues.activity;
  renderPlan(saved.plan, saved.formValues);
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEYS.theme, theme);
}

planForm.addEventListener("submit", (event) => {
  event.preventDefault();
  generateAndRender(getFormValues());
});

regenerateButton.addEventListener("click", () => {
  generateAndRender(getFormValues());
});

saveButton.addEventListener("click", () => {
  saveCurrentPlan();
});

clearProgressButton.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEYS.progress);
  if (currentRenderedPlan && currentFormValues) renderPlan(currentRenderedPlan, currentFormValues);
});

savedPlansList.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.dataset.load) loadSavedPlanById(Number(target.dataset.load));
  if (target.dataset.delete) deleteSavedPlanById(Number(target.dataset.delete));
});

themeToggle.addEventListener("click", () => {
  applyTheme(document.body.dataset.theme === "dark" ? "light" : "dark");
});

applyTheme(localStorage.getItem(STORAGE_KEYS.theme) || "light");
renderSavedPlans();
loadCurrentPlan();
