import React, { Component } from 'react';
import './BinPacker.css';
import _ from 'lodash';



import { colorArray, grow } from '../assets/const';




export default class BinPacker extends Component {

    constructor(props) {
        super(props)

        this.state = {
            result: []
        }
        this.blocks = this.props.data.map((item) => {
            return { w: Math.min(item[0], item[1]), h: Math.max(item[0], item[1]) }
        }).sort((a, b) => b.h - a.h)

        this.root = {
            x: 0,
            y: 0,
            w: this.blocks.length > 0 ? this.blocks[0].w : 0,
            h: this.blocks.length > 0 ? this.blocks[0].h : 0,
            used: true
        }
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
        this.buildRectangles(_.cloneDeep(this.root), [], 0)
    }


    buildRectangles(head, arr, key) {
        if (!head) return this.setState({ result: arr })
        if (!head.rendered) {
            arr.push(this.buildRectangle(head, key++))
            head.rendered = true
        }
        if (head.right) {
            this.buildRectangles(head.right, arr, key++)
        }

        if (head.down) {
            this.buildRectangles(head.down, arr, key++)
        }
    }



    buildRectangle(rectangle, index) {
        const { h, w, x, y } = rectangle
        const divStyle = {
            backgroundColor: colorArray[index],
            h: `${h * grow}px`,
            w: `${w * grow}px`,
            position: 'absolute',
            top: y,
            left: x,
        };
        return <div style={divStyle} key={index}></div>
    }



    fit() {
        return this.blocks.forEach((_, i, arr) => {
            if (this.findNode(this.root, arr[i].w, arr[i].h)) {
                const node = this.findNode(this.root, arr[i].w, arr[i].h)
                arr[i].fit = this.splitNode(node, arr[i].w, arr[i].h)
            }
            else {
                arr[i].fit = this.growNode(arr[i].w, arr[i].h);
            }
        })
    }


    findNode(root, h, w) {
        if (root && root.used) {
            return this.findNode(root.right, w, h) || this.findNode(root.down, w, h);
        }
        else if (w <= (root && root.w) && h <= (root && root.h)) return root;
        return null;
    }


    splitNode(node, h, w) {
        node.used = true;
        node.down = { x: node.x, y: node.y + h, w: node.w, h: node.h - h };
        node.right = { x: node.x + w, y: node.y, w: node.w - w, h: h };
        return node;
    }


    growNode(w, h) {
        if (h <= this.root.h && (this.root.h >= (this.root.w + w))) return this.growRight(w, h);
        else if (w <= this.root.w && (this.root.w >= (this.root.h + h))) return this.growDown(w, h);
        else if (h <= this.root.h) return this.growRight(w, h);
        else if (w <= this.root.w) return this.growDown(w, h);
        return null;
    }


    growRight(w, h) {
        this.root = {
            used: true,
            x: 0,
            y: 0,
            w: this.root.w + w,
            h: this.root.h,
            down: this.root,
            right: {
                x: this.root.w, y: 0, w: w, h: this.root.h
            }
        };

        const node = this.findNode(this.root, w, h)
        return node ? this.splitNode(node, w, h) : null;
    }

    growDown(w, h) {
        this.root = {
            used: true,
            x: 0,
            y: 0,
            w: this.root.w,
            h: this.root.h + h,
            down: {
                x: 0, y: this.root.h, w: this.root.w, h
            },
            right: this.root
        };
        const node = this.findNode(this.root, w, h)
        return node ? this.splitNode(node, w, h) : null;
    }

    render() {
        console.log(this.state.result)
        return (
            <div className={'packContainer'} >
                <h1>{`set name: ${this.props.name}`}</h1>
                {this.state.result}
            </div>
        )
    }
}