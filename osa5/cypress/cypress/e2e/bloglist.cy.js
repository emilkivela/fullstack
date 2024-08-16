describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('väärä')
      cy.get('#login-button').click()
      cy.contains('wrong credentials')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({username: 'mluukkai', password: 'salainen'})
      cy.createBlog({
        title: 'Base blog',
        author: 'Matti Luukkainen',
        url: 'fäsätesti.fi',
        likes: 0
      })
    })

    it('a new blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('E2E testing with cypress')
      cy.get('#author').type('Matti Luukkainen')
      cy.get('#url').type('www.e2efäsä.fi')
      cy.get('#submit-button').click()
      cy.contains('E2E testing with cypress')
    })

    it('a blog can be liked', function() {
      cy.get('#infoButton').click()
      cy.contains('0')
      cy.get('#likeButton').click()
      cy.contains('1')
    })

    it('a blog can be removed by its creator', function() {
      cy.get('#infoButton').click()
      cy.contains('remove').click()
      cy.contains('Base blog').should('not.exist')
    })

    it('a blog does not show remove button to others', function() {
      cy.contains('logout').click
      cy.request('POST', 'http://localhost:3003/api/users', {
        name: 'Antti Laaksonen',
        username: 'ashlaaks',
        password: 'sekret'
      })
      cy.login({username: 'ashlaaks', password: 'sekret'})
      cy.get('#infoButton').click()
      cy.contains('remove').should('not.exist')
    })

    it.only('blogs are in order based on likes', function() {
      cy.createBlog({
        title: 'Blog with the most likes',
        author: 'Sauli Niinistö',
        url: 'hs.fi',
        likes: 3
      })
      cy.createBlog({
        title: 'Blog with the second most likes',
        author: 'Tarja Halonen',
        url: 'yle.fi',
        likes: 2
      })
      cy.get('.blog').eq(0).should('contain', 'Blog with the most likes')
      cy.get('.blog').eq(1).should('contain', 'Blog with the second most likes')
      cy.contains('Blog with the second most likes')
        .contains('view')
        .click()
      cy.get('#likeButton')
        .click()
        .wait(500)
        .click()
      cy.get('.blog').eq(0).should('contain', 'Blog with the second most likes')
    })
  })
})