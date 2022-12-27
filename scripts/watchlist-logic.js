const LOCAL_STORAGE_COINS = 'saved_crypto';
let array_object = JSON.parse(localStorage.getItem(LOCAL_STORAGE_COINS));
const search_url = 'https://api.coingecko.com/api/v3/search?query=';

const get_coin_url = 'https://api.coingecko.com/api/v3/coins/';

async function load_watchlist_data() {
    if(array_object == null || array_object.length == 0){
        let footer_block = document.querySelector('footer');
        let message_div = document.createElement('div');
        message_div.classList.add("watchlist__message");
        message_div.style.maxWidth = "300 px";
        let message = "There is nothing in your watchlist yet. Try to add some cryptocurrencies to the watchlist by clicking on a 'Star' button";
        message_div.innerHTML = "<h1 class='header__message'>" + message + "</h1>";
        footer_block.insertAdjacentElement('beforebegin', message_div);
    }
    else
    {
        let table_body = document.getElementById('watchlist_table');
        table_body.style.display = "block";
        if(array_object.length < 10) {
            table_body.style.marginBottom = (510 - array_object.length * 25) + "px";
        }
        array_object.forEach(async coin_name => {
            await fetch(search_url+coin_name).then((response) => response.json()).then(async (object) => {
                let coin_id = object.coins[0].id;
                await fetch(get_coin_url+coin_id).then((response) => response.json()).then((data) =>{
                    let rank = data.market_cap_rank;                    ;
                    let image = data.image.small;
                    let coin = data.name;
                    let mcap = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(data.market_data.market_cap.usd);
                    let price = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(data.market_data.current_price.usd);
                    let volume = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(data.market_data.total_volume.usd);
                    let supply = new Intl.NumberFormat("en-GB").format(data.market_data.circulating_supply);
                    let change;
                    try {
                    change = data.market_data.price_change_percentage_24h.toFixed(2);
                    }
                    catch(e) {
                    change = 0;
                    }

                    let positive = "+";
                    
                    let tableRow = "<tr class='table__row'><td class='star__column'><button class='star__button'>" + 
                    "<img class='star__image__inactive' src='../images/empty-star.svg' alt='buttonpng' border='0' /></button></td><td class='rank__column'>" +
                    rank + "</td>" + "<td><img class= 'image__column' src= " + image + "/>" + "<div class='coin__column'>" + 
                    coin + "</div>" + "</td>" + "<td class='mcap__column'>" + mcap + "</td>" + "<td class = 'price__column'>"+ price + "</td>" + 
                    "<td class='volume__column'>" + volume + "</td>"+ "<td class='supply__column'>" + supply + "</td>";
                
                    if(change < 0){
                    $("#cryptocurrencies_table").append(tableRow + "<td class='red__column'>"+ change + "%</td></tr>");
                    }
                    
                    else {
                    $("#cryptocurrencies_table").append(tableRow + "<td class='green__column'>"+ positive + change + "%</td></tr>");
                    };
                })
            })
        });
    }
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

async function setup_wallet_button() {
  let button = document.querySelector('.button__connect__wallet');

  button.addEventListener('click', async () => {
    if(window !== undefined && window.ethereum !== undefined) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
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

setTimeout(function() {
    load_watchlist_data();
    setup_wallet_button();
}, 500); 

setTimeout(function() {
    set_button_listerners()
    synchronize_buttons_with_storage()
}, 1000);


