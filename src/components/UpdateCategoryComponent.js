import React, { Component } from 'react'
import axios from 'axios'
import VanillaToasts from 'vanillatoasts'
import 'vanillatoasts/vanillatoasts.css'

import 'bootstrap/dist/css/bootstrap.min.css'
import './save-product.scss'

class UpdateCategoryComponent extends Component {

    state = {
        categories: [],
        categoryId: '',
        name: ''
    }

    getCategories = () => (
        axios.get(`${process.env.REACT_APP_API_URL}/categories`).then(({ data, status }) => data)
    )

    UNSAFE_componentWillMount() {
        this.getCategories().then((categories) => {
            this.setState({ categories })
        })
    }

    onChange = (event) => {
        const { name, value } = event.target

        this.setState({ [name]: value })
    }


    onUpdateClick = () => {
        if (this.state.categoryId.length > 0 && this.state.name.length > 0) {
            if (window.confirm(`Seçili kategoriyi güncellemek istediğinize emin misiniz?`)) {
                axios.put(`${process.env.REACT_APP_API_URL}/admin/category/${this.state.categoryId}`, { name: this.state.name }).then(({ status }) => {
                    if (status === 200) {
                        VanillaToasts.create({
                            title: 'Kategori güncellendi',
                            type: 'success',
                            positionClass: 'topRight',
                            timeout: 3 * 1000
                        })

                        this.setState({ categoryId: '', name: '' })
                    }
                })
            }
        } else {
            VanillaToasts.create({
                title: 'Lütfen gerekli alanları doldurunuz',
                type: 'warning',
                positionClass: 'topRight',
                timeout: 3 * 1000
            })
        }
    }

    render() {
        const {
            categories,
            categoryId,
            name
        } = this.state

        return (
            <div className='p-3 border'>
                <div className='col-md-12'>
                    <div className='form-group row'>
                        <div className='col-md-12'>
                            <label htmlFor='categoryId' className='text-black'>Kategori <span className='text-danger'>*</span></label>
                            <select
                                className='form-control'
                                id='categoryId'
                                name='categoryId'
                                onChange={this.onChange}
                                value={categoryId}>
                                <option selected unselectable value={null}>Kategori seçiniz</option>
                                {
                                    categories.map((category) => (
                                        <option value={category._id}>{category.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>

                    <div className='form-group row'>
                        <div className='col-md-12'>
                            <label htmlFor='name' className='text-black'>Kategori Adı <span className='text-danger'>*</span></label>
                            <input
                                type='text'
                                className='form-control'
                                id='name'
                                name='name'
                                placeholder='Kategori adını giriniz'
                                onChange={this.onChange}
                                value={name} />
                        </div>
                    </div>


                    <div className='form-group row mt-4'>
                        <div className='col-lg-12'>
                            <button className='btn btn-primary btn-block' onClick={this.onUpdateClick}>Kategoriyi güncelle</button>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default UpdateCategoryComponent