// ---- Tutorial data ----

const BSL_LESSONS = [
	{
		id: "java-variables",
		title: "Java: Variables & Data Types",
		topic: "java",
		level: "beginner",
		time: "15 min",
		tags: ["variables", "basics", "syntax"],
		readHtml: `
			<p>Variables store information that your program can use. Java is strongly typed, which means you must pick a data type.</p>
			<ul>
				<li><code>int</code> – whole numbers</li>
				<li><code>double</code> – decimal numbers</li>
				<li><code>boolean</code> – true/false</li>
				<li><code>String</code> – text</li>
			</ul>
			<pre><code>int age = 18;
double price = 4.99;
boolean isStudent = true;
String name = "Brian";</code></pre>
		`,
		tryItCode: `public class Main {
	public static void main(String[] args) {
		int score = 10;
		String username = "Coder123";
		System.out.println("Player: " + username);
		System.out.println("Score: " + score);
	}
}`,
		quizHtml: `
			<ol>
				<li>Which data type stores whole numbers?<br> A) String B) double C) int D) boolean</li>
				<li>Which value is a valid boolean?<br> A) "true" B) true C) "yes" D) 0</li>
				<li>What does <code>String name = "Alex";</code> do?<br> A) Creates a number B) Creates a true/false value C) Stores text D) Causes an error</li>
			</ol>
		`
	},
	{
		id: "java-if",
		title: "Java: If Statements",
		topic: "java",
		level: "beginner",
		time: "15 min",
		tags: ["conditionals", "logic"],
		readHtml: `
			<p>If statements let your program make decisions based on a condition.</p>
			<pre><code>int age = 16;
if (age >= 16) {
	System.out.println("You can drive!");
} else {
	System.out.println("Not old enough.");
}</code></pre>
		`,
		tryItCode: `public class Main {
	public static void main(String[] args) {
		int temperature = 30;

		if (temperature > 60) {
			System.out.println("Nice weather!");
		} else {
			System.out.println("It's a bit cold out.");
		}
	}
}`,
		quizHtml: `
			<ol>
				<li>What keyword starts a conditional?<br> A) if B) check C) when D) else</li>
				<li>What does an <code>else</code> block do?<br> A) Runs if the <code>if</code> is false B) Always runs C) Never runs D) Runs first</li>
				<li>Which syntax is valid?<br> A) if age &gt; 10 B) if (age &gt; 10) C) if {age &gt; 10} D) if (age &gt; 10);</li>
			</ol>
		`
	},
	{
		id: "java-for-loop",
		title: "Java: For Loops",
		topic: "java",
		level: "beginner",
		time: "10 min",
		tags: ["loops", "iteration"],
		readHtml: `
			<p>Loops repeat actions. A basic for loop counts with a variable.</p>
			<pre><code>for (int i = 0; i &lt; 5; i++) {
	System.out.println(i);
}</code></pre>
		`,
		tryItCode: `public class Main {
	public static void main(String[] args) {
		for (int i = 1; i <= 3; i++) {
			System.out.println("Loop #" + i);
		}
	}
}`,
		quizHtml: `
			<ol>
				<li>A loop that counts from 0 to 4 runs how many times?<br> A) 4 B) 5 C) 0 D) 1</li>
				<li>Which part increases the counter?<br> A) i &lt; 5 B) i++ C) int i = 0 D) System.out.println(i)</li>
				<li>What does a loop do?<br> A) Repeats code B) Stores text C) Checks data types D) Stops the program</li>
			</ol>
		`
	},
	{
		id: "html-first-page",
		title: "HTML: Your First Webpage",
		topic: "web",
		level: "beginner",
		time: "10 min",
		tags: ["html", "structure"],
		readHtml: `
			<p>Every webpage needs a basic structure made of HTML tags.</p>
			<pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;title&gt;My First Page&lt;/title&gt;
	&lt;/head&gt;
	&lt;body&gt;
		&lt;h1&gt;Hello World!&lt;/h1&gt;
		&lt;p&gt;This is my first webpage.&lt;/p&gt;
	&lt;/body&gt;
&lt;/html&gt;</code></pre>
		`,
		tryItCode: `<h1>Welcome!</h1>
<p>You are learning HTML at ByteSize Learning.</p>`,
		quizHtml: `
			<ol>
				<li>Which tag creates a main heading?<br> A) &lt;p&gt; B) &lt;h1&gt; C) &lt;div&gt; D) &lt;title&gt;</li>
				<li>Where does visible content go?<br> A) &lt;head&gt; B) &lt;body&gt; C) &lt;style&gt; D) &lt;meta&gt;</li>
				<li>Which code is valid?<br> A) &lt;p&gt;Paragraph&lt;/p&gt; B) &lt;p&gt;Paragraph&lt;p&gt; C) p{Paragraph} D) &lt;p&gt;Paragraph&lt;q&gt;</li>
			</ol>
		`
	},
	{
		id: "css-text-style",
		title: "CSS: Coloring & Styling Text",
		topic: "web",
		level: "beginner",
		time: "12 min",
		tags: ["css", "colors", "styling"],
		readHtml: `
			<p>CSS changes the appearance of HTML elements.</p>
			<pre><code>h1 {
	color: #3A86FF;
	font-size: 32px;
}

p {
	color: #444;
}</code></pre>
		`,
		tryItCode: `<h1 style="color: #3A86FF;">Styled Heading</h1>
<p style="color: purple;">I'm learning CSS!</p>`,
		quizHtml: `
			<ol>
				<li>Which property controls text color?<br> A) font-color B) text-style C) color D) style</li>
				<li>Where does CSS normally go?<br> A) In &lt;style&gt; tags or a .css file B) In &lt;img&gt; C) In &lt;script&gt; D) In a password field</li>
				<li>What does <code>font-size: 32px</code> change?<br> A) Color B) Size C) Alignment D) Shape</li>
			</ol>
		`
	},
	{
		id: "js-button-click",
		title: "JavaScript: Buttons That Do Something",
		topic: "web",
		level: "beginner",
		time: "15 min",
		tags: ["javascript", "events", "interactivity"],
		readHtml: `
			<p>JavaScript can react to user actions like clicks.</p>
			<pre><code>&lt;button id="clickMe"&gt;Click Me&lt;/button&gt;
&lt;p id="message"&gt;&lt;/p&gt;</code></pre>
			<pre><code>document.getElementById("clickMe").onclick = function() {
	document.getElementById("message").textContent = "You clicked the button!";
};</code></pre>
		`,
		tryItCode: `<button onclick="alert('Hello from JavaScript!')">Press me</button>`,
		quizHtml: `
			<ol>
				<li>Which event fires when a button is pressed?<br> A) onhover B) onclick C) onload D) onpress</li>
				<li>What does JavaScript add to a webpage?<br> A) Structure B) Style C) Behavior D) Images only</li>
				<li>Which is valid JS?<br> A) print("hi") B) System.out.println("hi"); C) alert("hi"); D) &lt;alert&gt;hi&lt;/alert&gt;</li>
			</ol>
		`
	}
];

// simple access helpers
function getLessons() {
	return BSL_LESSONS;
}

function saveLastLessonId(id) {
	localStorage.setItem("bsl_last_lesson_id", id);
}

function loadLastLessonId() {
	return localStorage.getItem("bsl_last_lesson_id");
}

function saveRegistration(data) {
	localStorage.setItem("bsl_registration", JSON.stringify(data));
}

function loadRegistration() {
	const raw = localStorage.getItem("bsl_registration");
	return raw ? JSON.parse(raw) : null;
}

// ---- Events storage ----

const BSL_EVENTS_KEY = "bsl_events";

function loadEvents() {
	const raw = localStorage.getItem(BSL_EVENTS_KEY);
	if (!raw) {
		return [];
	}
	try {
		return JSON.parse(raw);
	} catch (e) {
		return [];
	}
}

function saveEvents(events) {
	localStorage.setItem(BSL_EVENTS_KEY, JSON.stringify(events));
}

