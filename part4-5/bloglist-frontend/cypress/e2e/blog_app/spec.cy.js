describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen',
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
  })

  it('Login form is shown', function () {
    cy.visit('http://localhost:3000')
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
  })

  it('succeeds with correct credentials', function () {
    cy.visit('http://localhost:3000')
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('salainen')
    cy.get('#login-button').click()

    cy.contains('Matti Luukkainen logged in')
  })

  it('fails with wrong credentials', function () {
    cy.visit('http://localhost:3000')
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.get('.error').should('contain', 'wrong username or password')
    cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    cy.get('.error').should('have.css', 'border-style', 'solid')
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'mluukkai', password: 'salainen' }).then(() => {
        let userInStorage = JSON.parse(
          window.localStorage.getItem('loggedBlogappUser')
        )
        cy.request({
          method: 'POST',
          url: 'http://localhost:3003/api/blogs',
          body: {
            title: 'My title',
            author: 'Angelina Jolie',
            url: 'www.jolie.com',
          },
          headers: { Authorization: `bearer ${userInStorage.token}` },
        })
      })
      cy.visit('http://localhost:3000')
    })

    it('A blog can be created', function () {
      cy.contains('create new').click()
      cy.get('#title').type('A new blog')
      cy.get('#author').type('Lara Croft')
      cy.get('#url').type('www.url.com')
      cy.get('#create-blog').click()

      cy.get('.notification').should(
        'contain',
        'a new blog A new blog by Lara Croft added'
      )
      cy.contains('A new blog Lara Croft')
    })

    it('users can likes a blog', function () {
      cy.contains('view').click()
      cy.get('#like').should('contain', '0')
      cy.contains('like').click()
      cy.get('#like').should('contain', '1')
    })

    it('user can delete blog', function () {
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.get('html').should('not.contain', 'My title')
    })

    it('another user dont see button remove', function () {
      cy.contains('log out').click()
      const user = {
        name: 'Megan Fox',
        username: 'megan',
        password: 'password',
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user)
      cy.login({ username: 'megan', password: 'password' })
      cy.visit('http://localhost:3000')
      cy.contains('view').click()
      cy.get('#blog').should('not.contain', 'remove')
    })

    it('blogs are shown in the right order', function () {
      cy.contains('view').click()
      cy.contains('like').click().click()
      let userInStorage = JSON.parse(
        window.localStorage.getItem('loggedBlogappUser')
      )
      cy.request({
        method: 'POST',
        url: 'http://localhost:3003/api/blogs',
        body: {
          title: 'A blog for testing the order of blogs, it should be second',
          author: 'Lana del Ray',
          url: 'www.lana.com',
        },
        headers: { Authorization: `bearer ${userInStorage.token}` },
      })
      cy.visit('http://localhost:3000')
      cy.get('.blog').eq(0).should('contain', 'My title')
      cy.get('.blog')
        .eq(1)
        .should(
          'contain',
          'A blog for testing the order of blogs, it should be second'
        )
    })
  })
})
