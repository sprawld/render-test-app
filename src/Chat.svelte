<script>

    import {onMount} from 'svelte';
    import {conversation, chat} from './lib/chat.js'
    import UserIcon from './UserIcon.svelte';

    let msg = '';
    let long_msg = false;
    let textarea;

    function postchat(evt) {
        if(evt) evt.preventDefault();
        chat(msg);
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

    onMount(() => {
        textarea.focus();
    })

</script>

<!-- <form>
    <input bind:value={msg} />
    <button on:click={postchat}>Send</button>
</form> -->

<code id="chat">
    {#each $conversation as {user, msg}}
        <div><span><strong>[{user}]</strong></span><span><pre>{msg}</pre></span></div>
    {/each}

</code>



<section id="textbox">
    <div id="inputwrap">
        <textarea bind:this={textarea} on:keydown={keydown} bind:value={msg}></textarea>
    </div>
    <button id="inputbutton" on:click={postchat}>Send</button>
</section>

<style>

    /* #chat > div {
        border-bottom:1px solid rgb(0,0,0,0.8);
        text-align:left;
    }

    #chat > div > span {
        display:inline-block;
        padding:10px;
        border-radius:10px;
        border:1px solid rgba(0,0,0,0.8);
        vertical-align:middle;
    } */

    #chat {
        position:fixed;
        top:50px;
        bottom:80px;
        left:0;
        width:100%;
        overflow:auto;
        font-size:28px;
    }

    #chat > div > span {
        display:inline-block;
        white-space: normal;
        vertical-align: top;
        margin:4px;
    }

    pre {
        margin:0;
    }

    #textbox {
        position:fixed;
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
        bottom:5px;
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
        width:100%;
        height:80px;
        font-size:24px;
        box-sizing:border-box;
        border:none;
        background:none;
        resize:none;
        margin:0;
    }

    #textbox textarea:active {
        border:none;
    }

</style>