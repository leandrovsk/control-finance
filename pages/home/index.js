let modalCloseBtn = document.querySelector(".close-modal-btn");
let openModalBtn = document.querySelector(".new-value-btn");
let modalWrapper = document.querySelector(".modal-wrapper");
let cancelBtn = document.querySelector(".cancel-btn");
let inputsSection = document.querySelector(".inputs-section");
let totalAmount = document.querySelector(".total-amount");
let pushValue = document.querySelector(".push-value-btn");
let inputValue = document.querySelector(".insert-value");
let entryBtn = document.querySelector(".entry-btn");
let outBtn = document.querySelector(".out-btn");
let allValues = document.querySelector(".all-values");
let entryValues = document.querySelector(".entry-values");
let outValues = document.querySelector(".out-values");
let valuesArr = [0];
let selectedOutput = "all";

let valueToBrl = (value) => {
  oldValue = (Math.round(value * 100) / 100).toFixed(2);
  arrValue = oldValue.toString().split("");
  newValue = arrValue
    .map((element) => {
      let value = element === "." ? "," : element;
      return value;
    })
    .join("");
  return newValue;
};

let valueToUsd = (value) => {
  arrValue = value.toString().split("");
  newValue = arrValue
    .map((element) => {
      let value = element === "," ? "." : element;
      return value;
    })
    .join("");
  return parseFloat(newValue);
};

let clearPath = () => {
  inputsSection.innerHTML = "";
  valuesArr = [];
};

let clearInput = () => {
  inputValue.value = "";
  entryBtn.classList.remove("selected");
  outBtn.classList.remove("selected");
};

let createArr = (arr, type) => {
  let newArr = [];
  if (type === "all") {
    newArr = arr;
  } else if (type === "inputs") {
    newArr = arr.filter((element) => {
      return element.categoryID === 1;
    });
  } else {
    newArr = arr.filter((element) => {
      return element.categoryID === 2;
    });
  }
  return newArr;
};

let renderValuesData = (arr) => {
  clearPath();
  arr.forEach((element) => {
    createLiElement(element.value, element.categoryID, element.id);
  });
  if (arr[0]) {
    totalAmount.innerText = `R$ ${valueToBrl(
      valuesArr.reduce((previousElement, currentElement) => {
        return previousElement + currentElement;
      })
    )}`;
  }
};

let createObj = (value, categoryID) => {
  let obj = {};
  if (insertedValues[0]) {
    obj = {
      id: insertedValues[insertedValues.length - 1].id + 1,
      value: value,
      categoryID: categoryID,
    };
  } else {
    obj = {
      id: 0,
      value: value,
      categoryID: categoryID,
    };
  }
  return obj;
};

let createLiElement = (value, categoryID, id) => {
  let li = document.createElement("li");
  let p = document.createElement("p");
  let span = document.createElement("span");
  let btnA = document.createElement("button");
  let btnB = document.createElement("button");
  let img = document.createElement("img");

  li.classList.add("input-item");
  p.classList.add("input-value");
  span.classList.add("type-section-wrapper");
  btnA.classList.add("entry-type-btn");
  btnB.classList.add("entry-delete-btn");
  img.classList.add("trash-icon");

  img.src = "/assets/trash.png";
  img.alt = "trash icon";
  btnA.innerText = categoryID === 1 ? "Entrada" : "Saída";
  p.innerText = "R$" + " " + valueToBrl(value);

  if (categoryID !== 1) {
    valuesArr.push(-value);
  } else {
    valuesArr.push(value);
  }

  btnB.addEventListener("click", (event) => {
    let eventLi = event.target.parentElement.parentElement;
    if (inputsSection.children.length === 1) {
      eventLi.remove();
      let indexOf = insertedValues.findIndex((element) => {
        return element.id === id;
      });
      insertedValues.splice(indexOf, 1);
      totalAmount.innerText = "R$ 00,00";
      renderNoValueBox();
    } else {
      eventLi.remove();
      let indexOf = insertedValues.findIndex((element) => {
        return element.id === id;
      });
      insertedValues.splice(indexOf, 1);
      renderValuesData(createArr(insertedValues, selectedOutput));
    }
  });

  btnB.appendChild(img);
  span.appendChild(btnA);
  span.appendChild(btnB);
  li.appendChild(p);
  li.appendChild(span);
  inputsSection.prepend(li);
};

let renderNoValueBox = () => {
  let li = document.createElement("li");
  let h2 = document.createElement("h2");
  let p = document.createElement("p");

  li.classList.add("no-value-box");
  h2.classList.add("no-value-box-title");
  p.classList.add("no-value-box-desc");

  h2.innerText = "Nenhum valor cadastrado";
  p.innerText = "Registrar novo valor";

  li.addEventListener("click", () => {
    modalWrapper.classList.toggle("hidden");
  });

  li.appendChild(h2);
  li.appendChild(p);
  inputsSection.appendChild(li);
};

let checkTab = (categoryID) => {
  let categoryName =
    categoryID === 1 ? "inputs" : categoryID === 2 ? "outputs" : -1;
  if (categoryName === selectedOutput) {
    return true;
  } else {
    return false;
  }
};

let events = () => {
  pushValue.addEventListener("click", (event) => {
    let value = event.target.offsetParent.children[2].children[2].value;
    if (value !== "") {
      let categoryID = entryBtn.classList.contains("selected")
        ? 1
        : outBtn.classList.contains("selected")
        ? 2
        : -1;
      if (categoryID === 1 || categoryID === 2) {
        let newValue = valueToUsd(value);
        let newObj = createObj(newValue, categoryID);
        insertedValues.push(newObj);
        if (checkTab(categoryID) || selectedOutput === "all") {
          renderValuesData(createArr(insertedValues, selectedOutput));
        }
        clearInput();
      } else {
        alert("selecione o tipo de entrada");
      }
    } else {
      alert("campo vazio");
    }
  });

  inputValue.addEventListener("keyup", (event) => {
    if (
      isNaN(event.key) &&
      event.key !== "," &&
      event.key !== "." &&
      event.key !== "Backspace" &&
      event.key !== "Delete" &&
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowRight" &&
      event.key !== "ArrowDown" &&
      event.key !== "ArrowUp"
    ) {
      clearInput();
    }
  });

  entryBtn.addEventListener("click", () => {
    entryBtn.classList.add("selected");
    outBtn.classList.remove("selected");
  });

  outBtn.addEventListener("click", () => {
    outBtn.classList.add("selected");
    entryBtn.classList.remove("selected");
  });

  allValues.addEventListener("click", () => {
    let arr = createArr(insertedValues, "all");
    selectedOutput = "all";
    allValues.classList.add("selected-values");
    entryValues.classList.remove("selected-values");
    outValues.classList.remove("selected-values");
    renderValuesData(arr);

    if (!arr[0]) {
      renderNoValueBox();
      totalAmount.innerText = "R$ 00,00";
    }
  });

  entryValues.addEventListener("click", () => {
    let arr = createArr(insertedValues, "inputs");
    selectedOutput = "inputs";
    allValues.classList.remove("selected-values");
    entryValues.classList.add("selected-values");
    outValues.classList.remove("selected-values");
    renderValuesData(arr);

    if (!arr[0]) {
      renderNoValueBox();
      totalAmount.innerText = "R$ 00,00";
    }
  });

  outValues.addEventListener("click", () => {
    let arr = createArr(insertedValues, "outputs");
    selectedOutput = "outputs";
    allValues.classList.remove("selected-values");
    entryValues.classList.remove("selected-values");
    outValues.classList.add("selected-values");
    renderValuesData(arr);

    if (!arr[0]) {
      renderNoValueBox();
      totalAmount.innerText = "R$ 00,00";
    }
  });
};

events();
modalToggle();
renderValuesData(insertedValues);
