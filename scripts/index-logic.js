var baseURL = "https://api.coingecko.com/api/v3";

const ITEMS_PER_PAGE = 100;
const PAGES_NUMBER = 5;
const LOCAL_STORAGE_COINS = 'saved_crypto';

async function load_table_page(page_number) {
  const table_element = document.getElementById('cryptocurrencies_table');
  table_element.innerHTML = "";
  var coinDataURL = "/coins/markets?vs_currency=usd&order=market_cap_desc%2C%20volume_desc%2C%20id_desc&per_page=" + ITEMS_PER_PAGE + "&page=" + page_number + "&sparkline=false&price_change_percentage=24h";
  await fetch(baseURL + coinDataURL)
  .then(res =>{
    res.json().then(data =>{
      for(var i = 0; i < ITEMS_PER_PAGE; i++){
        let rank = ITEMS_PER_PAGE * (page_number - 1) + i + 1;
        let image = data[i].image;
        let coin = data[i].name;
        let mcap = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(data[i].market_cap);
        let price = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(data[i].current_price);
        let volume = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(data[i].total_volume);
        let supply = new Intl.NumberFormat("en-GB").format(data[i].circulating_supply.toFixed(0));
        let change;
        try {
          change = data[i].price_change_percentage_24h.toFixed(2);
        }
        catch(e) {
          change = 0;
        }

        let positive = "+";
        
        let tableRow = "<tr><td class='star__column'><button class='star__button'><img class='star__image__inactive' src='../images/empty-star.svg' alt='buttonpng' border='0' /></button></td><td class='rank__column'>" +
        rank + "</td>" + "<td><img class= 'image__column' src= " + image + "/>" + "<div class='coin__column'>" + 
        coin + "</div>" + "</td>" + "<td class='mcap__column'>" + mcap + "</td>" + "<td class = 'price__column'>"+ price + "</td>" + 
        "<td class='volume__column'>" + volume + "</td>"+ "<td class='supply__column'>" + supply + "</td>";
      
        if(change < 0){
          $("#cryptocurrencies_table").append(tableRow + "<td class='red__column'>"+ change + "%</td></tr>");
        }
        
        else {
          $("#cryptocurrencies_table").append(tableRow + "<td class='green__column'>"+ positive + change + "%</td></tr>");
        };
      }
    })
  })
  .catch(err =>{
    $("#cryptocurrencies_table").html(err);
  });
}

function set_button_listerners() {
  let buttons = document.querySelectorAll('.star__button');

  buttons.forEach(b => {
    b.addEventListener('click', () => {
      let img = b.childNodes[0];
      img.src = "../images/full-star.svg";
      if(img.classList[0] == "star__image__inactive") {
        img.classList.remove('star__image__inactive');
        img.classList.add('star__image__active');
        let coin_name = b.parentElement.parentElement.childNodes[2].childNodes[1].innerText;

        add_coin_to_storage(coin_name)
      }
      else {
        let coin_name = b.parentElement.parentElement.childNodes[2].childNodes[1].innerText;
        remove_coin_from_storage(coin_name)

        img.src = "../images/empty-star.svg";
        img.classList.remove('star__image__active');
        img.classList.add('star__image__inactive');
      }
    })
  });
}

function find_index_storage(array_object, coin_name) {
  var index = -1;
      array_object.forEach(function(item, i){
        if( item == coin_name) {
            index = i;
        }
      });

  return index;
}

function add_coin_to_storage(coin_name) {
  if(localStorage.getItem(LOCAL_STORAGE_COINS) === null) {
    let array = [coin_name];
    localStorage.setItem(LOCAL_STORAGE_COINS, JSON.stringify(array));  
  }
  else {
    let array_object = JSON.parse(localStorage.getItem(LOCAL_STORAGE_COINS));
    array_object.push(coin_name);
    localStorage.setItem(LOCAL_STORAGE_COINS, JSON.stringify(array_object));
  }
}

function remove_coin_from_storage(coin_name) {
  let array_object = JSON.parse(localStorage.getItem(LOCAL_STORAGE_COINS));

  let index = find_index_storage(array_object, coin_name);

  array_object.splice(index, 1);

  localStorage.setItem(LOCAL_STORAGE_COINS, JSON.stringify(array_object));
}

let current_page = 1;

function setup_pagination(wrapper) {
  wrapper.innerHTML = "";

  for(i = 1; i < PAGES_NUMBER + 1; i++) {
    let button = pagination_button(i);
    wrapper.appendChild(button);
  }
}

function pagination_button(page_number) {
  let button = document.createElement('button');
  button.innerText = page_number;

  if(current_page == page_number) button.classList.add('active');

  button.addEventListener('click', function () {
    current_page = page_number;
    load_table_page(current_page);
    let current_button = document.querySelector('.pagenumbers button.active');
    current_button.classList.remove('active');

    button.classList.add('active');
  })
  set_button_listerners();
  
  return button;
}

function synchronize_buttons_with_storage() {
  let buttons = document.querySelectorAll('.star__button');

  buttons.forEach(b => {
    let img = b.childNodes[0];

    let coin_name = b.parentElement.parentElement.childNodes[2].childNodes[1].innerText;
    let array_object = JSON.parse(localStorage.getItem(LOCAL_STORAGE_COINS));

    if(array_object != null) {
      let index = find_index_storage(array_object, coin_name);

      if(index != -1) {
        img.src = "../images/full-star.svg";
        img.classList.remove('star__image__inactive');
        img.classList.add('star__image__active');
      }
    }
  })
}

async function setup_wallet_button() {
  let button = document.querySelector('.button__connect__wallet');

  button.addEventListener('click', async () => {
    if(window !== undefined && window.ethereum !== undefined) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(accounts[0]);
        button.innerText = "Connected: " + accounts[0].substring(0, 6) + "..." + accounts[0].substring(38);
      }
      catch (err) {
        console.error(err.message)
      }
    }
  });

  if(window !== undefined && window.ethereum !== undefined) {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    if (accounts.length > 0) {
      button.innerText = "Connected: " + accounts[0].substring(0, 6) + "..." + accounts[0].substring(38);
    }
  }
}



const pagination_element = document.getElementById('pagination');

load_table_page(current_page)
setup_pagination(pagination_element)

setTimeout(function() {
  set_button_listerners()
  
  synchronize_buttons_with_storage()
  setup_wallet_button()
}, 500);


