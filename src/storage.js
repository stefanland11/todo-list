export function save(array) {
    localStorage.setItem("array", JSON.stringify(array));
}

export function getArray() {
    return JSON.parse(localStorage.getItem("array"));
    
}


