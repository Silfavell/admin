import React, { Component } from 'react'
import Select from 'react-select'

class ReferenceSelect extends Component {
    getOptions = () => {
        let products = this.props.productsWithCategories.map((category) => {
            return category.subCategories.map((subCategory) => {
                return subCategory.products.map((product) => {
                    if (this.props.colorGroup && !product.color) {
                        return null
                    }

                    return ({ value: product._id, label: product.name })
                })
            })
        }).reduce((p, c) => [...p, ...c], [])
            .reduce((p, c) => [...p, ...c], [])

        if (this.props.colorGroup) {
            products = products.filter((product) => !!product)
        }

        return products
    }

    onReferenceChange = (option) => {
        const obj = {
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
        }

        if (option) {
            let productObj = this.getSelectedProduct(option.value)

            if (this.props.update) {
                this.props.onReferenceSelect({
                    updateId: option.value,
                    ...obj,
                    ...productObj,
                    colorName: productObj.color?.name ?? '',
                    colorCode: productObj.color?.code ?? ''
                })
            } else {
                this.props.onReferenceSelect({
                    updateId: option.value,
                    ...obj,
                    ...productObj
                })
            }
        } else {
            this.props.onReferenceSelect({
                updateId: '',
                ...obj
            })
        }
    }

    getSelectedProduct = (_id, colorGroup) => {
        // eslint-disable-next-line
        return this.props.productsWithCategories.map((category) => {
            // eslint-disable-next-line
            return category.subCategories.map((subCategory) => {
                // eslint-disable-next-line
                return subCategory.products.map((product) => {
                    if (colorGroup) {
                        if (product.colorGroup === _id) {
                            let productObj = Object.assign({}, product)

                            return productObj
                        }
                    } else {
                        if (product._id === _id) {
                            let productObj = Object.assign({}, product)

                            if (!this.props.update) {
                                productObj.specifications = product.specifications.filter((spec) => spec.name !== 'Renk Tonu')
                                delete productObj.name
                            }

                            return productObj
                        }
                    }
                })
            })
        }).reduce((p, c) => [...p, ...c], []).reduce((p, c) => [...p, ...c], []).find((el) => !!el)
    }

    getDefaultValue = () => {
        if (this.props.colorGroup) {
            const product = this.getSelectedProduct(this.props.colorGroup, true)

            if (product) {
                return ({
                    label: product.name,
                    value: product._id
                })
            }
        }

        return null
    }

    render() {
        return (
            <Select
                onChange={this.onReferenceChange}
                isSearchable
                isClearable
                defaultValue={this.getDefaultValue()}
                options={this.getOptions()} />
        )
    }
}

export default ReferenceSelect