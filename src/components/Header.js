import React from 'react';
import BankApi from "../network/BankApis"
class Header extends React.Component{
    constructor(){
        super();
        this.state = {
            city : 'DELHI',
            isLoaded: false,
            error: null,
            bankdata : [],
            paginatedBankData: [],
            filter: "",
            currentPage: 1,
            itemPerPage: 10,
            favourite: [],
            

        }
    }

    handleChange = (event) => {
        this.setState({city: event.target.value},()=>{
            this.fetchBanksDetails(this.state.city);
        });
    }

    handleSearch = (event) => {
        this.setState({ filter: event.target.value });
    }

    handleClick= (event) => {
        this.setState({
          currentPage: Number(event.target.id)
        });
    }

    handleFav = (event) => {
       let a = event.target.value;
       if(this.state.favourite.includes(a)){
            
            this.setState((prevState)=>({
                favourite: prevState.favourite.filter(ele => ele!= a)
            }), () => {
                localStorage.setItem("favourites", JSON.stringify(this.state.favourite));
            })
        }
        else{
            this.setState((prevState)=>({
                favourite: prevState.favourite.concat(a)
             }), () => {
                localStorage.setItem("favourites", JSON.stringify(this.state.favourite));
            })
        }
       
    }
    handlePageSize = (event) => {
        this.setState({ itemPerPage: event.target.value });
    }
    updateCurrPage = (val) =>{
        if(val){
            this.setState((prevState)=>({
                currentPage: prevState.currentPage + 1
            }))
        }
        else {
            this.setState((prevState)=>({
                currentPage: prevState.currentPage - 1
            }),()=>{
                console.log(this.state.currentPage)
            })
        }
    }

    
    fetchBanksDetails = (city) => {
        BankApi(city,
            (res)=>{
                this.setState({
                    isLoaded: true,
                    bankdata: res
                  });
            },
            (error)=>{
                console.log(error)
            });
    }

    componentDidMount() {
       this.fetchBanksDetails(this.state.city);
       let retrievedFavData = JSON.parse(localStorage.getItem("favourites")) || [];
       this.setState((prevState)=>({
        favourite: retrievedFavData
        }))
      }

    render(){
        //search 
        const { filter, bankdata} = this.state;
        const lowercasedFilter = filter.toLowerCase();
        const filteredData = bankdata.filter(item => {
        return Object.keys(item).some(key =>
            item[key].toString().toLowerCase().includes(lowercasedFilter)
        );
        });
        console.log(filteredData)
        //pagination
        const { currentPage, itemPerPage } = this.state;

        // Logic for displaying current todos
        const indexOfLastItem = currentPage * itemPerPage;
        const indexOfFirstItem = indexOfLastItem - itemPerPage;
        console.log(indexOfFirstItem, indexOfLastItem)
        const currentItem = filteredData.slice(indexOfFirstItem, indexOfLastItem);
        const totalpage = Math.ceil(filteredData.length/itemPerPage);
       
       
        // Logic for displaying page numbers
        const pageNumbers = [];
        
        for(let i = 1; i <= Math.ceil(filteredData.length / itemPerPage); i++) 
        {
            
                if(i >= currentPage-5 && i<=currentPage+5){
                    pageNumbers.push(i);
                }
            
        }
        const currPageStyle ={
            backgroundColor: '#007bff',
            color:'#fff'
        }

        const renderPageNumbers = pageNumbers.map(number => {
            return (
              <li
                className="page-item"
                key={number}
                id={number}
                onClick={this.handleClick}
                style={number==currentPage ? currPageStyle: null}
              >
                {number}
              </li>
            );
        });
        const favStyle = {
            background: '#d3d3d3'
        }
        const disableBtn = {
            pointerEvents: 'none',
            cursor: 'default'
        }

        return(
            <div>
            <div className="header">
                <h1>Bank Search Application</h1>
                <div className="row search">
                    <div className="col-sm-2">
                    
                        <select name="cities" value={this.state.city} onChange={this.handleChange}>
                            <option value="DELHI">Delhi</option>
                            <option value="MUMBAI">Mumbai</option>
                            <option value="BANGALORE">Bangalore</option>
                            <option value="KOLKATA">Kolkata</option>
                            <option value="CHENNAI">Chennai</option>
                        </select>
                    
                    </div>
                    <div className="col-sm-8">
                        <input type="text" onChange={this.handleSearch} placeholder="Search"/>
                    </div>
                    <div className="col-sm-2">
                        <select name="cities" value={this.state.itemPerPage} onChange={this.handlePageSize}>
                            <option value="10">Table Size</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="40">40</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                    
                </div>
            </div>
            <div className="table-responsive table-section mt-5">
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                        <th scope="col">Fav</th>
                        <th scope="col">Bank Name</th>
                        <th scope="col">IFSC</th>
                        <th scope="col">Branch</th>
                        <th scope="col">Address</th>
                        <th scope="col">City</th>
                        <th scope="col">District</th>
                        <th scope="col">State</th>
                        </tr>
                    </thead>
                    <tbody>
                       
                    {currentItem.map(item => (
                        <tr key={item.ifsc} style={this.state.favourite.includes(item.ifsc) ? favStyle : null}>
                            <td><input type="checkbox" name="favourite" checked={this.state.favourite.includes(item.ifsc)} value={item.ifsc} onChange={(event)=>this.handleFav(event)}  /></td>
                            <td>{item.bank_name}</td>
                            <td>{item.ifsc}</td>
                            <td>{item.branch}</td>
                            <td>{item.address}</td>
                            <td>{item.city}</td>
                            <td>{item.district}</td>
                            <td>{item.state}</td>
                        </tr>
                        ))} 
                    </tbody>
                </table>
            </div>
            
            <div> 
                <ul className="pagination justify-content-center" id="page-numbers">
                    <button onClick={()=>this.updateCurrPage(0)} className="btn btn-primary" style={currentPage == 1 ? disableBtn : null }>Prev</button>
                    {renderPageNumbers}
                    <button onClick={()=>this.updateCurrPage(1)} className="btn btn-primary" style={currentPage == totalpage ? disableBtn : null }>Next</button>
                </ul>
                
            </div>
            </div>

            
        )
    }
}

export default Header; 