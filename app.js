const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwUo7SdjykTdMeSnEtyAxIknuYfsx8n3PSCXJUIvYeJVbRXqbAnFTCcpMfgLSYKNUShZA/exec";

let allItems = [];
let showSold = false;
let searchQuery = "";
let currentImageBase64 = null;
let currentEditId = null;
let isSaving = false;

// Google Drive Image IDs (Verificerede originale ID'er)
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
  moveCollect: "1vMlgzgIov6ukflJWXYIFuC-IkbaLNztl",
  showSoldOff: "1B65f2Et5kHbFkxHI8Q6cN3Uva6Ls0EKZ",
  showSoldOn: "19wTkumBvqWSzhakI3TRw6ACWI0jl2YCG",
  
  // Priser & Tider
  iconPurchasePrice: "1pXAS0b2IK1Z81StPX8XjWdkUli2hlz_L",
  iconSalePrice: "1Yu_Lil2oFqOlkPmjOwcmu7iL4nCMcVxI",
  iconProduced: "1ij4Ek7JOZ956BKEObfNPiQUkQRFSTVBY"
};

// Size menu data struktur
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
  "1Ln22zhv0zcnKNziXvsAIESp1oqxGIKXm", "11Oi6irS__YuRjIX5sqGtp78xQAWPgB3x",
  "1wyEBnYqDytb-cvBT2QGb3hIpc2wD8Tw4", "1W-ifi3tV4I1f3PKBi_jhHkx6bm7PcmnK",
  "1Q-OapCZBmCZw2kQmSitvXJCzHfOWGsdl", "1ITVylqaFbSDbzgzvVu8MmEI0FMqYBq9N",
  "1NGLXLESqiqB1zpOK1j6CWnjsN7CE0x7B", "1x51AtWrBxXhyDH3c1nr6iu_TYgN6_UUD",
  "16vB2lMSj6-1ER5KIGyMCi8FzXqQiTCZY", "1aP0-odukyTNgU5F9TKnQLYUjD1uGvTc2",
  "1WA8oWaJLNjVpmk4W37HMhcUT_Crns0oM", "1FnsMO5R5DTCh_Ql5f8W_wRZRcM0ik5Iv",
  "1wzGfk5eo1pDOmgDfLQJhNnw82DwGznhl"
];

let selectedSizes = {};
SIZE_DATA.forEach(group => {
  group.sizes.forEach(s => {
    selectedSizes[s.key] = true;
  });
});

let formData = {
  collect: 'collect',
  brand: '',
  sold: 'FALSE'
};

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
      if (Array.isArray(data)) {
        allItems = data;
      } else if (data && Array.isArray(data.items)) {
        allItems = data.items;
      } else if (data && typeof data === 'object') {
        allItems = Object.values(data);
      } else {
        allItems = [];
      }
      updateCategoryDatalist();
      renderItems();
    })
    .catch(err => console.error("Fejl ved hentning af data:", err));
}

function handleButtonA() {
  if (PAGE_TYPE === 'collect') {
    openModal('collect');
  } else {
    window.location.href = 'index.html';
  }
}

function handleButtonB() {
  if (PAGE_TYPE === 'collect') {
    window.location.href = 'wishlist.html';
  } else {
    openModal('wish');
  }
}

function toggleShowSold() {
  showSold = !showSold;
  const toggleImg = document.getElementById('showSoldToggleImg');
  if (toggleImg) {
    toggleImg.src = `https://lh3.googleusercontent.com/d/${showSold ? IMAGES.showSoldOn : IMAGES.showSoldOff}`;
  }
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
    const isFirst = idx === 0;
    
    if (isFirst) {
      html += `
        <div class="size-dropdown-top">
          <img src="https://lh3.googleusercontent.com/d/${group.title}" class="size
