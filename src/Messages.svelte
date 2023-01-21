<script>

    import {messages, dm} from './lib/messages.js';

    let msg_to = '';
    let msg_txt = '';

    function send() {

        dm({to: msg_to, msg: msg_txt});
        msg_to = '';
        msg_txt = '';

    }

</script>

<code><pre>{JSON.stringify($messages,null,4)}</pre></code>

<input bind:value={msg_to}>
<textarea bind:value={msg_txt}></textarea>

