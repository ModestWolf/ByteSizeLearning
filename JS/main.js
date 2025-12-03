document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("nav a");
    navLinks.forEach(link => {
        if (window.location.pathname.includes(link.getAttribute("href").split("/").pop())) {
            link.classList.add("active");
        }
    });

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const user = document.getElementById("loginUser").value.trim();
            const pass = document.getElementById("loginPass").value.trim();
            const error = document.getElementById("loginError");
            const content = document.getElementById("portalContent");

            if (user === "admin" && pass === "password") {
                error.textContent = "";
                content.classList.remove("hidden");
            } else {
                error.textContent = "Invalid login. Try admin / password.";
            }
        });
    }

    const regForm = document.getElementById("registrationForm");
	if (regForm) {
		regForm.addEventListener("submit", (event) => {
			event.preventDefault();

			const nameInput = document.getElementById("name");
			const emailInput = document.getElementById("email");
			const levelSelect = document.getElementById("level");
			const interestSelect = document.getElementById("interest");

			const nameError = document.getElementById("nameError");
			const emailError = document.getElementById("emailError");
			const levelError = document.getElementById("levelError");
			const interestError = document.getElementById("interestError");

			// clear old errors
			nameError.textContent = "";
			emailError.textContent = "";
			levelError.textContent = "";
			interestError.textContent = "";

			let isValid = true;
			const name = nameInput.value.trim();
			const email = emailInput.value.trim();
			const level = levelSelect.value;
			const interest = interestSelect.value;

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

			if (!isValid) {
				return;
			}

			const data = {
				name,
				email,
				level,
				interest
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

	if (!loginForm || !portalContent || !eventForm || !eventsList) {
		return; // not on portal page
	}

	// simple demo login
	loginForm.addEventListener("submit", (e) => {
		e.preventDefault();
		const user = document.getElementById("loginUser").value.trim();
		const pass = document.getElementById("loginPass").value.trim();

		if (user === "admin" && pass === "password") {
			loginError.textContent = "";
			portalContent.classList.remove("hidden");
		} else {
			loginError.textContent = "Invalid credentials. Try admin / password.";
		}
	});

	function renderEvents() {
		const events = loadEvents().slice().sort((a, b) => {
			return a.datetime.localeCompare(b.datetime);
		});

		eventsList.innerHTML = "";
		if (events.length === 0) {
			eventsList.innerHTML = "<li>No events yet.</li>";
			return;
		}

		events.forEach((event) => {
			const li = document.createElement("li");
			li.innerHTML = `
				<strong>${event.title}</strong><br>
				${event.date} @ ${event.time} • Topic: ${event.topic.toUpperCase()}
			`;
			eventsList.appendChild(li);
		});
	}

	eventForm.addEventListener("submit", (e) => {
		e.preventDefault();

		const titleInput = document.getElementById("eventTitle");
		const dateInput = document.getElementById("eventDate");
		const timeInput = document.getElementById("eventTime");
		const topicSelect = document.getElementById("eventTopic");
		const eventError = document.getElementById("eventError");

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
		events.push({
			title,
			date,
			time,
			topic,
			datetime: `${date}T${time}`
		});
		saveEvents(events);

		titleInput.value = "";
		timeInput.value = "";

		renderEvents();
	});

	// initial render
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
			<p><strong>Topic:</strong> ${lesson.topic.toUpperCase()} • <strong>Level:</strong> ${lesson.level} • <strong>Time:</strong> ${lesson.time}</p>
			<h3>Read</h3>
			<div class="lesson-read">
				${lesson.readHtml}
			</div>
			<h3>Try It</h3>
			<pre><code>${lesson.tryItCode}</code></pre>
			<h3>Quick Quiz</h3>
			<div class="lesson-quiz">
				${lesson.quizHtml}
			</div>
		`;
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

};

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
