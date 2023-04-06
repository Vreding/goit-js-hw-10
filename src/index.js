import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const refs = {
  input: document.querySelector('#search-box'),
  countriesList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
const DEBOUNCE_DELAY = 300;

refs.input.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));

function onSearchInput(e) {
  refs.countriesList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
  const value = e.target.value.trim();
  if (!value) {
    return;
  }
  fetchCountries(value)
    .then(response => {
      if (response.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (response.length > 2) {
        const markup = createMarkupCountriesList(response);
        refs.countriesList.innerHTML = markup;
        return;
      }
      const markup = createMarkupCountry(response);
      refs.countryInfo.innerHTML = markup;
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function createMarkupCountriesList(array) {
  return array
    .map(
      ({ flags: { svg, alt }, name: { official: nameOfficial } }) => `
    <li class="country-item">
      <img class="country-img" src="${svg}" alt="${alt}" width="80" height="60">
      <p class="country-name">${nameOfficial}</p>
    </li>`
    )
    .join('');
}

function createMarkupCountry(array) {
  return array.map(
    ({
      flags: { svg, alt },
      name: { official: nameOfficial },
      capital,
      population,
      languages,
    }) =>
      `
      <img class="country-img" src="${svg}" alt="${alt}" width="250" height="150">
      <h2 class="country-name">${nameOfficial}</h2>
      <p class="country-prop">Capital: <span class="country-value">${capital}</span></p>
      <p class="country-prop">Population: <span class="country-value">${population}</span></p>
      <p class="country-prop">Languages: <span class="country-value">${Object.values(
        languages
      ).join(', ')}</span></p>
    `
  );
}
