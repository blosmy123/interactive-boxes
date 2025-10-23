// CORE interactions: select/expand card, keep inner selects functional, add-to-cart toast
const cards = Array.from(document.querySelectorAll('.card'));
const totalEl = document.getElementById('total');
const toast = document.getElementById('toast');
const addBtn = document.getElementById('addCartBtn');

let selectedCard = null;
let selectedPrice = 0;

// helper to clear selection
function clearSelected() {
  cards.forEach(c => {
    c.classList.remove('selected');
    const r = c.querySelector('.card-radio');
    if (r) r.checked = false;
  });
  selectedCard = null;
  selectedPrice = 0;
  totalEl.textContent = '$0.00 USD';
}

// select a card element (by element)
function selectCardElement(cardEl) {
  if (!cardEl) return;
  clearSelected();
  cardEl.classList.add('selected');
  const radio = cardEl.querySelector('.card-radio');
  if (radio) radio.checked = true;
  selectedCard = cardEl;
  selectedPrice = Number(cardEl.getAttribute('data-price')) || 0;
  totalEl.textContent = `$${selectedPrice.toFixed(2)} USD`;
}

// wire up clicks & keyboard
cards.forEach(card => {
  // click on card toggles selection
  card.addEventListener('click', function (ev) {
    // if click originated from a control that should not toggle (select element),
    // we still want selection but not special behavior — so do nothing special
    selectCardElement(card);
  });

  // keyboard selection: Enter or Space
  card.addEventListener('keydown', function (ev) {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      selectCardElement(card);
    }
  });

  // prevent clicks inside selects from bubbling and causing weird behavior
  const selects = card.querySelectorAll('select');
  selects.forEach(s => {
    s.addEventListener('click', function (ev) {
      ev.stopPropagation();
    });
    s.addEventListener('mousedown', function(ev){
      // ensure clicking open dropdown doesn't steal focus/close selection
      ev.stopPropagation();
    });
  });

  // stop the radio input click from bubbling twice
  const radio = card.querySelector('.card-radio');
  if (radio) {
    radio.addEventListener('click', function(e){
      e.stopPropagation();
      selectCardElement(card);
    });
  }
});

// Add to cart toast
addBtn.addEventListener('click', () => {
  if (!selectedCard) {
    // small inline UX: highlight briefly to show the user needs to select one
    alert('Please select a product first.');
    return;
  }

  // show toast
  toast.classList.add('show');
  // hide after 2s
  setTimeout(() => toast.classList.remove('show'), 2000);
});


