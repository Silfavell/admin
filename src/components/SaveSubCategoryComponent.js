import React, { Component } from 'react'
import axios from 'axios'
import { IoMdCreate, IoIosClose } from 'react-icons/io'

import 'bootstrap/dist/css/bootstrap.min.css'

class SaveSubCategoryComponent extends Component {

    state = {
        categories: [],
        parentCategory: null,
        subCategoryName: ''
    }

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    onSaveClick = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/admin/sub-category`, {
            parentCategoryId: this.state.parentCategory,
            name: this.state.subCategoryName
        }).then(({ status, data }) => {
            if (status === 200) {
                alert('Alt kategori eklendi')
            }
        }).catch((reason) => {
            alert(reason.response.data.error)
        })
    }

    getCategories = () => (
        axios.get(`${process.env.REACT_APP_API_URL}/categories`).then(({ data, status }) => data)
    )

    UNSAFE_componentWillMount() {
        this.getCategories().then((categories) => {
            this.setState({ categories })
        })
    }

    render() {
        const {
            subCategoryName,
            parentCategory,
            categories
        } = this.state

        return (
            <div className='p-3 mt-4 border'>
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
                            <option selected unselectable value={null}>Üst kategori seçiniz</option>
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
                        <button className='btn btn-primary btn-block' onClick={this.onSaveClick}>Alt kategori Ekle</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default SaveSubCategoryComponent