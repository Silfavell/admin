import React, { Component, createRef } from 'react'
import axios from 'axios'
import { IoMdCreate, IoIosClose } from 'react-icons/io'
import VanillaToasts from 'vanillatoasts'
import 'vanillatoasts/vanillatoasts.css'

import DnD from '../screens/DnD'
import SpecificationInputs from './SpecificationInputs'

import 'bootstrap/dist/css/bootstrap.min.css'
import './save-product.scss'
import ReferenceSelect from '../components/ReferenceSelect'

class UpdateProductComponent extends Component {

    specificationsRef = createRef()

    state = {
        categories: [],
        products: [],
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
        axios.get(`${process.env.REACT_APP_API_URL}/categories/as-map`).then(({ data, status }) => data)
    )

    getProducts = () => (
        axios.get(`${process.env.REACT_APP_API_URL}/products`).then(({ data, status }) => data)
    )

    getImage = (slug, index) => {
        return axios.get(`${process.env.REACT_APP_API_URL}/static?folder=products&image=${slug}_${index}_940x940.webp`, { responseType: 'blob' }).then(({ data }) => {
            return data
        }).catch(() => null)
    }

    UNSAFE_componentWillMount() {
        Promise.all([this.getCategories(), this.getProducts()]).then((vals) => {
            this.setState({ categories: vals[0], products: vals[1] })
        })
    }

    onChange = (event) => {
        let { name, value, checked } = event.target

        if (name === 'purchasable')
            value = checked

        const categoryObj = name === 'categoryId' ? {
            subCategoryId: ''
        } : {}

        const colorGroupObj = name === 'colorGroup' ? {
            colorName: '',
            colorCode: ''
        } : {}

        let productObj = {}

        // eslint-disable-next-line
        this.state.products.map((product) => {
            if (product._id === value) {
                productObj = product
                product.colorGroup = product.color ? product.colorGroup : null
                productObj.colorCode = product.color?.code ?? null
                productObj.colorName = product.color?.name ?? null

                productObj.specs = product.specifications
            }
        })

        this.setState({
            [name]: value,
            ...categoryObj,
            ...colorGroupObj,
            ...productObj
        })
    }

    changeBrandMode = () => {
        this.setState({ brandMode: +!this.state.brandMode })
    }

    onRemoveColorGroupClick = () => {
        this.setState({ colorGroup: this.state.updateId })
    }

    onRemoveUpdateIdClick = () => {
        this.setState({ updateId: '' })
    }

    onRemoveImageClick = (index) => {
        this.state.images.splice(index, 1)
        this.setState({
            images: this.setImageIds(this.state.images)
        })
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
                    value: this.specificationsRef.current.state[curVal].trim()
                }, ...prevVal]
            }, []).filter((spec) => {
                if (spec.value.trim().length > 0) {
                    return true
                }

                return false
            })

            if (specifications.length > 0) formData.append('specifications', JSON.stringify(specifications))
        }

        if (categoryId.trim().length > 0) formData.append('categoryId', categoryId.trim())
        if (subCategoryId.trim().length > 0) formData.append('subCategoryId', subCategoryId.trim())
        if (type.trim().length > 0) formData.append('type', type.trim())
        if (name.trim().length > 0) formData.append('name', name.trim())
        if (details.trim().length > 0) formData.append('details', details.trim())
        if (colorGroup?.trim().length > 0) formData.append('colorGroup', colorGroup.trim())
        if (colorName?.trim().length > 0 && colorCode?.trim().length > 0) formData.append('color', JSON.stringify({
            name: colorName.trim(),
            code: colorCode.trim()
        }))
        if (brand.trim().length > 0) formData.append('brand', brand.trim())
        if (price.toString().trim().length > 0) formData.append('price', price.toString().trim())
        if (discountedPrice.toString().trim().length > 0) formData.append('discountedPrice', discountedPrice.toString().trim())
        formData.append('purchasable', purchasable)

        return formData
    }

    onSaveProductClick = () => {
        if (window.confirm(`${this.state.name} isimli ürünü güncellemek istediğinize emin misiniz?`)) {
            const formData = this.getFormData()

            axios.put(`${process.env.REACT_APP_API_URL}/products/${this.state.updateId}`, formData, {
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
            this.setState({
                images: this.setImageIds(this.state.images)
            })
        }

        event.target.value = null
    }

    getImageData = (target, imageFile) => {
        let reader = new FileReader()

        reader.onload = (event) => {
            if (target)
                target.src = event.target.result
        }

        reader.readAsDataURL(imageFile)
    }

    uid = () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2)
    }

    setImageIds = (images) => {
        return images.map((image) => {
            if (!image._id) {
                image._id = this.uid()
            }
            return image
        })
    }

    componentDidMount() {
        document.onpaste = (event) => {
            let items = (event.clipboardData || event.originalEvent.clipboardData).items

            for (let index in items) {
                let item = items[index]
                if (item.kind === 'file') {
                    this.state.images.push(item.getAsFile())
                    this.setState({ images: this.setImageIds(this.state.images) })
                }
            }
        }
    }

    onReferenceSelect = state => {
        console.log(state)
        if (state.updateId) {
            const imageRequests = Array.from(new Array(state.imageCount)).map((_, index) => {
                try {
                    return this.getImage(state.slug, index)
                } catch (error) {
                    return false
                }
            })

            Promise.all(imageRequests).then((images) => {
                this.setState({
                    ...state,
                    images: this.setImageIds(images.filter((_) => !!_))
                })
            }).catch(() => {
                this.setState(state)
            })
        }
    }

    onColorGroupSelect = ({ colorGroup }) => {
        this.setState({ colorGroup })
    }

    render() {
        const {
            updateId,
            categories,
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
                                    <ReferenceSelect
                                        update
                                        onReferenceSelect={this.onReferenceSelect}
                                        products={this.state.products} />
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
                                        <label htmlFor='colorGroup' className='text-black'>Benzer Ürün</label>

                                        <div className='d-flex'>

                                            <div style={{ flex: 1 }}>
                                                <ReferenceSelect
                                                    key={colorGroup}
                                                    colorGroup={colorGroup}
                                                    onReferenceSelect={this.onColorGroupSelect}
                                                    products={this.state.products}
                                                />
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
                                    selectedType && (
                                        <SpecificationInputs
                                            specifications={this.state.specifications}
                                            key={selectedType._id}
                                            ref={this.specificationsRef}
                                            selectedType={selectedType} />
                                    )
                                }

                                <div className='form-group row'>
                                    <div className='col-md-12'>
                                        <label htmlFor='details' className='text-black'>Ürün detayı</label>
                                        <textarea
                                            type='text'
                                            className='form-control'
                                            id='details'
                                            name='details'
                                            rows={5}
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