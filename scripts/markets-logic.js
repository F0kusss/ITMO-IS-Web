const ITEMS_PER_PAGE = 10;
const PAGES_NUMBER = 5;

async function load_table_page_data(page_number) {
    const markets_url = 'https://api.coingecko.com/api/v3/exchanges?per_page=' + ITEMS_PER_PAGE + '&page=' + page_number;
    return await (await fetch(markets_url)).json();
}

async function build_table_page(page_number) {
    let table_body = document.getElementById('cryptocurrencies_table');
    table_body.innerHTML = "";
    let data = await load_table_page_data(page_number);
    console.log(data);

    for(let i = 0; i < ITEMS_PER_PAGE; i++) {
        let rank = data[i].trust_score_rank;
        let rank_section = document.createElement('td');
        rank_section.classList.add('exchanges__rank__column');
        rank_section.innerText = rank;

        let link = data[i].url;


        // <td>
        //    <img class="exchanges__image__column" src="data[i].image">
        //    <a class="exchanges__name__column"> Bitcoin </div>
        // </td>

        let name = data[i].name;

        if(name == "Kraken") {
            link = "https://www.kraken.com/";
        }
        let name_image_section = document.createElement('td');
        
        let image_url = data[i].image;
        let image_section = document.createElement('img');
        image_section.classList.add('exchanges__image__column');
        image_section.src = image_url;

        name_image_section.appendChild(image_section);

        let name_a = document.createElement('a');
        name_a.classList.add('exchanges__name__column');
        name_a.href = link;
        name_a.innerText = name;

        name_image_section.appendChild(name_a);

        

        let trust_score = data[i].trust_score;
        let trust_section = document.createElement('td');
        trust_section.classList.add('exchanges__trust__column');
        trust_section.innerText = trust_score;

        let trading_volume_btc = data[i].trade_volume_24h_btc;
        let volume_section = document.createElement('td');
        volume_section.classList.add('exchanges__volume__column');
        volume_section.innerText = trading_volume_btc;

        let new_row = document.createElement('tr');
        new_row.appendChild(rank_section);
        new_row.appendChild(name_image_section);
        new_row.appendChild(trust_section);
        new_row.appendChild(volume_section);
        
        table_body.appendChild(new_row);
    }
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
    build_table_page(current_page);

    let current_button = document.querySelector('.pagenumbers button.active');
    current_button.classList.remove('active');

    button.classList.add('active');
  })

  return button;
}

const pagination_element = document.getElementById('pagination');

build_table_page(current_page)
setup_pagination(pagination_element)