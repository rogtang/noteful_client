import React from 'react'
import Note from '../Note/Note'
import './NotePageMain.css'
import ApiContext from '../ApiContext';
import { findNote } from '../App';
import propTypes from 'prop-types';

export default class NotePageMain extends React.Component {
  static contextType = ApiContext;

  static defaultProps = {
    match: {
      params: {}
    }
  }
//return to home page
  handleDeleteNote = noteId => {
    this.props.history.push(`/`)
  }

  render() {
    const { notes=[] } = this.context
    const { noteId } = this.props.match.params
    const note = findNote(notes, noteId) || { content: '' }
  
  return (
    <section className='NotePageMain'>
      <Note
        id={note.id}
        name={note.name}
        modified={note.modified}
        onDeleteNote = {this.handleDeleteNote}
      />
      <div className='NotePageMain__content'>
        {note.content.split(/\n \r|\n/).map((para, i) =>
          <p key={i}>{para}</p>
        )}
      </div>
    </section>
  )
        }
}

NotePageMain.propTypes = {
  notes: propTypes.arrayOf(propTypes.shape({ 
    id: propTypes.number.isRequired,
    note_name: propTypes.string.isRequired,
    content: propTypes.string.isRequired,
    modified: propTypes.string.isRequired,
    folder_id: propTypes.number.isRequired
  }))
}