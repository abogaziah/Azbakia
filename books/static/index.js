class App extends React.Component {
    constructor(props){
        super(props)
        this.myRef = React.createRef();
        this.state = {
            name : "",
            phone : 0,
            class : "",
            book: "الكتاب: قم بالبحث أو اختر من القائمة",
            id:0
        };
        this.submit = this.submit.bind(this);
        this.handler = this.handler.bind(this);
    }
    inputCheck = (e) => {
        this.setState({[e.target.name]: e.target.value})

    }
    submit(){
        if(!this.state.name || !this.state.class){
            alert("all fields are required")}
        if (this.state.phone.length < 10 || !this.state.phone){
            alert("provide correct phone number")
        }
        let data ={
            name: this.state.name,
            phone: this.state.phone,
            class: this.state.class,
            id: this.state.id
        }
        fetch('/checkout', {
            method: 'POST',
            body:JSON.stringify(data)
        }).then(response=>window.location.href = response.url)
    }
    handler(name, id){
        this.setState({book:name, id:id})
    }
    componentDidMount(){
        this.myRef.current.focus();
    }

    render() {
        return (
            <div className="form">
                <div className="header">

                </div>
                <div className="inputcontainer">
                    <img src={"https://bucettest.s3-us-west-2.amazonaws.com/logo2.png"} alt={"logo"}/>
                    <input className={"form-control textbox"} name="name" placeholder="الإسم رباعي" ref={this.myRef} onChange={this.inputCheck} />
                    <input className={"form-control textbox"} maxLength="11" name="phone" placeholder="رقم الهاتف" onChange={this.inputCheck} />
                    <input className={"form-control textbox"} name="class" placeholder="الفرقة" onChange={this.inputCheck} />
                    <input className={"form-control textbox"} name="book" placeholder="الكتاب: قم بالبحث او اختر من القائمة" value={this.state.book} />
                    <BookList selected={this.handler}/>
                    <button onClick={this.submit} className={'submit btn nav'}>Submit</button>
                </div>
            </div>
        );
    }
}

class BookList extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            books:[],
            current:[],
            page:0
        };
        this.fetchBooks = this.fetchBooks.bind(this);
        this.setCurrent = this.setCurrent.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);


    }
    componentDidMount() {
        this.fetchBooks()
    }

    fetchBooks(){
        fetch('/getBooks', {
            method: 'GET',
        }).then(response => response.json())
            .then(response => { this.setState({books:response}) }).then(response =>this.setCurrent(0));
    }

    setCurrent(i){
        let books = this.state.books
        let current = books.slice(i*10, (i+1)*10)
        this.setState({current:current})
    }

    nextPage(){
        let page = this.state.page
        if((page)*10>this.state.books.length){return}
        page += 1
        this.setState({page:page})
        this.setCurrent(page)
    }

    prevPage(){
        let page = this.state.page
        if(page<1){return}
        page -= 1
        this.setState({page:page})
        this.setCurrent(page)
    }

    render() {

        return (
            <div>
                <div>
                    <SearchBar books ={this.state.books} selected={this.props.selected}/>
                    <p>Page {this.state.page}</p>
                    <button className={"btn nav"} onClick={this.prevPage}>Previous</button>
                    {this.state.current.map((letter, index) => (<button className={" btn btn-primary posts"} key={letter.id} onClick={()=>this.props.selected(letter.title, letter.id)}>{letter.title}</button>))}
                    <button className={"btn nav"} onClick={this.nextPage}>Next</button>
                </div>
            </div>


        );
    }
}

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            suggestions: [],
            text: ''
        }
    }

    onTextChanged = (e) => {
        const value = e.target.value;
        let suggestions = [];
        if(value.length > 0) {
            const regex = new RegExp(`^${value}`, 'i');
            suggestions = this.props.books.filter(v => regex.test(v.title));
        }
        this.setState(() => ({suggestions, text: value}));
    }


    suggestionSelected(value,id) {
        this.setState(() => ({
            text: "",
            suggestions: []
        }));
        this.props.selected(value,id)
    }

    renderSuggestions() {
        const {suggestions} = this.state;
        if(suggestions.length === 0) {
            return null;
        }
        return (
            <div className="srchList">
                <ul>
                    {suggestions.map((item) => <button className={"btn btn-primary"} key={item.id} onClick={() => this.suggestionSelected(item.title,item.id)}>{item.title}</button>)}
                </ul>
            </div>
        );
    }

    render() {
        const { text } = this.state;
        return (
            <div className="container">
                <div className="row justify-content-md-center">
                    <div className="col-md-12 input">
                        <input value={text} onChange={this.onTextChanged} type="text" placeholder="Search" />
                    </div>
                    <div className="col-md-12 justify-content-md-center">
                        {this.renderSuggestions()}
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('app')
);