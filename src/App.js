import React from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from './NoteListNav/NoteListNav';
import NotePageNav from './NotePageNav/NotePageNav';
import NoteListMain from './NoteListMain/NoteListMain';
import NotePageMain from './NotePageMain/NotePageMain';
import dummyStore from './dummy-store';
import './App.css'

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
    //mock api here
    setTimeout(() => this.setState(dummyStore), 600);
  }


  renderNavRoutes() {
    const {notes, folders} = this.state;
    //The main route and the folder route could use the same component with a different list of notes passed in as props.
    return (
      <div>
        {['/', '/folder/:folderId'].map(path => (
            <Route 
              exact key={path}
                    path={path}
                    render={routeProps => (
                      <NoteListNav 
                          folders={folders}
                          notes={notes}
                          {...routeProps} />
                    )}
                    />
        ))}
            <Route
                    path="/note/:noteId"
                    render={routeProps => {
                        const {noteId} = routeProps.match.params;
                        const note = findNote(notes, noteId) || {};
                        const folder = findFolder(folders, note.folderId);
                        return <NotePageNav {...routeProps} folder={folder} />;
                    }}
                />
                <Route path="/add-folder" component={NotePageNav} />
                <Route path="/add-note" component={NotePageNav} />
      </div>
    );
  }

  renderMainRoutes() {
    const {notes} = this.state;
    return (
        <>
            {['/', '/folder/:folderId'].map(path => (
                <Route
                    exact
                    key={path}
                    path={path}
                    render={routeProps => {
                        const {folderId} = routeProps.match.params;
                        const notesForFolder = getNotesForFolder(notes, folderId);
                        return (
                            <NoteListMain
                                {...routeProps}
                                notes={notesForFolder}
                            />
                        );
                    }}
                />
            ))}
            <Route
                path="/note/:noteId"
                render={routeProps => {
                    const {noteId} = routeProps.match.params;
                    const note = findNote(notes, noteId);
                    return <NotePageMain {...routeProps} note={note} />;
                }}
            />
        </>
    );
}

  
  render() {
  
    return (
    <div className='App'>
      <nav className="App__nav">{this.renderNavRoutes()}</nav>
      <header className='app__header'>
        <h1> 
          <Link to="/">Noteful</Link> 
          <FontAwesomeIcon icon="check-double" />
        </h1>
      </header>
      <main className="App__main">{this.renderMainRoutes()}</main>
    </div>
  );
  }
}

export default App;
