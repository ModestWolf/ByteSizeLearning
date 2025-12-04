document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("nav a");
    navLinks.forEach(link => {
        if (window.location.pathname.includes(link.getAttribute("href").split("/").pop())) {
            link.classList.add("active");
        }
    });

    const regForm = document.getElementById("registrationForm");
	if (regForm) {
		regForm.addEventListener("submit", (event) => {
			event.preventDefault();

			const nameInput = document.getElementById("name");
			const emailInput = document.getElementById("email");
			const levelSelect = document.getElementById("level");
			const interestSelect = document.getElementById("interest");
			const passwordInput = document.getElementById("password");
			const confirmPasswordInput = document.getElementById("confirmPassword");

			const nameError = document.getElementById("nameError");
			const emailError = document.getElementById("emailError");
			const levelError = document.getElementById("levelError");
			const interestError = document.getElementById("interestError");
			const passwordError = document.getElementById("passwordError");
			const confirmPasswordError = document.getElementById("confirmPasswordError");

			// clear old errors
			nameError.textContent = "";
			emailError.textContent = "";
			levelError.textContent = "";
			interestError.textContent = "";
			passwordError.textContent = "";
			confirmPasswordError.textContent = "";

			let isValid = true;
			const name = nameInput.value.trim();
			const email = emailInput.value.trim();
			const level = levelSelect.value;
			const interest = interestSelect.value;
			const password = passwordInput.value.trim();
			const confirmPassword = confirmPasswordInput.value.trim();

			if (!name) {
				nameError.textContent = "Please enter your name.";
				isValid = false;
			}

			const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailPattern.test(email)) {
				emailError.textContent = "Please enter a valid email.";
				isValid = false;
			}

			if (!level) {
				levelError.textContent = "Please choose a level.";
				isValid = false;
			}

			if (!interest) {
				interestError.textContent = "Please choose an interest.";
				isValid = false;
			}

			// password validation
			if (!password) {
				passwordError.textContent = "Please create a password.";
				isValid = false;
			} else if (password.length < 8) {
				passwordError.textContent = "Password must be at least 8 characters.";
				isValid = false;
			}

			if (!confirmPassword) {
				confirmPasswordError.textContent = "Please confirm your password.";
				isValid = false;
			} else if (password && confirmPassword !== password) {
				confirmPasswordError.textContent = "Passwords do not match.";
				isValid = false;
			}

			if (!isValid) {
				return;
			}

			const data = {
				name,
				email,
				level,
				interest,
				password // in real app, never store plain passwords
			};

			// save to localStorage
			saveRegistration(data);

			// go to confirmation page
			window.location.href = "../ConfirmationPage/confirmation.html";
		});
	}

    const confirmationMessage = document.getElementById("confirmationMessage");
	if (confirmationMessage) {
		const regData = loadRegistration();
		if (regData) {
			confirmationMessage.textContent =
				`Thanks, ${regData.name}! You registered as a ${regData.level} learner ` +
				`interested in ${regData.interest}. We'll reach out at ${regData.email}.`;
		}
	}

	initHomePage();
    initTutorialsPage();
	initPortalPage();
});

// ---- Portal page logic ----

function initPortalPage() {
	const loginForm = document.getElementById("loginForm");
	const portalContent = document.getElementById("portalContent");
	const loginError = document.getElementById("loginError");
	const eventForm = document.getElementById("eventForm");
	const eventsList = document.getElementById("eventsList");
	const logoutBtn = document.getElementById("logoutBtn");
	const welcome = document.getElementById("welcomeMessage");

	if (!loginForm || !portalContent || !eventForm || !eventsList) {
		return; // not on portal page
	}

	// Event form references
	const titleInput = document.getElementById("eventTitle");
	const dateInput = document.getElementById("eventDate");
	const timeInput = document.getElementById("eventTime");
	const topicSelect = document.getElementById("eventTopic");
	const eventError = document.getElementById("eventError");
	const submitBtn = eventForm.querySelector("button[type='submit']");

	// Track which event index is being edited
	let editingIndex = null;

	// ---- Restore login state if already logged in ----
	const savedUser = localStorage.getItem("staffUsername");
	if (localStorage.getItem("staffLoggedIn") === "true") {
		portalContent.classList.remove("hidden");
		loginForm.classList.add("hidden");

		if (logoutBtn) logoutBtn.style.display = "inline-block";
		if (welcome && savedUser) welcome.textContent = `Hello ${savedUser}!`;
	}

	// ---- Login ----
	loginForm.addEventListener("submit", (e) => {
		e.preventDefault();
		const user = document.getElementById("loginUser").value.trim();
		const pass = document.getElementById("loginPass").value.trim();

		if (user === "admin" && pass === "password") {
			loginError.textContent = "";

			localStorage.setItem("staffLoggedIn", "true");
			localStorage.setItem("staffUsername", user);

			portalContent.classList.remove("hidden");
			loginForm.classList.add("hidden");

			if (logoutBtn) logoutBtn.style.display = "inline-block";
			if (welcome) welcome.textContent = `Hello ${user}!`;

		} else {
			loginError.textContent = "Invalid credentials. Try admin / password.";
		}
	});

	// ---- Logout ----
	if (logoutBtn) {
		logoutBtn.addEventListener("click", () => {
			localStorage.removeItem("staffLoggedIn");
			localStorage.removeItem("staffUsername");

			portalContent.classList.add("hidden");
			loginForm.classList.remove("hidden");

			logoutBtn.style.display = "none";
			document.getElementById("loginUser").value = "";
			document.getElementById("loginPass").value = "";
			loginError.textContent = "";

			if (welcome) {
				welcome.innerHTML = `Use <strong>admin / password</strong> to log in.`;
			}

			// reset event editor
			editingIndex = null;
			submitBtn.textContent = "Create Event";
		});
	}

	// ---- Render Events (with Edit + Delete buttons) ----
	function renderEvents() {
		const events = loadEvents().slice().sort((a, b) => a.datetime.localeCompare(b.datetime));

		eventsList.innerHTML = "";
		if (events.length === 0) {
			eventsList.innerHTML = "<li>No events yet.</li>";
			return;
		}

		events.forEach((event, index) => {
			const li = document.createElement("li");
			li.innerHTML = `
				<strong>${event.title}</strong><br>
				${event.date} @ ${event.time} • Topic: ${event.topic.toUpperCase()}
				<br>
				<button type="button" class="btn secondary edit-event" data-index="${index}">Edit</button>
				<button type="button" class="btn delete-event" data-index="${index}">Delete</button>
			`;
			eventsList.appendChild(li);
		});
	}

	// ---- Edit Button Handler ----
	eventsList.addEventListener("click", (e) => {
		const editButton = e.target.closest(".edit-event");
		if (!editButton) return;

		const index = parseInt(editButton.dataset.index, 10);
		const events = loadEvents();
		const ev = events[index];
		if (!ev) return;

		// Fill form
		titleInput.value = ev.title;
		dateInput.value = ev.date;
		timeInput.value = ev.time;
		topicSelect.value = ev.topic;

		editingIndex = index;
		eventError.textContent = "";
		submitBtn.textContent = "Update Event";

		titleInput.focus();
	});

	// ---- Delete Button Handler ----
	eventsList.addEventListener("click", (e) => {
		const deleteButton = e.target.closest(".delete-event");
		if (!deleteButton) return;

		const index = parseInt(deleteButton.dataset.index, 10);
		const events = loadEvents();
		if (!events[index]) return;

		if (!confirm(`Delete event "${events[index].title}"?`)) return;

		events.splice(index, 1);
		saveEvents(events);

		// if editing deleted event → reset
		if (editingIndex === index) {
			editingIndex = null;
			submitBtn.textContent = "Create Event";
			titleInput.value = "";
			timeInput.value = "";
		}

		renderEvents();
	});

	// ---- Create OR Update Event ----
	eventForm.addEventListener("submit", (e) => {
		e.preventDefault();
		eventError.textContent = "";

		const title = titleInput.value.trim();
		const date = dateInput.value;
		const time = timeInput.value;
		const topic = topicSelect.value;

		if (!title || !date || !time) {
			eventError.textContent = "Please fill in title, date, and time.";
			return;
		}

		const events = loadEvents();
		const updatedEvent = {
			title,
			date,
			time,
			topic,
			datetime: `${date}T${time}`,
		};

		if (editingIndex !== null) {
			events[editingIndex] = updatedEvent;
		} else {
			events.push(updatedEvent);
		}

		saveEvents(events);

		// Reset form
		editingIndex = null;
		submitBtn.textContent = "Create Event";
		titleInput.value = "";
		timeInput.value = "";

		renderEvents();
	});

	// Initial render
	renderEvents();
}

// ---- Tutorials page logic ----

function initTutorialsPage() {
	const lessonList = document.getElementById("lessonList");
	const lessonDetail = document.getElementById("lessonDetail");

	if (!lessonList || !lessonDetail) {
		return; // not on tutorials page
	}

	const topicSelect = document.getElementById("filterTopic");
	const levelSelect = document.getElementById("filterLevel");
	const lessons = getLessons();

	function filterLessons() {
		const topic = topicSelect ? topicSelect.value : "all";
		const level = levelSelect ? levelSelect.value : "all";

		return lessons.filter((lesson) => {
			const topicMatches = topic === "all" || lesson.topic === topic;
			const levelMatches = level === "all" || lesson.level === level;
			return topicMatches && levelMatches;
		});
	}

	function renderLessonCards(list) {
		lessonList.innerHTML = "";
		if (list.length === 0) {
			lessonList.innerHTML = "<p>No lessons match that filter yet.</p>";
			return;
		}

		list.forEach((lesson) => {
			const card = document.createElement("article");
			card.className = "lesson-card";
			card.dataset.id = lesson.id;
			card.innerHTML = `
                <h3>${lesson.title}</h3>
                <p>Topic: ${lesson.topic.toUpperCase()} • Level: ${lesson.level} • ${lesson.time}</p>
                <p class="lesson-tags">${lesson.tags.join(", ")}</p>
            `;
			lessonList.appendChild(card);
		});
	}

	function setLessonDetail(lesson) {
		if (!lesson) {
			lessonDetail.innerHTML = "<h2>Select a lesson to view details</h2>";
			return;
		}

		lessonDetail.innerHTML = `
            <h2>${lesson.title}</h2>
            <p>
                <strong>Topic:</strong> ${lesson.topic.toUpperCase()} •
                <strong>Level:</strong> ${lesson.level} •
                <strong>Time:</strong> ${lesson.time}
            </p>
            <h3>Read</h3>
            <div class="lesson-read">
                ${lesson.readHtml}
            </div>
            <h3>Try It</h3>
            <pre><code>${lesson.tryItCode}</code></pre>
            <h3>Quick Quiz</h3>
            <div class="lesson-quiz" id="lessonQuiz"></div>
        `;

		renderQuizForLesson(lesson);
	}

	// simple quiz bank based on topic (same quiz reused for all lessons of that topic)
	function getQuizForLesson(lesson) {
		if (lesson.topic === "java") {
			return [
				{
					question: "What does an if statement let your program do?",
					choices: [
						"Repeat code a fixed number of times",
						"Decide whether to run some code based on a condition",
						"Store many values in one variable"
					],
					correctIndex: 1,
					explanation: "If statements run their block only when the condition is true."
				},
				{
					question: "Which of these is a valid Java variable name?",
					choices: [
						"2number",
						"user-name",
						"userName"
					],
					correctIndex: 2,
					explanation: "Variable names can't start with a number and can't contain hyphens."
				}
			];
		}

		// default to web quiz (HTML/CSS/JS)
		return [
			{
				question: "What does <p> represent in HTML?",
				choices: [
					"A paragraph of text",
					"A page break",
					"A picture container"
				],
				correctIndex: 0,
				explanation: "<p> is the paragraph element in HTML."
			},
			{
				question: "Where should most CSS for a site usually live?",
				choices: [
					"Inline on every HTML element",
					"In a separate .css file linked in the <head>",
					"In the browser console only"
				],
				correctIndex: 1,
				explanation: "Best practice is to keep styles in an external stylesheet."
			}
		];
	}

	function renderQuizForLesson(lesson) {
		const quizContainer = document.getElementById("lessonQuiz");
		if (!quizContainer) return;

		const quiz = getQuizForLesson(lesson);
		if (!quiz || quiz.length === 0) {
			quizContainer.innerHTML = "<p>No quiz for this lesson yet.</p>";
			return;
		}

		quizContainer.innerHTML = "";

		quiz.forEach((q, qi) => {
			const wrapper = document.createElement("div");
			wrapper.className = "quiz-question";

			const question = document.createElement("p");
			question.textContent = `${qi + 1}. ${q.question}`;
			wrapper.appendChild(question);

			q.choices.forEach((choiceText, ci) => {
				const label = document.createElement("label");
				label.className = "quiz-choice";

				const input = document.createElement("input");
				input.type = "radio";
				input.name = `q-${lesson.id}-${qi}`;
				input.value = ci;

				label.appendChild(input);
				label.append(` ${choiceText}`);
				wrapper.appendChild(label);
			});

			const feedback = document.createElement("div");
			feedback.className = "quiz-feedback";
			wrapper.appendChild(feedback);

			quizContainer.appendChild(wrapper);
		});

		const checkBtn = document.createElement("button");
		checkBtn.textContent = "Check Answers";
		checkBtn.className = "btn primary";

		const result = document.createElement("p");
		result.className = "quiz-result";

		checkBtn.addEventListener("click", () => {
			let score = 0;

			quiz.forEach((q, qi) => {
				const name = `q-${lesson.id}-${qi}`;
				const selected = document.querySelector(`input[name="${name}"]:checked`);
				const feedback = quizContainer.querySelectorAll(".quiz-feedback")[qi];

				if (!selected) {
					feedback.textContent = "Choose an answer.";
					feedback.style.color = "#d90429";
					return;
				}

				const chosenIndex = parseInt(selected.value, 10);

				if (chosenIndex === q.correctIndex) {
					score++;
					feedback.textContent = "Correct! " + (q.explanation || "");
					feedback.style.color = "#2b9348";
				} else {
					feedback.textContent = "Not quite. " + (q.explanation || "");
					feedback.style.color = "#d90429";
				}
			});

			result.textContent = `You got ${score} / ${quiz.length} correct.`;
		});

		quizContainer.appendChild(checkBtn);
		quizContainer.appendChild(result);
	}

	// click handling
	lessonList.addEventListener("click", (event) => {
		const card = event.target.closest(".lesson-card");
		if (!card) {
			return;
		}
		const id = card.dataset.id;
		const lesson = lessons.find((l) => l.id === id);
		setLessonDetail(lesson);
		saveLastLessonId(id);
	});

	// filter change handling
	if (topicSelect) {
		topicSelect.addEventListener("change", () => {
			renderLessonCards(filterLessons());
		});
	}
	if (levelSelect) {
		levelSelect.addEventListener("change", () => {
			renderLessonCards(filterLessons());
		});
	}

	// initial render
	renderLessonCards(filterLessons());

	// load last viewed lesson if available
	const lastId = loadLastLessonId();
	const initialLesson = lessons.find((l) => l.id === lastId) || lessons[0];
	setLessonDetail(initialLesson);
}

// ---- Home page logic ----

function initHomePage() {
	const widget = document.getElementById("recentLesson");
	if (!widget) {
		return; // not on home page
	}

	const lastId = loadLastLessonId();
	const lessons = typeof getLessons === "function" ? getLessons() : [];
	const lesson = lastId && lessons.length > 0
		? lessons.find((l) => l.id === lastId)
		: null;

	if (!lesson) {
		widget.innerHTML = `
			<h2>Recent Lesson</h2>
			<p>You haven't viewed any lessons yet.</p>
			<a href="TutorialsPage/tutorials.html" class="btn primary">Start with Tutorials</a>
		`;
		return;
	}

	widget.innerHTML = `
		<h2>Recent Lesson</h2>
		<h3>${lesson.title}</h3>
		<p>
			<strong>Topic:</strong> ${lesson.topic.toUpperCase()} •
			<strong>Level:</strong> ${lesson.level} •
			<strong>Time:</strong> ${lesson.time}
		</p>
		<p class="recent-lesson-tags">${lesson.tags.join(", ")}</p>
		<a href="TutorialsPage/tutorials.html" class="btn secondary">Continue in Tutorials</a>
	`;
}
