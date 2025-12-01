To-Do List App

This is a web-based To-Do List application that I developed as part of my project. The app allows users to create, read, update, and delete tasks. It also shows notifications for tasks that are due or overdue, and it uses a mock backend to save all data.

How I ran the app

To make the app work, I used JSON Server as a simple backend. Here’s how I ran it:

1.  First, I installed JSON Server globally on my computer using the command:

npm install -g json-server


2.  Then, I started the backend server by running:

json-server --watch db.json --port 3000

This allowed me to have a mock API running at http://localhost:3001/todos to store my tasks.


3.    For the frontend, I opened index.html in my browser using Live Server in VSCode. The app is then accessible at 

http://127.0.0.1:5500/index.html.


4.    Once both the backend and frontend were running, I was able to add, edit, delete, and mark tasks as complete. All tasks are automatically saved in db.json.

Technologies I used

-HTML – to create the structure of the app
-CSS – to style the app and make it visually appealing
-JavaScript – to implement the app’s logic and connect with the backend API
-JSON Server – to simulate a backend and store tasks

Key features I implemented

-CRUD functionality – Users can create, read, update, and delete tasks.
-Overdue and Due Notifications – The app shows a small popup when a task is due or overdue.
-Toast Notifications – Temporary pop-up messages appear for actions like adding, updating, or deleting tasks.
-Responsive Design – The app works on both desktop and mobile devices.

Optional Enhancements I considered
-Search/Filter – Users could filter tasks by completed or pending status.
-Sort by Due Date – Tasks could be sorted in order of their deadlines.
-Dark Mode – A dark theme could be added for night-friendly usage.

How the project is structured
/project-root
│
├─ index.html        # The main HTML file for the frontend
├─ style.css         # All the styling for the app
├─ script.js         # JavaScript file handling the app logic and API calls
├─ db.json           # JSON Server database file storing all tasks
└─ README.md         # This file explaining the project

Notes

-It’s important to make sure that JSON Server is running before opening the frontend, otherwise the app won’t be able to save or fetch tasks.
-All tasks are stored locally in db.json, which makes it easy to reset or back up the data.
-The optional features (search/filter, sorting, dark mode) can be added to improve usability and appearance further.