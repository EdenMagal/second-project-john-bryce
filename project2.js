// Elements :
const contentDiv = document.querySelector(".content");
const coinsDiv = document.createElement("div");
const reportsDiv = document.createElement("div");
const aboutDiv = document.createElement("div");
const homeBtn = document.querySelector("#home");
const reportsBtn = document.querySelector("#reports");
const aboutBtn = document.querySelector("#about");
const coins = document.createElement("div");
const input = document.createElement("input");
const modal = document.createElement("div");
const showDiv = document.createElement("div");
const gif = document.createElement("img");

// setting attributes :
coins.setAttribute("class", "coinsDiv");
aboutDiv.setAttribute("class", "big-div");
modal.setAttribute("class", "modal");
showDiv.setAttribute("class", "show-div");

//arrays :
let coinArr = [];
let reportArr = [];
let backupReportsArr = [];
const btnArr = [homeBtn, reportsBtn, aboutBtn];

//onclicks:
homeBtn.addEventListener("click", homePage);
aboutBtn.addEventListener("click", aboutPage);
reportsBtn.addEventListener("click", reportsPage);

//calling functions :
createAbout();
createGif();

//variables:
let count = 0;

//functions:

//pages :

function loadFirstApi() {
  loadGif();

  changeBtnColor("Home");

  fetch(`https://api.coingecko.com/api/v3/coins/list`)
    .then((res) => res.json())
    .then((coin) => {
      for (let i = 0; i < 100; i++) {
        createCard(coin[i]);
        coinArr.push(coin[i]);
      }
      removeGif();
    })
    .catch(err =>{
      coinsDiv.innerHTML="API blocked, try again in a minute or two";
      removeGif();
    });

  createSearch();

  coinsDiv.appendChild(coins);
  contentDiv.appendChild(coinsDiv);
}

function createAbout() {
  const image = document.createElement("img");
  const imageDiv = document.createElement("div");
  image.src = "moka.jpg";
  image.setAttribute("class", "about-img");
  imageDiv.appendChild(image);

  const infoDiv = document.createElement("div");
  infoDiv.setAttribute("class", "space");

  const h2 = document.createElement("h2");
  const p = document.createElement("p");
  h2.innerHTML = "Eden Magal";
  p.innerHTML =
    "Hi! My name is Eden, I am 20 years old and I live in Ashdod. <br> I am not that good with words so I'll just say that this project was very challenging. <br> Also, there's a cute picture of my dog:)";

  infoDiv.appendChild(h2);
  infoDiv.appendChild(p);

  const div = document.createElement("div");
  div.setAttribute("class", "about-div");

  div.appendChild(imageDiv);
  div.appendChild(infoDiv);

  aboutDiv.appendChild(div);
}

function createReports() {
  reportsDiv.innerHTML = "";
  createChart();
}

function getData(coin) {
  let info;
  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coin}&tsyms=USD`
  )
    .then((res) => res.json())
    .then((data) => {
      let upperCoin = coin.toUpperCase();
      info = { x: new Date(), y: data[upperCoin].USD };
    });
  return info;
}

async function createChart() {
  let canvas = document.createElement("canvas");
  canvas.id = "chartContainer";
  let ctx = canvas.getContext("2d");
  const div = document.createElement("div");
  div.setAttribute("class", "canvas-div");

  div.appendChild(canvas);
  reportsDiv.appendChild(div);

  let information = [];

  for (let i = 0; i < reportArr.length; i++) {
    const info = {
      name: reportArr[i],
      yValueFormatString: "$",
      shoeInLegend: true,
      dataPoints: []
    };
    information.push(info);
  }

  setInterval(() => {
    for (let i = 0; i < reportArr.length; i++) {
      const info = getData(reportArr[i]);
      information[i].dataPoints.push(info);
    }
  }, 2000);

  let x = "Live reports:";
  if (reportArr[0] == undefined) {
    x = "Live reports! Choose coins to diaplay";
  } else {
    x = "Live reports!";
    for (let i = 0; i < reportArr.length; i++) {
      if (i == 0) {
        x += ` ${reportArr[i]}`;
      } else {
        x += `, ${reportArr[i]}`;
      }
      if (i + 2 > reportArr.length) {
        x += " - to USD";
      }
    }
  }

  let chart = new CanvasJS.Chart(ctx, {
    animationEnabled: true,
    title: {
      text: x,
    },
    axisX: {
      valueFormatString: "DD MMM,YY",
    },
    axisY: {
      title: "Price in USD",
      suffix: "$",
    },
    legend: {
      cursor: "pointer",
      fontSize: 16,
      itemclick: toggleDataSeries,
    },
    toolTip: {
      shared: true,
    },
    data: information,
  });
  chart.render();
}

function toggleDataSeries(e) {
  if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
    e.dataSeries.visible = false;
  } else {
    e.dataSeries.visible = true;
  }
  chart.render();
}

function reportsPage() {
  loadGif();
  contentDiv.innerHTML = "";
  contentDiv.appendChild(reportsDiv);
  createReports();
  changeBtnColor("Reports");
  removeGif();
}

function homePage() {
  loadGif();
  contentDiv.innerHTML = "";
  contentDiv.appendChild(coinsDiv);
  changeBtnColor("Home");
  removeGif();
}

function aboutPage() {
  loadGif();
  contentDiv.innerHTML = "";
  contentDiv.appendChild(aboutDiv);
  changeBtnColor("About");
  removeGif();
}

function changeBtnColor(btn) {
  for (let i = 0; i < btnArr.length; i++) {
    if (btnArr[i].innerHTML == btn) {
      btnArr[i].style.backgroundColor = "white";
    }
    else {
      btnArr[i].style.backgroundColor = "#FBE93B";
    }
  }
}
//gif :

function createGif() {
  gif.src = "gif.gif";
  gif.setAttribute("class", "gif");
}

function loadGif() {
  document.body.appendChild(gif);
}

function removeGif() {
  document.body.removeChild(gif);
}

//search :

function searchCoin() {
  loadGif();

  if (count > 0) {
    showCoins();
  }

  showDiv.innerHTML = "";

  const cards = document.querySelectorAll(".card");
  const coin = input.value;
  input.value = "";
  let isFound = false;
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].id != coin) {
      cards[i].style.display = "none";
    } else {
      isFound = true;
    }
  }

  if (isFound == false) {
    const p = document.createElement("p");
    p.innerHTML = "Sorry ! no information about this coin";
    p.setAttribute("class", "error");
    contentDiv.appendChild(p);
  }

  const btn = document.createElement("btn");
  btn.innerHTML = "Show All Coins";
  btn.addEventListener("click", showCoins);
  btn.setAttribute("class", "btn show");
  showDiv.appendChild(btn);
  contentDiv.appendChild(showDiv);

  count++;

  removeGif();
}

function showCoins() {
  const cards = document.querySelectorAll(".card");

  for (let i = 0; i < cards.length; i++) {
    cards[i].style.display = "flex";
  }

  if (document.querySelector(".show-div")) {
    const showDiv = document.querySelector(".show-div");
    contentDiv.removeChild(showDiv);
  }
  if (document.querySelector(".error")) {
    const p = document.querySelector(".error");
    contentDiv.removeChild(p);
  }
}

function createSearch() {
  const searchDiv = document.createElement("div");
  const btn = document.createElement("button");

  input.placeholder = "search coins";

  btn.setAttribute("class", "glyphicon glyphicon-search");
  btn.addEventListener("click", searchCoin);

  searchDiv.setAttribute("class", "search");

  searchDiv.appendChild(input);
  searchDiv.appendChild(btn);
  coinsDiv.appendChild(searchDiv);
}

// cards and buttons:

function createCard(coin) {
  const card = document.createElement("div");
  const h4 = document.createElement("h4");
  const p = document.createElement("p");
  const btn = document.createElement("button");

  h4.innerHTML = coin.symbol;
  p.innerHTML = coin.id;
  btn.innerHTML = "More Info";

  h4.setAttribute("class", "card-title");
  p.setAttribute("class", "card-text");
  btn.setAttribute("class", "btn btn-primary");

  btn.addEventListener("click", moreInfo);

  btn.id = coin.id;
  btn["data-toggle"] = "collapse";
  btn[" data-target"] = "#demo";

  card.appendChild(h4);
  card.appendChild(p);
  card.appendChild(btn);
  card.setAttribute("class", "card");
  card.id = coin.symbol;

  const containor = document.createElement("div");
  const toggle = document.createElement("div");
  const circle = document.createElement("div");
  containor.setAttribute("class", "containor");
  toggle.setAttribute("class", "toggle");
  circle.setAttribute("class", "circle");
  toggle.addEventListener("click", toggleBtn);

  toggle.appendChild(circle);
  containor.appendChild(toggle);
  card.appendChild(containor);
  coins.appendChild(card);
}

function toggleBtn(e) {
  let toggle;
  if (e.target.classList.contains("toggle")) {
    toggle = e.target;
  } else {
    toggle = e.target.parentElement;
  }

  toggle.classList.toggle("active");
  const isOn = toggle.classList.contains("active");
  const coin = toggle.parentElement.parentElement.id;

  if (isOn) {
    if (reportArr.length < 5) {
      reportArr.push(coin);
    } else {
      deleteModal(coin);
      toggle.classList.toggle("active");
    }
  } else {
    let index = reportArr.findIndex((c) => c == coin);
    reportArr.splice(index, 1);
  }
}

function moreInfo(e) {

  const infoDiv = document.createElement("div");
  infoDiv.setAttribute("class", "info-div");


  const card = e.target.parentElement;

  let date = new Date().getTime();

  if (e.target.innerHTML == "More Info") {

    if (
      localStorage.getItem(e.target.id) &&
      date - JSON.parse(localStorage.getItem(e.target.id)).date < 120000
    ) {

      let object = JSON.parse(localStorage.getItem(e.target.id));
      createInfo(object, infoDiv, card);
      console.log("hello from local storage");


    } else {

      loadGif();

      localStorage.removeItem(e.target.id);
      fetch(`https://api.coingecko.com/api/v3/coins/${e.target.id}`)
        .then((res) => res.json())
        .then((info) => {
          let object = {
            usd: info.market_data.current_price.usd,
            ils: info.market_data.current_price.ils,
            eur: info.market_data.current_price.eur,
            image: info.image.small,
            date: new Date().getTime(),
          };

          localStorage.setItem(e.target.id, JSON.stringify(object));
          setTimeout(() => localStorage.removeItem(e.target.id), 120000)
          createInfo(object, infoDiv, card);
          removeGif();
        })
        .catch(err => {
          const p = document.createElement("p");
          p.innerHTML = "No available information";
          infoDiv.appendChild(p);
          card.appendChild(infoDiv);
        });


    }
    infoDiv.style.display = "flex";
    e.target.innerHTML = "Hide Info";
  }
  else {
    const div = e.target.nextElementSibling.nextElementSibling;
    card.removeChild(div);
    e.target.innerHTML = "More Info";
    infoDiv.style.display = "none";

  }
}

function createInfo(info, infoDiv, card) {

  const img = document.createElement("img");
  img.src = info.image;

  const usd = document.createElement("p");
  const ils = document.createElement("p");
  const eur = document.createElement("p");

  usd.innerHTML =
    "worth in Dollars :" + info.usd + "$";
  ils.innerHTML =
    "worth in Shekels :" + info.ils + "₪";
  eur.innerHTML =
    "worth in Euros :" + info.eur + "€";

  const prices = document.createElement("div");
  const image = document.createElement("div");

  prices.appendChild(usd);
  prices.appendChild(ils);
  prices.appendChild(eur);

  image.appendChild(img);

  infoDiv.appendChild(prices);
  infoDiv.appendChild(image);

  card.appendChild(infoDiv);


}

//modal :

function deleteModal(coin) {
  modal.innerHTML = "";

  backupReportsArr = reportArr.map((c) => c);

  const h3 = document.createElement("h3");
  h3.innerHTML =
    "You can only choose up to 5 coins! <br> Please choose coins to remove:";
  h3.setAttribute("class", "h3-in-modal");
  modal.appendChild(h3);

  for (let i = 0; i < reportArr.length; i++) {
    const div = document.createElement("div");
    div.setAttribute("class", "coins-in-modal");

    const p = document.createElement("p");
    p.innerHTML = reportArr[i];

    const span = document.createElement("span");
    span.setAttribute("class", "glyphicon glyphicon-remove");

    const btn = document.createElement("button");
    btn.setAttribute("class", "delete-buttons");
    btn.appendChild(span);
    span.addEventListener("click", deleteFromModal);

    div.appendChild(p);
    div.appendChild(btn);

    modal.appendChild(div);
  }

  const p = document.createElement("p");
  p.innerHTML = `*The coin you wanted to add : ${coin}*`;

  const pDiv = document.createElement("div");
  pDiv.setAttribute("class", "p-div");

  pDiv.appendChild(p);
  modal.appendChild(pDiv);



  const buttonsDiv = document.createElement("div");
  buttonsDiv.setAttribute("class", "buttons-div");

  const cancelBtn = document.createElement("button");
  cancelBtn.setAttribute("class", "btn bcg");
  cancelBtn.innerHTML = "Cancel";
  cancelBtn.addEventListener("click", cancelAction);
  buttonsDiv.appendChild(cancelBtn);

  const deleteAllBtn = document.createElement("button");
  deleteAllBtn.setAttribute("class", "btn bcg");
  deleteAllBtn.innerHTML = "delete all";
  deleteAllBtn.addEventListener("click", () => deleteAll(coin));
  buttonsDiv.appendChild(deleteAllBtn);

  const saveBtn = document.createElement("button");
  saveBtn.setAttribute("class", "btn bcg");
  saveBtn.innerHTML = "Save";
  saveBtn.addEventListener("click", () => saveChanges(coin));
  buttonsDiv.appendChild(saveBtn);

  modal.appendChild(buttonsDiv);

  document.body.appendChild(modal);
}

function deleteAll(coin) {
  for (let i = 0; i < reportArr.length; i++) {
    const toggle = document
      .getElementById(reportArr[i])
      .querySelector(".toggle");
    toggle.classList.remove("active");
  }
  reportArr = [];
  saveChanges(coin);
}

function saveChanges(coin) {
  document.body.removeChild(modal);
  if (reportArr.length < 5) {
    reportArr.push(coin);
    const toggle = document.getElementById(coin).querySelector(".toggle");
    toggle.classList.add("active");
  }
}

function cancelAction() {
  reportArr = backupReportsArr;
  for (let i = 0; i < reportArr.length; i++) {
    const toggle = document
      .getElementById(reportArr[i])
      .querySelector(".toggle");
    const isOn = toggle.classList.contains("active");
    if (!isOn) {
      toggle.classList.add("active");
    }
  }
  document.body.removeChild(modal);
}

function deleteFromModal(e) {
  const div = e.target.parentElement.parentElement;
  const coin = e.target.parentElement.previousSibling.innerHTML;

  let index = reportArr.findIndex((c) => c == coin);
  reportArr.splice(index, 1);

  modal.removeChild(div);

  const toggle = document.getElementById(coin).querySelector(".toggle");
  toggle.classList.remove("active");
}
