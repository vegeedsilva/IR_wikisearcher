import React from "react";
import ReactDOM from "react-dom";
import "bootstrap-css-only";
import "./styles.css";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image'

class search_result {
    // constructor(props)
    // {
    //     super(props);
    //     this.search_id = this.search_id.bind(this);
    //     this.result_image = this.result_image.bind(this);
    //     this.result_text = this.result_text.bind(this);

    // }
    search_doc(){
        // Need #hits, doc_id
        var i = 5;
        for (var j = 0; j< i ; j++)
        {
            return (<Card>
            <Card.Img variant="top" src={require('./logo.svg')} /> 
            <Card.Body>
            <Card.Title>Document{j} Title </Card.Title>
            <Card.Text>
            Some Text
            </Card.Text>
            <Button variant="primary">Go somewhere</Button>
            </Card.Body>
            </Card>)
        }
    }
    render(){
        return(this.search_doc );
    }

}
const s = new search_result();
export default search_result;