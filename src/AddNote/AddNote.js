import React, { Component } from "react";
import ApiContext from '../ApiContext';
import ValidationError from "../ValidationError";
import config from '../config';
import PropTypes from 'prop-types';

export default class AddNote extends Component {
    static contextType = ApiContext;

    constructor(props) {
        super(props);
        this.state = {
          name: {
            value: "",
            touched: false
          },
          content: {
            value: '',
            touched: false,
        }
        };
      }

    updateName(name) {
        this.setState({ name: { value: name, touched: true } });
      }

    updateContent(content) {
        this.setState({content: {value: content,touched: true,}})
    }
    
    handleSubmit = (e) => {
        e.preventDefault();
        
        const newNote = {
            name: e.target['note-name'].value,
            content: e.target['note-content'].value,
            folder_id: e.target['note-folder-id'].value,
            modified: new Date(),
        }

        const url = `${config.API_ENDPOINT}/notes`;

        const options = {
            method : 'POST',
            body : JSON.stringify(newNote),
            headers: {
            'content-type': "application/json"
          }
        };

        console.log(options)

        fetch(url,options)
        .then(res =>{
            if(!res.ok){
                throw new Error('Something went wrong, please try again later');
            }
            return res.json();
        })
        .then(data =>{
            this.context.addNote(data);
            this.setState({value: '', touched: false});
            this.props.history.push('/');
        })
        .catch(err =>{
            this.setState({
                error: err.message
            });
        });
    }

    validateName() {
        const name = this.state.name.value.trim();
        if (name.length === 0) {
            return "Name is required";
        }
    }

    validateContent() {
        const content = this.state.content.value.trim();
        if (content.length === 0) {
            return "Content is required";
        }
    }

    render() {
        const nameError = this.validateName()
        const contentError = this.validateContent()
        return (
            <form className="add-note-form" onSubmit={e => this.handleSubmit(e)}>
                <h2>Add a Note</h2>
                <div className="add-note-container">
                    <label htmlFor="name">Name: </label>
                        <input type="text" className="add-note-input"
                            name="note-name" id="name" aria-required="true" onChange={e => this.updateName(e.target.value)} />
                        {this.state.name.touched && <ValidationError message={nameError} />}
                    <label htmlFor="content">Content: </label>
                        <input type="text" className="add-note-input"
                            name="note-content" id="content" aria-required="true" onChange={e => this.updateContent(e.target.value)} />
                        {this.state.content.touched && <ValidationError message={contentError} />}
                    <label htmlFor="Folder" className="folder-name-drop-down">Folder:</label>
                        <select name="note-folder-id" className="folder-drop-down">
                            {this.context.folders.map(folder =>
                                <option
                                    value={folder.id}
                                    key={folder.id}>{folder.name}</option>
                            )}
                        </select>

                    <button
                        type="submit"
                        className="save-note-button"
                        disabled={
                            this.validateName() ||
                            this.validateContent()
                        }
                    >
                        Save Note
                    </button>
                </div>
            </form >
        )
    }


}


AddNote.propTypes = {
    name: PropTypes.string.isRequired,
    content: PropTypes.string
  };