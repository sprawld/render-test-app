<script>

    import {user, socketstore, send} from '../lib/socketapi.js';
    import {onMount, tick} from 'svelte';
    import Avatar from './Avatar.svelte';   
    import {derived} from 'svelte/store';


    let msg = '';
    let long_msg = false;

    let chatbox;
    let textarea;

    const users = socketstore('users');
    const chatdata = socketstore('chat');
    const chat = derived(chatdata, list => {
        if(chatbox) {
            tick().then(() => {
                chatbox.scrollTo(0, chatbox.scrollHeight);
            })
        }
        return (list || []).reverse();
    });

    function postchat(evt) {
        if(evt) evt.preventDefault();
        sendmsg();
        msg = '';
        long_msg = false;
    }

    function keydown(evt) {
        if(evt.key === 'Enter') {
            if(evt.shiftKey) {
                long_msg = true;
            } else if(!long_msg) {
                postchat(evt);
            }
        }

    }


    function sendmsg() {
        send('chat', {
            message: msg, 
            timestamp: new Date().getTime(), 
            username: $user.username || ''
        });
    }

    function clearmsg() {
        send('clearchat');
    }

    function plural(num) {
        return num === 1 ? '' : 's';
    }

    function getTime(timestamp) {

        let now = new Date().getTime();

        let diff = now - timestamp;

        if(diff < 60*1000) {
            return 'less than a minute'
        }
        if(diff < 60*60*1000) {
            let t = Math.floor(diff/(60*1000));
            return `${t} minute${plural(t)} ago`;
        }
        if(diff < 24*60*60*1000) {
            let t = Math.floor(diff/(60*60*1000));
            return `${t} hour${plural(t)} ago`
        }
        let t = Math.floor(diff/(24*60*60*1000));
        return `${t} day${plural(t)} ago`
        
    }


    function getchatbackground(data) {
        if(data && data.color) {
            // background: linear-gradient(#e66465, #9198e5);
            let {r,g,b} = data.color;
            return `linear-gradient(rgba(${r},${g},${b},0.5), rgba(240,240,240,1) 25%)`
        }
        return 'lightgreen';
    }

    onMount(() => {

        textarea.focus();
        tick().then(() => {
            chatbox.scrollTo(0, chatbox.scrollHeight);
        });

    });


</script>

<div bind:this={chatbox} style="background:{getchatbackground($users && $users[$user.username] || $user.data)}" id="chat">

    {#if $users && $chat && $chat.length}
    
        {#each $chat as {message, username, timestamp}}

        <section class="{username === $user.username ? 'right' : 'left'}">
            
            <div class="bubble">
                <div class="username">
                    {username}
                </div><div class="message">
                    {message}
                </div><div class="timestamp">
                    {getTime(timestamp)}
                </div>
            </div>

            <div class="avatar">
                <Avatar user={$users[username]}></Avatar>
            </div>

        </section>


            <!-- {#if username === $user.username}

            <div class="right">
                <span class="chattext">
                    <h6>[{username}]</h6>
                    <pre>{message}</pre>
                </span>
                <span class="icon"><Avatar user={$users[username]}></Avatar></span>
            </div>
            
            {:else}

            <div class="left">
                <span class="icon"><Avatar user={$users[username]}></Avatar></span>
                <span class="chattext">
                    <h6>[{username}]</h6>
                    <pre>{message}</pre>
                </span>
            </div>

            {/if} -->

        {/each}
    
    {/if}

</div>



<section id="textbox">
    <div id="inputwrap">
        <textarea bind:this={textarea} on:keydown={keydown} bind:value={msg}></textarea>
    </div>
    <button id="inputbutton" on:click={postchat}>Send</button>
</section>

<style>

    #chat {
        position:absolute;
        top:0;
        bottom:80px;
        left:0;
        width:100%;
        overflow:auto;
        font-size:28px;
        background:lightblue;
    }

    /* v2 bubbles */

    #chat > section {
        position:relative;
        margin:8px 0;
    }

    #chat > section.left {
        text-align:left;
        padding-left: 70px;
        padding-right: 15px;
    }

    #chat > section.right {
        text-align:right;
        padding-right: 70px;
        padding-left: 15px;
    }

    #chat > section > .bubble {
        position:relative;
        background:#fafafa;
        text-align:left;
        white-space:pre-wrap;
        border:1px solid #222;
        border-radius:10px;
        padding:8px;
        display:inline-block;
    }

    #chat > section > .bubble > div.username {
        font-weight:bold;
        font-size:0.6em;
    }

    #chat > section > .bubble > div.timestamp {
        color:#888;
        font-size:0.6em;
    }

    #chat > section.right > .bubble > div.username,
    #chat > section.right > .bubble > div.timestamp {
        text-align:right;
    }

    #chat > section > div.avatar {
        position: absolute;
        top:-10px;
    }

    #chat > section.left > div.avatar {
        left:5px;
    }

    #chat > section.right > div.avatar {
        right:5px;
    }


    #chat > section > .bubble:after,
    #chat > section > .bubble:before {
        content: ' ';
        position:absolute;
        width: 0;
        height: 0;
        border-style: solid;
        z-index:5;
    }

    #chat > section.left > .bubble {
        border-top-left-radius: 0;
    }

    #chat > section.right > .bubble {
        border-top-right-radius: 0;
    }

    #chat > section.left > .bubble:after {
        top:0px;
        left:-10px;
        border-width: 0 10px 10px 0;
        border-color: transparent white transparent transparent;
    }

    #chat > section.left > .bubble:before {
        top:-1px;
        left:-12px;
        border-width: 0 12px 12px 0;
        border-color: transparent black transparent transparent;
    }

    #chat > section.right > .bubble:after {
        top:0px;
        right:-10px;
        border-width: 10px 10px 0 0;
        border-color: white transparent transparent;
    }

    #chat > section.right > .bubble:before {
        top:-1px;
        right:-12px;
        border-width: 12px 12px 0 0;
        border-color: black transparent transparent;
    }






    #chat span.icon {
        width:50px;
        height:50px;
        display:inline-block;
        position:absolute;
    }

    #chat span.chattext {
        text-align:left;
        background:white;
        border-radius:10px;
        padding:15px;
        display:inline-block;
        border:1px solid #222;
        position:relative;
    }

    #chat span.chattext h6 {
        margin:0;
        padding:0;
        font-size:18px;
    }
    #chat > div {
        position:relative;
        min-height:60px;
    }

    #chat > div.left {
        padding-left:60px;
    }

    #chat > div.right {
        padding-right:60px;
        text-align:right;
    }

    #chat > div.left > span.icon {
        left:5px;
    }

    #chat > div.right > span.icon {
        right:5px;
    }

    #chat > div.left > span.chattext {
        border-top-left-radius: 0;
        margin-left:20px;
        margin-top:10px;
    }


    #chat > div.right > span.chattext {
        border-top-right-radius: 0;
        margin-right:20px;
        margin-top:10px;
    }



    /* Speech Bubble triangle left */

    #chat > div.left > span.chattext:after {
        content: ' ';
        position:absolute;
        top:0px;
        left:-10px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 10px 10px 0;
        border-color: transparent white transparent transparent;
    }

    #chat > div.left > span.chattext:before {
        content: ' ';
        position:absolute;
        top:-1px;
        left:-12px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 12px 12px 0;
        border-color: transparent black transparent transparent;
    }


    /* Speech Bubble triangle right  */

    #chat > div.right > span.chattext:after {
        content: ' ';
        position:absolute;
        top:0px;
        right:-10px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 10px 10px 0 0;
        border-color: white transparent transparent;
    }

    #chat > div.right > span.chattext:before {
        content: ' ';
        position:absolute;
        top:-1px;
        right:-12px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 12px 12px 0 0;
        border-color: black transparent transparent;
    }



    #chat > div > span {
        display:inline-block;
        white-space: normal;
        vertical-align: top;
        margin:4px;
    }

    div.right {
        text-align:right;
    }

    pre {
        margin:0;
    }

    #textbox {
        position:absolute;
        bottom:0;
        left:0;
        right:0;
        height:80px;
        border-top:1px solid #555;        
    }

    #inputwrap {
        position:absolute;
        left:0;
        right:150px;
        bottom:0;
        height:80px;
    }

    #textbox > button {
        position:absolute;
        top:0;
        right:0;
        height:80px;
        width:150px;
    }

    #textbox textarea {
        position:absolute;  
        top:0;
        left:0;
        width:100%;
        height:80px;
        font-size:24px;
        box-sizing:border-box;
        border:1px solid transparent;
        background:#eee;
        resize:none;
        margin:0;
    }
    

    #textbox textarea:active {
        border:none;
    }

</style>