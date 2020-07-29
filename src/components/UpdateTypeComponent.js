import React, { Component } from 'react'
import axios from 'axios'

import 'bootstrap/dist/css/bootstrap.min.css'
import './save-product.scss'

class UpdateTypeComponent extends Component {

    state = {
        types: [],
        typeId: '',
        name: ''
    }

    getTypes = () => (
        axios.get(`${process.env.REACT_APP_API_URL}/admin/types`).then(({ data, status }) => data)
    )

    UNSAFE_componentWillMount() {
        this.getTypes().then((types) => {
            this.setState({ types })
        })
    }

    onChange = (event) => {
        const { name, value } = event.target

        this.setState({ [name]: value })
    }


    onUpdateClick = () => {
        if (this.state.typeId.length > 0 && this.state.name.length > 0) {
            if (window.confirm(`Seçili ürün tipini güncellemek istediğinize emin misiniz?`)) {
                axios.put(`${process.env.REACT_APP_API_URL}/admin/update-type/${this.state.typeId}`, { name: this.state.name }).then(({ status }) => {
                    if (status === 200) {
                        alert('Ürün tipi güncellendi')

                        this.setState({ typeId: '', name: '' })
                    }
                })
            }
        } else {
            alert('Lütfen gerekli alanları doldurunuz')
        }
    }

    render() {
        const {
            types,
            typeId,
            name
        } = this.state

        return (
            <div className='p-3 border'>
                <div className='col-md-12'>
                    <div className='form-group row'>
                        <div className='col-md-12'>
                            <label htmlFor='typeId' className='text-black'>Tip Seçiniz <span className='text-danger'>*</span></label>
                            <select
                                className='form-control'
                                id='typeId'
                                name='typeId'
                                onChange={this.onChange}
                                value={typeId}>
                                <option selected unselectable value={null}>Tip seçiniz</option>
                                {
                                    types.map((type) => (
                                        <option value={type._id}>{type.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>

                    <div className='form-group row'>
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


                    <div className='form-group row mt-4'>
                        <div className='col-lg-12'>
                            <button className='btn btn-primary btn-block' onClick={this.onUpdateClick}>Tipi güncelle</button>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default UpdateTypeComponent