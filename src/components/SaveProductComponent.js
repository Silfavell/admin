import React, { Component } from 'react'
import axios from 'axios'
import { IoMdCreate, IoIosClose } from 'react-icons/io'

import 'bootstrap/dist/css/bootstrap.min.css'
import './save-product.scss'

class SaveProductComponent extends Component {

    state = {
        categories: [],
        productsWithCategories: [],
        brandMode: 0,

        updateId: '',

        categoryId: '',
        subCategoryId: '',
        name: '',
        price: '',
        discountedPrice: '',
        brand: '',
        colorGroup: '',
        colorName: '',
        colorCode: '',
        images: []
    }

    getCategories = () => (
        axios.get(`${process.env.REACT_APP_API_URL}/categories`).then(({ data, status }) => data)
    )

    getProductsWithCategories = () => (
        axios.get(`${process.env.REACT_APP_API_URL}/products-with-categories`).then(({ data, status }) => data)
    )

    getImage = (imagePath, index) => {
        return axios.get(`http://localhost:3000/static?folder=products&image=${imagePath}-${index}.webp`, { responseType: 'blob' }).then(({ data }) => {
            return data
        })
    }

    UNSAFE_componentWillMount() {
        Promise.all([this.getCategories(), this.getProductsWithCategories()]).then((vals) => {
            this.setState({ categories: vals[0], productsWithCategories: vals[1] })
        })
    }

    onChange = (event) => {
        const { name, value } = event.target

        const categoryObj = name === 'categoryId' ? {
            brand: '',
            subCategoryId: ''
        } : {}

        const colorGroupObj = name === 'colorGroup' ? {
            colorName: '',
            colorCode: ''
        } : {}

        let productObj = {}

        if (name === 'updateId') {
            this.state.productsWithCategories.map((category) => {
                category.subCategories.map((subCategory) => {
                    subCategory.products.map((product) => {
                        if (product._id === value) {
                            productObj = product
                            product.colorGroup = product.color ? product.colorGroup : null
                            productObj.colorCode = product.color?.code ?? null
                            productObj.colorName = product.color?.name ?? null
                        }
                    })
                })
            })

            const imageRequests = Array.from(new Array(productObj.imageCount)).map((_, index) => {
                return this.getImage(productObj.image, index)
            })

            Promise.all(imageRequests).then((images) => {
                this.setState({
                    [name]: value,
                    images,
                    ...categoryObj,
                    ...productObj,
                    ...colorGroupObj
                })
            })
        } else {
            this.setState({
                [name]: value,
                ...categoryObj,
                ...productObj,
                ...colorGroupObj
            })
        }

    }

    changeBrandMode = () => {
        this.setState({ brandMode: +!this.state.brandMode })
    }

    onRemoveColorGroupClick = () => {
        this.setState({ colorGroup: '' })
    }

    onRemoveUpdateIdClick = () => {
        this.setState({ updateId: '' })
    }

    onRemoveImageClick = (index) => {
        this.state.images.splice(index, 1)
        this.setState({ images: this.state.images })
    }

    getFormData = () => {
        const {
            updateId,
            categoryId,
            subCategoryId,
            name,
            colorGroup,
            colorName,
            colorCode,
            brand,
            price,
            discountedPrice,
            images
        } = this.state

        const formData = new FormData()
        // eslint-disable-next-line
        images.map((image, index) => {
            formData.append('image-' + index, image)
        })

        categoryId.length > 0 && formData.append('categoryId', categoryId)
        subCategoryId.length > 0 && formData.append('subCategoryId', subCategoryId)
        name.length > 0 && formData.append('name', name)
        colorGroup.length > 0 && formData.append('colorGroup', colorGroup)
        colorName.length > 0 && colorCode.length > 0 && formData.append('color', JSON.stringify({
            name: colorName,
            code: colorCode
        }))
        brand.length > 0 && formData.append('brand', brand)
        price.length > 0 && formData.append('price', price)
        discountedPrice.length > 0 && formData.append('discountedPrice', discountedPrice)

        return formData
    }

    onSaveProductClick = () => {
        if (window.confirm(`${this.state.name} isimli ürünü eklemek istediğinize emin misiniz?`)) {
            const formData = this.getFormData()

            if (this.state.updateId) {
                axios.put(`${process.env.REACT_APP_API_URL}/admin/product/${this.state.updateId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(({ status }) => {
                    if (status === 200) {
                        alert('Ürün güncellendi')
                    }
                }).catch((reason) => {
                    alert(reason.response.data.error)
                })
            } else {
                axios.post(`${process.env.REACT_APP_API_URL}/admin/product`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(({ status }) => {
                    if (status === 200) {
                        alert('Ürün eklendi')
                    }
                }).catch((reason) => {
                    alert(reason.response.data.error)
                })
            }
        }
    }

    handleFileChange = (event) => {
        const { files } = event.target

        if (files && files[0]) {
            this.state.images.push(files[0])
            this.setState({ images: this.state.images })
        }
    }

    getImageData = (target, imageFile) => {
        let reader = new FileReader()

        reader.onload = (event) => {
            if (target)
                target.src = event.target.result
        }

        reader.readAsDataURL(imageFile)
    }

    render() {
        const {
            updateId,
            categories,
            productsWithCategories,
            brandMode,
            images,

            categoryId,
            subCategoryId,
            name,
            brand,
            price,
            discountedPrice,
            colorGroup,
            colorName,
            colorCode
        } = this.state

        return (
            <div className='p-3 border'>
                <div className='col-md-12'>
                    <div className='form-group row'>
                        <div className='col-md-12'>
                            <label htmlFor='updateId' className='text-black'>Düzenlemek istediğin ürünü seçebilirsin</label>

                            <div className='d-flex'>

                                <div style={{ flex: 1 }}>
                                    <select
                                        type='text'
                                        className='form-control'
                                        id='updateId'
                                        name='updateId'
                                        onChange={this.onChange}
                                        value={updateId}>
                                        <option selected unselectable value={null}>Düzenlemek istediğin ürünü seçebilirsin</option>
                                        {
                                            productsWithCategories.map((category) => {
                                                return category.subCategories.map((subCategory) => {
                                                    return subCategory.products.map((product) => (
                                                        <option value={product._id}>{product.name}</option>
                                                    ))
                                                })
                                            })
                                        }
                                    </select>
                                </div>

                                <div
                                    className={'ml-2 px-3 border d-flex align-items-center justify-content-center'}
                                    style={{ cursor: 'pointer' }}
                                    onClick={this.onRemoveUpdateIdClick}>
                                    <IoIosClose size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='form-group row'>

                        <div className='col-md-6'>
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

                        <div className='col-md-6'>
                            <label htmlFor='subCategoryId' className='text-black'>Alt kategori <span className='text-danger'>*</span></label>
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
                            <label htmlFor='price' className='text-black'>İndirimli Fiyat <span className='text-danger'>*</span> </label>
                            <input
                                type='text'
                                className='form-control'
                                id='discountedPrice'
                                name='discountedPrice'
                                onChange={this.onChange}
                                placeholder='İndirimli Ürün fiyatı giriniz'
                                value={discountedPrice} />
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
                                                <option selected unselectable value={null}>Marka seçiniz</option>
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
                                        <option selected unselectable value={null}>Renk grubu seçebilirsiniz</option>
                                        {
                                            productsWithCategories.find((category) => category._id === categoryId)
                                                ?.subCategories.find((subCategory) => subCategory._id === subCategoryId)
                                                ?.products.map((product) => (
                                                    product.colorGroup && <option value={product._id}>{product.name}</option>
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

                    <div className='form-group row'>
                        <div className='col-md-6'>
                            <label htmlFor='colorName' className='text-black'>Renk adı</label>
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
                            <label htmlFor='colorCode' className='text-black'>Renk kodu</label>
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

                    <div className='d-flex direction-column' style={{ overflowX: 'scroll', overflowY: 'hidden' }}>

                        <div className='preview mb-4' style={{ position: 'relative', height: 240, width: 240 }}>
                            <label
                                id='image-label'
                                htmlFor='image'
                                onChange={this.handleFileChange}
                                className='text-black'>Ürün Resimi <span className='text-danger'>*</span>
                            </label>
                            <input
                                id='image'
                                type='file'
                                accept='image/*'
                                onChange={this.handleFileChange}
                            />
                        </div>

                        {
                            images.map((image, index) => (
                                <div className='preview ml-4 mb-4' style={{ position: 'relative', height: 240, width: 240 }}>
                                    <div
                                        onClick={() => this.onRemoveImageClick(index)}
                                        style={{ position: 'absolute', top: 10, right: 10, padding: 5, cursor: 'pointer', backgroundColor: 'red' }}>
                                        <IoIosClose size={24} />
                                    </div>
                                    <img style={{ width: '100%', height: '100%' }} alt='' ref={ref => this.getImageData(ref, image)} />
                                </div>
                            ))
                        }
                    </div>

                    {
                        !updateId ? (
                            <div className='form-group row mt-4'>
                                <div className='col-lg-12'>
                                    <button className='btn btn-primary btn-block' onClick={this.onSaveProductClick}>Ürünü ekle</button>
                                </div>
                            </div>
                        ) : (
                                <div className='form-group row mt-4'>
                                    <div className='col-lg-12'>
                                        <button className='btn btn-primary btn-block' onClick={this.onSaveProductClick}>Ürünü güncelle</button>
                                    </div>
                                </div>
                            )
                    }

                </div>
            </div>
        )
    }
}

export default SaveProductComponent