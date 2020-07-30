import React, { Component } from 'react'
import axios from 'axios'

import 'bootstrap/dist/css/bootstrap.min.css'

class SaveSubCategoryComponent extends Component {

    state = {
        categories: [],
        types: [],

        selectedTypes: [],
        parentCategory: null,
        subCategoryName: ''
    }

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    onTypeSelect = (event) => {
        if (event.target.checked) {
            this.state.selectedTypes.push(event.target.id)
        } else {
            this.state.selectedTypes.splice(this.state.selectedTypes.indexOf(event.target.id))
        }

        this.setState({ selectedTypes: this.state.selectedTypes })
    }

    onSaveClick = () => {
        if (window.confirm(`${this.state.subCategoryName} isimli alt kategoriyi eklemek istediğinize emin misiniz ?`)) {
            axios.post(`${process.env.REACT_APP_API_URL}/admin/sub-category`, {
                parentCategoryId: this.state.parentCategory,
                name: this.state.subCategoryName,
                types: this.state.selectedTypes
            }).then(({ status, data }) => {
                if (status === 200) {
                    alert('Alt kategori eklendi')
                }
            })
        }
    }

    getCategories = () => (
        axios.get(`${process.env.REACT_APP_API_URL}/categories`).then(({ data, status }) => data)
    )

    getTypes = () => (
        axios.get(`${process.env.REACT_APP_API_URL}/admin/types`).then(({ data, status }) => data)
    )

    UNSAFE_componentWillMount() {
        Promise.all([this.getCategories(), this.getTypes()]).then((vals) => {
            this.setState({ categories: vals[0], types: vals[1] })
        })
    }

    render() {
        const {
            subCategoryName,
            parentCategory,

            categories,
            types
        } = this.state

        return (
            <div className='p-3 border'>
                <div className='form-group'>
                    <div className='col-md-12'>
                        <label htmlFor='parentCategory' className='text-black'>Üst kategori <span className='text-danger'>*</span></label>
                        <select
                            type='text'
                            className='form-control'
                            id='parentCategory'
                            name='parentCategory'
                            onChange={this.onChange}
                            value={parentCategory}>
                            <option selected unselectable={'true'} value={null}>Üst kategori seçiniz</option>
                            {
                                categories.map((category) => (
                                    <option value={category._id}>{category.name}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>

                <div className='form-group'>
                    <div className='col-md-12'>
                        <label htmlFor='subCategoryName' className='text-black'>Alt kategori Adı <span className='text-danger'>*</span></label>
                        <input
                            type='text'
                            className='form-control'
                            id='subCategoryName'
                            name='subCategoryName'
                            placeholder='Alt kategori adını giriniz'
                            onChange={this.onChange}
                            value={subCategoryName} />
                    </div>
                </div>

                <div className='form-group'>
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

                <div className='form-group'>
                    <div className='col-md-12'>
                        <button className='btn btn-primary btn-block' onClick={this.onSaveClick}>Alt kategori ekle</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default SaveSubCategoryComponent