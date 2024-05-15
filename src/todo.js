export class Todo {
    constructor(title, notes, dueDate, priority) {
        this.title = title;
        this.notes = notes;
        this.dueDate = dueDate;
        this.priority = priority;
        this.isCompleted = false;
        this.isVisible = false;
    }


}