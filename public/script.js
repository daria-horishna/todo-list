const list = document.getElementById("list");

async function loadTasks(){

    const res = await fetch("/tasks");
    const tasks = await res.json();

    list.innerHTML = "";

    tasks.forEach(task=>{

        const li = document.createElement("li");

        if(task.completed)
            li.classList.add("completed");

        li.innerHTML = `
        <div class="left">

        <input
        type="checkbox"
        ${task.completed ? "checked" : ""}
        onclick="toggleTask(${task.id})">

        <span>${task.text}</span>

        </div>

        <button
        class="deleteBtn"
        onclick="deleteTask(${task.id})">

        🗑

        </button>
        `;

        list.appendChild(li);

    });

}

async function addTask(){

    const input=document.getElementById("taskInput");

    if(input.value==="") return;

    await fetch("/tasks",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            text:input.value
        })

    });

    input.value="";

    loadTasks();

}

async function toggleTask(id){

    await fetch(`/tasks/${id}`,{
        method:"PUT"
    });

    loadTasks();

}

async function deleteTask(id){

    await fetch(`/tasks/${id}`,{
        method:"DELETE"
    });

    loadTasks();

}

loadTasks();