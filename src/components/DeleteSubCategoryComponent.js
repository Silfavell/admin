import React, { Component } from 'react'
import axios from 'axios'
import VanillaToasts from 'vanillatoasts'
import 'vanillatoasts/vanillatoasts.css'

import 'bootstrap/dist/css/bootstrap.min.css'
import './save-product.scss'

class DeleteSubCategoryComponent extends Component {

    state = {
        categories: [],
        categoryId: '',
        subCategoryId: ''
    }

    getCategories = () => (
        axios.get(`${process.env.REACT_APP_API_URL}/categories`).then(({ data }) => data)
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


    onDeleteClick = () => {
        if (this.state.categoryId.length > 0 && this.state.subCategoryId.length > 0) {
            if (window.confirm(`Seçili alt kategoriyi silmek istediğinize emin misiniz?`)) {
                axios.delete(`${process.env.REACT_APP_API_URL}/admin/sub-category?parentCategoryId=${this.state.categoryId}&_id=${this.state.subCategoryId}`).then(({ status }) => {
                    if (status === 200) {
                        VanillaToasts.create({
                            title: 'Alt lategori silindi',
                            type: 'success',
                            positionClass: 'topRight',
                            timeout: 3 * 1000
                        })

                        this.setState({ categoryId: '', subCategoryId: '' })
                    }
                })
            }
        } else {
            VanillaToasts.create({
                title: 'Lütfen silmek istediğiniz alt kategoriyi seçiniz',
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
            subCategoryId
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
                            <label htmlFor='subCategoryId' className='text-black'>Silmek istediğiniz alt kategoriyi seçiniz  <span className='text-danger'>*</span></label>
                            <select
                                type='text'
                                className='form-control'
                                id='subCategoryId'
                                name='subCategoryId'
                                onChange={this.onChange}
                                value={subCategoryId}>
                                <option selected unselectable value={null}>Alt kategori seçiniz</option>
                                {
                                    categories.find((category) => category._id === categoryId)?.subCategories.map((subCategory) => (
                                        <option value={subCategory._id}>{subCategory.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>


                    <div className='form-group row mt-4'>
                        <div className='col-lg-12'>
                            <button className='btn btn-primary btn-block' onClick={this.onDeleteClick}>Alt Kategoriyi Sil</button>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default DeleteSubCategoryComponent