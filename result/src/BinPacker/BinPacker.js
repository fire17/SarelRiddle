import React, { Component } from 'react';
import './BinPacker.css';
import _ from 'lodash';



import { data, colorArray, grow } from '../assets/const';

const packs = (data) => {
    return Object.keys(data).map((setOfRectangles) => {
        return this.pack(data[setOfRectangles], setOfRectangles)
    })
}


export default class BinPacker extends Component {
    state = {
        perimeter: 0,
        area: 0,
        yCursor: 0,
        xCursor: 0,
        data: [],
        root: {
            x: 0,
            y: 0,
            w: this.normalizeRectangle(this.props.data[0], 0).w,
            h: this.normalizeRectangle(this.props.data[0], 0).h,
            used: true
        },
    }


    sortList(rectangles, sortBy) {
        const arr = _.cloneDeep(rectangles)
        let result
        switch (sortBy) {
            case 'w':
                result = arr.sort((a, b) => b.w - a.w)
                break;
            case 'h':
                result = arr.sort((a, b) => b.h - a.h)
                break;
            case 'max':
                result = arr.sort((a, b) => Math.max(b.h, b.w) - Math.max(a.h, a.w))
                break;
            default:
                break;
        }
        return result
    }


    componentDidMount() {
        this.fit()
        console.log(this.state.data)

    }


    normalizeRectangle(rectangle, index) {
        const h = Math.max(rectangle[0], rectangle[1]) * grow
        const w = Math.min(rectangle[0], rectangle[1]) * grow
        return {
            h,
            w,
            originalIndex: index,
            used: false
        }
    }


    //TODO SORT by

    normalizeRectangles(rectangles) {
        return rectangles.map((rectangle, index) => {
            return this.normalizeRectangle(rectangle, index)
        }).sort((a, b) => b.h - a.h)
    }


    buildRectangle(rectangle, index) {
        const { h, w, originalIndex } = rectangle
        const divStyle = {
            backgroundColor: colorArray[index],
            h: `${h}px`,
            w: `${w}px`,
            position: 'absolute',
            top: 0,
            left: 0,
        };
        this.setState({ xCursor: this.xCursor += w })
        return <div style={divStyle} key={index}>{originalIndex + 1}</div>
    }


    pack(setOfRectangles, nameOfRectangles) {
        console.log({ func: 'pack', setOfRectangles, nameOfRectangles })
        const rectangles = this.normalizeRectangles(setOfRectangles)
        return (
            <div className={'packContainer'} >
                <h1>{`set name: ${nameOfRectangles}`}</h1>
                {rectangles.map((rectangle, index) => this.buildRectangle(rectangle, index))}
            </div>
        )
    }


    ///
    fit() {
        const clonedData = this.normalizeRectangles(_.cloneDeep(this.props.data))
        console.log(this.state.root)
        this.setState({
            data:
                clonedData.forEach((block) => {
                    const node = this.findNode(this.state.root, block)
                    if (node) {
                        block.fit = this.splitNode(node, block);
                    }
                    else {
                        block.fit = this.growNode(block);
                    }
                })
        })
    }


    findNode(root, block) {
        console.log(root)
        // const { right, down } = root
        // if (true) return this.findNode(right, block) || this.findNode(down, block);
        // else if (block.w <= root.w && block.h <= root.h) return root;
        return null;
    }

    splitNode(node, newNode) {
        const { originalIndex, h, w } = newNode;
        node.used = true;
        node.down = { originalIndex, x: node.x, y: node.y + h, w: node.w, h: node.h - h, used: newNode.used || false };
        node.right = { originalIndex, x: node.x + w, y: node.y, w: node.w - w, h: h, used: newNode.used || false };
        return node;
    }



    growNode(block) {
        const { h, w } = block
        if (h <= this.state.root.h && (this.state.root.h >= (this.state.root.w + w))) return this.growRight(block);
        else if (w <= this.state.root.w && (this.state.root.w >= (this.state.root.h + h))) return this.growDown(block);
        else if (h <= this.state.root.h) return this.growRight(block);
        else if (w <= this.state.root.w) return this.growDown(block);
        return null;
    }


    growRight(block) {
        this.setState({
            root:
            {
                used: true,
                x: 0,
                y: 0,
                w: this.state.root.w + block.w,
                h: this.state.root.h,
                down: this.state.root,
                right: { x: this.state.root.w, y: 0, w: block.w, h: this.state.root.h, originalIndex: block.originalIndex }
            }
        })

        const node = this.findNode(this.state.root, block)
        return node ? this.splitNode(node, block) : null;
    }

    growDown(block) {
        this.setState({
            root: {
                used: true,
                x: 0,
                y: 0,
                w: this.state.root.w,
                h: this.state.root.h + block.h,
                down: { x: 0, y: this.state.root.h, w: this.state.root.w, h: block.h, originalIndex: block.originalIndex },
                right: this.state.root
            }
        })
        const node = this.findNode(this.state.root, block)
        return node ? this.splitNode(node, block) : null;
    }


    ///



    render() {
        return (
            <div className="packsContainer" >
                {this.state.data}
            </div>
        )
    }
}