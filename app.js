const libraryContainer = document.querySelector('#library-container')
const bookAdditionButton = document.querySelector('#add-book')
const openFormButton = document.querySelector('#open-popup')
const closeFormButton = document.querySelector('.close-button')
const bookForm = document.querySelector('#form-popup')
const formOverlay = document.querySelector('#popup-overlay')
let myLibrary = []

bookAdditionButton.addEventListener('click', addBookToLibrary)
openFormButton.addEventListener('click', openForm)
closeFormButton.addEventListener('click', closeForm)
formOverlay.addEventListener('click', closeForm)

initiateBooks()

function Book(id, title, author, pages, read) {
    this.id = id
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
    this.info = function() {
        return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read}`
    }
}

function openForm() {
    bookForm.classList.add('active')
    formOverlay.classList.add('active')
}

function closeForm() {
    bookForm.classList.remove('active')
    formOverlay.classList.remove('active')
}

function updateLocalStorage() {
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary))
}

function initiateBooks() {
    if(localStorage.getItem('myLibrary') === null) return
    myLibrary = JSON.parse(localStorage.getItem('myLibrary'))
    myLibrary.forEach((book) => {
        addBookToPage(book)
    })
}

function deleteBook(bookID) {
    let deletedBook = document.querySelector(`[data-id = '${bookID}']`)
    deletedBook.remove()
    myLibrary.forEach((book) => {
        if(book.id === bookID) {
            let index = myLibrary.indexOf(book)
            myLibrary.splice(index, 1)
        }
    })
    updateLocalStorage()
}

function toggleRead(book) {
    let modifiedBook = document.querySelector(`[data-id = '${book.id}']`)
    let readButton = modifiedBook.querySelector('.read-button')
    book.read = !book.read
    if(book.read) {
        readButton.innerText = 'Read'
        readButton.classList.add('status-read')
        readButton.classList.remove('status-not-read')
    } else {
        readButton.innerText = 'Not Read'
        readButton.classList.add('status-not-read')
        readButton.classList.remove('status-read')
    }
    updateLocalStorage()
}

function addBookToPage(book) {
    let bookTemplate = document.querySelector('#book-template').content
    let bookElement = document.importNode(bookTemplate,true)
    let bookID = bookElement.querySelector('.library-book')
    let deleteButton = bookElement.querySelector('.delete-button')
    let readButton = bookElement.querySelector('.read-button')
    bookID.dataset.id = book.id
    bookElement.querySelector('.book-title').innerText = `Title: ${book.title}`
    bookElement.querySelector('.book-author').innerText = `Author: ${book.author}`
    bookElement.querySelector('.book-pages').innerText = `Pages: ${book.pages}`
    if(book.read) {
        readButton.innerText = 'Read'
        readButton.classList.add('status-read')
    } else {
        readButton.innerText = 'Not Read'
        readButton.classList.add('status-not-read')
    }
    deleteButton.addEventListener('click', function () {
        deleteBook(book.id)
        })
    readButton.addEventListener('click', function() {
        toggleRead(book)
    })
    libraryContainer.appendChild(bookElement)
}

function addBookToLibrary(e) {
    e.preventDefault()
    let title = document.querySelector('#title').value
    let author = document.querySelector('#author').value
    let pages = document.querySelector('#pages').value
    let read = document.querySelector('#read').checked
    let id = Date.now()
    let book = new Book(id, title, author, pages, read)
    myLibrary.push(book)
    document.querySelector('#book-form').reset()
    addBookToPage(book)
    updateLocalStorage()
    closeForm()
}
