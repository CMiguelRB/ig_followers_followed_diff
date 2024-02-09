import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

let count_followers = 0;
let count_followed = 0;

const followers_list = [];
const followed_list = [];

let next_max_id = '';

//change
const cookie =  process.env.COOKIE;
const csrfToken = process.env.CSRFTOKEN;
const igAppId = process.env.IGAPPID;
const userId = process.env.USERID;
const account = process.env.ACCOUNT;


const config = {
    headers: {
        'cookie': cookie,
        'dnt': '1',
        'refer': 'https://www.instagram.com/'+account+'/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
        'x-csrftoken': csrfToken,
        'x-ig-app-id': igAppId
    }
}

const get_info = () => { 
    return new Promise((resolve, reject) => {
        axios.get(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${account}`,
          config
        ).then(data => {
            count_followed = data.data.data.user.edge_follow.count;
            count_followers = data.data.data.user.edge_followed_by.count;
            resolve(true);
        }).catch(e =>{
            reject(false);
        });
    });
}

const get_followers = (max_id) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.instagram.com/api/v1/friendships/${userId}/followers/?count=180&max_id=${max_id}`,
          config
        ).then(data => {    
            if(data.data['next_max_id']){
                next_max_id = data.data['next_max_id'];
            }
            for(let i in data.data['users']){
                followers_list.push(data.data['users'][i]['username']);
            }
            count_followers -= data.data['users'].length;
            resolve(true);
        }).catch(e =>{
            console.log(e);
            reject(false);
        });
    });
}

const get_followed = (max_id) => {
    return new Promise((resolve, reject) => { 
        axios.get(`https://www.instagram.com/api/v1/friendships/${userId}/following/?count=200&max_id=${max_id}`,
          config
        ).then(data => {             
            next_max_id = data.data['next_max_id'];
            for(let i in data.data['users']){
                followed_list.push(data.data['users'][i]['username']);
            }
            count_followed -= data.data['users'].length;
            resolve(true);
        }).catch(e =>{
            console.log(e);
            reject(false);
        });
    });
}

const loop_followers = async () => {
    while(count_followers > 0){
        let result = await get_followers(next_max_id);
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(`processing followers: ${count_followers} remaining.`);
        if(!result) break;
        await new Promise(r => setTimeout(r, Math.floor(Math.random() * 3000) + 2000));
    }
}

const loop_followed = async () => {
    next_max_id = '';
    while(count_followed > 0){
        let result = await get_followed(next_max_id);
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(`processing followed: ${count_followed} remaining.`);
        if(!result) break;
        await new Promise(r => setTimeout(r, Math.floor(Math.random() * 3000) + 2000));
    }
}

const diff_followers_followed = async () => {
    console.log(`Getting @${account} account info...`);
    try{
        await get_info();
        console.log(`@${account} -- [Followers: ${count_followers}] [Following: ${count_followed}]`);
        console.log(`Getting @${account} followers...`);
        await loop_followers();
        console.log('');
        console.log(`Getting @${account} followed...`);
        await loop_followed();
    }catch(e){
        console.log('');
        return console.log(e);
    }
    console.log('');
    console.log('Running diff //process...');
    const unfollow = [];
    for(let i in followed_list){
        if(followers_list.indexOf(followed_list[i]) == -1){
            unfollow.push(followed_list[i]);
        }
    }
    console.log(`Accounts not following @${account}:`);
    console.log(unfollow);
}

diff_followers_followed();

