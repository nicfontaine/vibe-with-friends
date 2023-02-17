import Pusher from "pusher-js";
import * as PusherTypes from "pusher-js";
// Pusher.logToConsole = true;

interface IBind {
	(data: string): void;
}

class GroupClient {

	static groupID: string;
	static channel: PusherTypes.Channel;

	static pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
		cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
	});

	static subscribe (id: string) {
		this.groupID = id;
		this.channel = this.pusher.subscribe(this.groupID);
	}

	static unsubscribe () {
		this.pusher.unsubscribe(this.groupID);
	}

	static bind (hook: string, callback: any) {
		this.pusher.bind(hook, callback);
	}

}

export default GroupClient;