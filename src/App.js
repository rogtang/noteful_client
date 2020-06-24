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

export const findFolder = (folders=[], folder_id) =>
  folders.find(folder => folder.id === folder_id)

export const findNote = (notes=[], note_id) =>
  notes.find(note => note.id === note_id)

export const getNotesForFolder = (notes=[], folder_id) => (
  (!folder_id)
    ? notes
    : notes.filter(note => note.folder_id.toString() === folder_id.toString())
)

export const countNotesForFolder = (notes=[], folder_id) =>
  notes.filter(note => note.folder_id === folder_id).length



class App extends React.Component {

  state = {
    folders: [],
    notes: []
  };

  componentDidMount() {
    Promise.all([
      fetch(`${config.API_ENDPOINT}/notes`),
      fetch(`${config.API_ENDPOINT}/folders`)
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
    return (
      <div>
        {['/', '/folder/:folder_id'].map(path => (
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
            {['/', '/folder/:folder_id'].map(path => (
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
