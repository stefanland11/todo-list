export class Project {
    constructor(name, description) {
        this.name = name;
        this.description = description;
        this.todos = [];
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    deleteTodo(index) {
        this.todos.splice(index, 1);
    }

    static save(array) {
        localStorage.setItem("array", JSON.stringify(array));
    }
    
    static getArray() {
        const savedArray = JSON.parse(localStorage.getItem("array"));
        const newArray = [];

        if(savedArray != null){
            savedArray.forEach((project, index) => {
                newArray.push(Object.assign(new Project(), project));
            });
            return newArray;
        }
        else {
            return null;
        }

        

        
    }

    get allTodos() {
        return this.todos;
    }
}


