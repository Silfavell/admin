import React, { Component } from 'react'
import axios from 'axios'

import 'bootstrap/dist/css/bootstrap.min.css'
import './save-product.scss'

class UpdateSubCategoryComponent extends Component {
    state = {
        categories: [],
        categoryId: '',
        subCategoryId: '',
        name: ''
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


    onUpdateClick = () => {
        if (this.state.categoryId.length > 0 && this.state.subCategoryId.length > 0 && this.state.name.length > 0) {
            if (window.confirm(`Seçili alt kategoriyi güncellemek istediğinize emin misiniz?`)) {
                axios.put(`${process.env.REACT_APP_API_URL}/admin/sub-category`, {
                    parentCategoryId: this.state.categoryId,
                    subCategoryId: this.state.subCategoryId,
                    name: this.state.name
                }).then(({ status }) => {
                    if (status === 200) {
                        alert('Alt kategori güncellendi')

                        this.setState({ categoryId: '', subCategoryId: '', name: '' })
                    }
                })
            }
        } else {
            alert('Lütfen gerekli alanları doldurunuz')
        }
    }

    render() {
        const {
            categories,
            categoryId,
            subCategoryId,
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
                            <label htmlFor='subCategoryId' className='text-black'>Güncellemek istediğiniz alt kategoriyi seçiniz  <span className='text-danger'>*</span></label>
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

                    <div className='form-group row'>
                        <div className='col-md-12'>
                            <label htmlFor='name' className='text-black'>Alt Kategori Adı <span className='text-danger'>*</span></label>
                            <input
                                type='text'
                                className='form-control'
                                id='name'
                                name='name'
                                placeholder='Alt Kategori adını giriniz'
                                onChange={this.onChange}
                                value={name} />
                        </div>
                    </div>


                    <div className='form-group row mt-4'>
                        <div className='col-lg-12'>
                            <button className='btn btn-primary btn-block' onClick={this.onUpdateClick}>Alt Kategoriyi güncelle</button>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default UpdateSubCategoryComponent