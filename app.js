const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwUo7SdjykTdMeSnEtyAxIknuYfsx8n3PSCXJUIvYeJVbRXqbAnFTCcpMfgLSYKNUShZA/exec";

let allItems = [];
let showSold = false;
let searchQuery = "";
let currentImageBase64 = null;
let currentEditId = null;
let isSaving = false;

// Google Drive Image IDs fra din liste
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

// Size menu data struktur med TRUE/FALSE ID'er
const SIZE_DATA = [
  {
    title: "1RZTZy5SkaYhentzK95PtHLfTLrry588t", // Women's
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
    title: "13FX
