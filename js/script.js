const domDocuemnt = document;
const themeSwitcherBtn = document.getElementById("theme-switcher");
const themeImg = themeSwitcherBtn.children[0];
const docuemntBody = document.querySelector("body");
const addBtn = document.getElementById("add-btn");
const todoInput = document.getElementById("addt");
const ul = docuemntBody.querySelector(".todos");
const fliterBtns = document.querySelector(".filter");
const btnFilter = document.getElementById("clear-completed");

domDocuemnt.addEventListener("DOMContentLoaded", main);

function main() {
  // theme-switcher
  themeSwitcherBtn.addEventListener("click", () => {
    docuemntBody.classList.toggle("light");
    // themeImg.setAttribute(
    //   "src",
    //   themeImg.getAttribute("src") === "./assets/images/icon-sun.svg"
    //     ? "./assets/images/icon-moon.svg"
    //     : "./assets/images/icon-sun.svg"
    // );
    if (docuemntBody.className === "light") {
      themeImg.setAttribute("src", "./assets/images/icon-moon.svg");
      localStorage.setItem("isLight", true);
    } else {
      themeImg.setAttribute("src", "./assets/images/icon-sun.svg");
      localStorage.setItem("isLight", false);
    }
  });

  makeTodoElement(JSON.parse(localStorage.getItem("todos")));
  setTheme();

  // dragover event
  ul.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (
      e.target.classList.contains("card") &&
      !e.target.classList.contains("dragging")
    ) {
      const draggingCard = document.querySelector(".dragging");
      const cards = [...ul.querySelectorAll(".card")];
      const currentPosition = cards.indexOf(draggingCard);
      const newPosition = cards.indexOf(e.target);

      if (currentPosition > newPosition) {
        ul.insertBefore(draggingCard, e.target);
      } else {
        ul.insertBefore(draggingCard, e.target.nextSibling);
        // ul.insertBefore(e.target, draggingCard);
      }

      const todos = JSON.parse(localStorage.getItem("todos"));
      const removedItem = todos.splice(currentPosition, 1);
      todos.splice(newPosition, 0, removedItem[0]);
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  });

  // Add Todo in LocalStorage
  addBtn.addEventListener("click", () => {
    const item = todoInput.value.trim();
    if (item) {
      const todoItems = !localStorage.getItem("todos")
        ? []
        : JSON.parse(localStorage.getItem("todos"));
      const currentTodo = {
        item: item,
        isCompleted: false,
      };

      todoItems.push(currentTodo);
      localStorage.setItem("todos", JSON.stringify(todoItems));
      makeTodoElement([currentTodo]);

      todoInput.value = "";
      todoInput.focus();
    }
  });
  todoInput.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      addBtn.click();
    }
  });

  fliterBtns.addEventListener("click", (e) => {
    const id = e.target.id;
    if (id) {
      document.querySelector(".on").classList.remove("on");
      e.target.classList.add("on");
      document.querySelector(".todos").className = `todos ${id}`;
    }
  });

  btnFilter.addEventListener("click", () => {
    var deletedIndex = [];
    document.querySelectorAll(".card.checked").forEach((card) => {
      deletedIndex.push(
        [...document.querySelectorAll(".todos .card")].indexOf(card)
      );
      card.classList.add("fall");
      card.addEventListener("animationend", () => {
        card.remove();
      });
    });
    removeMulipleTodos(deletedIndex);
  });
}

function removeTodo(index) {
  const todos = JSON.parse(localStorage.getItem("todos"));
  todos.splice(index, 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function removeMulipleTodos(indexes) {
  var todos = JSON.parse(localStorage.getItem("todos"));
  todos = todos.filter((todo, index) => {
    return !indexes.includes(index);
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}

function stateTodo(index, isComplete) {
  const todos = JSON.parse(localStorage.getItem("todos"));
  todos[index].isCompleted = isComplete;
  localStorage.setItem("todos", JSON.stringify(todos));
}

function setTheme() {
  const isLight = JSON.parse(localStorage.getItem("isLight"));
  if (isLight == true) {
    themeSwitcherBtn.click();
  }
}
function makeTodoElement(todoArray) {
  if (!todoArray) {
    return null;
  }
  const itemsLeft = (object) => {
    document.getElementById("items-left").textContent = object.length;
  };
  todoArray.forEach((todoObject) => {
    // create HTML elements
    const card = document.createElement("li");
    const cbContainer = document.createElement("div");
    const cbInput = document.createElement("input");
    const checkSpan = document.createElement("span");
    const item = document.createElement("p");
    const clearBtn = document.createElement("button");
    const img = document.createElement("img");

    // add classes
    card.classList.add("card");
    cbContainer.classList.add("cb-container");
    cbInput.classList.add("cb-input");
    checkSpan.classList.add("check");
    item.classList.add("item");
    clearBtn.classList.add("clear");

    // add attributes
    card.setAttribute("draggable", "true");
    cbInput.setAttribute("type", "checkbox");
    img.setAttribute("src", "./assets/images/icon-cross.svg");
    img.setAttribute("alt", "Clear it");

    if (todoObject.isCompleted) {
      card.classList.add("checked");
      cbInput.setAttribute("checked", "checked");
    }

    // Add EventListener
    card.addEventListener("dragstart", () => {
      card.classList.add("dragging");
    });
    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
    });

    clearBtn.addEventListener("click", () => {
      const currentCard = clearBtn.parentElement;
      currentCard.classList.add("fall");
      const indexOfCurrentCard = [
        ...document.querySelectorAll(".todos .card"),
      ].indexOf(currentCard);
      removeTodo(indexOfCurrentCard);
      currentCard.addEventListener("animationend", () => {
        currentCard.remove(); // remove an element from html document
        itemsLeft(document.querySelectorAll(".todos .card:not(.checked)"));
      });
    });

    cbInput.addEventListener("click", () => {
      const currentCard = cbInput.parentElement.parentElement;
      const isChecked = cbInput.checked;
      const currentCardIndex = [
        ...document.querySelectorAll(".todos .card"),
      ].indexOf(currentCard);
      stateTodo(currentCardIndex, isChecked);

      isChecked
        ? currentCard.classList.add("checked")
        : currentCard.classList.remove("checked");

      // itemsLeft.textContent = document.querySelectorAll(
      //   ".todos .card:not(.checked)"
      // ).length;
      itemsLeft(document.querySelectorAll(".todos .card:not(.checked)"));
    });

    // add values
    item.textContent = todoObject.item;

    // Set Elements by Parent Chaild
    clearBtn.appendChild(img);
    cbContainer.appendChild(cbInput);
    cbContainer.appendChild(checkSpan);

    card.appendChild(cbContainer);
    card.appendChild(item);
    card.appendChild(clearBtn);

    document.querySelector(".todos").appendChild(card);
  });

  itemsLeft(document.querySelectorAll(".todos .card:not(.checked)"));
}
