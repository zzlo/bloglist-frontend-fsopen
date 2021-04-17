describe('Blog app', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        const user = {
            name: "testi123",
            username: "testaaja",
            password: "salainen"
        }
        cy.request('POST', 'http://localhost:3001/api/users/', user)
        cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function() {
        cy.contains('log in to the application')
    })

    describe('Login', function() {
        it('succeeds with correct credentials', function() {
          cy.get('#username').type('testaaja')
          cy.get('#password').type('salainen')
          cy.get('#login-button').click()

          cy.contains('logged in succesfully')
        })
    
        it('fails with wrong credentials', function() {
            cy.get('#username').type('testaaja')
            cy.get('#password').type('wrong')
            cy.get('#login-button').click()
  
            cy.contains('wrong username or password')
        })
    })

    describe('When logged in', function() {
        beforeEach(function() {
          cy.request('POST', 'http://localhost:3001/api/login', {
              username: 'testaaja', password: 'salainen'
          }).then(res => {
              localStorage.setItem('loggedBlogappUser', JSON.stringify(res.body))
              cy.visit('http://localhost:3000')
          })
        })
    
        it('A blog can be created', function() {
          cy.contains('new blog').click()
          cy.get('#title').type('a new note cypress')
          cy.get('#author').type('- testaaja')
          cy.get('#url').type('testi.com')
          cy.get('#create').click()
          cy.contains('a new note cypress')
        })

        it('A blog can be liked', function() {
            cy.createBlog({ title: 'testi', author: 'tester', url: 'test.com' })
            
            cy.contains('view').click()
            cy.contains('like').click()
        })

        it('A blog can be removed', function() {
            cy.createBlog({ title: 'testi', author: 'tester', url: 'test.com' })
            cy.contains('view').click()
            cy.contains('remove').click()
            cy.get('html').should('not.contain', 'tester.com')
        })

        it.only('Blogs are sorted in like order', function() {
            cy.createBlog({ title: 'eitesti', author: 'tester', url: 'test.com' })
            cy.createBlog({ title: 'cypress', author: 'kirjasto', url: 'cypress.com' })
            cy.createBlog({ title: 'order', author: 'like', url: 'likeorder.com' })

            cy.contains('cypress').parent().find('#view').click()
            cy.contains('cypress').parent().find('.like').click()
            cy.visit('http://localhost:3000')

            cy.contains('eitesti').parent().find('#view').click()
            cy.contains('eitesti').parent().find('.like').click()
            cy.visit('http://localhost:3000')

            cy.contains('cypress').parent().find('#view').click()
            cy.contains('cypress').parent().find('.like').click()
            cy.visit('http://localhost:3000')

            cy.contains('order').parent().find('#view').click()
            cy.contains('order').parent().find('.like').click()
            cy.visit('http://localhost:3000')

            cy.contains('eitesti').parent().find('#view').click()
            cy.contains('eitesti').parent().find('.like').click()
            cy.visit('http://localhost:3000')
            cy.contains('cypress').parent().find('#view').click()
            cy.contains('cypress').parent().find('.like').click()
            cy.visit('http://localhost:3000')

            cy.contains('eitesti').parent().find('#view').click()
            cy.contains('eitesti').parent().find('.like').click()
            cy.visit('http://localhost:3000')
            cy.contains('cypress').parent().find('#view').click()
            cy.contains('cypress').parent().find('.like').click()
            cy.visit('http://localhost:3000')

            cy.contains('cypress').parent().find('#view').click()
            cy.contains('eitesti').parent().find('#view').click()
            cy.contains('order').parent().find('#view').click()

            cy.get('.blog').then(blogs => {
                cy.wrap(blogs[0]).find('#likes')
                    .invoke('text')
                    .then(parseFloat)
                    .should('to.be.greaterThan', 3)
                
                cy.wrap(blogs[1]).find('#likes')
                    .invoke('text')
                    .then(parseFloat)
                    .should('to.be.greaterThan', 1)
                
                    cy.wrap(blogs[2]).find('#likes')
                    .invoke('text')
                    .then(parseFloat)
                    .should('to.be.greaterThan', 0)
            })
        })
      })
})