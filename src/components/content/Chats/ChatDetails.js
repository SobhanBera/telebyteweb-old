import React, { Component } from "react";
import firebase from "../../../firebase/Firebase";
import Spinner from "../Loader/Spinner";
import ChatRecieve from "./ChatingCards/ChatRecieve";
import FullChatList from "./ChatingCards/FullChatList";

class ChatDetails extends Component {
	constructor() {
		super();
		this.state = {
			message: "",
			username: "",
			chatList: {},
			useravail: false,
		};
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		const userTimer = setInterval(() => {
			const user = firebase.auth().currentUser;
			if (user) {
				this.setState({
					username: user.displayName,
					useravail: true,
				});
				clearInterval(userTimer);
				// return;
			}
			// console.log(user);
		}, 2000);
	}

	handleChange = (event) => {
		this.setState({
			message: event.target.value,
		});
		console.log(this.state.message);
	};

	handleSendMessage = () => {
		if (this.state.message.length <= 0) {
			return;
		}

		if (this.state.message.length > 100) {
			alert("message length should be less than 101 characters.");
		} else {
			if (this.state.useravail) {
				firebase
					.database()
					.ref("Groups")
					.child(`${this.props.groupName}`)
					.push({
						message: this.state.message,
						username: this.state.username,
					});
				console.table(
					`'${this.state.message}' message is sent and will be update in sometime. (this message is only shown in computer users)`
				);
				this.setState({
					message: "",
				});
			} else {
				alert("Please login or sign up to chat in gruops.");
			}
		}
	};

	render() {
		return (
			<div className="chats-details">
				<div className="chats-available-name">
					<div className="chats-avail-img-holder">
						<img
							src={this.props.image}
							className="chats-avail-img"
							alt="twbus"
						/>
					</div>
					<div className="chats-avail-detail-holder">
						<h3 className="chats-avail-h">
							{this.props.groupName}
						</h3>
						<p className="chats-avail-p">{this.props.creator}</p>
					</div>
				</div>
				<div className="real-chats">
					{this.state.useravail ? (
						<FullChatList
							// username={this.state.username}
							groupName={`${this.props.groupName}`}
						/>
					) : (
						<div>
							<ChatRecieve
								message="Please login to send and recieve messages"
								username="admin"
							/>
							<Spinner />
						</div>
					)}
				</div>
				<div className="type-message">
					<input
						onChange={this.handleChange}
						value={this.state.message}
						className="message-input"
						type="text"
						name="message"
						autoComplete="off"
						placeholder="Type a message"
						maxLength="100"
					/>
					<div className="send-btn" onClick={this.handleSendMessage}>
						Send
					</div>
				</div>
			</div>
		);
	}
}

export default ChatDetails;
