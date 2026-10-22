const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwUo7SdjykTdMeSnEtyAxIknuYfsx8n3PSCXJUIvYeJVbRXqbAnFTCcpMfgLSYKNUShZA/exec";

let allItems = [];
let showSold = false;
let searchQuery = "";
let currentImageBase64 = null;
let currentEditId = null;
let isSaving = false;

const IMAGES = {
  headerCollect: "1BbO-EU_AmhU8XtYRuYGCFx_ZVZzK3iCA",
  headerWish: "14m-Rprm0BtqaVohizhDgPj0pSlfeIfGy",
  uploadPlaceholder: "17YobDkGOVX0dUIyLRVu_alxkMO2AnmxT",
  
  origTrue: "1phuiZ7Mh7kYKfAENbCw2ah78_Tem2NAM",
  origFalse: "152SiPw7Y39y_jeMaTdTZLXFkgR_Zu4cn",
  perfTrue: "1ycABFjAvKvRXOgnKJ77_fO2Y0zpAh6fG",
  perfFalse: "1wEklPrdEZ3GHbNw2ejwfYwx1nBnRxhny",

  soldFalse: "1K9HrpK2swbPdadOZPbrPVT3-V7k7bwCK",
  soldTrue: "1vETS8eyAKpPjy89FdnPhRyh70Jw9whoK",

  moveWish: "1fJBy15xDCzGyYaRVC7kuffylkNr8L-6m",
  moveCollect: "1vMlgzgIov6ukflJWXYIFuC-IkbaLNztl",

  showSoldOff: "1B65f2Et5kHbFkxHI8Q6cN3Uva6Ls0EKZ",
  showSoldOn: "19wTkumBvqWSzhakI3TRw6ACWI0jl2YCG",
  
  iconPurchasePrice: "1pXAS0b2IK1Z81StPX8XjWdkUli2hlz_L",
  iconSalePrice: "1Yu_Lil2oFqOlkPmjOwcmu7iL4nCMcVxI",
  iconProduced: "1ij4Ek7JOZ956BKEObfNPiQUkQRFSTVBY"
};

const SIZE_DATA = [
  {
    title: "1RZTZy5SkaYhentzK95PtHLfTLrry588t",
    sizes: [
      { key: "EU26", trueId: "1XSVwjDADYiCZiHS4H78vrfrLpke4Jz-U", falseId: "1JyRI9YKjybxP9WsQLZFpDriITxKr_weK" },
      { key: "EU2628", trueId: "16o90DPuUgx0M9d-kE2dMd4fT241TVoJu", falseId: "16VTslGlTyERmwnB7nvNCPnF_-NmPKics" },
      { key: "EU28", trueId: "1EwNUNR0SdBW1BFbsSH4m98otcLVctxIx", falseId: "15CFzgd1FZGCckxbD6mwyGq7XozdIbQ4T" },
      { key: "EU30", trueId: "1Fre7X7orUM_he3lORr8QSwgVmf1-uU2l", falseId: "1JKS36Y-YBeZBWYQl9yCXHj_jjGwE6DIu" },
      { key: "EU3032", trueId: "1v9aFTb9A6CbHlpDTcPZ9QhxBV2sY3ilo", falseId: "1vEa-Ze_BE-AN7fzXeo1UZpn59g9-yIZh" },
      { key: "EU32", trueId: "1Y92_reAKvB6EYw1fMHnrsgSTVKTrreBh", falseId: "1AGat9CErbnJUxBmMjhovNMu6jxDLuObk" },
      { key: "EU34", trueId: "1oCfPD4FC89QSOnrPGnokkBusdXZzTaQx", falseId: "12MQXuKYSc2typ5lV2bER0YQFD72ge3IV" },
      { key: "EU3436", trueId: "1FsA-E8nfgmvlUvYgDC-f8V--3a3N04Jg", falseId: "1z3TIRPLCDKQmLDn7AHPEvdmIuRnH7ZQm" },
      { key: "EU36", trueId: "1-joZHg6tLlLA9jYYFXS6PxfP7KeHBFTo", falseId: "1ZoMjpnbtblGmh31UniOzphCVOEN-Ucl_" },
      { key: "EU38", trueId: "1G2MRIHrsCFVvHEGOlR541ye6YOs8MOlQ", falseId: "1tY9jv9a7vNP0Gv9yup840ufsKWmmxq2X" },
      { key: "EU3840", trueId: "1fzI9fG-nZRN-x1goIhHQyFmBCxLt-8nt", falseId: "1Ft-sbNlOjJKgSsx4Nf9f3PyqkcbL8wZK" },
      { key: "EU40", trueId: "1NsfHw2LdRBWYMEq1xAseeRMMPiXIMeyH", falseId: "19VCAb2KT79Ldz6ocGZMq6r54ASXWGMK9" },
      { key: "EU42", trueId: "1d4wCqI9Vno9wwNwrEbkibQGUgxPejm5Z", falseId: "1TkN5oFFGDq_bYO56lnNw_BvwWxm5pdjc" },
      { key: "EU4244", trueId: "1Vt-_beDKLLItf-mQIqIGjBUOaAZTSL6o", falseId: "1EcElReHP3DYzfcQnXVj6n7VJufOfwaNF" },
      { key: "EU44", trueId: "1SPpECUO78hFYv6P0V6xryLgMXx-KkWwn", falseId: "1WTUrVCgOm3NfWiRdUBXcNlmDFzRn6R0k" },
      { key: "EU46", trueId: "1NyKPsEfo9q_t9k0WgEvLkU7LxKbASFks", falseId: "1dfAiO_QutWbCDB-kgFQiAkyUNE5E5aLc" },
      { key: "EU4648", trueId: "1oq82XfHZevnKU0EBbImNaGwKTMJPwsJR", falseId: "1J7uSFTMr7M8k0BTld8yuRVJFjqUl-xaB" },
      { key: "EU48", trueId: "15Qs7Tk4BEcOERurOSonCWE9e6h5yTF_B", falseId: "1wEFnYzeZaryR2sQZanF-zB5oNb5W8Jqi" }
    ]
  },
  {
    title: "13FXO2y9MwhBRRLfav_57fHmnawi236F2",
    sizes: [
      { key: "XS", trueId: "1fo2xSQdYAxc5wur2j42kqfaBNnAAowoa", falseId: "1Llb31YJSRgnlbJjQKh1_qv9Ei93hRxzF" },
      { key: "S", trueId: "12zAn5AmgyG6waKAgqioHMfB28QjAlwwY", falseId: "14q7cIEJIa2gQums81lgrMyRm08aXiu1Z" },
      { key: "M", trueId: "1x0udUH6RqecdbHD_WJvDlqHSjldmlBVB", falseId: "15l9nD1AdqM-h9d9RIMTA9m1VNrRuhImc" },
      { key: "L", trueId: "1xGlMfaxmVWQiS-3XHJc8EypOFV7m5bl4", falseId: "1u4Ll51Phy5tKvoBpK1YXd0W7m4UbcFV2" },
      { key: "XL", trueId: "1yvfJqilhdUw0NgOvwKXkn8piHKNVFIoH", falseId: "1LlqkDB-YcBkk7g74OjXVHfm7qmutg5gs" },
      { key: "2XL", trueId: "1rswUnEgd7jMZPbsTMp_aVaHmx9N2AXlU", falseId: "1PcZwwRdqnoz1FvDxtVf7aQJKCtvu62rK" }
    ]
  },
  {
    title: "1o-bFV6fUuz4-UOz3LHuNCmLDEQRTQpCK",
    sizes: [
      { key: "40", trueId: "107zMXiUS71NF-yFx8-0bmicjcrH0Vjpr", falseId: "1z3t0nNPRWhfb2NZ2yyZ5yVlj1KtLeGL3" },
      { key: "40 2/3", trueId: "1dDymb3WDFjwKQswqx9JTm2a3G8eMQb87", falseId: "1EVan3IADTMUMpcjynJZeEwY_KKkdHJCX" }
    ]
  },
  {
    title: "1YA3WaLcSWL50BHllfjRcI6Bu-qj-kP50",
    sizes: [
      { key: "Onesize", trueId: "1_vg2cPTQQvQNyUKNgWGY_5159mFXK7MS", falseId: "1yn6-0jQ61iKVjPC7YThePp16oQE4uKgc" }
    ]
  }
];

const SIDEBAR_BUBBLES = [
  "13pZM4zD0ZOojOOK8Z9U-XRD_LB6jFLhv",
  "1-kkfG5BQGSEN0y5gtib-G7Bag24CS48z",
  "1Ee96od3smLEBunbehTGh3pO-IB8-dwuB",
  "1ph54eAPqFOmK8vTK66MRjRqwvQ0bTPDB",
  "1FF7BwwV62D1SPG_LafWYg-bcBkPS-9Ze",
  "1b4KYFbxWVtbxe-Ye9-xToCMPc5SFRdyr",
  "1pBaobKsdrgze1xHFuKeluNh92gXYJe2w",
  "1h_iBEd6GdVI-zQ7KSjkxMb0nY5eXThb7",
  "1QyCpAEWxB62D5FamJVosBbk8dVlmSqA8",
  "1YNpfOx62ScrIRv9ujFDrYymp-HWSnYpg",
  "1kdlJZkZDI8ZQLZ0cFZeUyUp4P4z2Wwmz",
  "1xwj9oQKB5u8848iS6rt5Hp1Ps7ohosE7",
  "1xzJ46Zv8wXrFOl7sOYHpS8S9_Pc4yz-B"
];

let selectedSizes = {};
SIZE_DATA.forEach(group => {
  group.sizes.forEach(s => {
    selectedSizes[s.key] = true;
  });
});

let formData = { collect: 'collect', brand: '', sold: 'FALSE' };
const PAGE_TYPE = typeof PAGE_MODE !== 'undefined' ? PAGE_MODE : 'collect';

document.addEventListener('DOMContentLoaded', () => {
  renderSizeMenuUI();
  fetchData();

  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('sizeDropdown');
    const trigger = document.querySelector('.size-menu-trigger');
    if (dropdown && trigger && dropdown.style.display === 'block') {
      if (!dropdown.contains(e.target) && !trigger.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    }
  });
});

function fetchData() {
  fetch(APPS_SCRIPT_URL)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) allItems = data;
      else if (data && Array.isArray(data.items)) allItems = data.items;
      else if (data && typeof data === 'object') allItems = Object.values(data);
      else allItems = [];
      updateCategoryDatalist();
      renderItems();
    })
    .catch(err => console.error("Fejl:", err));
}

function handleButtonA() {
  if (PAGE_TYPE === 'collect') openModal('collect');
  else window.location.href = 'index.html';
}

function handleButtonB() {
  if (PAGE_TYPE === 'collect') window.location.href = 'wishlist.html';
  else openModal('wish');
}

function toggleShowSold() {
  showSold = !showSold;
  const toggleImg = document.getElementById('showSoldToggleImg');
  if (toggleImg) toggleImg.src = `https://lh3.googleusercontent.com/d/${showSold ? IMAGES.showSoldOn : IMAGES.showSoldOff}`;
  renderItems();
}

function handleSearch(val) {
  searchQuery = val.toLowerCase().trim();
  renderItems();
}

function toggleSizeMenu(e) {
  e.stopPropagation();
  const dropdown = document.getElementById('sizeDropdown');
  if (!dropdown) return;
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function renderSizeMenuUI() {
  const dropdown = document.getElementById('sizeDropdown');
  if (!dropdown) return;
  let html = '';
  SIZE_DATA.forEach((group, idx) => {
    if (idx === 0) {
      html += `
        <div class="size-dropdown-top">
          <img src="https://lh3.googleusercontent.com/d/${group.title}" class="size-group-title" style="margin-bottom:0;" alt="Women's">
          <div class="size-quick-actions">
            <img src="https://lh3.googleusercontent.com/d/1V2GovFhIyQNeToWVriLnLizmC295PoxL" onclick="selectAllSizes(true)" alt="ON">
            <img src="https://lh3.googleusercontent.com/d/18sFkDxQEW3oa79aSI-sWZLi5oSoEWOuZ" onclick="selectAllSizes(false)" alt="OFF">
          </div>
        </div>
        <div class="size-group">`;
    } else {
      html += `<div class="size-group"><img src="https://lh3.googleusercontent.com/d/${group.title}" class="size-group-title" alt="title">`;
    }
    html += `<div class="size-grid">`;
    group.sizes.forEach(s => {
      const isSelected = !!selectedSizes[s.key];
      html += `<img src="https://lh3.googleusercontent.com/d/${isSelected ? s.trueId : s.falseId}" onclick="toggleSingleSize(event, '${s.key}')" alt="${s.key}">`;
    });
    html += `</div></div>`;
  });
  dropdown.innerHTML = html;
}

function toggleSingleSize(e, sizeKey) {
  if (e) e.stopPropagation();
  selectedSizes[sizeKey] = !selectedSizes[sizeKey];
  renderSizeMenuUI();
  renderItems();
}

function selectAllSizes(status) {
  SIZE_DATA.forEach(group => group.sizes.forEach(s => selectedSizes[s.key] = status));
  renderSizeMenuUI();
  renderItems();
}

function getSizeBadgeId(sizeStr) {
  if (!sizeStr) return null;
  const clean = sizeStr.trim().toUpperCase();
  for (let group of SIZE_DATA) {
    for (let s of group.sizes) {
      if (s.key.toUpperCase() === clean) return s.trueId;
    }
  }
  return null;
}

function renderItems() {
  const contentArea = document.getElementById('contentArea');
  const alphabetNav = document.getElementById('alphabetNav');
  if (!contentArea) return;
  contentArea.innerHTML = '';
  if (alphabetNav) alphabetNav.innerHTML = '';

  const filtered = allItems.filter(item => {
    if (!item) return false;
    const itemCollect = item.collect ? String(item.collect).toLowerCase().trim() : 'collect';
    const currentMode = PAGE_TYPE.toLowerCase().trim();
    const isCorrectType = itemCollect === currentMode || (currentMode === 'collect' && !item.collect);
    
    const isSold = String(item.sold).toUpperCase() === 'TRUE';
    if (!showSold && isSold) return false;

    // Kun filtrér på størrelse hvis varen faktisk har en størrelse udfyldt!
    if (item.size && item.size.trim() !== '') {
      const itemSizeKey = item.size.trim();
      if (selectedSizes.hasOwnProperty(itemSizeKey) && !selectedSizes[itemSizeKey]) {
        return false;
      }
    }

    if (searchQuery) {
      const matchName = item.name && item.name.toLowerCase().includes(searchQuery);
      const matchArt = item.articlenumber && item.articlenumber.toLowerCase().includes(searchQuery);
      const matchCat = item.category && item.category.toLowerCase().includes(searchQuery);
      if (!matchName && !matchArt && !matchCat) return false;
    }
    return isCorrectType;
  });

  const categories = {};
  filtered.forEach(item => {
    const cat = item.category ? item.category.trim() : 'Uncategorized';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(item);
  });

  const sortedCats = Object.keys(categories).sort();

  sortedCats.forEach((cat, index) => {
    const safeCatId = encodeURIComponent(cat);

    if (alphabetNav) {
      const bubbleImgId = SIDEBAR_BUBBLES[index % SIDEBAR_BUBBLES.length];
      const letter = cat.charAt(0).toUpperCase();
      const bubbleItem = document.createElement('a');
      bubbleItem.className = 'sidebar-bubble-item';
      bubbleItem.href = `#cat-${safeCatId}`;
      bubbleItem.innerHTML = `
        <img class="sidebar-bubble-bg" src="https://lh3.googleusercontent.com/d/${bubbleImgId}" alt="bubble">
        <span class="sidebar-bubble-letter">${letter}</span>
      `;
      alphabetNav.appendChild(bubbleItem);
    }

    const section = document.createElement('div');
    section.className = 'category-section';
    section.id = `cat-${safeCatId}`;

    const title = document.createElement('h2');
    title.className = 'category-title';
    title.textContent = cat;
    section.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'item-grid';

    categories[cat].forEach(item => {
      const card = document.createElement('div');
      card.className = 'item-card';
      card.onclick = () => editItem(item.id);

      const isSold = String(item.sold).toUpperCase() === 'TRUE';
      const bgUrl = item.imageid ? `https://lh3.googleusercontent.com/d/${item.imageid}` : '';
      const brandText = item.brand === 'performance' ? 'adidas Performance' : 'adidas Originals';
      const sizeBadgeId = getSizeBadgeId(item.size);
      const hasSalePrice = isSold && item.saleprice && item.saleprice.trim() !== '';
      const cleanPurchase = item.purchaseprice ? item.purchaseprice.replace(/kr\.?/gi, '').trim() : '';
      const cleanSale = item.saleprice ? item.saleprice.replace(/kr\.?/gi, '').trim() : '';

      card.innerHTML = `
        <div class="image-wrapper" style="background-image: url('${bgUrl}');">
          ${isSold ? '<div class="sold-overlay"></div>' : ''}
          ${sizeBadgeId ? `<img class="size-badge" src="https://lh3.googleusercontent.com/d/${sizeBadgeId}" alt="${item.size}">` : ''}
          <div class="article-badge">
            <img src="https://lh3.googleusercontent.com/d/1k2UAsx1wDDB_nzxmmHjxAotoMZ5BQft1" alt="a#">
            <span>${item.articlenumber || ''}</span>
          </div>
        </div>
        <div class="info-box">
          <span class="item-id">${item.id || ''}</span>
          <div class="info-header"><span>${brandText}</span></div>
          <div class="info-name">${item.name || ''}</div>
          <div class="info-row">
            <span>Made in</span>
            <span class="val">${item.madein || ''}</span>
          </div>
          <div class="info-row">
            <div class="price-left-side">
              <img src="https://lh3.googleusercontent.com/d/${IMAGES.iconPurchasePrice}" alt="purchase">
              <span class="val">${cleanPurchase ? cleanPurchase + ' kr.' : ''}</span>
            </div>
            ${hasSalePrice ? `
            <div class="price-right-side">
              <img src="https://lh3.googleusercontent.com/d/${IMAGES.iconSalePrice}" alt="sale">
              <span class="val">${cleanSale ? cleanSale + ' kr.' : ''}</span>
            </div>
            ` : ''}
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

    section.appendChild(grid);
    contentArea.appendChild(section);
  });
}

function updateCategoryDatalist() {
  const datalist = document.getElementById('categorySuggestions');
  if (!datalist) return;
  const categories = [...new Set(allItems.map(item => item ? item.category : null).filter(Boolean))];
  datalist.innerHTML = categories.map(cat => `<option value="${cat}">`).join('');
}

function openModal(type) {
  currentEditId = null;
  currentImageBase64 = null;
  const uploadPreview = document.getElementById('uploadPreview');
  if (uploadPreview) uploadPreview.style.backgroundImage = `url('https://lh3.googleusercontent.com/d/${IMAGES.uploadPlaceholder}')`;

  setPageType(type);
  initBrand('');
  setSoldState('FALSE');

  ['mArticle', 'mName', 'mCategory', 'mSize', 'mProduced', 'mMadeIn', 'mMaterial', 'mPurchasePrice', 'mSalePrice'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  document.getElementById('modalBg').style.display = 'flex';
}

function closeModal() {
  document.getElementById('modalBg').style.display = 'none';
}

function toggleModalPageType() {
  setPageType(formData.collect === 'collect' ? 'wish' : 'collect');
}

function setPageType(type) {
  formData.collect = type;
  const card = document.getElementById('modalCard');
  const headerImg = document.getElementById('modalHeaderImg');
  const moveBtn = document.getElementById('imgMoveBtn');

  if (type === 'collect') {
    card.className = 'modal modal-collect';
    if (headerImg) headerImg.src = `https://lh3.googleusercontent.com/d/${IMAGES.headerCollect}`;
    if (moveBtn) moveBtn.src = `https://lh3.googleusercontent.com/d/${IMAGES.moveWish}`;
  } else {
    card.className = 'modal modal-wishlist';
    if (headerImg) headerImg.src = `https://lh3.googleusercontent.com/d/${IMAGES.headerWish}`;
    if (moveBtn) moveBtn.src = `https://lh3.googleusercontent.com/d/${IMAGES.moveCollect}`;
  }
}

function selectBrand(brand) {
  formData.brand = (formData.brand === brand) ? '' : brand;
  updateBrandUI();
}

function initBrand(brand) {
  formData.brand = brand ? String(brand).toLowerCase().trim() : '';
  updateBrandUI();
}

function updateBrandUI() {
  const orig = document.getElementById('imgOrigToggle');
  const perf = document.getElementById('imgPerfToggle');
  if (orig) orig.src = `https://lh3.googleusercontent.com/d/${formData.brand === 'originals' ? IMAGES.origTrue : IMAGES.origFalse}`;
  if (perf) perf.src = `https://lh3.googleusercontent.com/d/${formData.brand === 'performance' ? IMAGES.perfTrue : IMAGES.perfFalse}`;
}

function toggleSoldState() {
  setSoldState(formData.sold === 'TRUE' ? 'FALSE' : 'TRUE');
}

function setSoldState(state) {
  formData.sold = state;
  const btn = document.getElementById('btnSold');
  const saleInput = document.getElementById('mSalePrice');
  const saleGroup = document.getElementById('salePriceGroup');

  if (btn) btn.src = `https://lh3.googleusercontent.com/d/${state === 'TRUE' ? IMAGES.soldTrue : IMAGES.soldFalse}`;
  if (saleInput) {
    saleInput.disabled = (state !== 'TRUE');
    if (state !== 'TRUE') saleInput.value = '';
  }
  if (saleGroup) {
    if (state === 'TRUE') saleGroup.classList.add('active');
    else saleGroup.classList.remove('active');
  }
}

function handleImage(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      currentImageBase64 = e.target.result;
      document.getElementById('uploadPreview').style.backgroundImage = `url('${e.target.result}')`;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function editItem(id) {
  const item = allItems.find(i => i && i.id == id);
  if (!item) return;

  currentEditId = item.id;
  setPageType(item.collect || PAGE_TYPE);
  initBrand(item.brand || '');
  setSoldState(String(item.sold).toUpperCase());

  const uploadPreview = document.getElementById('uploadPreview');
  if (uploadPreview) {
    uploadPreview.style.backgroundImage = item.imageid 
      ? `url('https://lh3.googleusercontent.com/d/${item.imageid}')` 
      : `url('https://lh3.googleusercontent.com/d/${IMAGES.uploadPlaceholder}')`;
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
  if (isSaving) return;
  isSaving = true;

  const payload = {
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
  .then(() => {
    isSaving = false;
    closeModal();
    fetchData();
  })
  .catch(err => {
    isSaving = false;
    console.error("Fejl ved gemning:", err);
  });
}
