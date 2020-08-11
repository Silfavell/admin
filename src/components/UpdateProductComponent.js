import React, { Component, createRef } from 'react'
import axios from 'axios'
import { IoMdCreate, IoIosClose } from 'react-icons/io'
import VanillaToasts from 'vanillatoasts'
import 'vanillatoasts/vanillatoasts.css'

import DnD from '../screens/DnD'
import SpecificationInputs from './SpecificationInputs'

import 'bootstrap/dist/css/bootstrap.min.css'
import './save-product.scss'

class UpdateProductComponent extends Component {

    specificationsRef = createRef()

    state = {
        categories: [],
        productsWithCategories: [],
        brandMode: 0,

        updateId: '',

        categoryId: '',
        subCategoryId: '',
        type: '',
        name: '',
        details: '',
        price: '',
        discountedPrice: '',
        brand: '',
        purchasable: true,
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
        return axios.get(`${process.env.REACT_APP_API_URL}/static?folder=products&image=${imagePath}-${index}.webp`, { responseType: 'blob' }).then(({ data }) => {
            return data
        }).catch(() => null)
    }

    UNSAFE_componentWillMount() {
        Promise.all([this.getCategories(), this.getProductsWithCategories()]).then((vals) => {
            this.setState({ categories: vals[0], productsWithCategories: vals[1] })
        })
    }

    onChange = (event) => {
        let { name, value, checked } = event.target

        if (name === 'purchasable')
            value = checked

        const obj = name === 'updateId' ? {
            categoryId: '',
            subCategoryId: '',
            type: '',
            name: '',
            details: '',
            price: '',
            discountedPrice: '',
            brand: '',
            colorGroup: '',

            colorName: '',
            colorCode: '',

            images: []
        } : {}

        const categoryObj = name === 'categoryId' ? {
            subCategoryId: ''
        } : {}

        const colorGroupObj = name === 'colorGroup' ? {
            colorName: '',
            colorCode: ''
        } : {}

        let productObj = {}

        // eslint-disable-next-line
        this.state.productsWithCategories.map((category) => {
            // eslint-disable-next-line
            category.subCategories.map((subCategory) => {
                // eslint-disable-next-line
                subCategory.products.map((product) => {
                    if (product._id === value) {
                        productObj = product
                        product.colorGroup = product.color ? product.colorGroup : null
                        productObj.colorCode = product.color?.code ?? null
                        productObj.colorName = product.color?.name ?? null

                        productObj.specs = product.specifications
                    }
                })
            })
        })

        if (name === 'updateId') {
            const imageRequests = Array.from(new Array(productObj.imageCount)).map((_, index) => {
                try {
                    return this.getImage(productObj.image, index)
                } catch (error) {
                    return false
                }
            })

            Promise.all(imageRequests).then((images) => {
                this.setState({
                    [name]: value,
                    ...obj,
                    ...categoryObj,
                    ...colorGroupObj,
                    ...productObj,
                    images: images.filter((_) => !!_)
                })
            })
        } else {
            this.setState({
                [name]: value,
                ...obj,
                ...categoryObj,
                ...colorGroupObj,
                ...productObj
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

    setImages = (images) => {
        this.setState({ images })
    }

    getFormData = () => {
        const {
            categoryId,
            subCategoryId,
            type,
            name,
            details,
            colorGroup,

            colorName,
            colorCode,

            brand,
            price,
            discountedPrice,
            purchasable,
            images
        } = this.state

        const formData = new FormData()
        // eslint-disable-next-line
        images.map((image, index) => {
            formData.append('image-' + index, image)
        })

        if (this.specificationsRef.current) {
            const specifications = Object.keys(this.specificationsRef.current.state).reduce((prevVal, curVal) => {
                return [{
                    name: curVal,
                    value: this.specificationsRef.current.state[curVal]
                }, ...prevVal]
            }, [])

            if (specifications.length > 0) formData.append('specifications', JSON.stringify(specifications))
        }

        if (categoryId.length > 0) formData.append('categoryId', categoryId)
        if (subCategoryId.length > 0) formData.append('subCategoryId', subCategoryId)
        if (type.length > 0) formData.append('type', type)
        if (name.length > 0) formData.append('name', name)
        if (details.length > 0) formData.append('details', details)
        if (colorGroup?.length > 0) formData.append('colorGroup', colorGroup)
        if (colorName?.length > 0 && colorCode?.length > 0) formData.append('color', JSON.stringify({
            name: colorName,
            code: colorCode
        }))
        if (brand.length > 0) formData.append('brand', brand)
        if (price.length > 0) formData.append('price', price)
        if (discountedPrice.length > 0) formData.append('discountedPrice', discountedPrice)
        formData.append('purchasable', purchasable)

        return formData
    }

    onSaveProductClick = () => {
        if (window.confirm(`${this.state.name} isimli ürünü güncellemek istediğinize emin misiniz?`)) {
            const formData = this.getFormData()

            axios.put(`${process.env.REACT_APP_API_URL}/admin/product/${this.state.updateId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(({ status }) => {
                if (status === 200) {
                    VanillaToasts.create({
                        title: 'Ürün güncellendi',
                        type: 'success',
                        positionClass: 'topRight',
                        timeout: 3 * 1000
                    })

                    this.setState({
                        updateId: '',
                        categoryId: '',
                        subCategoryId: '',
                        type: '',
                        name: '',
                        details: '',
                        price: '',
                        discountedPrice: '',
                        purchasable: true,
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

        if (files) {
            this.state.images.push(...files)
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
            type,
            name,
            details,
            brand,
            price,
            discountedPrice,
            purchasable,
            colorGroup,

            colorName,
            colorCode
        } = this.state

        const selectedCategory = this.state.categories.find((category) => category._id === categoryId)
        const selectedSubCategory = selectedCategory?.subCategories.find((subCategory) => subCategory._id === subCategoryId)
        const selectedType = selectedSubCategory?.types.find((t) => t._id === type)

        return (
            <div className='p-3 border'>
                <div className='col-md-12'>
                    <div className='form-group row'>
                        <div className='col-md-12'>
                            <label htmlFor='updateId' className='text-black'>Düzenlemek istediğiniz ürünü seçiniz  <span className='text-danger'>*</span></label>

                            <div className='d-flex'>

                                <div style={{ flex: 1 }}>
                                    <select
                                        type='text'
                                        className='form-control'
                                        id='updateId'
                                        name='updateId'
                                        onChange={this.onChange}
                                        value={updateId}>
                                        <option selected unselectable value={null}>Düzenlemek istediğiniz ürünü seçiniz</option>
                                        {
                                            productsWithCategories.map((category) => {
                                                return category.subCategories.map((subCategory) => {
                                                    return subCategory.products.map((product) => (
                                                        <option key={product._id} value={product._id}>{product.name}</option>
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

                    {
                        updateId.length > 0 ? (
                            <>
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
                                                    <option key={category._id} value={category._id}>{category.name}</option>
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
                                        <label htmlFor='type' className='text-black'>Ürün Tipi <span className='text-danger'>*</span></label>
                                        <select
                                            className='form-control'
                                            id='type'
                                            name='type'
                                            onChange={this.onChange}
                                            value={type}>
                                            <option selected unselectable value={null}>Ürün Tipi seçiniz</option>
                                            {
                                                selectedSubCategory?.types.map((type) => (
                                                    <option value={type._id}>{type.name}</option>
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

                                {
                                    selectedType && <SpecificationInputs
                                        specifications={this.state.specifications}
                                        key={selectedType._id}
                                        ref={this.specificationsRef}
                                        selectedType={selectedType} />
                                }

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

                                <div className='form-group row'>
                                    <div className='col-md-8' />
                                    <div className='col-md-4 d-flex align-items-center justify-content-end'>
                                        <label className='text-black'>Ürün Aktifliği</label>
                                        <label className='switch ml-4'>
                                            <input name='purchasable' className='switch-input' type='checkbox' onChange={this.onChange} checked={purchasable} />
                                            <span className='slider round'></span>
                                        </label>
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
                                        <button className='btn btn-primary btn-block' onClick={this.onSaveProductClick}>Ürünü güncelle</button>
                                    </div>
                                </div>
                            </>
                        ) : <></>
                    }
                </div>
            </div>
        )
    }
}

export default UpdateProductComponent