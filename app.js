const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwUo7SdjykTdMeSnEtyAxIknuYfsx8n3PSCXJUIvYeJVbRXqbAnFTCcpMfgLSYKNUShZA/exec";

let allItems = [];
let showSold = false;
let searchQuery = "";
let currentImageBase64 = null;
let currentEditId = null;
let isSaving = false;
let isFormDirty = false;

let filterOriginals = true;
let filterPerformance = true;

const IMAGES = {
  headerCollect: "1gmPYQ6Regt_LEtvqxmYXH6gj2A0O2zVm",
  headerWish: "1jDUHm6gbM6adDlhTJVOFNG_MZo8_Xeuy",
  uploadPlaceholder: "17YobDkGOVX0dUIyLRVu_alxkMO2AnmxT",
  
  origTrue: "1phuiZ7Mh7kYKfAENbCw2ah78_Tem2NAM",
  origFalse: "152SiPw7Y39y_jeMaTdTZLXFkgR_Zu4cn",
  perfTrue: "1ycABFjAvKvRXOgnKJ77_fO2Y0zpAh6fG",
  perfFalse: "1wEklPrdEZ3GHbNw2ejwfYwx1nBnRxhny",

  resellingFalse: "1ZgqEp1y0HhGzAgEuo3k7wsO649HFDkkq",
  resellingTrue: "1hIqnBUEUonxCP1qxlFVw2TduFihALI_z",

  soldFalse: "1qrY7_DlZXQsGCG4XxSvVPB6sGR-SUigi",
  soldTrue: "1Zt0UksdR_2Qs6PxTQzep8Ggs3VZOANeS",

  moveWish: "1XsICtNKjWCBHymS1GHLmU-zh8LCk0f5a",
  moveCollect: "1G6bh59wDqrV1XJ8tIZsDJniycS4BHwZ_",

  showSoldOff: "1B65f2Et5kHbFkxHI8Q6cN3Uva6Ls0EKZ",
  showSoldOn: "19wTkumBvqWSzhakI3TRw6ACWI0jl2YCG",
  
  iconPurchasePrice: "161MpMU1eBg3tkn6EEyzR8lCPmTur-SOY",
  iconSalePrice: "1AL23h0itXKmbWh_P4v_PL-J-AiXC1Nax",
  iconProduced: "1C0naWRde39PV2fVvuN8VCmBBYK2Z_JGV",

  titleWomens: "1wVjPm2JnH3qFR2A51le5mgsPfGEx_bDr",
  titleMens: "1FZvtiQzeDmPki0rl8e0oghjUt-vH13WN",
  titleFootwear: "1tc7sTYRoi5CS7788eTezlKtMawesYidv",
  titleHeadwear: "1f_c7F_RwTZw3qK9dhlqyCepYOFmLGDEM",
  titleOther: "1DX0MkbLgzYaT1w6QwDjh5DeinyGxb3go"
};

const BUBBLE_POOL = [
  { on: "19Sngi-ZMh3nI6EqQGFmBu-ohRNGyXaUB", off: "1b0vczDVmwLnTOb_keGHLGLOsC0NYvmxB" },
  { on: "1oSaYImJ6EwqGaI4x-Q2snVjBsO_AD_of", off: "1bTbH9-lfxX8MJZA2Fl99zYHg4zh7n5eT" },
  { on: "1EWmg1Rq9ZDo3LG0oc_qlDkwKl6OdPNnT", off: "1-7Rfh1XAprYJM-o29DrLn9DxHinULSBc" },
  { on: "1-Dn4ewUwcfseW_dmrTFnSCMUTxns0Zbp", off: "1AChcQE0xQBCQ5Cowmnm2K1SiB-8cCH1R" },
  { on: "1XFzy-8D7fm64AL0zo6GnRZTJvN6GuTCZ", off: "1SqwJ9Al4D7QFRGTKJrqd4tyv6m1n6Q_s" },
  { on: "1C7iDywweLy5Q35n1kc9zOjKCpHts4wgX", off: "1lXuArcFoewpEgLoiqwwEsW3mCg6lyeP0" },
  { on: "1sg0YdPg7oSg5kljwOA8w4gDhzJ0mELAq", off: "1KpgjuRsvcpIRk1K8EaIipwrLW5vC2jFn" },
  { on: "1c95c2nJOJpB-oo0Zjrd0_xsVrFA4NDj0", off: "131hweeGwyX6Q2Rzf-iQP7m7IJZ_zpCVe" },
  { on: "130z7JUCjpz2eNuZPkZA9jpujkp5C9AQR", off: "1iQcUr14XvmMhZakvX2NHYakEcytCh3JE" },
  { on: "1ooFPtS3MxVWIstynwqx_kMFW9efv6qI4", off: "1myaJLxFY7Wy6OhQA8VjifZl1fBQeKW4C" },
  { on: "1-x27Gket_w9Yfro1wurmYVhelV1nYJoy", off: "1QewCyyXho4XdQ3tjGbrpQU6d50qOHTnn" },
  { on: "10KQziPm5tUJ7s42AGM9nDgcswotOhU3C", off: "1WDfwN9pAk6wjNrdQe6FbjOrXNd6F8r0K" },
  { on: "16EK8zSE42eyOhJDqpxZzGWj1k3ZxBobA", off: "11pcGjGD5BB-TdTb5w9fV97TrzzBUqnBi" },
  { on: "1oWAK0dPmHGaB1JNiIKgPybSRVLGnC0sl", off: "1I368gvq6D7Z2-qnkxh_jKJfG7_SPKCAh" },
  { on: "1FAMypHwXrjNpr9NobPMCOi6zC1C99Z63", off: "1r0GfzpuNNzHINSBt1xO3XKDWG-BKxecw" },
  { on: "1YnIPeN0MtHlutha69usdcUEA-KQn0Ey-", off: "1IIV_b2gGiuh4wU4dUeM7iZvuEzmsNJvy" },
  { on: "1N0i1b4f2gZ609l9ER7bZjDFvGn91C6Y1", off: "1a9rPFGonOUwikHdEw5PxXLROqKQ5CesQ" },
  { on: "1PVtO-H3PJD-LRftB7RGpJp993FPoiR4k", off: "1DaZwKCK7-lzo78bgIwLfhrC6moMqCCgn" },
  { on: "1Ds8bP-GbZKX1ieKg6h5YG0DPdgnzgzdn", off: "1bOMft5dEZAF_WdNfa-IwkOpXHxBoo-Dz" },
  { on: "1pfxnzJGSGieHyhpyqbk2NSn3r9cMvcef", off: "1XkV2IpIToHBmlacAAgrHdQMLIE_fbPWh" },
  { on: "1HTbasj_4NLz-sCZymmNzEDvVu97kxNl-", off: "16Ah_DpANrMiSxouhpoKqjEy0f0pN0FjV" },
  { on: "1Pg-knrds52-fmR54pcXyYerceVmE-Ey0", off: "1yYm7O7ACi4t9FYgPxUzs8yy6isSpQCoU" },
  { on: "1e4cjMqC4vdekMR-dPjSQbwbCNoOzfm5a", off: "1_KBqDxgXbzySXPaxzIKWqEQh_8WIkZdE" },
  { on: "1PesIx3AgXNuYMTdwp2ww6Hz1_jR2xp6T", off: "1DdyNgsLWwnjQScJj40Tmsj0N6l869IoU" },
  { on: "1FFVxTe-d9frBr10-4PSsivGy8WnCg6wv", off: "1otWFgBRhkUdga2vgptbG64w7woaz-bqp" },
  { on: "1C49F9AAn1moWHWE5oDwTI-rPQYFRFXIj", off: "1Q9UKOqM97JSZ8tllwnr7vFSSvmFJtch8" },
  { on: "1cK3B8AyWurHV9UIE1yFp38fL_-KkYjXr", off: "1SwGtajJFbaoncR6KZYwlSKVEmW6WnmTo" },
  { on: "14_jemxg2kx7NfjP9Cou0W5J_K8zFNAVc", off: "1jxtJcM08QV5Z0OVB_0wrMAr5Shi25tTB" }
];

const SIZE_CATEGORIES = [
  {
    titleId: IMAGES.titleWomens,
    name: "Women's",
    sizes: [
      { key: "EU26", l1: "2XS", s1: 32, c1: "#347CF7", b1: "#1165F5", l2: "26", s2: 40, c2: "#FC6A96", b2: "#F22E69", lead: 32 },
      { key: "EU2628", l1: "2XS", s1: 32, c1: "#347CF7", b1: "#1165F5", l2: "26-28", s2: 40, c2: "#FC6A96", b2: "#F22E69", lead: 32 },
      { key: "EU28", l1: "2XS", s1: 32, c1: "#347CF7", b1: "#1165F5", l2: "28", s2: 40, c2: "#FC6A96", b2: "#F22E69", lead: 32 },
      { key: "EU30", l1: "XS", s1: 32, c1: "#347CF7", b1: "#1165F5", l2: "30", s2: 40, c2: "#FC6A96", b2: "#F22E69", lead: 32 },
      { key: "EU3032", l1: "XS", s1: 32, c1: "#347CF7", b1: "#1165F5", l2: "30-32", s2: 40, c2: "#FC6A96", b2: "#F22E69", lead: 32 },
      { key: "EU32", l1: "XS", s1: 32, c1: "#347CF7", b1: "#1165F5", l2: "32", s2: 40, c2: "#FC6A96", b2: "#F22E69", lead: 32 },
      { key: "EU34", l1: "S", s1: 32, c1: "#347CF7", b1: "#1165F5", l2: "34", s2: 40, c2: "#FC6A96", b2: "#F22E69", lead: 32 },
      { key: "EU3436", l1: "S", s1: 32, c1: "#347CF7", b1: "#1165F5", l2: "34-36", s2: 40, c2: "#FC6A96", b2: "#F22E69", lead: 32 },
      { key: "EU36", l1: "S", s1: 32, c1: "#347CF7", b1: "#1165F5", l2: "36", s2: 40, c2: "#FC6A96", b2: "#F22E69", lead: 32 },
      { key: "EU38", l1: "M", s1: 32, c1: "#347CF7", b1: "#1165F5", l2: "38", s2: 40, c2: "#FC6A96", b2: "#F22E69", lead: 32 },
      { key: "EU3840", l1: "M", s1: 32, c1: "#347CF7", b1: "#1165F5", l2: "38-40", s2: 40, c2: "#FC6A96", b2: "#F22E69", lead: 32 },
      { key: "EU40", l1: "M", s1: 32, c1: "#347CF7", b1: "#1165F5", l2: "40", s2: 40, c2: "#FC6A96", b2: "#F22E69", lead: 32 },
      { key: "EU42", l1: "L", s1: 32, c1: "#347CF7", b1: "#1165F5", l2: "42", s2: 40, c2: "#FC6A96", b2: "#F22E69", lead: 32 },
      { key: "EU4244", l1: "L", s1: 32, c1: "#347CF7", b1: "#1165F5", l2: "42-44", s2: 40, c2: "#FC6A96", b2: "#F22E69", lead: 32 },
      { key: "EU44", l1: "L", s1: 32, c1: "#347CF7", b1: "#1165F5", l2: "44", s2: 40, c2: "#FC6A96", b2: "#F22E69", lead: 32 },
      { key: "EU46", l1: "XL", s1: 32, c1: "#347CF7", b1: "#1165F5", l2: "46", s2: 40, c2: "#FC6A96", b2: "#F22E69", lead: 32 },
      { key: "EU4648", l1: "XL", s1: 32, c1: "#347CF7", b1: "#1165F5", l2: "46-48", s2: 40, c2: "#FC6A96", b2: "#F22E69", lead: 32 },
      { key: "EU48", l1: "XL", s1: 32, c1: "#347CF7", b1: "#1165F5", l2: "48", s2: 40, c2: "#FC6A96", b2: "#F22E69", lead: 32 }
    ]
  },
  {
    titleId: IMAGES.titleMens,
    name: "Men's",
    sizes: [
      { key: "XS", l1: "XS", s1: 60, c1: "#728AF7", b1: "#4C6BF5" },
      { key: "S", l1: "S", s1: 60, c1: "#728AF7", b1: "#4C6BF5" },
      { key: "M", l1: "M", s1: 60, c1: "#728AF7", b1: "#4C6BF5" },
      { key: "L", l1: "L", s1: 60, c1: "#728AF7", b1: "#4C6BF5" },
      { key: "XL", l1: "XL", s1: 60, c1: "#728AF7", b1: "#4C6BF5" },
      { key: "2XL", l1: "2XL", s1: 60, c1: "#728AF7", b1: "#4C6BF5" }
    ]
  },
  {
    titleId: IMAGES.titleFootwear,
    name: "Footwear",
    sizes: [
      { key: "40", l1: "40", s1: 48, c1: "#4BB538", b1: "#298F17" },
      { key: "40 1/2", l1: "40½", s1: 48, c1: "#4BB538", b1: "#298F17" },
      { key: "40 2/3", l1: "40⅔", s1: 48, c1: "#4BB538", b1: "#298F17" },
      { key: "39-42", l1: "39-42", s1: 40, c1: "#4BB538", b1: "#298F17" },
      { key: "40-42", l1: "40-42", s1: 40, c1: "#4BB538", b1: "#298F17" }
    ]
  },
  {
    titleId: IMAGES.titleHeadwear,
    name: "Headwear",
    sizes: [
      { key: "OSFA", l1: "OSFA", s1: 35, c1: "#7D7DF5", b1: "#5B49F5" },
      { key: "OSFW", l1: "OSFW", s1: 35, c1: "#7D7DF5", b1: "#5B49F5" },
      { key: "OSFM", l1: "OSFM", s1: 35, c1: "#7D7DF5", b1: "#5B49F5" },
      { key: "S/M", l1: "S/M", s1: 35, c1: "#7D7DF5", b1: "#5B49F5" },
      { key: "L/XL", l1: "L/XL", s1: 35, c1: "#7D7DF5", b1: "#5B49F5" }
    ]
  },
  {
    titleId: IMAGES.titleOther,
    name: "Other",
    sizes: [
      { key: "Onesize", l1: "Onesize", s1: 28, c1: "#FCA40A", b1: "#E89502" },
      { key: "Unisex XS", l1: "UNISEX", s1: 16, c1: "#000000", b1: "#000000", l2: "XS", s2: 64, grad: ["#FA6E9F", "#6EA6FA"], lead: 46 },
      { key: "Unisex S", l1: "UNISEX", s1: 16, c1: "#000000", b1: "#000000", l2: "S", s2: 64, grad: ["#FA6E9F", "#6EA6FA"], lead: 46 },
      { key: "Unisex M", l1: "UNISEX", s1: 16, c1: "#000000", b1: "#000000", l2: "M", s2: 64, grad: ["#FA6E9F", "#6EA6FA"], lead: 46 },
      { key: "Unisex L", l1: "UNISEX", s1: 16, c1: "#000000", b1: "#000000", l2: "L", s2: 64, grad: ["#FA6E9F", "#6EA6FA"], lead: 46 },
      { key: "Unisex XL", l1: "UNISEX", s1: 16, c1: "#000000", b1: "#000000", l2: "XL", s2: 64, grad: ["#FA6E9F", "#6EA6FA"], lead: 46 },
      { key: "29\"", l1: "29\"", s1: 48, c1: "#F78145", b1: "#F56016" },
      { key: "32/32\"", l1: "32/32\"", s1: 36, c1: "#F78145", b1: "#F56016" }
    ]
  }
];

let selectedSizes = {};
SIZE_CATEGORIES.forEach(group => {
  group.sizes.forEach(s => {
    selectedSizes[s.key] = true;
  });
});

let formCollectState = 'collect';
let formBrandState = '';
let formResellingState = 'FALSE';
let formSoldState = 'FALSE';
const PAGE_TYPE = typeof PAGE_MODE !== 'undefined' ? PAGE_MODE : 'collect';

document.addEventListener('DOMContentLoaded', () => {
  renderSizeMenuUI();
  fetchData();

  window.addEventListener('scroll', handleSmartNavbarNavigation);
  window.addEventListener('resize', handleSmartNavbarNavigation);
  handleSmartNavbarNavigation();

  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('sizeDropdown');
    const trigger = document.querySelector('.size-menu-trigger');
    if (dropdown && trigger && dropdown.style.display === 'block') {
      if (!dropdown.contains(e.target) && !trigger.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    }

    const mobPanel = document.getElementById('mobileDropdownPanel');
    const mobTrigger = document.querySelector('.mobile-foldout-trigger');
    if (mobPanel && mobTrigger && mobPanel.style.display === 'flex') {
      if (!mobPanel.contains(e.target) && !mobTrigger.contains(e.target)) {
        mobPanel.style.display = 'none';
      }
    }
  });
});

function handleSmartNavbarNavigation() {
  const header = document.getElementById('headerContainer');
  const alphabetNav = document.getElementById('alphabetNav');
  if (!header || !alphabetNav) return;

  const headerRect = header.getBoundingClientRect();
  const headerBottom = Math.max(0, headerRect.bottom);
  
  alphabetNav.style.top = `${headerBottom + 10}px`;
  alphabetNav.style.maxHeight = `calc(100vh - ${headerBottom + 20}px)`;
}

function markFormDirty() {
  isFormDirty = true;
}

function handleBackdropClick(e) {
  if (e.target.id === 'modalBg') {
    if (!isFormDirty) {
      closeModal();
    }
  }
}

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
      handleSmartNavbarNavigation();
    })
    .catch(err => console.error("Fejl ved data-hentning:", err));
}

function handleButtonA() {
  if (PAGE_TYPE === 'collect') openModal('collect');
  else window.location.href = 'index.html';
}

function handleButtonB() {
  if (PAGE_TYPE === 'collect') window.location.href = 'wishlist.html';
  else openModal('wish');
}

function toggleBrandFilter(brand) {
  if (brand === 'originals') {
    filterOriginals = !filterOriginals;
  } else if (brand === 'performance') {
    filterPerformance = !filterPerformance;
  }

  const topOrig = document.getElementById('topBrandOrig');
  const topPerf = document.getElementById('topBrandPerf');
  const mobOrig = document.getElementById('mobBrandOrig');
  const mobPerf = document.getElementById('mobBrandPerf');

  const origSrc = `https://lh3.googleusercontent.com/d/${filterOriginals ? IMAGES.origTrue : IMAGES.origFalse}`;
  const perfSrc = `https://lh3.googleusercontent.com/d/${filterPerformance ? IMAGES.perfTrue : IMAGES.perfFalse}`;

  if (topOrig) topOrig.src = origSrc;
  if (mobOrig) mobOrig.src = origSrc;
  if (topPerf) topPerf.src = perfSrc;
  if (mobPerf) mobPerf.src = perfSrc;

  renderItems();
}

function toggleShowSold() {
  showSold = !showSold;
  const toggleImg = document.getElementById('showSoldToggleImg');
  const mobToggleImg = document.getElementById('mobShowSoldToggleImg');
  const src = `https://lh3.googleusercontent.com/d/${showSold ? IMAGES.showSoldOn : IMAGES.showSoldOff}`;
  if (toggleImg) toggleImg.src = src;
  if (mobToggleImg) mobToggleImg.src = src;
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

function toggleMobileDropdown(e) {
  e.stopPropagation();
  const panel = document.getElementById('mobileDropdownPanel');
  if (!panel) return;
  panel.style.display = panel.style.display === 'flex' ? 'none' : 'flex';
}

function toggleMobileCategoryNav(e) {
  if (e) e.stopPropagation();
  const nav = document.getElementById('alphabetNav');
  if (!nav) return;
  nav.classList.toggle('mobile-active');
}

function getRandomBubble(seedStr) {
  let hash = 0;
  if (seedStr) {
    for (let i = 0; i < seedStr.length; i++) {
      hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
    }
  } else {
    hash = Math.floor(Math.random() * 100000);
  }
  const index = Math.abs(hash) % BUBBLE_POOL.length;
  return BUBBLE_POOL[index];
}

function renderDynamicSizeBubbleCanvas(sizeKey, isSelected, targetPx, seed) {
  let sizeObj = null;
  for (let cat of SIZE_CATEGORIES) {
    for (let s of cat.sizes) {
      if (s.key.toUpperCase() === String(sizeKey).trim().toUpperCase()) {
        sizeObj = s;
        break;
      }
    }
    if (sizeObj) break;
  }

  if (!sizeObj) {
    sizeObj = { key: sizeKey, l1: sizeKey, s1: 35, c1: "#000000", b1: "#ffffff" };
  }

  // Bruger varens helt unikke ID/seed, så ens størrelser (fx Onesize) får forskellige tilfældige bobler
  const bubbleData = getRandomBubble(seed || sizeKey);
  const imgId = isSelected ? bubbleData.on : bubbleData.off;
  
  const canvas = document.createElement('canvas');
  const dpr = window.devicePixelRatio || 1;
  canvas.width = targetPx * dpr;
  canvas.height = targetPx * dpr;
  canvas.style.width = targetPx + 'px';
  canvas.style.height = targetPx + 'px';
  
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const scale = targetPx / 156.0;

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = `https://lh3.googleusercontent.com/d/${imgId}`;
  img.onload = () => {
    ctx.drawImage(img, 0, 0, targetPx, targetPx);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const drawTextLine = (text, sizePt, color, strokeColor, gradColors, centerY, isUnisexTop) => {
      const pxSize = (sizePt / 156.0) * targetPx * 1.15; 
      ctx.font = `bold ${pxSize}px 'AvantGarde LT Book', sans-serif`;

      if (isUnisexTop) {
        ctx.fillStyle = "#000000";
      } else if (gradColors && gradColors.length >= 2) {
        const gradient = ctx.createLinearGradient(0, 0, targetPx, 0);
        gradient.addColorStop(0, gradColors[0]);
        gradient.addColorStop(1, gradColors[1]);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = color || "#000000";
      }

      if (strokeColor && !isUnisexTop) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = Math.max(0.3, 0.4 * scale);
        ctx.strokeText(text, targetPx / 2, centerY);
      }
      ctx.fillText(text, targetPx / 2, centerY);
    };

    if (sizeObj.l2) {
      const leadPx = (sizeObj.lead || 32) * (targetPx / 156.0);
      const centerY1 = (targetPx / 2) - (leadPx / 2);
      const centerY2 = (targetPx / 2) + (leadPx / 2);
      
      const isUnisexTop = (sizeObj.l1 === "UNISEX" || sizeObj.l1 === "Unisex");
      drawTextLine(sizeObj.l1, sizeObj.s1, sizeObj.c1, sizeObj.b1, sizeObj.grad, centerY1, isUnisexTop);
      drawTextLine(sizeObj.l2, sizeObj.s2, sizeObj.c2, sizeObj.b2, sizeObj.grad, centerY2, false);
    } else {
      drawTextLine(sizeObj.l1, sizeObj.s1, sizeObj.c1, sizeObj.b1, sizeObj.grad, targetPx / 2, false);
    }
  };

  return canvas;
}

function renderSizeMenuUI() {
  const dropdown = document.getElementById('sizeDropdown');
  if (!dropdown) return;
  dropdown.innerHTML = '';

  const topDiv = document.createElement('div');
  topDiv.className = 'size-dropdown-top';
  topDiv.innerHTML = `
    <img src="https://lh3.googleusercontent.com/d/${IMAGES.titleWomens}" class="size-group-title" style="margin-bottom:0;" alt="Women's">
    <div class="size-quick-actions">
      <img src="https://lh3.googleusercontent.com/d/1V2GovFhIyQNeToWVriLnLizmC295PoxL" onclick="selectAllSizes(true, event)" alt="ON">
      <img src="https://lh3.googleusercontent.com/d/18sFkDxQEW3oa79aSI-sWZLi5oSoEWOuZ" onclick="selectAllSizes(false, event)" alt="OFF">
    </div>
  `;
  dropdown.appendChild(topDiv);

  SIZE_CATEGORIES.forEach((cat, idx) => {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'size-group';

    if (idx > 0) {
      const titleImg = document.createElement('img');
      titleImg.className = 'size-group-title';
      titleImg.src = `https://lh3.googleusercontent.com/d/${cat.titleId}`;
      titleImg.alt = cat.name;
      groupDiv.appendChild(titleImg);
    }

    const gridDiv = document.createElement('div');
    gridDiv.className = 'size-grid';

    cat.sizes.forEach(s => {
      const isSelected = !!selectedSizes[s.key];
      const canvas = renderDynamicSizeBubbleCanvas(s.key, isSelected, 46);
      canvas.className = 'size-grid-item';
      canvas.onclick = (e) => toggleSingleSize(e, s.key);
      gridDiv.appendChild(canvas);
    });

    groupDiv.appendChild(gridDiv);
    dropdown.appendChild(groupDiv);
  });
}

function toggleSingleSize(e, sizeKey) {
  if (e) e.stopPropagation();
  selectedSizes[sizeKey] = !selectedSizes[sizeKey];
  renderSizeMenuUI();
  renderItems();
}

function selectAllSizes(status, e) {
  if (e) e.stopPropagation();
  SIZE_CATEGORIES.forEach(group => group.sizes.forEach(s => selectedSizes[s.key] = status));
  renderSizeMenuUI();
  renderItems();
}

function formatDanishPrice(val) {
  if (val === undefined || val === null || val === '') return '';
  let strVal = String(val).replace('kr.', '').replace('kr', '').trim();
  strVal = strVal.replace(',', '.');
  const num = parseFloat(strVal);
  if (isNaN(num)) return String(val);
  return num.toLocaleString('da-DK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' kr.';
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
    if (itemCollect !== currentMode && !(currentMode === 'collect' && !item.collect)) {
      return false;
    }
    
    const brand = item.brand ? String(item.brand).toLowerCase().trim() : 'originals';
    if (brand === 'performance' && !filterPerformance) return false;
    if (brand === 'originals' && !filterOriginals) return false;

    if (item.size) {
      const cleanSize = String(item.size).trim().toUpperCase();
      let matched = false;
      for (let key in selectedSizes) {
        if (key.toUpperCase() === cleanSize) {
          if (!selectedSizes[key]) return false;
          matched = true;
          break;
        }
      }
    }

    const isSold = String(item.sold).toUpperCase() === 'TRUE';
    if (!showSold && isSold) return false;

    if (searchQuery) {
      const matchName = item.name && String(item.name).toLowerCase().includes(searchQuery);
      const matchArt = item.articlenumber && String(item.articlenumber).toLowerCase().includes(searchQuery);
      const matchCat = item.category && String(item.category).toLowerCase().includes(searchQuery);
      if (!matchName && !matchArt && !matchCat) return false;
    }
    
    return true;
  });

  const categories = {};
  filtered.forEach(item => {
    const cat = item.category ? String(item.category).trim() : 'Uncategorized';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(item);
  });

  const sortedCats = Object.keys(categories).sort();

  sortedCats.forEach((cat, index) => {
    const safeCatId = encodeURIComponent(cat);

    if (alphabetNav) {
      const bubbleData = getRandomBubble(cat);
      const letter = cat.charAt(0).toUpperCase();
      const bubbleItem = document.createElement('a');
      bubbleItem.className = 'sidebar-bubble-item';
      bubbleItem.href = `#cat-${safeCatId}`;
      bubbleItem.onclick = () => {
        const nav = document.getElementById('alphabetNav');
        if (nav) nav.classList.remove('mobile-active');
      };
      bubbleItem.innerHTML = `
        <img class="sidebar-bubble-bg" src="https://lh3.googleusercontent.com/d/${bubbleData.on}" alt="bubble">
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

      const isReselling = String(item.reselling).toUpperCase() === 'TRUE';
      const isSold = String(item.sold).toUpperCase() === 'TRUE';
      const bgUrl = item.imageid ? `https://lh3.googleusercontent.com/d/${item.imageid}` : '';
      const brandText = String(item.brand).toLowerCase() === 'performance' ? 'adidas Performance' : 'adidas Originals';
      
      const purchaseFormatted = formatDanishPrice(item.purchaseprice);
      const saleFormatted = formatDanishPrice(item.saleprice);

      const hasMadeIn = item.madein && String(item.madein).trim() !== '';
      const hasProduced = item.produced && String(item.produced).trim() !== '';
      const hasPurchase = item.purchaseprice && String(item.purchaseprice).trim() !== '';
      const hasSale = isSold && item.saleprice && String(item.saleprice).trim() !== '';

      let overlayHTML = '';
      if (isSold) {
        overlayHTML = '<div class="sold-overlay"></div>';
      } else if (isReselling) {
        overlayHTML = '<div class="reselling-gray-overlay"></div>';
      }

      card.innerHTML = `
        <div class="image-wrapper" style="background-image: url('${bgUrl}');">
          ${overlayHTML}
          <div class="size-badge-container"></div>
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
            ${hasMadeIn ? `
              <div class="info-row-left">
                <span>Made in</span>
                <span class="val">${item.madein}</span>
              </div>
            ` : '<div></div>'}
            
            ${hasProduced ? `
              <div class="info-row-right">
                <img src="https://lh3.googleusercontent.com/d/${IMAGES.iconProduced}" alt="produced">
                <span class="val">${item.produced}</span>
              </div>
            ` : ''}
          </div>

          <div class="info-row">
            ${hasPurchase ? `
              <div class="price-left-side">
                <img src="https://lh3.googleusercontent.com/d/${IMAGES.iconPurchasePrice}" alt="purchase">
                <span class="val">${purchaseFormatted}</span>
              </div>
            ` : '<div></div>'}
            
            ${hasSale ? `
              <div class="price-right-side">
                <img src="https://lh3.googleusercontent.com/d/${IMAGES.iconSalePrice}" alt="sale">
                <span class="val">${saleFormatted}</span>
              </div>
            ` : ''}
          </div>
        </div>
      `;

      if (item.size) {
        // Unikt seed sendes med som 4. parameter, så hver vare får en tilfældig unik boble
        const uniqueSeed = item.id || item.articlenumber || Math.random();
        const badgeCanvas = renderDynamicSizeBubbleCanvas(item.size, true, 40, uniqueSeed);
        badgeCanvas.className = 'size-badge-canvas';
        card.querySelector('.image-wrapper').appendChild(badgeCanvas);
      }

      grid.appendChild(card);
    });

    section.appendChild(grid);
    contentArea.appendChild(section);
  });

  if (alphabetNav && sortedCats.length > 0) {
    const closeBtn = document.createElement('a');
    closeBtn.className = 'sidebar-bubble-item sidebar-close-btn';
    closeBtn.onclick = (e) => {
      e.preventDefault();
      const nav = document.getElementById('alphabetNav');
      if (nav) nav.classList.remove('mobile-active');
    };
    closeBtn.innerHTML = `<span>X</span>`;
    alphabetNav.appendChild(closeBtn);
  }

  handleSmartNavbarNavigation();
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
  isFormDirty = false;
  
  const uploadPreview = document.getElementById('uploadPreview');
  if (uploadPreview) uploadPreview.style.backgroundImage = `url('https://lh3.googleusercontent.com/d/${IMAGES.uploadPlaceholder}')`;

  const targetType = (type === 'wish' || type === 'collect') ? type : PAGE_TYPE;
  setPageType(targetType);
  
  initBrand('');
  setResellingState('FALSE');
  setSoldState('FALSE');

  ['mArticle', 'mName', 'mCategory', 'mSize', 'mProduced', 'mMadeIn', 'mMaterial', 'mLining', 'mPurchasePrice', 'mSalePrice'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  document.getElementById('modalBg').style.display = 'flex';
}

function closeModal() {
  document.getElementById('modalBg').style.display = 'none';
  isFormDirty = false;
}

function toggleModalPageType() {
  markFormDirty();
  const newType = formCollectState === 'collect' ? 'wish' : 'collect';
  setPageType(newType);
}

function setPageType(type) {
  formCollectState = (type === 'wish') ? 'wish' : 'collect';
  
  const card = document.getElementById('modalCard');
  const headerImg = document.getElementById('modalHeaderImg');
  const moveBtn = document.getElementById('imgMoveBtn');

  if (formCollectState === 'collect') {
    if (card) card.className = 'modal modal-collect';
    if (headerImg) headerImg.src = `https://lh3.googleusercontent.com/d/${IMAGES.headerCollect}`;
    if (moveBtn) moveBtn.src = `https://lh3.googleusercontent.com/d/${IMAGES.moveWish}`;
  } else {
    if (card) card.className = 'modal modal-wishlist';
    if (headerImg) headerImg.src = `https://lh3.googleusercontent.com/d/${IMAGES.headerWish}`;
    if (moveBtn) moveBtn.src = `https://lh3.googleusercontent.com/d/${IMAGES.moveCollect}`;
  }
}

function selectBrand(brand) {
  markFormDirty();
  formBrandState = (formBrandState === brand) ? '' : brand;
  updateBrandUI();
}

function initBrand(brand) {
  formBrandState = brand ? String(brand).toLowerCase().trim() : '';
  updateBrandUI();
}

function updateBrandUI() {
  const orig = document.getElementById('imgOrigToggle');
  const perf = document.getElementById('imgPerfToggle');
  if (orig) orig.src = `https://lh3.googleusercontent.com/d/${formBrandState === 'originals' ? IMAGES.origTrue : IMAGES.origFalse}`;
  if (perf) perf.src = `https://lh3.googleusercontent.com/d/${formBrandState === 'performance' ? IMAGES.perfTrue : IMAGES.perfFalse}`;
}

function toggleResellingState() {
  markFormDirty();
  const newState = (formResellingState === 'TRUE') ? 'FALSE' : 'TRUE';
  setResellingState(newState);
}

function setResellingState(state) {
  formResellingState = state;
  const btn = document.getElementById('btnReselling');
  const txt = document.getElementById('txtReselling');
  const soldWrapper = document.getElementById('soldToggleWrapper');

  if (state === 'TRUE') {
    if (btn) btn.src = `https://lh3.googleusercontent.com/d/${IMAGES.resellingTrue}`;
    if (txt) txt.textContent = (formSoldState === 'TRUE') ? 'Resold' : 'Listed';
    if (soldWrapper) soldWrapper.classList.remove('dimmed');
  } else {
    if (btn) btn.src = `https://lh3.googleusercontent.com/d/${IMAGES.resellingFalse}`;
    if (txt) txt.textContent = 'Reselling?';
    if (soldWrapper) soldWrapper.classList.add('dimmed');
    
    if (formSoldState === 'TRUE') {
      setSoldState('FALSE');
    }
  }
}

function toggleSoldState() {
  if (formResellingState !== 'TRUE') return;
  markFormDirty();
  const newState = (formSoldState === 'TRUE') ? 'FALSE' : 'TRUE';
  setSoldState(newState);
}

function setSoldState(state) {
  formSoldState = state;
  const btn = document.getElementById('btnSold');
  const txt = document.getElementById('txtSold');
  const txtResell = document.getElementById('txtReselling');
  const saleInput = document.getElementById('mSalePrice');
  const saleGroup = document.getElementById('salePriceGroup');

  if (state === 'TRUE') {
    if (btn) btn.src = `https://lh3.googleusercontent.com/d/${IMAGES.soldTrue}`;
    if (txt) txt.textContent = 'SOLD!';
    if (txtResell && formResellingState === 'TRUE') txtResell.textContent = 'Resold';
    if (saleGroup) saleGroup.classList.remove('dimmed');
    if (saleInput) saleInput.disabled = false;
  } else {
    if (btn) btn.src = `https://lh3.googleusercontent.com/d/${IMAGES.soldFalse}`;
    if (txt) txt.textContent = 'SOLD?';
    if (txtResell && formResellingState === 'TRUE') txtResell.textContent = 'Listed';
    if (saleGroup) saleGroup.classList.add('dimmed');
    if (saleInput) {
      saleInput.disabled = true;
      saleInput.value = '';
    }
  }
}

function handleImage(input) {
  if (input.files && input.files[0]) {
    markFormDirty();
    const reader = new FileReader();
    reader.onload = function(e) {
      currentImageBase64 = e.target.result;
      document.getElementById('uploadPreview').style.backgroundImage = `url('${e.target.result}')`;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function editItem(id) {
  const item = allItems.find(i => i && String(i.id) === String(id));
  if (!item) return;

  currentEditId = item.id;
  isFormDirty = false;

  const rawCollect = item.collect ? String(item.collect).toLowerCase().trim() : '';
  const itemType = (rawCollect === 'wish') ? 'wish' : 'collect';
  
  setPageType(itemType);
  initBrand(item.brand || '');

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
  document.getElementById('mLining').value = item.lining || '';
  document.getElementById('mPurchasePrice').value = item.purchaseprice || '';
  document.getElementById('mSalePrice').value = item.saleprice || '';

  setResellingState(String(item.reselling).toUpperCase());
  setSoldState(String(item.sold).toUpperCase());

  document.getElementById('modalBg').style.display = 'flex';
}

function saveData() {
  if (isSaving) return;
  isSaving = true;

  const finalCollectValue = (formCollectState === 'wish') ? 'wish' : 'collect';

  const payload = {
    id: currentEditId,
    collect: finalCollectValue,
    brand: formBrandState,
    reselling: formResellingState,
    sold: formSoldState,
    articlenumber: document.getElementById('mArticle').value,
    name: document.getElementById('mName').value,
    category: document.getElementById('mCategory').value,
    size: document.getElementById('mSize').value,
    produced: document.getElementById('mProduced').value,
    madein: document.getElementById('mMadeIn').value,
    material: document.getElementById('mMaterial').value,
    lining: document.getElementById('mLining').value,
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
