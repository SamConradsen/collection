const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwUo7SdjykTdMeSnEtyAxIknuYfsx8n3PSCXJUIvYeJVbRXqbAnFTCcpMfgLSYKNUShZA/exec";

let allItems = [];
let showSold = false;
let currentImageBase64 = null;
let currentEditId = null;

let formData = {
  collect: 'collect',
  brand: 'originals',
  sold: 'FALSE'
};

// Size database tracking
const sizesConfig = [
  { group: "Women's", titleImg: "1RZTZy5SkaYhentzK95PtHLfTLrry588t", items: [
    { code: "EU26", trueImg: "1XSVwjDADYiCZiHS4H78vrfrLpke4Jz-U", falseImg: "1JyRI9YKjybxP9WsQLZFpDriITxKr_weK" },
    { code: "EU2628", trueImg: "16o90DPuUgx0M9d-kE2dMd4fT241TVoJu", falseImg: "16VTslGlTyERmwnB7nvNCPnF_-NmPKics" },
    { code: "EU28", trueImg: "1EwNUNR0SdBW1BFbsSH4m98otcLVctxIx", falseImg: "15CFzgd1FZGCckxbD6mwyGq7XozdIbQ4T" },
    { code: "EU30", trueImg: "1Fre7X7orUM_he3lORr8QSwgVmf1-uU2l", falseImg: "1JKS36Y-YBeZBWYQl9yCXHj_jjGwE6DIu" },
    { code: "EU3032", trueImg: "1v9aFTb9A6CbHlpDTcPZ9QhxBV2sY3ilo", falseImg: "1vEa-Ze_BE-AN7fzXeo1UZpn59g9-yIZh" },
    { code: "EU32", trueImg: "1Y92_reAKvB6EYw1fMHnrsgSTVKTrreBh", falseImg: "1AGat9CErbnJUxBmMjhovNMu6jxDLuObk" },
    { code: "EU34", trueImg: "1oCfPD4FC89QSOnrPGnokkBusdXZzTaQx", falseImg: "12MQXuKYSc2typ5lV2bER0YQFD72ge3IV" },
    { code: "EU3436", trueImg: "1FsA-E8nfgmvlUvYgDC-f8V--3a3N04Jg", falseImg: "1z3TIRPLCDKQmLDn7AHPEvdmIuRnH7ZQm" },
    { code: "EU36", trueImg: "1-joZHg6tLlLA9jYYFXS6PxfP7KeHBFTo", falseImg: "1ZoMjpnbtblGmh31UniOzphCVOEN-Ucl_" },
    { code: "EU38", trueImg: "1G2MRIHrsCFVvHEGOlR541ye6YOs8MOlQ", falseImg: "1tY9jv9a7vNP0Gv9yup840ufsKWmmxq2X" },
    { code: "EU3840", trueImg: "1fzI9fG-nZRN-x1goIhHQyFmBCxLt-8nt", falseImg: "1Ft-sbNlOjJKgSsx4Nf9f3PyqkcbL8wZK" },
    { code: "EU40", trueImg: "1NsfHw2LdRBWYMEq1xAseeRMMPiXIMeyH", falseImg: "19VCAb2KT79Ldz6ocGZMq6r54ASXWGMK9" },
    { code: "EU42", trueImg: "1d4wCqI9Vno9wwNwrEbkibQGUgxPejm5Z", falseImg: "1TkN5oFFGDq_bYO56lnNw_BvwWxm5pdjc" },
    { code: "EU4244", trueImg: "1Vt-_beDKLLItf-mQIqIGjBUOaAZTSL6o", falseImg: "1EcElReHP3DYzfcQnXVj6n7VJufOfwaNF" },
    { code: "EU44", trueImg: "1SPpECUO78hFYv6P0V6xryLgMXx-KkWwn", falseImg: "1WTUrVCgOm3NfWiRdUBXcNlmDFzRn6R0k" },
    { code: "EU46", trueImg: "1NyKPsEfo9q_t9k0WgEvLkU7LxKbASFks", falseImg: "1dfAiO_QutWbCDB-kgFQiAkyUNE5E5aLc" },
    { code: "EU4648", trueImg: "1oq82XfHZevnKU0EBbImNaGwKTMJPwsJR", falseImg: "1J7uSFTMr7M8k0BTld8yuRVJFjqUl-xaB" },
    { code: "EU48", trueImg: "15Qs7Tk4BEcOERurOSonCWE9e6h5yTF_B", falseImg: "1wEFnYzeZaryR2sQZanF-zB5oNb5W8Jqi" }
  ]},
  { group: "Men's", titleImg: "13FXO2y9MwhBRRLfav_57fHmnawi236F2", items: [
    { code: "XS", trueImg: "1fo2xSQdYAxc5wur2j42kqfaBNnAAowoa", falseImg: "1Llb31YJSRgnlbJjQKh1_qv9Ei93hRxzF" },
    { code: "S", trueImg: "12zAn5AmgyG6waKAgqioHMfB28QjAlwwY", falseImg: "14q7cIEJIa2gQums81lgrMyRm08aXiu1Z" },
    { code: "M", trueImg: "1x0udUH6RqecdbHD_WJvDlqHSjldmlBVB", falseImg: "15l9nD1AdqM-h9d9RIMTA9m1VNrRuhImc" },
    { code: "L", trueImg: "1xGlMfaxmVWQiS-3XHJc8EypOFV7m5bl4", falseImg: "1u4Ll51Phy5tKvoBpK1YXd0W7m4UbcFV2" },
    { code: "XL", trueImg: "1yvfJqilhdUw0NgOvwKXkn8piHKNVFIoH", falseImg: "1LlqkDB-YcBkk7g74OjXVHfm7qmutg5gs" },
    { code: "2XL", trueImg: "1rswUnEgd7jMZPbsTMp_aVaHmx9N2AXlU", falseImg: "1PcZwwRdqnoz1FvDxtVf7aQJKCtvu62rK" }
  ]},
  { group: "Shoes", titleImg: "1o-bFV6fUuz4-UOz3LHuNCmLDEQRTQpCK", items: [
    { code: "Shoe40", trueImg: "107zMXiUS71NF-yFx8-0bmicjcrH0Vjpr", falseImg: "1z3t0nNPRWhfb2NZ2yyZ5yVlj1KtLeGL3" },
    { code: "Shoe40⅔", trueImg: "1dDymb3WDFjwKQswqx9JTm2a3G8eMQb87", falseImg: "1EVan3IADTMUMpcjynJZeEwY_KKkdHJCX" }
  ]},
  { group: "Other", titleImg: "1YA3WaLcSWL50BHllfjRcI6Bu-qj-kP50", items: [
    { code: "Onesize", trueImg: "1_vg2cPTQQvQNyUKNgWGY_5159mFXK7MS", falseImg: "1yn6-0jQ61iKVjPC7YThePp16oQE4uKgc" }
  ]}
];

let activeSizes = {};

// Initialiser størrelsesfiltre
sizesConfig.forEach(g => {
  g.items.forEach(i => activeSizes[i.code] = true);
});

document.addEventListener('DOMContentLoaded', () => {
  buildSizeDropdown();
  fetchData();
});

function toggleShowSold() {
  showSold = !showSold;
  document.getElementById('toggleSold').src = showSold 
    ? "https://lh3.googleusercontent.com/d/19wTkumBvqWSzhakI3TRw6ACWI0jl2YCG" 
    : "https://lh3.googleusercontent.com/d/1B65f2Et5kHbFkxHI8Q6cN3Uva6Ls0EKZ";
  renderItems();
}

function toggleSizeMenu() {
  const el = document.getElementById('sizeDropdown');
  el.style.display = el.style.display === 'block' ? 'none' : 'block';
}

function buildSizeDropdown() {
  const container = document.getElementById('sizeDropdown');
  container.innerHTML = '';
  sizesConfig.forEach(g => {
    let groupDiv = document.createElement('div');
    groupDiv.className = 'size-group';
    groupDiv.innerHTML = `<img src="https://lh3.googleusercontent.com/d/${g.titleImg}" class="size-group-title">`;
    
    let grid = document.createElement('div');
    grid.className = 'size-grid';
    
    g.items.forEach(item => {
      let img = document.createElement('img');
      img.id = `size-btn-${item.code}`;
      img.src = activeSizes[item.code] ? `https://lh3.googleusercontent.com/d/${item.trueImg}` : `https://lh3.googleusercontent.com/d/${item.falseImg}`;
      img.onclick = () => {
        activeSizes[item.code] = !activeSizes[item.code];
        img.src = activeSizes[item.code] ? `https://lh3.googleusercontent.com/d/${item.trueImg}` : `https://lh3.googleusercontent.com/d/${item.falseImg}`;
        renderItems();
      };
      grid.appendChild(img);
    });
    groupDiv.appendChild(grid);
    container.appendChild(groupDiv);
  });
}

function fetchData() {
  fetch(APPS_SCRIPT_URL)
    .then(res => res.json())
    .then(data => {
      allItems = data;
      renderItems();
    });
}

function renderItems() {
  const content = document.getElementById('contentArea');
  const nav = document.getElementById('alphabetNav');
  const query = document.getElementById('searchInput').value.toLowerCase();
  content.innerHTML = '';
  nav.innerHTML = '';

  // Filtrering
  let filtered = allItems.filter(item => {
    if (item.collect !== PAGE_MODE) return false;
    if (!showSold && String(item.sold).toUpperCase() === 'TRUE') return false;
    if (item.size && activeSizes[item.size] === false) return false;

    if (query) {
      const match = [item.name, item.articlenumber, item.material, item.brand, item.size, item.produced, item.madein]
        .some(val => String(val || '').toLowerCase().includes(query));
      if (!match) return false;
    }
    return true;
  });

  // Gruppering pr. kategori
  let categories = {};
  filtered.forEach(item => {
    let cat = item.category || 'Uncategorized';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(item);
  });

  // Sorter kategorier alfabetisk
  let sortedCats = Object.keys(categories).sort((a,b) => a.localeCompare(b));

  sortedCats.forEach(cat => {
    // Sorter varer alfabetisk efter navn
    categories[cat].sort((a,b) => String(a.name).localeCompare(String(b.name)));

    let section = document.createElement('div');
    section.id = `cat-${cat}`;
    section.innerHTML = `<div class="category-title">${cat}</div>`;

    let grid = document.createElement('div');
    grid.className = 'item-grid';

    categories[cat].forEach(item => {
      grid.appendChild(createCard(item));
    });

    section.appendChild(grid);
    content.appendChild(section);

    // Alfabet-navpunkt
    let firstLetter = cat.charAt(0).toUpperCase();
    let navLink = document.createElement('a');
    navLink.href = `#cat-${cat}`;
    navLink.textContent = firstLetter;
    navLink.title = cat;
    nav.appendChild(navLink);
  });
}

function getSizeImage(sizeCode) {
  for (let g of sizesConfig) {
    for (let i of g.items) {
      if (i.code === sizeCode) return `https://lh3.googleusercontent.com/d/${i.trueImg}`;
    }
  }
  return '';
}

function createCard(item) {
  let card = document.createElement('div');
  card.className = 'item-card';

  let isSold = String(item.sold).toUpperCase() === 'TRUE';
  let imgUrl = item.imageid ? `https://lh3.googleusercontent.com/d/${item.imageid}` : '';
  let sizeImg = getSizeImage(item.size);

  let brandDisplay = item.brand === 'originals' ? 'adidas Originals' : 'adidas Performance';

  card.innerHTML = `
    <div class="image-wrapper" style="background-image: url('${imgUrl}')">
      ${isSold ? '<div class="sold-overlay"></div>' : ''}
      ${sizeImg ? `<img src="${sizeImg}" class="size-badge" onclick="editItem(${item.id})">` : ''}
      <div class="article-badge">
        <img src="https://lh3.googleusercontent.com/d/1k2UAsx1wDDB_nzxmmHjxAotoMZ5BQft1">
        <span>${item.articlenumber || ''}</span>
      </div>
    </div>
    <div class="info-box">
      <div class="info-header">
        <span>${brandDisplay}</span>
        <span style="font-size:8px;">${item.id}</span>
      </div>
      <div class="info-name">${item.name || ''}</div>
      <div class="info-row">
        <span>Made in <span class="val">${item.madein || ''}</span></span>
        <img src="https://lh3.googleusercontent.com/d/1ij4Ek7JOZ956BKEObfNPiQUkQRFSTVBY">
        <span class="val">${item.produced || ''}</span>
      </div>
      <div class="info-row" style="justify-content:space-between; margin-top:3px;">
        <div style="display:flex; align-items:center; gap:2px;">
          <img src="https://lh3.googleusercontent.com/d/1pXAS0b2IK1Z81StPX8XjWdkUli2hlz_L">
          <span>${item.purchaseprice || ''}</span>
        </div>
        ${isSold ? `
        <div style="display:flex; align-items:center; gap:2px;">
          <img src="https://lh3.googleusercontent.com/d/1Yu_Lil2oFqOlkPmjOwcmu7iL4nCMcVxI">
          <span>${item.saleprice || ''}</span>
        </div>` : ''}
      </div>
    </div>
  `;
  return card;
}

/* Modal and Upload Logic */
function openModal(defaultType) {
  currentEditId = null;
  currentImageBase64 = null;
  document.getElementById('uploadPreview').style.backgroundImage = "url('https://lh3.googleusercontent.com/d/13xCOJ9lT2wrrP9HTxleFydN8xl6bVHSY')";
  
  setPageType(defaultType);
  setBrand('originals');
  setSoldState('FALSE');

  document.getElementById('mArticle').value = '';
  document.getElementById('mName').value = '';
  document.getElementById('mCategory').value = '';
  document.getElementById('mSize').value = '';
  document.getElementById('mProduced').value = '';
  document.getElementById('mMadeIn').value = '';
  document.getElementById('mMaterial').value = '';
  document.getElementById('mPurchasePrice').value = '';
  document.getElementById('mSalePrice').value = '';

  document.getElementById('modalBg').style.display = 'flex';
}

function closeModal() {
  document.getElementById('modalBg').style.display = 'none';
}

function setPageType(type) {
  formData.collect = type;
  document.getElementById('imgCollectToggle').src = type === 'collect'
    ? "https://lh3.googleusercontent.com/d/1n40M_iQ7ulYvbfu49YoPuXXahMCaaGUE"
    : "https://lh3.googleusercontent.com/d/1WmUNf_xGs7ZDNoIzHXm49LYU_F_UUzfU";

  document.getElementById('imgWishToggle').src = type === 'wish'
    ? "https://lh3.googleusercontent.com/d/1n3x54E_jDboyz9nbfT7UF66wAb6hD8Gp"
    : "https://lh3.googleusercontent.com/d/1ILimPAIFeulkojIIubsdHzPULzGOlJTC";
}

function setBrand(brand) {
  formData.brand = brand;
  document.getElementById('imgOrigToggle').src = brand === 'originals'
    ? "https://lh3.googleusercontent.com/d/1GdaFyUnTOS1UykuvnYKA_1z4XfZx1_iz"
    : "https://lh3.googleusercontent.com/d/15nt6irvSZBMvGCnqPAKw2aDV2y2JhC4g";

  document.getElementById('imgPerfToggle').src = brand === 'performance'
    ? "https://lh3.googleusercontent.com/d/1avSQJ-y8dcCG7mtJoFMURPV0W9l6ISBy"
    : "https://lh3.googleusercontent.com/d/1V27hvCkX3F7s4cV9eMOmsmINzV1QteZb";
}

function toggleSoldState() {
  let newState = formData.sold === 'TRUE' ? 'FALSE' : 'TRUE';
  setSoldState(newState);
}

function setSoldState(state) {
  formData.sold = state;
  let btn = document.getElementById('btnSold');
  let saleInput = document.getElementById('mSalePrice');

  if (state === 'TRUE') {
    btn.src = "https://lh3.googleusercontent.com/d/1WaOyEouVJt2AUBSi6jCOR2TU4Ux0GEuG";
    saleInput.disabled = false;
  } else {
    btn.src = "https://lh3.googleusercontent.com/d/1eMSGvB7LXY8SBhAkOKNJUMc9btJzE1yP";
    saleInput.disabled = true;
    saleInput.value = '';
  }
}

function handleImage(input) {
  if (input.files && input.files[0]) {
    let reader = new FileReader();
    reader.onload = function(e) {
      currentImageBase64 = e.target.result;
      document.getElementById('uploadPreview').style.backgroundImage = `url('${e.target.result}')`;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function editItem(id) {
  let item = allItems.find(i => i.id == id);
  if (!item) return;

  currentEditId = item.id;
  setPageType(item.collect || 'collect');
  setBrand(item.brand || 'originals');
  setSoldState(String(item.sold).toUpperCase());

  if (item.imageid) {
    document.getElementById('uploadPreview').style.backgroundImage = `url('https://lh3.googleusercontent.com/d/${item.imageid}')`;
  }

  document.getElementById('mArticle').value = item.articlenumber || '';
  document.getElementById('mName').value = item.name || '';
  document.getElementById('mCategory').value = item.category || '';
  document.getElementById('mSize').value = item.size || '';
  document.getElementById('mProduced').value = item.produced || '';
  document.getElementById('mMadeIn').value = item.madein || '';
  document.getElementById('mMaterial').value = item.material || '';
  document.getElementById('mPurchasePrice').value = item.purchaseprice || '';
  document.getElementById('mSalePrice').value = item.saleprice || '';

  document.getElementById('modalBg').style.display = 'flex';
}

function saveData() {
  let payload = {
    id: currentEditId,
    collect: formData.collect,
    brand: formData.brand,
    sold: formData.sold,
    articlenumber: document.getElementById('mArticle').value,
    name: document.getElementById('mName').value,
    category: document.getElementById('mCategory').value,
    size: document.getElementById('mSize').value,
    produced: document.getElementById('mProduced').value,
    madein: document.getElementById('mMadeIn').value,
    material: document.getElementById('mMaterial').value,
    purchaseprice: document.getElementById('mPurchasePrice').value,
    saleprice: document.getElementById('mSalePrice').value,
    imageBase64: currentImageBase64
  };

  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(res => {
    closeModal();
    fetchData(); // Genindlæs data efter gem
  });
}