import React from 'react'

const New = (props) => {
    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={props.handleCreation}>
                <div>
                    title: <input type="text" value={props.title} name="Title" onChange={ ({target}) => props.setTitle(target.value)}/>
                </div>
                <div>
                    author: <input type="text" value={props.author} name="Author" onChange={ ({target}) => props.setAuthor(target.value)}/>
                </div>
                <div>
                    url: <input type="text" value={props.url} name="Url" onChange={ ({target}) => props.setUrl(target.value)}/>
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default New