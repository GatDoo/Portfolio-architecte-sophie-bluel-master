const apiUrl = "http://localhost:5678/api";
const worksUrl = `${apiUrl}/works`;
const categoriesUrl = `${apiUrl}/categories`;

let works; // Variable pour stocker les travaux

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
    .then((worksData) => {
      works = worksData; // Stocke les travaux dans la variable globale
      displayWorks(works);
    })
    .catch((error) => {
      console.error("Une erreur s'est produite lors de la récupération des travaux:", error);
    });
}

// Fonction pour récupérer tous les travaux depuis l'API
function fetchAllWorks() {
  fetch(worksUrl)
    .then((response) => response.json())
    .then((worksData) => {
      works = worksData; // Stocke les travaux dans la variable globale
      displayWorks(works);
    })
    .catch((error) => {
      console.error("Une erreur s'est produite lors de la récupération des travaux:", error);
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
          const categoryId = category.id;
          const filteredWorks = works.filter((work) => work.category.id === categoryId);
          displayWorks(filteredWorks);
        });
      });

      // Appel de la fonction pour récupérer tous les travaux une fois que les catégories sont chargées
      fetchAllWorks();
    })
    .catch((error) => {
      console.error("Une erreur s'est produite lors de la récupération des catégories:", error);
    });
}

// Appel de la fonction pour récupérer les catégories disponibles
fetchCategories(categoriesUrl);

// Fenêtre Login
const loginLink = document.getElementById("login");
const modal = document.querySelector(".modal");
const closeBtn = document.querySelector(".close-btn");

loginLink.addEventListener("click", () => {
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Intégration module Log In
const loginForm = document.querySelector(".login-input");
const errorMessage = document.querySelector(".error-message");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Empêche la soumission par défaut du formulaire

  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const loginData = {
    email: email,
    password: password,
  };

  fetch(`${apiUrl}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      // Gérer la réponse du serveur après la connexion réussie
      console.log(data);
      // Vous pouvez ajouter ici une logique pour gérer la réponse du serveur et rediriger l'utilisateur vers une autre page ou effectuer d'autres actions

      // Vérifier si la réponse contient l'identifiant de l'utilisateur et le token
      if (data.userId && data.token) {
        // Stocker les informations de connexion dans le stockage local
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("token", data.token);

        // Rediriger vers la page d'accueil (index.html)
        window.location.href = "index.html";
      }
    })
    .catch((error) => {
      // Afficher le carré rouge avec le message d'erreur
      errorMessage.innerHTML = "Erreur de connexion. Veuillez réessayer.";
      errorMessage.classList.add("error");
      console.error("Une erreur s'est produite lors de la connexion:", error);
    });
});

// Vérifier si l'utilisateur est déjà connecté
const userId = localStorage.getItem("userId");
const token = localStorage.getItem("token");

if (token) {
  // Afficher le lien "Poster"
  const postLink = document.getElementById("post");
  postLink.style.display = "block";
}

// Modale Post
const openModalBtn = document.getElementById("post");
const modalContainer = document.querySelector(".post-modal");
const closeModalBtn = document.querySelector(".modal-close-btn");

openModalBtn.addEventListener("click", () => {
  modalContainer.style.display = "flex";
});

closeModalBtn.addEventListener("click", () => {
  modalContainer.style.display = "none";
});
