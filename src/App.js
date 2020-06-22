import React from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from './NoteListNav/NoteListNav';
import NotePageNav from './NotePageNav/NotePageNav';
import NoteListMain from './NoteListMain/NoteListMain';
import NotePageMain from './NotePageMain/NotePageMain';
//import dummyStore from './dummy-store';
import ApiContext from './ApiContext';
import './App.css';
import config from './config';
import ErrorBoundary from './ErrorBoundary';
import AddFolder from './AddFolder/AddFolder';
import AddNote from './AddNote/AddNote';

export const findFolder = (folders=[], folderId) =>
  folders.find(folder => folder.id === folderId)

export const findNote = (notes=[], noteId) =>
  notes.find(note => note.id === noteId)

export const getNotesForFolder = (notes=[], folderId) => (
  (!folderId)
    ? notes
    : notes.filter(note => note.folderId === folderId)
)

export const countNotesForFolder = (notes=[], folderId) =>
  notes.filter(note => note.folderId === folderId).length



class App extends React.Component {

  state = {
    folders: [],
    notes: []
  };

  componentDidMount() {
    Promise.all([
      fetch(`${config.API_ENDPOINT}/notes/`),
      fetch(`${config.API_ENDPOINT}/folders/`)
  ])
      .then(([notesRes, foldersRes]) => {
          if (!notesRes.ok)
              return notesRes.json().then(e => Promise.reject(e));
          if (!foldersRes.ok)
              return foldersRes.json().then(e => Promise.reject(e));

          return Promise.all([notesRes.json(), foldersRes.json()]);
      })
      .then(([notes, folders]) => {
        console.log(notes)
          this.setState({notes, folders});
      })
      .catch(error => {
          console.error({error});
      });
  }

   handleDeleteNote = (noteId) => {
    //store update state in variable
    const newNotes = this.state.notes.filter(note => note.id !== noteId)
    this.setState({
      notes: newNotes
    })
  }

  handleAddNote = (newNote) => {
    this.setState({
      notes: [...this.state.notes, newNote]
    })
  }

  handleAddFolder = (newFolder) => {
    this.setState({
      folders: [...this.state.folders, newFolder]
    })
  }


  renderNavRoutes() {
    //const {notes, folders} = this.state;
    //The main route and the folder route could use the same component with a different list of notes passed in as props.
    return (
      <div>
        {['/', '/folder/:folderId'].map(path => (
            <Route 
              exact key={path}
                    path={path}
                    component={NoteListNav}
                    />
        ))}
            <Route
                    path="/note/:noteId"
                    component={NotePageNav}/>
            <Route path="/add-folder" component={AddFolder} />
            <Route path="/add-note" component={AddNote} />
      </div>
    );
  }

  renderMainRoutes() {
    //const {notes} = this.state;
    return (
        <>
            {['/', '/folder/:folderId'].map(path => (
                <Route
                    exact
                    key={path}
                    path={path}
                    component = {NoteListMain}/>
            ))}
            <Route
                path="/note/:noteId"
                component={NotePageMain}/>
        </>
    );
}

  
  render() {
    const value = {
      folders: this.state.folders,
      notes: this.state.notes,
      deleteNote: this.handleDeleteNote,
      addNote: this.handleAddNote,
      addFolder: this.handleAddFolder
    }
  
    return (
    <ApiContext.Provider value={value}>
    <div className='App'>
      <ErrorBoundary>
      <nav className="App__nav">{this.renderNavRoutes()}</nav>
      </ErrorBoundary>
      <header className='app__header'>
        <h1> 
          <Link to="/">Noteful</Link> 
          <FontAwesomeIcon icon="check-double" />
        </h1>
      </header>
      <ErrorBoundary>
      <main className="App__main">{this.renderMainRoutes()}</main>
      </ErrorBoundary>
    </div>
    </ApiContext.Provider>
  );
  }
}

export default App;
