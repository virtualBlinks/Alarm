const background = document.body;

function runEvent(e) {
    background.style.backgroundColor = `rgb(${e.offsetX},${e.offsetY},10)`;
}

background.addEventListener('mousemove', runEvent);


let alarms = [];

function updateClock() {
    let p3 = document.getElementById("p3");
    let p4 = document.getElementById("p4");
    let p5 = document.getElementById("p5");
    let alarmSound = document.getElementById("excellentAudio");
    let currentHour, currentMinute;

    setInterval(() => {
        let date2 = new Date();
        p3.textContent = date2.getSeconds();
        p4.textContent = date2.getMinutes();
        p5.textContent = date2.getHours();

        currentHour = date2.getHours();
        currentMinute = date2.getMinutes();

        if (alarms.some(alarm => alarm.hour === currentHour && alarm.minute === currentMinute)) {
            playAudio(alarmSound);
        }
    }, 1000);
}
function playAudio(audioElement) {
    audioElement.play();
}


function setAlarm() {
    let alarmHour = parseInt(document.getElementById("show1").value);
    let alarmMinute = parseInt(document.getElementById("show2").value);

    if (isValidTime(alarmHour, alarmMinute)) {
        let alarm = {
            hour: alarmHour,
            minute: alarmMinute
        };

        alarms.push(alarm);

        localStorage.setItem("alarms", JSON.stringify(alarms));
        renderAlarms();
    } else {
        alert("Invalid input. Hour should be between 0 and 23, and minute should be between 0 and 59.");
    }
}

function renderAlarms() {
    let schedule = document.getElementById("schedule");
    schedule.innerHTML = "";
    schedule.style.display = "flex";

    alarms.forEach((alarm, index) => {
        let alarmElement = document.createElement("div");
        alarmElement.id = "schedule1";

        let timeDisplay = document.createElement("span");
        timeDisplay.textContent = `${alarm.hour}:${alarm.minute}`;
        timeDisplay.style.fontSize = "24px";

        let buttonDiv = document.createElement("div");
        buttonDiv.style.position = "absolute";
        buttonDiv.style.bottom = "20px";

        let editButton = createButton("Edit", () => editAlarm(index));
        editButton.classList.add("editButton")
        
        let deleteButton = createButton("Delete", () => deleteAlarm(index));
        deleteButton.classList.add("deleteButton")


        buttonDiv.appendChild(editButton);
        buttonDiv.appendChild(deleteButton);

        alarmElement.appendChild(timeDisplay);
        alarmElement.appendChild(buttonDiv);

        schedule.appendChild(alarmElement);
    });
}

function createButton(text, onClick) {
    let button = document.createElement("button");
    button.textContent = text;
    button.style.height = "35px";
    button.style.width = "75px";
    button.onclick = onClick;
    return button;
}

let holdButton = document.getElementById("holdButton"); 

holdButton.addEventListener("click", function() {
    let alarmSound = document.getElementById("excellentAudio"); 
    alarmSound.pause();

    // setTimeout(function () {
    //     alarmSound.currentTime = 0; 
    //     alarmSound.parentNode.removeChild(alarmSound);
    // }, 30000);

    // clearInterval(alarmElement); 
    // let schedule = document.getElementById("schedule");
    // schedule.innerHTML = ""; 
    window.location.href = "alarm.html";
});

function editAlarm(index) {
    let editedHour = parseInt(prompt("Edit the Hour:", alarms[index].hour));
    let editedMinute = parseInt(prompt("Edit the Minute:", alarms[index].minute));

    if (isValidTime(editedHour, editedMinute)) {
        alarms[index].hour = editedHour;
        alarms[index].minute = editedMinute;

        localStorage.setItem("alarms", JSON.stringify(alarms));
        renderAlarms();
    } else {
        alert("Invalid input. Hour should be between 0 and 23, and minute should be between 0 and 59.");
    }
}

function deleteAlarm(index) {
    alarms.splice(index, 1);

    localStorage.setItem("alarms", JSON.stringify(alarms));
    renderAlarms();
}

function isValidTime(hour, minute) {
    return !isNaN(hour) && !isNaN(minute) && hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

function loadAlarmsFromLocalStorage() {
    let savedAlarms = JSON.parse(localStorage.getItem("alarms")) || [];
    alarms = savedAlarms;
    renderAlarms();
}

window.onload = function () {
    loadAlarmsFromLocalStorage();
    updateClock();
};