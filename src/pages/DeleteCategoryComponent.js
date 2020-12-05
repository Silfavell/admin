import React, { Component } from 'react'
import axios from 'axios'
import VanillaToasts from 'vanillatoasts'
import 'vanillatoasts/vanillatoasts.css'
import 'vanillatoasts/vanillatoasts.css'

import 'bootstrap/dist/css/bootstrap.min.css'
import './save-product.scss'

class DeleteCategoryComponent extends Component {

    state = {
        categories: [],
        categoryId: ''
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
        const { value } = event.target

        this.setState({ categoryId: value })
    }


    onDeleteClick = () => {
        if (this.state.categoryId.length > 0) {
            if (window.confirm(`Seçili kategoriyi silmek istediğinize emin misiniz?`)) {
                axios.delete(`${process.env.REACT_APP_API_URL}/categories/${this.state.categoryId}`).then(({ status }) => {
                    if (status === 200) {
                        VanillaToasts.create({
                            title: 'Kategori silindi',
                            type: 'success',
                            positionClass: 'topRight',
                            timeout: 3 * 1000
                        })

                        this.setState({ categoryId: '' })
                    }
                })
            }
        } else {
            VanillaToasts.create({
                title: 'Lütfen silmek istediğiniz kategoriyi seçiniz',
                type: 'warning',
                positionClass: 'topRight',
                timeout: 3 * 1000
            })
        }
    }

    render() {
        const {
            categories,
            categoryId
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


                    <div className='form-group row mt-4'>
                        <div className='col-lg-12'>
                            <button className='btn btn-primary btn-block' onClick={this.onDeleteClick}>Kategoriyi Sil</button>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default DeleteCategoryComponent