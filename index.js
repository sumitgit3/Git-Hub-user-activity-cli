#!/usr/bin/env node

//0 is node bin ,1 is file path ,from 2 onward is commands
const args = process.argv.slice(2);

if (args.length == 0) {
    console.log("Username Missing");
    console.log("Usage: Git-Hub-user-activity <USERNAME> ");
    process.exit(1);
}

const username = args[0];

const getActivity = async (username) => {
    const response = await fetch(`https://api.github.com/users/${username}/events`);
    if (!response.ok) {
        switch (response.status) {
            case 404:
                console.error("Username Not found");
                break;

            default:
                console.error("Failed to fetch actitvity detail")
                break;
        }
    }
    else {
        const data = await response.json();
        if (data.length == 0) {
            console.log("No recent activity");
        }
        else {
            data.forEach((event, index) => {
                switch (event.type) {
                    case "PushEvent":
                        console.log(`- Pushed ${event.payload.commits.length} commit(s) to ${event.repo.name}`);
                        break;
                    case "IssuesEvent":
                        console.log(
                            `- ${event.payload.action} an issue in ${event.repo.name}`
                        );
                        break;
                    case "WatchEvent":
                        console.log(`- Starred ${event.repo.name}`);
                        break;
                    case "CreateEvent":
                        console.log(
                            `- Created ${event.payload.ref_type} in ${event.repo.name}`
                        );
                        break;
                    default:
                        console.log(`- ${event.type} in ${event.repo.name}`);
                        break;
                }
            });
        }
    }
}

getActivity(username);