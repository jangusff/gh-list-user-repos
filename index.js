'use strict';

const searchURL = 'https://api.github.com/users/@@hndl@@/repos';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson, maxResults) {
  // if there are previous results, remove them
  $('#results-list').empty();
  // iterate through array, stopping at the max number of results
  for (let i = 0; i < responseJson.length & i<maxResults ; i++){
    // For each object in the array, add a list item to the results. 
    // List the repository name and corresponding URL.
    $('#results-list').append(
      `<li><p>Repo Name: <span>${responseJson[i].name}</span></p>
      <h3><a href="${responseJson[i].html_url}">Click to visit this repository</a></h3>
      </li>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
};

function getRepos(userHandle, maxResults=10) {
  const params = {
    type: "all",
    sort: "full_name",
    direction: "asc"
  };
  const regexHndl2Replace = /@@hndl@@/i;
  const queryString = formatQueryParams(params)
  const url = searchURL.replace(regexHndl2Replace, userHandle) + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
  });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-github-handle').val();
    const maxResults = $('#js-max-results').val();
    getRepos(searchTerm, maxResults);
  });
}

$(watchForm);