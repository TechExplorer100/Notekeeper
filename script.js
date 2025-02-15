let notes = JSON.parse(localStorage.getItem('notes')) || [];

function saveNote() {
    const title = document.getElementById("note-title").value;
    const description = document.getElementById("note-description").value;

    if (title && description) {
        const note = {
            title: title,
            description: description,
            locked: false,
            password: "",
        };
        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes));  // Save to localStorage
        displayNotes();
        document.getElementById("note-title").value = "";
        document.getElementById("note-description").value = "";
    }
}

function displayNotes() {
    const notesContainer = document.getElementById("notes-container");
    notesContainer.innerHTML = "";

    notes.forEach((note, index) => {
        const noteCard = document.createElement("div");
        noteCard.className = "note-card";

        // Check if the note is locked
        let noteContent = note.locked ? "<div>This note is locked. Enter the password to view.</div>" : `
            <div class="note-title">${note.title}</div>
            <div class="note-description">${note.description}</div>
        `;

        noteCard.innerHTML = `
            <div class="note-title">${note.title}</div>
            <div class="note-description">${noteContent}</div>
            <button onclick="editNote(${index})">Edit</button>
            <button onclick="deleteNote(${index})">Delete</button>
            <button onclick="toggleLock(${index})">${note.locked ? "Unlock" : "Lock"}</button>
        `;
        notesContainer.appendChild(noteCard);
    });
}

function toggleLock(index) {
    const note = notes[index];
    if (note.locked) {
        // Unlock the note after password check
        const password = prompt("Enter the password to unlock this note:");
        if (password === note.password) {
            note.locked = false;
            localStorage.setItem('notes', JSON.stringify(notes));  // Save to localStorage
            displayNotes();
        } else {
            alert("Incorrect password!");
        }
    } else {
        // Lock the note and ask for a password
        const password = prompt("Enter a password to lock this note:");
        note.password = password;
        note.locked = true;
        localStorage.setItem('notes', JSON.stringify(notes));  // Save to localStorage
        displayNotes();
    }
}

function editNote(index) {
    const note = notes[index];
    if (note.locked) {
        // If the note is locked, ask for the password
        const password = prompt("Enter the password to unlock and edit the note:");
        if (password === note.password) {
            const newTitle = prompt("Edit note title:", note.title);
            const newDescription = prompt("Edit note description:", note.description);

            if (newTitle && newDescription) {
                note.title = newTitle;
                note.description = newDescription;
                localStorage.setItem('notes', JSON.stringify(notes));  // Save to localStorage
                displayNotes();
            }
        } else {
            alert("Incorrect password!");
        }
    } else {
        // If the note is not locked, directly edit it
        const newTitle = prompt("Edit note title:", note.title);
        const newDescription = prompt("Edit note description:", note.description);

        if (newTitle && newDescription) {
            note.title = newTitle;
            note.description = newDescription;
            localStorage.setItem('notes', JSON.stringify(notes));  // Save to localStorage
            displayNotes();
        }
    }
}

function deleteNote(index) {
    const note = notes[index];
    if (note.locked) {
        // Show lock modal for password
        const lockModal = document.getElementById("lock-modal");
        lockModal.style.display = "flex";
        lockModal.setAttribute("data-index", index);
        lockModal.setAttribute("data-action", "delete");
    } else {
        notes.splice(index, 1);  // Delete note
        localStorage.setItem('notes', JSON.stringify(notes));  // Save to localStorage
        displayNotes();
    }
}

function submitPassword() {
    const lockModal = document.getElementById("lock-modal");
    const index = lockModal.getAttribute("data-index");
    const action = lockModal.getAttribute("data-action");
    const passwordInput = document.getElementById("lock-password");

    if (passwordInput.value === notes[index].password) {
        if (action === "delete") {
            notes.splice(index, 1);  // Delete note
            localStorage.setItem('notes', JSON.stringify(notes));  // Save to localStorage
            displayNotes();
        } else {
            notes[index].locked = false;  // Unlock the note
            localStorage.setItem('notes', JSON.stringify(notes));  // Save to localStorage
            displayNotes();
        }
        lockModal.style.display = "none";  // Close modal
    } else {
        alert("Incorrect password!");
    }
}

// Initial call to display the notes from localStorage when the page loads
displayNotes();