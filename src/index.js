import { fetchBreeds } from './cat-api';
import { fetchCatByBreed } from './cat-api';
import 'slim-select/dist/slimselect.css';
import SlimSelect from 'slim-select';
import Notiflix from 'notiflix';

const selectBreed = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const errorParagraph = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');
errorParagraph.classList.add('hidden');
selectBreed.style.width = '360px';

loader.classList.add('loading');
selectBreed.classList.add('hidden');
catInfo.classList.add('hidden');
selectBreed.addEventListener('change', handleSelect);
fetchBreeds().then(breeds => {
  const options = breeds.map(breed => {
    return { value: breed.id, text: breed.name };
  });
  new SlimSelect({
    select: selectBreed,
    data: options,
  });
  selectBreed.classList.remove('hidden');
});
function handleSelect(e) {
  const breedId = e.target.value;
  fetchCatByBreed(breedId)
    .then(res => {
      const markup = res
        .map(breeds => {
          const breed = breeds.breeds[0];
          return breedMarkup({ breed, breedId, breeds });
        })
        .join('');
      catInfo.classList.remove('hidden');
      addMarkup(markup, catInfo);
    })
    .catch(error => {
      errorParagraph.classList.remove('hidden');
      Notiflix.Notify.failure(error.message);
    })
    .finally(() => {
      loader.classList.remove('loading');
    });
}
function addMarkup(markup, element) {
  element.innerHTML = markup;
}
function breedMarkup({ breed, breedId, breeds }) {
  return `<div class="cat-image">
    <img src="${breeds.url}" alt="${breedId}" id="cat-image" width=360 style="margin-top:20px"/>
  </div>
  <div class="cat-details">
    <h2 id="breed-name">${breed.name}</h2>
    <p id="breed-description">${breed.description}</p>
    <p id="breed-temperament">${breed.temperament}</p>
  </div>`;
}
