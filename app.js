const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwUo7SdjykTdMeSnEtyAxIknuYfsx8n3PSCXJUIvYeJVbRXqbAnFTCcpMfgLSYKNUShZA/exec";

let allItems = [];
let showSold = false;
let currentImageBase64 = null;
let currentEditId = null;
let isSaving = false;

// Billed-ID konstanter fra dine specifikationer
const IMAGES = {
  headerCollect: "1dWYclOTMbNctJwKXaqd6GcN5-TYx351e",
  headerWish: "1oTjzdjkAa2-aNJapRQ6fXrRtFdKMwb4H",
  uploadPlaceholder: "17YobDkGOVX0dUIyLRVu_alxkMO2AnmxT",
  origTrue: "13GMah-24GEVQZgeAK4LV1MPXh1LJ7d14",
  origFalse: "1DyIHFmCtyFQIfJoQEIKdO2KhdzngxNEy",
  perfTrue: "1hCj9NF8Heg5aTA_7BcCZnHmsZ4an2MBC",
  perfFalse: "1Gups0Qilu0Zau09XiGHn4JR98etyR0ZR",
  soldFalse: "1K9HrpK2swbPdadOZPbrPVT3-V7k7bwCK",
  soldTrue: "1vETS8eyAKpPjy89FdnPhRyh70Jw9whoK",
  moveWish: "1fJBy15xDCzGyYaRVC7kuffylkNr8L-6m",
  moveCollect: "1vMlgzgIov6ukflJWXYIFuC-IkbaLNztl"
};

let formData = {
  collect: 'collect',
  brand: 'originals',
  sold: 'FALSE'
};

document.addEventListener('DOMContentLoaded', () => {
  fetchData();
});

function fetchData() {
  fetch(APPS_SCRIPT_URL)
    .then(res => res.json())
    .then(data => {
      allItems = data;
      updateCategoryDatalist();
      renderItems();
    });
}

/* Opdaterer Kategori Autocomplete ud fra eksisterende Kategorier */
function updateCategoryDatalist() {
  const datalist = document.getElementById('categorySuggestions');
  if (!datalist) return;
  
  const categories = [...new Set(allItems.map(item => item.category).filter(Boolean))];
  datalist.innerHTML = categories.map(cat => `<option value="${cat}">`).join('');
}

/* Modal Åbne/Lukke Logik */
function openModalForCurrentPage() {
  openModal(PAGE_MODE); // Åbner til den aktuelle side (collect eller wish)
}

function openModal(type) {
  currentEditId = null;
  currentImageBase64 = null;
  
  document.getElementById('uploadPreview').style.backgroundImage = `url('https://lh3.googleusercontent.com/d/${IMAGES.uploadPlaceholder}')`;

  setPageType(type);
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

/* Skifter visuel udformning og target-destination (Collection <-> Wishlist) */
function toggleModalPageType() {
  const newType = formData.collect === 'collect' ? 'wish' : 'collect';
  setPageType(newType);
}

function setPageType(type) {
  formData.collect = type;
  const card = document.getElementById('modalCard');
  const headerImg = document.getElementById('modalHeaderImg');
  const moveBtn = document.getElementById('imgMoveBtn');

  if (type === 'collect') {
    card.className = 'modal modal-collect';
    headerImg.src = `https://lh3.googleusercontent.com/d/${IMAGES.headerCollect}`;
    moveBtn.src = `https://lh3.googleusercontent.com/d/${IMAGES.moveWish}`;
  } else {
    card.className = 'modal modal-wishlist';
    headerImg.src = `https://lh3.googleusercontent.com/d/${IMAGES.headerWish}`;
    moveBtn.src = `https://lh3.googleusercontent.com/d/${IMAGES.moveCollect}`;
  }
}

function setBrand(brand) {
  formData.brand = brand;
  document.getElementById('imgOrigToggle').src = `https://lh3.googleusercontent.com/d/${brand === 'originals' ? IMAGES.origTrue : IMAGES.origFalse}`;
  document.getElementById('imgPerfToggle').src = `https://lh3.googleusercontent.com/d/${brand === 'performance' ? IMAGES.perfTrue : IMAGES.perfFalse}`;
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
    btn.src = `https://lh3.googleusercontent.com/d/${IMAGES.soldTrue}`;
    saleInput.disabled = false;
  } else {
    btn.src = `https://lh3.googleusercontent.com/d/${IMAGES.soldFalse}`;
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
  setPageType(item.collect || PAGE_MODE);
  setBrand(item.brand || 'originals');
  setSoldState(String(item.sold).toUpperCase());

  if (item.imageid) {
    document.getElementById('uploadPreview').style.backgroundImage = `url('https://lh3.googleusercontent.com/d/${item.imageid}')`;
  } else {
    document.getElementById('uploadPreview').style.backgroundImage = `url('https://lh3.googleusercontent.com/d/${IMAGES.uploadPlaceholder}')`;
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
  .then(() => {
    isSaving = false;
    closeModal();
    fetchData();
  })
  .catch(err => {
    isSaving = false;
    console.error("Fejl:", err);
  });
}
