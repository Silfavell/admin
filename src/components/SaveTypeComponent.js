import React, { Component } from 'react'
import axios from 'axios'

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
            axios.post(`${process.env.REACT_APP_API_URL}/admin/save-type`, {
                name: this.state.name,
                specifications: this.state.specifications.trim().split(',')
            }).then(({ status, data }) => {
                if (status === 200) {
                    alert('Ürün tipi eklendi')

                    this.setState({ name: '', specifications: '' })
                }
            }).catch((reason) => {
                alert(reason?.response?.data?.error ?? 'Beklenmedik bir hata oluştu lütfen girdiğiniz değerleri kontrol ediniz')
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
                        <label htmlFor='specifications' className='text-black'>Tipin içerebileceği özellikleri ekleyiniz (Aralara virgül koyunuz, örnek: "Renk,Fırça Kalınlığı") <span className='text-danger'>*</span></label>
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