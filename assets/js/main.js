const todos = [];
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'saved-todo';
const MOVED_EVENT = "moved-book";
const DELETED_EVENT = "deleted-book";
const STORAGE_KEY = 'TODO_APPS';
const checkBox =  document.getElementById('inputBookIsComplete');

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function findTodo(todoId) {
    for (const todoItem of todos) {
      if (todoItem.id === todoId) {
        return todoItem;
      }
    }
    return null;
  }
  
  function findTodoIndex(todoId) {
    for (const index in todos) {
      if (todos[index].id === todoId) {
        return index;
      }
    }
    return -1;
  }

  function isStorageExist() {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  }
  
  function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(todos);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

  const moveData = () => {
    if (isStorageExist()) {
      const parsed = JSON.stringify(todos);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(MOVED_EVENT));
    }
  };
  
  const deleteData = () => {
    if (isStorageExist()) {
      const parsed = JSON.stringify(todos);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(DELETED_EVENT));
    }
  };
  
  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
  
    if (data !== null) {
      for (const todo of data) {
        todos.push(todo);
      }
    }
  
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

function makeTodo(todoObject) {
    const {id, title, author, year, isCompleted} = todoObject;
  
    const textTitle = document.createElement('h2');
    textTitle.innerText = title;
    textTitle.classList.add('item-title')
  
    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Penulis : ${author}`;

    const textYear = document.createElement('p');
    textYear.innerText = `Tahun Terbit : ${year}`;
  
    const textContainer = document.createElement('div');
    textContainer.classList.add('action');
    textContainer.append(textTitle, textAuthor, textYear);
  
    const container = document.createElement('div');
    container.classList.add('book_item')
    container.append(textContainer);
    container.setAttribute('id', `todo-${id}`);

    if (isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('green');
        undoButton.innerText = 'Kembali';
        undoButton.addEventListener('click', function(){
            undoTaskFromCompleted(id);
        })

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerText = 'Hapus';
        deleteButton.addEventListener('click', function(){
            removeTaskFromCompleted(id);
        })

        textContainer.append(undoButton, deleteButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('green');
        checkButton.innerText = 'Selesai';
        checkButton.addEventListener('click', function(){
            addTaskToCompleted(id);
        })

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerText = 'Hapus';
        deleteButton.addEventListener('click', function(){
            removeTaskFromCompleted(id);
        })

        textContainer.append(checkButton, deleteButton);
    }

    return container;
}

function addTodo() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;

    const generateID = generateId();
    const bookObject = generateBookObject(generateID, bookTitle, bookAuthor, bookYear, checkBox.checked);
    todos.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addTaskToCompleted(todoId) {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;
        
    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeTaskFromCompleted(todoId) {
    const todoTarget = findTodoIndex(todoId);
  
    if (todoTarget === -1) return;
  
    todos.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    deleteData();
  }
  
function undoTaskFromCompleted(todoId) {
  
    const todoTarget = findTodo(todoId);
    if (todoTarget == null) return;
  
    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    moveData();
  }

  document.addEventListener(SAVED_EVENT, () => {
    const audioSuccess = document.createElement("audio");
    audioSuccess.setAttribute('src', 'assets/audio/success.mp3');
    audioSuccess.setAttribute('autoplay', true);

    const elementCostumSuccess = document.createElement("div");
    elementCostumSuccess.classList.add("success");
    elementCostumSuccess.innerText = "Berhasil Disimpan!";
  
    document.body.insertBefore(elementCostumSuccess, document.body.children[0]);
    setTimeout(() => {
      elementCostumSuccess.remove();
    }, 1000);
  });

  document.addEventListener(MOVED_EVENT, () => {
    const audioMoved = document.createElement("audio");
    audioMoved.setAttribute('src', 'assets/audio/move.mp3');
    audioMoved.setAttribute('autoplay', true);

    const elementCostumSuccess = document.createElement("div");
    elementCostumSuccess.classList.add("success");
    elementCostumSuccess.innerText = "Berhasil Dipindahkan!";
  
    document.body.insertBefore(elementCostumSuccess, document.body.children[0]);
    setTimeout(() => {
      elementCostumSuccess.remove();
    }, 1000);
  });
  
  document.addEventListener(DELETED_EVENT, () => {
    const audioDeleted = document.createElement("audio");
    audioDeleted.setAttribute('src', 'assets/audio/delete.mp3');
    audioDeleted.setAttribute('autoplay', true);

    const elementCustomAlert = document.createElement("div");
    elementCustomAlert.classList.add("alert");
    elementCustomAlert.innerText = "Berhasil Dihapus!";
  
    document.body.insertBefore(elementCustomAlert, document.body.children[0]);
    setTimeout(() => {
      elementCustomAlert.remove();
    }, 1000);
  });

document.addEventListener(RENDER_EVENT, function() {
    const incompletedBookList = document.getElementById('incompleteBookshelfList');
    incompletedBookList.innerHTML = '';

    const completedBookList = document.getElementById('completeBookshelfList');
    completedBookList.innerHTML = '';

    for (const todoItem of todos) {
        const todoElement = makeTodo(todoItem);
        if (todoItem.isCompleted) {
            completedBookList.append(todoElement);
        } else {
            incompletedBookList.append(todoElement);
        }
    };
})

document.addEventListener('DOMContentLoaded', function(){

  const submitForm = document.getElementById('inputBook');

  submitForm.addEventListener('submit', function(event){
      event.preventDefault();
      addTodo();
  });

  if (isStorageExist()) {
      loadDataFromStorage();
    }
})

const searchForm = document.getElementById("searchBook");
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchBook();
});

const searchBook = () => {
  const searchInput = document.getElementById("searchBookTitle").value.toLowerCase();
  const bookItems = document.getElementsByClassName("book_item");

  for (let i = 0; i < bookItems.length; i++) {
    const itemTitle = bookItems[i].querySelector(".item-title");
    if (itemTitle.textContent.toLowerCase().includes(searchInput)) {
      bookItems[i].classList.remove("hidden");
    } else {
      bookItems[i].classList.add("hidden");
    }
  }
};

const textInput = document.querySelectorAll(".text-input");
textInput.forEach((element) => {
    element.addEventListener("blur", (event) => {
      if (event.target.value != "") {
        event.target.classList.add("filled");
      } else {
        event.target.classList.remove("filled");
      }
    });
  });

checkBox.addEventListener('click', function(){
    if (checkBox.checked === true) {
      document.getElementById('bookSubmit').innerHTML = 'Masukkan Buku ke rak <span>Selesai Dibaca</span>';
    } else {
      document.getElementById('bookSubmit').innerHTML = 'Masukkan Buku ke rak <span>Belum Selesai Dibaca</span>';
    }
})