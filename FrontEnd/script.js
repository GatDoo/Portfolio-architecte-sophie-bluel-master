const apiUrl = "http://localhost:5678/api";
const worksUrl = `${apiUrl}/works`;
const categoriesUrl = `${apiUrl}/categories`;

// Fonction pour créer un élément de travail dans la galerie
function createWorkElement(work) {
  const workElement = document.createElement("div");
  workElement.classList.add("work");

  const imageElement = document.createElement("img");
  imageElement.src = work.imageUrl;
  workElement.appendChild(imageElement);

  const titleElement = document.createElement("h2");
  titleElement.innerText = work.title;
  workElement.appendChild(titleElement);

  // ... Ajoutez les autres éléments nécessaires pour afficher les informations du travail

  return workElement;
}

// Fonction pour afficher les travaux dans la galerie
function displayWorks(works) {
  const galleryContainer = document.querySelector(".gallery.articles");
  galleryContainer.innerHTML = "";

  works.forEach((work) => {
    const workElement = createWorkElement(work);
    galleryContainer.appendChild(workElement);
  });
}

// Fonction pour récupérer les travaux filtrés à partir de l'API
function fetchWorks(url) {
  fetch(url)
    .then((response) => response.json())
    .then((works) => {
      displayWorks(works);
    })
    .catch((error) => {
      console.error(
        "Une erreur s'est produite lors de la récupération des travaux:",
        error
      );
    });
}

// Fonction pour récupérer tous les travaux depuis l'API
function fetchAllWorks() {
  fetch(worksUrl)
    .then((response) => response.json())
    .then((works) => {
      displayWorks(works);
    })
    .catch((error) => {
      console.error(
        "Une erreur s'est produite lors de la récupération des travaux:",
        error
      );
    });
}

// Fonction pour récupérer les catégories disponibles depuis l'API
function fetchCategories(url) {
  fetch(url)
    .then((response) => response.json())
    .then((categories) => {
      const filtersContainer = document.querySelector(".filtres");
      filtersContainer.innerHTML = ""; // Efface les filtres existants

      categories.forEach((category) => {
        const filterButton = document.createElement("button");
        filterButton.classList.add("filtre");
        filterButton.setAttribute("data-category-id", category.id);
        filterButton.innerHTML = `<p>${category.name}</p>`;
        filtersContainer.appendChild(filterButton);

        filterButton.addEventListener("click", () => {
          const categoryId = filterButton.getAttribute("data-category-id");
          const worksUrlWithCategory = `${worksUrl}?categoryId=${categoryId}`;
          fetchWorks(worksUrlWithCategory);
        });
      });

      // Appel de la fonction pour récupérer tous les travaux une fois que les catégories sont chargées
      fetchAllWorks();
    })
    .catch((error) => {
      console.error(
        "Une erreur s'est produite lors de la récupération des catégories:",
        error
      );
    });
}

// Appel de la fonction pour récupérer les catégories disponibles
fetchCategories(categoriesUrl);
