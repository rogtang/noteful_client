import React, { Component } from "react";
import ApiContext from '../ApiContext';
import ValidationError from "../ValidationError";
import config from '../config';
import propTypes from 'prop-types';

export default class AddFolder extends Component {
    static contextType = ApiContext;

    constructor(props) {
        super(props);
        this.state = {
          name: {
            value: "",
            touched: false
          },
        };
      }
    updateName(name) {
        this.setState({ name: { value: name, touched: true } });
      }
    
    handleSubmit = (e) => {
        e.preventDefault();
        const newFolder = {
            name: e.target['folder-name'].value
        }
        const url = `${config.API_ENDPOINT}/folders`;

        const options = {
            method : 'POST',
            body : JSON.stringify(newFolder),
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
            this.context.addFolder(data);
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

    render() {
        const nameError = this.validateName();
        return (
            <form className="add-folder-form" onSubmit={e => this.handleSubmit(e)}>
                <h2>Add Folder</h2>

                <label htmlFor="name">Name: </label>
                <input type="text" className="add-folder-input"
                    name="folder-name" id="name" aria-required="true" onChange={e => this.updateName(e.target.value)} />
                {this.state.name.touched && <ValidationError message={nameError} />}

                <button
                    type="submit"
                    className="save-folder-button"
                    disabled={
                        this.validateName()
                    }
                >
                    Save Folder
                </button>
            </form >
        )
    }

}
AddFolder.propTypes = {
    name: propTypes.string.isRequired
  };