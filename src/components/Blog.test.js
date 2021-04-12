import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'
import New from './New'
import loginService from '../services/login'

describe('<Blog />', () => {
    let user
    let component
    const handleDeletion = jest.fn()
    const handleUpdating = jest.fn()

    const blog = {
        title: "testi",
        author: "naattori",
        url: "keskusta.com",
        likes: 32,
        user: user
    }

    beforeEach(async () => {
        user = await loginService.login({
            username: "karamelli", password: "mauritius"
        })
        blog.user = user

        component = render(
            <Blog user={user} blog={blog} handleUpdating={handleUpdating} handleDeletion={handleDeletion}>
                <div className="testDiv"/>
            </Blog>
        )
    })

    test('at the start renders title and author, but not url or likes', () => {
        const div = component.container.querySelector('.name')
        expect(div).toHaveTextContent(`${blog.title} ${blog.author}`)

        const togglable = component.container.querySelector('.togglable')
        expect(togglable).toHaveStyle('display: none')
    })

    test('url and like rendered after button is clicked', () => {
        const button = component.getByText('view')
        fireEvent.click(button)
        const togglable = component.container.querySelector('.togglable')
        expect(togglable).not.toHaveStyle('display: none')
    })

    test('clicking button twice results in two calls of function', () => {
        const button = component.getByText('like')
        fireEvent.click(button)
        fireEvent.click(button)
        expect(handleUpdating.mock.calls).toHaveLength(2)
    })
})

test('<New />', () => {
    const handleCreation = jest.fn()

    const component = render(
        <New handleCreation={handleCreation} />
    )

    const titleInput = component.container.querySelector('#title')
    const authorInput = component.container.querySelector('#author')
    const urlInput = component.container.querySelector('#url')
    const form = component.container.querySelector('form')

    fireEvent.change(titleInput, {
        target: { value: 'testing' }
    })

    fireEvent.change(authorInput, {
        target: { value: 'mauri' }
    })

    fireEvent.change(urlInput, {
        target: { value: 'keskusta.com' }
    })

    fireEvent.submit(form)

    expect(handleCreation.mock.calls).toHaveLength(1)
    expect(handleCreation.mock.calls[0][0].title).toBe('testing')
    expect(handleCreation.mock.calls[0][0].author).toBe('mauri')
    expect(handleCreation.mock.calls[0][0].url).toBe('keskusta.com')
})