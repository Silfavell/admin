import React, { Component } from 'react'

import SaveCategoryComponent from '../components/SaveCategoryComponent'
import DeleteCategoryComponent from '../components/DeleteCategoryComponent'

import SaveSubCategoryComponent from '../components/SaveSubCategoryComponent'
import SaveProductComponent from '../components/SaveProductComponent'
import UpdateProductComponent from '../components/UpdateProductComponent'
import DeleteProductComponent from '../components/DeleteProductComponent'

class Home extends Component {
    state = {
        status: 0
    }

    getForm = (status) => {
        switch (status) {
            case 0: return <SaveCategoryComponent />
            case 2: return <DeleteCategoryComponent />
            case 3: return <SaveSubCategoryComponent />
            case 6: return <SaveProductComponent />
            case 7: return <UpdateProductComponent />
            case 8: return <DeleteProductComponent />
            default: return null
        }
    }

    onBtnClick = (event) => {
        switch (event.target.name) {
            case 'save-category': this.setState({ status: 0 }); break;
            case 'update-category': this.setState({ status: 1 }); break;
            case 'delete-category': this.setState({ status: 2 }); break;
            case 'save-sub-category': this.setState({ status: 3 }); break;
            case 'update-sub-category': this.setState({ status: 4 }); break;
            case 'delete-sub-category': this.setState({ status: 5 }); break;
            case 'save-product': this.setState({ status: 6 }); break;
            case 'update-product': this.setState({ status: 7 }); break;
            case 'delete-product': this.setState({ status: 8 }); break;
            default: break;
        }
    }

    render() {
        return (
            <div className='col-md-12 py-4'>
                <div className='row'>
                    <div className='col-md-5 p-3 border'>
                        <div className='col-md-12'>
                            <div className='form-group'>
                                <div className='row'>
                                    <div className='col-md-4'>
                                        <button className='btn btn-primary btn-block h-100' name={'save-category'} onClick={this.onBtnClick}>Kategori Ekle</button>
                                    </div>
                                    <div className='col-md-4'>
                                        <button className='btn btn-primary btn-block h-100' name={'update-category'} onClick={this.onBtnClick}>Kategori Güncelle</button>
                                    </div>
                                    <div className='col-md-4'>
                                        <button className='btn btn-primary btn-block h-100' name={'delete-category'} onClick={this.onBtnClick}>Kategori Sil</button>
                                    </div>
                                </div>
                            </div>
                            <div className='form-group'>
                                <div className='row'>
                                    <div className='col-md-4'>
                                        <button className='btn btn-primary btn-block h-100' name={'save-sub-category'} onClick={this.onBtnClick}>Alt Kategori Ekle</button>
                                    </div>
                                    <div className='col-md-4'>
                                        <button className='btn btn-primary btn-block h-100' name={'update-sub-category'} onClick={this.onBtnClick}>Alt Kategori Güncelle</button>
                                    </div>
                                    <div className='col-md-4'>
                                        <button className='btn btn-primary btn-block h-100' name={'delete-sub-category'} onClick={this.onBtnClick}>Alt Kategori Sil</button>
                                    </div>
                                </div>
                            </div>
                            <div className='form-group'>
                                <div className='row'>
                                    <div className='col-md-4'>
                                        <button className='btn btn-primary btn-block' name={'save-product'} onClick={this.onBtnClick}>Ürün Ekle</button>
                                    </div>
                                    <div className='col-md-4'>
                                        <button className='btn btn-primary btn-block' name={'update-product'} onClick={this.onBtnClick}>Ürün Güncelle</button>
                                    </div>
                                    <div className='col-md-4'>
                                        <button className='btn btn-primary btn-block' name={'delete-product'} onClick={this.onBtnClick}>Ürün Sil</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='col-md-7'>
                        {
                            this.getForm(this.state.status)
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Home
