import React, { Component } from 'react'

import SaveCategoryComponent from '../components/SaveCategoryComponent'
import SaveSubCategoryComponent from '../components/SaveSubCategoryComponent'
import SaveProductComponent from '../components/SaveProductComponent'

class Home extends Component {
    render() {
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
                        <SaveProductComponent />
                    </div>
                </div>
            </div>
        )
    }
}

export default Home
