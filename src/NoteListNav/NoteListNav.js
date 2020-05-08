import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CircleButton from '../CircleButton/CircleButton'
import { countNotesForFolder } from '../App'
import './NoteListNav.css'
import ApiContext from '../ApiContext';
import propTypes from 'prop-types';


export default class NoteListNav extends React.Component {
  static contextType = ApiContext;

  render() {
    const { notes =[], folders=[] } = this.context
  
    return (
      <div className='NoteListNav'>
        <ul className='NoteListNav__list'>
          {folders.map(folder =>
            <li key={folder.id}>
              <NavLink
                className='NoteListNav__folder-link'
                to={`/folder/${folder.id}`}
              >
                <span className='NoteListNav__num-notes'>
                  {countNotesForFolder(notes, folder.id)}
                </span>
                {folder.name}
              </NavLink>
            </li>
          )}
        </ul>
        <div className='NoteListNav__button-wrapper'>
          <CircleButton
            tag={Link}
            to='/add-folder'
            type='button'
            className='NoteListNav__add-folder-button'
          >
            <FontAwesomeIcon icon='plus' />
            <br />
            Add Folder
          </CircleButton>
        </div>
      </div>
    )
          }
  }

  NoteListNav.propTypes = {
    folders: propTypes.arrayOf(propTypes.shape({
      id: propTypes.number.isRequired,
      folder_name: propTypes.string.isRequired
    })) 
  }