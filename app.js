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

  soldFalse: "1K9HrpK2swbPdadOZPbrPVT3-V7k7bwCK",
  soldTrue: "1vETS8eyAKpPjy89FdnPhRyh70Jw9whoK",

  moveWish: "1XsICtNKjWCBHymS1GHLmU-zh8LCk0f5a",
  moveCollect: "1G6bh59wDqrV1XJ8tIZsDJniycS4BHwZ_",

  showSoldOff: "1B65f2Et5kHbFkxHI8Q6cN3Uva6Ls0EKZ",
  showSoldOn: "19wTkumBvqWSzhakI3TRw6ACWI0jl2YCG",
  
  iconPurchasePrice: "1pXAS0b2IK1Z81StPX8XjWdkUli2hlz_L",
  iconSalePrice: "1Yu_Lil2oFqOlkPmjOwcmu7iL4nCMcVxI",
  iconProduced: "1ij4Ek7JOZ956BKEObfNPiQUkQRFSTVBY",

  titleWomens: "1wVjPm2JnH3qFR2A51le5mgsPfGEx_bDr",
  titleMens: "1FZvtiQzeDmPki0rl8e0oghjUt-vH13WN",
  titleFootwear: "1tc7sTYRoi5CS7788eTezlKtMawesYidv",
  titleHeadwear: "1f_c7F_RwTZw3qK9dhlqyCepYOFmLGDEM",
  titleOther: "1DX0MkbLgzYaT1w6QwDjh5DeinyGxb3go"
};

const BUBBLE_POOL = [
  { on: "18V3bOgkpHGlp-fFcVFJHuNNo8jCNw4LL", off: "1pkKSSyo0tbHDQmeAaoUS68ElJ2Jhd9ET" },
  { on: "1ZMlmib2UXIWF9c__7Nu-EqRcooLylicb", off: "1sEfR1M1Vp1orAeZxiDH3VokM0y_SaEeY" },
  { on: "1Wzo1zKsOrIU5J8j13ium8a_eZ9-mmOtx", off: "1Gl131d3_nC3SIynCCtC74PWVIe0nrGir" },
  { on: "1uIfxgxAMAEuDiPeCaUOl57Le7pK5dGWT", off: "1aTc32NKICNVQUHKJly85Ndv8aZ95Ghq3" },
  { on: "16ZHHEoqaCx0SMnK-MEdtZAmSnYfjv2Wd", off: "1qHGZX5TwaMOYtwbaePE7Aa8Twk3OQWvJ" },
  { on: "1tRm8jsYtmUziULmdS1q98IcMK8Xo4Xjq", off: "19JyfAfNbmiXsNXcwo7UyBo3NR0hX6yKE" },
  { on: "1oiswxXbQsL5RDvsBrW1TtczEhvmqAwFp", off: "1s4fTbbDLv_LJY-yaoe5ubldkRlMOTKm5" },
  { on: "1adzOgZa1M8OU0xvC7X2eMkWxEq9PiYh-", off: "1XRvel_Cd3YIhDs7veUyMBq2IsxR462CR" },
  { on: "1gMDiy7x60TLmyAswSGmG3odBA54WI1w4", off: "12a0Xd7D_PUXNSM7BO_yRyc9rwTpVXua1" },
  { on: "1gCyqkr2qP_olXaaVuvCZ4NsDMx3Ln2MD", off: "1JYq9OV2DINTs2d_7Ch4RC6dRDIYznOnV" },
  { on: "1GodcEgj1FdJeMUkgTRKD2O2nlyzu0vTr", off: "16OujFERmv8a_AixsUMdWxgtCGqaU2lI4" },
  { on: "1ajrg3nq1dpGA334MgW04iYRbPYQlZ0-3", off: "1gZW-XlkBdVNMLb9Z8yEEeDX0ZPbXFF_K" },
  { on: "1mPc4jKFtGS0eWnU6x-thW3LHpuQZcIDr", off: "1lR0GBIDDyCeIYrVOIbMyOtWZHDXyQ4TK" },
  { on: "1YlcPKCN_dq_ddQhb8rH1K3Ji0ChTMoIr", off: "1rufTPPPm3Yvzh49bhBhvLv45-NcFhlOc" },
  { on: "1fYCNnZS76348yrKfAK_3X9KgIcYEvG7a", off: "1bQ34d2kP-QFz2rNmWhF5UOrNemwPzB_7" },
  { on: "1l42K24GwlDMxSIhoIeSWO6yCY-XG38jP", off: "1RNwSAdOzwaEWGR57qSMydY77cJlmTMp1" },
  { on: "1apVWju7a3NTvFBt9VQ1Jrv8ldpsruWsQ", off: "1SsxxfvLaGvvLMZqI0uz4PqldtkG_Cchw" },
  { on: "1ww6UXnYh9865-kEYrlYP-laNtM7iwcCv", off: "1PhBcrs90GYw8mNQDBbDC0envfCi-ool6" },
  { on: "17Mwesxav8zD2AR3umu-xWNUDfjXurahB", off: "1qxyMd-qQJ9nAnn2avJeFzJZVt29qdyDv" },
  { on: "1hSI6Z01L5n3LsvZOxFHI2xuBjhNV6P_8", off: "1veq6e0u7CK803no3Fr8fZ8-kmILHcbdX" },
  { on: "1i-VkvED22ru-DmUFV2svhqqbj3PIsOjr", off: "1rwOhdjENReR3fJQaFpJR4GoGrFTW1SIS" },
  { on: "1CQ55OXxE7wRcaKsARRNgzTvUvQAEm7pA", off: "1ovl4ruHjf9VqKnKPx0wN6DcM5vePvYoP" },
  { on: "1F67Ka5frutFnwiFoHPPPJ6CiPyMiEemO", off: "1Yu6f7T4EK1qqu7TZqjsbVDcKUJI7QpUM" },
  { on: "1qATXW5iUluj3ZSC4tNgj8c2gvf7qmEmH", off: "1qfxsEa3iFAWmqFp5AvvOWhjk" },
  { on: "1dXO7MrbLa__c5_tBxxBVDCMvq4yluVu_", off: "184TXG10iz7iEhLOz32qZtA3AYnQkOjx9" },
  { on: "1ZtXnmvwXZJHSrWX7VPGPDqRVSIgsN1ex", off: "1brODnN1-Lqtpg12qNKHs1HPR1ar-LemJ" },
  { on: "1iEp6ckPiMLfxrXBY_cLhevhVYU3T7L4c", off: "188Uo2UMz_rP8YY5gOS-3vsVdB-cJO8Cv" },
  { on: "1IWWuErWK-CwcFfqbXtpytmG6c36eXHaR", off: "1ekEKVuW7HFpnoQhP4hv2D0X3QDG7luyq" }
];

const SIZE_CATEGORIES = [
  {
    titleId: IMAGES.titleWomens,
    name: "Women's",
    sizes: [
      { key: "EU26", l1: "2XS", s1: 32, c1: "#4C6BF5", b1: "#2241C9", l2: "26", s2: 40, c2: "#FC6A96", b2: "#F22E69", lead: 32 },
      { key: "EU2628", l1: "2XS", s1: 32, c1: "#F77CA1", b1: "#F77CA1", l2: "26-28", s2: 40, c2: "#FF477E", b2: "#D63031", lead: 32 },
      { key: "EU28", l1: "2XS", s1: 32, c1: "#F77CA1", b1: "#F77CA1", l2: "28", s2: 40, c2: "#FF477E", b2: "#D63031", lead: 32 },
      { key: "EU30", l1: "XS", s1: 32, c1: "#F77CA1", b1: "#F77CA1", l2: "30", s2: 40, c2: "#FF477E", b2: "#D63031", lead: 32 },
      { key: "EU3032", l1: "XS", s1: 32, c1: "#F77CA1", b1: "#F77CA1", l2: "30-32", s2: 40, c2: "#FF477E", b2: "#D63031", lead: 32 },
      { key: "EU32", l1: "XS", s1: 32, c1: "#F77CA1", b1: "#F77CA1", l2: "32", s2: 40, c2: "#FF477E", b2: "#D63031", lead: 32 },
      { key: "EU34", l1: "S", s1: 32, c1: "#F77CA1", b1: "#F77CA1", l2: "34", s2: 40, c2: "#FF477E", b2: "#D63031", lead: 32 },
      { key: "EU3436", l1: "S", s1: 32, c1: "#FF477E", b1: "#D63031", l2: "34-36", s2: 40, c2: "#FF477E", b2: "#D63031", lead: 32 },
      { key: "EU36", l1: "S", s1: 32, c1: "#FF477E", b1: "#D63031", l2: "36", s2: 40, c2: "#FF477E", b2: "#D63031", lead: 32 },
      { key: "EU38", l1: "M", s1: 32, c1: "#4C6BF5", b1: "#2241C9", l2: "38", s2: 40, c2: "#FC6A96", b2: "#F22E69", lead: 32 },
      { key: "EU3840", l1: "M", s1: 32, c1: "#FF477E", b1: "#2241C9", l2: "38-40", s2: 40, c2: "#FF477E", b2: "#F22E69", lead: 32 },
      { key: "EU40", l1: "M", s1: 32, c1: "#4C6BF5", b1: "#2241C9", l2: "40", s2: 40, c2: "#FC6A96", b2: "#F22E69", lead: 32 },
      { key: "EU42", l1: "L", s1: 32, c1: "#FF477E", b1: "#D63031", l2: "42", s2: 40, c2: "#FF477E", b2: "#D63031", lead: 32 },
      { key: "EU4244", l1: "L", s1: 32, c1: "#FF477E", b1: "#D63031", l2: "42-44", s2: 40, c2: "#FF477E", b2: "#D63031", lead: 32 },
      { key: "EU44", l1: "L", s1: 32, c1: "#FF477E", b1: "#D63031", l2: "44", s2: 40, c2: "#FF477E", b2: "#D63031", lead: 32 },
      { key: "EU46", l1: "XL", s1: 32, c1: "#FF477E", b1: "#D63031", l2: "46", s2: 40, c2: "#FF477E", b2: "#D63031", lead: 32 },
      { key: "EU4648", l1: "XL", s1: 32, c1: "#FF477E", b1: "#D63031", l2: "46-48", s2: 40, c2: "#FF477E", b2: "#D63031", lead: 32 },
      { key: "EU48", l1: "XL", s1: 32, c1: "#FF477E", b1: "#D63031", l2: "48", s2: 40, c2: "#FF477E", b2: "#D63031", lead: 32 }
    ]
  },
  {
    titleId: IMAGES.titleMens,
    name: "Men's",
    sizes: [
      { key: "XS", l1: "XS", s1: 60, c1: "#728AF7", b1: "#728AF7" },
      { key: "S", l1: "S", s1: 60, c1: "#728AF7", b1: "#728AF7" },
      { key: "M", l1: "M", s1: 60, c1: "#728AF7", b1: "#728AF7" },
      { key: "L", l1: "L", s1: 60, c1: "#728AF7", b1: "#728AF7" },
      { key: "XL", l1: "XL", s1: 60, c1: "#728AF7", b1: "#728AF7" },
      { key: "2XL", l1: "2XL", s1: 60, c1: "#728AF7", b1: "#728AF7" }
    ]
  },
  {
    titleId: IMAGES.titleFootwear,
    name: "Footwear",
    sizes: [
      { key: "40", l1: "40", s1: 40, c1: "#319F00", b1: "#0D4C00" },
      { key: "40 1/2", l1: "40½", s1: 40, c1: "#319F00", b1: "#0D4C00" },
      { key: "40 2/3", l1: "40⅔", s1: 40, c1: "#319F00", b1: "#0D4C00" },
      { key: "39-42", l1: "39-42", s1: 40, c1: "#319F00", b1: "#0D4C00" },
      { key: "40-42", l1: "40-42", s1: 40, c1: "#319F00", b1: "#0D4C00" }
    ]
  },
  {
    titleId: IMAGES.titleHeadwear,
    name: "Headwear",
    sizes: [
      { key: "OSFA", l1: "OSFA", s1: 35, c1: "#4344C1", b1: "#2C17DD" },
      { key: "OSFW", l1: "OSFW", s1: 35, c1: "#4344C1", b1: "#2C17DD" },
      { key: "OSFM", l1: "OSFM", s1: 35, c1: "#4344C1", b1: "#2C17DD" },
      { key: "S/M", l1: "S/M", s1: 35, c1: "#4344C1", b1: "#2C17DD" },
      { key: "L/XL", l1: "L/XL", s1: 35, c1: "#4344C1", b1: "#2C17DD" }
    ]
  },
  {
    titleId: IMAGES.titleOther,
    name: "Other",
    sizes: [
      { key: "Onesize", l1: "Onesize", s1: 28, c1: "#FF9E0E", b1: "#8F4600" },
      { key: "Unisex XS", l1: "Unisex", s1: 16, c1: "#000000", l2: "XS", s2: 64, grad: ["#FF0024", "#0E1DDD"], lead: 48 },
      { key: "Unisex S", l1: "Unisex", s1: 16, c1: "#000000", l2: "S", s2: 64, grad: ["#FF0024", "#0E1DDD"], lead: 48 },
      { key: "Unisex M", l1: "Unisex", s1: 16, c1: "#000000", l2: "M", s2: 64, grad: ["#FF0024", "#0E1DDD"], lead: 48 },
      { key: "Unisex L", l1: "Unisex", s1: 16, c1: "#000000", l2: "L", s2: 64, grad: ["#FF0024", "#0E1DDD"], lead: 48 },
      { key: "Unisex XL", l1: "Unisex", s1: 16, c1: "#000000", l2: "XL", s2: 64, grad: ["#FF0024", "#0E1DDD"], lead: 48 },
      { key: "29\"", l1: "29\"", s1: 30, c1: "#DE540E", b1: "#CF251E" },
      { key: "32\"/32\"", l1: "32\"/32", s1: 30, c1: "#DE540E", b1: "#CF251E" }
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

// CANVAS RENDERING MED VENSTRE-TIL-HØJRE GRADIENT OG SARTIKE PINK / RENE FARVER
function renderDynamicSizeBubbleCanvas(sizeKey, isSelected, targetPx) {
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

  const bubbleData = getRandomBubble(sizeKey);
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

      if (gradColors && gradColors.length >= 2) {
        // GRADIENT FRA VENSTRE TIL HØJRE (X-AKSEN)
        const gradient = ctx.createLinearGradient(0, 0, targetPx, 0);
        gradient.addColorStop(0, gradColors[0]);
        gradient.addColorStop(1, gradColors[1]);
        ctx.fillStyle = gradient;
      } else if (isUnisexTop) {
        ctx.fillStyle = "#000000"; // UNISEX OVERSTE LINJE SKAL VÆRE SORT
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
      
      const isUnisexTop = (sizeObj.l1 === "Unisex");
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
      <img src="https://lh3.googleusercontent.com/d/1V2GovFhIyQNeToWVriLnLizmC295PoxL" onclick="selectAllSizes(true)" alt="ON">
      <img src="https://lh3.googleusercontent.com/d/18sFkDxQEW3oa79aSI-sWZLi5oSoEWOuZ" onclick="selectAllSizes(false)" alt="OFF">
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

function selectAllSizes(status) {
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

      const isSold = String(item.sold).toUpperCase() === 'TRUE';
      const bgUrl = item.imageid ? `https://lh3.googleusercontent.com/d/${item.imageid}` : '';
      const brandText = String(item.brand).toLowerCase() === 'performance' ? 'adidas Performance' : 'adidas Originals';
      
      const purchaseFormatted = formatDanishPrice(item.purchaseprice);
      const saleFormatted = formatDanishPrice(item.saleprice);

      const hasMadeIn = item.madein && String(item.madein).trim() !== '';
      const hasProduced = item.produced && String(item.produced).trim() !== '';
      const hasPurchase = item.purchaseprice && String(item.purchaseprice).trim() !== '';
      const hasSale = isSold && item.saleprice && String(item.saleprice).trim() !== '';

      card.innerHTML = `
        <div class="image-wrapper" style="background-image: url('${bgUrl}');">
          ${isSold ? '<div class="sold-overlay"></div>' : ''}
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
        const badgeCanvas = renderDynamicSizeBubbleCanvas(item.size, true, 40);
        badgeCanvas.className = 'size-badge-canvas';
        card.querySelector('.image-wrapper').appendChild(badgeCanvas);
      }

      grid.appendChild(card);
    });

    section.appendChild(grid);
    contentArea.appendChild(section);
  });

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
  setSoldState('FALSE');

  ['mArticle', 'mName', 'mCategory', 'mSize', 'mProduced', 'mMadeIn', 'mMaterial', 'mPurchasePrice', 'mSalePrice'].forEach(id => {
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

function toggleSoldState() {
  markFormDirty();
  setSoldState(formSoldState === 'TRUE' ? 'FALSE' : 'TRUE');
}

function setSoldState(state) {
  formSoldState = state;
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

  const finalCollectValue = (formCollectState === 'wish') ? 'wish' : 'collect';

  const payload = {
    id: currentEditId,
    collect: finalCollectValue,
    brand: formBrandState,
    sold: formSoldState,
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
