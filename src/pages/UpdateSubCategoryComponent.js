import React, { Component } from 'react'
import axios from 'axios'
import VanillaToasts from 'vanillatoasts'
import 'vanillatoasts/vanillatoasts.css'

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
        axios.get(`${process.env.REACT_APP_API_URL}/types`).then(({ data, status }) => data)
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
            const selectedTypes = selectedSubCategory.types

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
                axios.put(`${process.env.REACT_APP_API_URL}/categories/sub-category`, {
                    parentCategoryId: this.state.categoryId,
                    subCategoryId: this.state.subCategoryId,
                    name: this.state.name,
                    types: this.state.selectedTypes
                }).then(({ status }) => {
                    if (status === 200) {
                        VanillaToasts.create({
                            title: 'Alt kategori güncellendi',
                            type: 'success',
                            positionClass: 'topRight',
                            timeout: 3 * 1000
                        })

                        this.setState({ categoryId: '', subCategoryId: '', name: '' })
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
            types,
            categoryId,
            subCategoryId,
            name
        } = this.state

        console.log(this.state)

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
                                        <ul className='list-group'>
                                            {
                                                types.map((type) => (
                                                    <li className='list-group-item'>
                                                        <div className='custom-control custom-checkbox'>
                                                            <input
                                                                type='checkbox'
                                                                className='custom-control-input'
                                                                onChange={this.onTypeSelect} id={type._id}
                                                                checked={this.state.selectedTypes.includes(type._id)} />
                                                            <label className='custom-control-label' htmlFor={type._id} style={{ cursor: 'pointer' }}>{type.name}</label>
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