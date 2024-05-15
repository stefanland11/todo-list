import { Todo } from "./todo";
import { Project } from "./project";

let projectArray = [];
let currentProjectIndex = 0;

export function init() {
    const defaultProject = new Project("Todo List", "Click the new project button to get started!");
    //replenish();
    //Project.save(projectArray);
    if(Project.getArray() != null) {
        projectArray = Project.getArray();
        console.log(projectArray);
        displayProject(projectArray[currentProjectIndex]);
        displayTodos(projectArray[currentProjectIndex], currentProjectIndex);
        displayProjectsList();
        initListeners();
    }

    else {
        displayProject(defaultProject);
        displayTodos(defaultProject);
        displayProjectsList();
    }
}

function displayProjectsList() {
    const projectsList = document.querySelector('.projects-list');
    projectsList.innerHTML = '';
    
    projectArray.forEach((project, index) => {
        const projectButton = document.createElement('button');
        projectButton.textContent = project.name;
        projectsList.appendChild(projectButton);

        projectButton.addEventListener('click', () => {
            currentProjectIndex = index;
            displayProject(project);
            displayTodos(project, index);
        })
    });
}

function displayProject(proj) {
    const mainDiv = document.querySelector('.main');
    mainDiv.innerHTML = '';
    
    const todoButton = document.createElement('button');
    const projectButton = document.createElement('button');
    projectButton.classList.add('new-project');
    todoButton.classList.add('new-todo');
    projectButton.textContent = "New Project";
    todoButton.textContent = "New Todo";
    const projectDiv = document.createElement('div');
    projectDiv.classList.add('project-div');
    const title = document.createElement('h2');
    const description = document.createElement('p');

    title.textContent = proj.name;
    description.textContent = proj.description;

    projectDiv.appendChild(projectButton);
    projectDiv.appendChild(todoButton);
    projectDiv.appendChild(title);
    projectDiv.appendChild(description);
    mainDiv.appendChild(projectDiv);

    const todoDialog = document.getElementById("new-todo-dialog");
    const projectDialog = document.getElementById("new-project-dialog");

    todoButton.addEventListener("click", () => {
        todoDialog.showModal();
      });

    projectButton.addEventListener("click", () => {
        projectDialog.showModal();
    });

    
}

function deleteProject() {
    console.log(currentProjectIndex);
    projectArray.splice(currentProjectIndex, 1);
    Project.save(projectArray);
    currentProjectIndex = 0;

    displayProject(projectArray[currentProjectIndex]);
    displayTodos(projectArray[currentProjectIndex], currentProjectIndex);
    displayProjectsList();
}

function displayTodos(proj, projectIndex) {
    
    const mainDiv = document.querySelector('.main');
    const todosDiv = document.createElement('div');
    mainDiv.appendChild(todosDiv);
    todosDiv.classList.add('todos-div');
    proj.todos.forEach((element, index) => {
        displaySingleTodo(element, index, projectIndex);
    })
}

function displaySingleTodo(element, index, projectIndex) {
    const todosDiv = document.querySelector('.todos-div');
    const div = document.createElement('div');
    const todoTitle = document.createElement('p');
    const completedButton = document.createElement('button');
    const deleteButton = document.createElement('button');
    const todoNotes = document.createElement('p');
    const dueDate = document.createElement('p');

    div.appendChild(todoTitle);
    div.appendChild(dueDate);
    div.appendChild(completedButton);
    div.appendChild(deleteButton);

    todosDiv.appendChild(div);

    todoTitle.textContent = element.title;
    todoNotes.textContent = element.notes;
    dueDate.textContent = element.dueDate;
    completedButton.textContent = 'C';
    deleteButton.textContent = 'E';

    div.addEventListener('click', () => {
        console.log(element.isVisible);
        if(element.isVisible == false) {
            todoTitle.appendChild(todoNotes);
            element.isVisible = true;
        }
        else {
            todoTitle.removeChild(todoNotes);
            element.isVisible = false;
        }
        
    })

    if(element.isCompleted){
        todoTitle.classList.add('cross-out');
    }

    completedButton.classList.add('complete');
    completedButton.addEventListener('click', () => {
        if(!element.isCompleted) {
            element.isCompleted = true;
            todoTitle.classList.add('cross-out'); 
            console.log("yippy");
        }

        else {
            element.isCompleted = false;
            todoTitle.classList.remove('cross-out');
        }

        Project.save(projectArray);
        console.log("saved");
        
    })

    deleteButton.classList.add('delete');
    deleteButton.addEventListener('click', () => {
        projectArray[projectIndex].deleteTodo(index);
        document.querySelector('.todos-div').remove();
        displayTodos(projectArray[projectIndex], currentProjectIndex);   
        Project.save(projectArray);
    })
}

function displayToday() {
    document.querySelector('.todos-div').remove();
    document.querySelector('.project-div').remove();
    
    const mainDiv = document.querySelector('.main');
    const projectDiv = document.createElement('div');
    projectDiv.classList.add('project-div');
    
    const title = document.createElement('h2');
    const description = document.createElement('p');
    title.textContent = "Today's Tasks";
    
    projectDiv.appendChild(title);
    projectDiv.appendChild(description);
    mainDiv.appendChild(projectDiv);
    
    const todosDiv = document.createElement('div');
    mainDiv.appendChild(todosDiv);
    todosDiv.classList.add('todos-div');

    projectArray.forEach((project, projectIndex) => {
        project.todos.forEach((todo, todoIndex) => {
            const difference = calcDate(new Date(), parseDate(todo.dueDate));
            if(difference == 0) {
                displaySingleTodo(todo, todoIndex, projectIndex);
            }
        })
    })
}

function displayUpcoming() {
    document.querySelector('.todos-div').remove();
    document.querySelector('.project-div').remove();
    
    const mainDiv = document.querySelector('.main');
    const projectDiv = document.createElement('div');
    projectDiv.classList.add('project-div');
    
    const title = document.createElement('h2');
    const description = document.createElement('p');
    title.textContent = "Upcoming Tasks";
    
    projectDiv.appendChild(title);
    projectDiv.appendChild(description);
    mainDiv.appendChild(projectDiv);
    
    const todosDiv = document.createElement('div');
    mainDiv.appendChild(todosDiv);
    todosDiv.classList.add('todos-div');

    projectArray.forEach((project, projectIndex) => {
        project.todos.forEach((todo, todoIndex) => {
            const difference = calcDate(new Date(), parseDate(todo.dueDate));
            if(difference > 0) {
                displaySingleTodo(todo, todoIndex, projectIndex);
            }
        })
    })
}

function displayOld() {
    document.querySelector('.todos-div').remove();
    document.querySelector('.project-div').remove();
    
    const mainDiv = document.querySelector('.main');
    const projectDiv = document.createElement('div');
    projectDiv.classList.add('project-div');
    
    const title = document.createElement('h2');
    const description = document.createElement('p');
    title.textContent = "Completed Tasks";
    
    projectDiv.appendChild(title);
    projectDiv.appendChild(description);
    mainDiv.appendChild(projectDiv);
    
    const todosDiv = document.createElement('div');
    mainDiv.appendChild(todosDiv);
    todosDiv.classList.add('todos-div');

    projectArray.forEach((project, projectIndex) => {
        project.todos.forEach((todo, todoIndex) => {
            const difference = calcDate(new Date(), parseDate(todo.dueDate));
            if(difference < 0) {
                displaySingleTodo(todo, todoIndex, projectIndex);
            }
        })
    })
}

function initListeners() {
    const todoDialog = document.getElementById("new-todo-dialog");
    const projectDialog = document.getElementById("new-project-dialog");
    
    const projectForm = document.getElementById("project-form");
    const todoForm = document.getElementById("todo-form");
    const todoSubmit = document.querySelector('.todo-submit');
    const projectSubmit = document.querySelector('.project-submit');

    todoSubmit.addEventListener('click',  (event) => {
        event.preventDefault();
        submitTodo();
        todoForm.reset();
        todoDialog.close();
    })

    projectSubmit.addEventListener('click', (event) => {
        event.preventDefault();
        submitProject();
        projectForm.reset();
        projectDialog.close();
    })

    const deleteProjectButton = document.querySelector('.delete-project-button');

    deleteProjectButton.addEventListener('click', () =>{
        deleteProject();
    })

    const todayButton = document.querySelector('.todays-tasks');
    const upcomingButton = document.querySelector('.upcoming-tasks');
    const oldButton = document.querySelector('.completed-tasks');

    todayButton.addEventListener('click', () => {
        displayToday();
    })

    upcomingButton.addEventListener('click', () => {
        displayUpcoming();
    })

    oldButton.addEventListener('click', () => {
        displayOld();
    })
}

function submitProject() {
    const title = document.getElementById('project-title').value;
    const description = document.getElementById('description').value;
    
    const newProject = new Project(title, description);
    projectArray.push(newProject);
    Project.save(projectArray);
    
    currentProjectIndex = projectArray.length - 1;

    displayProject(projectArray[currentProjectIndex]);
    displayTodos(projectArray[currentProjectIndex], currentProjectIndex);
    displayProjectsList();
}

function submitTodo() {
    const title = document.getElementById('todo-title').value;
    const notes = document.getElementById('notes').value;
    const date = document.getElementById('date').value;
    const priority = document.getElementById('priority').value;

    const newTodo = new Todo(title, notes, date, priority);
    projectArray[currentProjectIndex].addTodo(newTodo);
    Project.save(projectArray);

    displayProject(projectArray[currentProjectIndex]);
    displayTodos(projectArray[currentProjectIndex], currentProjectIndex); 
}

function calcDate (dateOne, dateTwo){
    const one = new Date(dateOne.getFullYear(), dateOne.getMonth(), dateOne.getDate());
    const two = new Date(dateTwo.getFullYear(), dateTwo.getMonth(), dateTwo.getDate());

    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const millisBetween = two.getTime() - one.getTime();
    const days = millisBetween / millisecondsPerDay;
   
    return Math.floor(days);
}

function parseDate(s) {
    var b = s.split(/\D/);
    return new Date(b[0], --b[1], b[2]);
}

function replenish() {
    const title = "Take out the trash";
    const notes = "The trash is taken out each tuesday";
    const dueDate = "Tuesday";
    const priority = "high";

    const t = new Todo(title, notes, dueDate, priority);

    const n = new Todo("1", "3", dueDate, priority);

    const p = new Project("Chores", "These chores need to be completed each week");

    const r1 = new Project("r1", "r1");
    const r2 = new Project("r2", "r2");
    const r3 = new Project("r3", "r3");

    p.addTodo(t);
    p.addTodo(t);
    p.addTodo(t);
    p.addTodo(t);
    p.addTodo(n);
    p.addTodo(t);

    r1.addTodo(t);
    r1.addTodo(t);
    r1.addTodo(t);
    r1.addTodo(t);
    r1.addTodo(n);
    r1.addTodo(t);

    projectArray.push(p);
    projectArray.push(r1);
    projectArray.push(r2);
    projectArray.push(r3);
}