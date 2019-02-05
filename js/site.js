/*Global Vars*/
let CLIENT_TOKEN = "XXXX";
let questionCount = 0;
let answerCount = 0;
let indentEntityObj = [
  {
    indent_name: "HTML5Marquee",
    entity_list: ["marquee_entity", "marquee_keyword_entity"]
  },
  {
    indent_name: "HTML5Figure",
    entity_list: ["figure_entity", "figure_keyword_entity"]
  },
  {
    indent_name: "HTML5Storage",
    entity_list: ["storage_entity", "storage_keyword_entity"]
  },
  {
    indent_name: "HTML5Doctype",
    entity_list: ["doctype_entity", "doctype_keyword_entity"]
  },
  {
    indent_name: "HTML5Metaviewport",
    entity_list: ["metaviewport_entity", "metaviewport_keyword_entity"]
  }
];

let inbuiltEntity = [
  {
    entity_list: ["bye", "thanks", "greetings"]
  }
];

let questionsList = [
  "What is a marquee tag in HTML5?",
  "What is a figure tag in HTML5?",
  "What are two types of Web Storage in HTML5?",
  "What is the  <!DOCTYPE>?",
  "HTML5 introduced a method to let web designers take control over the viewport, what was it?"
];

window.addEventListener("load", mainCall);

function mainCall() {
  chatStart();
}

function chatStart() {
  let startEle = document.getElementById("chatsection-start-conv");
  let endEle = document.getElementById("chatsection-end-conv");
  let chatHolder = document.getElementById("chatarea");
  let sendButton = document.getElementById("send-button");
  startEle.addEventListener("click", function(e) {
    chatHolder.style.display = "block";
    startEle.style.display = "none";
    endEle.style.display = "block";
    questionCount = 0;
    formChatResponse(
      "Hello! Eva here..A Interview Bot. Today I'm going to evaluate your HTML5 skill. You can type your answer below. All the very best!"
    );
    setTimeout(() => {
      formQuestion();
    }, 3000);
  });
  endEle.addEventListener("click", function(e) {
    chatHolder.style.display = "none";
    startEle.style.display = "block";
    endEle.style.display = "none";
    removeAllChild();
  });
  sendButton.addEventListener("click", sendChat);
  enterKeySend();
}

function startingChat() {
  let chatHeader = document.querySelector(".chat-header");
  let chatStart = document.querySelector(".chat-start");
  let chatSectionWrap = document.querySelector(".chat-content-wrap");
  chatHeader.style.display = "none";
  chatStart.style.display = "none";
  chatSectionWrap.style.display = "block";
}
function sendChat() {
  let sendButton = document.getElementById("send-button");
  let sendMsg = sendButton.previousElementSibling.value;
  formChatInput(sendMsg);
  sendButton.previousElementSibling.value = "";
  let inputEnterKey = document.getElementById("input-msg");
  inputEnterKey.classList.add("disabled");
}
function enterKeySend() {
  let inputEnterKey = document.getElementById("input-msg");
  inputEnterKey.addEventListener("keyup", function(e) {
    if (e.target.value != "") {
      inputEnterKey.classList.remove("disabled");
      if (e.keyCode === 13) {
        sendChat();
      }
    } else {
      inputEnterKey.classList.add("disabled");
    }
  });
}
function formChatInput(sendMsg) {
  let holder = document.getElementById("chatarea-holder");
  let wrap = document.createElement("div");
  let inputData = document.createElement("div");
  inputData.classList.add("input-msg");
  inputData.textContent = sendMsg;
  wrap.classList.add("input-msg-wrap");
  wrap.appendChild(inputData);
  holder.appendChild(wrap);
  let data = "Typing...";
  formChatResponse(data);
  getResponse(sendMsg);
}
function formChatResponse(data) {
  let holder = document.getElementById("chatarea-holder");
  let wrap = document.createElement("div");
  let resData = document.createElement("div");
  let avatar = document.createElement("span");
  avatar.classList.add("avatar");
  avatar.textContent = "Eva";
  resData.classList.add("resp-msg");
  resData.textContent = data;
  wrap.classList.add("res-msg-wrap");
  wrap.appendChild(avatar);
  wrap.appendChild(resData);
  holder.appendChild(wrap);
}
function formChatResponseSecond(data) {
  let holder = document.getElementById("chatarea-holder");
  holder.lastElementChild.children[1].textContent = data;
  holder.scrollTop = holder.scrollHeight;
}
function getResponse(sendMsg) {
  const q = encodeURIComponent(sendMsg);
  const uri = "https://api.wit.ai/message?q=" + q;
  const auth = "Bearer " + CLIENT_TOKEN;
  fetch(uri, { headers: { Authorization: auth } })
    .then(res => res.json())
    .then(res => analyzeWitRes(res));
}

function analyzeWitRes(res) {
  console.log(res.entities);
  if (Object.keys(res.entities).length === 0) {
    if (questionCount === questionsList.length) {
      formChatResponseSecond("Mmm...it looks like your answer is incorrect.");
    } else {
      formChatResponseSecond(
        "Mmm...it looks like your answer is incorrect. Try the next question"
      );
    }
    setTimeout(() => {
      formQuestion();
    }, 1000);
  } else {
    if (res.entities.intent) {
      let indentVal = res.entities.intent[0].value;
      let indentEntityComb = indentEntityObj.filter(item => {
        return item.indent_name === indentVal;
      });
      answerCount += 1;
      if (questionCount === questionsList.length) {
        formChatResponseSecond("Thank you for the answer!");
      } else {
        formChatResponseSecond(
          "Thank you for the answer! Here the next question"
        );
      }
      setTimeout(() => {
        formQuestion();
      }, 1000);
    } else {
      let entityVal;
      Object.keys(res.entities).forEach(key => {
        entityVal = inbuiltEntity[0].entity_list.filter(itemVal => {
          return itemVal === key;
        });
      });
      console.log(entityVal);
      switch (entityVal[0]) {
        case "thanks":
          formChatResponseSecond("Welcome! Have a nice day!");
          break;
        case "bye":
          formChatResponseSecond("Welcome! Have a nice day!");
          break;
        case "greetings":
          formChatResponseSecond("Welcome! Have a nice day!");
          break;
        default:
          formChatResponseSecond(
            "Mmm...it looks like your answer is incorrect. Try the next question"
          );
          setTimeout(() => {
            formQuestion();
          }, 1000);
      }
    }
  }
}

function formQuestion() {
  let holder = document.getElementById("chatarea-holder");
  if (questionCount === questionsList.length) {
    formChatResponse(
      "Your Test is Finished. You answered " +
        answerCount +
        " questions correctly. Someone from the HR team will contact you for furthur steps. Have a Nice day!"
    );
  } else if (questionCount === 0) {
    let question = "Question: " + questionsList[questionCount];
    questionCount += 1;
    formChatResponse(question);
  } else {
    let question = "Question: " + questionsList[questionCount];
    questionCount += 1;
    formChatResponse(question);
  }
  holder.scrollTop = holder.scrollHeight;
}
function removeAllChild() {
  let holder = document.getElementById("chatarea-holder");
  while (holder.firstChild) {
    holder.removeChild(holder.firstChild);
  }
  let startEle = document.getElementById("chatsection-start-conv");
  let endEle = document.getElementById("chatsection-end-conv");
  let chatHolder = document.getElementById("chatarea");
  chatHolder.style.display = "none";
  startEle.style.display = "block";
  endEle.style.display = "none";
}
