import React from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import './Note.css'
import ApiContext from '../ApiContext';
import config from '../config';
import propTypes from 'prop-types';

export default class Note extends React.Component {
  static contextType = ApiContext;

  static defaultProps ={
    onDeleteNote: () => {},
  }

  handleClickDelete = e => {
    e.preventDefault()
    const noteId = this.props.id

    fetch(`${config.API_ENDPOINT}/notes/${noteId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      },
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        
      })
      .then(() => {
        this.context.deleteNote(noteId)
        this.props.onDeleteNote(noteId)
      })
      .catch(error => {
        console.error({ error })
      })
  }
  
  render() {
    const { name, id, modified, content } = this.props
    //const formatDate = format(new Date(modified), 'hh:mm a MMMM do, yyyy')
  return (
    
    <div className='Note'>
      <h2 className='Note__title'>
        <Link to={`/note/${id}`}>
          {name}
        </Link>
      </h2>
      <button className='Note__delete' type='button' onClick={this.handleClickDelete}>
        remove
      </button>
      {content}
      <div className='Note__dates'>
        <div className='Note__dates-modified'>
        <p>{modified}</p>
        {/*<span className='Date'>
            {formatDate}
  </span>*/}
          {/*<span className='Date'>
              {format(modified, 'Do MMM YYYY')}
          </span>*/} 
        </div>
      </div>
    </div>
  )
  }
}


Note.propTypes = {
  note: propTypes.shape({
    id: propTypes.string.isRequired,
    note_name: propTypes.string.isRequired,
    content: propTypes.string.isRequired,
    modified: propTypes.string.isRequired,
    folder_id: propTypes.number.isRequired
  })
}