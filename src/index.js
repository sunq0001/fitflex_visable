import Icon from './assets/icon.png';
import './assets/style.css';
import $ from 'fitflex';
import watchInDepth from 'watch-in-depth';

if (process.env.NODE_ENV != 'production') {
  console.log('looks like we are in development mode');
}


if (module.hot) {
  module.hot.accept();
}

let myIcon = new Image();
myIcon.src = Icon;
let nav = document.querySelector('nav');
nav.appendChild(myIcon);



let opts0 = {
  children: "#box",
  location: "horizontal",
  gapRatio: {
    top: 0.2,
    left: 0.05
  },
  flexWhenResize: true
};

let opts1 = {
  children: [".children1", ".children2", ".children3"]
};

$("body").flex(opts0);
$("#box").flex(opts1);

let option = {
  children: "",
  location: "",
  center: "",
  adjust: "",
  gapRatio: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    outerAll: 0,
    innerWidth: 0,
    innerHeight: 0
  },
  screenWidth: { min: 0, max: Infinity }
};
let watchable = watchInDepth();
option = watchable.createProxy(option);
let watchableArray = [];
watchableArray.push(watchable);
let optionArray = [];
optionArray.push(option);
let aside = document.querySelector(".sidebar");
let addPanel = aside.querySelector("button");
controlPanelSetup(".controlPanel.p0", optionArray[0]);
let box = $("#box").init(optionArray);
watchableArray[0].on("updated", e => {
  if (e.detail.property == "children") {
    box = $("#box").init(optionArray);
  }
  box.flex(optionArray);
});

addPanel.addEventListener("click", () => {
  let optLastIndex = optionArray.length - 1;
  let newPanel = document
    .querySelector(`.controlPanel.p${optLastIndex}`)
    .cloneNode(true);
  let newOption = {
    location: "",
    center: "",
    adjust: "",
    gapRatio: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      outerAll: 0,
      innerWidth: 0,
      innerHeight: 0
    },
    screenWidth: { min: 0, max: Infinity }
  };
  let newWatchable = watchInDepth(); 
  newOption = newWatchable.createProxy(newOption);
  watchableArray.push(newWatchable);
  newPanel.classList.remove(`p${optLastIndex}`);
  optionArray.push(newOption);
  optLastIndex = optionArray.length - 1;
  newPanel.classList.add(`p${optLastIndex}`);
  aside.appendChild(newPanel);
  controlPanelSetup(
    `.controlPanel.p${optLastIndex}`,
    optionArray[optLastIndex]
  );
  let box = $("#box").init(optionArray);
  watchableArray[optLastIndex].on("updated", () => {
    if (e.detail.property == "children") {
      box = $("#box").init(optionArray);
    }
    box.flex(optionArray);
  });
});

let tag = document.querySelector(".tag");
draggable(tag);

function draggable(tag) {
  tag.style.zIndex = 999;
  if (screen.width > 1024) {
    let offset = { x: 0, y: 0 };
    tag.addEventListener("dragstart", e => {
      offset.x = e.offsetX;
      offset.y = e.offsetY;
    });

    tag.addEventListener("drag", e => {
      let tarCss = e.target.style;
      if (e.pageX == 0 && e.pageY == 0) return false;
      tarCss.left = e.pageX - offset.x + "px";
      tarCss.top = e.pageY - offset.y + "px";
    });

    document.addEventListener("dragover", e => {
      e.stopPropagation();
      e.preventDefault();
    });

    document.addEventListener("dragenter", e => {
      e.stopPropagation();
      e.preventDefault();
    });

    document.addEventListener("drop", e => {
      e.stopPropagation();
      e.preventDefault();
    });
  } else {
    let oW, oH;
    // 绑定touchstart事件
    tag.addEventListener(
      "touchstart",
      function (e) {
        e.target.style.zIndex = 999;
        let touches = e.touches[0];
        oW = touches.clientX - tag.offsetLeft;
        oH = touches.clientY - tag.offsetTop;
        //阻止页面的滑动默认事件
        document.addEventListener(
          "touchmove",
          () => {
            e.preventDefault();
          },
          false
        );
      },
      false
    );
    tag.addEventListener(
      "touchmove",
      e => {
        let touches = e.touches[0];
        let oLeft = touches.clientX - oW;
        let oTop = touches.clientY - oH;
        if (oLeft < 0) {
          oLeft = 0;
        } else if (
          oLeft >
          document.documentElement.clientWidth - tag.offsetWidth
        ) {
          oLeft = document.documentElement.clientWidth - tag.offsetWidth;
        }
        tag.style.left = oLeft + "px";
        tag.style.top = oTop + "px";
      },
      false
    );

    tag.addEventListener(
      "touchend",
      () => {
        document.removeEventListener(
          "touchmove",
          () => {
            e.preventDefault();
          },
          false
        );
      },
      false
    );
  }
}

window.addEventListener("resize", () => {
  if (screen.width <= 768) {
    aside.style = "width:50%";
  } else if (screen.width > 768 && screen.width <= 1024) {
    aside.style = "width:30%";
  } else {
    aside.style = "width:25%";
  }
});

tag.addEventListener("click", () => {
  if (screen.width <= 768) {
    expendOrShrinkBlk(aside, "0px", "50%");
  } else if (screen.width > 768 && screen.width <= 1024) {
    expendOrShrinkBlk(aside, "0px", "30%");
  } else {
    expendOrShrinkBlk(aside, "0px", "25%");
  }

  function expendOrShrinkBlk(dom, minWidth, maxWidth) {
    if (getComputedStyle(dom).width != minWidth) {
      dom.style = "width:" + minWidth;
    } else dom.style = "width:" + maxWidth;
  }
});

aside.addEventListener("transitionend", () => {
  let rightPos =
    parseInt(getComputedStyle(tag).width) +
    parseInt(getComputedStyle(aside).width);
  tag.style = "right:" + rightPos + "px";
});

function controlPanelSetup(selStr, option) {
  let controlPanel = document.querySelector(selStr);
  let sel = controlPanel.querySelector.bind(controlPanel);
  let sela = controlPanel.querySelectorAll.bind(controlPanel);
  let control = sel(".control");
  control.addEventListener("click", e => {
    if (e.target.tagName == "H3") {
      let controlItem = e.target.parentNode;
      let itemsUnderControlItems = controlItem.children;
      [].forEach.call(itemsUnderControlItems, (el, index) => {
        if (index != 0) el.hidden = !el.hidden;
      });
    }
  });

  let selectObj = [{ prop: "location" }, { prop: "center" }];
  for (let v of selectObj) {
    let DOM = sel(`.${v.prop} select`);
    DOM.addEventListener("input", () => {
      option[v.prop] = DOM.value;
    });
  }

  sela(".switch").forEach(s => {
    s.addEventListener("click", () => {
      let arrInput = s.parentNode.querySelector(".arr");
      let arrInputDisplay = window.getComputedStyle(arrInput).display;
      let oneNumInput = s.parentNode.querySelector(".oneNum");
      let oneNumInputDisplay = window.getComputedStyle(oneNumInput).display;
      if (arrInputDisplay != "none") {
        arrInput.style = "display:none";
        oneNumInput.style = "display:inline";
      } else {
        arrInput.style = "display:inline";
        oneNumInput.style = "display:none";
      }
    });
  });

  let gapRatio = sela(".gapRatio li");
  gapRatio.forEach((el, index, domArr) => {
    if (index != domArr.length - 1) {
      let range = el.querySelector("input[type=range]");
      let number = el.querySelector("input[type=number]");
      let fitCheck = el.querySelector("input[type=checkbox]");
      let numArrItem;
      let arr = el.querySelector(".arr");
      if (arr)
        numArrItem = arr.querySelector("input[type=number]") || undefined;
      range.addEventListener("input", () => {
        number.value = Number(range.value) * 0.01;
        option.gapRatio[el.id] = Number(range.value) * 0.01;
      });

      number.addEventListener("input", () => {
        range.value = Number(number.value) * 100;
        option.gapRatio[el.id] = Number(number.value);
      });

      if (numArrItem) {
        numArrItem.addEventListener("input", () => {
          let itemInputAll = numArrItem.parentNode.querySelectorAll(
            "input[type=number]"
          );
          let liOpt = numArrItem.parentNode.parentNode;
          let inputValue = [].map.call(itemInputAll, v => v.value);
          option.gapRatio[liOpt.id] = inputValue;
        });
      }

      if (fitCheck) {
        fitCheck.addEventListener("change", () => {
          if (fitCheck.checked) {
            option.gapRatio[el.id] = fitCheck.value;
            number.disabled = range.disabled = true;
          } else {
            option.gapRatio[el.id] = number.value;
            number.disabled = range.disabled = false;
          }
        });
      }
    } else {
      let clearBtn = el.querySelector("button");
      clearBtn.addEventListener("click", () => {
        for (let prop in option.gapRatio) {
          option.gapRatio[prop] = 0;
        }
        domArr.forEach(el => {
          let minus = el.querySelector(".minus");
          if (minus) minus.remove();
          el
            .querySelectorAll("input[type=number], input[type=range]")
            .forEach(item => {
              item.value = 0;
            });
          let arr = el.querySelector(".arr");
          let inputNumAll;
          if (arr) inputNumAll = arr.querySelectorAll("input[type=number]");
          if (inputNumAll)
            inputNumAll.forEach((item, index) => {
              if (index != 0) {
                item.previousElementSibling.remove();
                item.remove();
              }
            });
          let fitCheck = el.querySelector("input[type=checkbox]");
          if (fitCheck) fitCheck.checked = false;
        });
      });
    }
  });

  sela(".arr").forEach(el => {
    addArrayOperation(el, "item", inputValueAll => {
      let optID = el.parentNode.id;
      option.gapRatio[optID] = inputValueAll;
    });
  });

  let selector = sel(".selector");
  let selectArray = sel("[name=selectArray]");
  let selectWH = sel("[name=selectWH]");
  let childrenInput = sel(".children");
  let childrenWHInput = sel(".childrenWithWH");
  let children2D = childrenInput.querySelector(".children2D");
  let children2DWH = childrenWHInput.querySelector(".children2D");
  addArrayOperation(childrenInput, "children2D");
  addArrayOperation(children2D, "item");
  addArrayOperation(childrenWHInput, "children2D");
  addArrayOperation(children2DWH, "wh");

  onClickAddArrayOpertionForAppendedChild(childrenInput, "children", "item");
  onClickAddArrayOpertionForAppendedChild(
    childrenWHInput,
    "childrenWithWH",
    "wh"
  );

  let selectBtn = selector.querySelector("button:nth-of-type(1)");
  selectBtn.addEventListener("click", e => {
    let arr = [];
    if (selectWH.value !== "wh") {
      let children2D = selector.querySelectorAll(".children > .children2D");
      for (let i = 0, arrLen = children2D.length; i < arrLen; i++) {
        let inputs = children2D[i].querySelectorAll("input");
        let arr2D = [];
        for (let j = 0, arr2DLen = inputs.length; j < arr2DLen; j++) {
          if (inputs[j].value == "") {
            alert("输入不能为空！");
            break;
          }
          arr2D.push(inputs[j].value);
        }
        arr.push(arr2D);
      }
    } else {
      let children2D = selector.querySelectorAll(
        ".childrenWithWH >.children2D"
      );
      for (let i = 0, arrLen = children2D.length; i < arrLen; i++) {
        let WHs = children2D[i].querySelectorAll(".wh");
        let arr2D = [];
        for (let j = 0, arr2DLen = WHs.length; j < arr2DLen; j++) {
          let obj = {};
          let objInputs = WHs[j].querySelectorAll("input");
          for (let k = 0, objLen = objInputs.length; k < objLen; k++) {
            let preSpanText = objInputs[k].previousElementSibling.innerHTML;
            let objPro = preSpanText.substring(0, 1);
            let objProValue = objInputs[k].value;
            if (objInputs[k].type == "number") objProValue = +objProValue;
            if (objProValue == "" || objProValue == 0) {
              alert("输入不能为空！");
              break;
            }
            obj[objPro] = objProValue;
          }
          arr2D.push(obj);
        }
        arr.push(arr2D);
      }
    }
    if (arr.length == 1 && !arr[0] instanceof Array) arr = arr[0];
    option.children = arr;

    let allInputs = selector.querySelectorAll("input, select");
    allInputs.forEach(el => {
      el.disabled = true;
    });
  });

  let resetSelectBtn = selector.querySelector("button:nth-of-type(2)");
  resetSelectBtn.addEventListener("click", () => {
    selectArray.disabled = false;
    selectWH.disabled = false;
    selectArray.value = selectArray.options[0].value;
    selectWH.value = selectWH.options[0].value;
    childrenWHInput.classList.add("noshow");
    childrenInput.classList.remove("noshow");
    let children2DAll = childrenInput.querySelectorAll(".children2D");
    let children2DWHAll = childrenWHInput.querySelectorAll(".children2D");

    let fnRemoveExceptFirst = (child, index) => {
      if (index !== 0) child.remove();
    };

    children2DAll.forEach(fnRemoveExceptFirst);
    children2DWHAll.forEach(fnRemoveExceptFirst);

    let firstChildren2DInputs = children2DAll[0].querySelectorAll("input");
    firstChildren2DInputs.forEach(fnRemoveExceptFirst);

    let firstChildren2DWHInputSets = children2DWHAll[0].querySelectorAll(".wh");
    firstChildren2DWHInputSets.forEach(fnRemoveExceptFirst);

    let allInputs = selector.querySelectorAll("input");
    allInputs.forEach(inputItem => {
      inputItem.value = inputItem.type == "text" ? "" : 0;
      inputItem.disabled = false;
    });

    let spanAllInSelector = selector.querySelectorAll("span");
    spanAllInSelector.forEach(span => {
      if (/,/.test(span.innerHTML)) span.remove();
      if (span.matches(".children > span")) {
        span.style = "display:none";
      }
    });

    option.location = option.center = option.adjust = "";
    option.gapRatio = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      outerAll: 0,
      innerWidth: 0,
      innerHeight: 0
    };
    option.children = [".children1", ".children2", ".children3"];
    let gapRatioResetBtn = sel(".gapRatio li button");
    gapRatioResetBtn.click();
    let adjustResetBtn = sel(".adjust button");
    adjustResetBtn.click();
    for (let v of selectObj) {
      let DOM = sel(`.${v.prop} select`);
      DOM.options[0].selected = true;
    }
  });

  selector.addEventListener("change", e => {
    if (e.target.tagName == "SELECT") e.target.disabled = true;
    let selectStr = selectArray.value + selectWH.value;
    let spanAll = sela(".children > span");
    let spanWHAll = sela(".childrenWithWH > span");
    let fnNoShow = item => {
      item.style = "display:none;";
    };
    let fnInlineBlk = item => {
      item.style = "display:inline-block;";
    };
    switch (selectStr) {
      case "arr1Dna":
        spanAll.forEach(fnNoShow);
        spanWHAll.forEach(fnNoShow);
        childrenInput.classList.remove("noshow");
        childrenWHInput.classList.add("noshow");
        break;
      case "arr1Dwh":
        spanAll.forEach(fnNoShow);
        spanWHAll.forEach(fnNoShow);
        childrenInput.classList.add("noshow");
        childrenWHInput.classList.remove("noshow");
        break;
      case "arr2Dna":
        spanAll.forEach(fnInlineBlk);
        spanWHAll.forEach(fnInlineBlk);
        childrenInput.classList.remove("noshow");
        childrenWHInput.classList.add("noshow");
        break;
      case "arr2Dwh":
        spanAll.forEach(fnInlineBlk);
        spanWHAll.forEach(fnInlineBlk);
        childrenInput.classList.add("noshow");
        childrenWHInput.classList.remove("noshow");
        break;
    }
  });

  function onClickAddArrayOpertionForAppendedChild(
    component,
    compClass,
    appendedClass
  ) {
    component.addEventListener("click", e => {
      if (
        e.target.className == "add" &&
        e.target.parentNode.className == compClass
      ) {
        let children2DAll = component.querySelectorAll(".children2D");
        let lastChildIndex = children2DAll.length - 1;
        let lastChild = children2DAll[lastChildIndex];
        if (lastChildIndex > 0) {
          addArrayOperation(lastChild, appendedClass);
        }
      }
    });
  }

  function addArrayOperation(component, itemClass, assignInputValueCallback) {
    if (assignInputValueCallback) {
      component.addEventListener("input", e => {
        if (e.target.tagName == "INPUT") {
          let inputItemAll = childMatchedFrom(
            component,
            "." + itemClass,
            "children"
          );
          let inputValueAll = [].map.call(
            inputItemAll,
            v => (v.type == "number" ? +v.value : v.value)
          );
          assignInputValueCallback(inputValueAll);
        }
      });
    }
    let minus = childMatchedFrom(component, ".minus");
    if (minus) onClickToRemoveItemAndSelf(minus);
    let addItem = childMatchedFrom(component, ".add");
    addItem.addEventListener("click", () => {
      let arrayItem = childMatchedFrom(component, "." + itemClass);
      let itemCopy = arrayItem.cloneNode(true);
      itemCopy.value = itemCopy.type == "number" ? 0 : "";
      let coma = document.createElement("span");
      let comaText = document.createTextNode(" ,");
      coma.appendChild(comaText);
      component.insertBefore(coma, addItem);
      component.insertBefore(itemCopy, addItem);
      let itemArray = childMatchedFrom(component, "." + itemClass, "children");
      let minus = childMatchedFrom(component, ".minus");
      if (itemArray.length > 1 && !minus) {
        let minusCopy = addItem.cloneNode(true);
        minusCopy.innerHTML = " - ";
        minusCopy.className = "minus";
        component.insertBefore(minusCopy, component.lastElementChild);
        onClickToRemoveItemAndSelf(minusCopy);
      }
    });

    function childMatchedFrom(parent, selector, childrenFlag) {
      let children = parent.children;
      let arrayFn = { filter: [].filter, find: [].find };
      let fnNameStr = "find";
      if (childrenFlag == "children") fnNameStr = "filter";
      return arrayFn[fnNameStr].call(children, thatChild => {
        return thatChild.matches(selector);
      });
    }

    function onClickToRemoveItemAndSelf(minus) {
      minus.addEventListener("click", () => {
        let arrayItemAll = childMatchedFrom(
          component,
          "." + itemClass,
          "children"
        );
        let lastItemIndex = arrayItemAll.length - 1;
        let arrayItemLength = arrayItemAll.length;
        if (arrayItemLength > 1) {
          arrayItemAll[lastItemIndex].previousElementSibling.remove();
          arrayItemAll[lastItemIndex].remove();
          if (arrayItemLength == 2) minus.remove();
        }
      });
    }
  }

  let adjust = sel(".adjust");
  adjust.querySelectorAll("select").forEach((el, index, doArr) => {
    el.addEventListener("change", () => {
      option.adjust = [].reduce.call(
        adjust.querySelectorAll("select"),
        (pre, cur) => (pre.value ? pre.value + cur.value : pre + cur.value)
      );
    });
  });

  adjust.querySelector("#unset").addEventListener("click", () => {
    option.adjust = "";
    adjust.querySelectorAll("select").forEach(el => {
      el.options[0].selected = true;
    });
  });

  let screenWidth = sel(".screenWidth");
  screenWidth.querySelectorAll("input[type=number]").forEach(el => {
    el.addEventListener("change", () => {
      option.screenWidth[el.name] = Number(el.value);
    });
  });

  let resizeCheck = screenWidth.querySelector("input[type=checkbox]");
  resizeCheck.addEventListener("click", () => {
    option.flexWhenResize = resizeCheck.checked;
  });

  let header = sel(".header");
  header.addEventListener("click", e => {
    if (e.target.matches(".header>span:first-child")) {
      let arrowClass = e.target.classList;
      arrowClass.toggle("dropup");
      arrowClass.toggle("dropdown");
      let options = control.querySelectorAll(".option");
      options.forEach((el, index) => {
        if (index != 0) {
          if (arrowClass.contains("dropdown")) {
            el.style = "display:none";
          } else {
            el.style = "display:block";
          }
        }
      });
    }
  });
}

