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
    body: JSON.stringify(loginData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText); //Renvoie plusiseurs erreurs
      }
      return response.json();
    })
    .then((data) => {
      // Gérer la réponse du serveur après la connexion réussie
      console.log(data);

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


// Fonction pour créer la modale "post" avec les travaux récupérés depuis l'API
function createPostModal(works) {
  const imgPostFlex = document.querySelector(".img-post-flex");
  imgPostFlex.innerHTML = ""; // Efface les travaux existants

  works.forEach((work, index) => {
    if (work.imageUrl && work.imageUrl.trim() !== "" && work.imageUrl !== null) {
      const imgPostDetails = document.createElement("div");
      imgPostDetails.classList.add("img-post-details");

      const imageElement = document.createElement("img");
      imageElement.src = work.imageUrl;
      imageElement.classList.add("img-post");
      imgPostDetails.appendChild(imageElement);

      imgPostFlex.appendChild(imgPostDetails);

      const textPostImg = document.createElement("p");
      textPostImg.textContent = "éditer";
      imgPostDetails.appendChild(textPostImg);

      const rectangle = document.createElement("div");
      rectangle.classList.add("rectangle")
      imgPostDetails.appendChild(rectangle);

      rectangle.innerHTML = "<i class=\"fa-solid fa-arrows-up-down-left-right\"></i>";

      const rectangle1 = document.createElement("div");
      rectangle1.classList.add("rectangle1")
      imgPostDetails.appendChild(rectangle1);
      rectangle1.setAttribute("data-id", work.id); // Stocker l'ID du travail dans l'attribut "data-id"
      rectangle1.innerHTML = "<i class=\"fa-solid fa-trash-can\"></i>";

      rectangle1.addEventListener("click", () => {
        const workId = work.id;
        deleteWork(workId); // Appeler la fonction pour supprimer le travail côté serveur
      });
    }
  });

  modalContainer.style.display = "flex"; // Afficher la modale après avoir récupéré les travaux
}

// Fonction pour récupérer les travaux depuis l'API et afficher la modale "post"
function fetchAndDisplayPostModal() {
  fetch(worksUrl)
    .then((response) => response.json())
    .then((worksData) => {
      const imgPostWorks = worksData.filter((work) => work.imageUrl && work.imageUrl.trim() !== "" && work.imageUrl !== null);
      createPostModal(imgPostWorks);
    })
    .catch((error) => {
      console.error("Une erreur s'est produite lors de la récupération des travaux:", error);
    });
}

// Appel de la fonction pour récupérer les travaux et afficher la modale "post"
openModalBtn.addEventListener("click", () => {
  fetchAndDisplayPostModal();
});

closeModalBtn.addEventListener("click", () => {
  const modalContainer = document.querySelector(".post-modal");
  modalContainer.style.display = "none";
});


//DELETE
function deleteWork(workId) {
  fetch(`${worksUrl}/${workId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Suppression du travail échouée.");
      }
      return response.json();
    })
    .then(() => {
      // Si la suppression côté serveur réussit, mettre à jour l'interface utilisateur côté client
      const imgPostFlex = document.querySelector(".img-post-flex");
      const workToRemove = document.querySelector(`.img-post-details[data-id="${workId}"]`);
      imgPostFlex.removeChild(workToRemove);
    })
    .catch((error) => {
      console.error("Erreur lors de la suppression du travail :", error);
    });
}


//ADD
const openAddWorkModalBtn = document.querySelector(".add-work");
const addWorkModalContainer = document.querySelector(".add-work-modal");
const closeAddWorkModalBtn = document.querySelector(".modal-close-btn2");
const addWorkForm = document.getElementById("addWorkForm");


openAddWorkModalBtn.addEventListener("click", () => {
  addWorkModalContainer.style.display = "flex";
});

closeAddWorkModalBtn.addEventListener("click", () => {
  addWorkModalContainer.style.display = "none";
});

addWorkForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Empêcher la soumission par défaut du formulaire

  const workTitle = document.getElementById("workTitle").value;
  const workCatId = document.getElementById("workCat").value;
  const workImageInput = document.getElementById("workImageInput");
  const workImageFile = workImageInput.files[0];

  // Créer un nouvel objet FormData et y ajouter les données
  const formData = new FormData(); //créé une instance et donc réutilisable
  formData.append("title", workTitle);
  formData.append("category", workCatId);
  formData.append("image", workImageFile);

  // Envoyer l'objet FormData au backend en utilisant l'API fetch
  fetch(worksUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData, // Utiliser l'objet FormData comme corps de la requête
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Ajout d'un nouveau travail échoué.");
      }
      return response.json();
    })
    .then((newWork) => {
      // Si l'ajout côté serveur réussit, mettez à jour l'interface utilisateur côté client
      works.push(newWork);
      displayWorks(works);
      addWorkModalContainer.style.display = "none"; // Fermer la modale après l'ajout
      // Réinitialiser le formulaire après l'ajout
      addWorkForm.reset();
      previewImage.src = "";
      previewImage.style.display = "none";
    })
    .catch((error) => {
      console.error("Erreur lors de l'ajout d'un nouveau travail :", error);
    });
});




const workImageInput = document.getElementById("workImageInput");
const previewImage = document.getElementById("previewImage");

// Afficher l'aperçu de l'image lorsqu'elle est sélectionnée
workImageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      previewImage.src = reader.result;
      previewImage.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    previewImage.src = "";
    previewImage.style.display = "none";
  }
});

// Soumettre le formulaire
addWorkForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Empêche la soumission par défaut du formulaire

  const workTitle = document.getElementById("workTitle").value;
  const workCatId = document.getElementById("workCat").value;
  const workImage = previewImage.src; // Utiliser l'URL de l'image sélectionnée

  // Créer un nouvel objet workData avec les valeurs saisies
  const workData = {
    title: workTitle,
    category: {
      name: workCatId
    },
    imageUrl: workImage,
  };

  // Envoyer le nouvel objet workData à l'API pour ajouter un nouveau travail
  fetch(worksUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Ajout d'un nouveau travail échoué.");
      }
      return response.json();
    })
    .then((newWork) => {
      // Si l'ajout côté serveur réussit, met à jour l'interface utilisateur côté client
      works.push(newWork);
      displayWorks(works);
      addWorkModalContainer.style.display = "none"; // Fermer la modale après l'ajout
      // Réinitialiser le formulaire après l'ajout
      addWorkForm.reset(); //(pour formulaire)
      previewImage.src = "";
      previewImage.style.display = "none";
    })
    .catch((error) => {
      console.error("Erreur lors de l'ajout d'un nouveau travail :", error);
    });
});