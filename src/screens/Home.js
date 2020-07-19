import React, { Component } from 'react'

import SaveCategoryComponent from '../components/SaveCategoryComponent'
import SaveSubCategoryComponent from '../components/SaveSubCategoryComponent'
import SaveProductComponent from '../components/SaveProductComponent'
import UpdateProductComponent from '../components/UpdateProductComponent'

class Home extends Component {
    state = {
        status: 0
    }

    getForm = (status) => {
        switch (status) {
            case 0: return <SaveCategoryComponent />
            case 1: return <SaveSubCategoryComponent />
            case 2: return <SaveProductComponent />
            case 3: return <UpdateProductComponent />
            default: return null
        }
    }

    onBtnClick = (event) => {
        switch (event.target.name) {
            case 'save-category': this.setState({ status: 0 }); break;
            case 'save-sub-category': this.setState({ status: 1 }); break;
            case 'save-product': this.setState({ status: 2 }); break;
            case 'update-product': this.setState({ status: 3 }); break;
            default: break;
        }
    }

    render() {
        return (
            <div className='col-md-12 py-4'>
                <div className='row'>
                    <div className='col-md-4'>
                        <div className='col-md-12'>
                            <div className='p-3 border'>
                                <div className='form-group'>
                                    <div className='col-md-12'>
                                        <button className='btn btn-primary btn-block' name={'save-category'} onClick={this.onBtnClick}>Kategori Ekle</button>
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <div className='col-md-12'>
                                        <button className='btn btn-primary btn-block' name={'save-sub-category'} onClick={this.onBtnClick}>Alt Kategori Ekle</button>
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <div className='col-md-12'>
                                        <button className='btn btn-primary btn-block' name={'save-product'} onClick={this.onBtnClick}>Ürün Ekle</button>
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <div className='col-md-12'>
                                        <button className='btn btn-primary btn-block' name={'update-product'} onClick={this.onBtnClick}>Ürün Güncelle</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='col-md-8'>
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
