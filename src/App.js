import React from "react";
import ReactDOM from "react-dom";
import "bootstrap-css-only";
import "./styles.css";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Image from 'react-bootstrap/Image'
import fetch from 'isomorphic-fetch';
import { Accordion, AccordionCollapse, AccordionToggle, ListGroup } from "react-bootstrap";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import { post } from "request";


export class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      errors: [],
      results:[],
      show_cards:false,
      docToUpdate:{},
      clickedDoc:null
     
      
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.display_doc = this.display_doc.bind(this);
    this.display_query = this.display_query.bind(this);
    this.update_score = this.update_score.bind(this)
  
    
    

    
  }
   
  hasError(key) {
    return this.state.errors.indexOf(key) !== -1;
  }

  handleInputChange(event) {
    var key = event.target.name;
    var value = event.target.value;
    var obj = {};
    obj[key] = value;
    this.setState(obj);
    this.state.show_cards = false;
    
    
  }

  update_score(doc)
  {
    // this.setState({docToUpdate:doc});
    this.setState(Object.assign(this.state.docToUpdate,doc));
    this.state.clickedDoc = doc;
    var maxscore = Math.max.apply(Math, this.state.results.map(function(o) { return o.score; }));
    console.log ('maxscore: ', maxscore,' doc title', this.state.docToUpdate.docTitle) 
    let formData = new FormData();
    const doc_updated = JSON.stringify(doc);
    const blob = new Blob( [doc_updated], {type: 'application/json'})
    formData.append("doc" ,blob  );
    formData.append("maxScore" , maxscore);

    for (var key of formData.entries()) {
      console.log(key[0] + ', ' + key[1]);
  }
    // let url = "http://localhost:4500/updateRelevance"
    let url = "https://wikisearcher-app.herokuapp.com/updateRelevance"
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    fetch((proxyurl + url), {
      method: 'POST',
      body: formData,
      // url : (proxyurl+url),
    //   formData: {
    //     doc: {
    //         value: doc,
    //         options : {
    //             contentType: 'application/json'
    //         } 
    //     },
    //     maxScore: maxscore
    // },
   
    }).then(function(response){
      console.log(response)
      return response;
    }).then(function(response) {
      console.log(response, "done ");

    })

  }

  
  display_doc (doc){
    
    return( 
       <div className="docs"  height="100" width="50" > 
       
      <Accordion id = "result_pane">
        <Card style={{ width: '18rem' }}>
        <AccordionToggle as={ListGroup.Item} variant = "info" eventKey="0"> 
        {doc.docTitle}
       
        
        </AccordionToggle>
        </Card >
        <AccordionCollapse eventKey="0">
        <Card className = "card">
             <Image src={doc.imageURL} alt = "result_image"  thumbnail></Image> 
            <Card.Body >
             <Card.Title>{doc.docTitle} </Card.Title>
             <Card.Text>
              
            {ReactHtmlParser(doc.fragments)}
            
            </Card.Text>
            <Button variant="primary" onClick = { () => this.update_score(doc) }>Mark Interesting</Button>
            {this.state.clickedDoc == doc && <Alert variant = 'success' >Marked</Alert>}
            {/* {"    "}
            <Button variant="primary" onClick={this.openDocument}>Open document</Button> */}
            </Card.Body>
             </Card>

        </AccordionCollapse>
      <br></br>
      </Accordion>
      
 
             </div>
      
             )
     
   }
   

  handleSubmit(event) {
    event.preventDefault();

    //VALIDATE
    var errors = [];

    //query
    if (this.state.query === "") {
      errors.push("query");
      this.state.show_cards = false;
    }

    this.setState({
      errors: errors
    });

    if (errors.length > 0) {
      return false;
    } else {
      
     
      // alert("everything good. submit form!");
      const proxyurl = "https://cors-anywhere.herokuapp.com/";
     
      let query_cleaned = this.state.query;
      // query_cleaned = query_cleaned.replace(/[^a-zA-Z0-9 ]/g, "%20");
      // query_cleaned = query_cleaned.replace(/\s/g, "%20");
      query_cleaned = escape(query_cleaned);
      // let url = "http://localhost:4500/search?q="+ query_cleaned 
      let url = "https://wikisearcher-app.herokuapp.com/search?q=" + query_cleaned
     fetch((proxyurl+ url), {
        method: "GET",
        mode : 'cors',
       
      }) .then(function(response){
        console.log(response)
        return response.json();
      })
      // .then(function(response) {
      //   response.map( x => console.log(x, x.docTitle, '-----', x.content));
      //  this.setState({results :response})
        
        
      // });

      .then((response) => {
        response.map( x => console.log(x, x.docTitle, '-----', x.content));
        if(!response.length)
        {

         alert("No results found") 
         
        }
        else{
          this.state.show_cards = true;
          this.setState({results :response})

        }
      
        
        
        
      });
  }
      
    }
  





  query_component(){

    let cards = [1,2,3];
    
    return(
      <form className="row" id = "query_input">
        
        <div className="col-lg-6">
          <label htmlFor="query" >Enter search query:   </label>
          <input
            autoComplete="on"
            className={
              this.hasError("query")
                ? "form-control is-invalid"
                : "form-control"
            }
            name="query"
            value={this.state.query}
            onChange={this.handleInputChange}
          />
          <div
            className={
              this.hasError("query") ? "inline-errormsg" : "hidden"
            }
          >
            Please enter a query
          </div>
        </div>

        <div className="col-lg-12  padd-top">
          <button className="btn btn-success" onClick={this.handleSubmit}>
            Submit
          </button>
        

        </div>
        </form>   

    )
   
  }
 display_query(){
   return(
   <div>
     <p> Search results for {this.state.query}</p>
   </div>
   )
 }


  render() {
    

    return (
      <div>
      {this.query_component()}
      
      {this.state.show_cards  && (
        this.display_query())}
    
       {
       this.state.results.map(doc =>
        this.state.show_cards  && (
        this.display_doc(doc)))}
     
        
        </div>
      
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
export default App;