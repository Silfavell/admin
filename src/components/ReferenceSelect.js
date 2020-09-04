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
            let productObj = {}

            // eslint-disable-next-line
            this.props.productsWithCategories.map((category) => {
                // eslint-disable-next-line
                category.subCategories.map((subCategory) => {
                    // eslint-disable-next-line
                    subCategory.products.map((product) => {
                        if (product._id === option.value) {
                            productObj = Object.assign({}, product)

                            if (!this.props.update) {
                                productObj.specifications = product.specifications.filter((spec) => spec.name !== 'Renk Tonu')
                                delete productObj.name
                            }
                        }
                    })
                })
            })

            this.props.onReferenceSelect({
                updateId: option.value,
                ...obj,
                ...productObj
            })
        } else {
            this.props.onReferenceSelect({
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
                colorCode: ''
            })
        }
    }

    render() {
        return (
            <Select
                onChange={this.onReferenceChange}
                isSearchable
                isClearable
                options={this.getOptions()} />
        )
    }
}

export default ReferenceSelect