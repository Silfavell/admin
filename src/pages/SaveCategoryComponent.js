import React, { Component } from 'react'
import axios from 'axios'
import VanillaToasts from 'vanillatoasts'
import 'vanillatoasts/vanillatoasts.css'

import 'bootstrap/dist/css/bootstrap.min.css'

class SaveSubCategoryComponent extends Component {

    state = {
        name: ''
    }

    onChange = (event) => {
        this.setState({ name: event.target.value })
    }

    onSaveClick = () => {
        if (window.confirm(`${this.state.name} isimli kategoriyi eklemek istediğinize emin misiniz ?`)) {
            axios.post(`${process.env.REACT_APP_API_URL}/categories`, {
                name: this.state.name
            }).then(({ status, data }) => {
                if (status === 200) {
                    VanillaToasts.create({
                        title: 'Kategori eklendi',
                        type: 'success',
                        positionClass: 'topRight',
                        timeout: 3 * 1000
                    })
                }
            })
        }
    }

    render() {
        const {
            name
        } = this.state

        return (
            <div className='p-3 border'>
                <div className='form-group'>
                    <div className='col-md-12'>
                        <label htmlFor='categoryName' className='text-black'>Kategori Adı <span className='text-danger'>*</span></label>
                        <input
                            type='text'
                            className='form-control'
                            id='categoryName'
                            name='categoryName'
                            placeholder='Kategori adını giriniz'
                            onChange={this.onChange}
                            value={name} />
                    </div>
                </div>

                <div className='form-group'>
                    <div className='col-md-12'>
                        <button className='btn btn-primary btn-block' onClick={this.onSaveClick}>Kategori Ekle</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default SaveSubCategoryComponent