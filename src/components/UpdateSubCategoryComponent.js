import React, { Component } from 'react'
import axios from 'axios'

import 'bootstrap/dist/css/bootstrap.min.css'
import './save-product.scss'

class UpdateSubCategoryComponent extends Component {
    state = {
        categories: [],
        types: [],

        selectedTypes: [],
        categoryId: '',
        subCategoryId: '',
        name: ''
    }

    getCategories = () => (
        axios.get(`${process.env.REACT_APP_API_URL}/categories`).then(({ data }) => data)
    )

    getTypes = () => (
        axios.get(`${process.env.REACT_APP_API_URL}/admin/types`).then(({ data, status }) => data)
    )

    UNSAFE_componentWillMount() {
        Promise.all([this.getCategories(), this.getTypes()]).then((vals) => {
            this.setState({ categories: vals[0], types: vals[1] })
        })
    }

    onChange = (event) => {
        const { name, value } = event.target

        if (name === 'categoryId') {
            this.setState({
                categoryId: value,
                selectedTypes: [],
                subCategoryId: '',
                name: ''
            })

        }
        else if (name === 'subCategoryId') {
            const selectedCategory = this.state.categories.find((category) => category._id === this.state.categoryId)
            const selectedSubCategory = selectedCategory.subCategories.find((subCategory) => subCategory._id === value)
            const selectedTypes = selectedSubCategory.types.map((type) => type._id)

            this.setState({
                [name]: value,
                name: selectedSubCategory.name,
                selectedTypes
            })
        } else {
            this.setState({ [name]: value })
        }
    }

    onTypeSelect = (event) => {
        if (event.target.checked) {
            this.state.selectedTypes.push(event.target.id)
        } else {
            this.state.selectedTypes.splice(this.state.selectedTypes.indexOf(event.target.id))
        }

        this.setState({ selectedTypes: this.state.selectedTypes })
    }

    onUpdateClick = () => {
        if (this.state.categoryId.length > 0 && this.state.subCategoryId.length > 0 && this.state.name.length > 0) {
            if (window.confirm(`Seçili alt kategoriyi güncellemek istediğinize emin misiniz?`)) {
                axios.put(`${process.env.REACT_APP_API_URL}/admin/sub-category`, {
                    parentCategoryId: this.state.categoryId,
                    subCategoryId: this.state.subCategoryId,
                    name: this.state.name,
                    types: this.state.selectedTypes
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
            types,

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

                    {
                        categoryId && (
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
                        )
                    }

                    {
                        subCategoryId && (
                            <>
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

                                <div className='form-group row'>
                                    <div className='col-md-12'>
                                        <label>Alt kategorinin içerebileceği ürün tiplerini seçiniz</label>
                                        <ul class='list-group'>
                                            {
                                                types.map((type) => (
                                                    <li class='list-group-item'>
                                                        <div class='custom-control custom-checkbox'>
                                                            <input
                                                                type='checkbox'
                                                                class='custom-control-input'
                                                                onChange={this.onTypeSelect} id={type._id}
                                                                checked={this.state.selectedTypes.includes(type._id)} />
                                                            <label class='custom-control-label' for={type._id} style={{ cursor: 'pointer' }}>{type.name}</label>
                                                        </div>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                </div>

                                <div className='form-group row mt-4'>
                                    <div className='col-lg-12'>
                                        <button className='btn btn-primary btn-block' onClick={this.onUpdateClick}>Alt Kategoriyi güncelle</button>
                                    </div>
                                </div>
                            </>
                        )
                    }

                </div>
            </div>
        )
    }
}

export default UpdateSubCategoryComponent