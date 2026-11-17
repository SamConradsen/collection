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

  // Opret én samlet kontinuerlig grid-container for alle varer/kategorier
  const globalGrid = document.createElement('div');
  globalGrid.className = 'item-grid';

  sortedCats.forEach((cat) => {
    const safeCatId = encodeURIComponent(cat);

    // Tilføj kategori-bubbel til sidebar-navigationen
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

    // 1. Opret kategori-titel elementet som spænder over hele rækken i griddet
    const title = document.createElement('h2');
    title.className = 'category-title-grid';
    title.id = `cat-${safeCatId}`;
    title.textContent = cat;
    globalGrid.appendChild(title);

    // 2. Tilføj alle varer under denne kategori ind i det samme fælles grid
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
        const uniqueSeed = `${item.id || '_'}_${item.articlenumber || ''}_${item.name || ''}`;
        const badgeCanvas = renderDynamicSizeBubbleCanvas(item.size, true, 40, uniqueSeed);
        badgeCanvas.className = 'size-badge-canvas';
        card.querySelector('.image-wrapper').appendChild(badgeCanvas);
      }

      globalGrid.appendChild(card);
    });
  });

  contentArea.appendChild(globalGrid);

  if (alphabetNav && sortedCats.length > 0 && window.innerWidth <= 600) {
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
