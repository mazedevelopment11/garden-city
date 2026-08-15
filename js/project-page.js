// Garden City Properties — renders a single project detail page.
// The page shell (projects/<slug>.html) sets document.body.dataset.project = slug;
// this script looks that up in window.GARDEN_CITY_PROJECTS and fills in the DOM.

(() => {
  const slug = document.body.dataset.project;
  const data = window.GARDEN_CITY_PROJECTS && window.GARDEN_CITY_PROJECTS[slug];

  if (!data) {
    console.error(`No project data found for slug "${slug}"`);
    return;
  }

  document.title = `${data.name} — Garden City Properties`;

  document.querySelectorAll('[data-fill="name"]').forEach((el) => { el.textContent = data.name; });
  document.querySelectorAll('[data-fill="city"]').forEach((el) => { el.textContent = data.city; });

  const galleryImg = document.getElementById('galleryImg');
  if (galleryImg) {
    galleryImg.src = data.image;
    galleryImg.alt = data.name;
  }

  const descWrap = document.getElementById('projectDescription');
  if (descWrap) {
    descWrap.innerHTML = '';
    data.description.forEach((sentence) => {
      const p = document.createElement('p');
      p.textContent = sentence;
      descWrap.appendChild(p);
    });
  }

  const typesWrap = document.getElementById('typesGrid');
  if (typesWrap && data.types) {
    typesWrap.innerHTML = '';
    data.types.forEach((t) => {
      const card = document.createElement('div');
      card.className = 'type-card';
      card.innerHTML = `
        <span class="type-label">${t.label}</span>
        <strong class="type-beds">${t.beds}</strong>
        <span class="type-size">${t.size}</span>
      `;
      typesWrap.appendChild(card);
    });
  }

  // Populate the "other projects" strip, excluding the current project
  const otherWrap = document.getElementById('otherProjects');
  if (otherWrap) {
    otherWrap.innerHTML = '';
    Object.keys(window.GARDEN_CITY_PROJECTS)
      .filter((key) => key !== slug)
      .forEach((key) => {
        const p = window.GARDEN_CITY_PROJECTS[key];
        const a = document.createElement('a');
        a.href = `${key}.html`;
        a.className = 'other-project-card';
        a.innerHTML = `
          <span class="other-project-media" style="background-image:url('${p.image}')"></span>
          <span class="other-project-name">${p.name}</span>
        `;
        otherWrap.appendChild(a);
      });
  }
})();
