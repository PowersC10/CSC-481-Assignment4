//import logo from './logo.svg';
import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import ecom from './ecommerce';

class App extends React.Component{
  state = {
  	webPageAlert: '',
  	manager: '',
  	ticketNum: '',
  	ticketPrice: '',
  	currentTicket: '',
  	addressOf: '',
  	buyTicket: '',
  	offerSwap: '',
  	acceptSwap: '',
  	refundedTicket: '',
  };
  	async componentDidMount() {
  	try {
  	const manager = await ecom.methods.manager().call();
  	const ticketNum = await ecom.methods.numTickets().call();
  	const ticketPrice = await ecom.methods.ticketPrice().call();
  	console.log('Manager:', manager);
  	console.log('Total Tickets;', ticketNum);
  	console.log('Ticket Price:', ticketPrice);
  	this.setState({manager, ticketNum, ticketPrice});
  	} catch (error) {
  		console.error("Error:", error);
  	}
  }
  	render() {
  		return (
  		<body className="App">
  			<div>
  			<h1>Ticket Contract</h1>
  			<h2>
  			The manager of this contract is {this.state.manager || 'Please refresh.'}
  			<br />
  			There are {this.state.ticketNum.toString() || 'Please refresh'} tickets priced at {web3.utils.toWei(this.state.ticketPrice, 'ether').toString() || 'Please refresh'} wei each.
  			</h2>
  			<div>
  			<form onSubmit={this.buyButton} className="Box"> Buy a Ticket:
  				<input placeholder="Enter ticket ID" value={this.state.buyTicket} onChange={(event) => this.setState({buyTicket: event.target.value})}/>
  				<button>Enter</button>
  			</form>
  			<form onSubmit={this.offerButton} className="Box"> Offer Swap:
  				<input placeholder="Enter ticket ID" value={this.state.offerSwap} onChange={(event) => this.setState({offerSwap: event.target.value})}/>
  				<button>Enter</button>
  			</form>
  			<br />
  			<form onSubmit={this.acceptButton} className="Box"> Get Ticket at Address:
  				<input placeholder="Enter an address of a user" value={this.state.addressOf} onChange={(event) => this.setState({addressOf: event.target.value})}/>
  				<button>Enter</button>
  			</form>
  			<br />
  			<form onSubmit={this.refundButton} className="Box"> Refund Your Ticket:
  				<input placeholder="Enter your ticket ID" value = {this.state.refundedTicket} onChange={(event) => this.setState({refundedTicket: event.target.value})}/>
  				<button>Enter</button>
  			</form>
  			{<p>{this.state.currentTicket.toString()}</p>}
  			</div>
  			<p>{this.state.webPageAlert}</p>
  			</div>
  		</body>
  		);
  	}
  		buyButton = async (event) => {
  		event.preventDefault();
  		const {buyTicket} = this.state;
  		const accounts = await web3.eth.getAccounts();
  		try {
  			this.setState({ webPageAlert: 'Loading ticket purchase' });
  			await ecom.methods.buyTicket(buyTicket).send({from: accounts[0], value: web3.utils.toWei(this.state.ticketPrice, 'ether').toString(),gasPrice:800000000,gas:4700000});
  			this.setState({webPageAlert: 'Ticket purchase successful'});
  		} catch (error) {
  			this.setState({webPageAlert: 'Buy ticket failed'});
  		}
  		};
  		offerButton = async (event) => {
  		event.preventDefault();
  		 const {offerSwap} = this.state;
  		 const accounts = await web3.eth.getAccounts();
  		 try {
  		 	this.setState({webPageAlert:'Loading swap offer'});
  		 	await ecom.methods.offerSwap(offerSwap).send({from: accounts[0],gasPrice:800000000,gas:4700000});
  		 	this.setState({webPageAlert:'Swap offer successful'});
  		 } catch (error) {
  		 	this.setState({webPageAlert:'Swap offer failed'});
  		 }
  		 };
  		 acceptButton = async (event) => {
  		 event.preventDefault();
  		 const {acceptSwap} = this.state;
  		 const accounts = await web3.eth.getAccounts();
  		 try {
  		 	this.setState({webPageAlert: 'Loading accept swap'});
  		 	await ecom.methods.acceptSwap(acceptSwap).send({from: accounts[0],gasPrice:800000000,gas:4700000});
  		 	this.setState({webPageAlert:'Accept swap successful'});
  		 } catch (error) {
  		 	this.setState({webPageAlert: 'Accept swap failed'});
  		 }
  		 };
  		 getTicketButton = async (event) => {
  		 event.preventDefault();
  		 const {addressOf} = this.state;
  		 try {
  		 	const currentTicket = await ecom.methods.getTicketOf(addressOf).call();
  		 	this.setState({currentTicket});
  		 } catch (error) {
  		 	this.setState({currentTicket: 'Could not get ticket of this user. They may not exitst or have one.'});
  		 }
  		 };
  		 refundButton = async (event) => {
  		 event.preventDefault();
  		 const {ticketPrice, refundedTicket} = this.state;
  		 const accounts = await web3.eth.getAccounts();
  		 try {
  		 	this.setState({webPageAlert: 'Loading refund'});
  		 	await ecom.methods.resaleTicket(ticketPrice).send({from: accounts[0],gasPrice:800000000,gas:4700000});
  		 	await ecom.methods.acceptResale(refundedTicket).send({from: this.state.manager, value: this.state.ticketPrice,gasPrice:800000000,gas:4700000});
  		 	this.setState({webPageAlert: 'Ticket refunded'});
  		 } catch (error) {
  		 	this.setState({webPageAlert: 'Refund failed'});
  		 }
  		 };
  		 	
  		 
}

export default App;
