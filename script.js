document.addEventListener('DOMContentLoaded', () => {
  const getAllCharactersButton = document.getElementById('getAllCharacters');
  const filterForm = document.getElementById('filterForm');
  const characterList = document.getElementById('characterList');

  const API_URL = 'https://rickandmortyapi.com/api/character';

  // Maneja el evento de obtener todos los personajes
  getAllCharactersButton.addEventListener('click', async () => {
      try {
          const response = await fetch(API_URL);
          if (!response.ok) throw new Error('Failed to fetch characters');
          const data = await response.json();
          renderCharacters(data.results);
      } catch (error) {
          showError('Failed to fetch characters');
      }
  });

  // Maneja el evento de filtrar personajes
  filterForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(filterForm);
      const query = new URLSearchParams(formData).toString();
      try {
          const response = await fetch(`${API_URL}/?${query}`);
          if (!response.ok) throw new Error('Failed to fetch filtered characters');
          const data = await response.json();
          renderCharacters(data.results);
      } catch (error) {
          showError('Failed to fetch filtered characters');
      }
  });

  // Cargar opciones para los dropdowns desde la API
  async function loadDropdownOptions() {
      try {
          const response = await fetch(API_URL);
          if (!response.ok) throw new Error('Failed to fetch character data');
          const data = await response.json();

          // Obtener nombres únicos para el dropdown de names
          const namesSet = new Set(data.results.map(character => character.name));
          const namesSelect = document.getElementById('name');
          namesSet.forEach(name => {
              const option = document.createElement('option');
              option.value = name;
              namesSelect.appendChild(option);
          });

          // Obtener especies únicas para el dropdown de species
          const speciesSet = new Set(data.results.map(character => character.species));
          const speciesSelect = document.getElementById('species');
          speciesSet.forEach(species => {
              const option = document.createElement('option');
              option.value = species;
              speciesSelect.appendChild(option);
          });

          // Obtener tipos únicos para el dropdown de types
          const typesSet = new Set(data.results.map(character => character.type));
          const typesSelect = document.getElementById('type');
          typesSet.forEach(type => {
              const option = document.createElement('option');
              option.value = type;
              typesSelect.appendChild(option);
          });

      } catch (error) {
          console.error('Failed to load dropdown options', error);
      }
  }

  loadDropdownOptions();

  // Función para renderizar personajes
  function renderCharacters(characters) {
      characterList.innerHTML = '';
      if (characters.length === 0) {
          characterList.innerHTML = '<p>No characters found</p>';
          return;
      }
      characters.forEach(character => {
          const characterElement = document.createElement('div');
          characterElement.className = 'character';
          characterElement.innerHTML = `
              <img src="${character.image}" alt="${character.name}">
              <h3>${character.name}</h3>
              <p>Status: ${character.status}</p>
              <p>Species: ${character.species}</p>
              <p>Gender: ${character.gender}</p>
          `;
          characterList.appendChild(characterElement);
      });
  }

  // Función para mostrar errores
  function showError(message) {
      characterList.innerHTML = `<p>${message}</p>`;
  }
});
