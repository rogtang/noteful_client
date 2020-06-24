import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Note from '../Note/Note'
import CircleButton from '../CircleButton/CircleButton'
import './NoteListMain.css'
import ApiContext from '../ApiContext'
import { getNotesForFolder } from '../App';
import propTypes from 'prop-types';

export default class NoteListMain extends React.Component {
  static contextType = ApiContext;

  static defaultProps = {
    match: {
      params: {}
    }
  }
  render() {
    const { folder_id } = this.props.match.params
    const { notes=[] } = this.context
    const notesForFolder = getNotesForFolder(notes, folder_id)
    console.log(this.context)
  return (
    <section className='NoteListMain'>
      <ul>
        {notesForFolder.map(note =>
          <li key={note.id}>
            <Note
              id={note.id}
              name={note.name}
              modified={note.modified}
            />
          </li>
        )}
      </ul>
      <div className='NoteListMain__button-container'>
        <CircleButton
          tag={Link}
          to='/add-note'
          type='button'
          className='NoteListMain__add-note-button'
        >
          <FontAwesomeIcon icon='plus' />
          <br />
          Add Note
        </CircleButton>
      </div>
    </section>
  )
        }
}
NoteListMain.propTypes = {
  notes: propTypes.arrayOf(propTypes.shape({ 
    id: propTypes.string.isRequired,
    note_name: propTypes.string.isRequired,
    content: propTypes.string.isRequired,
    modified: propTypes.string.isRequired,
    folder_id: propTypes.number.isRequired
  }))
};