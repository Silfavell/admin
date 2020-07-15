import React, { Component } from 'react'
import axios from 'axios'
import { IoMdCreate, IoIosClose } from 'react-icons/io'

import 'bootstrap/dist/css/bootstrap.min.css'

import SaveCategoryComponent from '../components/SaveCategoryComponent'
import SaveSubCategoryComponent from '../components/SaveSubCategoryComponent'

class Home extends Component {

    state = {
        categories: [],
        productsWithCategories: [],
        brandMode: 0,

        categoryId: null,
        subCategoryId: null,
        name: null,
        price: null,
        brand: null,
        colorGroup: null
    }

    getCategories = () => (
        axios.get(`${process.env.REACT_APP_API_URL}/categories`).then(({ data, status }) => data)
    )

    getProductsWithCategories = () => (
        axios.get(`${process.env.REACT_APP_API_URL}/products-with-categories`).then(({ data, status }) => data)
    )

    UNSAFE_componentWillMount() {
        Promise.all([this.getCategories(), this.getProductsWithCategories()]).then((vals) => {
            this.setState({ categories: vals[0], productsWithCategories: vals[1] })
        })
    }

    onChange = (event) => {
        const categoryObj = event.target.name === 'categoryId' ? {
            brand: null,
            subCategoryId: null
        } : {}

        this.setState({
            [event.target.name]: event.target.value,
            ...categoryObj
        })
    }

    changeBrandMode = () => {
        this.setState({ brandMode: +!this.state.brandMode })
    }

    onRemoveColorGroupClick = () => {
        this.setState({ colorGroup: null })
    }

    onSaveProductClick = () => {
        const {
            categoryId,
            subCategoryId,
            name,
            colorGroup,
            colorName,
            colorCode,
            brand,
            price
        } = this.state

        const colorGroupObj = colorGroup ? {
            colorGroup,
            color: {
                name: colorName,
                code: colorCode
            }
        } : {}

        axios.post(`${process.env.REACT_APP_API_URL}/admin/product`, {
            categoryId,
            subCategoryId,
            name,
            brand,
            price: parseInt(price),
            ...colorGroupObj
        }).then(({ status, data }) => {
            if (status === 200) {
                alert('Ürün eklendi')
            }
        }).catch((reason) => {
            alert(reason.response.data.error)
        })
    }

    render() {
        const {
            categories,
            productsWithCategories,
            brandMode,

            categoryId,
            subCategoryId,
            name,
            brand,
            price,
            colorGroup,
            colorName,
            colorCode
        } = this.state

        return (
            <div className='col-md-12 py-4'>
                <div className='row'>
                    <div className='col-md-4'>
                        <div className='col-md-12'>
                            <SaveCategoryComponent />
                            <SaveSubCategoryComponent />
                        </div>
                    </div>

                    <div className='col-md-4'>
                        <div className='p-3 border'>
                            <div className='col-md-12'>
                                <div className='form-group row'>

                                    <div className='col-md-6'>
                                        <label htmlFor='categoryId' className='text-black'>Kategori <span className='text-danger'>*</span></label>
                                        <select
                                            className='form-control'
                                            id='categoryId'
                                            name='categoryId'
                                            onChange={this.onChange}
                                            value={categoryId}>
                                            <option selected disabled value={null}>Kategori seçiniz</option>
                                            {
                                                categories.map((category) => (
                                                    <option value={category._id}>{category.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>

                                    <div className='col-md-6'>
                                        <label htmlFor='subCategoryId' className='text-black'>Alt kategori <span className='text-danger'>*</span></label>
                                        <select
                                            type='text'
                                            className='form-control'
                                            id='subCategoryId'
                                            name='subCategoryId'
                                            onChange={this.onChange}
                                            value={subCategoryId}>
                                            <option selected disabled value={null}>Alt kategori seçiniz</option>
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
                                        <label htmlFor='name' className='text-black'>Ad <span className='text-danger'>*</span></label>
                                        <input
                                            type='text'
                                            className='form-control'
                                            id='name'
                                            name='name'
                                            placeholder='Ürün adını giriniz'
                                            onChange={this.onChange}
                                            value={name} />
                                    </div>
                                </div>

                                <div className='form-group row'>
                                    <div className='col-md-12'>
                                        <label htmlFor='price' className='text-black'>Fiyat <span className='text-danger'>*</span> </label>
                                        <input
                                            type='text'
                                            className='form-control'
                                            id='price'
                                            name='price'
                                            onChange={this.onChange}
                                            placeholder='Ürün fiyatı giriniz'
                                            value={price} />
                                    </div>
                                </div>

                                <div className='form-group row'>
                                    <div className='col-md-12'>
                                        <label htmlFor='brand' className='text-black'>Marka <span className='text-danger'>*</span> </label>
                                        <div className='d-flex'>

                                            <div style={{ flex: 1 }}>
                                                {
                                                    brandMode === 0 ? (
                                                        <select
                                                            type='text'
                                                            className='form-control'
                                                            id='brand'
                                                            onChange={this.onChange}
                                                            value={brand}
                                                            name='brand'>
                                                            <option selected disabled value={null}>Marka seçiniz</option>
                                                            {
                                                                categories.find((category) => category._id === categoryId)?.brands.map((brand) => (
                                                                    <option value={brand.name}>{brand.name}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    ) : (
                                                            <input
                                                                type='text'
                                                                className='form-control'
                                                                id='brand'
                                                                onChange={this.onChange}
                                                                value={brand}
                                                                name='brand' />
                                                        )
                                                }
                                            </div>

                                            <div className={'ml-2 px-3 border d-flex align-items-center justify-content-center'} style={{ cursor: 'pointer' }} onClick={this.changeBrandMode}>
                                                <IoMdCreate size={24} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='form-group row'>
                                    <div className='col-md-12'>
                                        <label htmlFor='colorGroup' className='text-black'>Renk grubu (Referans ürün)</label>

                                        <div className='d-flex'>

                                            <div style={{ flex: 1 }}>
                                                <select
                                                    type='text'
                                                    className='form-control'
                                                    id='colorGroup'
                                                    name='colorGroup'
                                                    onChange={this.onChange}
                                                    value={colorGroup}
                                                    placeholder='Renk grubu giriniz (Seçili ürünle aynı renk grubu)'>
                                                    <option selected disabled value={null}>Renk grubu seçebilirsiniz</option>
                                                    {
                                                        productsWithCategories.find((category) => category._id === categoryId)
                                                            ?.subCategories.find((subCategory) => subCategory._id === subCategoryId)
                                                            ?.products.map((product) => (
                                                                product.colorGroup && <option value={product.colorGroup}>{product.name}</option>
                                                            ))
                                                    }
                                                </select>
                                            </div>

                                            <div
                                                className={'ml-2 px-3 border d-flex align-items-center justify-content-center'}
                                                style={{ cursor: 'pointer' }}
                                                onClick={this.onRemoveColorGroupClick}>
                                                <IoIosClose size={24} />
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                {
                                    colorGroup && (
                                        <div className='form-group row'>
                                            <div className='col-md-6'>
                                                <label htmlFor='colorName' className='text-black'>Renk adı <span className='text-danger'>*</span></label>
                                                <input
                                                    type='text'
                                                    className='form-control'
                                                    id='colorName'
                                                    name='colorName'
                                                    onChange={this.onChange}
                                                    value={colorName}
                                                    placeholder='Renk adı giriniz' />
                                            </div>
                                            <div className='col-md-6'>
                                                <label htmlFor='colorCode' className='text-black'>Renk kodu <span className='text-danger'>*</span></label>
                                                <input
                                                    type='text'
                                                    className='form-control'
                                                    id='colorCode'
                                                    name='colorCode'
                                                    onChange={this.onChange}
                                                    value={colorCode}
                                                    placeholder='Renk kodu giriniz' />
                                            </div>
                                        </div>
                                    )
                                }

                                <div className='form-group row'>
                                    <div className='col-lg-12'>
                                        <button className='btn btn-primary btn-block' onClick={this.onSaveProductClick}>Ürünü ekle</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home
