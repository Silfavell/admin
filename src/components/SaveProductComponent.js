import React, { Component } from 'react'
import axios from 'axios'
import { IoMdCreate, IoIosClose } from 'react-icons/io'

import DnD from '../screens/DnD'

import 'bootstrap/dist/css/bootstrap.min.css'
import './save-product.scss'

class SaveProductComponent extends Component {

    state = {
        categories: [],
        productsWithCategories: [],
        brandMode: 0,

        categoryId: '',
        subCategoryId: '',
        name: '',
        details: '',
        price: '',
        discountedPrice: '',
        brand: '',
        colorGroup: '',

        colorName: '',
        colorCode: '',

        form: '',
        benefit: '',
        colorDetail: '',
        kind: '',
        brushThickness: '',
        feature: '',

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
            subCategoryId: ''
        } : {}

        const colorGroupObj = name === 'colorGroup' ? {
            colorName: '',
            colorCode: ''
        } : {}

        this.setState({
            [name]: value,
            ...categoryObj,
            ...colorGroupObj
        })

    }

    changeBrandMode = () => {
        this.setState({ brandMode: +!this.state.brandMode })
    }

    onRemoveColorGroupClick = () => {
        this.setState({ colorGroup: '' })
    }

    onRemoveImageClick = (index) => {
        this.state.images.splice(index, 1)
        this.setState({ images: this.state.images })
    }

    setImages = (images) => {
        this.setState({ images })
    }

    getFormData = () => {
        const {
            categoryId,
            subCategoryId,
            name,
            details,
            colorGroup,

            colorName,
            colorCode,

            form,
            benefit,
            colorDetail,
            kind,
            brushThickness,
            feature,

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

        const specifications = {}

        if (form.length > 0) specifications.form = form
        if (benefit.length > 0) specifications.benefit = benefit
        if (colorDetail.length > 0) specifications.colorDetail = colorDetail
        if (kind.length > 0) specifications.kind = kind
        if (brushThickness.length > 0) specifications.brushThickness = brushThickness
        if (feature.length > 0) specifications.feature = feature

        if (categoryId.length > 0) formData.append('categoryId', categoryId)
        if (subCategoryId.length > 0) formData.append('subCategoryId', subCategoryId)
        if (name.length > 0) formData.append('name', name)
        if (details.length > 0) formData.append('details', details)
        if (colorGroup.length > 0) formData.append('colorGroup', colorGroup)
        if (colorName.length > 0 && colorCode.length > 0) {
            formData.append('color', JSON.stringify({
                name: colorName,
                code: colorCode
            }))
        }

        if (Object.keys(specifications).length > 0) formData.append('specifications', JSON.stringify(specifications))
        if (brand.length > 0) formData.append('brand', brand)
        if (price.length > 0) formData.append('price', price)
        if (discountedPrice.length > 0) formData.append('discountedPrice', discountedPrice)

        return formData
    }

    onSaveProductClick = () => {
        if (window.confirm(`${this.state.name} isimli ürünü eklemek istediğinize emin misiniz?`)) {
            const formData = this.getFormData()

            axios.post(`${process.env.REACT_APP_API_URL}/admin/product`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(({ status }) => {
                if (status === 200) {
                    alert('Ürün eklendi')

                    this.setState({
                        categoryId: '',
                        subCategoryId: '',
                        name: '',
                        details: '',
                        price: '',
                        discountedPrice: '',
                        brand: '',
                        colorGroup: '',
                        colorName: '',
                        colorCode: '',
                        images: []
                    })
                }
            })
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
            categories,
            productsWithCategories,
            brandMode,
            images,

            categoryId,
            subCategoryId,
            name,
            details,
            brand,
            price,
            discountedPrice,
            colorGroup,

            colorName,
            colorCode,

            form,
            benefit,
            colorDetail,
            kind,
            brushThickness,
            feature,
        } = this.state

        return (
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

                    <div className='form-group row'>
                        <div className='col-md-4'>
                            <label htmlFor='form' className='text-black'>Form</label>
                            <input
                                type='text'
                                className='form-control'
                                id='form'
                                name='form'
                                onChange={this.onChange}
                                value={form}
                                placeholder='Form giriniz' />
                        </div>
                        <div className='col-md-4'>
                            <label htmlFor='benefit' className='text-black'>İhtiyaç/Yarar</label>
                            <input
                                type='text'
                                className='form-control'
                                id='benefit'
                                name='benefit'
                                onChange={this.onChange}
                                value={benefit}
                                placeholder='İhtiyaç/Yarar giriniz' />
                        </div>
                        <div className='col-md-4'>
                            <label htmlFor='colorDetail' className='text-black'>Bitiş</label>
                            <input
                                type='text'
                                className='form-control'
                                id='colorDetail'
                                name='colorDetail'
                                onChange={this.onChange}
                                value={colorDetail}
                                placeholder='Bitiş giriniz' />
                        </div>
                    </div>

                    <div className='form-group row'>
                        <div className='col-md-4'>
                            <label htmlFor='brushThickness' className='text-black'>Fırça Kalınlığı</label>
                            <input
                                type='text'
                                className='form-control'
                                id='brushThickness'
                                name='brushThickness'
                                onChange={this.onChange}
                                value={brushThickness}
                                placeholder='Fırça Kalınlığı giriniz' />
                        </div>
                        <div className='col-md-4'>
                            <label htmlFor='kind' className='text-black'>Çeşit</label>
                            <input
                                type='text'
                                className='form-control'
                                id='kind'
                                name='kind'
                                onChange={this.onChange}
                                value={kind}
                                placeholder='Çeşit giriniz' />
                        </div>
                        <div className='col-md-4'>
                            <label htmlFor='feature' className='text-black'>Özellik</label>
                            <input
                                type='text'
                                className='form-control'
                                id='feature'
                                name='feature'
                                onChange={this.onChange}
                                value={feature}
                                placeholder='Özellik giriniz' />
                        </div>
                    </div>

                    <div className='form-group row'>
                        <div className='col-md-12'>
                            <label htmlFor='details' className='text-black'>Ürün detayı</label>
                            <textarea
                                type='text'
                                className='form-control'
                                id='details'
                                name='details'
                                placeholder='Ürün detayını giriniz'
                                onChange={this.onChange}
                                value={details} />
                        </div>
                    </div>

                    <DnD
                        images={images}
                        handleFileChange={this.handleFileChange}
                        onRemoveImageClick={this.onRemoveImageClick}
                        setImages={this.setImages}
                    />


                    <div className='form-group row mt-4'>
                        <div className='col-lg-12'>
                            <button className='btn btn-primary btn-block' onClick={this.onSaveProductClick}>Ürünü ekle</button>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default SaveProductComponent