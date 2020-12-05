import React, { Component } from 'react'
import axios from 'axios'
import VanillaToasts from 'vanillatoasts'
import 'vanillatoasts/vanillatoasts.css'

import 'bootstrap/dist/css/bootstrap.min.css'

class SaveTypeComponent extends Component {

    state = {
        name: '',
        specifications: ''
    }

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    onSaveClick = () => {
        if (window.confirm(`${this.state.name} isimli tipi eklemek istediğinize emin misiniz ?`)) {
            const body = {}

            body.name = this.state.name
            if (this.state.specifications.trim().length > 0) {
                body.specifications = this.state.specifications.trim().split(',')
            }

            axios.post(`${process.env.REACT_APP_API_URL}/types`, body).then(({ status, data }) => {
                if (status === 200) {
                    VanillaToasts.create({
                        title: 'Ürün tipi eklendi',
                        type: 'success',
                        positionClass: 'topRight',
                        timeout: 3 * 1000
                    })

                    this.setState({ name: '', specifications: '' })
                }
            })
        }
    }

    render() {
        const {
            name,
            specifications
        } = this.state

        return (
            <div className='p-3 border'>
                <div className='form-group'>
                    <div className='col-md-12'>
                        <label htmlFor='name' className='text-black'>Tip Adı <span className='text-danger'>*</span></label>
                        <input
                            type='text'
                            className='form-control'
                            id='name'
                            name='name'
                            placeholder='Tip adını giriniz'
                            onChange={this.onChange}
                            value={name} />
                    </div>
                </div>

                <div className='form-group'>
                    <div className='col-md-12'>
                        <label htmlFor='specifications' className='text-black'>Tipin içerebileceği özellikleri ekleyiniz (Aralara virgül koyunuz, örnek: 'Renk,Fırça Kalınlığı') <span className='text-danger'>*</span></label>
                        <input
                            type='text'
                            className='form-control'
                            id='specifications'
                            name='specifications'
                            placeholder='Tipin içerebileceği özellikler'
                            onChange={this.onChange}
                            value={specifications} />
                    </div>
                </div>

                <div className='form-group'>
                    <div className='col-md-12'>
                        <button className='btn btn-primary btn-block' onClick={this.onSaveClick}>Tipi Ekle</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default SaveTypeComponent