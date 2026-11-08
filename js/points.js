document.addEventListener('DOMContentLoaded', function () {
  
  const points = [
    { id: 1, name: 'Esil Green Hub', accepts: ['plastic', 'paper'], address: 'Esil district', hours: 'Mon–Sat 09:00–19:00', distance: 2.4 },
    { id: 2, name: 'Paper Loop Station', accepts: ['paper'], address: 'Saryarka district', hours: 'Mon–Fri 08:00–18:00', distance: 4.1 },
    { id: 3, name: 'Clear Glass Point', accepts: ['glass'], address: 'Almaty district', hours: 'Daily 10:00–20:00', distance: 3.3 },
    { id: 4, name: 'Charge & Return', accepts: ['battery', 'tech'], address: 'Esil district', hours: 'Mon–Sat 10:00–19:00', distance: 1.2 },
    { id: 5, name: 'Bottle Bank North', accepts: ['plastic', 'glass'], address: 'Saryarka district', hours: 'Daily 09:00–21:00', distance: 5.6 },
    { id: 6, name: 'E-Waste Corner', accepts: ['tech', 'battery'], address: 'Baikonur district', hours: 'Mon–Fri 10:00–18:00', distance: 6.8 },
    { id: 7, name: 'Green Box Central', accepts: ['plastic', 'paper', 'glass'], address: 'Almaty district', hours: 'Daily 08:00–20:00', distance: 0.9 },
    { id: 8, name: 'Plastic Cycle', accepts: ['plastic'], address: 'Baikonur district', hours: 'Tue–Sun 09:00–17:00', distance: 7.5 },
    { id: 9, name: 'Paper & Cardboard Yard', accepts: ['paper'], address: 'Esil district', hours: 'Mon–Sat 08:00–17:00', distance: 3.9 }
  ];
  const labels = { all: 'All materials', plastic: 'Plastic', paper: 'Paper', glass: 'Glass', battery: 'Batteries', tech: 'Electronics' };
  const mapQuery = { all: 'recycling points', plastic: 'plastic recycling', paper: 'paper recycling', glass: 'glass recycling', battery: 'battery recycling', tech: 'electronics recycling' };

  const list = document.getElementById('points-list');
  const chips = document.getElementById('chips');
  const search = document.getElementById('search-point');
  const sort = document.getElementById('sort-point');
  const count = document.getElementById('result-count');
  const map = document.getElementById('map');
  let type = 'all';


  function makeChips() {
    Object.keys(labels).forEach(function (key) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chip c-' + key;
      button.dataset.type = key;

      const dot = document.createElement('span');
      dot.className = 'chip-dot';
      dot.setAttribute('aria-hidden', 'true');
      button.append(dot, labels[key]);
      chips.appendChild(button);
    });
  }


  function getVisible() {
    const query = search.value.trim().toLowerCase();
    const result = points.filter(function (point) {
      const matchesType = type === 'all' || point.accepts.includes(type);
      const matchesText = point.name.toLowerCase().includes(query) || point.address.toLowerCase().includes(query);
      return matchesType && matchesText;
    });

    if (sort.value === 'distance') result.sort((a, b) => a.distance - b.distance);
    else if (sort.value === 'materials') result.sort((a, b) => b.accepts.length - a.accepts.length);
    else result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }


  function createCard(point) {
    const column = document.createElement('div');
    column.className = 'col-md-6 col-lg-4';
    const card = document.createElement('article');
    card.className = 'box point-card bc-' + point.accepts[0];

    const top = document.createElement('div');
    top.className = 'point-top';
    const number = document.createElement('span');
    number.textContent = 'POINT ' + String(point.id).padStart(2, '0');
    const distance = document.createElement('span');
    distance.textContent = point.distance.toFixed(1) + ' km';
    top.append(number, distance);

    const title = document.createElement('h3');
    title.textContent = point.name;
    const address = document.createElement('p');
    address.className = 'point-meta';
    address.textContent = point.address;
    const hours = document.createElement('p');
    hours.className = 'point-meta mb-4';
    hours.textContent = point.hours;

    const tags = document.createElement('div');
    tags.className = 'point-bottom';
    point.accepts.forEach(function (material) {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = labels[material];
      tags.appendChild(tag);
    });
    card.append(top, title, address, hours, tags);
    column.appendChild(card);
    return column;
  }
  function render() {
    const items = getVisible();
    list.replaceChildren();
    let totalKm = 0;
    for (const point of items) {
      list.appendChild(createCard(point));
      totalKm += point.distance;
    }

    if (items.length === 0) {
      const column = document.createElement('div');
      column.className = 'col-12';
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      const title = document.createElement('h3');
      title.textContent = 'No points found.';
      const message = document.createElement('p');
      message.textContent = 'Try another name or choose a different material.';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn btn-eco';
      button.textContent = 'Reset filters';
      button.addEventListener('click', reset);
      empty.append(title, message, button);
      column.appendChild(empty);
      list.appendChild(column);
      count.textContent = '0 of ' + points.length + ' sample points';
    } else {
      const average = totalKm / items.length;
      count.textContent = items.length + ' of ' + points.length + ' sample points · Average distance from centre: ' + average.toFixed(1) + ' km';
    }
  }

  function setType(key) {
    type = Object.keys(labels).includes(key) ? key : 'all';
    chips.querySelectorAll('.chip').forEach(function (chip) {
      const active = chip.dataset.type === type;
      chip.classList.toggle('active', active);
      chip.setAttribute('aria-pressed', String(active));
    });

    const url = 'https://www.google.com/maps?q=' + encodeURIComponent(mapQuery[type] + ' Astana');
    map.src = url + '&output=embed';
    document.getElementById('map-link').href = url;
    render();
  }

  function reset() {
    search.value = '';
    sort.value = 'name';
    setType('all');
    search.focus();
  }

  chips.addEventListener('click', function (event) {
    const button = event.target.closest('.chip');
    if (button) setType(button.dataset.type);
  });
  search.addEventListener('input', render);
  search.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') { search.value = ''; render(); }
  });
  sort.addEventListener('change', render);
  document.getElementById('reset-filters').addEventListener('click', reset);
  window.addEventListener('hashchange', function () { setType(location.hash.slice(1)); });

  makeChips();
  setType(location.hash.slice(1));
});
