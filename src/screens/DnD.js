import React, { Component } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { IoIosClose } from 'react-icons/io'

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
}

const grid = 8

const getListStyle = isDraggingOver => ({
    display: 'flex',
    padding: grid,
    overflow: 'auto'
})

class DnD extends Component {
    onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
            return
        }

        const images = reorder(
            this.props.images,
            result.source.index,
            result.destination.index
        )

        this.props.setImages(images)
    }

    getImageData = (target, imageFile) => {
        let reader = new FileReader()

        reader.onload = (event) => {
            if (target)
                target.src = event.target.result
        }

        reader.readAsDataURL(imageFile)
    }

    pickImage = () => (
        <div className='preview mb-4' style={{ position: 'relative', height: 240, minHeight: 240, width: 240, minWidth: 240 }}>
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
                onChange={this.props.handleFileChange}
            />
        </div>
    )

    renderImage = (image, index, ref, props, draggableStyle) => (
        <div
            ref={ref}
            {...props}
            className='preview ml-4 mb-4'
            style={{ position: 'relative', height: 240, minHeight: 240, width: 240, minWidth: 240, ...draggableStyle }}>
            <div
                onClick={() => this.props.onRemoveImageClick(index)}
                style={{ position: 'absolute', top: 10, right: 10, padding: 5, cursor: 'pointer', backgroundColor: 'red' }}>
                <IoIosClose size={24} />
            </div>
            <img
                style={{ width: '100%', height: '100%' }}
                alt=''
                ref={imageRef => this.getImageData(imageRef, image)}
            />
        </div>
    )

    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable" direction="horizontal">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >
                            {
                                this.pickImage()
                            }

                            {this.props.images.map((item, index) => ( // draggableId unique olması lazım..
                                <Draggable key={item.size.toString()} draggableId={item.size.toString()} index={index}>
                                    {(provided, snapshot) => this.renderImage(
                                        item,
                                        index,
                                        provided.innerRef,
                                        { ...provided.draggableProps, ...provided.dragHandleProps },
                                        provided.draggableProps.style
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        )
    }
}

export default DnD
