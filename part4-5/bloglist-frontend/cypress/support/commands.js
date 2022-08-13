Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3003/api/login', {
    username,
    password,
  }).then(({ body }) => {
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(body))
  })
})
